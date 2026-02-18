// backend/src/services/experiments.service.ts

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
  outcome?: string;
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
  status: ExperimentStatus
): Experiment => {

  const newExperiment: Experiment = {
    id: nextId++,
    title,
    description,
    status,
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

  if (updates.status !== undefined)
    experiment.status = updates.status;

  if (updates.outcome !== undefined)
    experiment.outcome = updates.outcome;

  return experiment;
};


// Delete experiment
export const deleteExperiment = (id: number): boolean => {

  const index = experiments.findIndex(e => e.id === id);

  if (index === -1) return false;

  experiments.splice(index, 1);

  return true;
};
