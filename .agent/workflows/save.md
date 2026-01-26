---
description: Zero-Friction Save & Branch - Non-blocking save that auto-handles branching and issue linking.
---

# Zero-Friction Save & Branch

1. **Find Context (Auto-Discovery)**
   - Run `git branch --show-current`.
   - Attempt to find an **Active ID**:
     - Check current branch name (e.g., `feat/12-login` -> `12`).
     - Check for `specs/active_PRD.md` or files matching `specs/issue_*.md`.
     - Read `.agent/temp/active_issue` if it exists.

2. **Branch Management**
   - If current branch is `main`:
     - Generate a descriptive branch name based on `git diff --stat`.
     - If an **Active ID** was found (e.g. `12`), prefix it: `feat/12-[description]`.
     - Otherwise: `feat/[description]`.
     - Run `git checkout -b [generated-branch-name]`.
   - Else: 
     - Stay on current branch.

3. **Atomic Commit**
   - Run `git add .`.
   - Analyze changes to generate a `type(scope): description` message.
   - If an **Active ID** (e.g. `12`) is found, append `(closes #12)` to the message.
   - Run `git commit -m "[message]"` (or `git commit --amend --no-edit` if fixing a CI failure).

4. **Push & Fire**
   - Run `git push origin HEAD`.
   - Output: "🚀 Pushed to [current-branch]. QA and Scribe are running in the cloud."