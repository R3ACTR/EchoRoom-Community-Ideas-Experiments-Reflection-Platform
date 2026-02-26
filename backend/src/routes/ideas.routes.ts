import { Router } from "express";
import { validateRequest } from "../middleware/validate.middleware";
import { ideasSchemas } from "../validation/request.schemas";
import { authenticate } from "../middleware/auth";
import {
  getIdeas,
  getAllIdeasHandler,
  getDrafts,
  postIdea,
  postDraft,
  putDraft,
  publishDraftHandler,
  patchIdeaStatus,
  deleteIdeaById,
  getIdeaByIdHandler
} from "../controllers/ideas.controller";

const router = Router();

router.get("/", getIdeas);
router.get("/all", getAllIdeasHandler);
router.get("/drafts", authenticate, getDrafts);
router.post("/", authenticate, validateRequest(ideasSchemas.postIdea), postIdea);
router.post("/drafts", authenticate, validateRequest(ideasSchemas.postDraft), postDraft);
router.put("/:id", authenticate, validateRequest(ideasSchemas.putDraft), putDraft);
router.patch(
  "/:id/publish",
  authenticate,
  validateRequest(ideasSchemas.publishDraft),
  publishDraftHandler
);
router.patch(
  "/:id/status",
  authenticate,
  validateRequest(ideasSchemas.patchIdeaStatus),
  patchIdeaStatus
);
router.delete("/:id", authenticate, validateRequest(ideasSchemas.deleteIdeaById), deleteIdeaById);
router.get("/:id", validateRequest(ideasSchemas.getIdeaById), getIdeaByIdHandler);


export default router;
