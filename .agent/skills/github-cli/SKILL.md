---
name: github-cli
description: Interact with GitHub via the command line (PRs, Issues, Releases).
---

# GitHub CLI Skill

## Prerequisite
- **Local Path**: Ensure `gh` is in your PATH.
- **Usage**: Run `gh` commands directly (e.g., `gh issue list`).
- **Auth**: Ensure you are authenticated. Run `gh auth status`. If not, run `gh auth login`.

## Pull Requests
- **Create PR**:
  ```bash
  gh pr create --title "type(scope): description" --body "Detailed description"
  ```
- **View PR**: `gh pr view [number|url] --web`
- **Check Status**: `gh pr status`
- **Checkout PR**: `gh pr checkout [number]`
- **List PRs**: `gh pr list`

## Issues
- **List Issues**: `gh issue list`
- **Create Issue**: `gh issue create --title "..." --body "..."`

## Actions
- **List Runs**: `gh run list`
- **Watch Run**: `gh run watch [run-id]`

## Milestones
- **CRITICAL**: There is NO `gh milestone` command. You MUST use the API.
- **List Milestones**:
  ```bash
  gh api repos/{owner}/{repo}/milestones -q ".[] | \"\(.number): \(.title)\""
  ```
- **Assign Issue to Milestone**:
  ```bash
  # Use the TITLE, not the number!
  gh issue edit [issue-number] --milestone "Milestone Title"
  ```
- **NEVER** use `gh issue edit --milestone 3`. The CLI expects the **title string**, not the milestone ID.

## Best Practices
- **Non-Interactive**: Use flags (`--title`, `--body`, `--yes`) to avoid interactive prompts when running from scripts/agent.
- **Web Flag**: Use `--web` when asking the user to review something in the browser.
- **JSON Output for `gh issue/pr`**: Use `--json [fields]` to get machine-readable output.
- **JSON Output for `gh api`**: Use `-q` (jq filter), NOT `--json`. The `--json` flag does not exist for `gh api`.
- **Draft PRs**: GitHub cannot merge Draft PRs. Always run `gh pr ready [id]` before `gh pr merge`.

## Common Mistakes to Avoid
1. **`gh milestone list`** - Does NOT exist. Use `gh api repos/.../milestones`.
2. **`gh api ... --json`** - INVALID. Use `-q` for filtering.
3. **`gh issue edit --milestone 3`** - WRONG. Use the milestone **title**, not its ID.
4. **`gh pr merge` on Draft** - FAILS. Run `gh pr ready` first.
