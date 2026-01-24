# Test Plan: Redesigned Add Item Experience

This test plan covers the manual verification of the "Stitch" redesigned Add Item form, ensuring visual fidelity, interaction stability, and functional correctness.

## 1. Visual Verification (The "Stitch" Look)
| ID | Test Step | Expected Result | Result |
|:---|:---|:---|:---|
| V1 | Open Add Item modal | Header shows "What did you buy today?" in large bold text with "buy today?" highlighted in blue. | [x] |
| V2 | Check dark mode toggle | All components (Smart Input, Slider Card, Chips) adapt their background/text colors correctly. | [Toggle dark mode not an option in this version] |
| V3 | Component Layout | Storage/Category chips scroll horizontally. Expiry selector is a 2x2 grid. Slider is in a distinct white/dark card. | [x] |

## 2. Interaction & Stability
| ID | Test Step | Expected Result | Result |
|:---|:---|:---|:---|
| I1 | Toggle Pantry/Shopping | Switch between target buttons at the bottom. **Critically: No "Render Error" appears.** | [x] |
| I2 | Select Storage | Tap Fridge, Freezer, and Pantry. Blue background moves to the selected item. | [x] |
| I3 | Select Category | Tap Produce, Dairy, Meat, etc. The pill becomes dark (light mode) or light (dark mode). | [x] |
| I4 | Quantity Slider | Tap different points on the slider or drag the thumb. Percentage updates in real-time. | [x] |
| I5 | Expiry Chips | Tap "+3 Days", "+7 Days", etc. Selection border/color updates. | [x] |

## 3. Functional Flow (End-to-End)
| ID | Test Step | Expected Result | Result |
|:---|:---|:---|:---|
| F1 | Precise Quantity | Set slider to 50%. Submit. Verify item quantity in list is recorded as `0.5`. | [x] |
| F2 | Expiry Logic | Set Expiry to "+7 Days". Submit. Check item detail to confirm date is exactly 7 days from today. | [x] |
| F3 | Search/Input | Type "Milk" into the name field. | Input is reactive and clear. | [x] |
| F4 | Target: Shopping | Toggle "Shopping" target. Submit item. Item appears in Shopping List instead of Pantry. | [x] |

## 4. Edge Cases & Safety
| ID | Test Step | Expected Result | Result |
|:---|:---|:---|:---|
| E1 | Empty Submit | Keep name empty. Submit button should be gray/disabled. | [x] |
| E2 | Rapid Toggling | Rapidly tap between "Fridge" and "Freezer" 10 times. | App handles re-renders without crashing. | [x] |
| E3 | Modal Escape | Tap 'X' in the top left. | Modal closes cleanly. | [x] |

## 5. Regression Check
| ID | Test Step | Expected Result | Result |
|:---|:---|:---|:---|
| R1 | Barcode Scanner | Tap the Barcode icon in the input field. | Camera opens correctly (requires physical device). | [x] |
| R2 | Database Schema | Add an item. Verify no "allergensArray" error occurs (fixed in build). | [x] |

---
**Summary of Stability Fixes Applied:**
- Replaced `TouchableOpacity` with `Pressable`.
- Removed `transition-*` and `active:*` pseudo-classes.
- Removed dynamic `shadow-*` utility classes.
- Removed `useColorScheme` call inside the selector loops.
