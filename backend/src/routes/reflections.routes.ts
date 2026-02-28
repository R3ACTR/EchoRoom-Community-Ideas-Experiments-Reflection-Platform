import { Router } from "express";
import { validateRequest } from "../middleware/validate.middleware";
import { reflectionsSchemas } from "../validation/request.schemas";
import {
  getReflections,
  getReflectionsByOutcome,
  postReflection,
  getReflectionByIdController,
  exportReflectionPDFController,
} from "../controllers/reflections.controller";

const router = Router();

router.post("/", validateRequest(reflectionsSchemas.create), postReflection);
router.get("/", getReflections);
router.get(
  "/id/:id",
  validateRequest(reflectionsSchemas.getById),
  getReflectionByIdController
);
router.get(
  "/export/:id",
  exportReflectionPDFController
);
router.get(
  "/:outcomeId",
  validateRequest(reflectionsSchemas.listByOutcome),
  getReflectionsByOutcome
);

export default router;
