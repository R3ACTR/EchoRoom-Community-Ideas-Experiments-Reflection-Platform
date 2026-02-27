import prisma from "../lib/prisma";
import { Reflection as PrismaReflection, Prisma } from "@prisma/client";

type ReflectionContext = {
  emotionBefore: number;
  confidenceBefore: number;
};

type ReflectionBreakdown = {
  whatHappened: string;
  whatWorked: string;
  whatDidntWork: string;
};

type ReflectionGrowth = {
  lessonLearned: string;
  nextAction: string;
};

type ReflectionResult = {
  emotionAfter: number;
  confidenceAfter: number;
};

export interface Reflection {
  id: string;
  outcomeId: string;
  context: ReflectionContext;
  breakdown: ReflectionBreakdown;
  growth: ReflectionGrowth;
  result: ReflectionResult;
  tags?: string[];
  evidenceLink?: string;
  visibility: "private" | "public";
  createdAt: Date;
}

export interface ReflectionInput {
  outcomeId: string;
  context: ReflectionContext;
  breakdown: ReflectionBreakdown;
  growth: ReflectionGrowth;
  result: ReflectionResult;
  tags?: string[];
  evidenceLink?: string;
  visibility: "private" | "public";
}

const toReflection = (reflection: PrismaReflection): Reflection => ({
  id: reflection.id,
  outcomeId: reflection.outcomeId,
  context: reflection.context as unknown as ReflectionContext,
  breakdown: reflection.breakdown as unknown as ReflectionBreakdown,
  growth: reflection.growth as unknown as ReflectionGrowth,
  result: reflection.result as unknown as ReflectionResult,
  tags: reflection.tags,
  evidenceLink: reflection.evidenceLink,
  visibility: reflection.visibility as "private" | "public",
  createdAt: reflection.createdAt,
});

export const createReflection = async (
  data: ReflectionInput
): Promise<Reflection> => {
  const reflection = await prisma.reflection.create({
    data: {
      outcomeId: data.outcomeId,
      context: data.context as Prisma.InputJsonValue,
      breakdown: data.breakdown as Prisma.InputJsonValue,
      growth: data.growth as Prisma.InputJsonValue,
      result: data.result as Prisma.InputJsonValue,
      tags: data.tags ?? [],
      evidenceLink: data.evidenceLink ?? "",
      visibility: data.visibility,
    },
  });

  return toReflection(reflection);
};

export const getAllReflections = async (): Promise<Reflection[]> => {
  const reflections = await prisma.reflection.findMany({
    orderBy: { createdAt: "desc" },
  });

  return reflections.map(toReflection);
};

export const getReflectionsByOutcomeId = async (
  outcomeId: string
): Promise<Reflection[]> => {
  const reflections = await prisma.reflection.findMany({
    where: { outcomeId },
    orderBy: { createdAt: "desc" },
  });

  return reflections.map(toReflection);
};

export const getReflectionById = async (
  id: string
): Promise<Reflection | undefined> => {
  const reflection = await prisma.reflection.findUnique({ where: { id } });
  return reflection ? toReflection(reflection) : undefined;
};
