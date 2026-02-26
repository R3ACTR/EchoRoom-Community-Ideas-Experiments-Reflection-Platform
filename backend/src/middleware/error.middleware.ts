import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ConflictError } from "../lib/conflictError";

export const notFoundMiddleware = (
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
};

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(error);

  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  if (error instanceof ConflictError) {
    res.status(409).json({
      success: false,
      message: error.message,
    });
    return;
  }

  const message =
    error instanceof Error ? error.message : "Internal server error";

  res.status(500).json({
    success: false,
    message,
  });
};
