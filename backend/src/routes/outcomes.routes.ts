import { Router, Request, Response } from "express";
import { validateRequest } from "../middleware/validate.middleware";
import { outcomesSchemas } from "../validation/request.schemas";
import { authenticate, AuthRequest } from "../middleware/auth";

import {
  createOutcome,
  getAllOutcomes,
  getOutcomesByExperimentId,
  updateOutcome,
  getOutcomeAnalytics,
  getOutcomeById
} from "../services/outcomes.service";

const router = Router();

// POST /outcomes
router.post("/", authenticate, validateRequest(outcomesSchemas.create), (req: AuthRequest, res: Response) => {
  void (async () => {
    try {
      const { experimentId, result, notes, impactLevel, wasExpected } = req.body;

      const outcome = await createOutcome(
        experimentId,
        result,
        notes,
        impactLevel,
        wasExpected,
        req.userId
      );

      return res.status(201).json({
        success: true,
        data: outcome,
      });
    } catch {
      res.status(500).json({
        success: false,
        message: "Failed to create outcome",
      });
    }
  })();
});

// GET /outcomes
router.get("/", (_req: Request, res: Response) => {
  void (async () => {
    try {
      const outcomes = await getAllOutcomes();
      return res.json({
        success: true,
        count: outcomes.length,
        data: outcomes,
      });
    } catch {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch outcomes",
      });
    }
  })();
});

// GET /outcomes/analytics
router.get("/analytics", async (_req: Request, res: Response) => {
  try {
    const analytics = await getOutcomeAnalytics();

    return res.json({
      success: true,
      data: analytics,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
});

// GET /outcomes/:experimentId
router.get(
  "/:experimentId",
  validateRequest(outcomesSchemas.listByExperiment),
  (req: Request, res: Response) => {
    void (async () => {
      try {
        const { experimentId } = req.params;
        const outcomes = await getOutcomesByExperimentId(experimentId);

        res.json({
          success: true,
          data: outcomes,
        });
      } catch {
        return res.status(500).json({
          success: false,
          message: "Failed to fetch outcomes",
        });
      }
    })();
  }
);

// PUT /outcomes/:id
router.put("/:id", authenticate, validateRequest(outcomesSchemas.update), (req: AuthRequest, res: Response) => {
  void (async () => {
    try {
      const { id } = req.params;
      const { result, notes, impactLevel, wasExpected } = req.body;

      const existing = await getOutcomeById(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Outcome not found",
        });
      }

      if (
        existing.authorId !== req.userId &&
        req.user?.role !== "ADMIN" &&
        req.user?.role !== "MODERATOR"
      ) {
        return res.status(403).json({ success: false, message: "Permission denied" });
      }

      const updated = await updateOutcome(id, {
        result,
        notes,
        impactLevel,
        wasExpected,
      });

      return res.json({
        success: true,
        data: updated,
      });
    } catch {
      return res.status(500).json({
        success: false,
        message: "Failed to update outcome",
      });
    }
  })();
});

export default router;