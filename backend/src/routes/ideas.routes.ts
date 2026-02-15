import { Router, Request, Response } from "express";
import {
  getAllIdeas,
  createIdea,
  updateIdeaStatus,
  IdeaStatus
} from "../services/ideas.service";

const router = Router();

// GET /ideas
router.get("/", (req: Request, res: Response) => {
  try {
    const ideas = getAllIdeas();

    res.json({
      success: true,
      ideas,
    });

  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch ideas",
    });
  }
});

// POST /ideas
router.post("/", (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const newIdea = createIdea(title, description);

    res.status(201).json({
      success: true,
      idea: newIdea,
    });

  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to create idea",
    });
  }
});

// PATCH /ideas/:id/status
router.patch("/:id/status", (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body as { status: IdeaStatus };

    const updatedIdea = updateIdeaStatus(id, status);

    if (!updatedIdea) {
      return res.status(404).json({
        success: false,
        message: "Idea not found",
      });
    }

    res.json({
      success: true,
      idea: updatedIdea,
    });

  } catch (error: any) {

    if (error.message.includes("Invalid transition")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update idea status",
    });
  }
});

export default router;
