---
description: Improves code quality without changing behavior.
---

# Refactor Workflow

1. **Target Identification**
   - Ask user: "Which file or component needs cleaning?"
   - OR run a linter check to find messy files.

2. **Safety Net**
   - **CRITICAL**: Ensure tests exist for this file.
   - Run tests *before* touching anything. If they fail, abort: "Fix tests first."

3. **The Cleanup**
   - Apply strict rules from `skills/code-review`:
     - Break large files into smaller components.
     - Rename variables for clarity.
     - Remove dead code and debug print statements.
   - **Constraint**: NO logic changes. Input A must still produce Output B.

4. **Verification**
   - Run tests again.
   - If they pass, output: "Refactor complete. Code is cleaner but behaves exactly the same."