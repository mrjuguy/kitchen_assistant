---
description: Auto-Fix Workflow - Fetches remote errors and fixes them locally.
---

# Auto-Fix Workflow

Step 1: Fetch Failures
- Run `gh run list --branch $(git branch --show-current) --limit 1 --json databaseId,conclusion --jq '.[0]'` to get the latest Run ID and status.
- If `conclusion` is "success", output "Latest run was successful." and exit.
- If `conclusion` is NOT "success", proceed.
- Store `databaseId` as `RUN_ID`.

Step 2: Get Logs
- Create temp directory if needed: `mkdir -p .agent/temp`
- Run `gh run view $RUN_ID --log-failed > .agent/temp/error.log`

Step 3: Spawn Repair Agent
- Read contents of `.agent/temp/error.log`.
- Spawn a child agent (or use the tool if available) with the following instruction:
  "Analyze this CI failure log. Locate the file and error. Fix the code to resolve the error. Do not refactor unrelated code. Use the 'repair' skill if available."

Step 4: Push
- Step: Stage changes `git add .`
- Step: Commit `git commit -m "fix: resolve CI failure"`
- Step: Push `git push`
