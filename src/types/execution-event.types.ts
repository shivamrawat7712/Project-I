export type ExecutionEventType =
  | "WORKFLOW_STARTED"
  | "STEP_STARTED"
  | "STEP_COMPLETED"
  | "STEP_FAILED"
  | "WORKFLOW_COMPLETED"
  | "WORKFLOW_FAILED";

export interface ExecutionEvent {
  readonly eventId: string;
  readonly workflowId: string;
  readonly stepId?: string;
  readonly type: ExecutionEventType;
  readonly timestamp: number;
  readonly details?: Record<string, unknown>;
}