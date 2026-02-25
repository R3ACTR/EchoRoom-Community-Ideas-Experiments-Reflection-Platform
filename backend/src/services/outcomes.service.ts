import prisma from "../lib/prisma";
import { Outcome as PrismaOutcome } from "@prisma/client";

export interface Outcome {
  id: string;
  experimentId: string;
  result: string;
  notes: string;
  createdAt: Date;
}

type OutcomeWithTitle = Outcome & { experimentTitle: string };

const toOutcome = (outcome: PrismaOutcome): Outcome => ({
  id: outcome.id,
  experimentId: outcome.experimentId,
  result: outcome.result,
  notes: outcome.notes,
  createdAt: outcome.createdAt,
});

export const createOutcome = async (
  experimentId: string,
  result: string,
  notes?: string
): Promise<Outcome> => {
  const outcome = await prisma.outcome.create({
    data: {
      experimentId,
      result,
      notes: notes ?? "",
    },
  });

  return toOutcome(outcome);
};

export const getAllOutcomes = async (): Promise<OutcomeWithTitle[]> => {
  const outcomes = await prisma.outcome.findMany({
    include: {
      experiment: {
        select: {
          title: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return outcomes.map((outcome) => ({
    ...toOutcome(outcome),
    experimentTitle: outcome.experiment?.title ?? "Unknown Experiment",
  }));
};

export const getOutcomesByExperimentId = async (
  experimentId: string
): Promise<Outcome[]> => {
  const outcomes = await prisma.outcome.findMany({
    where: { experimentId },
    orderBy: { createdAt: "desc" },
  });

  return outcomes.map(toOutcome);
};

export const updateOutcomeResult = async (
  id: string,
  result: string
): Promise<Outcome | null> => {
  const existing = await prisma.outcome.findUnique({ where: { id } });
  if (!existing) {
    return null;
  }

  const updated = await prisma.outcome.update({
    where: { id },
    data: { result },
  });

  return toOutcome(updated);
};

export const hasOutcomeForExperiment = async (
  experimentId: string
): Promise<boolean> => {
  const count = await prisma.outcome.count({ where: { experimentId } });
  return count > 0;
};
