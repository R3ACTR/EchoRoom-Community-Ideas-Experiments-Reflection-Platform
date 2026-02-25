import { Router, Request, Response } from "express";
import { validateRequest } from "../middleware/validate.middleware";
import { outcomesSchemas } from "../validation/request.schemas";

import {
  createOutcome,
  getAllOutcomes,
  getOutcomesByExperimentId,
  updateOutcomeResult
} from "../services/outcomes.service";

const router = Router();


// POST /outcomes
router.post("/", validateRequest(outcomesSchemas.create), (req: Request, res: Response) => {
  void (async () => {
    try {
      const { experimentId, result, notes } = req.body;
      const outcome = await createOutcome(experimentId, result, notes);

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


// GET /outcomes/:experimentId
router.get("/:experimentId", validateRequest(outcomesSchemas.listByExperiment), (req: Request, res: Response) => {
  void (async () => {
    try {
      const { experimentId } = req.params;
      const outcomes = await getOutcomesByExperimentId(experimentId);

      res.json({
        success: true,
        data: outcomes,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch outcomes",
      });
    }
  })();
});
router.put("/:id", validateRequest(outcomesSchemas.updateResult), (req: Request, res: Response) => {
  void (async () => {
    try {
      const { id } = req.params;
      const { result } = req.body;

      const updated = await updateOutcomeResult(id, result);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Outcome not found",
        });
      }

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
