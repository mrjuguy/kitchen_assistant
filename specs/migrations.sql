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
