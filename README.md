# Kitchen Assistant (Culinary OS)

A premium, inventory-first kitchen management application built with Expo and Supabase. Track your pantry, visualize stock gaps, and optimize your cooking workflow.

## 🚀 Features

### Completed
- **Pantry Core**: Real-time inventory tracking with Supabase.
- **Inventory Organization**: Collapsible sections for Fridge, Freezer, and Pantry with custom storage location tagging.
- **Smart Scanner**: Barcode identification via `expo-camera` and OpenFoodFacts integration.
- **Categorized Shopping**: Automatically groups shopping list items by aisle (Produce, Dairy, Protein, etc.) for efficient trips.
- **Smart "Quick Add"**: Search-as-you-type lookup for rich product data (images, brands, macros) directly from the shopping list.
- **Unified Product Details**: Premium modal view for both pantry and shopping items, showing nutritional facts, allergens, and dietary labels.
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
- **Redesigned "Add Item" Experience**: Immersive entry flow using the "Stitch" visual language. Includes a gesture-based fractional quantity slider, smart date chips, and strictly typed validation for multi-target saving (Pantry/Shopping).
- **Modular Component Architecture**: Decoupled UI logic into reusable, stable components (Smart Input, Expiry Selector, Quantity Slider) built with `Pressable` for maximum reliability.
- **Premium UI**: Modern design with skeleton loaders, haptic feedback, and NativeWind v4 styling.

## 🛠 Tech Stack

- **Framework**: [Expo](https://expo.dev/) (React Native v54)
- **Language**: TypeScript
- **Backend**: [Supabase](https://supabase.com/) (PostgreSQL & Auth)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest)
- **Product Data**: [OpenFoodFacts API](https://world.openfoodfacts.org/)
- **Styling**: [NativeWind](https://www.nativewind.dev/) & `expo-linear-gradient`
- **Icons**: [Lucide React Native](https://lucide.dev/)
- **Animations**: [React Native Reanimated](https://docs.expo.dev/versions/latest/sdk/reanimated/)

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
   *Tip: Use `npx expo start -c` if you need to clear the packager cache after modifying environment variables or global styles.*

5. **Run on device/emulator**:
   - Scan the QR code with the Expo Go app.
   - Press `a` for Android Emulator.
   - Press `i` for iOS Simulator.
   - Press `w` for Web.

## 📱 Mobile Preview
For the best experience, use a physical device via **Expo Go** to access the Smart Scanner (camera) and Haptic Feedback features.

## 📁 Project Structure

- `app/`: Expo Router file-based pages.
- `components/`: Reusable UI components.
- `hooks/`: Custom React hooks for business logic.
- `services/`: Supabase and external API clients.
- `types/`: Global TypeScript types and schemas.
- `specs/`: Project requirements and completed features.

## 📜 License

MIT
