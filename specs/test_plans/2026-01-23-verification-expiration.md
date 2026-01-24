# Phase 1 Verification Plan: Expiration Tracking

This guide specifically validates the "Smart Date Input" and "Wasting Soon" dashboard features newly implemented in Phase 1.

## 1. Dashboard & Visuals Check
**Goal**: Verify the "Stitch" Premium Design and "Traffic Light" logic.

1.  **Launch App**: Open the app. Ensure the new "Culinary OS" header and User profile circle are visible.
2.  **Verify Stats**: Check the "Kitchen Health" stats row.
    *   *Expected*: Correct total item count. "Freshness Score" should be roughly accurate (percentage of non-expired items).
3.  **Wasting Soon Shelf**:
    *   *Action*: If you have NO expiring items, this shelf should be HIDDEN.
    *   *Action*: If you have items expiring in < 7 days, they should appear here in horizontal scroll.

## 2. Smart Input & date Capture
**Goal**: Verify users can easily set dates without typing.

1.  **Open Add Modal**: Tap the Floating Action Button (+) -> "Add Item". | Pass
2.  **Toggle Pantry**: Ensure "Pantry" is selected (Date input hides on "Shopping List"). | Pass
3.  **Scroll Down**: Locate "Expiration Date" section. | Pass
4.  **Test Chips**:
    *   Tap `+3 Days`. Verify the displayed date updates to 3 days from now. | Pass
    *   Tap `+1 Week`. Verify date updates. | Pass
    *   Tap `Clear`. Verify date resets to "No date set". | Pass
5.  **Submit**:
    *   Enter Name: "Test Milk". | Pass
    *   Select Date: Tap `+3 Days` (or `+1 Week`). | Pass
    *   Click "Add to Pantry". | Pass

## 3. Logic Verification (The "Traffic Light")
**Goal**: Verify the `ItemHealth` utility categorizes items correctly. | Pass

| Test Item Name | Expiry Setting | Expected Status | Expected Color | Dashboard Location |
| :--- | :--- | :--- | :--- | :--- |
| **"Urgent Meat"** | `+1 Day` (or Tomorrow) | **Critical** | 🔴 Red | Wasting Soon Shelf (First) | Pass
| **"Warning Cheese"** | `+3 Days` | **Warning** | 🟡 Amber | Wasting Soon Shelf | Pass
| **"Safe Rice"** | `+1 Month` | **Good** | 🟢 Green | Main List Only (Hidden from Top Shelf) | Pass
| **"Old Leftovers"** | Pick a past date (if possible) | **Expired** | 🔴 Red "Expired" | Wasting Soon Shelf | Pass

## 4. Interaction Test
1.  **Tap a Card**: Tap an item in the "Wasting Soon" shelf. | Pass
2.  **Result**: It should open the `ProductDetailModal` for that specific item. | Pass
3.  **Cross-Check**: Find the same item in the main list (e.g. under "Fridge"). It should have a small colored dot next to its name matching the shelf color. | Pass

## 6. Sorting Test
**Goal**: Verify the new grouping logic.

1.  **Locate Sort Toggle**: Check above the "Live Inventory" list. You should see "Location" and "Expiry" buttons. | Pass
2.  **Switch to Expiry**: Tap `Expiry`.
    *   *Expected*: The list should now be grouped by: `Expired`, `Critical`, `Warning`, `Good`, `No Date`. | Pass
3.  **Cross-Verify**: Ensure an item with a "Red" dot in Location view moves to the `Critical` section in Expiry view. | Pass
4.  **Empty States**: If you have no "Expired" items, that section header should be hidden. | Pass

## 7. Notification Test (Phase 3)
**Goal**: Verify that local notifications are scheduled when items are added.

1.  **Permission Check**:
    *   Restart the app (`r`).
    *   Verify that the app asks for Notification Permissions (or has already been granted). | Pass
2.  **Schedule Critical Alert**:
    *   Add Item: "Critical Steak"
    *   Expiry: Select `+3 Days` -> manually edit date to be `Tomorrow` if possible, or just expect the `Warning` notification.
    *   *Correction*: Since `+3 Days` is within the 3-7 day window, it should trigger a **Warning** alert. | Pass
3.  **Verification**:
    *   Since these are *scheduled* for the future, we can't easily see them trigger immediately without mocking time.
    *   **Debug Verification**: Watch the console log when adding an item. (Currently no logs, but no errors means success). | Pass
