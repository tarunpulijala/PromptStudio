import { AppDataSource } from '../data-source';
import { Prompt } from '../entities/Prompt';
import { PromptVersion } from '../entities/PromptVersion';
import { v4 as uuidv4 } from 'uuid';

const promptRepository = AppDataSource.getRepository(Prompt);
const versionRepository = AppDataSource.getRepository(PromptVersion);

// Helper: Check if user is allowed to access a prompt
function canAccessPrompt(prompt: Prompt, user: any): boolean {
  if (prompt.isPublic) return true;
  if (prompt.ownerId === user.userId) return true;
  if (prompt.editors && prompt.editors.includes(user.userId)) return true;
  if (user.adGroup && prompt.editors && prompt.editors.includes(user.adGroup)) return true;
  return false;
}

// List prompts (optionally filter by appId/appName/isPublic)
export async function getPrompts({ appId, appName, isPublic, user }) {
  const queryBuilder = promptRepository.createQueryBuilder('prompt')
    .leftJoinAndSelect('prompt.versions', 'version')
    .where('prompt.deleteFlag = :deleteFlag', { deleteFlag: false });

  if (isPublic !== undefined) {
    queryBuilder.andWhere('prompt.isPublic = :isPublic', { isPublic });
  }
  if (appId) {
    queryBuilder.andWhere('prompt.appId = :appId', { appId });
  }
  if (appName) {
    queryBuilder.andWhere('prompt.appName = :appName', { appName });
  }

  const prompts = await queryBuilder.getMany();

  // Filter by user access if not public
  const filteredPrompts = prompts.filter(p => isPublic === undefined ? canAccessPrompt(p, user) : true);

  return filteredPrompts.map(p => ({
    ...p,
    latestVersion: p.versions[p.versions.length - 1],
    versions: undefined
  }));
}

// Get prompt by ID (with all versions)
export async function getPromptById(promptId: string) {
  return await promptRepository.findOne({
    where: { promptId },
    relations: ['versions']
  });
}

// Create new prompt (with first version)
export async function createPrompt(data: any, user: any) {
  const prompt = new Prompt();
  prompt.promptId = uuidv4();
  prompt.appId = data.appId;
  prompt.appName = data.appName;
  prompt.ownerId = user.userId;
  prompt.editors = [user.adGroup];
  prompt.isPublic = !!data.isPublic;

  const version = new PromptVersion();
  version.versionId = uuidv4();
  version.content = data.content;
  version.context = data.context || '';
  version.testData = data.testData || '';
  version.createdBy = user.userId;
  version.prompt = prompt;

  prompt.versions = [version];

  await promptRepository.save(prompt);
  return prompt;
}

// Update prompt (add new version)
export async function updatePrompt(promptId: string, data: any, user: any) {
  const prompt = await getPromptById(promptId);
  if (!prompt) throw new Error('Prompt not found');
  if (!canAccessPrompt(prompt, user)) throw new Error('Not authorized');

  const version = new PromptVersion();
  version.versionId = uuidv4();
  version.content = data.content;
  version.context = data.context || '';
  version.testData = data.testData || '';
  version.createdBy = user.userId;
  version.prompt = prompt;

  prompt.versions.push(version);
  await promptRepository.save(prompt);

  return { ...prompt, latestVersion: version };
}

// Soft delete prompt
export async function deletePrompt(promptId: string, user: any) {
  const prompt = await getPromptById(promptId);
  if (!prompt) throw new Error('Prompt not found');
  if (!canAccessPrompt(prompt, user)) throw new Error('Not authorized');

  prompt.deleteFlag = true;
  await promptRepository.save(prompt);
}

// Test prompt (calls OpenAI)
export async function testPrompt(promptId: string, context: string, testData: string, user: any) {
  const prompt = await getPromptById(promptId);
  if (!prompt) throw new Error('Prompt not found');
  if (!canAccessPrompt(prompt, user)) throw new Error('Not authorized');

  const latest = prompt.versions[prompt.versions.length - 1];
  let fullPrompt = latest.content;
  if (context) fullPrompt += `\nContext: ${context}`;
  if (testData) fullPrompt += `\nTest Data: ${testData}`;

  //const result = await callOpenAI(fullPrompt);
  return "test openAI prompt";
} 