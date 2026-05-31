import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const characterSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  personality: z.string().min(1, "Personality is required").max(2000),
  missionPrompt: z.string().min(1, "Mission prompt is required").max(5000),
  storiesPerDay: z.number().int().min(1).max(10).default(2),
  faceReferenceUrl: z.string().optional().default(""),
  autoPublish: z.boolean().default(false),
  publishTime: z.string().optional(),
});

export const settingsSchema = z.object({
  prompt_provider: z.enum(["openai", "openrouter"]).default("openai"),
  openai_api_key: z.string().optional(),
  openrouter_api_key: z.string().optional(),
  openrouter_model: z.string().default("openai/gpt-4o-mini"),
  image_provider: z.enum(["openai", "huggingface"]).default("openai"),
  image_provider_api_key: z.string().optional(),
  buffer_access_token: z.string().optional(),
});
