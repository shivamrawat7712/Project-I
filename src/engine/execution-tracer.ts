import { randomUUID } from "node:crypto";
import type { ExecutionEvent } from "../types/execution-event.types.js";

type NewExecutionEvent = Omit<
  ExecutionEvent,
  "eventId" | "timestamp"
>;

export class ExecutionTracer {
  private events: ExecutionEvent[] = [];

  record(event: NewExecutionEvent): void {
    const newEvent: ExecutionEvent = {
      ...event,
      eventId: randomUUID(),
      timestamp: Date.now(),
    };

    this.events.push(newEvent);
  }

  getEvents(): ExecutionEvent[] {
    return this.events.map((event) => ({
      ...event,
      ...(event.details
        ? { details: { ...event.details } }
        : {}),
    }));
  }
}