import { DataSource } from 'typeorm';
import { Prompt } from './entities/Prompt';
import { PromptVersion } from './entities/PromptVersion';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'your_password',
  database: process.env.DB_DATABASE || 'promptstudio',
  synchronize: true, // Set to false in production
  logging: true,
  entities: [Prompt, PromptVersion],
  migrations: [],
  subscribers: [],
});

