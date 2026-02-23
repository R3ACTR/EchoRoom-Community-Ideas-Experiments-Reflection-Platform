// backend/src/services/outcomes.service.ts
import { getExperimentById } from "./experiments.service";

export interface Outcome {
  id: number;
  experimentId: number;
  result: string;
  notes: string;
  createdAt: Date;
}


// in-memory storage
let outcomes: Outcome[] = [];
let nextId = 1;


// Create outcome
export const createOutcome = (
  experimentId: number,
  result: string,
  notes?: string
): Outcome => {

  const newOutcome: Outcome = {
    id: nextId++,
    experimentId,
    result,
    notes: notes || "",
    createdAt: new Date(),
  };

  outcomes.push(newOutcome);

  return newOutcome;
};


// Get all outcomes
export const getAllOutcomes = () => {
  return outcomes.map((o) => {
    const experiment = getExperimentById(o.experimentId);

    return {
      ...o,
      experimentTitle: experiment?.title || "Unknown Experiment",
    };
  });
};

// Get outcomes by experiment ID
export const getOutcomesByExperimentId = (
  experimentId: number
): Outcome[] => {

  return outcomes.filter(
    outcome => outcome.experimentId === experimentId
  );

};

// Update outcome result
export const updateOutcomeResult = (
  id: number,
  result: string
): Outcome | null => {

  const outcome = outcomes.find(o => o.id === id);

  if (!outcome) return null;

  outcome.result = result;
  return outcome;
};

export const hasOutcomeForExperiment = (experimentId: number): boolean => {
  return outcomes.some(o => o.experimentId === experimentId);
};