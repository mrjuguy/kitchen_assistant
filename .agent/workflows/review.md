---
description: Scans recent changes against the code-review skill before committing.
---

# Code Review Workflow

1. **Gather Context**
   - Run `git diff --stat` to see what files changed.
   - Read the content of the changed files.
   - Read `specs/active_PRD.md` to understand what *should* have happened.

2. **The Audit**
   - Activate the `code-review` skill.
   - Critically analyze the changes against the skill's checklist.
   - **Internal Thought**: "I am playing the role of a senior engineer. I will be strict."

3. **Report Generation**
   - Output a report structured as:
     - **Summary**: What was built.
     - **Validation**: Did it meet the PRD goals?
     - **Issues Found**: Bulleted list of bugs, style violations, or missing tests.
     - **Verdict**: "PASS" or "REQUEST CHANGES".

4. **Auto-Fix (Optional)**
   - If issues are minor (like missing comments or debug print statements), ask the user: "Shall I fix these minor issues automatically?"
   - If "Yes", apply fixes and run tests again.