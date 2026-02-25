// backend/src/routes/insights.routes.ts
import { Router } from "express";
import { getGraph, getSuggestions } from "../controllers/insights.controller";
import { validateRequest } from "../middleware/validate.middleware";
import { insightsSchemas } from "../validation/request.schemas";

const router = Router();

router.get("/graph", getGraph);
router.post(
  "/suggest-patterns",
  validateRequest(insightsSchemas.suggestPatterns),
  getSuggestions
);

export default router;
