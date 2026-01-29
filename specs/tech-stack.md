# Tech Stack: Kitchen Assistant (Culinary OS)

## Core Technologies
- **Framework**: [Expo](https://expo.dev/) (React Native)
  - *Rationale*: Native performance for Mobile (iOS/Android) and Web support from a single codebase. Built-in camera and barcode utilities.
- **Language**: TypeScript
  - *Rationale*: Critical for maintaining the complex "Inventory-First" data structures and safety-first allergen matching.
- **Backend/Database**: [Supabase](https://supabase.com/) (PostgreSQL)
  - *Rationale*: Scalable relational database for complex gap analysis queries, built-in Auth, and real-time data syncing.
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/)
  - *Rationale*: File-based routing that works seamlessly across native and web.

## UI & UX
- **Styling**: [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS for React Native)
  - *Rationale*: Utility-first CSS framework enabling rapid, consistent styling for a "premium" look across platforms. V4 provides improved performance and better TypeScript support.
  - *Architecture*: All components migrated from inline `style={{...}}` objects to Tailwind utility classes (e.g., `className="bg-white rounded-2xl p-4"`). This refactor (Issue #10) reduced style code volume by over 700 lines and provides a foundation for future dark mode implementation.
- **Visual Enhancements**: `expo-linear-gradient` for hero headers, `react-native-svg` for custom icons.
- **Icons**: [Lucide React Native](https://lucide.dev/)
  - *Rationale*: Modern, lightweight iconography with consistent stroke widths.
- **Components**: Custom primitive components built on NativeWind classes for maximum flexibility and reusability.

## Data Management
- **State Management**: [TanStack Query](https://tanstack.com/query/latest) (React Query)
  - *Rationale*: Efficient server state management, caching, and real-time updates.
- **API Layer**: Supabase-js client.
- **Analytics System**: 
  - **Internal**: Lightweight, immutable `usage_logs` system for tracking consumption and waste patterns. Aggregates data via pure utility functions with 100% test coverage.
  - **External**: [PostHog](https://posthog.com/) for product-led growth and user behavior analysis. Captures high-level events (recipe cooking, shopping, planning) to inform product roadmap decisions.

## Development Tools
- **Package Manager**: npm
- **Testing**: Jest & React Native Testing Library
- **Hygiene**: `.gitattributes` enforcement of LF line endings for cross-platform stability.
- **Tooling**: Prettier, ESLint (standard Expo config)

## Styling Architecture (Post-Issue #10 Refactor)

### Migration from Inline Styles to NativeWind
As of January 2026, all UI components have been refactored to use NativeWind v4 utility classes instead of inline `StyleSheet` or style objects. This architectural shift provides:

1. **Consistency**: Unified design language across all screens (Inventory, Recipes, Planner, Profile, Shopping, Login).
2. **Maintainability**: Reduced style code by 700+ lines. Changes to design tokens (colors, spacing, shadows) can now be managed centrally via Tailwind config.
3. **Dark Mode Ready**: Utility-based styling provides a foundation for future `dark:` variant implementation.
4. **Performance**: NativeWind v4 compiles utilities at build time, reducing runtime style computation.

### Key Refactored Components
- **Login Screen**: Email/password inputs, branded ChefHat hero icon, responsive layout.
- **Inventory Tab**: `PantryCard`, `ExpiryBadge`, `ProductDetailModal`, `AddItemForm`, `QuantityControl`, `WastingSoonCard`.
- **Recipes Tab**: `RecipeCard`, `IngredientMatcher` with gap analysis visuals.
- **Shopping Tab**: `ShoppingItemCard` with aisle grouping, `FrequentlyExpiredList` analytics widget.
- **Planner Tab**: `MealCard`, `WeekStrip` calendar UI.
- **Profile Tab**: User settings, household management UI.

### Styling Conventions
- **Shadow Support**: NativeWind shadows combined with native `elevation` prop for Android compatibility:
  ```tsx
  <View className="shadow-lg" style={{ elevation: 8 }}>
  ```
- **Color Palette**: Emerald (`emerald-500`, `emerald-600`) for primary actions, Gray scales for neutral UI, semantic colors (Red for delete, Blue for info).
- **Responsive Spacing**: Consistent use of Tailwind spacing scale (`p-4`, `mb-3`, `gap-2`).
- **Typography**: Defined text sizes (`text-lg`, `text-base`, `text-sm`) with weight modifiers (`font-bold`, `font-semibold`).
