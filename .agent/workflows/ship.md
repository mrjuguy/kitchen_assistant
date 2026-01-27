---
description: Ship Workflow - Merges the current PR, cleans up branches, and syncs main.
---

# Ship Workflow (The Closer)

1. **Safety Check**
   - Run `git branch --show-current`.
   - IF on `main`, output: "Already on main. Nothing to ship." and STOP.
   - Run `git status`.
   - IF working directory not clean, output: "Uncommitted changes detected. Run /save first." and STOP.

2. **Verify Cloud QA**
   - Run `gh pr view --json state,statusCheckRollup`.
   - **Check**: state must be `OPEN`. 
   - **Check**: statusCheckRollup (CI) should be `SUCCESS`.
   - IF CI is still running or FAILED, warn the user but allow override if explicitly requested.

3. **Execute Merge**
   - Run `gh pr merge --squash --delete-branch`.
   - Output: "🤝 PR merged and remote branch deleted."

4. **Local Cleanup & Sync**
   - Run `git checkout main`.
   - Run `git pull origin main`.
   - Run `git remote prune origin`.

5. **Resource Archiving**
   - Identify active PRD (e.g., `specs/active/12-login.md`).
   - Run `mv specs/active/[FILE] specs/completed/`.
   - Output: "📦 PRD archived to `specs/completed/`."

6. **Final Status**
   - Run `/status`.
   - Output: "🚀 Feature successfully shipped. You are now balanced on `main`."
