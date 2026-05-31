import { prisma } from "@/lib/prisma";
import { isRedisAvailable, addStoryGenerationJob } from "@/lib/queue";

export class SchedulerService {
  async scheduleDailyStories() {
    if (!isRedisAvailable()) {
      console.warn("Redis not available — skipping daily story scheduling");
      return [];
    }

    const activeCharacters = await prisma.character.findMany({
      where: { status: "active" },
    });

    const jobs = [];

    for (const character of activeCharacters) {
      for (let i = 0; i < character.storiesPerDay; i++) {
        const job = await addStoryGenerationJob(character.id);
        if (job) {
          jobs.push({
            jobId: job.id,
            characterId: character.id,
            characterName: character.name,
          });
        }
      }
    }

    return jobs;
  }
}
