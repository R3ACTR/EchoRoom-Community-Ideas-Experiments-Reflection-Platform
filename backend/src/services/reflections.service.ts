// backend/src/services/reflections.service.ts

export interface Reflection {
  id: number;
  outcomeId: number;
  content: string;
  createdAt: Date;
}


// in-memory storage
let reflections: Reflection[] = [];
let nextId = 1;


// Create reflection
export const createReflection = (
  outcomeId: number,
  content: string
): Reflection => {

  const newReflection: Reflection = {
    id: nextId++,
    outcomeId,
    content,
    createdAt: new Date(),
  };

  reflections.push(newReflection);

  return newReflection;
};


// Get all reflections
export const getAllReflections = (): Reflection[] => {
  return reflections;
};


// Get reflections by outcome ID
export const getReflectionsByOutcomeId = (
  outcomeId: number
): Reflection[] => {

  return reflections.filter(
    reflection => reflection.outcomeId === outcomeId
  );

};
