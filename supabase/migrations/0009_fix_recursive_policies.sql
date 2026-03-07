-- Fix Recursive RLS Policies
-- The previous policies created an infinite loop when checking admin roles.

-- 1. Drop the problematic recursive policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;
DROP POLICY IF EXISTS "Admins can insert categories" ON categories;
DROP POLICY IF EXISTS "Admins can update categories" ON categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON categories;

-- 2. Create a Security Definer function to check admin status safely
-- This bypasses RLS for the role check itself, preventing recursion.
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Re-implement policies using the non-recursive function
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (is_admin());
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update orders" ON orders FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can view all order items" ON order_items FOR SELECT USING (is_admin());

CREATE POLICY "Admins can manage products" ON products FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage categories" ON categories FOR ALL USING (is_admin());

-- Also fix storage policies to use the function
DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;

CREATE POLICY "Admins can manage product images" ON storage.objects 
FOR ALL USING (
  bucket_id = 'product-images' AND is_admin()
);
