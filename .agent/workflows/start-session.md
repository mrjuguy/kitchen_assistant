---
description: Run this at the start of every session to get context and pick up where you left off.
---

# Morning Briefing Workflow

1. **Synchronize (Global Sync)**
   - **Dirty State Check**: Run `git status --porcelain`.
   - If output is clean:
     - Run `git fetch origin`.
     - Run `git checkout main && git pull origin main`. (Updates local main to match cloud).
     - **Return to Work**: If a feature branch was active, `git checkout [previous-branch]` and `git merge main`.
     - Run `npm install` (to ensure dependencies are fresh).
   - Else:
     - **STOP**: "Uncommitted changes detected. Please `stash` or `commit` before starting a new session."

2. **Context Retrieval (Deep Dive)**
   - **Last Win**: Check `git log -1 --stat` to remind the user what was last finished.
   - **Open Issues Audit**:
     - Run `gh issue list --json number,title,labels,body --limit 20`.
     - **Value Analysis**: For each issue, analyze the "Impact vs Effort" based on current project goals and complexity.
   - **Roadmap**: Check active Milestones and `specs/roadmap.md` if it exists.

3. **Health Check**
   - Run the project's verification script (e.g., `npx expo-doctor` for Expo, or `npm run lint`).
   - *Constraint*: If it fails, the first task of the day is FIXING it.

4. **The Briefing**
   - Output a succulent summary:
     > **Project Status**: [Healthy/Broken]
     > **Last Session**: We finished [Commit Message].
     > **Active Issues Analysis**:
     > - **High Value**: [Issue #N] [Title] (High Impact / Low Effort) - *Reasoning...*
     > - **Current Task**: [Issue #M] [Title] (Deep Logic / Complex) - *Reasoning...*
     > - **Quick Win**: [Issue #L] [Title] (Visual / Text) - *Reasoning...*
   - Explicitly recommend the "Highest Value" item to work on next.
   - Ask: "Shall I `/execute` the recommended task or do you have a different priority?"
