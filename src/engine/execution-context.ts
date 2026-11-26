export class ExecutionContext {
    private outputs: Map<string, unknown> = new Map();
  
    constructor(
      public readonly workflowId: string
    ) {}
  
    setStepOutput(stepId: string, output: unknown): void {
      this.outputs.set(stepId, output);
    }
  
    getStepOutput(stepId: string): unknown {
      return this.outputs.get(stepId);
    }
  
    hasStepOutput(stepId: string): boolean {
      return this.outputs.has(stepId);
    }
  }