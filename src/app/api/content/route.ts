import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);
    const characterId = searchParams.get("characterId");
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {
      character: { userId: session.userId },
    };

    if (characterId) where.characterId = characterId;
    if (status) where.status = status;

    const stories = await prisma.generatedStory.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        character: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({ stories });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
