---
description: Import a design from Google Stitch into the project
---

# Import Stitch Design

This workflow guides you through importing a design from Google Stitch, converting it into a local Design System, and generating React components.

## 1. Branch Hygiene
   - **Rule**: Never import designs directly into `main`.
   - **Check**: Run `git branch --show-current`.
   - If on `main`:
     - Ask: "Please checkout a feature branch (e.g., `feat/design-import`) before proceeding."
     - **Action**: Offer to run `git checkout -b feat/design-import` for them.

## 2. Identify the Source
Ask the user for the **Stitch Project ID** and the specific **Screen ID** (or name) they wish to import.
- If they haven't provided it, help them find it by listing available projects using the Stitch MCP tool (`stitch:list_projects`).

## 3. Sync Design System
**Skill:** `design-md`
Use the `design-md` skill to analyze the project and update (or create) `specs/DESIGN.md`.
- This ensures we have a local source of truth for the design tokens (colors, typography, etc.).
- Read the instructions in `.agent/skills/design-md/SKILL.md`.
- Follow the "Analysis & Synthesis Instructions" to generate the standard `specs/DESIGN.md` file.

## 4. Generate Components
**Skill:** `react-components`
Use the `react-components` skill to convert the specific screen into React code.
- Read `.agent/skills/react-components/SKILL.md` for detailed instructions.
- **Setup**: Ensure dependencies are installed in the skill directory (`cd .agent/skills/react-components && npm install`).
- **Fetch**: Use the `scripts/fetch-stitch.sh` script from the skill directory to download the raw HTML/assets.
- **Adapt for Expo/NativeWind**: 
    - This is an **Expo (React Native)** project.
    - When performing "Component drafting", you **MUST** adapt the Stitch HTML output to React Native primitives.
    - `<div>` → `<View>`
    - `<img>` → `<Image>`
    - `<p>`, `<h1>`, `<span>`, etc. → `<Text>`
    - Use **NativeWind** for styling (`className` props), mapping the Tailwind classes found in the Stitch design.
- **Refinement**: Ensure the generated component uses the project's existing UI components (like `ThemedText` or `ThemedView`) if applicable and available.

## 5. Integration & Review
- Place the new component in `components/` or a relevant subdirectory.
- Wire up the new component into the main application (e.g., add a new route in `app/` to test it).
- **Mandatory Review**:
    - Before declaring success, ask the user: "Shall I run `/review` to audit this new component?"
    - Use `spawn-child-agent` to check for bad imports or style regressions.
