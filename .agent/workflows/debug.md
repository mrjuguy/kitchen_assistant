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
1. **Triage & History Check**
   - **Search**: Run `gh issue list --search "[Keywords from $ARGUMENTS]" --state all`.
   - **Check**: Is this a known issue? If Closed, how was it fixed?

2. **Context Warm-up**
   - **Locate**: Run `find_by_name` or `grep_search` to identify the files involved.
   - **Scope**: Is this isolated to one component or a system-wide failure?

3. **Reproduction (The "Red" Test)**
   - **Reproduction Mandate**: NO CODE CHANGES allowed until a "Red" test (Unit/Script) reproduces the bug.
   - **Constraint**: You (or the delegate) MUST create a reproduction case before fixing.
   - **Option A (Unit)**: Create `utils/__tests__/repro_issue.test.ts` that fails.
   - **Option B (Script)**: Create `scripts/repro_issue.ts` that demonstrates the bug.
   - **Option C (Manual)**: If UI-only, strictly define the "Fail State" steps.

4. **Investigation & Fix**
   - **Skepticism Rule**: Treat your own new code with higher skepticism than legacy code.
   - **Decision**:
     - **Quick Fix** (Typos, One File): Handle it yourself using `debug-like-expert`.
     - **Deep Dive** (Crashes, Logic Gaps):
       - **DELEGATE**: Spawn `claude -p "Investigate $ARGUMENTS. Use .agent/skills/debug-like-expert/SKILL.md. 1. Reproduce. 2. Fix. 3. Verify."`
       - **Wait**: Review the sub-agent's findings.

5. **Verify (The "Green" Test)**
   - **Action**: Run the reproduction test/script. It MUST pass now.
   - **Cleanup**: Delete the temporary reproduction file unless it's a valuable regression test.
</process>

<success_criteria>
- Skill successfully invoked
- Arguments passed correctly to skill
</success_criteria>
