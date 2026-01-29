---
description: Scans the codebase first, then interviews the user to generate a PRD and syncs it to GitHub.
---

# Feature Planning Workflow

1. **State Analysis & Sync**
// turbo
   - **Action**: Run `git checkout main && git pull origin main`.
   - **Action**: Read `specs/tech-stack.md` and `.agent/skills/codebase-awareness/SKILL.md`.

2. **Phase 1: Discovery**
   - **GitHub Scan**: 
     - Run `gh issue list --label "priority:high" --json number,title,body,labels`.
   - **Candidate Selection**: Identify the "Highest Value" (Impact/Effort) task from the list. 
   - **Reality Check (The Neophyte Shield)**:
     - **Constraint**: Before finalizing the choice, you **MUST** validate the specific candidate:
     - **History Audit**: Run `gh issue list --state closed --search "[Key Terms]"` to verify it hasn't been solved previously.
     - **Codebase Audit**: Run `find_by_name [Key Terms]` to ensure the features don't already exist (Ghost Code).
     - **Outcome**: Only proceed if the path is clear.

   - **Prioritization Engine**: 
     - Analyze the backlog using the **Impact/Effort Matrix**:
       1. **Quick Wins** (High Impact / Low Effort) -> Prioritize First.
       2. **Major Projects** (High Impact / High Effort) -> Plan carefully.
     - **Constraint**: Always propose the "Highest Value" option unless user explicitly overrides.
   - **Define Slug**: Ask user for a short, unique slug for this feature (e.g., `user-login`).
   - **Research (Optional)**: If complex:
     - **Action**: Spawn `researcher` agent to save findings to `specs/drafts/[slug]_tech_notes.md`.

3. **Phase 1.5: Design Strategy**
   - **Ask**: "Does this feature involve new UI or visual changes?"
   - **Action (If Yes)**:
     - Check if `specs/DESIGN.md` exists.
     - If NO, or if the feature requires a *new* design pattern not in the global spec, run `/design-analyst` first to generate the constraints.
     - **Goal**: Ensure the PRD contains *technical design constraints* (e.g., "Use Glassmorphism tokens"), not just "Make it pretty."

4. **Phase 2: Draft PRD (Collision-Free)**
   - Draft the requirements in `specs/drafts/[slug]_PRD.md`.
   - **Content**: Must include User Stories, UX Guidelines (referencing `specs/DESIGN.md`), Implementation Plan (incorporating `specs/drafts/[slug]_tech_notes.md` if available), and Verification Plan.
   - **Constraint**: Reference existing files correctly.

5. **Phase 2b: RFC / Technical Design Review (For High Complexity)**
   - **Trigger**: If the feature involves database schema changes, new architecture, or security/auth.
   - **Action**: Pause and ask: "This feature is complex. Shall I initiate a formal RFC or Design Review before finalizing the PRD?"
   - **Outcome**: If yes, spawn `claude -p "Review this PRD and proposed architecture for potential pitfalls."`.

6. **Phase 3: GitHub Sync (Source of Truth)**
   - **Create Issue**: 
     - Run `gh issue create --title "[Feature Name]" --body-file specs/drafts/[slug]_PRD.md`.
   - **Milestone**: Assign to active milestone if applicable.
   - **Rename**: Move `specs/drafts/[slug]_PRD.md` to `specs/issue_[ID].md`.
   - **Output**: "PRD synced to GitHub Issue #[ID] and cached locally as `specs/issue_[ID].md`."

7. **Phase 4: Confirmation**
   - Output: "Planning complete. Issue #[ID] created. Clear context and run `/execute`."