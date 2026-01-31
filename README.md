# Kitchen Assistant (Culinary OS)

A premium, inventory-first kitchen management application built with Expo and Supabase. Track your pantry, visualize stock gaps, and optimize your cooking workflow.

## 🚀 Features

### Completed
- **Frequently Expired Insights (Feature #11)**: Smart analytics engine that tracks "Waste Patterns" by aggregating item expiry history. Features a "Waste Watch" carousel in the Shopping tab that highlights top-10 most discarded items (e.g., "Spinach 3x") to nudge better purchasing decisions. Built on a new `usage_logs` immutable ledger.
- **Pantry Core**: Real-time inventory tracking with Supabase.
- **Inventory Organization**: Collapsible sections for Fridge, Freezer, and Pantry with custom storage location tagging.
- **Smart Scanner**: Barcode identification via `expo-camera` and OpenFoodFacts integration.
- **Categorized Shopping**: Automatically groups shopping list items by aisle (Produce, Dairy, Protein, etc.) for efficient trips.
- **Smart "Quick Add"**: Search-as-you-type lookup for rich product data (images, brands, macros) directly from the shopping list.
- **Unified Product Details**: Premium modal view for both pantry and shopping items, showing nutritional facts, allergens, and dietary labels.
- **Frequently Expired Insights (Feature #11)**: Smart analytics engine that tracks "Waste Patterns" by aggregating item expiry history into an immutable `usage_logs` ledger. Features a "Waste Watch" carousel in the Shopping tab that highlights top-10 most discarded items (e.g., "Spinach 3x") to nudge better purchasing decisions.
- **Advanced List Actions**: Batch actions for "Clear Bought" (remove without stocking) and "Delete All" for list management.
- **Meal Planner (Chef's Weekly)**: Proactive weekly meal scheduling with a dedicated calendar view.
- **Smart "Shop for Week"**: One-click generation of shopping lists based on planned meals minus current pantry inventory.
- **Recipe Intelligence (Phase 3 Premium Reflect)**: Comprehensive "Chef's Interface" for recipe discovery. Includes immersive Hero headers with `expo-linear-gradient`, sticky action bars, and portion scaling.
- **Visual Gap Analysis**: Instant visual feedback on recipe readiness via segmented progress bars (Pantry Match %) and status-coded ingredient cards (In Stock vs. Missing).
- **Advanced Recipe Search & Filtering**: Multi-select tag filtering (OR logic), premium search focus states, and quick-filter tabs for "Ready to Cook" vs "Missing Ingredients".
- **Enhanced Recipe Import**: Smart web scraper for ingredients, steps, and photos with automated tag extraction and manual tag management.
- **Allergen Safety Guardrails**: Automatic "Unsafe" warnings if recipe ingredients match user profile allergens.
- **Smart Recipe Actions**: Adaptive "Cook This Now" (auto-deducts inventory) and "Shop Missing" (bridges stock gaps) workflows based on pantry analysis.
- **Deep Pantry Intelligence**: Rich nutritional data, macro tracking (protein, carbs, fats), and allergen labels for scanned products via OpenFoodFacts.
- **Optimistic Updates**: Instant UI response for quantity changes and item deletions.
- **Full CRUD**: Manage pantry, recipes, meal plans, and shopping items with safety confirmations.
- **Smart Consumption Control**: Slider-based fractional usage tracking (e.g., "50% left") with auto-learning capacity for bulk items (learning that "12 oz" was the full box).
- **Unit Normalization**: Automatic conversion of Metric scans to US Customary units (e.g. 3.78L -> 1 Gallon) for consistent inventory management.
- **Inventory Audits**: Gentle, non-intrusive prompts to verify stock for stale items (untouched > 7 days).
- **Household Management**: Multi-user collaboration with invite codes. Shared pantry, recipes, and shopping lists across members with granular security.
- **Pantry Health System**: Centralized "Traffic Light" freshness logic (Green/Yellow/Orange/Red) with visual `ExpiryBadge` indicators. Provides precise "Wasting Soon" warnings (Today, Tomorrow, 2 Days) and strict time-based categorization.
- **Redesigned "Add Item" Experience**: Immersive entry flow using the "Stitch" visual language. Includes a gesture-based fractional quantity slider, multi-select storage tagging, and strictly typed validation for multi-target saving (Pantry/Shopping).
- **Smart Expiry Selection**: Optimized date input with one-tap chips (+1 Week, +1 Month, etc.), satisfying haptic feedback, and a native system calendar for custom dates. Intelligent synchronization ensures UI chips react to manual date selections.
- **Accessibility & UX Foundations**: Comprehensive WCAG-compliant accessibility labels, localized date formatting, and high-contrast Emerald branding for secondary active states.
- **Premium UI Modernization (Issue #10)**: Complete migration from inline styles to NativeWind v4 (Tailwind CSS). All 30+ components across 6 main tabs refactored to utility-first styling, reducing style code by 700+ lines. Standardized design system on premium off-white palette (#f5f7f8) with improved type safety (Skeleton system) and refined error handling (Planner alerts). Foundation established for future dark mode implementation.
- **Account Deletion & Data Privacy (Issue #35)**: Integrated in-app account deletion workflow compliant with Apple App Store Review Guidelines 5.1.1(v). Features a secure "Danger Zone" in the Profile tab with native confirmation alerts and a Supabase Edge Function to wipe user data, including automated cleanup for orphaned households.
- **Privacy Policy & Terms of Service (Issue #38)**: Comprehensive legal compliance with in-app document viewing via `expo-web-browser`. Adds a dedicated "Legal" section to the Profile tab and integrates policy URLs into `app.json` for App Store indexing.
- **Production Assets & Branding (Issue #37)**: Replaced default Expo placeholders with high-fidelity, AI-generated professional branding. Includes a custom minimalist app icon, a full-screen gradient splash screen, and an adaptive Android icon. Standardized the splash screen configuration to `resizeMode: cover` for edge-to-edge branding.
- **App Analytics & User Insights (Issue #36)**: Integrated PostHog for behavior tracking. Captures critical events including recipe cooking, shopping checkouts, item additions, and meal planning. Includes automated user identification and session tracking for product-led growth analysis.
- **Brand Aligned Design System (v2)**: Implemented the "Mint & Gunmetal" visual identity. Features a high-contrast aesthetic with Emerald-500 branding, 10% opacity status pills, and "Professional Chef" precision typography across all major components. Optimized for clarity and visual hierarchy.
- **Stunning Visuals Upgrade (v2.1)**: Complete UI overhaul introducing a "Soft Modern" design language. Features `rounded-3xl` cards, warmth-preserving Zinc-50 backgrounds, and "Elevation" shadow physics (`shadow-emerald-500/10`) for a premium depth effect. Typography updated to 'Outfit' (headers) and 'Inter' (body) with `tracking-tight` styling for a luxurious feel.


## 🛠 Tech Stack

- **Framework**: [Expo](https://expo.dev/) (React Native v54)
- **Language**: TypeScript
- **Backend**: [Supabase](https://supabase.com/) (PostgreSQL & Auth)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest)
- **Product Data**: [OpenFoodFacts API](https://world.openfoodfacts.org/)
- **Styling**: [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS for React Native)
  - **Design Philosophy**: Utility-first styling with premium off-white palette (#f5f7f8 backgrounds, #ffffff surfaces)
  - **Type Safety**: Comprehensive TypeScript support across all styled components
  - **Architecture**: Zero inline styles, 100% utility-class based for consistency and dark mode readiness
- **Visual Enhancements**: `expo-linear-gradient` for hero headers & `expo-haptics` for tactile feedback
- **Native Modules**: `@react-native-community/datetimepicker` for smart expiry selection
- **Icons**: [Lucide React Native](https://lucide.dev/)
- **Animations**: [React Native Reanimated](https://docs.expo.dev/versions/latest/sdk/reanimated/)
- **Product Analytics**: [PostHog](https://posthog.com/)

## 🏁 Getting Started

### Prerequisites
- Node.js (Latest LTS)
- npm or yarn
- Expo Go app on your mobile device (optional, for testing)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mrjuguy/kitchen_assistant.git
   cd kitchen_assistant
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**:
   ```bash
   npx expo start
   ```
   *Tip: Use `npx expo start -c` if you need to clear the packager cache after modifying environment variables, Tailwind configuration, or global styles.*

5. **Run on device/emulator**:
   - Scan the QR code with the Expo Go app.
   - Press `a` for Android Emulator.
   - Press `i` for iOS Simulator.
   - Press `w` for Web.

## 📱 Mobile Preview
For the best experience, use a physical device via **Expo Go** to access the Smart Scanner (camera) and Haptic Feedback features.

## 📁 Project Structure

- `app/`: Expo Router file-based pages (Login, Tabs: Inventory, Recipes, Shopping, Planner, Profile). Includes a dedicated Legal section for App Store compliance.
- `components/`: 30+ reusable UI components, 100% NativeWind-styled with type-safe props (Issue #10).
- `hooks/`: Custom React hooks for business logic and data fetching. Unified via a centralized mutation validation layer.
- `services/`: Supabase client, OpenFoodFacts integration, and external API clients.
- `utils/`: Reusable pure functions for analytics, date formatting, and **centralized mutation logic** (auth/household validation).
- `types/`: Global TypeScript types, database schemas, and component prop interfaces.
- `specs/`: Project requirements, completed features, design system documentation, test plans, and **QA reviews**.
- `specs/reviews/`: Official validation artifacts and shippability assessments.
- `.agent/workflows/`: Professional development lifecycle automation (Plan, Ship, Release).
- `tailwind.config.js`: NativeWind v4 configuration with premium color palette and component content paths.

## 🎨 Design Philosophy

**"Premium Utilitarian"** — A clean, airy aesthetic balanced with high-density informational zones. The app prioritizes:
- **Consistency**: Unified visual language across all screens via NativeWind utilities
- **Accessibility**: WCAG-compliant contrast ratios and semantic color coding
- **Feedback**: Haptic responses and skeleton loaders for all async operations
- **Hierarchy**: Clear visual priority system using the "Traffic Light" freshness model (Green/Yellow/Orange/Red)
- **Hygiene**: Strict enforcement of LF line endings via `.gitattributes` to ensure cross-platform consistency (Windows/macOS/Linux).


## 📜 License

MIT
