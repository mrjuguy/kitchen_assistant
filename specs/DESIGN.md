# Design System: Kitchen Assistant (Brand Aligned)

## 1. Brand Identity (Source: App Icon)
* **Core Metaphor:** "Professional Chef's Precision"
* **Primary Color (Brand):** Mint-500 (`#10b981` / Emerald-500 matches well)
* **Surface Color (Brand):** Gunmetal (`#18181b` / Zinc-900)
* **Contrast Strategy:** High Contrast (Mint on Dark)

## 2. Architecture & Layout
* **Topology:** Card-Based Feed (Vertical List)
* **Whitespace Strategy:** Comfortable (16px padding `p-4`, 12px gaps `gap-3`)
* **Container Logic:**
  * **Primary Cards:** Rounded-2xl (`rounded-2xl`).
  * **Image Containers:** Rounded-xl (`rounded-xl`), Fixed 64px (`w-16 h-16`).

## 3. Visual Styling
* **Aesthetic Class:** Modern Mixed (Dark Brand Header + Light Content or Full Dark Mode)
* **Border Logic:** 1px solid `gray-200` (Light Mode) or `white/10` (Dark Mode)
* **Shadow Technique:**
  * **iOS:** `shadow-sm` (Subtle lift)
  * **Android:** `elevation-2`
* **Corner Radius:** Soft-Curve (`rounded-2xl` outer)
* **Status Indicators:**
  * **Pills:** Colored Background (10% opacity) + Colored Text (High Saturation).
  * **Example:** Produce = `bg-emerald-500/10` + `text-emerald-600`.

## 4. Typography System
* **Primary Font:** System Sans (React Native Default) - Clean, legible.
* **Hierarchy:**
  * **Card Title:** Text-lg (`18px`), Font-Bold (`700`), Gray-900 (Light) / White (Dark).
  * **Micro Labels:** Text-[10px], Font-Bold, Uppercase, Tracking-Wider.
  * **Body Text:** Text-base (`16px`), Gray-700 (Light) / Gray-400 (Dark).

## 5. Color Palette
* **Brand Primary:** Emerald-500 (`#10b981`) -> Matches the "Checkmark" Green.
* **Brand Surface:** Zinc-900 (`#18181b`) -> Matches the "Icon Background".
* **Functional:**
  * **Destructive:** Red-500
  * **Warning:** Amber-500
  * **Info:** Blue-500

## 6. Motion & Interaction
* **Feedback:** Haptic Impact (Medium) on destructive/critical actions.
* **Touch States:** `Pressable` opacity changes (Standard iOS feel).
