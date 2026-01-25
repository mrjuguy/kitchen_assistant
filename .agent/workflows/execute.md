---
description: Implements a feature from a specific GitHub Issue.
---

# Execution Mode

1. **Context Loading**
   - Ask: "Which GitHub Issue ID are we implementing?"
   - **Refinement**: Ask user for a short slug if not mentioned (e.g., `auth-flow`).

2. **Branch Hygiene & Safety (Critical)**
   - **Stowaway Check**: Run `git status --porcelain`.
   - If output is not empty:
     - **STOP**: Warn the user. "Uncommitted changes detected. Switching branches will carry these changes over. Is this intentional?"
     - Options: `stash`, `commit`, or proceed if safe.
   - Current Branch Check: Run `git branch --show-current`.
   - **Rule**: Never commit feature code to `main`.
   - **Action**:
     - If on `main`: Run `git checkout -b feat/[ID]-[slug]`.
     - If on existing branch: Verify it matches `feat/[ID]-*`. If mismatch, Warn user.

3. **Fetch Source of Truth**
   - Run `gh issue view [ID] --json number,title,body --jq '"# Issue \(.number): \(.title)\n\n\(.body)"' > specs/issue_[ID].md`.
   - Output: "Context set to Issue #[ID] on branch `feat/[ID]-[slug]`."

4. **Phase Selection**
   - Reads `specs/issue_[ID].md`.
   - Ask: "Which phase/task from this PRD are we tackling now?"

5. **Targeted Implementation**
   - **Stack Rules**: `view_file .agent/skills/[tech-stack]/SKILL.md` (e.g., expo, supabase).
   - **Testing Rules**: `view_file .agent/skills/testing-standards/SKILL.md`.
   - Implement the code.
   - **Turbo Test**:
     // turbo
     - Run tests immediately.

6. **Behavior Verification (Sim User)**
   - Ask: "Should I write a simulation test for this feature?"
   - If User says Yes:
     - **Action**: Spawn `simulate-user` agent.
     - **Instruction**: "Write an integration test for [Component/Feature] that proves the user stories in `specs/issue_[ID].md` work."
   - If User says No: Skip.

7. **Next Steps**
   - Output: "Phase complete."
   - Ask: "Ready for the next phase? Or should we runs `/review` before saving?"