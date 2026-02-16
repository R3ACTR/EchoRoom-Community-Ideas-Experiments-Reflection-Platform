import { Idea } from "../services/ideas.service";

export const ideas: Idea[] = [];

let nextIdeaId = 1;

export const getNextIdeaId = (): number => {
  return nextIdeaId++;
};
