import type { WorkflowDefinition } from "../types/workflow.types.js";

export class WorkflowValidationError extends Error {
  constructor(public readonly issues: string[]) {
    super(
      `Invalid workflow:\n${issues
        .map((issue) => `- ${issue}`)
        .join("\n")}`
    );

    this.name = "WorkflowValidationError";
  }
}

export function validateWorkflow(
  workflow: WorkflowDefinition
): void {
  const issues: string[] = [];

  // 1. Validate workflow ID.
  if (
    typeof workflow.id !== "string" ||
    workflow.id.trim() === ""
  ) {
    issues.push("Workflow ID must be present.");
  }

  // 2. Validate workflow steps.
  if (
    !Array.isArray(workflow.steps) ||
    workflow.steps.length === 0
  ) {
    issues.push("Workflow must contain at least one step.");
  } else {
    const stepIds = new Set<string>();

    for (const [index, step] of workflow.steps.entries()) {
      // Validate step ID.
      if (
        typeof step.id !== "string" ||
        step.id.trim() === ""
      ) {
        issues.push(`Step ${index + 1} must have a valid ID.`);
      } else {
        if (stepIds.has(step.id)) {
          issues.push(`Duplicate step ID: ${step.id}`);
        }

        stepIds.add(step.id);
      }

      // Validate tool name.
      if (
        typeof step.toolName !== "string" ||
        step.toolName.trim() === ""
      ) {
        issues.push(
          `Step ${index + 1} must have a valid tool name.`
        );
      }
    }
  }

  // Reject workflow if any validation issue exists.
  if (issues.length > 0) {
    throw new WorkflowValidationError(issues);
  }
}