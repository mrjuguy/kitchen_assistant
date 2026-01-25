# Visual Regression Test Plan: Issue #10 (Tailwind Refactor)

**Date**: 2026-01-25
**Scope**: Verification of UI modernized screens and components.

---

## 1. Authentication & Onboarding
### Login Screen (`/login`)
- [ ] Verify background color is `#f5f7f8` (off-white).
- [ ] Verify "Kitchen Assistant" header has correct font size (30) and bold weight.
- [ ] Verify Input fields have rounding (16), padding (16), and border on focus.
- [ ] Verify Primary Button has emerald background and white text.

---

## 2. Core Navigation (Tabs)
### Inventory (`/index`)
- [ ] Verify "Wasting Soon" horizontal scroll cards have consistent shadows.
- [ ] Verify Section headers (Fridge, Freezer, etc.) have background colors and correct icons.
- [ ] Verify Pantry Cards display category badges (e.g., Produce in green) and Expiry badges.
- [ ] Verify Quantity controls and Consumption slider are visible and aligned.

### Recipes (`/recipes`)
- [ ] Verify Mode Select: When choosing a meal for the planner, blue header banner should appear.
- [ ] Verify Filter Tabs: "All", "Ready", "Missing" have correct active/inactive states.
- [ ] Verify Recipe Cards: Status badges (Ready to Cook/Missing) have correct colors.
- [ ] Verify Tag scroll: Tag chips have blue highlight when selected.

### Planner (`/planner`)
- [ ] Verify Week Strip: Selected date has dark background, current date has emerald border.
- [ ] Verify Meal Cards: Dashed borders for empty slots, solid for scheduled meals.
- [ ] Verify "Shop for Week" sticky button at bottom of scroll view.

---

## 3. Profile & Settings
### Profile Screen (`/profile`)
- [ ] Verify Dietary restrictions list uses proper spacing and dark gray text.
- [ ] Verify Checkbox icons (Lucide) are aligned with text.
- [ ] Verify logout button triggers the auth flow change.

---

## 4. Components
### General
- [ ] Verify Skeletons: Pulse animation should be smooth and gray.
- [ ] Verify Haptics: Light impact when toggling shopping items or adjusting quantities.
