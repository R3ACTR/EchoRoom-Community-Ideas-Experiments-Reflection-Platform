import prisma from "../lib/prisma";
import {
  Idea as PrismaIdea,
  IdeaComplexity as PrismaIdeaComplexity,
} from "@prisma/client";
import { StateMachine } from "../lib/statemachine";
import { ConflictError } from "../lib/conflictError";

export type IdeaStatus =
  | "draft"
  | "proposed"
  | "experiment"
  | "outcome"
  | "reflection"
  | "discarded";

export type IdeaComplexity = PrismaIdeaComplexity;

export interface Idea {
  id: string;
  title: string;
  description: string;
  status: IdeaStatus;
  complexity: IdeaComplexity;
  version: number;
  createdAt: string;
  updatedAt: string;

  goal?: string;
  category?: string;
  expectedImpact?: string;
  effort?: string;
  timeHorizon?: string;
}

const ideaStateMachine = new StateMachine<IdeaStatus>({
  draft: ["proposed", "discarded"],
  proposed: ["experiment", "discarded"],
  experiment: ["outcome", "discarded"],
  outcome: ["reflection", "discarded"],
  reflection: [],
  discarded: [],
});

const IDEA_STATUS_ALIASES: Record<string, IdeaStatus> = {
  draft: "draft",
  proposed: "proposed",
  experiment: "experiment",
  outcome: "outcome",
  reflection: "reflection",
  discarded: "discarded",
  new: "proposed",
  "in progress": "experiment",
  "in-progress": "experiment",
  in_progress: "experiment",
  implemented: "reflection",
};

const toIdea = (idea: PrismaIdea): Idea => ({
  id: idea.id,
  title: idea.title,
  description: idea.description,
  status: idea.status as IdeaStatus,
  complexity: idea.complexity,
  version: idea.version,
  createdAt: idea.createdAt.toISOString(),
  updatedAt: idea.updatedAt.toISOString(),

  goal: idea.goal ?? undefined,
  category: idea.category ?? undefined,
  expectedImpact: idea.expectedImpact ?? undefined,
  effort: idea.effort ?? undefined,
  timeHorizon: idea.timeHorizon ?? undefined,
});

export const normalizeIdeaStatus = (
  status: unknown
): IdeaStatus | null => {
  if (typeof status !== "string") return null;
  return IDEA_STATUS_ALIASES[status.trim().toLowerCase()] ?? null;
};

export const getAllIdeas = async (): Promise<Idea[]> => {
  const ideas = await prisma.idea.findMany({
    orderBy: { createdAt: "desc" },
  });

  return ideas.map(toIdea);
};

export const getPublishedIdeas = async (): Promise<Idea[]> => {
  const ideas = await prisma.idea.findMany({
    where: { status: { not: "draft" } },
    orderBy: { createdAt: "desc" },
  });

  return ideas.map(toIdea);
};

export const getDraftIdeas = async (): Promise<Idea[]> => {
  const ideas = await prisma.idea.findMany({
    where: { status: "draft" },
    orderBy: { createdAt: "desc" },
  });

  return ideas.map(toIdea);
};

export const getIdeaById = async (
  id: string
): Promise<Idea | null> => {
  const idea = await prisma.idea.findUnique({ where: { id } });
  return idea ? toIdea(idea) : null;
};

export const getAvailableTransitions = async (
  id: string
): Promise<IdeaStatus[] | null> => {
  const idea = await prisma.idea.findUnique({ where: { id } });
  if (!idea) return null;
  return ideaStateMachine.getAllowedTransitions(
    idea.status as IdeaStatus
  );
};

export const createIdea = async (
  title: string,
  description: string,
  complexity: IdeaComplexity = "MEDIUM",
  goal?: string,
  category?: string,
  expectedImpact?: string,
  effort?: string,
  timeHorizon?: string
): Promise<Idea> => {
  const idea = await prisma.idea.create({
    data: {
      title,
      description,
      complexity,
      status: "proposed",
      goal: goal || null,
      category: category || null,
      expectedImpact: expectedImpact || null,
      effort: effort || null,
      timeHorizon: timeHorizon || null,
    },
  });

  return toIdea(idea);
};

export const createDraft = async (
  title: string,
  description: string,
  complexity: IdeaComplexity = "MEDIUM",
  goal?: string,
  category?: string,
  expectedImpact?: string,
  effort?: string,
  timeHorizon?: string
): Promise<Idea> => {
  const idea = await prisma.idea.create({
    data: {
      title,
      description,
      complexity,
      status: "draft",
      goal: goal || null,
      category: category || null,
      expectedImpact: expectedImpact || null,
      effort: effort || null,
      timeHorizon: timeHorizon || null,
    },
  });

  return toIdea(idea);
};

export const updateDraft = async (
  id: string,
  title: string,
  description: string,
  version: number
): Promise<Idea | null> => {
  const existing = await prisma.idea.findUnique({ where: { id } });
  if (!existing) return null;

  if (existing.version !== version) {
    throw new ConflictError("Idea has been modified by another user");
  }

  const updated = await prisma.idea.update({
    where: { id },
    data: {
      title,
      description,
      version: { increment: 1 },
    },
  });

  return toIdea(updated);
};

export const publishDraft = async (
  id: string,
  version: number
): Promise<Idea | null> => {
  return updateIdeaStatus(id, "proposed", version);
};

export const updateIdeaStatus = async (
  id: string,
  status: IdeaStatus,
  version: number
): Promise<Idea | null> => {
  const existing = await prisma.idea.findUnique({ where: { id } });
  if (!existing) return null;

  if (existing.version !== version) {
    throw new ConflictError("Idea has been modified by another user");
  }

  const nextStatus = ideaStateMachine.transition(
    existing.status as IdeaStatus,
    status
  );

  const updated = await prisma.idea.update({
    where: { id },
    data: {
      status: nextStatus,
      version: { increment: 1 },
    },
  });

  return toIdea(updated);
};

export const deleteIdea = async (id: string): Promise<boolean> => {
  const deleted = await prisma.idea.deleteMany({ where: { id } });
  return deleted.count > 0;
};