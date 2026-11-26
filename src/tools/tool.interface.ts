import type { ExecutionContext } from "../engine/execution-context.js";

export interface Tool {
  name: string;

  description: string;

  execute(
    args: Record<string, unknown>,
    context: ExecutionContext
  ): Promise<unknown> | unknown;
}