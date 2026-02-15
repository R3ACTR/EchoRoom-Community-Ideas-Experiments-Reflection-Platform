// backend/src/services/ideas.service.ts

export type IdeaStatus = "proposed" | "experiment" | "outcome" | "reflection";

export interface Idea {
  id: number;
  title: string;
  description: string;
  status: IdeaStatus;
}

// in-memory storage
let ideas: Idea[] = [];
let nextId = 1;

// allowed transitions
const allowedTransitions: Record<IdeaStatus, IdeaStatus[]> = {
  proposed: ["experiment"],
  experiment: ["outcome"],
  outcome: ["reflection"],
  reflection: [],
};

// Get all ideas
export const getAllIdeas = (): Idea[] => {
  return ideas;
};

// Create new idea
export const createIdea = (title: string, description: string): Idea => {
  const newIdea: Idea = {
    id: nextId++,
    title,
    description,
    status: "proposed",
  };

  ideas.push(newIdea);

  return newIdea;
};

// Update idea status
export const updateIdeaStatus = (id: number, status: IdeaStatus): Idea | null => {
  const idea = ideas.find(i => i.id === id);

  if (!idea) return null;

  const allowed = allowedTransitions[idea.status];

  if (!allowed.includes(status)) {
    throw new Error(`Invalid transition from '${idea.status}' to '${status}'`);
  }

  idea.status = status;

  return idea;
};
