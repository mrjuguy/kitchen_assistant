# Active PRD: Kitchen Assistant Phase 2

**Focus**: Enhancing Core Utility & Multi-User Collaboration
**Current Status**: In Progress

## 1. Feature Status Summary

| Feature | Priority | Status |
| :--- | :--- | :--- |
| **Recipe Import** | High | ✅ **Completed** |
| **Inventory UI (Sections)** | Medium | ✅ **Completed** |
| **Household Management** | Critical | ✅ **Completed** |

---

## 2. Feature: Recipe Import from URL
**Goal**: Iterate on the existing Recipes feature to enhance functionality and user experience.

### User Stories
- **Import**: As a user, I want to paste a URL from a recipe website and have the app automatically extract the title, ingredients, instructions, and image.
- **Attribution**: As a user, I want to see the original author and source link for imported recipes.
- **Safety**: As a user, I want to know if a recipe contains my specific allergens immediately.

### Checklist (Completed)
- [x] Create `utils/recipeScraper.ts` with JSON-LD parsing logic.
- [x] Implement `extractRecipeFromUrl` function with fallback handling.
- [x] Update `recipes/create.tsx` UI to include prominent URL input.
- [x] Connect Import Logic to Form State (pre-fill fields).
- [x] Implement Author/Source attribution fields.
- [x] Refine "Gap Analysis" (Red = Unsafe, Yellow = Missing Ingredients).

---

## 3. Feature: Inventory UI Refinement
**Goal**: Improve organization of the pantry screen to reflect real-world kitchen storage.

### User Stories
- **Storage Locations**: As a user, I want to categorize items as "Fridge", "Freezer", or "Pantry" so I know exactly where to look.
- **Browsing**: As a user, I want to collapse sections I'm not looking at (e.g., hide Freezer items when checking the Fridge) to reduce clutter.

### Checklist (Completed)
- [x] **Database**: Add `storage_location` column to `pantry_items`.
- [x] **UI**: Update `AddItemForm` to include a location selector (Pantry/Fridge/Freezer).
- [x] **List View**: Convert Pantry list to a `SectionList` with collapsible headers.

---

## 4. Feature: Household Management (Invite Wife)
**Goal**: Enable multiple users to manage a shared kitchen inventory and meal plan. **Critial Architecture Change**.

### User Stories
- **Shared Access**: As a user, I want to invite my partner to my "Kitchen" so we both see the same Pantry and Shopping List.
- **Real-time Sync**: As a user, I want to see items my partner adds to the shopping list immediately.
- **Onboarding**: As a new user, I want to easily join an existing household via an invite code or link.

### Technical Approach & Schema
1.  **New Table**: `households`
    - `id` (uuid, pk)
    - `name` (text)
    - `invite_code` (text, unique)
    - `created_at`
2.  **New Table**: `household_members`
    - `household_id` (fk)
    - `user_id` (fk)
    - `role` (admin, member)
3.  **Migration Strategy**:
    - Create a "Personal Household" for every existing user.
    - Move all existing user data (Pantry, Recipes, Shopping) to be owned by `household_id` instead of `user_id`.
    - **CRITICAL**: Update all Row Level Security (RLS) policies.
      - *Old*: `auth.uid() = user_id`
      - *New*: `auth.uid() IN (SELECT user_id FROM household_members WHERE household_id = resource.household_id)`

### Checklist (Completed)
- [x] **Schema Migration**:
    - [x] Create `households` and `settings/members` tables.
    - [x] Script to backfill households for existing users.
    - [x] Add `household_id` to `pantry_items`, `shopping_items`, `recipes`, `meal_plans`.
    - [x] Backfill `household_id` based on owner.
- [x] **Backend Security**:
    - [x] Update RLS policies for all tables to check household membership.
- [x] **App Logic Refactor**:
    - [x] Update `usePantry`, `useShoppingList`, etc. hooks to fetch by household (usually automatic via RLS, but double check).
    - [x] Remove hardcoded `user_id` inserts in favor of `household_id`.
- [x] **UI - Settings**:
    - [x] Create "Manage Household" screen.
    - [x] Implement "Invite User" flow (Share generic invite code).
    - [x] Implement "Join Household" flow (Input code).
- [x] **UI - Onboarding**:
    - [x] Update initial auth flow to Create vs Join household.
