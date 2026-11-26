import type { WorkflowDefinition } from "../types/workflow.types.js";

export const customerWorkflow: WorkflowDefinition = {
  id: "TASK-001",

  name: "Customer Address Update",

  description: "Retrieve, validate, and update a customer address.",

  steps: [
    {
      id: "read-customer",
      toolName: "getCustomer",
      description: "Retrieve customer information.",
      args: {
        customerId: "C101"
      }
    },
    {
      id: "validate-customer",
      toolName: "validateCustomer",
      description: "Validate the retrieved customer information.",
      args: {}
    },
    {
      id: "update-customer",
      toolName: "updateCustomer",
      description: "Update the customer's address.",
      args: {
        newAddress: "Rishikesh"
      }
    }
  ]
};