import { createClient } from 'redis';
import { v4 as uuidv4 } from 'uuid';
//import { callOpenAI } from './openai.js';

const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});
await redis.connect();

const PREFIX = 'promptstudio:prompt:';

// Helper: Check if user is allowed to access a prompt
function canAccessPrompt(prompt, user) {
  if (prompt.isPublic) return true;
  if (prompt.ownerId === user.userId) return true;
  if (prompt.editors && prompt.editors.includes(user.userId)) return true;
  if (user.adGroup && prompt.editors && prompt.editors.includes(user.adGroup)) return true;
  return false;
}

// List prompts (optionally filter by appId/appName/isPublic)
export async function getPrompts({ appId, appName, isPublic, user }) {
  // Get all keys
  const keys = await redis.keys(`${PREFIX}*`);
  const prompts = [];
  for (const key of keys) {
    const prompt = await redis.json.get(key, '$');
    if (!prompt || !prompt[0]) continue;
    const p = prompt[0];
    if (p.deleteFlag) continue;
    if (isPublic !== undefined && p.isPublic !== isPublic) continue;
    if (appId && p.appId !== appId) continue;
    if (appName && p.appName !== appName) continue;
    if (isPublic === undefined && user && !canAccessPrompt(p, user)) continue;
    prompts.push({
      ...p,
      latestVersion: p.versions[p.versions.length - 1],
      versions: undefined
    });
  }
  return prompts;
}

// Get prompt by ID (with all versions)
export async function getPromptById(promptId) {
  const prompt = await redis.json.get(`${PREFIX}${promptId}`, '$');
  return prompt ? prompt[0] : null;
}

// Create new prompt (with first version)
export async function createPrompt(data, user) {
  const now = new Date().toISOString();
  const promptId = uuidv4();
  const versionId = uuidv4();

  const item = {
    promptId,
    appId: data.appId,
    appName: data.appName,
    ownerId: user.userId,
    editors: [user.adGroup],
    isPublic: !!data.isPublic,
    createdAt: now,
    updatedAt: now,
    deleteFlag: false,
    versions: [
      {
        versionId,
        content: data.content,
        createdAt: now,
        createdBy: user.userId,
        context: data.context || '',
        testData: data.testData || ''
      }
    ]
  };

  await redis.json.set(`${PREFIX}${promptId}`, '$', item);
  return item;
}

// Update prompt (add new version)
export async function updatePrompt(promptId, data, user) {
  const key = `${PREFIX}${promptId}`;
  const prompt = await getPromptById(promptId);
  if (!prompt) throw new Error('Prompt not found');
  if (!canAccessPrompt(prompt, user)) throw new Error('Not authorized');

  const now = new Date().toISOString();
  const versionId = uuidv4();

  const newVersion = {
    versionId,
    content: data.content,
    createdAt: now,
    createdBy: user.userId,
    context: data.context || '',
    testData: data.testData || ''
  };

  prompt.versions.push(newVersion);
  prompt.updatedAt = now;

  await redis.json.set(key, '$', prompt);
  return { ...prompt, latestVersion: newVersion };
}

// Soft delete prompt
export async function deletePrompt(promptId, user) {
  const key = `${PREFIX}${promptId}`;
  const prompt = await getPromptById(promptId);
  if (!prompt) throw new Error('Prompt not found');
  if (!canAccessPrompt(prompt, user)) throw new Error('Not authorized');

  prompt.deleteFlag = true;
  await redis.json.set(key, '$', prompt);
}

// Test prompt (calls OpenAI)
export async function testPrompt(promptId, context, testData, user) {
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
