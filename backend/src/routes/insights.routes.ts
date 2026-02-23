// backend/src/routes/insights.routes.ts
import { Router } from "express";
import { getGraph, getSuggestions } from "../controllers/insights.controller";

const router = Router();

router.get("/graph", getGraph);
router.post("/suggest-patterns", getSuggestions);

export default router;
