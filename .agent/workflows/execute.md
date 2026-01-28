---
description: The Decision Engine - Determines whether to delegate to Heavy Coder or handle internally.
---

1. **Analyze Request**
   - Read the User's input.
   - Run `git status` to check current state.

2. **Establish Context & Branch**
   - **Identify Issue**: Extract the Issue ID (e.g., #35) if present.
   - **Branch Strategy**:
     - IF on `main`: Create a new branch `git checkout -b [type]/[issue-id]-[desc]`.
     - IF on existing feature branch: Continue.

3. **Evaluate Complexity (Internal Monologue)**
   - Is this "Heavy"? (New Feature, Scaffolding, Refactoring >1 file).
   - Is this "Light"? (UI Tweak, Text Change, Config Update).

4. **Execution Path**
   - **IF HEAVY**: 
     - "⚙️ Building: Delegating to Heavy Coder..."
     - Spawn heavy-coder with full PRD context.
   - **IF LIGHT**:
     - "⚡ Tweaking: Handling this directly..."
     - YOU (Antigravity) perform the file edit immediately using your file tools.

5. **Completion**
   - Output: "Done. Run /save to trigger Cloud QA."