---
description: The Decision Engine - Determines whether to delegate to Heavy Coder or handle internally.
---

1. **Analyze Request**
   - Read the User's input.

2. **Evaluate Complexity (Internal Monologue)**
   - Is this "Heavy"? (New Feature, Scaffolding, Refactoring >1 file).
   - Is this "Light"? (UI Tweak, Text Change, Config Update).

3. **Execution Path**
   - **IF HEAVY**: 
     - "⚙️ Building: Delegating to Heavy Coder..."
     - Spawn heavy-coder with full PRD context.
   - **IF LIGHT**:
     - "⚡ Tweaking: Handling this directly..."
     - YOU (Antigravity) perform the file edit immediately using your file tools.

4. **Completion**
   - Output: "Done. Run /save to trigger Cloud QA."