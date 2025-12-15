import { pgTable, text, varchar, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Animation job statuses
export const JobStatus = {
  QUEUED: "queued",
  PLANNING: "planning",
  GENERATING: "generating",
  VALIDATING: "validating",
  RENDERING: "rendering",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

export type JobStatusType = typeof JobStatus[keyof typeof JobStatus];

// Scene plan structure from planning agent
export const scenePlanSchema = z.object({
  title: z.string(),
  description: z.string(),
  duration: z.number(),
  scenes: z.array(z.object({
    name: z.string(),
    description: z.string(),
    startTime: z.number(),
    endTime: z.number(),
    elements: z.array(z.object({
      type: z.string(),
      description: z.string(),
      properties: z.record(z.any()).optional(),
    })),
    animations: z.array(z.object({
      type: z.string(),
      target: z.string(),
      duration: z.number(),
      description: z.string(),
    })),
  })),
});

export type ScenePlan = z.infer<typeof scenePlanSchema>;

// Validation result from validation agent
export const validationResultSchema = z.object({
  isValid: z.boolean(),
  errors: z.array(z.object({
    line: z.number().optional(),
    message: z.string(),
    severity: z.enum(["error", "warning", "info"]),
  })),
  suggestions: z.array(z.string()),
  educationalScore: z.number().min(0).max(100),
});

export type ValidationResult = z.infer<typeof validationResultSchema>;

// Agent log entry for pipeline visualization
export const agentLogSchema = z.object({
  agent: z.enum(["planner", "generator", "validator", "orchestrator"]),
  status: z.enum(["waiting", "active", "completed", "failed"]),
  message: z.string(),
  timestamp: z.number(),
  data: z.any().optional(),
});

export type AgentLog = z.infer<typeof agentLogSchema>;

// Users table (for future persistence)
export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Animation jobs table
export const animationJobs = pgTable("animation_jobs", {
  id: varchar("id", { length: 36 }).primaryKey(),
  prompt: text("prompt").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("queued"),
  scenePlan: jsonb("scene_plan"),
  generatedCode: text("generated_code"),
  validationResult: jsonb("validation_result"),
  videoUrl: text("video_url"),
  errorMessage: text("error_message"),
  agentLogs: jsonb("agent_logs").default([]),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertAnimationJobSchema = createInsertSchema(animationJobs).pick({
  prompt: true,
});

export type InsertAnimationJob = z.infer<typeof insertAnimationJobSchema>;
export type AnimationJob = typeof animationJobs.$inferSelect;

// Template for pre-built animation patterns
export const templateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.enum(["mathematics", "physics", "chemistry", "biology", "computer_science", "general"]),
  promptTemplate: z.string(),
  previewImageUrl: z.string().optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
});

export type Template = z.infer<typeof templateSchema>;

// API request/response types
export const createJobRequestSchema = z.object({
  prompt: z.string().min(10, "Prompt must be at least 10 characters"),
});

export type CreateJobRequest = z.infer<typeof createJobRequestSchema>;

export const jobResponseSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  status: z.string(),
  scenePlan: scenePlanSchema.nullable(),
  generatedCode: z.string().nullable(),
  validationResult: validationResultSchema.nullable(),
  videoUrl: z.string().nullable(),
  errorMessage: z.string().nullable(),
  agentLogs: z.array(agentLogSchema),
  createdAt: z.string().nullable(),
  completedAt: z.string().nullable(),
});

export type JobResponse = z.infer<typeof jobResponseSchema>;
