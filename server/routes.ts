import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createJobRequestSchema, type AgentLog } from "@shared/schema";
import { runFullPipeline } from "./agents";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/jobs", async (req, res) => {
    try {
      const parsed = createJobRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ 
          error: "Invalid request", 
          details: parsed.error.errors 
        });
      }

      const job = await storage.createJob({ prompt: parsed.data.prompt });

      runFullPipeline(
        parsed.data.prompt,
        async (log: AgentLog) => {
          await storage.addJobLog(job.id, log);
        },
        async (status: string) => {
          await storage.updateJob(job.id, { status });
        },
        async (key: string, value: any) => {
          await storage.updateJob(job.id, { [key]: value });
        }
      ).then(async (result) => {
        await storage.updateJob(job.id, {
          status: "completed",
          scenePlan: result.scenePlan,
          generatedCode: result.generatedCode,
          validationResult: result.validationResult,
          videoUrl: result.videoUrl,
          completedAt: new Date(),
        });
      }).catch(async (error) => {
        await storage.updateJob(job.id, {
          status: "failed",
          errorMessage: error instanceof Error ? error.message : "Unknown error",
          completedAt: new Date(),
        });
      });

      const createdJob = await storage.getJob(job.id);
      return res.status(201).json(formatJobResponse(createdJob!));
    } catch (error) {
      console.error("Error creating job:", error);
      return res.status(500).json({ error: "Failed to create job" });
    }
  });

  app.get("/api/jobs", async (req, res) => {
    try {
      const jobs = await storage.getAllJobs();
      return res.json(jobs.map(formatJobResponse));
    } catch (error) {
      console.error("Error fetching jobs:", error);
      return res.status(500).json({ error: "Failed to fetch jobs" });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const job = await storage.getJob(req.params.id);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      return res.json(formatJobResponse(job));
    } catch (error) {
      console.error("Error fetching job:", error);
      return res.status(500).json({ error: "Failed to fetch job" });
    }
  });

  app.delete("/api/jobs/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteJob(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Job not found" });
      }
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting job:", error);
      return res.status(500).json({ error: "Failed to delete job" });
    }
  });

  return httpServer;
}

function formatJobResponse(job: any) {
  return {
    id: job.id,
    prompt: job.prompt,
    status: job.status,
    scenePlan: job.scenePlan || null,
    generatedCode: job.generatedCode || null,
    validationResult: job.validationResult || null,
    videoUrl: job.videoUrl || null,
    errorMessage: job.errorMessage || null,
    agentLogs: job.agentLogs || [],
    createdAt: job.createdAt?.toISOString() || null,
    completedAt: job.completedAt?.toISOString() || null,
  };
}
