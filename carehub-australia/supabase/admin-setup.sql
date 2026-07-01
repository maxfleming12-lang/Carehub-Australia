-- =============================================================
-- Scribe & Thrive Australia — Admin Account Setup
-- =============================================================
-- Run this in the Supabase SQL Editor AFTER creating your account
-- through the regular registration flow (or via Supabase Auth dashboard).
--
-- Replace 'your-email@example.com' with your actual email address.
-- =============================================================

-- Step 1: Find your user ID (copy the result for reference)
SELECT id, email, created_at
FROM auth.users
WHERE email = 'your-email@example.com';

-- Step 2: Promote the account to admin with full enterprise access.
-- This grants unlimited AI usage and full platform access.
UPDATE public.profiles
SET
  role                = 'admin',
  subscription_tier   = 'enterprise',
  subscription_status = 'active'
WHERE email = 'your-email@example.com';

-- Step 3: Verify the update
SELECT id, email, role, subscription_tier, subscription_status
FROM public.profiles
WHERE email = 'your-email@example.com';
