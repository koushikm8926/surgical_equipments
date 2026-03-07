-- 1. Fix missing INSERT policy for profiles (Required for the auto-sync code to work)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can insert own profile.'
    ) THEN
        CREATE POLICY "Users can insert own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
    END IF;
END $$;

-- 2. Force set the admin role for the demo account
-- First, ensure a profile exists if it somehow doesn't
INSERT INTO profiles (id, email, role, full_name)
SELECT id, email, 'admin', 'Default Admin'
FROM auth.users
WHERE email = 'admin@surgicalequip.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- 3. Verify Product RLS Policies (Ensure they are enabled and correct)
-- These should already exist from 0004_admin_policies.sql, but we ensure they work with the role.
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
