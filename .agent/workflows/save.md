---
description: Fire & Forget Save - Non-blocking save that offloads checks to CI.
---

# Fire & Forget Save

1. **Check Status**
   - Run `git status`.

2. **Commit**
   - Stage all changes: `git add .`
   - Generate a concise commit message based on changes (e.g. using `git diff --cached`).
   - Run `git commit -m "[generated_message]"`

3. **Push**
   - Run `git push origin HEAD`

4. **End**
   - Output immediately: "🚀 Code pushed. QA and Scribe are running in the cloud. Check PR for status."