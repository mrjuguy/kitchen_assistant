# PRD: Expiration Tracking & Waste Prevention

## 1. Feature Overview
Turn the static pantry inventory into a "Live" system by tracking expiration dates. This features shifts the app from "Passive Storage" to "Active Management," helping users save money by cooking food before it spoils.

## 2. User Stories
- **As a Shopper**, I want to quickly set an approximate expiry date (e.g., "+1 week") when adding items so I don't have to fiddle with a calendar.
- **As a Cook**, I want to see which items are expiring *soon* at the top of my pantry list so I can prioritize them.
- **As a Planner**, I want visual cues (Red/Yellow/Green) on items to know their status at a glance.

## 3. UX & Design Guidelines
- **Visual Hygiene (The "Traffic Light" System)**:
  - **Good (Green)**: > 7 days remaining. No visual clutter.
  - **Warning (Yellow/Orange)**: 3-7 days remaining. Subtle indicator (dot or border).
  - **Critical (Red)**: < 3 days remaining. Prominent badge or text.
  - **Expired (Gray/Strike)**: Date passed. Distinct "Ghost" styling.
- **Input Friction**:
  - Do NOT force a date picker for every item.
  - Provide "Smart Chips" in the Add/Edit Modal: `+3 Days`, `+1 Week`, `+1 Month`.
- **Sorting**:
  - Add a "Sort By" control to the user's Pantry list (Default: Location, Option: Expiry).

## 4. Technical Implementation
- **Schema**: Use existing `expiry_date` (ISO String) in `PantryItem`.
- **Dependencies**: 
  - Install `expo-notifications` for local alerts (Phase 2).
  - Use `date-fns` for robust date math (already in likely, or install).
- **Components**:
  - `ExpiryBadge.tsx`: Small UI component for cards.
  - `SmartDateInput.tsx`: Custom input with "Quick Add" chips.
  - Update `PantryCard`: Accept styling props for "Critical" state.

## 5. Implementation Plan
### Phase 1: Core Logic & UI (MVP)
- [ ] Create `ItemHealth` utility (returns 'good' | 'warning' | 'critical' | 'expired').
- [ ] Update `PantryItem` component to render `ExpiryBadge`.
- [ ] Add `SmartDateInput` to `PantryItemDetail` (Edit Mode) and `AddItemForm`.

### Phase 2: Sorting & Dashboard
- [ ] Implement "Sort by Expiration" in `app/(tabs)/index.tsx`.
- [ ] Add "Wasting Soon" section to `InventoryAuditWidget` (Dashboard).

### Phase 3: Notifications (Premium)
- [ ] Install `expo-notifications`.
- [ ] Schedule local notification when Item enters "Warning" state.

## 6. Constraints & Edge Cases
- **Missing Dates**: Items without dates should be treated as "Good" (or separate category) but never "Expired".
- **Timezones**: Store everything in UTC, display in Local.
- **Past Dates**: Allow adding items with past dates (e.g., leftovers from yesterday).

## 7. Verification Plan
- [ ] Add an item with expiry = Today. Verify "Red" status.
- [ ] Add an item with expiry = Next Month. Verify "Green" status.
- [ ] Sort list. Verify Today item appears before Next Month item.
