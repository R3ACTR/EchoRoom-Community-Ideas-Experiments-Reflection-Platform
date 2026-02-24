import { Idea } from "../services/ideas.service";

const seededStatuses = [
  "draft",
  "proposed",
  "experiment",
  "outcome",
  "reflection",
  "discarded",
] as const;

const seededComplexities = ["LOW", "MEDIUM", "HIGH"] as const;

const makeSeededIdeas = (total: number): Idea[] => {
  const now = Date.now();
  const list: Idea[] = [];

  for (let index = 0; index < total; index += 1) {
    const id = index + 1;
    const status = seededStatuses[index % seededStatuses.length];
    const complexity = seededComplexities[index % seededComplexities.length];
    const version = (index % 4) + 1;

    const createdAt = new Date(now - (total - index) * 60 * 60 * 1000).toISOString();
    const updatedAt = new Date(
      now - (total - index - 1) * 30 * 60 * 1000
    ).toISOString();

    list.push({
      id,
      title: `Seed Idea ${id}: Community improvement concept`,
      description:
        `This is seeded test idea #${id}. ` +
        `It exists to stress-test list views, search, filtering, transitions, and deletion flows at scale.`,
      status,
      complexity,
      version,
      createdAt,
      updatedAt,
    });
  }

  return list;
};

export const ideas: Idea[] = makeSeededIdeas(180);

let nextIdeaId = ideas.length + 1;

export const getNextIdeaId = (): number => {
  return nextIdeaId++;
};
