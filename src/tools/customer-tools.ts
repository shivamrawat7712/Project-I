import type { Tool } from "./tool.interface.js";

// Simulated customer data

interface Customer {
  id: string;
  name: string;
  address: string;
}

const customers = new Map<string, Customer>([
  [
    "C101",
    {
      id: "C101",
      name: "Rahul",
      address: "Dehradun"
    }
  ]
]);

// Helper for checking unknown objects

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

// Tool 1: Retrieve customer

export const getCustomerTool: Tool = {
  name: "getCustomer",

  description: "Retrieves a customer using their ID.",

  execute(args) {
    const customerId = args.customerId;

    if (typeof customerId !== "string") {
      throw new Error("Invalid customer ID.");
    }

    const customer = customers.get(customerId);

    if (!customer) {
      throw new Error(`Customer not found: ${customerId}`);
    }

    return { ...customer };
  }
};

// Tool 2: Validate customer

export const validateCustomerTool: Tool = {
  name: "validateCustomer",

  description: "Validates a previously retrieved customer.",

  execute(_args, context) {
    const customer = context.getStepOutput("read-customer");

    if (!isRecord(customer)) {
      throw new Error("Customer data is missing or invalid.");
    }

    if (
      typeof customer.id !== "string" ||
      typeof customer.name !== "string" ||
      typeof customer.address !== "string"
    ) {
      throw new Error("Customer validation failed.");
    }

    return {
      ...customer,
      validated: true
    };
  }
};

// Tool 3: Update customer

export const updateCustomerTool: Tool = {
  name: "updateCustomer",

  description: "Updates a customer's address.",

  execute(args, context) {
    const customer = context.getStepOutput("validate-customer");

    if (!isRecord(customer) || customer.validated !== true) {
      throw new Error("Customer must be validated before updating.");
    }

    const newAddress = args.newAddress;

    if (typeof newAddress !== "string" || newAddress.trim() === "") {
      throw new Error("A valid new address is required.");
    }

    const customerId = customer.id;

    if (typeof customerId !== "string") {
      throw new Error("Invalid customer ID in execution context.");
    }

    const existingCustomer = customers.get(customerId);

    if (!existingCustomer) {
      throw new Error("Customer no longer exists.");
    }

    const updatedCustomer: Customer = {
      ...existingCustomer,
      address: newAddress
    };

    customers.set(customerId, updatedCustomer);

    return { ...updatedCustomer };
  }
};