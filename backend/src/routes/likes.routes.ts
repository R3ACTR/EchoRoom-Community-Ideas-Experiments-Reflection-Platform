import { Router } from "express";
import { toggleLike, getIdeaLikes } from "../controllers/likes.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

// Toggle like on an idea (requires auth)
router.post("/:id", authenticate, toggleLike);

// Get likes for an idea (public)
router.get("/:id", getIdeaLikes);

export default router;
