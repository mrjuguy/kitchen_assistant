# Test Plan: Recipe Search & Filter Polish

## 1. Visual Verification
- [x] **Search Bar**: Verify it has a subtle shadow and blue border when focused.
- [x] **Search Bar**: Verify the 'X' button appears only when there is text.
- [x] **Filter Tabs**: Verify they appear as pill-shaped buttons.
- [x] **Tag Chips**: Verify they appear as a horizontal scrolling list below the tabs.
- [x] **Tag Chips**: Verify selected tags have a blue background and a small indicator dot.

## 2. Interaction Verification
- [x] **Search**: Type in the search bar and verify results update instantly.
- [x] **Clear Search**: Tap 'X' and verify text is cleared and list resets.
- [x] **Status Filters**: Tap "Ready to Cook" and verify only recipes with Green status are shown.
- [x] **Tag Filtering**: Tap a tag (e.g. "Breakfast") and verify only recipes with that tag are shown.
- [x] **Multi-select Tags**: Tap multiple tags and verify it performs an OR filter (showing recipes matching any selected tag).
- [x] **Combined Matching**: Search for a term AND select a tab AND select a tag. Verify the intersection is correct.

## 3. Logic Verification (Automated)
- [x] **Unit Tests**: `utils/__tests__/recipeFilters.test.ts` passes.
- [x] **Filtering accuracy**: Search matches names, descriptions, and tags.
- [x] **Tag Extraction**: Unique tags are correctly extracted from the recipe list.
