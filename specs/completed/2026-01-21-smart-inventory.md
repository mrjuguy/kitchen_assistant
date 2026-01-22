# Feature: Smart Inventory & Unit Conversion

## Context
The current pantry system uses simple text-based units and manual quantities, leading to disconnects between "Buying Units" (e.g., Loaf, Gallon) and "Consumption Units" (e.g., Slice, Cup, mL). Users need a system that normalizes units to US standards, allows easy fractional adjustments (e.g., "used 1/4 gallon"), and prompts for restocking.

## User Stories
1.  **As a Shopper**, I want my "1 Gallon of Milk" to be stored as "1 Gallon" (or 128 fl oz) in my pantry, not "3785 mL", so it matches how I think about it.
2.  **As a Cook**, I want to quickly tap "Used 1 Cup" or slide a bar to "50% left" for my milk, so I don't have to calculate remaining milliliters manually.
3.  **As a User**, I want the app to gently ask "Do you still have Spinach?" if I haven't updated it in a week, so my digital pantry stays real without me auditing everything constantly.
4.  **As a Planner**, I want to see a visual "Low Stock" warning when I have less than 20% of my butter left, so I know to add it to the list.

## UX & Design Guidelines
-   **Premium Feel**: The "Consumption" interaction should feel physical. Use a sliding "fluid level" animation for liquids (like a tank emptying) or a circular progress ring for solids.
-   **Gentle Audits**: The audit widget should not look like an error message. It should use soft colors (e.g., pastel info styling), smooth entry animations (FadeInDown), and be easily swipeable to dismiss.
-   **Unit Feedback**: When normalizing, briefly show the conversion (e.g., "Converted 3.7L to 1 Gallon") so the user understands the change.

## Edge Cases & Constraints
-   **Non-Convertible Units**: If a user enters "1 Box" or "1 Bundle", we cannot convert to "oz" or "gal". In these cases, disable the "Smart Consumption" slider and fallback to simple numeric ([-1] [+1]) stepper.
-   **Mixed Locales**: If a user explicitly selects Metric in settings (future), we should respect that. For now, hardcode US Default as requested.
-   **Offline Updates**: If an audit response fails to save (offline), queue it. Do not block the user.

## Requirements
1.  **Advanced Unit Support**: Support US Customary System (Gallon, Quart, Pint, Cup, fl oz, lb, oz) alongside Metric.
2.  **Automatic Normalization**: Convert all liquid inputs to a standard base (e.g., fl oz or Gallon) and weights to (oz or lb) based on category, defaulting to US units.
3.  **Smart Consumption**: Allow users to adjust pantry quantities by "Consumption Units" (e.g., "Used 1 Cup" subtracts from a Gallon jug).
4.  **Low Stock Alerts**: Visual or notified reminders when stock dips below a threshold (e.g., < 20%).
5.  **Refined Checkout**: When moving items from Shopping List to Pantry, normalize their units.
6.  **Routine Inventory Audits**: "Gentle," non-intrusive prompts to update stock levels for items that haven't been modified in a while (e.g., "Do you still have Milk?"). This handles the "untracked consumption" drift.

## Technical Approach

### 1. Unit Logic Core (`utils/units.ts`)
-   Create a comprehensive unit conversion utility.
-   **Categories**: Volume, Weight, Count (Item/Loaf/Slice - vague, stick to "Item" for now unless specific).
-   **Functions**: `convert(value, fromUnit, toUnit)`, `normalizeToUS(value, unit)`.

### 2. Database & Schema
-   **Schema Change**: Add `updated_at` timestamp to `PantryItem` to track "freshness" of the data.
-   *Future*: Potentially add `low_stock_threshold` to `PantryItem`. For now, hardcode logic (e.g., < 25%).

### 3. UI Components
-   **`AddItemForm.tsx`**: Update unit selector to use the structured list from `utils/units.ts`.
-   **`PantryCard.tsx`**:
    -   Replace simple quantity text with a `QuantityAdjuster` controls.
    -   Add a "Fractional Consumption" mode (e.g., Slider 0-100% or "Used 1/4").
    -   Visual indicator for Low Stock.
-   **`InventoryAudit.tsx`** (New):
    -   A gentle, dismissible widget appearing at the top of the specific screens.
    -   Logic: "Hey, you haven't updated [Milk] in 5 days. Still have it?"
    -   Quick actions: [Yes, it's full] [It's half full] [It's gone].

### 4. Logic Updates
-   **`hooks/useCheckoutShoppingList.ts`**: Intercept the transfer. Convert `ml` -> `fl oz` (or user's pref). Convert `kg` -> `lb`.
-   **`hooks/usePantry.ts`**: 
    -   Update `useUpdatePantryItem` to handle unit conversions.
    -   Add `useStalePantryItems`: Returns top 3 items not updated in > 7 days (prioritizing high-turnover categories like Dairy/Produce).

## Implementation Plan

### Step 1: Unit Utilities
-   Create `utils/units.ts` with `UNITS_DB`, `convertUnit()`, `getUSUnit()`.
-   Test conversions (e.g., 1 Gallon = 128 fl oz).

### Step 2: Database & Schema
-   Migration: Add `updated_at` column to `pantry_items`.
-   Update Types: Add `updated_at` to `PantryItem` interface.

### Step 3: Shopping to Pantry Handover
-   Update `hooks/useCheckoutShoppingList.ts` to run `normalizeToUS` on items before inserting into `pantry_items`.

### Step 4: Smart Pantry Card & Audit UI
-   Modify `components/Inventory/PantryCard.tsx` with consumption sliders.
-   Create `components/Inventory/InventoryAuditWidget.tsx`.
-   Integrate Audit Widget into the Pantry screen.

### Step 5: Verification
-   Test unit normalization.
-   Test "Stale Item" detection (manually set extensive backdated times).

## Story Checklist
-   [ ] **Unit Utilities**: `utils/units.ts` created with conversions for US/Metric volumes and weights.
-   [ ] **Database Migration**: `updated_at` column added to `pantry_items` table.
-   [ ] **Type Update**: `PantryItem` type updated to include `updated_at`.
-   [ ] **Shopping Handover**: `useCheckoutShoppingList` updated to normalize units (e.g., L to Gal) on transfer.
-   [ ] **UI - Add Item**: `AddItemForm` updated to use new unit options.
-   [ ] **UI - Pantry Card**: `PantryCard` updated with "Smart Consumption" controls (slider/buttons).
-   [ ] **Logic - Stale Detection**: `useStalePantryItems` hook implemented to find old items.
-   [ ] **UI - Audit Widget**: `InventoryAuditWidget` created and integrated into Dashboard/Pantry top.
-   [ ] **Verification**: Smoke test "Milk Run" (Buy Gal -> Scan -> Consume Cup -> Audit Prompt).
