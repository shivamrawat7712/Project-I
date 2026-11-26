import type {
  WorkflowDefinition,
  WorkflowResult,
  StepResult,
} from "../types/workflow.types.js";

import { validateWorkflow } from "./workflow-validator.js";
import { ExecutionContext } from "./execution-context.js";
import { ExecutionTracer } from "./execution-tracer.js";
import { ExecutionState } from "./execution-state.js";
import { ToolRegistry } from "../tools/tool-registry.js";

export class WorkflowEngine {
  constructor(private readonly registry: ToolRegistry) {}

  async execute(
    workflow: WorkflowDefinition
  ): Promise<WorkflowResult> {
  
    // Validate workflow structure first.
    validateWorkflow(workflow);
  
    // Check whether all requested tools are registered.
    for (const step of workflow.steps) {
      if (!this.registry.has(step.toolName)) {
        throw new Error(
          `Tool not registered: ${step.toolName}`
        );
      }
    }
  
    const startedAt = Date.now();

    // Initialize our three execution components.
    const context = new ExecutionContext(workflow.id);
    const tracer = new ExecutionTracer();
    const state = new ExecutionState(workflow);

    const stepResults: StepResult[] = [];

    console.log(`\nStarting workflow: ${workflow.name}`);

    // Start workflow state.
    state.startWorkflow();

    // Record workflow start.
    tracer.record({
      workflowId: workflow.id,
      type: "WORKFLOW_STARTED",
      details: {
        workflowName: workflow.name,
      },
    });

    // Execute workflow steps sequentially.
    for (const step of workflow.steps) {

      const stepStartedAt = Date.now();

      console.log(`\nExecuting step: ${step.id}`);

      // Update state and record step start.
      state.startStep(step.id);

      tracer.record({
        workflowId: workflow.id,
        stepId: step.id,
        type: "STEP_STARTED",
        details: {
          toolName: step.toolName,
        },
      });

      try {

        // Find the requested tool.
        const tool = this.registry.get(step.toolName);

        // Execute the tool.
        const output = await tool.execute(
          step.args,
          context
        );

        // Store the output for subsequent steps.
        context.setStepOutput(step.id, output);

        // Update step state.
        state.completeStep(step.id);

        // Record successful execution result.
        stepResults.push({
          stepId: step.id,
          toolName: step.toolName,
          status: "completed",
          output,
          startedAt: stepStartedAt,
          finishedAt: Date.now(),
        });

        // Record successful execution event.
        tracer.record({
          workflowId: workflow.id,
          stepId: step.id,
          type: "STEP_COMPLETED",
          details: {
            toolName: step.toolName,
          },
        });

        console.log(`Step completed: ${step.id}`);

      } catch (error) {

        const errorMessage =
          error instanceof Error
            ? error.message
            : String(error);

        // Update step state.
        state.failStep(step.id);

        // Record failed execution result.
        stepResults.push({
          stepId: step.id,
          toolName: step.toolName,
          status: "failed",
          error: errorMessage,
          startedAt: stepStartedAt,
          finishedAt: Date.now(),
        });

        // Record failure event.
        tracer.record({
          workflowId: workflow.id,
          stepId: step.id,
          type: "STEP_FAILED",
          details: {
            toolName: step.toolName,
            error: errorMessage,
          },
        });

        console.error(`Step failed: ${step.id}`);
        console.error(`Reason: ${errorMessage}`);

        // Stop executing subsequent steps.
        break;
      }
    }

    // Determine the final workflow state.
    const currentState = state.getSnapshot();

    const allStepsCompleted = Object.values(
      currentState.stepStatuses
    ).every((status) => status === "completed");

    if (allStepsCompleted) {
      state.completeWorkflow();
    } else {
      state.failWorkflow();
    }

    // Get the final state snapshot.
    const executionState = state.getSnapshot();

    // Record final workflow event.
    tracer.record({
      workflowId: workflow.id,
      type:
        executionState.workflowStatus === "completed"
          ? "WORKFLOW_COMPLETED"
          : "WORKFLOW_FAILED",
    });

    // Construct final execution result.
    const result: WorkflowResult = {
      workflowId: workflow.id,
      status: executionState.workflowStatus,
      stepResults,
      trace: tracer.getEvents(),
      executionState,
      startedAt,
      finishedAt: Date.now(),
    };

    console.log(
      `\nWorkflow status: ${executionState.workflowStatus}`
    );

    return result;
  }
}