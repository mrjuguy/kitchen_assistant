# Design System: Kitchen Assistant (Culinary OS)

## 1. Visual Theme & Atmosphere
The design atmosphere is **"Premium Utilitarian."** It combines a clean, airy mobile aesthetic with high-density informational zones. It feels "Alive" through the use of status-driven micro-animations (like pulses) and a logical hierarchy that prioritizes urgency.

*   **Mood:** Focused, reliable, and modern.
*   **Density:** Balanced—generous white space in headers, dense card-based navigation in inventory.

## 2. Color Palette & Roles
The system uses a sophisticated palette with clearly defined functional roles.

### Core Brand
*   **Primary Action (#0d7ff2):** A vibrant, digital blue used for interactive elements, CTA buttons, and active navigation states.
*   **Surface Light (#ffffff):** Pure white for cards and primary background containers in light mode.
*   **Surface Dark (#1a2632):** A deep charcoal-navy for dark mode cards.
*   **Background Light (#f5f7f8):** A soft, cool grey-white for global backgrounds.
*   **Background Dark (#101922):** Near-black navy for dark mode global background.

### Semantic Status (Traffic Light System)
*   **Critical/Urgent (#ef4444):** High-intensity red for items expiring today or within 1 day.
*   **Warning/Caution (#f59e0b):** Warm amber for items expiring within 2-3 days.
*   **Healthy/Fresh (#22c55e):** Vibrant green for fresh inventory and positive trends.
*   **Info/Muted (#64748b):** Slate grey for secondary text and disabled states.

## 3. Typography Rules
Uses the **Inter** font family (San Serif) for maximum legibility on mobile screens.

*   **Header Large:** Bold, tight letter-spacing, tracking-tight.
*   **Body:** Medium weight, slate tones for better contrast against light surfaces.
*   **Micro-Labels:** Uppercase or small-text (10px - 12px) for metadata like "Expires in 10d".

## 4. Component Stylings
*   **Buttons:** Highly rounded (full/pill-shaped) for navigation; subtle shadow-premium on floating elements.
*   **Cards (Urgent):** 2xl rounded corners (16px/1rem). Incorporates specific "Status Badge" icons (Priority High, Warning).
*   **Accordions:** Rounded-2xl containers with internal dividers; use subtle grey backgrounds (`bg-gray-50/50`) to separate headers from content.
*   **Shadows (Premium):** Lightweight, multi-layered shadows (`0 4px 6px -1px rgba(0, 0, 0, 0.05)`) to create depth without bulk.

## 5. Layout Principles
*   **Horizontal Spacing:** Standard 16px (px-4) gutters for mobile safe zones.
*   **Vertical Rhythm:** 24px (gap-6) between major thematic sections.
*   **Horizontal Scroll:** Used for "Wasting Soon" to keep high-urgency items at the thumb-level without pushing core inventory off-screen.
