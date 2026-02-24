// backend/src/services/reflections.service.ts

export interface Reflection {
  id: number;
  outcomeId: number;

  context: {
    emotionBefore: number;
    confidenceBefore: number;
  };

  breakdown: {
    whatHappened: string;
    whatWorked: string;
    whatDidntWork: string;
    surprises: string;
  };

  growth: {
    lessonLearned: string;
    nextAction: string;
  };

  result: {
    emotionAfter: number;
    confidenceAfter: number;
  };

  tags?: string[];
  evidenceLink?: string;
  visibility: "private" | "public";

  createdAt: Date;
}


// in-memory storage
let reflections: Reflection[] = [];
let nextId = 1;

export interface ReflectionInput {
  outcomeId: number;

  context: {
    emotionBefore: number;
    confidenceBefore: number;
  };

  breakdown: {
    whatHappened: string;
    whatWorked: string;
    whatDidntWork: string;
    surprises: string;
  };

  growth: {
    lessonLearned: string;
    nextAction: string;
  };

  result: {
    emotionAfter: number;
    confidenceAfter: number;
  };

  tags?: string[];
  evidenceLink?: string;
  visibility: "private" | "public";
}

// Create reflection
export const createReflection = (
  data: ReflectionInput
): Reflection => {
  const newReflection: Reflection = {
    id: nextId++,
    outcomeId: data.outcomeId,

    context: data.context,
    breakdown: data.breakdown,
    growth: data.growth,
    result: data.result,

    tags: data.tags ?? [],
    evidenceLink: data.evidenceLink ?? "",
    visibility: data.visibility,

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

export const getReflectionById = (
  id: number
): Reflection | undefined => {
  return reflections.find(reflection => reflection.id === id);
};