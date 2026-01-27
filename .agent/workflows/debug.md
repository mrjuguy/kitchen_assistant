---
description: Apply expert debugging methodology to investigate a specific issue
argument-hint: [issue description]
allowed-tools: Skill(debug-like-expert)
---

<objective>
Load the debug-like-expert skill to investigate: $ARGUMENTS

This applies systematic debugging methodology with evidence gathering, hypothesis testing, and rigorous verification.
</objective>

<process>
1. **Triage**: Analyze the issue description ($ARGUMENTS).
2. **Decision**:
   - **Quick Fix** (Typos, visible UI bugs, single-file logic):
     - Load `debug-like-expert` skill yourself.
     - Execute the fix immediately.
   - **Deep Investigation** (Crashes, Race Conditions, Unknown Errors, "Why is this happening?"):
     - **DELEGATE** to a sub-agent.
     - Run: `claude -p "Use the .agent/skills/debug-like-expert/SKILL.md to investigate: $ARGUMENTS" --allowedTools "Bash,Read,Grep,Glob,find_by_name,view_file,write_to_file,replace_file_content"`
     - Wait for the sub-agent to report the **Root Cause** and **Proposed Solution**.
     - Review the solution with your expert judgment before applying.
3. **Verify**: Run tests or visually confirm the fix.
</process>

<success_criteria>
- Skill successfully invoked
- Arguments passed correctly to skill
</success_criteria>
