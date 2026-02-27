import { z } from "zod";
import { objectIdParamSchema } from "../middleware/validate.middleware";

const nonEmptyString = z.string().trim().min(1, "Field is required");
const ideaComplexitySchema = z.enum(["LOW", "MEDIUM", "HIGH"]);
const ideaStatusSchema = z.enum([
  "draft",
  "proposed",
  "experiment",
  "outcome",
  "reflection",
]);
const experimentStatusSchema = z.enum(["planned", "in-progress", "completed"]);

export const ideasSchemas = {
  getIdeaById: {
    params: objectIdParamSchema("id"),
  },
  deleteIdeaById: {
    params: objectIdParamSchema("id"),
  },
  postIdea: {
    body: z.object({
      title: nonEmptyString,
      description: nonEmptyString,
      complexity: ideaComplexitySchema.optional(),
    }),
  },
  postDraft: {
    body: z.object({
      title: nonEmptyString,
      description: nonEmptyString,
      complexity: ideaComplexitySchema.optional(),
    }),
  },
  putDraft: {
    params: objectIdParamSchema("id"),
    body: z.object({
      title: nonEmptyString,
      description: nonEmptyString,
      version: z.number(),
    }),
  },
  publishDraft: {
    params: objectIdParamSchema("id"),
    body: z.object({
      version: z.number(),
    }),
  },
  patchIdeaStatus: {
    params: objectIdParamSchema("id"),
    body: z.object({
      status: ideaStatusSchema,
      version: z.number(),
    }),
  },
};

export const commentsSchemas = {
  list: {
    params: objectIdParamSchema("ideaId"),
  },
  create: {
    params: objectIdParamSchema("ideaId"),
    body: z.object({
      content: nonEmptyString,
    }),
  },
};

export const experimentsSchemas = {
  getById: {
    params: objectIdParamSchema("id"),
  },
  create: {
    body: z.object({
      title: nonEmptyString,
      description: nonEmptyString,
      hypothesis: nonEmptyString,
      successMetric: nonEmptyString,
      falsifiability: nonEmptyString,
      status: experimentStatusSchema,
      endDate: nonEmptyString,
      linkedIdeaId: z.string().regex(/^[a-fA-F0-9]{24}$/).optional(),
    }),
  },
  update: {
    params: objectIdParamSchema("id"),
    body: z
      .object({
        title: nonEmptyString.optional(),
        description: nonEmptyString.optional(),
        hypothesis: nonEmptyString.optional(),
        successMetric: nonEmptyString.optional(),
        falsifiability: nonEmptyString.optional(),
        status: experimentStatusSchema.optional(),
        endDate: nonEmptyString.optional(),
        linkedIdeaId: z.string().regex(/^[a-fA-F0-9]{24}$/).optional(),
        outcomeResult: z.enum(["Success", "Failed"]).optional(),
        progress: z.number().min(0).max(100).optional(),
      })
      .strict(),
  },
  remove: {
    params: objectIdParamSchema("id"),
  },
};

export const insightsSchemas = {
  suggestPatterns: {
    body: z.object({
      title: nonEmptyString,
      description: nonEmptyString,
    }),
  },
};

export const reflectionsSchemas = {
  getById: {
    params: objectIdParamSchema("id"),
  },
  listByOutcome: {
    params: objectIdParamSchema("outcomeId"),
  },
  create: {
    body: z.object({
      outcomeId: z.string().regex(/^[a-fA-F0-9]{24}$/),
      context: z.object({
        emotionBefore: z.number().min(1).max(5),
        confidenceBefore: z.number().min(1).max(10),
      }),
      breakdown: z.object({
        whatHappened: nonEmptyString,
        whatWorked: nonEmptyString,
        whatDidntWork: nonEmptyString,
      }),
      growth: z.object({
        lessonLearned: nonEmptyString,
        nextAction: nonEmptyString,
      }),
      result: z.object({
        emotionAfter: z.number().min(1).max(5),
        confidenceAfter: z.number().min(1).max(10),
      }),
      tags: z.array(nonEmptyString).optional(),
      evidenceLink: z.string().optional(),
      visibility: z.enum(["private", "public"]),
    }),
  },
};

export const outcomesSchemas = {
  create: {
    body: z.object({
      experimentId: z.string().regex(/^[a-fA-F0-9]{24}$/),
      result: z.enum(["SUCCESS", "FAILED", "MIXED"]),
      notes: z.string().optional(),
      impactLevel: z
        .enum(["LOW", "MODERATE", "STRONG", "BREAKTHROUGH"])
        .optional(),
      wasExpected: z.boolean().optional(),
    }),
  },

  listByExperiment: {
    params: objectIdParamSchema("experimentId"),
  },

  update: {
    params: objectIdParamSchema("id"),
    body: z
      .object({
        result: z.enum(["SUCCESS", "FAILED", "MIXED"]).optional(),
        notes: z.string().optional(),
        impactLevel: z
          .enum(["LOW", "MODERATE", "STRONG", "BREAKTHROUGH"])
          .optional(),
        wasExpected: z.boolean().optional(),
      })
      .strict(),
  },
};

export const authSchemas = {
  register: {
    body: z.object({
      email: z.string().email("Valid email is required"),
      username: nonEmptyString,
      password: z.string().min(8, "Password must be at least 8 characters"),
    }),
  },
  login: {
    body: z.object({
      email: z.string().email("Valid email is required"),
      password: nonEmptyString,
    }),
  },
  refresh: {
    body: z.object({
      refreshToken: nonEmptyString,
    }),
  },
  logout: {
    body: z
      .object({
        refreshToken: nonEmptyString.optional(),
      })
      .optional(),
  },
};