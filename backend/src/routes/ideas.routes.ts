import { Router } from "express";
import { validateRequest } from "../middleware/validate.middleware";
import { ideasSchemas } from "../validation/request.schemas";
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
router.get("/drafts", getDrafts);
router.post("/", validateRequest(ideasSchemas.postIdea), postIdea);
router.post("/drafts", validateRequest(ideasSchemas.postDraft), postDraft);
router.put("/:id", validateRequest(ideasSchemas.putDraft), putDraft);
router.patch(
  "/:id/publish",
  validateRequest(ideasSchemas.publishDraft),
  publishDraftHandler
);
router.patch(
  "/:id/status",
  validateRequest(ideasSchemas.patchIdeaStatus),
  patchIdeaStatus
);
router.delete("/:id", validateRequest(ideasSchemas.deleteIdeaById), deleteIdeaById);
router.get("/:id", validateRequest(ideasSchemas.getIdeaById), getIdeaByIdHandler);


export default router;
