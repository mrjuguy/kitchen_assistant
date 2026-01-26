# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kitchen Assistant (Culinary OS) is a premium inventory-first kitchen management app built with Expo (React Native) and Supabase. Core features include pantry tracking, recipe management, meal planning, and shopping lists with household sharing.

## Development Commands

```bash
npm start              # Start Expo dev server
npm run gatekeeper     # TypeScript + ESLint (zero warnings) - run before commits
npm test               # Run Jest tests
npm run lint           # ESLint only
npm run type-check     # TypeScript only

# Run single test file
npx jest path/to/file.test.ts

# Clear cache (after env/tailwind/global style changes)
npx expo start -c
```

## Architecture

### Data Flow
1. **Supabase** (PostgreSQL) - source of truth via Row Level Security
2. **TanStack Query** - caching layer with optimistic updates
3. **Custom Hooks** (`hooks/`) - business logic wrappers around Supabase queries
4. **Components** - render data, no direct Supabase calls

### Key Patterns

**Household Context**: All entities (pantry, recipes, shopping, meals) are scoped to a household. Hooks like `usePantry` automatically filter by `currentHousehold.id` from `useCurrentHousehold()`.

**Optimistic Updates**: Mutations in hooks (e.g., `useUpdatePantryItem`) use TanStack Query's `onMutate`/`onError` pattern for instant UI response with rollback on failure.

**Traffic Light Freshness**: `utils/itemHealth.ts` defines the `HealthStatus` system (good/warning/critical/expired) used throughout for expiry visualization. Thresholds: expired (<0 days), critical (0-2), warning (3-7), good (>7).

### Directory Structure

- `app/` - Expo Router file-based routing. `(tabs)/` contains main screens
- `components/` - Organized by domain (Inventory/, Recipes/, Planner/, Shopping/)
- `hooks/` - One hook file per domain (usePantry, useRecipes, useShoppingList, etc.)
- `services/` - External integrations (supabase.ts, openFoodFacts.ts)
- `utils/` - Pure functions for logic extraction (health calculations, unit conversions, filtering)
- `types/schema.ts` - All database entity types and their Create/Update variants

## Styling

NativeWind v4 (Tailwind CSS for React Native). Zero inline styles - use utility classes exclusively.

- Background: `bg-[#f5f7f8]` (off-white), surfaces: `bg-white`
- Brand color: emerald-500 (`#10b981`) for active states and accents
- Import `global.css` in root layout (already configured)

## Testing

Jest + React Native Testing Library.

**Critical mocking rules**:
- Mock custom hooks, not internal network calls: `jest.mock('../../hooks/usePantry', ...)`
- Native modules (expo-haptics, expo-camera, datetimepicker) MUST be mocked or Jest will hang
- ESM libraries in `transformIgnorePatterns` in jest.config.js

Test locations:
- `utils/__tests__/` - Unit tests for utility functions
- `__tests__/components/` - Component tests

## Environment Variables

Required in `.env`:
```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

## Agent Workflows

The `.agent/` directory contains workflows and skills:
- `/debug` - Systematic debugging with hypothesis testing
- `/save` - Zero-friction commit/branch/PR automation
- Skills in `.agent/skills/` provide domain expertise (testing-standards, debug-like-expert, etc.)
