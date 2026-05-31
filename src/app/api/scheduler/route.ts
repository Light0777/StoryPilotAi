import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createStoryPipeline } from "@/services/story-pipeline";

export async function POST() {
  try {
    const now = new Date();
    const currentHHmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    const characters = await prisma.character.findMany({
      where: {
        status: "active",
        autoPublish: true,
        publishTime: currentHHmm,
      },
    });

    let generated = 0;
    let skipped = 0;
    let errors = 0;

    for (const character of characters) {
      try {
        const alreadyGenerated = await prisma.generatedStory.findFirst({
          where: {
            characterId: character.id,
            createdAt: { gte: todayStart, lte: todayEnd },
          },
        });

        if (alreadyGenerated) {
          skipped++;
          continue;
        }

        const pipeline = await createStoryPipeline();
        await pipeline.generateStory(character.id);
        generated++;
      } catch {
        errors++;
      }
    }

    return NextResponse.json({
      generated,
      skipped,
      errors,
      total: characters.length,
      time: currentHHmm,
    });
  } catch (error) {
    console.error("Scheduler error:", error);
    return NextResponse.json(
      { message: "Scheduler failed", error: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}
