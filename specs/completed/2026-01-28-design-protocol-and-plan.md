# PRD: Implement Design System v2 (Mint & Gunmetal)

## 1. Overview
Align the entire application with the new Brand Identity derived from the App Icon. Transition from the current "Soft-Clean" (White/Gray) aesthetic to a high-contrast **"Professional Chef"** aesthetic (Gunmetal Dark Mode + Mint Accents).

## 2. User Stories
*   **As a User**, I want the app to feel "Premium" and professional, matching the quality of the app icon.
*   **As a User**, I want consistent visual cues (Mint = Success/Brand, Red = Waste/Delete) across all screens.
*   **As a Developer**, I want a centralized set of design tokens (Colors, Typography) so I can build new features rapidly without guessing styles.

## 3. UX Guidelines (Reference: `specs/DESIGN.md`)
*   **Primary Palette**:
    *   `primary`: Emerald-500 (`#10b981`)
    *   `surface`: Zinc-900 (`#18181b`) [Dark Mode Focus] or White [Light Mode]
*   **Typography**:
    *   Headings: Bold, Tracking-Tight.
    *   Labels: Uppercase, Tracking-Wider, Text-[10px].
*   **Components**:
    *   Cards require `rounded-2xl` and specific shadow tokens.
    *   Interactive elements use `Pressable` with opacity feedback.

## 4. Implementation Plan

### Phase 1: Foundation (The Tokens)
- [ ] 1.  **Tailwind Config**: Update `tailwind.config.js` to extend colors with `brand-primary`, `brand-surface`, etc.
- [ ] 2.  **Theme Constants**: Update `constants/Colors.ts` to reflect the new Mint/Gunmetal palette.
- [ ] 3.  **Global Styles**: Ensure `app/_layout.tsx` applies the correct background color to the root.

### Phase 2: Component Refactor
- [ ] 1.  **PantryCard (`components/Inventory/PantryCard.tsx`)**:
    - [ ] Update background to use themed surface.
    - [ ] Update badges to use the new "Pill" style (`bg-brand-primary/10 text-brand-primary`).
    - [ ] Ensure shadows work on both Dark/Light modes.
- [ ] 2.  **Navigation**:
    - [ ] Update Tab Bar active colors to Mint-500.
    - [ ] Update Headers to use the Gunmetal background (if dark mode preferred).

### Phase 3: Flagship Implementation (Recipes)
- [ ] **Goal**: Use the new tokens to build the "Recipes" list.

## 5. Verification Plan
- [ ] **Visual Check**:
    - [ ] App Icon matches the App Header/Splash.
    - [ ] Primary Buttons are Mint Green.
    - [ ] Text is legible on both Dark and Light backgrounds.
- [ ] **Code Check**:
    - [ ] No hardcoded hex values in components (must use `bg-brand-primary` etc.).
