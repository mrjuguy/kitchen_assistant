# PRD: Smart Expiration Date Input Chips (VC-8)

## 1. Introduction
**Feature**: Smart Expiration Date Input Chips
**Cycle**: Cycle 1: Freshness Foundation
**Goal**: Reduce the friction of manually selecting expiration dates by providing one-tap "Quick Chips" for common durations (e.g., +1 week, +1 month).

## 2. User Stories
- **As a Shopper**, I want to quickly tap "+1 Week" for my milk so I don't have to scroll through a calendar picker.
- **As a Home Cook**, I want to tap "+1 Year" for canned goods to roughly estimate shelf life without precision fatigue.
- **As a User**, I want visual feedback when a chip is selected so I know the date has been updated.

## 3. UX & Design Guidelines
- **Visuals**:
  - Horizontal scrollable list (or flex wrap) of "Chips".
  - **Inactive Chip**: Gray background, standard text.
  - **Active Chip**: Brand color background (Emerald-500), white text.
  - **Animation**: Gentle scale/fade on press.
- **Micro-interactions**:
  - Tapping a chip updates the form's `expiryDate` field immediately.
  - If the user manually picks a date that matches a chip, that chip should visually activate (optional nice-to-have).
- **Placement**: Directly below the "Expiration Date" label or Date Picker trigger in the Add Item form.

## 4. Implementation Plan

### 4.1 New Component
- **File**: `components/Inventory/AddItems/SmartDateChips.tsx` (New)
- **Props**:
  - `onSelectDate: (date: Date) => void`
  - `currentDate: Date | null`
- **Logic**:
  - Define offsets: `[{ label: '+3 Days', days: 3 }, { label: '+1 Week', days: 7 }, { label: '+1 Month', months: 1 }, { label: '+1 Year', years: 1 }]`.
  - Use `date-fns` for robust date math (`addDays`, `addMonths`).

### 4.2 Integration
- **Target File**: `components/Inventory/AddItemForm.tsx`
- **Action**: 
  - Import `SmartDateChips`.
  - Place it near the Expiry Date input.
  - Wire up `onSelectDate` to the form's state setter/`setValue`.

## 5. Edge Cases & Constraints
- **Leap Years**: Handled by `date-fns`.
- **Timezones**: Set time to noon or end-of-day in UTC to avoid "previous day" glitches when saving to Supabase (which uses Timestamptz).
- **Edit Mode**: Ensure chips work when editing an existing item (relative to *Today*, not the *Old* expiry date).

## 6. Verification Plan
- [x] User can tap "+1 Week" and see the date picker update to exactly 7 days from now.
- [x] User can tap "+1 Month" and see the correct date.
- [x] Submitting the form saves the computed date to Supabase.
- [x] Component is styled using NativeWind class names.
