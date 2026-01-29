---
name: react-components
description: Best practices for implementing high-fidelity React Native components with Expo and NativeWind.
---

# React Component Implementation Specialist

## Goal
To translate architectural specifications (DESIGN.md) into production-grade React Native components using Expo, NativeWind, and the project's existing design system.

## Core Stack
- **Framework**: React Native (Expo)
- **Styling**: NativeWind (Tailwind CSS for Native)
- **Icons**: `lucide-react-native`
- **Navigation**: Expo Router (File-based routing)

## Implementation Rules

### 1. Styling Strategy (NativeWind)
- **Primary**: Use `className="..."` for 95% of styling.
- **Exceptions**: Use `style={{ ... }}` ONLY for:
  - Dynamic values (animations, drag offsets).
  - Platform-specific shadows (`elevation` on Android).
  - React Native specific props not covered by Tailwind (e.g., `hitSlop`).
- **SafeArea**: Always consider `useSafeAreaInsets` for top/bottom padding instead of hardcoded values.

### 2. Component Structure
```tsx
import { View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { LucideIcon } from 'lucide-react-native';

interface ComponentProps {
  title: string;
  isActive?: boolean;
}

export const ComponentName = ({ title, isActive }: ComponentProps) => {
  return (
    <View className={`p-4 rounded-xl ${isActive ? 'bg-blue-500' : 'bg-gray-100'}`}>
      <Text className="text-lg font-bold text-gray-900">{title}</Text>
    </View>
  );
};
```

### 3. "Premium" Polish Checklist
To meet the "Wow" factor requirements:
- **Touch Feedback**: Wrap interactive elements in `Pressable` and add `({ pressed }) => opacity` styles or `Haptics`.
- **Micro-Animations**: Use `react-native-reanimated` for layout transitions (entering/exiting).
- **Glassmorphism**: Use `<BlurView>` (expo-blur) with `intensity={...}` instead of just CSS `backdrop-filter` (which doesn't work on mobile natively).
- **Borders**: Native borders are 1 logical pixel. For "hairlines", use `border-[0.5px]` or `border-black/5`.

### 4. Integration with DESIGN.md
When converting a spec:
- **Topology**: Map "Bento Grid" to `<View className="flex-row flex-wrap gap-4">`.
- **Typography**: Map "Tracking Tight" to `className="tracking-tighter"`.
- **Colors**: Use the project's `tailwinc.config.js` tokens. Don't hardcode hex unless specified as an override.

## Common Pitfalls
- ❌ **Do NOT use `<div>`, `<span>`, `<img>`**: This is React Native. Use `<View>`, `<Text>`, `<Image>`.
- ❌ **Do NOT use CSS Shadows**: Native shadows work differently.
  - iOS: `shadow-sm`, `shadow-md` (works via NativeWind).
  - Android: Needs `elevation-X`.
- ❌ **Do NOT Forget Accessibility**: Add `accessibilityLabel` and `accessibilityRole`.
