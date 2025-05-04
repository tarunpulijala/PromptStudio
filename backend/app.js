import express from 'express';
import dotenv from 'dotenv';
import promptsRouter from './routes/prompts.js';
import mockUser from './middleware/mockUser.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(mockUser);

app.use('/prompts', promptsRouter);

app.get('/', (req, res) => {
  res.send('PromptStudio API is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
