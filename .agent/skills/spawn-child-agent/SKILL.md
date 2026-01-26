---
name: spawn-child-agent
description: Spawns a new, independent Claude Code agent process to handle a complex sub-task. This child agent is a full "Main" session and CAN spawn its own sub-agents.
---

# `spawn-child-agent`

Use this skill when you have a complex, isolated task that would benefit from a dedicated agent loop, or when you need to delegate work to a specialized sub-agent (like a QA bot or Researcher) in a way that allows *that* sub-agent to further delegate.

## Usage

Execute via the `Bash` tool. You MUST use the `-p` (headless) flag.

```bash
claude -p "Your detailed instructions for the child agent here" \
  --allowedTools "Bash,Read,Grep,Glob,find_by_name,view_file,write_to_file,replace_file_content" \
  --model "sonnet" \
  --output-format json
```

## Critical Flags

*   **`-p` / `--print`**: Runs non-interactive. Required.
*   **`--allowedTools`**: Pre-authorizes tools. **CRITICAL**: Use the exact internal tool names (e.g., `write_to_file`, NOT `Edit`). If you do not include this, the child agent will hang.
*   **`--output-format json`**: Allows you (the parent agent) to parse the result programmatically.

## Example: Spawning a Specialized Worker

If you want the child to use a specific sub-agent (e.g., `qa-bot`):

```bash
claude -p "Use the qa-bot subagent to verify the recent changes in src/utils.ts" \
  --allowedTools "Bash,Read" \
  --agent "qa-bot"
```
*(Note: Agents MUST be located in `.claude/agents/` to be discoverable by the CLI. Do not put them in `.agent/agents/`.)*
