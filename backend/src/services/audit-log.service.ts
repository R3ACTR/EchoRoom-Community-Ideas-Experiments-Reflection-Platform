import { stateTransitionAuditLogs } from "../data/audit-log.data";

export type StateTransitionEntity = "idea" | "experiment";

export interface StateTransitionAuditLog {
  id: number;
  entityType: StateTransitionEntity;
  entityId: number;
  previousState: string;
  newState: string;
  userId: string;
  timestamp: string;
  goal: string;
}

let nextAuditLogId = 1;

export interface RecordStateTransitionInput {
  entityType: StateTransitionEntity;
  entityId: number;
  previousState: string;
  newState: string;
  userId?: string;
  goal?: string;
  timestamp?: string;
}

export const recordStateTransition = (
  input: RecordStateTransitionInput
): StateTransitionAuditLog => {
  const entry: StateTransitionAuditLog = {
    id: nextAuditLogId++,
    entityType: input.entityType,
    entityId: input.entityId,
    previousState: input.previousState,
    newState: input.newState,
    userId: input.userId?.trim() || "anonymous",
    timestamp: input.timestamp ?? new Date().toISOString(),
    goal: input.goal?.trim() || "",
  };

  stateTransitionAuditLogs.push(entry);
  return entry;
};

export const getStateTransitionAuditLogs = (): StateTransitionAuditLog[] => {
  return stateTransitionAuditLogs;
};
