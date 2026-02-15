import { Router, Request, Response } from "express";

import {
  getAllExperiments,
  getExperimentById,
  createExperiment,
  updateExperiment,
  deleteExperiment,
  ExperimentStatus
} from "../services/experiments.service";

const router = Router();


// GET all experiments
router.get("/", (req: Request, res: Response) => {

  const experiments = getAllExperiments();

  res.json({
    success: true,
    data: experiments,
  });

});


// GET experiment by ID
router.get("/:id", (req: Request, res: Response) => {

  const id = Number(req.params.id);

  const experiment = getExperimentById(id);

  if (!experiment) {
    return res.status(404).json({
      success: false,
      message: "Experiment not found",
    });
  }

  res.json({
    success: true,
    data: experiment,
  });

});


// CREATE experiment
router.post("/", (req: Request, res: Response) => {

  const { title, description, status } = req.body;

  if (!title || !description || !status) {
    return res.status(400).json({
      success: false,
      message: "title, description, and status are required",
    });
  }

  const newExperiment = createExperiment(
    title,
    description,
    status as ExperimentStatus
  );

  res.status(201).json({
    success: true,
    data: newExperiment,
  });

});


// UPDATE experiment
router.put("/:id", (req: Request, res: Response) => {

  const id = Number(req.params.id);

  const updatedExperiment = updateExperiment(id, req.body);

  if (!updatedExperiment) {
    return res.status(404).json({
      success: false,
      message: "Experiment not found",
    });
  }

  res.json({
    success: true,
    data: updatedExperiment,
  });

});


// DELETE experiment
router.delete("/:id", (req: Request, res: Response) => {

  const id = Number(req.params.id);

  const deleted = deleteExperiment(id);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: "Experiment not found",
    });
  }

  res.json({
    success: true,
    message: "Experiment deleted",
  });

});

export default router;
