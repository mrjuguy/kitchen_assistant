# PRD: Deep Pantry Intelligence (Nutrition & Macros)

## 1. Feature Overview
Turn the Pantry into a "Smart Inventory" by capturing and displaying rich nutritional data, ingredients, and allergen information from scanned products. This leverages the existing OpenFoodFacts integration to populate data automatically.

## 2. User Stories
- **As a health-conscious user**, I want to see the macronutrients (protein, carbs, fat) of items in my pantry so I can plan balanced meals.
- **As a user with allergies**, I want to see the ingredient list of scanned items to ensure they are safe.
- **As a shopper**, I want the scanner to automatically save this information so I don't have to enter it manually.

## 3. Technical Implementation

### Database Schema (Supabase)
Update `pantry_items` table:
- `nutritional_info` (JSONB): To store structured nutrition data (calories, macros, etc.).
- `ingredients_text` (TEXT): Full list of ingredients.
- `allergens` (TEXT[]): Array of potential allergen tags (e.g., `["en:gluten", "en:peanuts"]`).
- `labels` (TEXT[]): Diet labels (e.g., `["en:organic", "en:vegan"]`).

### Service Layer (`services/openFoodFacts.ts`)
Update `fetchProductByBarcode` to extract:
- `nutriments`: map to a clean object (calories, proteins, carbohydrates, fat, sugar, fiber).
- `ingredients_text`: `product.ingredients_text`
- `allergens_tags`: `product.allergens_tags`
- `labels_tags`: `product.labels_tags` (simplified)
- `brands`: `product.brands` (already there, ensure it's saved)

### UI/UX
1.  **Scanner / Add Form (`AddItemForm.tsx`)**:
    - When a product is scanned, fetch and store the extra data in state.
    - No huge visual change needed on the *Form* itself, but maybe show a "Nutrition Info Found" badge.
2.  **Pantry Item Detail**:
    - Current `PantryCard` is simple. We need a way to view details.
    - **Action**: Make the `PantryCard` clickable (or add an "Info" button) to open a `PantryItemDetail` modal.
    - **Detail Modal**:
        - Header: Image & Name.
        - Section 1: "Nutrition Facts" (Table style).
        - Section 2: "Ingredients" (Text block).
        - Section 3: "Tags" (Pills for Organic, Gluten-Free, etc.).

## 4. Implementation Steps
1.  **Migration**: Create SQL to add columns to `pantry_items`.
2.  **Service**: Update `fetchProductByBarcode` to return rich data.
3.  **Hooks**: Update `useAddPantryItem` to accept and insert the new fields.
    - *Note*: Also `useUpdatePantryItem` if we want to allow manual editing (low priority for now, automate first).
4.  **UI Components**:
    - Create `NutritionLabel` component.
    - Update `PantryCard` to support "View Details".
    - Create `PantryItemDetail` screen/modal.

## 5. Success Metrics
- Scanned items populate `nutritional_info` in the database.
- Users can view a Nutrition Label for their scanned items.
