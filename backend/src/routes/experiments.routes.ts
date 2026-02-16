import { Router } from "express";
import {
  getExperiment,
  getExperiments,
  postExperiment,
  putExperiment,
  removeExperiment,
} from "../controllers/experiments.controller";

const router = Router();

router.get("/", getExperiments);
router.get("/:id", getExperiment);
router.post("/", postExperiment);
router.put("/:id", putExperiment);
router.delete("/:id", removeExperiment);

export default router;
