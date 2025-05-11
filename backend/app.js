import express from 'express';
import dotenv from 'dotenv';
import promptsRouter from './routes/prompts.js';
import mockUser from './middleware/mockUser.js';
import metricsRouter from './routes/metrics';
import { AppDataSource } from './data-source';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(mockUser);

// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    console.log('Database connection established');
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
  });

app.use('/prompts', promptsRouter);
app.use('/api/metrics', metricsRouter);

app.get('/', (req, res) => {
  res.send('PromptStudio API is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
