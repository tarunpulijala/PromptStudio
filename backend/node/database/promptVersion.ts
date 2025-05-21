import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Prompt } from './Prompt';

@Entity()
export class PromptVersion {
  @PrimaryGeneratedColumn('uuid')
  versionId: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  context: string;

  @Column({ nullable: true })
  testData: string;

  @Column()
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Prompt, prompt => prompt.versions)
  @JoinColumn({ name: 'promptId' })
  prompt: Prompt;
}
