import {
    validateWorkflow,
    WorkflowValidationError,
  } from "../engine/workflow-validator.js";
  
  import { customerWorkflow } from "../workflows/customer-workflow.js";
  
  function testInvalidWorkflow(
    name: string,
    workflow: typeof customerWorkflow
  ): void {
    try {
      validateWorkflow(workflow);
  
      console.log(`❌ ${name}: Unexpectedly passed`);
  
    } catch (error) {
      if (error instanceof WorkflowValidationError) {
        console.log(`✅ ${name}: Correctly rejected`);
  
        for (const issue of error.issues) {
          console.log(`   - ${issue}`);
        }
      } else {
        throw error;
      }
    }
  }
  
  // Test 1: Valid workflow
  validateWorkflow(customerWorkflow);
  console.log("✅ Valid workflow accepted");
  
  // Test 2: Missing workflow ID
  testInvalidWorkflow("Missing workflow ID", {
    ...customerWorkflow,
    id: "",
  });
  
  // Test 3: Empty workflow
  testInvalidWorkflow("Empty workflow", {
    ...customerWorkflow,
    steps: [],
  });
  
  // Test 4: Duplicate step IDs
  const firstStep = customerWorkflow.steps[0];
  
  if (!firstStep) {
    throw new Error("Test workflow has no first step.");
  }
  
  testInvalidWorkflow("Duplicate step IDs", {
    ...customerWorkflow,
    steps: [
      firstStep,
      { ...firstStep },
    ],
  });
  
  // Test 5: Missing tool name
  testInvalidWorkflow("Missing tool name", {
    ...customerWorkflow,
    steps: [
      {
        ...firstStep,
        toolName: "",
      },
    ],
  });