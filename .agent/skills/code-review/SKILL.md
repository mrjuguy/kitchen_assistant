---
name: code-review
description: Audits code for errors, security issues, and alignment with project rules.
---

# Code Review Standards

## 1. The "North Star" Check
- **Verification**: Does the code actually fulfill the requirements in `specs/active_PRD.md`?
- **Premium Polish**: Does the code include the required premium indicators (Haptics, Skeletons, Loading states) mentioned in the PRD or Project Rules?
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

## 4. Syntax & Type Integrity
- **Verification of UAT**: Check if the user has verified the manual test plan in `specs/test_plans/`. If the test plan is empty or missing, it's a review failure.
- **DRY Types (The "Single Source" Rule)**: Never duplicate complex type or interface definitions. If a data structure is used in more than one layer (e.g., Service AND Hook), it MUST be defined in `types/schema.ts` and imported.
- **Replacement Atomicity**: When using `replace_file_content`, ensure the new block is a complete, syntactically valid React/TS fragment. Check for:
  - Balanced tags (e.g., `<Pressable>` must close).
  - Proper props destructuring (e.g., if you use `onPress`, you must destructure it from props).
  - No leftover placeholder comments (e.g., `// ... existing content ...`).
  - **Context Preservation**: When modifying imports or initialization code (e.g., `Platform.OS` checks), verify you are not accidentally overwriting adjacent required lines. Prefer `TargetContent` that is highly specific to the lines changing, or include the adjacent static lines in your `ReplacementContent` to ensure they persist.
- **Error Handling**: Every network or DB call MUST have a `try/catch` block or a defined error state in a TanStack query.

## How to Report
- **Review Archival**: Every finalized review MUST be saved to `specs/reviews/[feature_name]_review.md`. 
- **Pass**: "✅ Code looks good and meets all standards."
- **Fail**: List the specific file, line number, and the violation.
- **Fix Suggestion**: Provide the exact code block to fix the issue.