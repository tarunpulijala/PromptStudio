import { Router } from 'express';
import { getRepository } from 'typeorm';
import { Prompt } from '../entities/Prompt';

const router = Router();

router.get('/', async (req, res) => {
  const promptRepo = getRepository(Prompt);

  const totalPrompts = await promptRepo.count();
  const publicPrompts = await promptRepo.count({ where: { isPublic: true } });
  // Add more metrics as needed

  res.json({
    totalPrompts,
    publicPrompts,
    // Add more metrics here
  });
});

export default router;
