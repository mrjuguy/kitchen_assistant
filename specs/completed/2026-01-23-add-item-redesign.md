# PRD: Redesign Add Item Experience

## Context
The "Add Item" screen is the primary entry point for inventory management. The current implementation (`AddItemForm.tsx`) is functional but lacks visual polish and intuitive interaction patterns. We want to update it to match a new "Premium/Stitch" design that features a cleaner aesthetic, smart chips for expiry, and a playful "Shake & Guess" slider for quantity estimation.

## Goals
1.  **Visual Overhaul**: Implement the provided "Stitch" design (Tailwind-based) within the existing React Native/Expo environment using `NativeWind`.
2.  **Immersive Interactions**: Add the gesture-based quantity slider and smart expiry chips.
3.  **Feature Parity**: Ensure critical fields (Storage Location, Category, Target) remain available, even if synthesized into the new design.
4.  **Code Quality**: Refactor `AddItemForm` to be smaller and more modular.

## Design Specification
Reference: 

<!DOCTYPE html>
<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Quick Add &amp; Expiry - Kitchen Assistant</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#0d7ff2",
                        "background-light": "#f5f7f8",
                        "background-dark": "#101922",
                    },
                    fontFamily: {
                        "display": ["Inter", "sans-serif"]
                    },
                    borderRadius: {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "2xl": "1rem",
                        "3xl": "1.5rem",
                        "full": "9999px"
                    },
                    boxShadow: {
                        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                        'glow': '0 4px 20px -2px rgba(13, 127, 242, 0.3)',
                    }
                },
            },
        }
    </script>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<style>input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 32px;
            width: 32px;
            border-radius: 50%;
            background: #ffffff;
            border: 3px solid #0d7ff2;
            cursor: pointer;
            margin-top: -12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        input[type=range]::-webkit-slider-runnable-track {
            width: 100%;
            height: 8px;
            cursor: pointer;
            background: #e2e8f0;
            border-radius: 9999px;
        }
        .dark input[type=range]::-webkit-slider-runnable-track {
            background: #334155;
        }
        .dark input[type=range]::-webkit-slider-thumb {
            background: #1e293b;
        }.scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased h-screen overflow-hidden flex justify-center">
<div class="relative w-full max-w-md h-full flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto overflow-x-hidden scroll-smooth shadow-2xl">
<header class="flex items-center justify-between px-4 py-4 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md sticky top-0 z-20 transition-colors">
<button class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-800 dark:text-slate-200 group">
<span class="material-symbols-outlined group-hover:scale-110 transition-transform">close</span>
</button>
<h1 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Add Item</h1>
<div class="w-10"></div> 
</header>
<main class="flex-1 px-5 pb-32">
<section class="mt-4 mb-8">
<label class="block text-3xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight leading-tight">
                    What did you <br/> <span class="text-primary">buy today?</span>
</label>
<div class="relative group">
<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
<span class="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">search</span>
</div>
<input autofocus="" class="block w-full pl-12 pr-14 py-4 text-xl font-semibold bg-white dark:bg-slate-800 border-0 rounded-2xl ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-800 transition-all" placeholder="e.g. Avocado, Milk" type="text" value=""/>
<div class="absolute inset-y-0 right-0 pr-3 flex items-center">
<button class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
<span class="material-symbols-outlined text-[24px]">barcode_scanner</span>
</button>
</div>
</div>
</section>
<section class="mb-10">
<h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Storage &amp; Category</h2>
<div class="flex gap-3 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide snap-x">
<button class="snap-start flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-white shadow-glow ring-2 ring-primary transition-all group">
<span class="material-symbols-outlined filled">kitchen</span>
<span class="font-bold">Fridge</span>
</button>
<button class="snap-start flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 hover:ring-primary hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all group">
<span class="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">ac_unit</span>
<span class="font-semibold group-hover:text-slate-900 dark:group-hover:text-white">Freezer</span>
</button>
<button class="snap-start flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 hover:ring-primary hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all group">
<span class="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">shelves</span>
<span class="font-semibold group-hover:text-slate-900 dark:group-hover:text-white">Pantry</span>
</button>
</div>
<div class="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide snap-x">
<button class="snap-start flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 hover:ring-primary hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all group">
<span class="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-primary transition-colors">nutrition</span>
<span class="font-semibold text-sm group-hover:text-slate-900 dark:group-hover:text-white">Produce</span>
</button>
<button class="snap-start flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md ring-1 ring-slate-900 dark:ring-white transition-all">
<span class="material-symbols-outlined text-[20px] filled">water_drop</span>
<span class="font-bold text-sm">Dairy</span>
</button>
<button class="snap-start flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 hover:ring-primary hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all group">
<span class="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-primary transition-colors">lunch_dining</span>
<span class="font-semibold text-sm group-hover:text-slate-900 dark:group-hover:text-white">Meat</span>
</button>
<button class="snap-start flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 hover:ring-primary hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all group">
<span class="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-primary transition-colors">grain</span>
<span class="font-semibold text-sm group-hover:text-slate-900 dark:group-hover:text-white">Grains</span>
</button>
</div>
</section>
<section class="mb-10">
<div class="flex items-center justify-between mb-4">
<h2 class="text-lg font-bold text-slate-900 dark:text-white">Best Before</h2>
<button class="text-sm font-semibold text-primary hover:text-blue-400 transition-colors">View Calendar</button>
</div>
<div class="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
<button class="col-span-1 flex flex-col sm:flex-row items-start sm:items-center justify-center gap-2 p-3 sm:px-5 sm:py-3 rounded-xl bg-primary text-white shadow-glow ring-2 ring-primary relative overflow-hidden group">
<div class="absolute top-0 right-0 p-1 opacity-20">
<span class="material-symbols-outlined text-4xl">verified</span>
</div>
<span class="material-symbols-outlined filled text-[24px]">event_upcoming</span>
<div class="flex flex-col items-start text-left">
<span class="text-xs font-medium opacity-90 uppercase tracking-wider">Smart Pick</span>
<span class="text-base font-bold">+1 Week</span>
</div>
</button>
<button class="col-span-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 hover:ring-primary hover:bg-slate-50 dark:hover:bg-slate-700 transition-all group">
<span class="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">calendar_clock</span>
<span class="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">+3 Days</span>
</button>
<button class="col-span-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 hover:ring-primary hover:bg-slate-50 dark:hover:bg-slate-700 transition-all group">
<span class="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">calendar_month</span>
<span class="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">+2 Weeks</span>
</button>
<button class="col-span-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 hover:ring-primary hover:bg-slate-50 dark:hover:bg-slate-700 transition-all group">
<span class="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">edit_calendar</span>
<span class="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">Custom</span>
</button>
</div>
</section>
<section class="mb-6">
<div class="flex items-center justify-between mb-5">
<h2 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        Quantity
                        <span class="material-symbols-outlined text-slate-400 text-sm">info</span>
