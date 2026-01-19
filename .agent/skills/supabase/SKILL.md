---
name: supabase
description: Integration and best practices for Supabase Backend-as-a-Service.
---

# Supabase Best Practices

## Client Setup
- Initialize the client in `src/lib/supabase.ts`.
- Use environment variables for `SUPABASE_URL` and `SUPABASE_ANON_KEY`.

## Real-time Updates
- Enable Real-time on specific tables in the Supabase dashboard.
- Subscribe to changes using `supabase.channel('channel_name').on(...).subscribe()`.

## Data Fetching
- Use **PostgREST** filters (e.g., `.eq()`, `.select()`).
- Combine with `React Query` for caching and state management.

## Auth
- Use `supabase.auth.getSession()` and `supabase.auth.onAuthStateChange()` to manage user sessions.
- In Expo, use a secure storage solution like `expo-secure-store` to persist the session.

## Row Level Security (RLS)
- Always enable RLS in production.
- **Idempotency**: PostgreSQL `CREATE POLICY` fails if a policy name exists. Use `DROP POLICY IF EXISTS "name" ON table;` before `CREATE` to ensure scripts are repeatable.
- **Broad Permissions**: For shared data (like households), ensure policies cover `SELECT`, `INSERT`, `UPDATE`, and `DELETE` specifically. Use `FOR ALL` carefully.
- Define policies to ensure users can only access data belonging to their `household_id`.

## PostgREST & Schema Cache
- **Join Errors (PGRST200)**: If you receive "Could not find a relationship between tables", Supabase's cache is stale. 
  - **Fix 1**: Use sequential fetching (two separate `.from()` calls) instead of a join.
  - **Fix 2**: Run `NOTIFY pgrst, 'reload schema';` in the Supabase SQL editor.
- **Missing Columns (PGRST204)**: Ensure new columns exist in the DB before querying. If they do, use Fix 2 above.

## Schema & Constraint Integrity
- **Schema Sync**: Always verify that new columns are physically added to the dashboard before deploying code that tries to insert into them.
- **Strict Interface Matching**: NEVER add a field to a TypeScript interface (e.g., `RecipeIngredient`) that maps to a database table without first verifying that the column exists in Supabase. If missing, propose/perform the `ALTER TABLE` immediately.
- **Foreign Keys**: When using shared IDs (like `household_id`), ensure the parent record exists, or Foreign Key constraints will block child inserts.
- **Auth Triggers**: If using a `profiles` table, ensure a trigger or service-layer logic creates the profile immediately after signup to prevent "missing profile" UI loops.
