import { Router } from "express";
import {
  getReflections,
  getReflectionsByOutcome,
  postReflection,
  getReflectionByIdController,
} from "../controllers/reflections.controller";

const router = Router();

router.post("/", postReflection);
router.get("/", getReflections);
router.get("/id/:id", getReflectionByIdController);
router.get("/:outcomeId", getReflectionsByOutcome);

export default router;
