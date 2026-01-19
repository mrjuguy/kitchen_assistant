# Tech Stack: Kitchen Assistant (Culinary OS)

## Core Technologies
- **Framework**: [Expo](https://expo.dev/) (React Native)
  - *Rationale*: Native performance for Mobile (iOS/Android) and Web support from a single codebase. Built-in camera and barcode utilities.
- **Language**: TypeScript
  - *Rationale*: Critical for maintaining the complex "Inventory-First" data structures and safety-first allergen matching.
- **Backend/Database**: [Supabase](https://supabase.com/) (PostgreSQL)
  - *Rationale*: Scalable relational database for complex gap analysis queries, built-in Auth, and real-time data syncing.
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/)
  - *Rationale*: File-based routing that works seamlessly across native and web.

## UI & UX
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
  - *Rationale*: Rapid, consistent styling for a "premium" look across platforms.
- **Icons**: [Lucide React Native](https://lucide.dev/)
  - *Rationale*: Modern, lightweight iconography.
- **Components**: Primitive bits/Base components for maximum flexibility.

## Data Management
- **State Management**: [TanStack Query](https://tanstack.com/query/latest) (React Query)
  - *Rationale*: Efficient server state management, caching, and real-time updates.
- **API Layer**: Supabase-js client.

## Development Tools
- **Package Manager**: npm
- **Testing**: Jest & React Native Testing Library
- **Tooling**: Prettier, ESLint (standard Expo config)
