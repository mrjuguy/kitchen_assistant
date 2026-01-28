---
description: Brainstorms new features or projects and converts them into GitHub Issues.
---

# Ideation & Intake Workflow

1. **Context Check**
   - **Action**: Check if `package.json` or `README.md` exists.
   - **Branch (New Project)**: If NO files exist, proceed to **Phase 2a (Inception)**.
   - **Branch (Existing Project)**: If files exist, proceed to **Phase 2b (Feature Intake)**.

---

## Phase 2a: Project Inception (Zero to One)
1. **The Concept**: Define the MVP. Ask "What is the core value?"
2. **The Stack**: Propose a Tech Stack (Read `.agent/skills/tech-advisor/SKILL.md`).
3. **The Setup**: Create `specs/tech-stack.md` and `PROJECT_RULES.md`.
4. **The Backlog**: Generate the first batch of issues using `gh issue create`.

---

## Phase 2b: Feature Intake (Continuous Improvement)
1. **Brainstorming**:
   - Ask: "What is the new feature or improvement?"
   - **Refinement**: Challenge the idea. "Does this align with the current MVP?" check `specs/roadmap.md` if exists.
   
2. **Technical Feasibility Scan**:
   - **Action**: Search codebase (`find_by_name`, `grep_search`) to see if this is already partially built or conflicts with existing architecture.
   - **Reality Check**: "We already have a similar feature in `files/xyz`. Should we extend that instead?"

3. **Issue Generation**:
   - **Draft**: Create a title and body.
   - **Body Requirement**: Must include "User Story", "Acceptance Criteria", and "Impact".
   - **Action**: Run `gh issue create --title "[Title]" --body "[Body]" --label "enhancement"`.
   - **Output**: "✅ Created Issue #[ID]. Run `/plan` to start working on it."
