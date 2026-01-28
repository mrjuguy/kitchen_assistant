---
description: Auto-Fix Workflow - Fetches remote errors and fixes them locally.
---

# Auto-Fix Workflow

1. **Fetch Failures**
- Run `gh run list --branch $(git branch --show-current) --limit 1 --json databaseId,conclusion --jq '.[0]'` to get the latest Run ID and status.
- If `conclusion` is "success", output "Latest run was successful." and exit.
- If `conclusion` is NOT "success", proceed.
- Store `databaseId` as `RUN_ID`.


2. **Get Logs**
- Create temp directory if needed: `mkdir -p .agent/temp`
- Run `gh run view $RUN_ID --log-failed > .agent/temp/error.log`

3. **The Delegate**
   - **Action**: Spawn the `claude` child agent using the `run_command` tool.
   - **Command Config**:
     - Use `-p` for headless mode.
     - **Allowed Tools**: `Bash,Read,Grep,Glob,find_by_name,view_file,write_to_file,replace_file_content`.
     - **Agent**: `qa-bot` (if available) or generic.
   - **Context Injection**:
  "Analyze this CI failure log. Locate the file and error. 
  
  **CRITICAL RULES:**
  1. Fix the code to resolve the error.
  2. **DO NOT DELETE TESTS** or use `// @ts-ignore` to silence errors. Fix the underlying logic.
  3. **VERIFY** your fix locally (run the test/lint) before reporting success.
  
  Use the 'repair' skill if available."

4. **Push**
- Step: Stage changes `git add .`
- Step: Commit `git commit -m "fix: resolve CI failure"`
- Step: Push `git push`
