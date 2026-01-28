---
description: Manually triggers The Scribe to audit code and update documentation.
---

# On-Demand Scribe Workflow

1. **Context Loading**
   - **Action**: Read the following files to establish baseline context:
     - `README.md`
     - `specs/tech-stack.md`
   - **Action**: Run `git diff main` (or appropriate comparison) to identify recent changes.

2. **Direct Update (Antigravity)**
   - **Action**: You (Antigravity) analyze the recent changes and update the documentation directly using your file tools.
   - **Task**: 
     - Update `README.md` features list.
     - Update `specs/tech-stack.md` if any tools changed.
     - Ensure `CLAUDE.md` accurately reflects latest commands/rules.
   - **Note**: Only delegate to a `scribe` child agent for massive reorganization or multi-file documentation refactoring.

3. **Commit**
   - **Action**: Review changes made by the agent.
   - **Command**: `git add .`
   - **Command**: `git commit -m "docs: manual update"`
