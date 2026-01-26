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

4. **Push & Publish (Cloud QA)**
   - Run `git push origin HEAD`.
   - **Check for PR**: Run `gh pr view --json state --template "{{.state}}"` (Ignore errors).
   - **Create PR if missing**:
     - If no PR exists: `gh pr create --title "[Commit Message Title]" --body "Architectural changes for Issue #[ID]. Triggering Cloud QA." --draft`. (Use `--draft` if the user might want more changes, or omit for immediate review).
   - Output: "🚀 Pushed to [current-branch] and published PR. Cloud QA (Scribe/QA Bot) is now active."