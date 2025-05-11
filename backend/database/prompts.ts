import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { PromptVersion } from './PromptVersion';

@Entity()
export class Prompt {
  @PrimaryGeneratedColumn('uuid')
  promptId: string;

  @Column()
  appId: string;

  @Column()
  appName: string;

  @Column()
  ownerId: string;

  @Column('simple-array')
  editors: string[];

  @Column({ default: false })
  isPublic: boolean;

  @Column({ default: false })
  deleteFlag: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => PromptVersion, version => version.prompt, {
    cascade: true,
    eager: true
  })
  versions: PromptVersion[];
}
