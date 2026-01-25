---
description: Triage and organize GitHub issues efficiently.
---

# Triage Workflow

1. **Context Loading**
   - **Skill Check**: Read `view_file .agent/skills/github-cli/SKILL.md`.
   - Ask the user for the goal: "Are we triaging 'My Issues', 'Team Backlog', or 'Bugs'?"

2. **Fetch Data**
   - Use `gh issue list` with proper filtering (`--assignee`, `--label`, `--limit 50`).
   - Display a summary of the found issues to the user.

3. **Duplicate Cleanup & Hygiene**
   - **Internal Audit**: Compare issue titles from the list to find potential duplicates.
   - For each duplicate pair (A, B):
     - Ask: "Issue #A ('Title A') and #B ('Title B') look similar. Is one a duplicate?"
     - If yes:
       - Run `gh issue comment [duplicate_id] --body "Duplicate of #[original_id]"`
       - Run `gh issue close [duplicate_id] --reason "not planned"`
   - **Close Stale**: Identify issues with no updates > 30 days. Ask if they should be closed.

4. **Triage Action Loop**
   - For each high-priority or unassigned issue, ask:
     - "Should we assign this?" (Run `gh issue edit [id] --add-assignee [user]`)
     - "Is the priority correct?" (Add label 'priority:high' via `gh issue edit`)
     - "Does it need a Label?" (Run `gh issue edit [id] --add-label [label]`)

5. **Cycle Management (Milestones)**
   - Check active milestones: `gh api repos/:owner/:repo/milestones`.
   - If a milestone is ending, suggest moving items.
   - If no milestone is active, offer to create one for the next sprint.

6. **Bulk Operations**
   - If multiple issues act as a cluster, offer to group them into a new Milestone or GitHub Project.

7. **Completion**
   - Output: "Triage complete. [X] issues updated. Ready to `/execute`."