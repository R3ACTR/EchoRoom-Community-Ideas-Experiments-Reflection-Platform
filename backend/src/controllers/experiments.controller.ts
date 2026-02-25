import { NextFunction, Request, Response } from "express";
import {
  createExperiment,
  deleteExperiment,
  getProgressForExperimentStatus,
  getAllExperiments,
  getExperimentById,
  isExperimentStatus,
  updateExperiment,
  Experiment,
} from "../services/experiments.service";
import { AuthRequest } from "../middleware/auth";

const readGoal = (value: unknown): string | undefined => {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const toExperimentResponse = (experiment: Experiment) => ({
  ...experiment,
  progress: getProgressForExperimentStatus(experiment.status),
});

export const getExperiments = (
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const experiments = getAllExperiments();
    res.json({
      success: true,
      data: experiments.map(toExperimentResponse),
    });
  } catch (error) {
    next(error);
  }
};

export const getExperiment = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid experiment ID",
      });
      return;
    }

    const experiment = getExperimentById(id);
    if (!experiment) {
      res.status(404).json({
        success: false,
        message: "Experiment not found",
      });
      return;
    }

    res.json({
      success: true,
      data: toExperimentResponse(experiment),
    });
  } catch (error) {
    next(error);
  }
};

export const postExperiment = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { title, description, hypothesis, successMetric, falsifiability, status, linkedIdeaId } = req.body;

    if (!title || !description || !hypothesis || !successMetric || !falsifiability || !status) {
      res.status(400).json({
        success: false,
        message: "title, description, hypothesis, successMetric, falsifiability, and status are required",
      });
      return;
    }

    if (!isExperimentStatus(status)) {
      res.status(400).json({
        success: false,
        message: "status must be one of: planned, in-progress, completed",
      });
      return;
    }

    const experiment = createExperiment(
      String(title),
      String(description),
      String(hypothesis),
      String(successMetric),
      String(falsifiability),
      status,
      linkedIdeaId ? Number(linkedIdeaId) : undefined
    );

    res.status(201).json({
      success: true,
      data: toExperimentResponse(experiment),
    });
  } catch (error) {
    next(error);
  }
};

export const putExperiment = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid experiment ID",
      });
      return;
    }

    if (
      Object.prototype.hasOwnProperty.call(req.body, "status") &&
      !isExperimentStatus(req.body.status)
    ) {
      res.status(400).json({
        success: false,
        message: "status must be one of: planned, in-progress, completed",
      });
      return;
    }

    const goalValue = readGoal(req.body?.goal);
    if (
      Object.prototype.hasOwnProperty.call(req.body, "goal") &&
      !goalValue
    ) {
      res.status(400).json({
        success: false,
        message: "goal must be a non-empty string",
      });
      return;
    }

    const userId = (req as AuthRequest).userId;
    const updatedExperiment = updateExperiment(id, req.body, {
      userId,
      goal: goalValue,
    });
    if (!updatedExperiment) {
      res.status(404).json({
        success: false,
        message: "Experiment not found",
      });
      return;
    }

    res.json({
      success: true,
      data: toExperimentResponse(updatedExperiment),
    });
  } catch (error) {
    next(error);
  }
};

export const removeExperiment = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid experiment ID",
      });
      return;
    }

    const deleted = deleteExperiment(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: "Experiment not found",
      });
      return;
    }

    res.json({
      success: true,
      message: "Experiment deleted",
    });

  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
