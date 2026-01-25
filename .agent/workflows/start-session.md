---
description: Run this at the start of every session to get context and pick up where you left off.
---

# Morning Briefing Workflow

1. **Synchronize (Safety Check)**
   - **Dirty State Check**: Run `git status --porcelain`.
   - If output is not empty:
     - **STOP**: "Uncommitted changes detected. Please `stash` or `commit` before starting a new session to avoid merge conflicts."
   - If clean:
     - Run `git pull origin [current-branch]`.
     - Run `npm install` (to ensure dependencies are fresh).

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
