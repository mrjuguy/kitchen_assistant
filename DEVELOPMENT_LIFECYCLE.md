# Development Lifecycle: Kitchen Assistant

This document outlines the **Cybernetic Development Lifecycle** used for the *Kitchen Assistant* project. It is designed to maximize developer velocity by offloading repetitive tasks (coding, testing, documentation) to AI agents and cloud automation, allowing the human developer to focus purely on Architecture and Product Logic.

---

## 1. The Philosophy: "No-Code" for the Architect
While the output is high-quality code, the input is **High-Level Intent**. 
*   **The User** is the *Architect*. You define *what* to build.
*   **The Agent** is the *Engineer*. It figures out *how* to build it.
*   **The Cloud** is the *Guardian*. It ensures nothing breaks.

---

## 2. The Core Workflow

### Phase 1: Intent & Planning
**Tools:** `/ideate`, `/plan`
1.  Start a session with `/start-session` to load context.
2.  Desribe a feature or change. If complex, run `/plan` to generate a Product Requirement Doc (PRD).
3.  **Outcome**: A clear `specs/active_PRD.md` file or a set of actionable tasks.

### Phase 2: Execution (The "Black Box")
**Tools:** `/execute`, `/fix`
1.  The Agent writes the code, implementing features in `app/`, `components/`, and `hooks/`.
2.  **Heavy Coder**: For multi-file refactors, we delegate to a specialized "Heavy Coder" sub-agent.
3.  **Fast Feedback**: The agent runs `lint` and `type-check` locally to catch errors immediately.

### Phase 3: Verification & Debugging
**Tools:** `npm test`, `/debug`
1.  **Triage**: When you run `/debug`, the Agent decides:
    *   **Quick Fix**: Handled immediately by Antigravity (e.g., UI bugs, typos).
    *   **Deep Investigation**: Delegated to a **Background Sub-Agent** (Claude Code) to research complex crashes or logic errors without blocking you.
2.  **Visual Check**: Verify UI against the **Emerald Design System** (see `PROJECT_RULES.md`).

### Phase 4: Zero-Friction Delivery
**Tools:** `/save`
1.  **NEVER** use `git commit` manually.
2.  Run `/save`.
3.   The system automatically:
    *   Checks for dirty files.
    *   Creates a branch (if needed).
    *   Commits with a semantic message.
    *   Pushes to GitHub.

---

## 3. The Cloud Layer (GitHub Actions)

Once code is pushed, the **Cloud Layer** takes over. This is fully automated.

| Agent Name | Workflow File | Trigger | Responsibility |
| :--- | :--- | :--- | :--- |
| **The Guardian** | `ci.yml` | Pull Request / Push | **Quality Control**: Enforces `npm run lint`, `npm run type-check`, and `npm test`. Blocks merges if any fail. |
| **The Scribe** | `scribe.yml` | Push to `main` | **Documentation**: Reads code changes and *automatically updates* `README.md` and `specs/*.md` to match reality. |

---

## 4. The Tech Stack

### Frontend & Mobile
*   **Framework**: React Native (Expo Router)
*   **Language**: TypeScript (Strict Mode)
*   **Styling**: NativeWind v4 (Tailwind CSS for Native)
*   **State**: TanStack Query (Server State)

### Backend & Data
*   **Service**: Supabase
*   **Pattern**: "Gap Analysis Engine" (Inventory-First Logic)

---

## 5. Key Commands (Reference)

| Command | Usage |
| :--- | :--- |
| `/start-session` | Initialize context at the start of work. |
| `/plan` | Interactively generate a PRD for a new feature. |
| `/execute` | Build the feature defined in the active PRD. |
| `/save` | Auto-branch, auto-commit, and push. |
| `/debug` | Deep-dive investigation for hard bugs. |
| `/document` | Manually trigger "The Scribe" to audit docs. |

---

## 6. Onboarding for New Devs
1.  **Install dependencies**: `npm install`
2.  **Run locally**: `npm start` (Press `w` for Web, or scan QR for Mobile).
3.  **Make a change**: Ask the Agent: "Change the button color to emerald-600".
4.  **Ship it**: Run `/save`.

**Welcome to the future of coding.**
