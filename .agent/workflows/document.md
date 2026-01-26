---
description: Manually triggers The Scribe to audit code and update documentation.
---

# On-Demand Scribe Workflow

1. **Context Loading**
   - **Action**: Read the following files to establish baseline context:
     - `README.md`
     - `specs/tech-stack.md`
   - **Action**: Run `git diff main` (or appropriate comparison) to identify recent changes.

2. **The Scribe Agent**
   - **Action**: Spawn the `scribe` agent using the `spawn-child-agent` skill.
   - **Reference**: Use instructions from `.claude/agents/scribe.md`.
   - **Instruction**: 
     > "You are The Scribe. 
     > 
     > **Context**:
     > [Insert Context Files]
     > 
     > **Changes**:
     > [Insert Git Diff]
     > 
     > **Task**:
     > Update the documentation to match the current codebase. Ensure `README.md` reflects any new features or architecture changes."

3. **Commit**
   - **Action**: Review changes made by the agent.
   - **Command**: `git add .`
   - **Command**: `git commit -m "docs: manual update"`
