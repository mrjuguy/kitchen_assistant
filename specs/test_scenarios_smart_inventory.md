# Test Scenarios: Smart Inventory & Unit Conversion

## Prerequisites
1.  **Run Database Migration**:
    You must add the `updated_at` column to the `pantry_items` table. Run this SQL in your Supabase SQL Editor:
    ```sql
    ALTER TABLE pantry_items 
    ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
    ```

## Scenario 1: Shopping Checkout Normalization (Scanner Integration)
**Goal**: Verify that items added via Scanner (which often return Metric) are normalized to US units upon checkout.

1.  **Context**: A user scans a gallon of milk. OpenFoodFacts returns `3785 ml` or `3.78 L`.
2.  **Action**: Add an item to Shopping List simulating a scan: `Milk`, Quantity `3785`, Unit `ml`.
3.  Mark as Bought.
4.  Go to Pantry.
5.  **Expect**: You should see "Milk" with **1 Gallon** (or close to 1).
5.  Add another: `Flour`, Quantity `500`, Unit `g`.
6.  Mark as Bought.
7.  **Expect**: Pantry shows `Flour` with **17.6 oz** (or similar, normalized).

## Scenario 2: Smart Consumption Slider
**Goal**: Verify volume consumption controls.

1.  Find a "Volume" item in Pantry (e.g., Milk, Oil) with Quantity <= 1.25.
    *   *Note*: If you don't see the slider, ensure the unit is recognized (gal, qt, l, ml) and quantity is small.
2.  **Expect**: A segmented bar appears below the quantity controls.
3.  Tap the "50%" segment (middle-left).
4.  **Expect**: Quantity updates to **0.5** (or approx).
5.  Tap the "75%" segment.
6.  **Expect**: Quantity updates to **0.75**.

## Scenario 3: Inventory Audit (Stale Items)
**Goal**: Verify prompts for old items.

1.  (Dev/Manual) Manually update a pantry item in Supabase to have `updated_at` from 8 days ago.
    ```sql
    UPDATE pantry_items SET updated_at = now() - interval '8 days' WHERE name = 'Milk';
    ```
    *   *Alternative*: Manually wait 8 days (not recommended).
2.  Refresh the App (Pull to Refresh on Pantry).
3.  **Expect**: An "Audit Widget" appears at the top of the Pantry list asking if you still have "Milk".
4.  Tap "Yes, Full".
5.  **Expect**: Widget disappears. `updated_at` is reset to now.
6.  Repeat with another stale item and test "~Half".
7.  **Expect**: Quantity halves, timestamp updates.

## Test Results

| Scenario | Status | Notes |
| :--- | :--- | :--- |
| **1. Shopping Checkout Normalization** | [x] Pass / [ ] Fail | Scanner data is variable (OpenFoodFacts data quality), but normalization works when data is present (e.g. 12 fl oz). "1 item" fallback is acceptable. |
| **2. Smart Consumption Slider** | [x] Pass / [ ] Fail | Works for normalized items (0-100% of standard unit). For Bulk items (e.g. 12 oz cereal), slider "Auto-Learns" capacity on first use (setting current qty as Full), enabling accurate "green bar" tracking thereafter. |
| **3. Inventory Audit (Stale Items)** | [x] Pass / [ ] Fail | Validated via manual timestamp updates. |

