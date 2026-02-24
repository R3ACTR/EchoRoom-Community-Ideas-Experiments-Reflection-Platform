import { getNextIdeaId, ideas } from "../data/ideas.data";
import { StateMachine } from "../lib/statemachine";
import { ConflictError } from "../lib/conflictError";

export type IdeaStatus =
  | "draft"
  | "proposed"
  | "experiment"
  | "outcome"
  | "reflection"
  | "discarded";

export type IdeaComplexity = "LOW" | "MEDIUM" | "HIGH";

export interface Idea {
  id: number;
  title: string;
  description: string;
  status: IdeaStatus;
  complexity: IdeaComplexity;
  version: number;
  createdAt: string;
  updatedAt: string;
}

// 🔹 Allowed transitions
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

export const normalizeIdeaStatus = (status: unknown): IdeaStatus | null => {
  if (typeof status !== "string") {
    return null;
  }

  return IDEA_STATUS_ALIASES[status.trim().toLowerCase()] ?? null;
};

// 🔹 Get all ideas
export const getAllIdeas = (): Idea[] => {
  return ideas;
};

// 🔹 Get published ideas (non-draft)
export const getPublishedIdeas = (): Idea[] => {
  return ideas.filter((i) => i.status !== "draft");
};

// 🔹 Get draft ideas
export const getDraftIdeas = (): Idea[] => {
  return ideas.filter((i) => i.status === "draft");
};

// 🔹 Get idea by ID
export const getIdeaById = (id: number): Idea | null => {
  return ideas.find((i) => i.id === id) || null;
};

// 🔹 Get available transitions
export const getAvailableTransitions = (
  id: number
): IdeaStatus[] | null => {
  const idea = ideas.find((i) => i.id === id);
  if (!idea) return null;

  return ideaStateMachine.getAllowedTransitions(idea.status);
};

// 🔹 Create proposed idea
export const createIdea = (
  title: string,
  description: string,
  complexity: IdeaComplexity = "MEDIUM"
): Idea => {
  const now = new Date().toISOString();

  const newIdea: Idea = {
    id: getNextIdeaId(),
    title,
    description,
    status: "proposed",
    complexity,
    version: 1,
    createdAt: now,
    updatedAt: now,
  };

  ideas.push(newIdea);
  return newIdea;
};

// 🔹 Create draft
export const createDraft = (
  title: string,
  description: string,
  complexity: IdeaComplexity = "MEDIUM"
): Idea => {
  const now = new Date().toISOString();

  const newDraft: Idea = {
    id: getNextIdeaId(),
    title,
    description,
    status: "draft",
    complexity,
    version: 1,
    createdAt: now,
    updatedAt: now,
  };

  ideas.push(newDraft);
  return newDraft;
};

// 🔹 Update draft (optimistic locking)
export const updateDraft = (
  id: number,
  title: string,
  description: string,
  version: number
): Idea | null => {
  const idea = ideas.find((i) => i.id === id);
  if (!idea) return null;

  if (idea.version !== version) {
    throw new ConflictError("Idea has been modified by another user");
  }

  idea.title = title;
  idea.description = description;
  idea.version += 1;
  idea.updatedAt = new Date().toISOString();

  return idea;
};

// 🔹 Publish draft
export const publishDraft = (
  id: number,
  version: number
): Idea | null => {
  return updateIdeaStatus(id, "proposed", version);
};

// 🔹 Update idea status (state machine + optimistic locking)
export const updateIdeaStatus = (
  id: number,
  status: IdeaStatus,
  version: number
): Idea | null => {
  const idea = ideas.find((i) => i.id === id);
  if (!idea) return null;

  if (idea.version !== version) {
    throw new ConflictError("Idea has been modified by another user");
  }

  idea.status = ideaStateMachine.transition(idea.status, status);
  idea.version += 1;
  idea.updatedAt = new Date().toISOString();

  return idea;
};

// 🔹 Delete idea
export const deleteIdea = (id: number): boolean => {
  const index = ideas.findIndex((i) => i.id === id);
  if (index === -1) return false;

  ideas.splice(index, 1);
  return true;
};
