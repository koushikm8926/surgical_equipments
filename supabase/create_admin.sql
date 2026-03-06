-- RUN THIS IN YOUR SUPABASE SQL EDITOR

-- 1. Create the user in auth.users
-- Password is 'AdminPassword123!' (already hashed for Supabase)
-- Note: Supabase uses raw_app_meta_data for roles/claims, but we also rely on our public.profiles table.
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@surgicalequip.com',
  crypt('AdminPassword123!', gen_salt('bf')), -- 'bf' stands for blowfish (bcrypt), which Supabase supports
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Default Admin"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
) RETURNING id;

-- 2. The profile will be created automatically if there is a trigger,
-- but since we want to specify the 'admin' role, we should ensure it's set correctly.
-- Assuming the 'id' returned from the above query is what we use.

-- NOTE: Since we don't know the exact UUID generated in a single script easily without variables,
-- we use the email to identify the user just created.

UPDATE public.profiles
SET role = 'admin', full_name = 'Default Admin'
WHERE email = 'admin@surgicalequip.com';
