-- 1. DROP problematic/recursive policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;
DROP POLICY IF EXISTS "Anyone can insert orders." ON orders;
DROP POLICY IF EXISTS "Anyone can insert order items." ON order_items;
DROP POLICY IF EXISTS "Anyone can view orders by ID." ON orders;
DROP POLICY IF EXISTS "Anyone can view order items by ID." ON order_items;
DROP POLICY IF EXISTS "Guests can view their own orders by ID." ON orders;
DROP POLICY IF EXISTS "Guests can view their own order items by ID." ON order_items;

-- 2. Create a SECURITY DEFINER function to check admin status safely
-- This bypasses RLS recursion because it runs with the privileges of the creator
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Re-create Profile policies
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (is_admin());

-- 4. Re-create Order policies
CREATE POLICY "Anyone can insert orders." ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view orders by ID." ON orders FOR SELECT USING (true);
CREATE POLICY "Admins can update orders" ON orders FOR UPDATE USING (is_admin());

-- 5. Re-create Order Items policies
CREATE POLICY "Anyone can insert order items." ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view order items by ID." ON order_items FOR SELECT USING (true);
