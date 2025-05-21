import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getPrompts, getPromptById, createPrompt, updatePrompt, deletePrompt, testPrompt } from '../services/redisjson.js';

const router = express.Router();

// List prompts (optionally filter by appId/appName)
router.get('/', async (req, res) => {
  const { appId, appName } = req.query;
  const prompts = await getPrompts({ appId, appName, user: req.user });
  res.json(prompts);
});

// List public prompts
router.get('/public', async (req, res) => {
  const prompts = await getPrompts({ isPublic: true });
  res.json(prompts);
});

// Get prompt by ID (with versions)
router.get('/:promptId', async (req, res) => {
  const prompt = await getPromptById(req.params.promptId);
  if (!prompt) return res.status(404).json({ error: 'Prompt not found' });
  res.json(prompt);
});

// Create new prompt
router.post('/', async (req, res) => {
  const prompt = await createPrompt(req.body, req.user);
  res.status(201).json(prompt);
});

// Edit latest version (creates new version)
router.put('/:promptId', async (req, res) => {
  const prompt = await updatePrompt(req.params.promptId, req.body, req.user);
  res.json(prompt);
});

// Soft delete prompt
router.delete('/:promptId', async (req, res) => {
  await deletePrompt(req.params.promptId, req.user);
  res.status(204).send();
});

// Test prompt (calls OpenAI)
router.post('/:promptId/test', async (req, res) => {
  const { context, testData } = req.body;
  const result = await testPrompt(req.params.promptId, context, testData, req.user);
  res.json(result);
});

export default router;
