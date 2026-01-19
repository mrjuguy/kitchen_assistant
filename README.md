# Kitchen Assistant (Culinary OS)

A premium, inventory-first kitchen management application built with Expo and Supabase. Track your pantry, visualize stock gaps, and optimize your cooking workflow.

## 🚀 Features

### Completed
- **Pantry Core**: Real-time inventory tracking with Supabase.
- **Premium UI**: Modern design with skeleton loaders, haptic feedback, and smooth transitions.
- **Optimistic Updates**: Instant UI response for quantity changes and item additions.
- **Smart Filtering**: Real-time search and category filtering for ingredients.
- **Full CRUD**: Add, update, and delete pantry items with safety confirmations.

## 🛠 Tech Stack

- **Framework**: [Expo](https://expo.dev/) (React Native)
- **Language**: TypeScript
- **Backend**: [Supabase](https://supabase.com/) (PostgreSQL & Auth)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS)
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

5. **Run on device/emulator**:
   - Scan the QR code with the Expo Go app.
   - Press `a` for Android Emulator.
   - Press `i` for iOS Simulator.
   - Press `w` for Web.

## 📁 Project Structure

- `app/`: Expo Router file-based pages.
- `components/`: Reusable UI components.
- `hooks/`: Custom React hooks for business logic.
- `services/`: Supabase and external API clients.
- `types/`: Global TypeScript types and schemas.
- `specs/`: Project requirements and completed features.

## 📜 License

MIT
