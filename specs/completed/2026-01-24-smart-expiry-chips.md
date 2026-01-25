# Active PRD: Kitchen Assistant - Smart Expiry Chips Refinement
**Focus**: Polishing the expiration date selection logic and UI within the "Add Item" flow.
**Current Status**: ✅ **Completed** (Ref: 2026-01-24-smart-expiry-refinement-final.md)

## 1. Feature Status Summary

| Feature | Priority | Status |
| :--- | :--- | :--- |
| **Smart Date Chips** | High | ✅ **Completed** |
| **Native Date Picker Integration** | High | ✅ **Completed** |
| **Haptic Feedback** | Medium | ✅ **Completed** |
| **Chip/Picker Synchronization** | Medium | ✅ **Completed** |
| **Accessibility Audit** | Medium | ✅ **Completed** |

---

## 2. Feature Details

### Smart Expiry Selection
**Goal**: Make expiration date entry as fast as possible for common durations while retaining full calendar control for specific dates.

### Key Enhancements
1.  **Smart Chips**: One-tap selection for `+3 Days`, `+1 Week`, `+1 Month`, and `+1 Year`.
2.  **Native Integration**: Replaced the manual/placeholder date input with `@react-native-community/datetimepicker` for a native, stable experience.
3.  **Haptic Feedback**: Integrated `expo-haptics` to provide tactile confirmation for chip selections and date changes.
4.  **Intelligent Sync**: 
    - Internal state now reacts to external date changes.
    - Utility function `getLabelForDate` checks if a manual date matches a smart offset and highlights the corresponding chip automatically.
5.  **Branding**: Updated active states to Emerald green to align with the app's secondary branding.
6.  **Accessibility**: Added comprehensive WCAG-compliant props (`accessibilityLabel`, `accessibilityRole`, `accessibilityState`) to all interactive elements.

### Technical Implementation
- **Dependencies**: Added `@react-native-community/datetimepicker`.
- **Utilities**: Enhanced `utils/date.ts` with `getLabelForDate` mapping logic.
- **Testing**: 
    - Created dedicated unit tests in `__tests__/components/Inventory/AddItems/ExpirySelector.test.tsx`.
    - Updated integration tests in `AddItemForm.test.tsx`.
    - Verified cross-platform behavior (Android vs iOS picker closure logic).

---
