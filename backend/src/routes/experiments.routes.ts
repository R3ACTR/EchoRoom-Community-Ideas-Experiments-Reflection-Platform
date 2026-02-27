import { Router } from "express";
import { validateRequest } from "../middleware/validate.middleware";
import { experimentsSchemas } from "../validation/request.schemas";
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
router.post("/", validateRequest(experimentsSchemas.create), postExperiment);
router.put("/:id", validateRequest(experimentsSchemas.update), putExperiment);
router.delete("/:id", validateRequest(experimentsSchemas.remove), removeExperiment);

export default router;
