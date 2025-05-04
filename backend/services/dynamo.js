import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION });
const TABLE = process.env.DYNAMODB_TABLE;

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
  let filterExpression = [];
  let expressionAttributeValues = {};

  if (appId) {
    filterExpression.push('appId = :appId');
    expressionAttributeValues[':appId'] = appId;
  }
  if (appName) {
    filterExpression.push('appName = :appName');
    expressionAttributeValues[':appName'] = appName;
  }
  if (isPublic !== undefined) {
    filterExpression.push('isPublic = :isPublic');
    expressionAttributeValues[':isPublic'] = isPublic;
  }

  // Only show prompts user can access
  // For "my prompts", filter by ownerId or AD group
  if (user && !isPublic) {
    filterExpression.push('(ownerId = :userId OR contains(editors, :userId) OR contains(editors, :adGroup))');
    expressionAttributeValues[':userId'] = user.userId;
    expressionAttributeValues[':adGroup'] = user.adGroup;
  }

  const params = {
    TableName: TABLE,
    FilterExpression: filterExpression.length ? filterExpression.join(' AND ') : undefined,
    ExpressionAttributeValues: Object.keys(expressionAttributeValues).length ? expressionAttributeValues : undefined,
  };

  const result = await dynamoDb.scan(params).promise();
  // Only return latest version for each prompt
  return result.Items.map(item => ({
    ...item,
    latestVersion: item.versions[item.versions.length - 1],
    versions: undefined // Hide full version list in list view
  }));
}

// Get prompt by ID (with all versions)
export async function getPromptById(promptId) {
  const params = {
    TableName: TABLE,
    Key: { promptId }
  };
  const result = await dynamoDb.get(params).promise();
  return result.Item;
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
    editors: [user.adGroup], // All AD group members are editors/admins
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

  const params = {
    TableName: TABLE,
    Item: item
  };
  await dynamoDb.put(params).promise();
  return item;
}

// Update prompt (add new version)
export async function updatePrompt(promptId, data, user) {
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

  const params = {
    TableName: TABLE,
    Key: { promptId },
    UpdateExpression: 'set versions = :versions, updatedAt = :updatedAt',
    ExpressionAttributeValues: {
      ':versions': prompt.versions,
      ':updatedAt': now
    }
  };
  await dynamoDb.update(params).promise();
  return { ...prompt, latestVersion: newVersion };
}

// Soft delete prompt
export async function deletePrompt(promptId, user) {
  const prompt = await getPromptById(promptId);
  if (!prompt) throw new Error('Prompt not found');
  if (!canAccessPrompt(prompt, user)) throw new Error('Not authorized');

  const params = {
    TableName: TABLE,
    Key: { promptId },
    UpdateExpression: 'set deleteFlag = :deleteFlag',
    ExpressionAttributeValues: {
      ':deleteFlag': true
    }
  };
  await dynamoDb.update(params).promise();
}

// Test prompt (calls OpenAI)
import { callOpenAI } from './openai.js';

export async function testPrompt(promptId, context, testData, user) {
  const prompt = await getPromptById(promptId);
  if (!prompt) throw new Error('Prompt not found');
  if (!canAccessPrompt(prompt, user)) throw new Error('Not authorized');

  const latest = prompt.versions[prompt.versions.length - 1];
  // Combine prompt, context, and testData
  let fullPrompt = latest.content;
  if (context) fullPrompt += `\nContext: ${context}`;
  if (testData) fullPrompt += `\nTest Data: ${testData}`;

  const result = await callOpenAI(fullPrompt);
  return { result };
}
