import { Router, Request, Response } from "express";

import {
  createOutcome,
  getAllOutcomes,
  getOutcomesByExperimentId
} from "../services/outcomes.service";

const router = Router();


// POST /outcomes
router.post("/", (req: Request, res: Response) => {

  try {

    const { experimentId, result, notes } = req.body;

    if (!experimentId || !result) {
      return res.status(400).json({
        success: false,
        message: "experimentId and result are required",
      });
    }

    const outcome = createOutcome(
      experimentId,
      result,
      notes
    );

    res.status(201).json({
      success: true,
      data: outcome,
    });

  } catch {

    res.status(500).json({
      success: false,
      message: "Failed to create outcome",
    });

  }

});


// GET /outcomes
router.get("/", (_req: Request, res: Response) => {

  const outcomes = getAllOutcomes();

  res.json({
    success: true,
    data: outcomes,
  });

});


// GET /outcomes/:experimentId
router.get("/:experimentId", (req: Request, res: Response) => {

  const experimentId = Number(req.params.experimentId);

  const outcomes = getOutcomesByExperimentId(experimentId);

  res.json({
    success: true,
    data: outcomes,
  });

});

export default router;
