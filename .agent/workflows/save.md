---
description: Analyzes changes, generates a conventional commit message, and saves the work.
---

# Git Save Workflow

1. **Review Changes**
   - Run `git status` to see what files changed.
   - Run `git diff --stat` to see the scope of changes.
   - **Security Audit**: Check if secrets (env files) or sensitive agent rules are listed as untracked/modified. If they are, STOP and update `.gitignore`.

2. **Verification (Safety Check)**
   - **Critical**: Ask the user: "I am about to commit these changes. Did the code pass your tests/verification?"
   - *Constraint*: If the user says "No," abort the workflow and tell them to run `/teach` or fix the bugs first.

3. **Generate Message**
   - Read the changes and generate a specific, descriptive commit message using **Conventional Commits** format.
   - Format: `type(scope): description`

4. **Execute & Archive**
   - Propose the message to the user.
   - If confirmed:
     - Run `git add .`
     - Run `git commit -m "[message]"`
     - **Archive Step**: Move `specs/active_PRD.md` to `specs/completed/YY-MM-DD-feature-name.md`.
     - Output: "Work saved and PRD archived. You are safe to run `/plan` for the next feature."