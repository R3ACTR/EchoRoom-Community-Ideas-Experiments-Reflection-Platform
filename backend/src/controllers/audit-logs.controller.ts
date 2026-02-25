import { Request, Response } from "express";
import { getStateTransitionAuditLogs } from "../services/audit-log.service";

export const getStateTransitionLogs = (_req: Request, res: Response): void => {
  const logs = getStateTransitionAuditLogs();
  res.json({ success: true, logs });
};
