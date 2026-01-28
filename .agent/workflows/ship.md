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

// turbo-all
4. **Local Cleanup & Sync**
   - **Action**: Run `git checkout main && git pull origin main && git remote prune origin`.

5. **Resource Archiving**
   - **Action**: Identify and move the active PRD (e.g., `specs/issue_*.md`) to `specs/completed/`.

6. **Final Status**
   - **Action**: Output "🚀 Feature successfully shipped. You are now balanced on `main`."
