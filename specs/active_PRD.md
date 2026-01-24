# Active PRD: Kitchen Assistant Phase 3 - Recipe Experience Refactor
**Focus**: Elevating the Recipe UI to a "Premium" standard using Stitch design principles.
**Current Status**: ✅ **Completed** (Ref: recipe_experience_review.md)

## 1. Feature Status Summary

| Feature | Priority | Status |
| :--- | :--- | :--- |
| **Recipe Detail UI Refactor** | High | ✅ **Completed** |
| **Gap Analysis "Visuals"** | High | ✅ **Completed** |
| **Search & Filter Polish** | Medium | ✅ **Completed** |

---

## 2. Feature: Recipe Detail UI Refactor (Stitch Design)
**Goal**: Transform the Recipe Detail screen from a basic data view into an immersive, "Chef's Interface" that provides instant clarity on "Can I cook this?" via visual gap analysis.

### User Stories
- **The Visual Cook**: As a user, I want to see a beautiful "Hero" image of the dish immediately, so I feel inspired to cook.
- **The Inventory Manager**: As a user, I want to see a clear visual progress bar (Green/Red) indicating how many ingredients I have vs. need, so I don't have to read every line item.
- **The Shopper**: As a user, I want missing ingredients to be grouped and clearly marked with an "Add to Cart" action, so I can seamlessly bridge the gap.
- **The Planner**: As a user, I want to easily adjust the serving size and have all ingredient quantities update automatically.

### UX & Design Guidelines (Stitch)
- **Hero Header**: Full-bleed image with gradient overlay. Absolute positioned back/action buttons.
- **Gap Analysis Widget**:
  -   **Progress Bar**: A segmented bar showing % match.
  -   **Status Text**: "You have X of Y ingredients".
  -   **Color Coding**: Green (In Stock), Red (Missing).
- **Ingredient Cards**:
  -   Rich cards with icons (Checkmark vs Alert).
  -   "In Pantry" vs "Missing" badges.
  -   Missing items have a direct "+" action.
- **Sticky Footer**:
  -   Floating action bar at the bottom.
  -   Primary action changes based on status:
    -   100% Match: "Cook This Now"
    -   <100% Match: "Shop Missing" + "Cook (Partial)"

### Technical Approach
1.  **Dependencies**:
    -   Install `expo-linear-gradient` for hero overlay.
2.  **Hooks Update (`useGapAnalysis`)**:
    -   Enhance hook to return `percentage`, `totalIngredients`, and `missingIngredients` lists directly (avoiding recalculation in UI).
3.  **UI Components (`app/recipes/[id].tsx`)**:
    -   Refactor to use `ScrollView` with `LinearGradient` hero.
    -   Implement `PortionController` (local state for `servings`).
    -   Rebuild ingredient list using new "Card" styling from Stitch HTML.

### Checklist (To Do)
- [x] **Dependencies**: Install `expo-linear-gradient`.
- [x] **Backend**: Update `useGapAnalysis` to export rich stats (percentage, missing lists).
- [x] **Frontend**:
    - [x] Implement Hero Header & Gradient.
    - [x] Build Gap Analysis Progress Widget.
    - [x] Build Ingredient Cards with Portion Scaling.
    - [x] Build Sticky Footer with dynamic actions.
- [x] **Verification**:
    - [x] Test "Cook Now" flow (deducts inventory).
    - [x] Test "Shop Missing" flow (adds to list).
    - [x] Verify portion scaling math.

---
