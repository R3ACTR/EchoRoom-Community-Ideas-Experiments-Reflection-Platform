import { NextFunction, Request, Response } from "express";
import {
  createExperiment,
  deleteExperiment,
  getProgressForExperimentStatus,
  getAllExperiments,
  getExperimentById,
  updateExperiment,
  Experiment,
} from "../services/experiments.service";

const toExperimentResponse = (experiment: Experiment) => ({
  ...experiment,
  progress: getProgressForExperimentStatus(experiment.status),
});

export const getExperiments = (
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  void (async () => {
    try {
      const experiments = await getAllExperiments();
      res.json({
        success: true,
        data: experiments.map(toExperimentResponse),
      });
    } catch (error) {
      next(error);
    }
  })();
};

export const getExperiment = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  void (async () => {
    try {
      const { id } = req.params;

      const experiment = await getExperimentById(id);
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
  })();
};

export const postExperiment = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  void (async () => {
    try {
      const {
        title,
        description,
        hypothesis,
        successMetric,
        falsifiability,
        status,
        endDate,
        linkedIdeaId,
      } = req.body;

      const experiment = await createExperiment(
        String(title),
        String(description),
        String(hypothesis),
        String(successMetric),
        String(falsifiability),
        status,
        String(endDate),
        linkedIdeaId ? String(linkedIdeaId) : undefined
      );

      res.status(201).json({
        success: true,
        data: toExperimentResponse(experiment),
      });
    } catch (error) {
      next(error);
    }
  })();
};

export const putExperiment = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  void (async () => {
    try {
      const { id } = req.params;

      const updatedExperiment = await updateExperiment(id, req.body);
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
  })();
};

export const removeExperiment = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  void (async () => {
    try {
      const { id } = req.params;

      const deleted = await deleteExperiment(id);

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
  })();
};
