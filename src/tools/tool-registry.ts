import type { Tool } from "./tool.interface.js";

export class ToolRegistry {
  private tools: Map<string, Tool> = new Map();

  register(tool: Tool): void {
    if (this.tools.has(tool.name)) {
      throw new Error(`Tool already registered: ${tool.name}`);
    }

    this.tools.set(tool.name, tool);
  }

  get(toolName: string): Tool {
    const tool = this.tools.get(toolName);

    if (!tool) {
      throw new Error(`Tool not found: ${toolName}`);
    }

    return tool;
  }

  has(toolName: string): boolean {
    return this.tools.has(toolName);
  }
}