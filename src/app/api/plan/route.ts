import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { createStoryPipeline } from "@/services/story-pipeline";

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const { characterId } = await request.json();

    if (!characterId) {
      return NextResponse.json(
        { message: "Character ID is required" },
        { status: 400 }
      );
    }

    const character = await prisma.character.findFirst({
      where: { id: characterId, userId: session.userId },
    });

    if (!character) {
      return NextResponse.json({ message: "Character not found" }, { status: 404 });
    }

    const pipeline = await createStoryPipeline();
    const story = await pipeline.generateStory(characterId);

    return NextResponse.json({ story }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Plan generation error:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}
