# Project Rules: Kitchen Assistant

## 1. Architectural Philosophy: Inventory-First
- **All logic must start with existing inventory.** Never assume an ingredient is available unless verified against the state.
- **The "Gap Analysis Engine" is the central source of truth.** All meal suggestions or recipe views must pass through a feasibility check:
  - **Green**: 100% stock + 100% Safe (Allergens).
  - **Yellow**: Partial stock + 100% Safe.
  - **Red**: Conflict with Health/Allergen profile.

## 2. Technical Standards
- **Strict TypeScript**: No `any` types. Interfaces for `InventoryItem`, `Recipe`, and `UserHealthProfile` must be strictly defined in a central `types/` directory.
- **Component Architecture**: 
  - Use Functional Components with Hooks.
  - Keep UI components "dumb" (presentational) where possible.
  - Business logic (filtering, analysis) should reside in custom hooks (e.g., `useGapAnalysis`).
- **Data Fetching**: Always use TanStack Query for server-state. Use optimistic updates for inventory changes (e.g., scanning an item should feel instant).

## 3. Safety & Compliance
- **Safety First**: Any logic involving Allergens or Dietary Restrictions must have unit tests.
- **Fail-Safe**: If the health data is unavailable or errored, the app should default to "Red" (Unsafe) for any ingredient it cannot verify.

## 4. UI/UX Rules
- **Mobile-First Design**: Ensure hit targets are large (min 44x44px for buttons).
- **Premium Aesthetics**: Use subtle gradients, consistent spacing (8px grid), and smooth transitions.
- **No Placeholders**: Real item images or generated icons should always be used. Avoid generic "no image" text if possible.

## 5. Folder Structure
- `/app`: Expo Router file-based pages.
- `/components`: Reusable UI components.
- `/hooks`: Custom React hooks for business logic.
- `/services`: Supabase and external API clients.
- `/types`: Global TypeScript types and schemas.
- `/utils`: Helper functions (conversions, math, etc.).
- `/specs`: Project requirements and documentation.
