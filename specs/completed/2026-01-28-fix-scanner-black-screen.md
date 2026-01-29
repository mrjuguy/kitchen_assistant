# Bug Fix: Scanner Black Screen

## Context
The barcode scanner in `AddItemForm` displays a black screen when opened. This prevents users from scanning items.

## Root Cause Analysis
1. **Missing `facing` prop**: The `CameraView` component from `expo-camera` requires the `facing` prop to explicitly state which camera to use (usually 'back').
2. **Styling Issues**: While `flex-1` is applied via NativeWind, obscure layout bugs in some Expo versions can cause the camera preview to have 0 height if not strictly enforced.

## Proposed Resolution
1. [x] **Explicit Camera Facing**: Add `facing="back"` to the `CameraView` component.
2. [x] **Explicit Styling**: Add `style={{ flex: 1 }}` (or ensure standard `StyleSheet` usage if NativeWind is proving flaky for this native component, though `className` usually works).
3. [x] **Error Handling**: Add `onMountError` listener to debug potential permission or hardware access errors.

## Verification Plan
- [ ] **Manual**: User to run `npx expo start -c --tunnel` and test on physical device.
- [x] **Automated**: `gatekeeper` check (TypeScript/Lint).

## References
- Expo Camera Docs: `facing` is required/recommended.
