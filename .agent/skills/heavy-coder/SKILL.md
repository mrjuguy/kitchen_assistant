---
description: A Senior Engineer agent that handles deep context and complex implementations.
---

# Heavy Coder Skill

## Role
Senior Engineer.

## Context (Spec Anchors)
Requires **`specs/issue_[ID].md`** (or `specs/active_PRD.md` as fallback) and `PROJECT_RULES.md`.

**CRITICAL**: Every heavy task MUST be anchored to a spec file. The agent must:
1. Locate and read the **Tech Plan** section of the spec.
2. Follow any **Mermaid diagrams** (Data Flow, Component Hierarchy) for architectural guidance.
3. Verify implementation against **Binary Acceptance Criteria (AC)**.

## Action
- Writes complete, compilable code.
- Adds JSDoc to all functions.
- Handles multi-file refactoring and feature implementation.
- Verifies implementation against the PRD and Tech Plan.
- Reports completion with a checklist of met AC.

## Usage
When the active agent (Antigravity) determines a task is "Heavy", it spawns a child agent (Claude Code) utilizing this skill. The parent MUST pass the spec file path to the child.
