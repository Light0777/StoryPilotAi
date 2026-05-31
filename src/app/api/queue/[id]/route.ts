import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { isRedisAvailable } from "@/lib/queue";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();

    if (!isRedisAvailable()) {
      return NextResponse.json({ message: "Redis is not available" }, { status: 503 });
    }

    const { id: jobId } = await params;
    const IORedis = (await import("ioredis")).default;
    const { Queue } = await import("bullmq");

    const redis = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
      lazyConnect: true,
      retryStrategy: () => null,
    }) as never;

    (redis as any).on?.("error", () => {});

    const queues = ["story-generation", "story-publishing"];

    for (const queueName of queues) {
      const queue = new Queue(queueName, { connection: redis });
      const job = await queue.getJob(jobId);
      if (job) {
        await job.remove();
        await queue.close();
        await (redis as any).disconnect();
        return NextResponse.json({ message: "Job cancelled" });
      }
      await queue.close();
    }

    await (redis as any).disconnect();
    return NextResponse.json({ message: "Job not found" }, { status: 404 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
