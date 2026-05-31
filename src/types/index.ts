export interface SessionData {
  userId: string;
  email: string;
}

export interface CharacterFormData {
  name: string;
  personality: string;
  missionPrompt: string;
  storiesPerDay: number;
  faceReferenceUrl?: string;
  autoPublish: boolean;
  publishTime?: string;
}

export interface StoryPlanOutput {
  location: string;
  theme: string;
  caption: string;
  imagePrompt: string;
}

export interface DashboardStats {
  activeCharacters: number;
  storiesGenerated: number;
  storiesPublished: number;
  scheduledStories: number;
}

export interface QueueJob {
  id: string;
  characterId: string;
  characterName: string;
  type: string;
  status: string;
  scheduledAt: string;
  createdAt: string;
}

export type PromptProvider = "openai" | "openrouter";
export type ImageProvider = "openai" | "huggingface" | "pollinations";

export type CharacterStatus = "active" | "paused" | "archived";

export type StoryStatus = "planned" | "generating" | "generated" | "publishing" | "published" | "failed";

export type JobStatus = "waiting" | "active" | "completed" | "failed" | "delayed" | "cancelled";
