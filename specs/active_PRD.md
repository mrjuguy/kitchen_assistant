# PRD: Meal Planner (The "Chef's Weekly")

## 1. Vision & Purpose
Empower the user to proactively manage their kitchen by assigning recipes to specific days. This transforms the app from a "reactive" tool (what can I cook now?) to a "proactive" system (what am I eating this week?), directly feeding the Shopping List.

## 2. Core Features

### A. Weekly Calendar View
- **Objective**: Visualize the week's meals at a glance.
- **UI**: A horizontal week strip (Mon-Sun) or simple list view.
- **Slots**: Breakfast, Lunch, Dinner for each day.

### B. "Add to Plan" Flow
- **Entry Points**:
    1.  **From Recipe Detail**: "Schedule this Meal" button.
    2.  **From Planner**: Tap an empty slot -> Open Recipe Selector.
- **Logic**: Saves the `recipe_id` to a specific `date` and `meal_type`.

### C. Smart Shopping Integration
- **The "Shop for Week" Button**:
    - Scans the entire week's meal plan.
    - Aggregates ingredients from ALL planned recipes.
    - Subtracts current Pantry inventory (using the existing Gap Analysis engine).
    - Adds the net missing items to the Shopping List in one click.

## 3. Technical Requirements

### Schema Updates (`types/schema.ts`)
```typescript
export interface MealPlan {
    id: string;
    user_id: string;
    date: string; // ISO date string (YYYY-MM-DD)
    meal_type: 'breakfast' | 'lunch' | 'dinner';
    recipe_id: string;
    // joined fields
    recipe?: Recipe;
}
```

### New Hooks & Services
- `useMealPlan(startDate, endDate)`: Fetch plans for the view.
- `useAddToPlan()`: Mutation to schedule a meal.
- `useWeeklyShoppingList()`: The logic to aggregate ingredients across multiple recipes and diff against pantry.

## 4. UI/UX Targets
- **New Tab**: `app/(tabs)/planner.tsx`.
- **Drag & Drop (Nice to have, phase 2)**: For now, simple tap-to-select.
- **Empty States**: Encouraging UI to "Plan your week".

## 5. Implementation Plan

### Step 1: Database & Schema
- [ ] Create `meal_plans` table in Supabase.
- [ ] Update `types/schema.ts`.
- [ ] Create `useMealPlan` hooks.

### Step 2: The Planner UI
- [ ] Create `app/(tabs)/planner.tsx`.
- [ ] Build `WeekView` component (date selector).
- [ ] Build `MealSlot` component (shows recipe card or "Empty").

### Step 3: Scheduling Logic
- [ ] Connect "Add" button to a Recipe Pixel/Selector modal.
- [ ] Add "Schedule" button to existing `RecipeDetail` screen.

### Step 4: The "Shop for Week" Feature
- [ ] Implement `generateWeeklyShoppingList` logic (The heaviest technical piece).
- [ ] Add "Generate Shopping List" button to the Planner header.
