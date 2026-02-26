import prisma from "../lib/prisma";

/* =========================
   Types
========================= */

export interface Outcome {
  id: string;
  experimentId: string;
  result: string;
  notes: string;
  impactLevel: string | null;
  wasExpected: boolean | null;
  momentum: string | null;
  createdAt: Date;
}

type OutcomeWithTitle = Outcome & {
  experimentTitle: string;
};

/* =========================
   Mapper
========================= */

const toOutcome = (outcome: {
  id: string;
  experimentId: string;
  result: string;
  notes: string;
  impactLevel: string | null;
  wasExpected: boolean | null;
  momentum: string | null;
  createdAt: Date;
}): Outcome => ({
  id: outcome.id,
  experimentId: outcome.experimentId,
  result: outcome.result,
  notes: outcome.notes,
  impactLevel: outcome.impactLevel ?? null,
  wasExpected: outcome.wasExpected ?? null,
  momentum: outcome.momentum ?? null,
  createdAt: outcome.createdAt,
});

/* =========================
   Momentum Logic
========================= */

const computeMomentum = (
  result: string,
  impactLevel: string | null
): string => {
  if (!impactLevel) return "STABLE";

  if (result === "SUCCESS") {
    if (impactLevel === "BREAKTHROUGH") return "RISING";
    if (impactLevel === "STRONG") return "RISING";
    if (impactLevel === "MODERATE") return "STABLE";
    return "STABLE";
  }

  if (result === "FAILED") {
    if (impactLevel === "LOW") return "STABLE";
    return "DROPPING";
  }

  return "STABLE";
};

/* =========================
   Create Outcome
========================= */

export const createOutcome = async (
  experimentId: string,
  result: string,
  notes?: string,
  impactLevel?: string,
  wasExpected?: boolean
): Promise<Outcome> => {
  const momentum = computeMomentum(result, impactLevel ?? null);

  const outcome = await prisma.outcome.create({
    data: {
      experimentId,
      result,
      notes: notes ?? "",
      impactLevel: impactLevel ?? null,
      wasExpected: wasExpected ?? null,
      momentum,
    },
    select: {
      id: true,
      experimentId: true,
      result: true,
      notes: true,
      impactLevel: true,
      wasExpected: true,
      momentum: true,
      createdAt: true,
    },
  });

  return toOutcome(outcome);
};

/* =========================
   Get All Outcomes
========================= */

export const getAllOutcomes = async (): Promise<OutcomeWithTitle[]> => {
  const outcomes = await prisma.outcome.findMany({
    select: {
      id: true,
      experimentId: true,
      result: true,
      notes: true,
      impactLevel: true,
      wasExpected: true,
      momentum: true,
      createdAt: true,
      experiment: {
        select: { title: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return outcomes.map((outcome: typeof outcomes[number]) => ({
    ...toOutcome(outcome),
    experimentTitle: outcome.experiment?.title ?? "Unknown Experiment",
  }));
};

/* =========================
   Get By Experiment
========================= */

export const getOutcomesByExperimentId = async (
  experimentId: string
): Promise<Outcome[]> => {
  const outcomes = await prisma.outcome.findMany({
    where: { experimentId },
    select: {
      id: true,
      experimentId: true,
      result: true,
      notes: true,
      impactLevel: true,
      wasExpected: true,
      momentum: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return outcomes.map(toOutcome);
};

/* =========================
   Update Outcome Result
========================= */

export const updateOutcomeResult = async (
  id: string,
  result: string
): Promise<Outcome | null> => {
  const existing = await prisma.outcome.findUnique({
    where: { id },
    select: {
      impactLevel: true,
    },
  });

  if (!existing) return null;

  const newMomentum = computeMomentum(
    result,
    existing.impactLevel ?? null
  );

  const updated = await prisma.outcome.update({
    where: { id },
    data: {
      result,
      momentum: newMomentum,
    },
    select: {
      id: true,
      experimentId: true,
      result: true,
      notes: true,
      impactLevel: true,
      wasExpected: true,
      momentum: true,
      createdAt: true,
    },
  });

  return toOutcome(updated);
};

/* =========================
   Check Existence
========================= */

export const hasOutcomeForExperiment = async (
  experimentId: string
): Promise<boolean> => {
  const count = await prisma.outcome.count({
    where: { experimentId },
  });

  return count > 0;
};