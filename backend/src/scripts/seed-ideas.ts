import { IdeaComplexity as PrismaIdeaComplexity } from "@prisma/client";
import prisma from "../lib/prisma";

const DEFAULT_SEED_COUNT = 180;
const SEED_TITLE_PREFIX = "[SEED] Idea";

const STATUSES = ["draft", "proposed", "experiment", "outcome", "reflection"] as const;
const COMPLEXITIES: PrismaIdeaComplexity[] = ["LOW", "MEDIUM", "HIGH"];

const parseCount = (): number => {
  const countFromEnv = process.env.SEED_IDEAS_COUNT;
  const parsedCount = Number(countFromEnv ?? DEFAULT_SEED_COUNT);

  if (!Number.isInteger(parsedCount) || parsedCount <= 0) {
    throw new Error("SEED_IDEAS_COUNT must be a positive integer");
  }

  return parsedCount;
};

const createSeedPayload = (count: number) => {
  return Array.from({ length: count }, (_, index) => {
    const position = index + 1;
    const status = STATUSES[index % STATUSES.length];
    const complexity = COMPLEXITIES[index % COMPLEXITIES.length];
    const normalizedIndex = String(position).padStart(3, "0");

    return {
      title: `${SEED_TITLE_PREFIX} ${normalizedIndex}`,
      description: `Generated seed idea #${position} for local development/demo usage.`,
      status,
      complexity,
      version: 1,
    };
  });
};

const seedIdeas = async (): Promise<void> => {
  const count = parseCount();

  // Idempotent seed behavior: replace only prior seed-generated records.
  await prisma.idea.deleteMany({
    where: {
      title: { startsWith: SEED_TITLE_PREFIX },
    },
  });

  const payload = createSeedPayload(count);
  const result = await prisma.idea.createMany({ data: payload });

  console.log(`Seeded ${result.count} ideas into the database.`);
};

void (async () => {
  try {
    await seedIdeas();
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown seed failure";

    console.error(`Failed to seed ideas: ${message}`);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();
