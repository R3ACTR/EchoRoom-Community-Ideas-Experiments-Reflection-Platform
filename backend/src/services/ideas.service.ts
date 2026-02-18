import { getNextIdeaId, ideas } from "../data/ideas.data";

export type IdeaStatus = "proposed" | "experiment" | "outcome" | "reflection";

export interface Idea {
  id: number;
  title: string;
  description: string;
  status: IdeaStatus;
  createdAt: string;
  updatedAt: string;
}


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
  const now = new Date().toISOString();

  const newIdea: Idea = {
    id: getNextIdeaId(),
    title,
    description,
    status: "proposed",
    createdAt: now,
    updatedAt: now,
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
  idea.updatedAt = new Date().toISOString();

  return idea;
};

export const deleteIdea = (id: number): boolean => {
  const index = ideas.findIndex(i => i.id === id);


  if (index === -1) return false;

  ideas.splice(index, 1);
  return true;
};
export const getIdeaById = (id: number): Idea | null => {
  return ideas.find(i => i.id === id) || null;
};
