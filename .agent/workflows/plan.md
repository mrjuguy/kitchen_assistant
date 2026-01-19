---
description: Scans the codebase first, then interviews the user to generate a PRD.
---

# Feature Planning Workflow

1. **State Analysis (Critical)**
   - Check if `specs/tech-stack.md` exists.
   - **IF EXISTS (Iterative Mode)**:
     - Read `specs/tech-stack.md` to load the rules.
     - Run a list command (e.g., `ls -R`) to see what features are *already* built.
     - *Constraint*: Ignore `node_modules`, `venv`, `.git`, or other vendor folders.
     - *Internal Thought*: "The user is continuing an existing project. I need to fit the new feature into the existing structure."
   - **IF MISSING (Greenfield Mode)**:
     - Assume this is a brand new project.

2. **Phase 1: Discovery**
   - **Prompt**: "I have reviewed the current codebase. What is the *next* feature we are building?"
   - *Dynamic Follow-up*: If the user mentions a component that sounds similar to an existing file, ask if they want to modify the existing one.

3. **Phase 2: Draft PRD**
   - Create/Overwrite `specs/active_PRD.md`.
   - **Constraint**: The "Implementation Plan" section MUST reference existing file names if they exist. Do not invent new filenames for code that is already there.

4. **Phase 3: Confirmation**
   - Output: "PRD created at `specs/active_PRD.md`. Review it, then Clear Context and run `/execute`."