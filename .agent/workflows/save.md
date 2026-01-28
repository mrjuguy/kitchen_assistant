---
description: Zero-Friction Save & Branch - Non-blocking save that auto-handles branching and issue linking.
---

# Zero-Friction Save & Branch

1. **Find Context (Auto-Discovery)**
   - **Action**: Identify **Active ID** by checking:
     1. Files in `specs/active/` or matching `specs/issue_*.md`.
     2. Current branch name (e.g., `feat/12-login` -> `12`).
     3. `.agent/temp/active_issue`.
   - **Heuristic**: If an active PRD exists, prioritize its ID over the branch name.

2. **Branch Management**
   - If current branch is `main`:
     - Generate a descriptive branch name based on `git diff --stat`.
     - If an **Active ID** was found (e.g. `12`), prefix it: `feat/12-[description]`.
     - Otherwise: `feat/[description]`.
     - Run `git checkout -b [generated-branch-name]`.
   - Else: 
     - Stay on current branch.

3. **Pre-Flight Check (Professional Standard)**
// turbo
   - **Action**: Run `npm run type-check` (or `tsc --noEmit`).
   - **Logic**: 
     - If PASS: Continue.
     - If FAIL: Warn user "⚠️ Type checks failed. Do you want to fix them or force save?"
     - (Allow user to type 'force' to skip).

4. **Atomic Commit**
   - Run `git add .`.
   - Analyze changes to generate a `type(scope): description` message.
   - If an **Active ID** (e.g. `12`) is found, append `(closes #12)` to the message.
   - Run `git commit -m "[message]"` (or `git commit --amend --no-edit` if fixing a CI failure).

5. **Documentation Sync (The Scribe)**
   - **Check**: Did we change architecture, `utils/`, or add new features? 
   - **Action**: You (Antigravity) MUST now perform the "Scribe" duties immediately:
     1. **System Docs**: Update `README.md` (Features list) and `specs/tech-stack.md` if tools changed.
     2. **Living PRD**: Read `specs/issue_*.md` (active PRD). Compare code vs Verification Plan. Mark completed items with `[x]`.
   - **Commit**: Run `git add . && git commit --amend --no-edit` to merge these docs into the feature commit.

6. **Push & Publish (Cloud QA)**
   - Run `git push origin HEAD`.
   - **Check for PR**: Run `gh pr view --json state --template "{{.state}}"` (Ignore errors).
   - **Create PR if missing**:
     - If no PR exists: `gh pr create --title "[Commit Message Title]" --body "Architectural changes for Issue #[ID]. Triggering Cloud QA." --draft`.
   - Output: "🚀 Pushed and published PR. Cloud QA active. Run **/ship** once CI passes to merge and clean up."