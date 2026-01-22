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
- **Recipe Intelligence**: Discovery and gap analysis based on current pantry stock.
- **Recipe Import (Web Scraper)**: Paste any recipe URL to automatically extract ingredients, steps, and photos. Includes author attribution and safety checks.
- **Allergen Safety Guardrails**: Automatic "Unsafe" warnings if recipe ingredients match user profile allergens.
- **Smart Recipe Actions**: "Cook This Now" (auto-deducts inventory) and "Add Missing" (auto-add to shopping list) workflows.
- **Deep Pantry Intelligence**: Rich nutritional data, macro tracking (protein, carbs, fats), and allergen labels for scanned products via OpenFoodFacts.
- **Optimistic Updates**: Instant UI response for quantity changes and item deletions.
- **Full CRUD**: Manage pantry, recipes, meal plans, and shopping items with safety confirmations.
- **Smart Consumption Control**: Slider-based fractional usage tracking (e.g., "50% left") with auto-learning capacity for bulk items (learning that "12 oz" was the full box).
- **Unit Normalization**: Automatic conversion of Metric scans to US Customary units (e.g. 3.78L -> 1 Gallon) for consistent inventory management.
- **Inventory Audits**: Gentle, non-intrusive prompts to verify stock for stale items (untouched > 7 days).
- **Premium UI**: Modern design with skeleton loaders, haptic feedback, and robust inline styling.

## 🛠 Tech Stack

- **Framework**: [Expo](https://expo.dev/) (React Native v54)
- **Language**: TypeScript
- **Backend**: [Supabase](https://supabase.com/) (PostgreSQL & Auth)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest)
- **Product Data**: [OpenFoodFacts API](https://world.openfoodfacts.org/)
- **Styling**: [NativeWind](https://www.nativewind.dev/) & React Native Styles
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
