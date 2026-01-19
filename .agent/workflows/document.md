---
description: Updates README.md and internal docs to match the current codebase.
---

# Documentation Update Workflow

1. **Scan**
   - Read the dependency file (e.g., `package.json`, `requirements.txt`, `Cargo.toml`).
   - Read the file structure (`ls -R`).
   - Read `specs/tech-stack.md`.
   - **Check History**: Read the 3 most recent files in `specs/completed/` to see what features were just added.

2. **Update Readme**
   - **Goal**: The README must allow a stranger to clone and run this repo in 5 minutes.
   - Update sections:
     - **Getting Started**: Exact commands to install and run.
     - **Current Features**: Add the newly completed features to the list.
     - **Tech Stack**: Update if tools changed.