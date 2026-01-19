---
description: Isolates and fixes a specific error or bug without a full PRD.
---

# Debug Workflow

1. **Triage**
   - Ask the user: "Paste the error trace or describe the bug."
   - Ask: "Which recent change likely caused this?"

2. **Investigation**
   - **Constraint**: Do not edit any code yet.
   - Read the relevant files.
   - Use `ls` to check file locations if imports are broken.
   - *Internal Thought*: "Hypothesize the root cause before touching code."

3. **The Fix**
   - Apply the fix to the code.
   - **Mandatory**: Run the specific test case or build command that failed.

4. **Regression Check**
   - Ask: "Did this fix the reported error?"
   - If yes, output: "Bug squashed. You can run `/save`."