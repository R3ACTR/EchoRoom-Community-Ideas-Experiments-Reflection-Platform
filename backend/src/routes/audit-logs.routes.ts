import { Router } from "express";
import { getStateTransitionLogs } from "../controllers/audit-logs.controller";

const router = Router();

router.get("/", getStateTransitionLogs);

export default router;
