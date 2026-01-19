---
name: repository-management
description: Standards for repository hygiene, security, and public documentation.
---

# Repository Management Best Practices

## Security & Hygiene
- **CRITICAL**: Never commit `.env` files or any file containing secrets/API keys.
- **Agent Privacy**: Never commit the `.agent/` folder. This is local-only metadata that contains the agent's internal skills and history.
- **Rule Privacy**: Never commit `PROJECT_RULES.md` if it contains sensitive technical strategies or agent-specific instructions.
- **Gitignore Audit**: Before the first commit of any project, ensure `.env`, `.agent/`, and `PROJECT_RULES.md` are added to `.gitignore`.

## Public Documentation (README)
- **Mirroring Standards**: If `PROJECT_RULES.md` is ignored, ensure all development standards (styling, hooks, state management) are summarized in the public `README.md`.
- **Setup Clarity**: Always provide a "Getting Started" section that includes environment variable requirements.
- **Tech Stack Transparency**: Clearly list the technologies used (Expo, Supabase, NativeWind) to assist other developers or for your own future reference.

## Conventional Commits
- Use the format: `type(scope): description`.
- Common types: `feat`, `fix`, `chore`, `docs`, `refactor`, `style`, `test`.

## Agent Safety & State Preservation
- **Infrastructure Integrity**: When performing infrastructure changes (e.g., initializing a new framework, moving files for cleanup), NEVER use recursive deletion commands without first performing a double-verification check that critical specification files (`specs/*.md`, `PROJECT_RULES.md`) have been safely moved and exist in their target destination.
- **State Protection**: Specification files in the `specs/` directory are the project's source of truth. Protecting their existence is a higher priority than directory tidiness.
