import { Worker } from "bullmq";
import IORedis from "ioredis";
import { createStoryPipeline } from "@/services/story-pipeline";

export function startStoryWorker() {
  const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy: () => null,
  }) as never;

  const worker = new Worker(
    "story-generation",
    async (job) => {
      const { characterId, planId } = job.data;
      const pipeline = await createStoryPipeline();
      await pipeline.generateStory(characterId, planId);
    },
    {
      connection,
      concurrency: 2,
    }
  );

  worker.on("completed", (job) => {
    console.log(`Story generation job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(`Story generation job ${job?.id} failed:`, err);
  });

  return worker;
}
