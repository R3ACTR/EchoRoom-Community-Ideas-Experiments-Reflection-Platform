import { getNextIdeaId, ideas } from "../data/ideas.data";

export type IdeaStatus = "draft" | "proposed" | "experiment" | "outcome" | "reflection";

export interface Idea {
  id: number;
  title: string;
  description: string;
  status: IdeaStatus;
  createdAt: string;
  updatedAt: string;
}


// allowed transitions
import { StateMachine } from "../lib/stateMachine";

const ideaStateMachine = new StateMachine<IdeaStatus>({
  draft: ["proposed"],
  proposed: ["experiment"],
  experiment: ["outcome"],
  outcome: ["reflection"],
  reflection: [],
});

// Get all ideas
export const getAllIdeas = (): Idea[] => {
  return ideas;
};

// Get only published ideas (non-draft)
export const getPublishedIdeas = (): Idea[] => {
  return ideas.filter(i => i.status !== "draft");
};

//valualable api feature

export const getAvailableTransitions = (id: number): IdeaStatus[] | null => {
  const idea = ideas.find(i => i.id === id);
  if (!idea) return null;

  return ideaStateMachine.getAllowedTransitions(idea.status);
};

// Get only draft ideas
export const getDraftIdeas = (): Idea[] => {
  return ideas.filter(i => i.status === "draft");
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

// Create a draft
export const createDraft = (title: string, description: string): Idea => {
  const now = new Date().toISOString();

  const newDraft: Idea = {
    id: getNextIdeaId(),
    title,
    description,
    status: "draft",
    createdAt: now,
    updatedAt: now,
  };

  ideas.push(newDraft);
  return newDraft;
};

// Update a draft (title/description)
export const updateDraft = (id: number, title: string, description: string): Idea | null => {
  const idea = ideas.find(i => i.id === id);

  if (!idea) return null;

  if (idea.status !== "draft") {
    throw new Error("Only draft ideas can be updated");
  }

  idea.title = title;
  idea.description = description;
  idea.updatedAt = new Date().toISOString();

  return idea;
};

// Publish a draft (change from draft to proposed)
export const publishDraft = (id: number): Idea | null => {
  return updateIdeaStatus(id, "proposed");
};


// Update idea status
export const updateIdeaStatus = (id: number, status: IdeaStatus): Idea | null => {
  const idea = ideas.find(i => i.id === id);

  if (!idea) return null;

 idea.status = ideaStateMachine.transition(idea.status, status);
idea.updatedAt = new Date().toISOString();

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
