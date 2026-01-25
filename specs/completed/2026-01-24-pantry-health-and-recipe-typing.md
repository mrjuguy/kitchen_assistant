# Active PRD: Phase 4 - Stability & Type Safety (VC-11)

**Focus**: Technical Debt reduction, typed routing, and strict recipe schema.
**Current Status**: In Progress

## 1. Feature Status Summary

| Feature | Priority | Status |
| :--- | :--- | :--- |
| **Typed Routing** | Urgent | ✅ **Completed** |
| **Recipe Schema Cleanup** | Urgent | ✅ **Completed** |
| **Pantry Expiry Logic** | High | ✅ **Completed** |
| **Expiry Badges** | High | ✅ **Completed** |

---

## 2. Feature: Typed Routing & Recipe Schema Cleanup (VC-11)
**Goal**: Eliminate `any` types in the Recipe module to improve reliability, DX, and prevent runtime crashes during navigation.

### User Stories
- **Developer Experience**: As a developer, I want to have full autocomplete and type safety when navigating between recipe screens so that I catch errors at build time.
- **Application Stability**: As a user, I want a stable app where recipe data always loads correctly without unexpected "undefined" errors.

### Technical Approach & Schema
1.  **Strict Interfaces**:
    - Ensure `RecipeWithIngredients` is correctly used everywhere.
    - Define `RecipeStackParamList` to type all routes under `/recipes/`.
2.  **Navigation Cleanup**:
    - Update `router.push` and `router.replace` calls to use typed routes instead of `as any`.
    - Properly type `useLocalSearchParams` in `[id].tsx` and `recipes.tsx`.
3.  **Codebase Refactor**:
    - Replace `any` in `filterRecipes`, `getAvailableTags`, and `RecipeCard`.
    - Ensure `useRecipes` and `useAddRecipe` hooks return strictly typed data.

### UX & Design Guidelines
- No visual changes requested, but performance might slightly improve due to cleaner data handling.
- Ensure that "Ready to Cook" and "Missing Ingredients" logic remains performant (related to VC-17).

### Edge Cases & Constraints
- **Deep Linking**: Ensure that passing an `id` to `/recipes/[id]` remains compatible with deep links if they exist.
- **Dynamic Search Params**: The `recipes.tsx` tab handles `mode`, `date`, and `meal_type` from the Planner. These must be optional and correctly typed.

### Checklist (To Do)
- [x] **Type Definitions**:
    - [x] Create/Update `types/navigation.ts` for route params.
    - [x] Audit `types/schema.ts` for completeness.
- [x] **Hooks**:
    - [x] Clean up `hooks/useRecipes.ts` return types.
    - [x] Update `hooks/useGapAnalysis.ts` to be strictly typed.
- [x] **Screens**:
    - [x] Refactor `app/(tabs)/recipes.tsx` (Remove `any`, type `mode/date`).
    - [x] Refactor `app/recipes/[id].tsx` (Type params and recipe state).
    - [x] Refactor `app/recipes/create.tsx` (Type form state and scraper logic).
- [x] **Utils**:
    - [x] Type `utils/recipeFilters.ts`.
    - [x] Type `utils/recipeScraper.ts` (Address VC-16 if possible).
- [x] **Verification**:
    - [x] Verify navigation from Recipes tab to Detail.
    - [x] Verify navigation from Planner to Recipes (select mode).
    - [x] Run `tsc` to verify zero type errors in the Recipe module.

---

## 3. Feature: Pantry Health & Expiry (VC-6 & VC-7)
**Goal**: Provide visual feedback for expiring items using a "Traffic Light" system.

### Checklist (To Do)
- [x] **Core Logic**:
    - [x] Create `utils/itemHealth.ts` utility for status categorization.
    - [x] Define HealthStatus type: 'good' | 'warning' | 'critical' | 'expired'.
    - [x] Add unit tests for categorization thresholds.
- [x] **UI Components**:
    - [x] Create `components/Inventory/ExpiryBadge.tsx` with dynamic colors.
    - [x] Integrate `ExpiryBadge` into `PantryCard.tsx`.
    - [x] Update `WastingSoonCard.tsx` to use central logic.
- [x] **Cleanup**:
    - [x] Deprecate and remove `utils/pantry.ts`.
    - [x] Update `PantryScreen` (index.tsx) to use the new utility for stats and filtering.
