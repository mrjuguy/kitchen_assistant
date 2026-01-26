---
description: Scans the codebase first, then interviews the user to generate a PRD and syncs it to GitHub.
---

# Feature Planning Workflow

1. **State Analysis**
   - **Pre-Plan Audit**: Use `view_file .agent/skills/codebase-awareness/SKILL.md`.
   - **Rules**: Read `specs/tech-stack.md` (if exists).

2. **Phase 1: Discovery**
   - **GitHub Scan**: 
     - Check priorities: `gh issue list --label "priority:high"`.
     - Check milestones: `gh api repos/:owner/:repo/milestones`.
   - **Propose**: "Next feature based on backlog is [Feature]."
   - **Define Slug**: Ask user for a short, unique slug for this feature (e.g., `user-login`).
   - **Research (Optional)**: If the feature involves unfamiliar technology or complex third-party APIs:
     - **Action**: Spawn `researcher` agent.
     - **Instruction**: "claude -p 'Research implementation best practices and API documentation for [Feature Description] within our Expo/Supabase stack.' --agent 'researcher'"
     - **Result**: Researcher saves findings to `specs/drafts/[slug]_tech_notes.md`.

3. **Phase 2: Draft PRD (Collision-Free)**
   - Draft the requirements in `specs/drafts/[slug]_PRD.md`.
   - **Content**: Must include User Stories, UX Guidelines, Implementation Plan (incorporating `specs/drafts/[slug]_tech_notes.md` if available), and Verification Plan.
   - **Constraint**: Reference existing files correctly.

4. **Phase 3: GitHub Sync (Source of Truth)**
   - **Create Issue**: 
     - Run `gh issue create --title "[Feature Name]" --body-file specs/drafts/[slug]_PRD.md`.
   - **Milestone**: Assign to active milestone if applicable.
   - **Rename**: Move `specs/drafts/[slug]_PRD.md` to `specs/issue_[ID].md`.
   - **Output**: "PRD synced to GitHub Issue #[ID] and cached locally as `specs/issue_[ID].md`."

5. **Phase 4: Confirmation**
   - Output: "Planning complete. Issue #[ID] created. Clear context and run `/execute`."