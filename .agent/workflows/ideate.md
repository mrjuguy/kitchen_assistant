---
description: Brainstorms a project idea and determines the best beginner-friendly tech stack.
---

# Project Inception Workflow

1. **Phase 1: The Concept**
   - Ask the user: "What is the core idea? Who is it for? What is the one thing it MUST do?"
   - Ask: "Is this a web app, a mobile app, a CLI tool, or a background service?"
   - *Goal*: Understand the "Shape" of the software.

2. **Phase 2: Technical Needs Assessment**
   - Analyze the complexity. Does it need:
     - A database? (Persistence)
     - Real-time updates? (Sockets/Polling)
     - External APIs?
   - *Internal Thought*: "Match the user's complexity level to the simplest possible tool that can do the job."

3. **Phase 3: The CTO Decision**
   - Propose a **Tech Stack** optimized for the user's skill level and the project requirements.
   - *Constraint*: Use the `tech-advisor` skill to make this decision.
   - Explain *Why*: "I recommend **[Stack Name]** because..."

4. **Phase 4: Lock it In**
   - Create a directory `specs/` if it doesn't exist.
   - Create a file `specs/tech-stack.md`.
   - Write down the chosen languages, frameworks, testing tools, and package managers.
   - **Crucial Step**: Create a `PROJECT_RULES.md` file that sets the global constraints for this specific stack.