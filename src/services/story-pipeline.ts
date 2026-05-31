import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/r2";
import { addPublishingJob } from "@/lib/queue";
import { createBufferPost } from "@/lib/buffer";
import { decrypt } from "@/lib/encryption";
import { StoryPlannerService } from "./ai/story-planner";
import { ImageGeneratorService } from "./ai/image-generator";
import type { PromptProvider, ImageProvider } from "@/types";
import { v4 as uuidv4 } from "uuid";

interface PipelineConfig {
  promptProvider: PromptProvider;
  promptApiKey: string;
  promptModel?: string;
  imageProvider: ImageProvider;
  imageApiKey: string;
}

export class StoryPipelineService {
  private planner: StoryPlannerService;
  private imageGenerator: ImageGeneratorService;

  constructor(config: PipelineConfig) {
    this.planner = new StoryPlannerService({
      provider: config.promptProvider,
      apiKey: config.promptApiKey,
      model: config.promptModel,
    });
    this.imageGenerator = new ImageGeneratorService({
      provider: config.imageProvider,
      apiKey: config.imageApiKey,
    });
  }

  async generateStory(characterId: string, planId?: string) {
    const character = await prisma.character.findUnique({
      where: { id: characterId },
      include: {
        storyPlans: {
          orderBy: { date: "desc" },
          take: 30,
        },
        generatedStories: {
          orderBy: { createdAt: "desc" },
          take: 30,
        },
      },
    });

    if (!character || character.status !== "active") {
      throw new Error("Character not found or not active");
    }

    const previousStories = character.generatedStories.map((s) => ({
      location: "",
      theme: "",
      caption: s.caption,
      date: s.createdAt,
    }));

    const storyPlan = await this.planner.generateStoryPlan({
      characterName: character.name,
      personality: character.personality,
      missionPrompt: character.missionPrompt,
      previousStories,
      currentDate: new Date(),
    });

    let storyPlanRecord;
    if (planId) {
      storyPlanRecord = await prisma.storyPlan.update({
        where: { id: planId },
        data: {
          location: storyPlan.location,
          theme: storyPlan.theme,
          caption: storyPlan.caption,
          status: "planned",
        },
      });
    } else {
      storyPlanRecord = await prisma.storyPlan.create({
        data: {
          characterId: character.id,
          date: new Date(),
          location: storyPlan.location,
          theme: storyPlan.theme,
          caption: storyPlan.caption,
          status: "planned",
        },
      });
    }

    const result = await this.imageGenerator.generateImage({
      imagePrompt: storyPlan.imagePrompt,
      faceReferenceUrl: character.faceReferenceUrl,
    });

    let imageUrl: string;
    if (result.publicUrl) {
      imageUrl = result.publicUrl;
      const imageKey = `stories/${character.id}/${uuidv4()}.png`;
      await uploadFile(imageKey, result.buffer, "image/png").catch(() => {});
    } else {
      const imageKey = `stories/${character.id}/${uuidv4()}.png`;
      imageUrl = await uploadFile(imageKey, result.buffer, "image/png");
    }

    const generatedStory = await prisma.generatedStory.create({
      data: {
        characterId: character.id,
        storyPlanId: storyPlanRecord.id,
        imageUrl,
        caption: storyPlan.caption,
        status: "generated",
      },
    });

    await prisma.memory.upsert({
      where: {
        characterId_key: {
          characterId: character.id,
          key: "last_location",
        },
      },
      create: {
        characterId: character.id,
        key: "last_location",
        value: storyPlan.location,
      },
      update: {
        value: storyPlan.location,
      },
    });

    await prisma.memory.upsert({
      where: {
        characterId_key: {
          characterId: character.id,
          key: "last_theme",
        },
      },
      create: {
        characterId: character.id,
        key: "last_theme",
        value: storyPlan.theme,
      },
      update: {
        value: storyPlan.theme,
      },
    });

    if (character.autoPublish) {
      const job = await addPublishingJob(generatedStory.id);
      if (job) {
        await prisma.generatedStory.update({
          where: { id: generatedStory.id },
          data: { status: "publishing" },
        });
      } else {
        try {
          const bufferPost = await createBufferPost(generatedStory.caption, generatedStory.imageUrl);
          await prisma.generatedStory.update({
            where: { id: generatedStory.id },
            data: {
              published: true,
              publishedAt: new Date(),
              bufferPostId: bufferPost.id,
              status: "published",
            },
          });
        } catch {
          await prisma.generatedStory.update({
            where: { id: generatedStory.id },
            data: { status: "failed" },
          });
        }
      }
    }

    return generatedStory;
  }
}

export async function createStoryPipeline(): Promise<StoryPipelineService> {
  const allSettings = await prisma.setting.findMany();
  const settingsMap: Record<string, string> = {};
  for (const s of allSettings) {
    settingsMap[s.key] = s.value;
  }

  const getDecrypted = (key: string): string | undefined => {
    const val = settingsMap[key];
    if (!val) return undefined;
    try {
      return decrypt(val);
    } catch {
      return val;
    }
  };

  const promptProvider = (settingsMap["prompt_provider"] || "openai") as PromptProvider;

  let promptApiKey = "";
  let promptModel: string | undefined;

  if (promptProvider === "openai") {
    promptApiKey = getDecrypted("openai_api_key") || process.env.OPENAI_API_KEY || "";
  } else {
    promptApiKey = getDecrypted("openrouter_api_key") || process.env.OPENROUTER_API_KEY || "";
    promptModel = settingsMap["openrouter_model"] || "openai/gpt-4o-mini";
  }

  const imageProvider = (settingsMap["image_provider"] || "openai") as ImageProvider;

  let imageApiKey = "";
  if (imageProvider === "openai") {
    imageApiKey = getDecrypted("image_provider_api_key") || getDecrypted("openai_api_key") || process.env.OPENAI_API_KEY || "";
  } else if (imageProvider === "huggingface") {
    imageApiKey = getDecrypted("huggingface_api_key") || process.env.HUGGINGFACE_API_KEY || "";
  } else if (imageProvider === "pollinations") {
    imageApiKey = ""; // No API key needed
  }

  return new StoryPipelineService({
    promptProvider,
    promptApiKey,
    promptModel,
    imageProvider,
    imageApiKey,
  });
}
