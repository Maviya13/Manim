import { randomUUID } from "crypto";
import type { 
  User, 
  InsertUser, 
  AnimationJob, 
  InsertAnimationJob,
  AgentLog,
  ScenePlan,
  ValidationResult
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createJob(job: InsertAnimationJob): Promise<AnimationJob>;
  getJob(id: string): Promise<AnimationJob | undefined>;
  getAllJobs(): Promise<AnimationJob[]>;
  updateJob(id: string, updates: Partial<AnimationJob>): Promise<AnimationJob | undefined>;
  deleteJob(id: string): Promise<boolean>;
  addJobLog(id: string, log: AgentLog): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private jobs: Map<string, AnimationJob>;

  constructor() {
    this.users = new Map();
    this.jobs = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createJob(insertJob: InsertAnimationJob): Promise<AnimationJob> {
    const id = randomUUID();
    const now = new Date();
    const job: AnimationJob = {
      id,
      prompt: insertJob.prompt,
      status: "queued",
      scenePlan: null,
      generatedCode: null,
      validationResult: null,
      videoUrl: null,
      errorMessage: null,
      agentLogs: [],
      createdAt: now,
      completedAt: null,
    };
    this.jobs.set(id, job);
    return job;
  }

  async getJob(id: string): Promise<AnimationJob | undefined> {
    return this.jobs.get(id);
  }

  async getAllJobs(): Promise<AnimationJob[]> {
    return Array.from(this.jobs.values());
  }

  async updateJob(id: string, updates: Partial<AnimationJob>): Promise<AnimationJob | undefined> {
    const job = this.jobs.get(id);
    if (!job) return undefined;
    
    const updatedJob = { ...job, ...updates };
    this.jobs.set(id, updatedJob);
    return updatedJob;
  }

  async deleteJob(id: string): Promise<boolean> {
    return this.jobs.delete(id);
  }

  async addJobLog(id: string, log: AgentLog): Promise<void> {
    const job = this.jobs.get(id);
    if (!job) return;
    
    const logs = (job.agentLogs as AgentLog[]) || [];
    logs.push(log);
    job.agentLogs = logs;
    this.jobs.set(id, job);
  }
}

export const storage = new MemStorage();
