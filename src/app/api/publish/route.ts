import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { addPublishingJob } from "@/lib/queue";

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const { storyId } = await request.json();

    if (!storyId) {
      return NextResponse.json(
        { message: "Story ID is required" },
        { status: 400 }
      );
    }

    const story = await prisma.generatedStory.findFirst({
      where: { id: storyId, character: { userId: session.userId } },
    });

    if (!story) {
      return NextResponse.json({ message: "Story not found" }, { status: 404 });
    }

    const job = await addPublishingJob(storyId);

    if (!job) {
      return NextResponse.json(
        { message: "Redis is not available. Publishing queue requires Redis." },
        { status: 503 }
      );
    }

    await prisma.generatedStory.update({
      where: { id: storyId },
      data: { status: "publishing" },
    });

    return NextResponse.json({ message: "Story queued for publishing" });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
