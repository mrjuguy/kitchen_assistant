# Test Plan: Smart Expiration Date Chips

## 1. Visual Verification
- [x] Chips are horizontally scrollable if they exceed screen width.
- [x] Inactive chips have a gray background.
- [Chips have a blue background] Active chip has an Emerald-500 background with white text.
- [x] Chips are positioned correctly between the "Best Before" label and the date display.

## 2. Interaction Verification
- [x] Tapping a chip triggers a haptic success feedback.
- [x] Tapping a chip immediately updates the internal state and the displayed date.
- [x] Tapping a different chip switches the active state correctly.
- [Sets date to today, not a manual selection] Manual date selection (optional) deactivates chips if the date no longer matches.

## 3. Functional/Logic Verification
- [x] **+3 Days**: Sets date to `today + 3 days`.
- [x] **+1 Week**: Sets date to `today + 7 days`.
- [x] **+1 Month**: Sets date to `today + 1 month`.
- [x] **+1 Year**: Sets date to `today + 1 year`.
- [x] **Submission**: The selected date is correctly sent to Supabase in ISO format.

## 4. Regression Verification
- [x] Items with NO expiry date still appear in the "No Date" section of the inventory list.
- [x] Adding an item to the Shopping List still works (Smart Chips should be hidden for shopping target).
