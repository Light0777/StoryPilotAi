import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { addPublishingJob } from "@/lib/queue";
import { createBufferPost } from "@/lib/buffer";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const story = await prisma.generatedStory.findFirst({
      where: { id, character: { userId: session.userId } },
      include: { character: true },
    });

    if (!story) {
      return NextResponse.json({ message: "Story not found" }, { status: 404 });
    }

    return NextResponse.json({ story });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const story = await prisma.generatedStory.findFirst({
      where: { id, character: { userId: session.userId } },
    });

    if (!story) {
      return NextResponse.json({ message: "Story not found" }, { status: 404 });
    }

    await prisma.generatedStory.delete({ where: { id } });

    return NextResponse.json({ message: "Story deleted" });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const story = await prisma.generatedStory.findFirst({
      where: { id, character: { userId: session.userId } },
    });

    if (!story) {
      return NextResponse.json({ message: "Story not found" }, { status: 404 });
    }

    const job = await addPublishingJob(story.id);

    if (job) {
      await prisma.generatedStory.update({
        where: { id },
        data: { status: "publishing" },
      });
      return NextResponse.json({ message: "Story queued for publishing" });
    }

    const imageUrl = story.imageUrl.startsWith("http")
      ? story.imageUrl
      : `${new URL(request.url).origin}${story.imageUrl}`;
    const bufferPost = await createBufferPost(story.caption, imageUrl);

    await prisma.generatedStory.update({
      where: { id },
      data: {
        published: true,
        publishedAt: new Date(),
        bufferPostId: bufferPost.id,
        status: "published",
      },
    });

    return NextResponse.json({ message: "Story published" });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Publishing failed" },
      { status: 500 }
    );
  }
}
