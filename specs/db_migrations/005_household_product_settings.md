# Database Migration: Household Product Settings

To enable the 'Product Knowledge' engine and allow household-wide overrides (like default expiry), run this in your Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS public.household_product_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    household_id UUID REFERENCES public.households(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    default_expiry_days INTEGER,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(household_id, product_name)
);

-- Enable RLS
ALTER TABLE public.household_product_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view settings for their household" ON public.household_product_settings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.household_members
            WHERE household_id = household_product_settings.household_id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update settings for their household" ON public.household_product_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.household_members
            WHERE household_id = household_product_settings.household_id
            AND user_id = auth.uid()
        )
    ) WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.household_members
            WHERE household_id = household_product_settings.household_id
            AND user_id = auth.uid()
        )
    );
```

## How it works
1. **Shared Learning**: When any user in a household overrides a product setting (e.g., milk always expires in 10 days instead of 7), it's saved here.
2. **Contextual Defaults**: When adding new items, the app first checks this table for any household-specific preferences before falling back to global defaults.
