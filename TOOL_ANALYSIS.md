# Tool Analysis: Antigravity vs. Claude Code

This report analyzes the optimal use cases for the two AI modalities available in your development ecosystem: **Antigravity** (IDE-Integrated Agent) and **Claude Code** (CLI/Terminal Agent).

## Executive Summary

| Feature | Antigravity (IDE Agent) | Claude Code (CLI Agent) |
| :--- | :--- | :--- |
| **Primary/Ideal Role** | **The Pilot** (Interactive, Orchestrator) | **The Engine** (Autonomous, Worker) |
| **Interaction Style** | Chat-based, Visual, "Human-in-the-loop" | Command-based, "Fire and Forget" |
| **Context Awareness** | High (Open tabs, cursor position, active file) | Broad (Entire repo scanning, file maps) |
| **Latency** | Low (Fast, conversational) | Medium/High (Deep thinking, longer execution) |
| **Best For...** | Planning, Debugging, UI Tweaks, Quick Q&A | Heavy Features, Large Refactors, Migrations |

---

## 1. Antigravity (The IDE Agent)
*Current Modality: You are talking to Antigravity right now.*

**Strengths:**
*   **Visual Context**: Can see precisely what you are looking at (cursor position).
*   **Zero-Friction**: No need to switch windows. Integrated directly into VS Code.
*   **Safety**: Steps are often guarded by explicit "Approve" buttons (depending on config).
*   **Orchestration**: Ideal for running workflows (`/plan`, `/save`) that coordinate other tools.

**Best Use Cases:**
*   **"The Architect" Workflow**: Defining PRDs, clarifying requirements.
*   **"The Pilot" Workflow**: Fixing a specific bug visible on screen, adjusting CSS, renaming variables.
*   **Review**: explaining code that is currently open.

**Weaknesses:**
*   **Session Context**: Sometimes loses "thread" if the conversation gets too long (requires `/start-session` refresh).
*   **Multitasking**: Generally single-threaded (you wait for it to finish).

---

## 2. Claude Code (The CLI Agent)
*Current Modality: Running `claude` in the terminal.*

**Strengths:**
*   **Autonomy**: Can be given a vague goal ("Refactor the entire auth system") and left alone for 20 minutes.
*   **Tool Power**: access to specialized terminal tools and larger context windows often optimized for broad repo understanding.
*   **Backgrounding**: Can run in a background terminal tab while you continue working in the IDE.

**Best Use Cases:**
*   **"Heavy Coder" Workflow**: Implementing a full feature from a text spec.
*   **"The Researcher" Workflow**: "Read the docs for Library X and summarize how it changes our auth flow."
*   **Mass Refactoring**: "Rename 'User' to 'Account' across all 50 files."

---

## 3. The Verdict: Who is "The Researcher"?

If "The Researcher" is a role focused on **analyzing deeply** without needing to write code immediately, **Claude Code (CLI)** is the superior choice.

### Why Claude Code for Research?
1.  **Grep & Scan**: It excels at searching through hundreds of files to find patterns ("Where is `userId` used?").
2.  **Less Noise**: It outputs a concise summary in the terminal rather than filling up your chat API context window.
3.  **Independence**: It frames "Research" as a task to be completed, not a conversation to be had.

### Recommended "Researcher" Workflow:
Don't use Antigravity to ask "How does the billing logic work?". Instead, use Claude Code:

```bash
$ claude "Audit the billing logic in /services/payments and explain the risk conditions."
```

**Outcome**: You get a report. Your IDE remains clear for coding.

---

## 4. The Complete Workflow Matrix

This matrix defines the "Standard Operating Procedure" (SOP) for every phase of development.

| Cycle Phase | Task Example | Recommended Interaction | Why? |
| :--- | :--- | :--- | :--- |
| **1. Planning** | "I want a feature to track calories." | **Antigravity** (Chat) | Requires conversational back-and-forth to define scope. Interactive. |
| **2. Scoping** | "Create the PRD for Calorie Tracking." | **Antigravity** (Chat) | You are already in the chat. It generates the file `specs/active_PRD.md` instantly. |
| **3. Targeted Research** | "Where is the user ID saved?" | **Antigravity** (`/research`) | Specific questions are best handled by a sub-agent returning a direct answer to the chat. |
| **4. Broad Research** | "Explain how the auth system works." | **Claude Code** (Interactive CLI) | Open-ended exploration is better in a dedicated terminal session where you can ask follow-ups. |
| **5. Coding (Light)** | "Change this button padding." | **Antigravity** (Filesystem Tools) | Lowest latency. You see the change immediately in the editor. |
| **6. Coding (Heavy)** | "Implement the entire Chart component." | **Antigravity** (Spawns Child) | Keeps your chat free. Antigravity acts as the Project Manager, delegating the work and reviewing the result. |
| **7. Large Refactor** | "Move all types to a new folder and update imports." | **Claude Code** (Interactive CLI) | Complex, risky changes across many files are often safer when you "ride along" in the terminal. |
| **8. Build/Release** | "Save and push." | **Antigravity** (Command) | `/save` is a simple command perfectly handled by the IDE agent. |

## 5. Decision Tree: "Who Drives?"

When deciding between **Delegating** (asking Antigravity to spawn an agent) and **Direct Driving** (tabbing to the terminal):

1.  **Is the outcome clearly defined?** (e.g., "Fix this bug", "Write this function")
    *   **YES** -> **Delegate**. Let Antigravity spawn a child agent. You stay in the IDE context.
    *   **NO** -> **Drive**. If you need to explore or figure it out together, use the Terminal.

2.  **Does it require "Project Manager" oversight?**
    *   **YES** -> **Delegate**. Antigravity can review the child agent's work before showing it to you.

3.  **Is it a "Journey"?** (e.g., Learning a new codebase, browsing documentation)
    *   **YES** -> **Drive**. The interactive terminal is your research partner.
