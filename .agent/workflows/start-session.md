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

2. **Context Retrieval**
   - **Last Win**: Check `git log -1 --stat` to remind the user what was last finished.
   - **Current Priorities**:
     - Run `gh issue list --label "priority:high" --limit 3`.
     - Run `gh issue list --assignee "@me"`.
   - **Roadmap**: Check active Milestones.

3. **Health Check**
   - Run the project's verification script (e.g., `npx expo-doctor` for Expo, or `npm run lint`).
   - *Constraint*: If it fails, the first task of the day is FIXING it.

4. **The Briefing**
   - Output a succinct summary:
     > **Project Status**: [Healthy/Broken]
     > **Last Session**: We finished [Commit Message].
     > **Today's Menu**:
     > 1. [Issue #A] Title
     > 2. [Issue #B] Title
   - Ask: "Shall I `/execute` an existing issue or `/plan` a new one?"
