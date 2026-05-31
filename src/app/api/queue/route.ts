import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getQueueJobs, isRedisAvailable } from "@/lib/queue";

export async function GET() {
  try {
    await requireAuth();

    if (!isRedisAvailable()) {
      return NextResponse.json({
        jobs: [],
        redisAvailable: false,
        message: "Redis is not running. Queue features require Redis.",
      });
    }

    const allJobs = await getQueueJobs();

    return NextResponse.json({ jobs: allJobs, redisAvailable: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
