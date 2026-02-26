import { NextFunction, Request, Response } from "express";
import {
  createReflection,
  getAllReflections,
  getReflectionsByOutcomeId,
  getReflectionById,
} from "../services/reflections.service";

export const postReflection = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  void (async () => {
    try {
      const {
        outcomeId,
        context,
        breakdown,
        growth,
        result,
        tags,
        evidenceLink,
        visibility,
      } = req.body;

      const reflection = await createReflection({
        outcomeId: String(outcomeId),
        context,
        breakdown,
        growth,
        result,
        tags,
        evidenceLink,
        visibility,
      });

      res.status(201).json({
        success: true,
        data: reflection,
      });
    } catch (error) {
      next(error);
    }
  })();
};

export const getReflections = (
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  void (async () => {
    try {
      const reflections = await getAllReflections();

      res.json({
        success: true,
        count: reflections.length,
        data: reflections,
      });
    } catch (error) {
      next(error);
    }
  })();
};

export const getReflectionsByOutcome = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  void (async () => {
    try {
      const { outcomeId } = req.params;
      const reflections = await getReflectionsByOutcomeId(outcomeId);

      res.json({
        success: true,
        data: reflections,
      });
    } catch (error) {
      next(error);
    }
  })();
};

export const getReflectionByIdController = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  void (async () => {
    try {
      const { id } = req.params;
      const reflection = await getReflectionById(id);

      if (!reflection) {
        res.status(404).json({
          success: false,
          message: "Reflection not found",
        });
        return;
      }

      res.json({
        success: true,
        data: reflection,
      });
    } catch (error) {
      next(error);
    }
  })();
};
