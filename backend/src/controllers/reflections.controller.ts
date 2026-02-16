import { NextFunction, Request, Response } from "express";
import {
  createReflection,
  getAllReflections,
  getReflectionsByOutcomeId,
} from "../services/reflections.service";

export const postReflection = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { outcomeId, content } = req.body;

    if (!outcomeId || !content) {
      res.status(400).json({
        success: false,
        message: "outcomeId and content are required",
      });
      return;
    }

    const reflection = createReflection(Number(outcomeId), String(content));

    res.status(201).json({
      success: true,
      data: reflection,
    });
  } catch (error) {
    next(error);
  }
};

export const getReflections = (
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const reflections = getAllReflections();

    res.json({
      success: true,
      count: reflections.length,
      data: reflections,
    });
  } catch (error) {
    next(error);
  }
};

export const getReflectionsByOutcome = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const outcomeId = Number(req.params.outcomeId);

    if (Number.isNaN(outcomeId)) {
      res.status(400).json({
        success: false,
        message: "Invalid outcomeId",
      });
      return;
    }

    const reflections = getReflectionsByOutcomeId(outcomeId);

    res.json({
      success: true,
      data: reflections,
    });
  } catch (error) {
    next(error);
  }
};
