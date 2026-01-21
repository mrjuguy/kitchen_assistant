# Database Migration: Smart Inventory Capacity

To enable accurate progress bars for bulk items (like Cereal), run this in your Supabase SQL Editor:

```sql
-- 1. Add the column
ALTER TABLE pantry_items 
ADD COLUMN total_capacity FLOAT;

-- 2. Backfill existing bulk items (Assuming current quantity is full capacity for items you haven't touched)
-- Note: Use discretion. This sets 'capacity' to 'current quantity'.
UPDATE pantry_items 
SET total_capacity = quantity 
WHERE total_capacity IS NULL 
  AND unit IN ('oz', 'g', 'ml', 'fl_oz', 'lb', 'kg') 
  AND quantity > 1.25;
```

## How it works (New Logic)
1.  **New Items**: When you checkout, the full quantity is saved as `total_capacity`.
2.  **Slider**: 
    *   **Blue Bar**: Indicates item is Full / Untouched.
    *   **Green Bar**: Indicates item is partially consumed (e.g. 50% of Capacity).
    *   **Legacy Items**: Will show Blue bars that "reset" to full after every update (until you backfill them or buy new ones).
