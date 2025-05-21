import { createClient } from 'redis';
import { v4 as uuidv4 } from 'uuid';

const redis = createClient({ url: 'redis://localhost:6379' });
await redis.connect();

const PREFIX = 'promptstudio:prompt:';

const fakePrompts = [
  {
    appId: 'app-1',
    appName: 'Text Summarizer',
    ownerId: 'user-123',
    editors: ['promptstudio-admins'],
    isPublic: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deleteFlag: false,
    versions: [
      {
        versionId: uuidv4(),
        content: 'Summarize the following text in one paragraph: {{input}}',
        createdAt: new Date().toISOString(),
        createdBy: 'user-123',
        context: 'Academic writing',
        testData: 'The quick brown fox jumps over the lazy dog.'
      }
    ]
  },
  {
    appId: 'app-2',
    appName: 'Greeting Generator',
    ownerId: 'user-456',
    editors: ['promptstudio-admins'],
    isPublic: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deleteFlag: false,
    versions: [
      {
        versionId: uuidv4(),
        content: 'Generate a friendly greeting for a user named {{name}}.',
        createdAt: new Date().toISOString(),
        createdBy: 'user-456',
        context: '',
        testData: 'name: Alice'
      },
      {
        versionId: uuidv4(),
        content: 'Generate a formal greeting for a user named {{name}}.',
        createdAt: new Date().toISOString(),
        createdBy: 'user-456',
        context: '',
        testData: 'name: Bob'
      }
    ]
  },
  {
    appId: 'app-3',
    appName: 'Storyteller',
    ownerId: 'user-789',
    editors: ['promptstudio-admins'],
    isPublic: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deleteFlag: false,
    versions: [
      {
        versionId: uuidv4(),
        content: 'Write a short story about a robot and a cat.',
        createdAt: new Date().toISOString(),
        createdBy: 'user-789',
        context: 'For children aged 7-10',
        testData: ''
      }
    ]
  }
];

for (const prompt of fakePrompts) {
  const key = `${PREFIX}${uuidv4()}`;
  await redis.json.set(key, '$', prompt);
  console.log(`Inserted prompt: ${prompt.appName}`);
}

await redis.quit();
console.log('Done seeding fake prompts!');
