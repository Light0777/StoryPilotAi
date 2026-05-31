import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import type { DashboardStats } from "@/types";

export async function GET() {
  try {
    const session = await requireAuth();

    const characters = await prisma.character.findMany({
      where: { userId: session.userId },
      include: {
        _count: {
          select: { generatedStories: true },
        },
      },
    });

    const activeCharacters = characters.filter((c) => c.status === "active").length;

    const totalGenerated = characters.reduce(
      (sum, c) => sum + c._count.generatedStories,
      0
    );

    const publishedStories = await prisma.generatedStory.count({
      where: {
        character: { userId: session.userId },
        published: true,
      },
    });

    const scheduledStories = await prisma.generatedStory.count({
      where: {
        character: { userId: session.userId },
        status: "publishing",
      },
    });

    const recentStories = await prisma.generatedStory.findMany({
      where: { character: { userId: session.userId } },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        character: { select: { name: true } },
      },
    });

    const stats: DashboardStats = {
      activeCharacters,
      storiesGenerated: totalGenerated,
      storiesPublished: publishedStories,
      scheduledStories,
    };

    return NextResponse.json({ stats, recentStories });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
