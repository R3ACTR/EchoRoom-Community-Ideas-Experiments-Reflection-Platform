import { Router } from "express";
import {
  getIdeas,
  patchIdeaStatus,
  postIdea,
  deleteIdeaById
} from "../controllers/ideas.controller";

const router = Router();

router.get("/", getIdeas);
router.post("/", postIdea);
router.patch("/:id/status", patchIdeaStatus);
router.delete("/:id", deleteIdeaById);


export default router;
