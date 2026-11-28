# Project-I
Project-I is the final year academic project in supervision of an industry professional.

**Title: A Self-Healing Execution Framework for Reliable Tool-Using AI Agents.**
<br>

**Abstract of Problem Statement**
<br>
AI agents are increasingly being designed to execute multi-step tasks by calling APIs, querying databases, invoking external tools, and coordinating multiple operations. However, these agents can fail because of incorrect tool selection, malformed arguments, unexpected API responses, incomplete execution, or errors introduced by earlier steps. In multi-step workflows, a small error can propagate through subsequent actions, making it difficult to determine the cause of failure or recover safely.
The proposed project aims to develop a self-healing execution framework that detects, diagnoses, and recovers from failures in tool-using AI agents. Instead of allowing an agent to repeatedly retry a failed operation, the framework will maintain an execution trace containing tool calls, inputs, outputs, errors, and intermediate decisions. A recovery controller will classify failures and select appropriate strategies, such as correcting arguments, retrieving missing information, retrying transient errors, selecting an alternative tool, or requesting human approval.
The system will include a controlled execution environment in which agents perform predefined multi-step tasks involving APIs and structured data. A conventional agent without recovery mechanisms will serve as the baseline. The proposed framework will be evaluated using task-completion rate, recovery success rate, unnecessary retry frequency, execution cost, and average completion time. This problem is relevant because dependable execution is a major challenge in moving AI agents from demonstrations to practical software systems. The project will investigate whether structured error handling and evidence-based recovery can improve agent reliability without requiring continuous human intervention.
The implementation will begin with a Node.js workflow engine and simulated tool APIs. Subsequent stages will introduce an AI-based failure classifier, recovery policies, and automated evaluation. This creates a measurable research project involving backend engineering, state management, agent orchestration, and applied AI.