</h2>
<div class="flex p-1 bg-slate-200 dark:bg-slate-700 rounded-lg">
<button class="px-3 py-1 bg-white dark:bg-slate-600 rounded text-xs font-bold text-slate-900 dark:text-white shadow-sm transition-all">%</button>
<button class="px-3 py-1 rounded text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all">Count</button>
<button class="px-3 py-1 rounded text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all">Vol</button>
</div>
</div>
<div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
<div class="flex justify-center mb-6">
<span class="text-4xl font-extrabold text-primary tracking-tight">100<span class="text-2xl align-top">%</span></span>
</div>
<div class="relative w-full h-8 flex items-center mb-2">
<div class="absolute w-full h-3 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
<div class="h-full bg-primary w-full rounded-full opacity-20"></div>
<div class="h-full bg-gradient-to-r from-blue-400 to-primary w-full rounded-full"></div>
</div>
<div class="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white dark:bg-slate-700 border-4 border-primary rounded-full shadow-lg cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-10"></div>
</div>
<div class="flex justify-between px-1 text-xs font-semibold text-slate-400 uppercase tracking-wide mt-2">
<span>Empty</span>
<span>Half</span>
<span>Full</span>
</div>
</div>
<p class="text-center text-slate-400 text-xs mt-4">Slide to estimate remaining amount</p>
</section>
</main>
<footer class="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark pt-12">
<button class="w-full bg-primary hover:bg-blue-600 text-white text-lg font-bold py-4 rounded-2xl shadow-glow flex items-center justify-center gap-3 transition-all active:scale-[0.98]">
<span class="material-symbols-outlined">inventory_2</span>
                Add to Pantry
            </button>
<p class="text-center text-xs text-slate-400 mt-3 font-medium">Helping you reduce waste, one item at a time.</p>
</footer>
</div>

</body></html>

### Layout Structure
- **Header**: "Add Item" title + Close button.
- **Main Scroll**:
    1.  **Smart Input**: Large text input ("What did you buy today?") + Barcode/Search icon.
    2.  **Storage & Category**:
        -   **Storage**: Horizontal scroll with snapping (`snap-x`). Large pills with icons (Fridge, Freezer, Pantry).
            -   *Selected*: `bg-primary text-white`.
            -   *Unselected*: `bg-white dark:bg-slate-800`.
        -   **Category**: Horizontal scroll below storage. Smaller pills.
            -   *Mapping*: Map Material Symbols to Lucide (e.g., Fridge -> Refrigerator, Freezer -> Snowflake).
    3.  **Expiry Section**: "Best Before" with smart chips (+1 Week, +3 Days, +2 Weeks, Custom).
    4.  **Quantity Section**:
        - Toggle for `Wait/Count/Vol` (or similar).
        - **Slider**: For percentage/fill level estimation.
        - **Numeric Input**: Fallback for precise count/volume.
- **Footer**: "Add to Pantry/Shopping" prominent button.

## Technical Plan

### 1. Component Modularization
Split `components/Inventory/AddItemForm.tsx` into:
-   `components/Inventory/AddItems/AddItemHeader.tsx`
-   `components/Inventory/AddItems/SmartItemInput.tsx` (Name + Barcode trigger)
-   `components/Inventory/AddItems/ExpirySelector.tsx` (The smart chips)
-   `components/Inventory/AddItems/QuantitySlider.tsx` (The interactive slider)
-   `components/Inventory/AddItems/StorageCategorySelector.tsx` (To preserve existing functionality)

### 2. State Management
-   Retain existing `useAddPantryItem` / `useAddShoppingItem` mutations.
-   Map the specialized UI state (Slider %) to the standardized `quantity` + `unit` schema.

### 3. Implementation Steps
1.  **Setup**: Create the sub-component structure.
2.  **Refactor `AddItemForm.tsx`**: Replace the monolithic render with the new layout shell.
3.  **Implement `SmartItemInput`**: Style the large input field.
4.  **Implement `ExpirySelector`**: Port the logic from `SmartDateInput` but use the new "Card/Chip" visuals.
5.  **Implement `QuantitySlider`**: Build the customized slider using `react-native-gesture-handler` or basic PanResponder (or simplified View-based slider if easier) + logic to toggle between modes.
6.  **Implement `StorageCategorySelector`**: Style the existing location/category options to match the "Premium" look (likely pills/chips).
7.  **Integration**: Wire up the "Add" button and ensure form submission works.

## Refactoring Notes
-   Delete `components/Inventory/SmartDateInput.tsx` after functionality is fully migrated to `ExpirySelector`.
-   Use `twrnc` or `className` (NativeWind) for all styling.
