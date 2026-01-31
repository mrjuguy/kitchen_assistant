---
name: repository-management
description: Standards for repository hygiene, security, and public documentation.
---

# Repository Management Best Practices

## Branching Strategy (MANDATORY)
- **Protected Main**: NEVER commit code directly to `main` unless it is a documentation-only change (e.g., updating `README.md` or `specs/`).
- **Feature Branches**: Before writing ANY code for a feature or fix, you must create a branch.
  - **Naming Convention**: `type/issue-id-short-description`
  - Examples:
    - `feat/35-account-deletion`
    - `fix/login-crash`
    - `chore/update-deps`
- **Workflow Integration**: The `/execute` workflow MUST trigger this branch creation immediately after analyzing the request.

## Shipping Discipline (One Feature = One Ship)
- **Granulairy**: A "Ship" (Merge) happens as soon as a single unit of value is complete.
  - **Do**: Merge "Login Page" immediately upon completion.
  - **Don't**: Wait to build "Login" AND "Home" AND "Profile" on one branch.
- **Risk Mitigation**: Shipping frequently prevents "Merge Hell" and allows for easy reverts if something breaks.
- **WIP Management**: If you didn't finish the featin a session, just `/save` (which pushes to the feature branch). Only `/ship` when it is production-ready.


## Security & Hygiene
- **CRITICAL**: Never commit `.env` files or any file containing secrets/API keys.
- **Environment Safety (Onboarding)**:
  - **Sync**: Whenever you add a new variable to `.env`, you MUST immediately add it to `.env.example` (with a placeholder value).
  - **Check**: New developers (or agents) rely on `.env.example` to know how to configure the app. Missing this is unprofessional.
- **Agent Sharing**: You **SHOULD** commit the `.agent/` folder (workflows, skills, rules) so that the team shares the same capabilities.
- **Rule Sharing**: `PROJECT_RULES.md` is now the shared source of truth and **SHOULD** be committed.
- **Gitignore Audit**: Verify that `.env` and `.claude/` (personal config) are in `.gitignore`.
- **Shell Syntax**: Use `&&` to chain commands in Bash.
- **Pre-Commit Scan**: Never run `git add .` without first running `git status` to check for untracked sensitive files.
  - **Explicit Block**: If you see files named `mcp.json` (especially in `.agent/`), `credentials.json`, `service_account.json`, or anything containing `token` or `secret`, **STOP**. Do not commit them. Add them to `.gitignore` immediately.
  - **Secret Scrubbing**: If you accidentally catch a secret in a commit history, you MUST rewrite the history (e.g., `git filter-branch` or `git rebase -i`) to remove it before pushing. Pushing a secret will block the push and require manual intervention.
- **Repository Sweep (Sub-Agent)**: You can spawn a sub-agent to perform a thorough security sweep:
  - `claude -p "Perform a deep security audit of the repository. Check all files (even ignored ones) for potential secrets and report findings." --agent "qa-bot"`

## Git Lock File Handling
- **Symptom**: `fatal: Unable to create '.git/...lock': File exists.`
- **Cause**: Another git process (IDE plugin, background `git pull`, or a crashed process) is holding a lock.
- **Solution**:
  1. First, check if a legitimate process is running (`git status`).
  2. If safe, remove all lock files:
     ```bash
     find .git -name "*.lock" -delete
     ```
  3. Retry the command.
- **Prevention**: Avoid very long-running background git commands. Do NOT leave `git pull` running indefinitely.

## Git Sync After PR Merge
- **Problem**: After `gh pr merge`, local `main` may diverge if it has local-only commits.
- **Safe Sync Pattern**:
  ```bash
  git checkout main
  git fetch origin
  git reset --hard origin/main
  git remote prune origin
  ```
- **NEVER** chain `git pull` after `gh pr merge` if you suspect local divergence. Use `reset --hard` to guarantee sync.

## Command Execution Discipline
- **Avoid Long Chains**: Do NOT chain more than 2-3 commands with `&&`. If one fails mid-chain, recovery is difficult.
- **Prefer Sequential Steps**: For high-risk operations (merge, reset, prune), run commands individually and check status between each.

## Tool Hygiene
- **No Hammering**: If a tool call (like `mcp_list_resources` or `run_command`) fails, **DO NOT** retry the exact same call within the same step. Analyze the error message first. If a resource or command is not found, assume it is unavailable and ask the user or try an alternative approach.
- **Agent Folder Location**: The `claude` CLI strictly requires agents to be in `.claude/agents/`. **NEVER** try to place them in `.agent/agents/` or create new directories for them. Use the existing location.


## GitHub Operations
- **CLI Usage**: For PRs, Issues, and Releases, prefer using the GitHub CLI.
- **Skill Check**: Read `view_file .agent/skills/github-cli/SKILL.md` for specific commands and shortcuts.

## Public Documentation (README)
- **Mirroring Standards**: If `PROJECT_RULES.md` is ignored, ensure all development standards (styling, hooks, state management) are summarized in the public `README.md`.
- **Setup Clarity**: Always provide a "Getting Started" section that includes environment variable requirements.
- **Tech Stack Transparency**: Clearly list the technologies used (Expo, Supabase, NativeWind) to assist other developers or for your own future reference.

## Conventional Commits
- Use the format: `type(scope): description`.
- Common types: `feat`, `fix`, `chore`, `docs`, `refactor`, `style`, `test`.

## System Evolution & Reflection
- **Continuous Learning**: Before starting any task (especially those involving /save, /ship, or /teach), the agent MUST reflect on the current chat history to identify procedural or technical mistakes.
- **Skill Updates**: If a mistake is recurring (e.g., CRLF warnings, missing haptics, RLS leakage), the agent MUST update the corresponding `SKILL.md` file using the `/teach` workflow.
- **Self-Correction First**: The agent is responsible for identifying its own errors through active reflection, rather than waiting for the user to point them out.
- **Rule Synchronization**: If a new technical standard is established during a session (e.g., a new unit conversion rule), it must be added to `PROJECT_RULES.md` and the relevant `SKILL.md`.
