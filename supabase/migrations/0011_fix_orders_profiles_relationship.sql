-- Fix Foreign Key for PostgREST Joins
-- This allows the orders API to join the profiles table directly.

ALTER TABLE orders
  DROP CONSTRAINT IF EXISTS orders_user_id_fkey,
  ADD CONSTRAINT orders_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES profiles(id) 
    ON DELETE SET NULL;

-- Note: user_id can still be NULL for guest orders.
-- This change helps Supabase understand the relationship between orders and profiles.
