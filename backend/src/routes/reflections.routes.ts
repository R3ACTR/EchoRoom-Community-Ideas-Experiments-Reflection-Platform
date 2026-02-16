import { Router } from "express";
import {
  getReflections,
  getReflectionsByOutcome,
  postReflection,
} from "../controllers/reflections.controller";

const router = Router();

router.post("/", postReflection);
router.get("/", getReflections);
router.get("/:outcomeId", getReflectionsByOutcome);

export default router;
