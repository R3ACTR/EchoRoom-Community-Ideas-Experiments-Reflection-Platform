import { NextFunction, Request, Response } from "express";

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
  const message =
    error instanceof Error ? error.message : "Internal server error";

  console.error(error);

  res.status(500).json({
    success: false,
    message,
  });
};
