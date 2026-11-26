import type {
    WorkflowDefinition,
    WorkflowStatus,
    StepStatus,
  } from "../types/workflow.types.js";
  
  export interface ExecutionStateSnapshot {
    workflowId: string;
    workflowStatus: WorkflowStatus;
    stepStatuses: Record<string, StepStatus>;
  }
  
  export class ExecutionState {
    private workflowStatus: WorkflowStatus = "pending";
  
    private stepStatuses: Map<string, StepStatus> = new Map();
  
    constructor(workflow: WorkflowDefinition) {
      // Initialize every workflow step as pending.
      this.workflowId = workflow.id;
      for (const step of workflow.steps) {
        if (this.stepStatuses.has(step.id)) {
          throw new Error(`Duplicate step ID: ${step.id}`);
        }
  
        this.stepStatuses.set(step.id, "pending");
      }
    }
  
    startWorkflow(): void {
      if (this.workflowStatus !== "pending") {
        throw new Error("Workflow cannot be started.");
      }
  
      this.workflowStatus = "running";
    }
  
    completeWorkflow(): void {
      if (this.workflowStatus !== "running") {
        throw new Error("Workflow is not running.");
      }
  
      const allCompleted = Array.from(
        this.stepStatuses.values()
      ).every((status) => status === "completed");
  
      if (!allCompleted) {
        throw new Error(
          "Cannot complete workflow: some steps are unfinished."
        );
      }
  
      this.workflowStatus = "completed";
    }
  
    failWorkflow(): void {
      if (this.workflowStatus !== "running") {
        throw new Error("Workflow is not running.");
      }
  
      this.workflowStatus = "failed";
    }
  
    startStep(stepId: string): void {
      this.transitionStep(stepId, "pending", "running");
    }
  
    completeStep(stepId: string): void {
      this.transitionStep(stepId, "running", "completed");
    }
  
    failStep(stepId: string): void {
      this.transitionStep(stepId, "running", "failed");
    }
  
    private transitionStep(
      stepId: string,
      expectedStatus: StepStatus,
      newStatus: StepStatus
    ): void {
      if (this.workflowStatus !== "running") {
        throw new Error("Cannot update steps when workflow is not running.");
      }
  
      const currentStatus = this.stepStatuses.get(stepId);
  
      if (currentStatus === undefined) {
        throw new Error(`Unknown step ID: ${stepId}`);
      }
  
      if (currentStatus !== expectedStatus) {
        throw new Error(
          `Invalid transition for ${stepId}: ${currentStatus} → ${newStatus}`
        );
      }
  
      this.stepStatuses.set(stepId, newStatus);
    }
  
    getSnapshot(): ExecutionStateSnapshot {
      return {
        workflowId: this.workflowId,
        workflowStatus: this.workflowStatus,
        stepStatuses: Object.fromEntries(this.stepStatuses),
      };
    }
  
    private readonly workflowId: string;
  }