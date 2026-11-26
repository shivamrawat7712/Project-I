import type { ExecutionEvent } from "./execution-event.types.js";
import type { ExecutionStateSnapshot } from "../engine/execution-state.js";

export type WorkflowStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed";

export type StepStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed";

export interface WorkflowStep {
  id: string;
  toolName: string;
  description: string;
  args: Record<string, unknown>;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
}

export interface StepResult {
  stepId: string;
  toolName: string;
  status: StepStatus;
  output?: unknown;
  error?: string;
  startedAt: number;
  finishedAt: number;
}

export interface WorkflowResult {
    workflowId: string;
    status: WorkflowStatus;
    stepResults: StepResult[];
    trace: ExecutionEvent[];
    executionState: ExecutionStateSnapshot;
    startedAt: number;
    finishedAt: number;
  }