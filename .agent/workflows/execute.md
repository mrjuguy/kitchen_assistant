---
description: Implements a feature from a PRD one step at a time.
---

# Execution Mode

1. **Context Loading**
   - Read `specs/active_PRD.md`.
   - **Constraint**: Do not read ANY source code yet. First, state the *current status* of the project based *only* on the PRD.

2. **Phase Selection**
   - Ask the user: "Which phase of the PRD should I execute right now?"

3. **Targeted Implementation**
   - Once the user selects a phase:
     - Read *only* the files necessary for that specific phase.
     - Implement the code.
     - **CRITICAL**: Run the project's linter/test command immediately after the edit.

4. **Review**
   - Output: "Phase complete. Tests passed/failed. Ready for the next phase?"