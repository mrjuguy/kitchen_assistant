---
description: Updates a Skill or Rule based on a recent mistake.
---

# System Evolution Workflow

1. **Reflect on History**
   - **Action**: Manually scan the entire current chat history. 
   - **Goal**: Identify all technical mistakes, friction points, or user corrections (e.g., CRLF issues, tool failures, style violations).
   - **Output**: List the identified mistakes for the user.

2. **Analyze the Failure**
   - Ask the user: "Did I miss any other mistakes? Which Skill does this belong to? (or should I create a new one?)"

2. **Propose the Fix**
   - Locate the relevant `.agent/skills/[skill-name]/SKILL.md`.
   - Read the file.
   - Create a draft update to the Markdown that explicitly forbids the mistake.
   - Example addition: "CRITICAL: Never use [Bad Pattern]. Always use [Good Pattern]."

3. **Commit Knowledge**
   - Write the changes to the `SKILL.md` file.
   - Confirm: "I have updated the `[skill-name]` skill. I will not make this mistake again."