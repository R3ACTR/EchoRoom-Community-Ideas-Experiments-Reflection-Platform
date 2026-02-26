import { Router } from "express";
import { validateRequest } from "../middleware/validate.middleware";
import { experimentsSchemas } from "../validation/request.schemas";
import { authenticate } from "../middleware/auth";
import {
  getExperiment,
  getExperiments,
  postExperiment,
  putExperiment,
  removeExperiment,
} from "../controllers/experiments.controller";

const router = Router();

router.get("/", getExperiments);
router.get("/:id", validateRequest(experimentsSchemas.getById), getExperiment);
router.post("/", authenticate, validateRequest(experimentsSchemas.create), postExperiment);
router.put("/:id", authenticate, validateRequest(experimentsSchemas.update), putExperiment);
router.delete("/:id", authenticate, validateRequest(experimentsSchemas.remove), removeExperiment);

export default router;
