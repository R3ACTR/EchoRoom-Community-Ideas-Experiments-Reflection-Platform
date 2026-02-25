import { z } from "zod";
import { numericIdParamSchema } from "../middleware/validate.middleware";

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
    params: numericIdParamSchema("id"),
  },
  deleteIdeaById: {
    params: numericIdParamSchema("id"),
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
    params: numericIdParamSchema("id"),
    body: z.object({
      title: nonEmptyString,
      description: nonEmptyString,
      version: z.number(),
    }),
  },
  publishDraft: {
    params: numericIdParamSchema("id"),
    body: z.object({
      version: z.number(),
    }),
  },
  patchIdeaStatus: {
    params: numericIdParamSchema("id"),
    body: z.object({
      status: ideaStatusSchema,
      version: z.number(),
    }),
  },
};

export const commentsSchemas = {
  list: {
    params: numericIdParamSchema("ideaId"),
  },
  create: {
    params: numericIdParamSchema("ideaId"),
    body: z.object({
      content: nonEmptyString,
    }),
  },
};

export const experimentsSchemas = {
  getById: {
    params: numericIdParamSchema("id"),
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
      linkedIdeaId: z.coerce.number().optional(),
    }),
  },
  update: {
    params: numericIdParamSchema("id"),
    body: z
      .object({
        title: nonEmptyString.optional(),
        description: nonEmptyString.optional(),
        hypothesis: nonEmptyString.optional(),
        successMetric: nonEmptyString.optional(),
        falsifiability: nonEmptyString.optional(),
        status: experimentStatusSchema.optional(),
        endDate: nonEmptyString.optional(),
        linkedIdeaId: z.coerce.number().optional(),
        outcomeResult: z.enum(["Success", "Failed"]).optional(),
      })
      .strict(),
  },
  remove: {
    params: numericIdParamSchema("id"),
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
    params: numericIdParamSchema("id"),
  },
  listByOutcome: {
    params: numericIdParamSchema("outcomeId"),
  },
  create: {
    body: z.object({
      outcomeId: z.coerce.number(),
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
      experimentId: z.coerce.number(),
      result: nonEmptyString,
      notes: z.string().optional(),
    }),
  },
  listByExperiment: {
    params: numericIdParamSchema("experimentId"),
  },
  updateResult: {
    params: numericIdParamSchema("id"),
    body: z.object({
      result: nonEmptyString,
    }),
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
