# Kitchen Assistant - Project Context

## Commands
*   **Run Dev**: `npm start` (Press `w` for Web)
*   **Lint**: `npm run lint` (Fix: `npm run lint -- --fix`)
*   **Type Check**: `npm run type-check`
*   **Test**: `npm test`
*   **Doc Gen**: `npm run doc-gen` (Run after big features)

## Architecture
*   **Stack**: React Native (Expo Router), TypeScript, NativeWind v4, TanStack Query, Supabase.
*   **Data Model**: "Gap Analysis Engine" (Inventory-First Logic).
*   **Scoping**: All entities (pantry, recipes, shopping, meals) are scoped to a `household_id`. Hooks like `usePantry` automatically filter by `currentHousehold`.
*   **State**: Server state via TanStack Query. Local UI state via React Hooks.

## Testing Rules (Jest)
*   **Mocking**: Mock custom hooks, not internal network calls (e.g., `jest.mock('../../hooks/usePantry')`).
*   **Native Modules**: Modules like `expo-haptics`, `expo-camera`, and `datetimepicker` MUST be mocked or Jest will hang.
*   **Locations**:
    *   `utils/__tests__/`: Unit tests.
    *   `__tests__/components/`: Component tests.

## Code Style
*   **Strict Types**: No `any`. Define interfaces in `/types`.
*   **Styling**: Use NativeWind v4 (`className="p-4 bg-emerald-500"`). Avoid inline `style`.
*   **Components**: Functional, immutable. Business logic in `/hooks`.
*   **Images**: NO placeholders. Use `generate_image` or Lucide icons.

## Environment Variables
Required in `.env`:
```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

## Agent Workflows (The "Cybernetic" Interface)
*   **Startup**: `/start-session` (Syncs git, analyzes backlog, health check).
*   **Intake**: `/ideate` (Brainstorm new features -> Issues).
*   **Plan**: `/plan` (Issue -> PRD with duplication checks).
*   **Execute**: `/execute` (Decides Heavy vs Light -> Code).
*   **Save**: `/save` (Pre-Flight Check -> Commit -> Living PRD Update).
*   **Ship**: `/ship` (Merge PR -> Cleanup Branches).
*   **Release**: `/release` (Version Bump -> Changelog -> Tag).

## Critical Instructions
1.  **Inventory First**: Never assume ingredients exist. Check `useGapAnalysis`.
2.  **Safety**: Allergen checks must default to "Unsafe" if data is missing.
3.  **Household Isolation**: Ensure all DB queries filter by `household_id`.
