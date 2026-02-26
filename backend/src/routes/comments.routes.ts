import { Router } from "express";
import { getCommentsHandler, postCommentHandler } from "../controllers/comments.controller";
import { authenticate } from "../middleware/auth";
import { validateRequest } from "../middleware/validate.middleware";
import { commentsSchemas } from "../validation/request.schemas";

// We'll define these in a way that ideaId is available from the URL
const router = Router({ mergeParams: true });

router.get("/", validateRequest(commentsSchemas.list), getCommentsHandler);
router.post(
  "/",
  authenticate,
  validateRequest(commentsSchemas.create),
  postCommentHandler
);

export default router;
