---
description: Installs the base framework after the tech stack is chosen.
---

# Bootstrap Workflow

1. **Check Prerequisites**
   - Read `specs/tech-stack.md`.
   - Ensure the required runtime (Node, Python, Go, etc.) is installed.

2. **Scaffold**
   - Run the standard initialization command for the chosen stack (e.g., `npm create`, `pip install`, `cargo new`).
   - **Crucial**: Install the testing framework defined in `specs/tech-stack.md`.
   - Ask the user to confirm the folder structure.

3. **Generate Skills**
   - Based on the chosen stack, move or generate the specific `SKILL.md` files needed.
   - *Action*: If you have a template library of skills, copy the relevant ones (e.g., `skills/_templates/react` → `skills/react`) into the active skills folder.
   - *Action*: If no template exists, create a new `SKILL.md` for the language/framework and populate it with best practices.