import OpenAI from "openai";
import type { StoryPlanOutput, PromptProvider } from "@/types";

interface PlannerInput {
  characterName: string;
  personality: string;
  missionPrompt: string;
  previousStories: Array<{
    location: string;
    theme: string;
    caption: string;
    date: Date;
  }>;
  currentDate: Date;
}

interface ProviderConfig {
  provider: PromptProvider;
  apiKey: string;
  model?: string;
}

export class StoryPlannerService {
  private client: OpenAI | null = null;
  private provider: PromptProvider;
  private model: string;
  private apiKey: string;

  constructor(config: ProviderConfig) {
    this.provider = config.provider;
    this.model = config.model || "gpt-4o-mini";
    this.apiKey = config.apiKey;

    if (config.provider === "openai") {
      this.client = new OpenAI({ apiKey: config.apiKey });
    } else if (config.provider === "openrouter") {
      this.client = new OpenAI({
        apiKey: config.apiKey,
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          "X-Title": "StoryPilot AI",
        },
      });
    }
  }

  async generateStoryPlan(input: PlannerInput): Promise<StoryPlanOutput> {
    if (!this.client || !this.apiKey) {
      throw new Error(
        `API key not configured for ${this.provider}. Go to Settings to set up your prompt provider.`
      );
    }

    const previousContext = input.previousStories
      .map(
        (s, i) =>
          `Day ${i + 1} (${s.date.toISOString().split("T")[0]}): Location: ${s.location}, Theme: ${s.theme}`
      )
      .join("\n");

    const prompt = `You are an AI story planner for an Instagram influencer character.

Character Profile:
- Name: ${input.characterName}
- Personality: ${input.personality}
- Mission: ${input.missionPrompt}

Previous Stories (last 30):
${previousContext || "No previous stories. This is the first story."}

Current Date: ${input.currentDate.toISOString().split("T")[0]}

Your task is to plan the next Instagram story. Maintain narrative continuity and avoid repeating locations or themes from the recent past.

Respond in JSON format:
{
  "location": "The specific city/location for this story",
  "theme": "The theme or activity (e.g., exploring local cuisine, visiting landmarks)",
  "caption": "A natural, human-sounding Instagram story caption (1-2 sentences, conversational tone, no hashtags)",
  "imagePrompt": "A detailed image generation prompt including character identity, location, camera style, lighting, and mood. Portrait orientation, Instagram story format (9:16). High quality photography."
}

Rules:
- Location must be a real, specific place
- Caption must sound like a real person wrote it - no AI buzzwords
- Avoid repeating the same city or similar themes within 14 days
- Image prompt should be detailed for AI image generation
- Maintain narrative continuity with the mission prompt`;

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: "You are a creative Instagram story planner. Always respond with valid JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    const completionParams: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming = {
      model: this.model,
      messages,
      temperature: 0.8,
    };

    if (this.provider === "openai") {
      completionParams.response_format = { type: "json_object" };
    }

    let response;
    try {
      response = await this.client!.chat.completions.create(completionParams);
    } catch (err) {
      throw new Error(
        `${this.provider} API error: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Failed to generate story plan");
    }

    const cleaned = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const plan = JSON.parse(cleaned) as StoryPlanOutput;
    return plan;
  }

  async generateCaption(
    characterName: string,
    personality: string,
    location: string,
    theme: string
  ): Promise<string> {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content:
          "You are an Instagram caption writer. Write short, natural, human-sounding captions. Never use AI buzzwords like 'embark', 'delve', 'captivating', or 'enchanting'. Write like a real person posting on social media.",
      },
      {
        role: "user",
        content: `Write a short Instagram story caption for ${characterName}, who has personality: ${personality}. Currently in ${location} doing: ${theme}. Caption should be 1-2 sentences, conversational, matching the character's voice.`,
      },
    ];

    let response;
    try {
      response = await this.client!.chat.completions.create({
        model: this.model,
        messages,
        temperature: 0.7,
        max_tokens: 100,
      });
    } catch (err) {
      throw new Error(
        `Caption generation ${this.provider} API error: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }

    return response.choices[0]?.message?.content?.trim() || "";
  }
}
