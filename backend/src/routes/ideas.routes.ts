import { Router } from "express";
import {
  getIdeas,
  patchIdeaStatus,
  postIdea,
} from "../controllers/ideas.controller";

const router = Router();

router.get("/", getIdeas);
router.post("/", postIdea);
router.patch("/:id/status", patchIdeaStatus);

export default router;
