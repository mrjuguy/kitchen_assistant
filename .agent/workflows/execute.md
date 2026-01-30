---
description: The Decision Engine - Determines whether to delegate to Heavy Coder or handle internally.
---

1. **Analyze Request**
   - Read the User's input.
   - Run `git status` to check current state.

2. **Establish Context & Branch**
   - **Identify Issue**: Extract the Issue ID (e.g., #35) if present.
   - **Ticket Anatomy Check**: Ensures the issue has "Implementation-Ready" specs with **Binary Acceptance Criteria (AC)**. If not, bounce back to `/plan`.
   - **Branch Strategy**:
     - IF on `main`: Create a new branch `git checkout -b [type]/[issue-id]-[desc]`.
     - IF on existing feature branch: Continue.

3. **Context Warm-up (Codebase Awareness)**
   - **Action**: Locate relevant code *before* deciding on complexity.
   - **Tools**: Use `find_by_name` or `grep_search` to find related files/functions.
   - **Goal**: Do we already have a utility for this? Is there a similar pattern? 
   - *Constraint*: Do NOT skip this. Ignorance leads to duplicated code.

4. **Evaluate Complexity (Internal Monologue)**
   - Is this "Heavy"? (New Feature, Scaffolding, Refactoring >1 file).
   - Is this "Light"? (UI Tweak, Text Change, Config Update).

5. **Phase Control (The Plan Check)**
   - **Action**: Present the implementation phase-plan to the Pilot (User).
   - **Output**: "Proposed Execution Plan: [Steps]. Proceed?"
   - **Wait**: Do NOT execute code until user approves or rearranges steps.

6. **Execution Path (Atomic Execution)**
   - **IF HEAVY**: 
     - "⚙️ Building: Delegating to Heavy Coder..."
     - **Spec Anchors**: Task MUST explicitly reference the Tech Plan in `specs/issue_[ID].md`.
     - Spawn heavy-coder with full PRD + Tech Plan context.
   - **IF LIGHT**:
     - "⚡ Tweaking: Handling this directly..."
     - YOU (Antigravity) perform the file edit immediately using your file tools.

7. **Completion**
   - Output: "Done. Run /save to trigger Cloud QA."