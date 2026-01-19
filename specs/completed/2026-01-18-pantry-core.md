# PRD: Pantry Core & Inventory Foundation

## 1. Overview
The goal of this first feature set is to establish the "Source of Truth" for the Culinary OS: the **Pantry**. This will allow users to track what ingredients they have, which is prerequisite for the later "Gap Analysis Engine."

## 2. User Stories
- **As a user**, I want to see a visual list of all items currently in my kitchen.
- **As a user**, I want to quickly add a new item to my pantry.
- **As a user**, I want to update the quantity of an item or remove it when it's used up.
- **As a user**, I want my inventory to sync in real-time across devices (using Supabase).

## 3. Technical Requirements
### Data Model (Supabase/PostgreSQL)
- `pantry_items` table:
  - `id`: uuid (primary key)
  - `user_id`: uuid (references auth.users)
  - `name`: text (required)
  - `quantity`: float (default 1)
  - `unit`: text (e.g., 'grams', 'items', 'ml')
  - `category`: text (e.g., 'Produce', 'Dairy', 'Spices')
  - `expiry_date`: timestamptz (optional)
  - `barcode`: text (optional)
  - `image_url`: text (optional)
  - `created_at`: timestamptz

### Components to Build
- **PantryScreen** (`app/(tabs)/index.tsx`): The main inventory view.
- **PantryCard**: A premium list item showing product image/icon, name, and quantity controls.
- **AddItemModal**: A stylized entry form for new items.
- **QuantityControl**: Reusable +/- button component.

### Infrastructure
- `services/supabase.ts`: Supabase client initialization.
- `hooks/usePantry.ts`: TanStack Query hooks for CRUD operations (Read/Create/Update/Delete).
- `types/schema.ts`: TypeScript interfaces for the pantry entities.

## 4. Design Guidelines (from Project Rules)
- Use **NativeWind** for styling.
- **Gradients** for category badges (e.g., green for produce, blue for dairy).
- **Haptic feedback** on quantity updates (where possible in Expo).
- **8px Grid system** for all spacing.

## 5. Implementation Plan
### Phase 1: Foundation
1. Create `types/schema.ts` with the `PantryItem` interface.
2. Initialize `services/supabase.ts` (with placeholder env vars instructions).
3. Set up `hooks/usePantry.ts` with basic fetch logic using TanStack Query.

### Phase 2: UI Structure
1. Refactor `app/(tabs)/index.tsx` to display a list of pantry items.
2. Create `components/Inventory/PantryCard.tsx` with quantity controls.

### Phase 3: Interaction
1. Implement the `AddItemModal`.
2. Add "Optimistic Updates" to quantity changes for "instant" feel.
3. Add a "Search/Filter" bar to the PantryScreen.

## 6. Success Criteria
- User can add an item and see it appear in the list immediately.
- Quantities can be adjusted without a visible reload (Optimistic UI).
- Data persists in Supabase.
