import { Router } from "express";
import { toggleLike, getIdeaLikes } from "../controllers/likes.controller";
import { authenticate, optionalAuth } from "../middleware/auth";

const router = Router();

// Toggle like on an idea (requires auth)
router.post("/:id", authenticate, toggleLike);

// Get likes for an idea (public, but returns user status if logged in)
router.get("/:id", optionalAuth, getIdeaLikes);

export default router;
