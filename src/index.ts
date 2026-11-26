import { WorkflowEngine } from "./engine/workflow-engine.js";

import { ToolRegistry } from "./tools/tool-registry.js";

import {
  getCustomerTool,
  validateCustomerTool,
  updateCustomerTool
} from "./tools/customer-tools.js";

import { customerWorkflow } from "./workflows/customer-workflow.js";

// 1. Initialize tool registry

const registry = new ToolRegistry();

// 2. Register available tools

registry.register(getCustomerTool);
registry.register(validateCustomerTool);
registry.register(updateCustomerTool);

// 3. Initialize workflow engine

const engine = new WorkflowEngine(registry);

// 4. Execute workflow

const result = await engine.execute(customerWorkflow);

// 5. Display final execution result

console.log("\n========== EXECUTION RESULT ==========");

console.log(JSON.stringify(result, null, 2));

console.log("======================================");