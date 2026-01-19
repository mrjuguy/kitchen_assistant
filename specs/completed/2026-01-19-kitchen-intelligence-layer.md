# PRD: Kitchen Intelligence Layer (Phase 2)

## 1. Vision & Purpose
Transition the "Kitchen Assistant" from a manual tracker to an intelligent "Culinary OS". This phase introduces the **Gap Analysis Engine**, enabling users to see exactly what they can cook based on their current inventory and health profile.

## 2. Core Features

### A. User Health Profile & Safety
- **Objective**: Ensure all recipe matches respect user allergies and dietary restrictions.
- **Requirements**:
    - Build a `Profile` settings screen.
    - Track `allergens` (e.g., Peanuts, Dairy, Gluten) and `dietary_restrictions` (e.g., Vegan, Keto).
    - Rule: If a recipe contains a known allergen, it must be flagged as "Red" (Unsafe).

### B. Gap Analysis Engine (The Intelligence)
- **Objective**: Real-time cross-referencing of Inventory vs. Recipes.
- **Logic**:
    - **Green (Full Match)**: All ingredients are in the pantry with sufficient quantity.
    - **Yellow (Partial Match)**: Missing 1-2 ingredients or insufficient quantity.
    - **Red (Incompatible)**: Missing >2 ingredients OR contains an allergen from the User Profile.
- **Technical**: Implement a custom hook `useGapAnalysis(recipeId)` that performs this check.

### C. Recipe Action Flow
- **Recipe Detail Screen**: Enhanced view showing match status for each ingredient.
- **"Cook This" Button**:
    - Deducts required quantities from the `PantryItem` table.
    - Handles "out of stock" logic (removes or zeros out items).
- **"Add Missing to List" Button**:
    - Quickly adds all "Yellow" (missing/low) items to the `ShoppingItem` list.

## 3. Technical Requirements

### Schema Updates (`types/schema.ts`)
```typescript
export interface UserProfile {
    id: string; // matches auth.uid()
    display_name: string;
    allergens: string[];
    dietary_preferences: string[];
    created_at: string;
}

export interface Recipe {
    // ... existing
    tags: string[]; // for Keto, Vegan, etc.
    allergens: string[]; // list of allergens present in the recipe
}
```

### New Hooks & Services
- `useProfile`: Manage user health/dietary data.
- `useGapAnalysis`: The core logic for ingredient matching.
- `useRecipeActions`: Logic for the "Cook" and "Shop for Missing" actions.

## 4. UI/UX Targets
- **Visual Status**: Use colored badges (Green/Yellow/Red) on Recipe list items.
- **Ingredient Checklist**: Inside recipe detail, show "In Pantry" (Green check) or "Missing" (Orange plus) next to each item.
- **Haptics**: Use haptic feedback for the "Cook" action to confirm inventory deduction.

## 5. Implementation Plan

### Step 1: Health Profile & Schema
- [x] Add `profiles` table to Supabase.
- [x] Update `types/schema.ts` with Profile and enhanced Recipe types.
- [x] Create Profile settings page.

### Step 2: The Matcher (Engine)
- [x] Implement `useGapAnalysis` hook.
- [x] Create a "fuzzy matching" utility to handle "Tomato" vs "Tomatoes".

### Step 3: Intelligence in the UI
- [x] Update Recipe list items to show status badges.
- [x] Create an "Ingredient Matcher" component for the Recipe Detail screen.

### Step 4: Action Flow
- [x] Implement `deductPantryItems` helper.
- [x] Build the "Cook" and "Shop for Missing" buttons with confirmation flow.
