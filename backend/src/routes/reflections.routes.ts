import { Router, Request, Response } from "express";

const router = Router();

// Reflection model
interface Reflection {
  id: number;
  outcomeId: number;
  content: string;
  createdAt: Date;
}

// Temporary storage
let reflections: Reflection[] = [];
let nextId = 1;


/**
 * POST /reflections
 * Create a reflection
 */
router.post("/", (req: Request, res: Response) => {
  try {
    const { outcomeId, content } = req.body;

    if (!outcomeId || !content) {
      return res.status(400).json({
        success: false,
        message: "outcomeId and content are required",
      });
    }

    const newReflection: Reflection = {
      id: nextId++,
      outcomeId,
      content,
      createdAt: new Date(),
    };

    reflections.push(newReflection);

    res.status(201).json({
      success: true,
      reflection: newReflection,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create reflection",
    });
  }
});


/**
 * GET /reflections
 * Get all reflections
 */
router.get("/", (_req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      reflections,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch reflections",
    });
  }
});


/**
 * GET /reflections/:outcomeId
 * Get reflections for specific outcome
 */
router.get("/:outcomeId", (req: Request, res: Response) => {
  try {
    const outcomeId = Number(req.params.outcomeId);

    const result = reflections.filter(
      r => r.outcomeId === outcomeId
    );

    res.json({
      success: true,
      reflections: result,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch reflections",
    });
  }
});

export default router;
