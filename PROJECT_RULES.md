# Project Rules: Kitchen Assistant

## 1. Architectural Philosophy: Inventory-First
- **All logic must start with existing inventory.** Never assume an ingredient is available unless verified against the state.
- **The "Gap Analysis Engine" is the central source of truth.** All meal suggestions or recipe views must pass through a feasibility check:
  - **Green**: 100% stock + 100% Safe (Allergens).
  - **Yellow**: Partial stock + 100% Safe.
  - **Red**: Conflict with Health/Allergen profile.

## 2. Technical Standards
- **Strict TypeScript**: No `any` types. Interfaces for `PantryItem`, `Recipe`, `UserProfile`, and `Household` must be strictly defined in a central `types/` directory.
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
- **Styling Standard (Post-Issue #10)**:
  - **Always use NativeWind v4 utility classes** (`className="..."`) instead of inline `style={{...}}` objects.
  - For platform-specific styling (e.g., Android elevation), combine NativeWind with the `style` prop: `<View className="shadow-lg" style={{ elevation: 8 }}>`.
  - Follow the Emerald color palette for primary actions (`emerald-500`, `emerald-600`) and semantic colors (Red for destructive, Blue for informational).
  - Maintain consistent component structure: rounded corners (`rounded-2xl`, `rounded-xl`), padding (`p-4`, `px-6`), and shadow depth (`shadow-sm`, `shadow-lg`).

## 5. Folder Structure
- `/app`: Expo Router file-based pages.
- `/components`: Reusable UI components (fully NativeWind-styled).
- `/hooks`: Custom React hooks for business logic.
- `/services`: Supabase and external API clients.
- `/types`: Global TypeScript types and schemas.
- `/utils`: Helper functions (conversions, math, etc.).
- `/specs`: Project requirements and documentation.
- `/__tests__`: Integration and Unit tests.
- `/constants`: Global configuration and static values.
- `/.agent`: Internal development workflows and skills (not user-facing).
- `/tailwind.config.js`: NativeWind v4 configuration.
