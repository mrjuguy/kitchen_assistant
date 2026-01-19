---
name: testing-standards
description: Standards for writing and running tests. Use this whenever writing code to verify functionality.
---

# Testing Strategy

## Philosophy
- **Test-Driven-ish**: When writing a new feature, write the test *before* or *simultaneously* with the code.
- **Keep it Simple**: Prioritize Unit Tests (testing one function) over complex End-to-End tests.

## Preferred Tools (Stack Dependent)
- **If Next.js/React**: Use **Vitest** + **React Testing Library**.
- **If React Native (Expo)**: Use **Jest** + **React Native Testing Library** (`@testing-library/react-native`).
- **If Python**: Use **Pytest**.
- **If Node/Backend**: Use **Vitest** or **Jest**.

## Rules for the Agent
1. **Self-Correction**: If a test fails, analyze the error message. Do not ask the user for help unless you fail 3 times.
2. **Mocking**: Never make real API calls in tests. Always mock network requests (e.g., using `msw` or simple function mocks).
3. **Clean Output**: When running tests, use the verbose flag only if debugging. Otherwise, keep output minimal.