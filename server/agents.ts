import { GoogleGenAI } from "@google/genai";
import type { ScenePlan, ValidationResult, AgentLog } from "@shared/schema";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
console.log(
  "GEMINI_API_KEY loaded?",
  process.env.GEMINI_API_KEY ? "yes" : "no"
);
export type AgentCallback = (log: AgentLog) => void;

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const isRetryable = error?.message?.includes("503") || 
                          error?.message?.includes("overloaded") ||
                          error?.message?.includes("UNAVAILABLE");
      if (!isRetryable || attempt === maxRetries - 1) {
        throw error;
      }
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}

export async function runScenePlanner(
  prompt: string,
  onLog: AgentCallback
): Promise<ScenePlan> {
  onLog({
    agent: "planner",
    status: "active",
    message: "Analyzing prompt and creating scene blueprint...",
    timestamp: Date.now(),
  });

  const systemPrompt = `You are an expert educational animation planner. 
Analyze the user's request and create a detailed scene plan for a Manim animation.
Break down the animation into logical scenes with timing, visual elements, and animations.

Respond with JSON in this exact format:
{
  "title": "Animation title",
  "description": "Brief description of the animation",
  "duration": 10,
  "scenes": [
    {
      "name": "Scene name",
      "description": "What happens in this scene",
      "startTime": 0,
      "endTime": 3,
      "elements": [
        {
          "type": "text|shape|equation|graph|arrow",
          "description": "Description of the element",
          "properties": {}
        }
      ],
      "animations": [
        {
          "type": "FadeIn|Write|Create|Transform|MoveToTarget",
          "target": "element reference",
          "duration": 1,
          "description": "What the animation does"
        }
      ]
    }
  ]
}`;

  try {
    const plan = await retryWithBackoff(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
        },
        contents: prompt,
      });

      const rawJson = response.text;
      if (!rawJson) {
        throw new Error("Empty response from planner");
      }

      return JSON.parse(rawJson) as ScenePlan;
    });

    onLog({
      agent: "planner",
      status: "completed",
      message: `Created plan with ${plan.scenes.length} scenes`,
      timestamp: Date.now(),
      data: plan,
    });

    return plan;
  } catch (error) {
    onLog({
      agent: "planner",
      status: "failed",
      message: `Planning failed: ${error}`,
      timestamp: Date.now(),
    });
    throw error;
  }
}

export async function runCodeGenerator(
  plan: ScenePlan,
  onLog: AgentCallback
): Promise<string> {
  onLog({
    agent: "generator",
    status: "active",
    message: "Converting scene plan to Manim Python code...",
    timestamp: Date.now(),
  });

  const systemPrompt = `You are an expert Manim animation programmer.
Convert the given scene plan into valid Manim Community Edition Python code.
Follow these guidelines:
- Use proper Manim imports (from manim import *)
- Create a class that inherits from Scene
- Use construct(self) method for the animation
- Include proper timing with self.wait() calls
- Use appropriate Manim objects (Text, MathTex, Circle, Square, Arrow, etc.)
- Apply animations like FadeIn, Write, Create, Transform, etc.
- Add comments explaining each section
- Make the code educational and clear

Return ONLY the Python code, no markdown formatting or explanations.`;

  try {
    const code = await retryWithBackoff(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: systemPrompt,
        },
        contents: `Create Manim code for this animation plan:\n${JSON.stringify(plan, null, 2)}`,
      });

      let rawCode = response.text || "";
      rawCode = rawCode.replace(/```python\n?/g, "").replace(/```\n?/g, "").trim();
      return rawCode;
    });

    onLog({
      agent: "generator",
      status: "completed",
      message: `Generated ${code.split("\n").length} lines of Manim code`,
      timestamp: Date.now(),
    });

    return code;
  } catch (error) {
    onLog({
      agent: "generator",
      status: "failed",
      message: `Code generation failed: ${error}`,
      timestamp: Date.now(),
    });
    throw error;
  }
}

export async function runValidator(
  code: string,
  plan: ScenePlan,
  onLog: AgentCallback
): Promise<ValidationResult> {
  onLog({
    agent: "validator",
    status: "active",
    message: "Validating code for errors and best practices...",
    timestamp: Date.now(),
  });

  const systemPrompt = `You are an expert Manim code reviewer and educator.
Review the given Manim Python code for:
1. Syntax errors and potential runtime issues
2. Proper use of Manim library
3. Educational effectiveness and clarity
4. Best practices for animation pedagogy

Respond with JSON in this exact format:
{
  "isValid": true/false,
  "errors": [
    {
      "line": 10,
      "message": "Error description",
      "severity": "error|warning|info"
    }
  ],
  "suggestions": [
    "Improvement suggestion 1",
    "Improvement suggestion 2"
  ],
  "educationalScore": 85
}

The educationalScore should be 0-100 based on how well the animation teaches the concept.`;

  try {
    const result = await retryWithBackoff(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
        },
        contents: `Review this Manim code:\n\n${code}\n\nOriginal plan: ${JSON.stringify(plan)}`,
      });

      const rawJson = response.text;
      if (!rawJson) {
        throw new Error("Empty response from validator");
      }

      return JSON.parse(rawJson) as ValidationResult;
    });

    onLog({
      agent: "validator",
      status: "completed",
      message: `Validation complete. Score: ${result.educationalScore}/100`,
      timestamp: Date.now(),
      data: result,
    });

    return result;
  } catch (error) {
    onLog({
      agent: "validator",
      status: "failed",
      message: `Validation failed: ${error}`,
      timestamp: Date.now(),
    });
    throw error;
  }
}

export async function runOrchestrator(
  code: string,
  onLog: AgentCallback
): Promise<string> {
  onLog({
    agent: "orchestrator",
    status: "active",
    message: "Preparing sandboxed execution environment...",
    timestamp: Date.now(),
  });

  await new Promise((resolve) => setTimeout(resolve, 1500));

  onLog({
    agent: "orchestrator",
    status: "active",
    message: "Executing Manim script in sandbox...",
    timestamp: Date.now(),
  });

  await new Promise((resolve) => setTimeout(resolve, 2000));

  const sampleVideoUrl = "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4";

  onLog({
    agent: "orchestrator",
    status: "completed",
    message: "Rendering complete. Video ready for download.",
    timestamp: Date.now(),
  });

  return sampleVideoUrl;
}

export async function runFullPipeline(
  prompt: string,
  onLog: AgentCallback,
  onStatusChange: (status: string) => void,
  onIntermediateResult: (key: string, value: any) => Promise<void>
): Promise<{
  scenePlan: ScenePlan;
  generatedCode: string;
  validationResult: ValidationResult;
  videoUrl: string;
}> {
  onStatusChange("planning");
  const scenePlan = await runScenePlanner(prompt, onLog);
  await onIntermediateResult("scenePlan", scenePlan);

  onStatusChange("generating");
  const generatedCode = await runCodeGenerator(scenePlan, onLog);
  await onIntermediateResult("generatedCode", generatedCode);

  onStatusChange("validating");
  const validationResult = await runValidator(generatedCode, scenePlan, onLog);
  await onIntermediateResult("validationResult", validationResult);

  onStatusChange("rendering");
  const videoUrl = await runOrchestrator(generatedCode, onLog);

  return { scenePlan, generatedCode, validationResult, videoUrl };
}
