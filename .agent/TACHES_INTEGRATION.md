# Tâches Claude Code Resources - Integration Analysis

## Overview
The [Tâches Claude Code Resources](https://github.com/glittercowboy/taches-cc-resources) repository contains a highly sophisticated suite of workflows, skills, and agents designed to enhance the Claude Code experience.

## Resource Categories

### 1. Commands (Workflows)
These directly map to our `.agent/workflows/` directory.
- **Utility Wrappers**: Commands like `/debug` or `/create-slash-command` that simply invoke a complex underlying Skill.
- **Thinking Models**: `/consider:pareto`, `/consider:first-principles`, etc. These are standalone prompts that help with reasoning. High value, low complexity.
- **Workflow Tools**: `/add-to-todos`, `/whats-next`. These help manage context.

### 2. Skills
These map to `.agent/skills/`.
- **Core Skills**: `debug-like-expert`, `create-plans`, `create-agent-skills`.
- **Complexity**: These are "thick" skills. They often contain:
    - Shell scripts for context scanning.
    - References to external files (e.g., `references/hypothesis-testing.md`).
    - Dependencies on other skills (e.g., `expertise/`).

### 3. Agents
These are specialized system prompts for sub-agents (e.g., `skill-auditor`).
- **Integration**: Currently, our project uses `.agent/workflows` and `.agent/skills`. We need to determine if we should create an `.agent/agents` directory or integrate them into skills.

## Integration Strategy

To "best incorporate" these resources, we must adapt them from their global installation assumption (`~/.claude/...`) to our project-local structure (`.agent/...`). This ensures the tools travel with the repo and work for all team members.

### Required Adaptations
1.  **Path Rewrites**: Change all scripts and references from `~/.claude/skills` to `.agent/skills`.
2.  **Dependency Visualization**: Ensure "Reference" files are either included or the prompts are simplified to remove dependencies on missing files.
3.  **Directory Structure**:
    - `commands/*` -> `.agent/workflows/*.md`
    - `skills/*` -> `.agent/skills/*/SKILL.md`
    - `agents/*` -> `.agent/agents/*.md` (New directory)

### Phased Rollout Plan

#### Phase 1: High-Impact, Low-Dependency
*Goal: Immediate reasoning and debugging enhancements.*
- **Import**: `/debug` workflow and `debug-like-expert` skill.
- **Import**: All `/consider:*` thinking models.
- **Adaptation**:
    - Modify `debug-like-expert` to scan `.agent/skills/expertise` instead of global path.
    - Stub or import essential reference documentation.

#### Phase 2: The Creator Suite
*Goal: Enable the agent to build and maintain its own tools.*
- **Import**: `/create-slash-command`, `/create-agent-skill`, `/create-subagent`.
- **Import**: Corresponding skills (`skills/create-*`).
- **Value**: This allows us to rapidly build out the rest of the system using the tools themselves.

#### Phase 3: Advanced planning & Audit
*Goal: Robust project management.*
- **Import**: `create-plans` (Evaluated against existing `plan.md`).
- **Import**: `audit-*` commands and agents.

## Recommendation
Start with **Phase 1** immediately. The `debug-like-expert` skill provides a rigorous scientific method for solving complex coding issues, which will be valuable for the "Kitchen Assistant" development.
