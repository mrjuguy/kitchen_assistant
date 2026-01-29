---
description: Analyzes visual inputs or descriptions to generate a High-Fidelity Design Specification.
---

# Design Analysis Workflow

This workflow orchestrates the creation of a High-Fidelity Design Specification (`DESIGN.md`).

## 1. Context Acquisition
- Identify the input source:
    - **Visual**: A screenshot or mockup provided by the user.
    - **Text**: A descriptive "vibe" or requirement list (e.g., "Make it look like Linear").
- Ask clarifying questions if the input is ambiguous (e.g., "Are we targeting mobile or desktop?").

## 2. Activate Analyst Mode
**Skill:** `design-analyst`
- Read the instructions in `.agent/skills/design-analyst/SKILL.md`.
- Adopt the "Technical Design Analyst" persona defined in the skill.
- **Action**: Analyze the input against the 5 dimensions defined in the skill (Topology, Depth, Typography, Motion, Color).

## 3. Generate Specification
- **Output**: Create or overwrite `specs/DESIGN.md` (or a relevant path if specified).
- **Format**: Strictly follow the Markdown output format defined in the `design-analyst` skill examples.
- **Review**: Ensure NO subjective language exists (check against the "No Subjectivity" constraint).

## 4. Handover
- Inform the user that the Design Spec is ready.
- Suggest the next step: "Would you like me to implement these components using the `react-components` skill?"
