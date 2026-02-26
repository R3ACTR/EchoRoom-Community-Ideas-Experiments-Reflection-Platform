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

export const updateOutcome = async (
  id: string,
  updates: {
    result?: string;
    notes?: string;
    impactLevel?: string;
    wasExpected?: boolean;
  }
): Promise<Outcome | null> => {
  const existing = await prisma.outcome.findUnique({
    where: { id },
    select: {
      result: true,
      notes: true,
      impactLevel: true,
      wasExpected: true,
    },
  });

  if (!existing) return null;

  const newResult = updates.result ?? existing.result;
  const newImpact = updates.impactLevel ?? existing.impactLevel ?? null;

  const newMomentum = computeMomentum(newResult, newImpact);

  const updated = await prisma.outcome.update({
    where: { id },
    data: {
      result: newResult,
      notes: updates.notes ?? existing.notes,
      impactLevel: newImpact,
      wasExpected: updates.wasExpected ?? existing.wasExpected,
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

/* =========================
   Outcome Analytics
========================= */

export const getOutcomeAnalytics = async () => {
  const outcomes = await prisma.outcome.findMany({
    select: {
      result: true,
      impactLevel: true,
      momentum: true,
    },
  });

  const total = outcomes.length;

  const resultCount = {
    SUCCESS: 0,
    FAILED: 0,
    MIXED: 0,
  };

  const impactDistribution: Record<string, number> = {};
  const momentumDistribution: Record<string, number> = {};

  for (const o of outcomes) {
    // Count result
    if (o.result in resultCount) {
      resultCount[o.result as keyof typeof resultCount]++;
    }

    // Count impact
    if (o.impactLevel) {
      impactDistribution[o.impactLevel] =
        (impactDistribution[o.impactLevel] || 0) + 1;
    }

    // Count momentum
    if (o.momentum) {
      momentumDistribution[o.momentum] =
        (momentumDistribution[o.momentum] || 0) + 1;
    }
  }

  const successRate =
    total > 0 ? ((resultCount.SUCCESS / total) * 100).toFixed(2) : "0";

  return {
    totalOutcomes: total,
    results: resultCount,
    successRate: `${successRate}%`,
    impactDistribution,
    momentumDistribution,
  };
};