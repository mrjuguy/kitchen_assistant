-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    display_name TEXT,
    allergens TEXT[] DEFAULT '{}',
    dietary_preferences TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Add tags and allergens to recipes if they don't exist
ALTER TABLE public.recipes 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS allergens TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS servings INTEGER DEFAULT 2;

-- Enable RLS on recipe_ingredients
ALTER TABLE public.recipe_ingredients ENABLE ROW LEVEL SECURITY;

-- Policy for Select: Allow viewing ingredients if you can view the recipe (checking public access or ownership)
-- For simplicity in this phase, assuming public read or owner read. 
-- Let's allow users to view ingredients for ANY recipe they can see.
CREATE POLICY "Users can view ingredients" ON public.recipe_ingredients
    FOR SELECT USING (true); 

-- Policy for Insert: Users can add ingredients ONLY to recipes they own
CREATE POLICY "Users can add ingredients to own recipes" ON public.recipe_ingredients
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.recipes
            WHERE id = recipe_ingredients.recipe_id
            AND user_id = auth.uid()
        )
    );

-- Policy for Update/Delete: Users can modify ingredients of own recipes
CREATE POLICY "Users can modify ingredients of own recipes" ON public.recipe_ingredients
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.recipes
            WHERE id = recipe_ingredients.recipe_id
            AND user_id = auth.uid()
        )
    );

-- ============================================
-- Migration: checkout_shopping_list_rpc
-- Date: 2026-01-31
-- Issue: #56 - Atomic Shopping List Checkout
-- ============================================

-- Atomic Shopping List Checkout RPC
-- This function handles the entire checkout process in a single transaction:
-- 1. Fetches all bought items for the household
-- 2. Inserts them into pantry_items
-- 3. Deletes them from shopping_list
-- Returns the count of items transferred

CREATE OR REPLACE FUNCTION checkout_shopping_list(p_household_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_transferred_count INTEGER := 0;
BEGIN
  -- Insert bought items into pantry_items
  INSERT INTO pantry_items (
    user_id,
    household_id,
    name,
    quantity,
    unit,
    category,
    barcode,
    image_url,
    brand,
    nutritional_info,
    ingredients_text,
    allergens,
    labels,
    total_capacity
  )
  SELECT
    user_id,
    household_id,
    name,
    quantity,
    unit,
    category,
    barcode,
    image_url,
    brand,
    nutritional_info,
    ingredients_text,
    allergens,
    labels,
    quantity -- total_capacity = original quantity
  FROM shopping_list
  WHERE household_id = p_household_id
    AND bought = true;

  -- Get the count of transferred items
  GET DIAGNOSTICS v_transferred_count = ROW_COUNT;

  -- Delete bought items from shopping_list
  DELETE FROM shopping_list
  WHERE household_id = p_household_id
    AND bought = true;

  RETURN v_transferred_count;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION checkout_shopping_list(UUID) TO authenticated;
