---
description: Analyzes changes, commits, closes GitHub issues, pushes code, and auto-updates docs.
---

# Git Save Workflow

1. **The Gateway (Quality & Security)**
   - **Secret Scan**: 
     - Run `git diff HEAD`.
     - **Action**: scanning output for keywords: `key`, `secret`, `token`, `password`, `sk-`, `AIza`.
     - If found: **STOP**. Display the suspicious line and ask for confirmation.
   - **Quality Check**:
     - Run `npm run lint` (if script exists).
     - If it fails: **STOP**. "Lint checks failed. Fix them or use `/save --force` to override."
   - **Test Status**: Ask "Have unit tests passed?" (or run them via `npm test` if fast).

2. **Context & Identity**
   - **Identify Branch**: Run `git branch --show-current`.
   - **Derive ID**: Attempt to extract ID (e.g., `feat/12-login` -> `12`).
   - **Rogue Branch Handling**: 
     - If no ID found (e.g. `patch-typo`): Ask user "I cannot link this branch to an Issue. Enter Issue ID manually or type 'None'."
     - Set variable `[Active_ID]`.

3. **Verification**
   - Run `git status` and `git diff --stat`.
   - **Visual Check**: Output the changed files and ask: "Ready to commit changes for #[Active_ID]?"

4. **Commit & Push**
   - Generate `type(scope): description` message.
   - Run `git add .`
   - Run `git commit -m "[message]"`
   - Run `git push origin [current-branch]`

5. **Issue Management (GitHub)**
   - Ask: "Is the feature complete? Should I close Issue #[Active_ID]?"
   - If yes and `[Active_ID]` is valid:
     - Run `gh issue close [Active_ID] --comment "Completed in commit [hash]"`
     - **Cleanup**: 
       - `rm specs/issue_[Active_ID].md` (Active spec closed).
       - *Optional*: Move to `specs/archive/`.
   - If no:
     - Run `gh issue comment [Active_ID] --body "Progress update..."`
   - If no (partial work):
     - Run `gh issue comment [Issue ID] --body "Progress update: [details]"`

5. **Documentation (The Scribe)**
   - Ask: "Should I unleash The Scribe to update the docs?"
   - If yes:
     - **Action**: Use `spawn-child-agent` with the `scribe` agent.
     - **Instruction**: "Update README.md and internal specs to match the code changes in the last commit."

6. **Completion**
   - Output: "Work saved, synced to GitHub, and docs updating in background."