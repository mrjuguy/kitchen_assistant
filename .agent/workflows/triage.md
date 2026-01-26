---
description: Triage and organize GitHub issues efficiently.
---

# Triage Workflow

1. **Context Loading**
   - **Skill Check**: Read `view_file .agent/skills/github-cli/SKILL.md`.
   - Ask the user for the goal: "Are we triaging 'My Issues', 'Team Backlog', or 'Bugs'?"

## 1. Architectural Philosophy: Impact-First
- **Impact-First Prioritization**: Always prioritize tasks with the "most bang for the buck" (Highest Impact vs. Relative Effort). If an issue is mislabeled, trigger `/triage` to re-align.
- **Inventory-First Logic**: All logic must start with existing inventory. Never assume an ingredient is available unless verified against the state.
- **Household Isolation is Mandatory**: All database queries MUST be scoped to the `currentHousehold.id`. Never leak data between households.
- **The "Gap Analysis Engine" is the central source of truth**: All meal suggestions or recipe views must pass through a feasibility check:
  - **Green**: 100% stock + 100% Safe (Allergens).
  - **Yellow**: Partial stock + 100% Safe.
  - **Red**: Conflict with Health/Allergen profile.

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

4. **Triage Action Loop (Impact-First Prioritization)**
   - For each high-priority or unassigned issue, analyze **Impact vs. Effort**:
     - **Bang-for-Buck**: High Impact / Low Effort. (Mark as `priority:high`).
     - **Strategic**: High Impact / Medium-High Effort. (Mark as `priority:medium`).
     - **Maintenance**: Low Impact / Low-Medium Effort. (Mark as `priority:low`).
   - For each issue:
     - "Is the priority correct for maximum impact?" (Update via `gh issue edit`)
     - "Should we assign this?" (Run `gh issue edit [id] --add-assignee [user]`)
     - "Does it need a Label?" (Run `gh issue edit [id] --add-label [label]`)

5. **Cycle Management (Milestones)**
   - Check active milestones: `gh api repos/:owner/:repo/milestones`.
   - If a milestone is ending, suggest moving items.
   - If no milestone is active, offer to create one for the next sprint.

6. **Bulk Operations**
   - If multiple issues act as a cluster, offer to group them into a new Milestone or GitHub Project.

7. **Completion**
   - Output: "Triage complete. [X] issues updated. Ready to `/execute`."