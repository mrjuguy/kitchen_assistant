# Design System: Kitchen Assistant v2 (Stunning Upgrade)
**Project ID:** ka-mobile-v2

## 1. Architecture & Layout
* **Topology:** Vertically Stacked Sections with Horizontal Sub-scrolls.
* **Whitespace Strategy:** Comfortable (20px standard gap, 24px screen padding).
* **Container Logic:**
    *   **Cards:** `rounded-3xl` for friendly, approachable feel.
    *   **Lists:** `rounded-2xl` list items within sections.
    *   **Bottom Nav:** Floating or Translucent Dock logic.

## 2. Visual Styling
* **Aesthetic Class:** Soft Modern (Clean + Depth).
* **Border Logic:**
    *   **Cards:** 1px solid `zinc-100` (Light Mode) / `white/10` (Dark Mode).
    *   **Focus:** thick ring `ring-2 ring-emerald-100` on active inputs/states.
* **Shadow Technique:**
    *   **Surface:** "Elevation-1" (`shadow-sm` + `shadow-slate-200/50`) for standard cards.
    *   **Floating:** "Elevation-3" (`shadow-xl` + `shadow-emerald-500/10`) for FABs and active states.
* **Background Strategy:**
    *   **App Background:** `zinc-50` (instead of flat white/gray) for warmth.
    *   **Card Background:** `white` (100% opacity) with subtle texture support if needed.

## 3. Typography System
* **Primary Font:** "Outfit" or "Plus Jakarta Sans" (Geometric Sans) for Headers.
* **Secondary Font:** "Inter" (Humanist Sans) for Body/Data.
* **Tracking:**
    *   **Headers:** `tracking-tight` (-0.02em) to `tracking-tighter` (-0.03em) for large counters.
    *   **Body:** `tracking-normal`.
* **Hierarchy:**
    *   **H1 (Display):** Bold, heavy contrast (e.g., Kitchen Health Score).
    *   **Labels:** Uppercase, `text-xs`, `tracking-widest`, `font-semibold`.

## 4. Color Palette
* **Primary (Brand):** `Emerald-500` (Main Action, Primary Buttons).
* **Secondary (accent):** `Violet-500` (For specific special states, e.g., "Magic" features).
* **Semantic:**
    *   **Warning (Expiring):** `Orange-500` (Softer than red).
    *   **Critical (Expired):** `Rose-500`.
    *   **Good/Fresh:** `Teal-500`.
* **Surface Colors:**
    *   **Canvas:** `Zinc-50`.
    *   **Card:** `White`.
    *   **Subtle Text:** `Zinc-400`.

## 5. Motion Physics
* **Interaction Feel:** "Bouncy" (Spring stiffness: 150, Damping: 15).
* **Transitions:**
    *   **Page:** Shared Element Transitions for Card -> Details.
    *   **List Expansion:** Layout Animation (Accordion expand/collapse).
* **Feedback:** Tactile scale-down (0.96) on press logic for all tappable cards.
