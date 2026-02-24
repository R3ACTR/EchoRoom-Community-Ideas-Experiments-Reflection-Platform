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

    // Basic required validation
    if (
      outcomeId === undefined ||
      !context ||
      !breakdown ||
      !growth ||
      !result ||
      !visibility
    ) {
      res.status(400).json({
        success: false,
        message: "Missing required reflection fields",
      });
      return;
    }

    // Number validation
    if (
      context.emotionBefore < 1 ||
      context.emotionBefore > 5 ||
      result.emotionAfter < 1 ||
      result.emotionAfter > 5 ||
      context.confidenceBefore < 1 ||
      context.confidenceBefore > 10 ||
      result.confidenceAfter < 1 ||
      result.confidenceAfter > 10
    ) {
      res.status(400).json({
        success: false,
        message: "Emotion or confidence values out of range",
      });
      return;
    }

    // Required text validation
    if (
      !breakdown.whatHappened?.trim() ||
      !breakdown.whatWorked?.trim() ||
      !breakdown.whatDidntWork?.trim() ||
      !breakdown.surprises?.trim() ||
      !growth.lessonLearned?.trim() ||
      !growth.nextAction?.trim()
    ) {
      res.status(400).json({
        success: false,
        message: "Reflection text fields cannot be empty",
      });
      return;
    }

    const reflection = createReflection({
      outcomeId: Number(outcomeId),
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

export const getReflectionByIdController = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid reflection id",
      });
      return;
    }

    const reflection = getReflectionById(id);

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
};