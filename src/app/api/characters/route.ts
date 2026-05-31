import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { characterSchema } from "@/lib/validators";
import { createStoryPipeline } from "@/services/story-pipeline";

export async function GET() {
  try {
    const session = await requireAuth();

    const characters = await prisma.character.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            generatedStories: true,
            storyPlans: true,
          },
        },
      },
    });

    return NextResponse.json({ characters });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Get characters error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    console.log("Character create body:", JSON.stringify(body));
    const validated = characterSchema.safeParse(body);

    if (!validated.success) {
      console.error("Validation errors:", validated.error.errors);
      return NextResponse.json(
        { message: validated.error.errors.map(e => e.message).join(", ") },
        { status: 400 }
      );
    }

    const character = await prisma.character.create({
      data: {
        ...validated.data,
        userId: session.userId,
      },
    });

    createStoryPipeline()
      .then((pipeline) => pipeline.generateStory(character.id))
      .catch((err) => console.error("Auto-generate failed:", err));

    return NextResponse.json({ character }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Create character error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
