-- Fix Guest and Admin Order Policies
-- This migration ensures that both guest checkouts and admin management work correctly.

-- 1. Orders Table Policies
DROP POLICY IF EXISTS "Users can insert own orders." ON orders;
DROP POLICY IF EXISTS "Users can view own orders." ON orders;
DROP POLICY IF EXISTS "Admins can view all orders." ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update orders" ON orders;

-- Allow anyone (guest or registered) to create an order
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);

-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Admins can do everything
CREATE POLICY "Admins can manage all orders" ON orders FOR ALL USING (is_admin());

-- 2. Order Items Table Policies
DROP POLICY IF EXISTS "Users can insert own order items." ON order_items;
DROP POLICY IF EXISTS "Users can view own order items." ON order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;

-- Allow anyone to create order items (must be linked to a valid order)
CREATE POLICY "Anyone can create order items" ON order_items FOR INSERT WITH CHECK (true);

-- Users can view their own order items
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
  order_id IN (SELECT id FROM orders WHERE user_id = auth.uid() OR user_id IS NULL)
);

-- Admins can do everything
CREATE POLICY "Admins can manage all order items" ON order_items FOR ALL USING (is_admin());

-- 3. Profiles Table (Ensure admins can view all for name resolution)
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (is_admin());
