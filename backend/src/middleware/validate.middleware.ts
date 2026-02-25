import { NextFunction, Request, RequestHandler, Response } from "express";
import { ZodTypeAny, z } from "zod";

type RequestSchemas = {
  body?: ZodTypeAny;
  params?: ZodTypeAny;
  query?: ZodTypeAny;
};

export const validateRequest = (schemas: RequestSchemas): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as Request["params"];
      }

      if (schemas.query) {
        req.query = schemas.query.parse(req.query) as Request["query"];
      }

      if (schemas.body) {
        req.body = schemas.body.parse(req.body) as Request["body"];
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const numericIdParamSchema = (fieldName = "id") =>
  z.object({
    [fieldName]: z
      .string()
      .regex(/^\d+$/, `${fieldName} must be a valid numeric ID`),
  });
