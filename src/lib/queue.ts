import { Queue, Job } from "bullmq";
import IORedis from "ioredis";

let connection: IORedis | null = null;
let _available: boolean | null = null;
let storyQueue: Queue | null = null;
let publishQueue: Queue | null = null;

async function init(): Promise<void> {
  if (_available !== null) return;

  try {
    connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      retryStrategy: () => null,
      lazyConnect: true,
      connectTimeout: 2000,
    }) as unknown as IORedis;

    connection.on("error", () => {});

    await connection.connect();
    _available = true;

    storyQueue = new Queue("story-generation", {
      connection: connection as never,
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 },
        removeOnComplete: 100,
        removeOnFail: 50,
      },
    });

    publishQueue = new Queue("story-publishing", {
      connection: connection as never,
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: "exponential", delay: 10000 },
        removeOnComplete: 100,
        removeOnFail: 50,
      },
    });
  } catch {
    connection?.removeAllListeners("error");
    connection = null;
    _available = false;
  }
}

init();

export function isRedisAvailable(): boolean {
  return _available === true;
}

export async function addStoryGenerationJob(characterId: string, planId?: string) {
  await init();
  if (!storyQueue) return null;
  try {
    return await storyQueue.add("generate-story", { characterId, planId });
  } catch {
    return null;
  }
}

export async function addPublishingJob(storyId: string, scheduledAt?: Date) {
  await init();
  if (!publishQueue) return null;
  try {
    return await publishQueue.add(
      "publish-story",
      { storyId },
      { delay: scheduledAt ? scheduledAt.getTime() - Date.now() : 0 }
    );
  } catch {
    return null;
  }
}

export async function getQueueJobs() {
  await init();

  const queues: Array<{ queue: Queue; type: string }> = [];
  if (storyQueue) queues.push({ queue: storyQueue, type: "story-generation" });
  if (publishQueue) queues.push({ queue: publishQueue, type: "story-publishing" });
  if (queues.length === 0) return [];

  const all: Array<{
    id: string;
    name: string;
    type: string;
    status: string;
    createdAt: number;
  }> = [];

  for (const { queue, type } of queues) {
    try {
      const jobs = await queue.getJobs(["waiting", "active", "delayed", "completed", "failed"]);
      for (const job of jobs) {
        all.push({
          id: job.id || "",
          name: job.name,
          type,
          status: await getJobStatus(job),
          createdAt: job.timestamp,
        });
      }
    } catch {
      // queue not available
    }
  }

  return all.sort((a, b) => b.createdAt - a.createdAt);
}

async function getJobStatus(job: Job): Promise<string> {
  if (await job.isFailed()) return "failed";
  if (await job.isCompleted()) return "completed";
  if (await job.isActive()) return "active";
  if (await job.isDelayed()) return "delayed";
  return "waiting";
}
