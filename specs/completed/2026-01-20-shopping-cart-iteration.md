# PRD: Shopping Cart Iteration

## 1. Goal
Refine the Shopping List experience to be more fluid, organized, and feature-rich, enabling users to manage their grocery trips efficiently and seamlessly transition items to their pantry.

## 2. Core Features

### A. Categorized View (UX Polish)
- **Problem**: The current shopping list is a flat list, making it hard to shop aisle-by-aisle.
- **Solution**: Group items visually by `category` (Produce, Dairy, Spices, etc.).
- **Implementation**:
  - Update `ShoppingScreen` to use a `SectionList` or grouped `FlatList`.
  - Sort groups alphabetically or by a logical store order (Produce first -> Frozen last).

### B. Smart "Quick Add" with Product Search
- **Problem**: Manually typing "Oreo" results in a generic text item without nutritional data, brand info, or images, unlike the scanner.
- **Solution**: Integrate a search-as-you-type feature that queries OpenFoodFacts.
- **Behavior**:
  - User types "Oreo" into the persistent input.
  - **Autocomplete List**: App displays a list of matching products fetched from OpenFoodFacts (e.g., "Oreo Original", "Oreo Double Stuf") with their thumbnails.
  - **Selection**: User taps a product -> Adds a rich `ShoppingItem` with image, brand, nutrition, etc.
  - **Fallback**: User hits "Return" without selecting -> Adds a generic item with the typed name (e.g., "Oreo" in "Uncategorized").

### C. Advanced Checkout Actions
- **Problem**: The "Checkout" button moves everything to pantry, but sometimes users just want to clear the list or delete completed items without stocking them.
- **Solution**:
  1. **Checkout (Primary)**: Moves bought items to Pantry, deletes from List. (Existing)
  2. **Clear Checked (Secondary)**: Deletes bought items *without* moving to Pantry. (New)
  3. **Delete All (Destructive)**: Wipes the entire list.

### D. Scanner Integration refinement
- **Problem**: The scanner in `AddItemForm` hardcodes `bought: false`.
- **Solution**: Ensure the `useAddShoppingItem` hook accepts a `bought` parameter, so future "Scan to Cart" features (where you scan items as you put them in the physical cart) can default to `true`.

## 3. Technical Implementation

### Services
- **`services/openFoodFacts.ts`**:
  - Implement `searchProducts(query: string)`:
    - URL: `https://world.openfoodfacts.org/cgi/search.pl?search_terms={query}&search_simple=1&action=process&json=1`
    - Map results to `ProductData` interface.

### Schema & Types
- No major schema changes required.
- Update `CreateShoppingItem` type to allow optional `bought` (currently omitted).

### Component Updates
- **`app/(tabs)/shopping.tsx`**:
  - Implement `SectionList` logic.
  - **Quick Add Component**:
    - Replace simple `TextInput` with a compound component (Input + Dropdown List).
    - Manage `debounced` search state.
    - Handle selection logic (Rich add vs. Generic add).
  - Add secondary action menu (using a simple UI or ActionSheet) for "Clear Checked".
- **`components/Shopping/ShoppingItemCard.tsx`**:
  - Ensure styling works well within sections.
- **`hooks/useShoppingList.ts`**:
  - Update `useAddShoppingItem` to support `bought` status.
  - Add `useClearBoughtAction` (just delete, no copy).

## 4. Success Criteria
- User can see items grouped by category.
- Typing in "Quick Add" shows real product results within 500ms.
- Selecting a search result adds an item with an image and brand to the list.
- User can standard "Checkout" (move to pantry) OR "Clear" (delete only).
