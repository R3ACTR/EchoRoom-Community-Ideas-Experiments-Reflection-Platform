// backend/src/services/outcomes.service.ts

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
export const getAllOutcomes = (): Outcome[] => {
  return outcomes;
};


// Get outcomes by experiment ID
export const getOutcomesByExperimentId = (
  experimentId: number
): Outcome[] => {

  return outcomes.filter(
    outcome => outcome.experimentId === experimentId
  );

};
