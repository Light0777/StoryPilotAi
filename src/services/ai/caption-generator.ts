import { StoryPlannerService } from "./story-planner";
import type { PromptProvider } from "@/types";

export class CaptionGeneratorService {
  private planner: StoryPlannerService;

  constructor(config: { provider: PromptProvider; apiKey: string; model?: string }) {
    this.planner = new StoryPlannerService(config);
  }

  async generateCaption(
    characterName: string,
    personality: string,
    location: string,
    theme: string
  ): Promise<string> {
    return this.planner.generateCaption(characterName, personality, location, theme);
  }
}
