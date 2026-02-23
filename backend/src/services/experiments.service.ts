// backend/src/services/experiments.service.ts
import { hasOutcomeForExperiment } from "./outcomes.service";
export type ExperimentStatus = "planned" | "in-progress" | "completed";
export const EXPERIMENT_PROGRESS_BY_STATUS: Record<ExperimentStatus, number> = {
  planned: 0,
  "in-progress": 50,
  completed: 100,
};

export interface Experiment {
  id: number;
  title: string;
  description: string;
  status: ExperimentStatus;
  linkedIdeaId?: number | null; 
  outcomeResult?: "Success" | "Failed" | null;
  createdAt: Date;
}

// in-memory storage
let experiments: Experiment[] = [];
let nextId = 1;

export const isExperimentStatus = (value: unknown): value is ExperimentStatus => {
  return (
    value === "planned" ||
    value === "in-progress" ||
    value === "completed"
  );
};

export const getProgressForExperimentStatus = (
  status: ExperimentStatus
): number => {
  return EXPERIMENT_PROGRESS_BY_STATUS[status];
};


// Get all experiments
export const getAllExperiments = (): Experiment[] => {
  return experiments;
};


// Get experiment by ID
export const getExperimentById = (id: number): Experiment | null => {
  const experiment = experiments.find(e => e.id === id);
  return experiment || null;
};


// Create experiment
export const createExperiment = (
  title: string,
  description: string,
  status: ExperimentStatus,
  linkedIdeaId?: number
): Experiment => {

  const newExperiment: Experiment = {
    id: nextId++,
    title,
    description,
    status,
    linkedIdeaId: linkedIdeaId ?? null,
    createdAt: new Date(),
  };

  experiments.push(newExperiment);

  return newExperiment;
};


// Update experiment
export const updateExperiment = (
  id: number,
  updates: Partial<Experiment>
): Experiment | null => {

  const experiment = experiments.find(e => e.id === id);

  if (!experiment) return null;

  if (updates.title !== undefined)
    experiment.title = updates.title;

  if (updates.description !== undefined)
    experiment.description = updates.description;

  if (updates.status !== undefined) {
  // If already completed block any status change
  if (experiment.status === "completed") {
    throw new Error("Completed experiments cannot be modified");
  }
  experiment.status = updates.status;
}

  if (updates.outcomeResult !== undefined)
  experiment.outcomeResult = updates.outcomeResult;

  return experiment;
};


export const deleteExperiment = (id: number): boolean => {

  const index = experiments.findIndex(e => e.id === id);
  if (index === -1) return false;

  // 🔒 Prevent deletion if outcome exists
  if (hasOutcomeForExperiment(id)) {
    throw new Error("Cannot delete experiment with a recorded outcome.");
  }

  experiments.splice(index, 1);
  return true;
};