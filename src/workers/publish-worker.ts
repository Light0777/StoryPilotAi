import { Worker } from "bullmq";
import IORedis from "ioredis";
import { prisma } from "@/lib/prisma";
import { createBufferPost } from "@/lib/buffer";

export function startPublishWorker() {
  const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy: () => null,
  }) as never;

  const worker = new Worker(
    "story-publishing",
    async (job) => {
      const { storyId } = job.data;

      const story = await prisma.generatedStory.findUnique({
        where: { id: storyId },
        include: { character: true },
      });

      if (!story) {
        throw new Error(`Story ${storyId} not found`);
      }

      try {
        const bufferPost = await createBufferPost(story.caption, story.imageUrl);

        await prisma.generatedStory.update({
          where: { id: storyId },
          data: {
            published: true,
            publishedAt: new Date(),
            bufferPostId: bufferPost.id,
            status: "published",
          },
        });
      } catch (error) {
        await prisma.generatedStory.update({
          where: { id: storyId },
          data: { status: "failed" },
        });
        throw error;
      }
    },
    {
      connection,
      concurrency: 1,
    }
  );

  worker.on("completed", (job) => {
    console.log(`Publishing job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(`Publishing job ${job?.id} failed:`, err);
  });

  return worker;
}
