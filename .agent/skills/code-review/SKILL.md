---
name: code-review
description: Audits code for errors, security issues, and alignment with project rules.
---

# Code Review Standards

## 1. The "North Star" Check
- **Verification**: Does the code actually fulfill the requirements in `specs/active_PRD.md`?
- **Scope Creep**: Did the code add unnecessary features not requested in the PRD?

## 2. Technical Compliance
- **Stack Alignment**: Does the code match the tools defined in `specs/tech-stack.md`? (e.g., Don't use `axios` if we decided on `fetch`).
- **Testing**:
  - Do tests exist for the new code?
  - Do the tests follow the `testing-standards` skill?
- **Types/Safety**:
  - Are there any `any` types? (Strictly forbidden).
  - Are errors handled gracefully (try/catch)?

## 3. Security & Cleanliness
- **Secrets**: Are there any hardcoded API keys or passwords? (FLAG IMMEDIATELY).
- **Console Logs**: Are there leftover `console.log` statements?
- **Comments**: Are complex logic blocks explained with comments?

## How to Report
- **Pass**: "✅ Code looks good and meets all standards."
- **Fail**: List the specific file, line number, and the violation.
- **Fix Suggestion**: Provide the exact code block to fix the issue.