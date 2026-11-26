import { ExecutionState } from "../engine/execution-state.js";
import { customerWorkflow } from "../workflows/customer-workflow.js";

const state = new ExecutionState(customerWorkflow);

console.log("INITIAL STATE");
console.log(JSON.stringify(state.getSnapshot(), null, 2));

state.startWorkflow();

state.startStep("read-customer");
state.completeStep("read-customer");

state.startStep("validate-customer");
state.failStep("validate-customer");

state.failWorkflow();

console.log("\nFINAL STATE");
console.log(JSON.stringify(state.getSnapshot(), null, 2));