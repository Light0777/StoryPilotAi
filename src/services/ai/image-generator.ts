import OpenAI from "openai";
import type { ImageProvider } from "@/types";

interface ImageGenerationInput {
  imagePrompt: string;
  faceReferenceUrl?: string | null;
}

interface ImageGenerationResult {
  buffer: Buffer;
  publicUrl?: string;
}

interface ProviderConfig {
  provider: ImageProvider;
  apiKey: string;
}

export class ImageGeneratorService {
  private provider: ImageProvider;
  private apiKey: string;
  private openai: OpenAI | null = null;

  constructor(config: ProviderConfig) {
    this.provider = config.provider;
    this.apiKey = config.apiKey;

    if (config.provider === "openai") {
      this.openai = new OpenAI({ apiKey: config.apiKey });
    }
  }

  async generateImage(input: ImageGenerationInput): Promise<ImageGenerationResult> {
    const enhancedPrompt = this.buildEnhancedPrompt(input);

    switch (this.provider) {
      case "openai":
        return this.generateWithOpenAI(enhancedPrompt);
      case "huggingface":
        return this.generateWithHuggingFace(enhancedPrompt);
      case "pollinations":
        return this.generateWithPollinations(enhancedPrompt);
      default:
        return this.generateWithHuggingFace(enhancedPrompt);
    }
  }

  private buildEnhancedPrompt(input: ImageGenerationInput): string {
    const faceRef = input.faceReferenceUrl
      ? ` Use this face as reference: ${input.faceReferenceUrl}.`
      : "";

    return `${input.imagePrompt}${faceRef} Format: portrait 9:16 aspect ratio, suitable for Instagram stories. Photorealistic style, high detail, professional lighting.`;
  }

  private async generateWithOpenAI(prompt: string): Promise<ImageGenerationResult> {
    if (!this.openai) {
      throw new Error(
        "OpenAI API key is not configured for image generation. Go to Settings to set up your image provider."
      );
    }

    let response;
    try {
      response = await this.openai.images.generate({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1792",
        quality: "standard",
        response_format: "b64_json",
      });
    } catch (err) {
      throw new Error(
        `OpenAI DALL-E API error: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }

    const b64Json = response.data?.[0]?.b64_json;
    if (!b64Json) {
      throw new Error("Failed to generate image with DALL-E");
    }

    return { buffer: Buffer.from(b64Json, "base64") };
  }

  private async generateWithPollinations(prompt: string): Promise<ImageGenerationResult> {
    let response: Response;
    try {
      response = await fetch("https://image.pollinations.ai/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          width: 1024,
          height: 1792,
          model: "flux",
          nologo: true,
        }),
        signal: AbortSignal.timeout(60000),
      });
    } catch (err) {
      if (err instanceof TypeError && (err as any).cause?.code === "ENOTFOUND") {
        throw new Error(
          "Failed to reach Pollinations API — DNS resolution failed. Check your internet connection or try a different image provider in Settings."
        );
      }
      throw new Error(
        `Network error while calling Pollinations API: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }

    if (!response.ok) {
      const error = await response.text().catch(() => "Unknown error");
      throw new Error(`Pollinations API error: ${error}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const encodedPrompt = encodeURIComponent(prompt);
    const publicUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1792&model=flux&nologo=true`;

    return { buffer: Buffer.from(arrayBuffer), publicUrl };
  }

  private async generateWithHuggingFace(prompt: string): Promise<ImageGenerationResult> {
    if (!this.apiKey) {
      throw new Error(
        "HuggingFace API key is not configured. Go to Settings to set up your image provider."
      );
    }

    let response: Response;
    try {
      response = await fetch(
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              num_inference_steps: 4,
              guidance_scale: 3.5,
              target_size: { width: 1024, height: 1792 },
            },
          }),
          signal: AbortSignal.timeout(30000),
        }
      );
    } catch (err) {
      if (err instanceof TypeError && (err as any).cause?.code === "ENOTFOUND") {
        throw new Error(
          "Failed to reach HuggingFace API — DNS resolution failed. Check your internet connection or try a different image provider in Settings."
        );
      }
      throw new Error(
        `Network error while calling HuggingFace API: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }

    if (!response.ok) {
      const error = await response.text().catch(() => "Unknown error");
      throw new Error(`Hugging Face API error: ${error}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return { buffer: Buffer.from(arrayBuffer) };
  }
}
