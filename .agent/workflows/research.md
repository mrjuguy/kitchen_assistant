---
description: Spawns a dedicated research agent to answer a specific question using codebase and web context.
argument-hint: [research question]
allowed-tools: Skill(spawn-child-agent)
---

<objective>
Spawn a headless child agent to research: $ARGUMENTS

The agent should search the codebase, read documentation, and potentially browse the web to answer the question. It must return a concise answer to the chat.
</objective>

<process>
1. **Delegation**: Spawn a child agent with the `researcher` role.
   - Command:
     ```bash
     claude -p "Research this question: $ARGUMENTS. 
     1. Search the codebase for relevant usage.
     2. If needed, search the web for external library docs.
     3. Summarize your findings in a brief markdown report.
     4. Suggest the next step." \
     --allowedTools "Bash,Read,Grep,Glob,find_by_name,view_file,search_web"
     ```

2. **Presentation**: Display the child agent's report to the user.
</process>

<success_criteria>
- Child agent spawns successfully.
- report provides a clear answer or path forward.
</success_criteria>
