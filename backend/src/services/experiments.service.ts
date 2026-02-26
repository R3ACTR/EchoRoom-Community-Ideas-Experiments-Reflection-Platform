import prisma from "../lib/prisma";
import { Experiment as PrismaExperiment } from "@prisma/client";
import { hasOutcomeForExperiment } from "./outcomes.service";

export type ExperimentStatus = "planned" | "in-progress" | "completed";

export const EXPERIMENT_PROGRESS_BY_STATUS: Record<ExperimentStatus, number> = {
  planned: 0,
  "in-progress": 50,
  completed: 100,
};

export interface Experiment {
  id: string;
  title: string;
  description: string;
  hypothesis: string;
  successMetric: string;
  falsifiability: string;
  status: ExperimentStatus;
  endDate: string;
  linkedIdeaId?: string | null;
  outcomeResult?: "Success" | "Failed" | null;
  createdAt: Date;
  authorId?: string | null;
}

const toExperiment = (experiment: PrismaExperiment): Experiment => ({
  id: experiment.id,
  title: experiment.title,
  description: experiment.description,
  hypothesis: experiment.hypothesis,
  successMetric: experiment.successMetric,
  falsifiability: experiment.falsifiability,
  status: experiment.status as ExperimentStatus,
  endDate: experiment.endDate?.toISOString() ?? "",
  linkedIdeaId: experiment.linkedIdeaId ?? null,
  outcomeResult: (experiment.outcomeResult as "Success" | "Failed" | null) ?? null,
  createdAt: experiment.createdAt,
  authorId: experiment.authorId ?? null,
});

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

export const getAllExperiments = async (): Promise<Experiment[]> => {
  const experiments = await prisma.experiment.findMany({
    orderBy: { createdAt: "desc" },
  });

  return experiments.map(toExperiment);
};

export const getExperimentById = async (id: string): Promise<Experiment | null> => {
  const experiment = await prisma.experiment.findUnique({ where: { id } });
  return experiment ? toExperiment(experiment) : null;
};

export const createExperiment = async (
  title: string,
  description: string,
  hypothesis: string,
  successMetric: string,
  falsifiability: string,
  status: ExperimentStatus,
  endDate: string,
  linkedIdeaId?: string,
  authorId?: string
): Promise<Experiment> => {
  const experiment = await prisma.experiment.create({
    data: {
      title,
      description,
      hypothesis,
      successMetric,
      falsifiability,
      status,
      endDate: new Date(endDate),
      linkedIdeaId: linkedIdeaId ?? null,
      authorId,
    },
  });

  return toExperiment(experiment);
};

export const updateExperiment = async (
  id: string,
  updates: Partial<Experiment>
): Promise<Experiment | null> => {
  const experiment = await prisma.experiment.findUnique({ where: { id } });
  if (!experiment) {
    return null;
  }

  if (updates.status !== undefined && experiment.status === "completed") {
    throw new Error("Completed experiments cannot be modified");
  }

  const updated = await prisma.experiment.update({
    where: { id },
    data: {
      title: updates.title,
      description: updates.description,
      hypothesis: updates.hypothesis,
      successMetric: updates.successMetric,
      falsifiability: updates.falsifiability,
      status: updates.status,
      endDate: updates.endDate ? new Date(updates.endDate) : undefined,
      linkedIdeaId:
        updates.linkedIdeaId === undefined ? undefined : updates.linkedIdeaId ?? null,
      outcomeResult:
        updates.outcomeResult === undefined ? undefined : updates.outcomeResult ?? null,
    },
  });

  return toExperiment(updated);
};

export const deleteExperiment = async (id: string): Promise<boolean> => {
  const existsOutcome = await hasOutcomeForExperiment(id);
  if (existsOutcome) {
    throw new Error("Cannot delete experiment with a recorded outcome.");
  }

  const deleted = await prisma.experiment.deleteMany({ where: { id } });
  return deleted.count > 0;
};
