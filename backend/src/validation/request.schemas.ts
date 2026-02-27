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
      goal: z.string().optional(),
      category: z.string().optional(),
      expectedImpact: z.enum(["Low", "Medium", "High", "Game-Changing"]).optional(),
      effort: z.enum(["Low", "Medium", "High"]).optional(),
      timeHorizon: z.enum(["Short-term", "Mid-term", "Long-term"]).optional(),
    }),
  },
  postDraft: {
    body: z.object({
      title: nonEmptyString,
      description: nonEmptyString,
      complexity: ideaComplexitySchema.optional(),
      goal: z.string().optional(),
      category: z.string().optional(),
      expectedImpact: z.enum(["Low", "Medium", "High", "Game-Changing"]).optional(),
      effort: z.enum(["Low", "Medium", "High"]).optional(),
      timeHorizon: z.enum(["Short-term", "Mid-term", "Long-term"]).optional(),
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