# PRD: Culinary OS Expansion (Scanner, Shopping List & Recipes)

## Overview
This feature set expands the "Kitchen Assistant" from a static inventory tracker into a dynamic culinary ecosystem. We will implement barcode scanning for easy entry, a shopping list for replenishment, and basic recipe integration to answer the question: "What can I cook with what I have?"

## Core User Stories
1. **The Modern Shopper**: "I want to scan a barcode and have the app identify the product so I don't have to type everything manually."
2. **The Replenisher**: "I want to keep a list of items I need to buy and move them into my pantry with a single tap once I'm home."
3. **The Home Cook**: "I want to see recipes that I can make using the ingredients already in my pantry."

## Technical Foundation & Constraints
- **Scanner**: Use `expo-camera` (modern replacement for `expo-barcode-scanner`).
- **Data Persistence**: Continue using Supabase for `shopping_list` and `recipes` tables.
- **UI Consistency**: Use NativeWind and Lucide icons; maintain the emerald/zinc "premium" aesthetic.

## Feature Phases

### Phase 1: The Shopping Hub (Shopping List & Scanner)
- **Shopping List Screen**: Transform `app/(tabs)/two.tsx` into a dedicated Shopping List.
- **Scanner Integration**: Add a barcode scanner to the "Add Item" flow (`app/modal.tsx`).
- **Transfer Logic**: Implement a "Check out" feature to move bought items from Shopping List to Pantry.

### Phase 2: Recipe Intelligence (Discovery & Gap Analysis)
- **Recipe Management**: Create a new tab or section for Recipes.
- **Gap Analysis**: Simple logic to compare recipe ingredients against `pantry_items`.
- **UI**: Display recipes with "Missing Ingredients" indicators.

## Implementation Plan

### Step 1: Database Migration
- [x] Add `shopping_list` table to Supabase.
- [x] Add `recipes` and `recipe_ingredients` tables.

### Step 2: Shopping List UI & Logic
- [x] Implement `useShoppingList` hook.
- [x] Build `app/(tabs)/shopping.tsx` (renamed from `two.tsx`).
- [x] Add `ShoppingItemCard` component.

### Step 3: Smart Scanner Implementation
- [x] Install `expo-camera`.
- [x] Add scanner view to `app/modal.tsx`.
- [x] Integrate a barcode lookup API (e.g., OpenFoodFacts).

### Step 4: Recipe Foundation
- [x] Build `app/(tabs)/recipes.tsx`.
- [x] Implement gap analysis service.

## Success Metrics
- Item entry time reduced via scanner.
- Zero manual entry needed for restocking (Transfer to Pantry).
- At least 3 recipes correctly identified as "cookable" based on current pantry.
