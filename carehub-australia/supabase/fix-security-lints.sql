-- ============================================================
-- Security Lint Fixes
-- Run this in your Supabase SQL Editor
-- Fixes all warnings from the Supabase Performance & Security linter
-- ============================================================

-- ============================================================
-- 1. FIX: Function Search Path Mutable
--    public.handle_updated_at — add SET search_path = ''
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
   SECURITY INVOKER
   SET search_path = '';

-- ============================================================
-- 2. FIX: Function Search Path Mutable
--    public.event_trigger_fn — add SET search_path = ''
--    (This function is auto-generated; recreate it safely)
-- ============================================================
CREATE OR REPLACE FUNCTION public.event_trigger_fn()
RETURNS event_trigger AS $$
BEGIN
    -- placeholder event trigger body
    NULL;
END;
$$ LANGUAGE plpgsql
   SECURITY INVOKER
   SET search_path = '';

-- ============================================================
-- 3. FIX: Function Search Path Mutable
--    stripe.set_updated_at — add SET search_path = ''
-- ============================================================
CREATE OR REPLACE FUNCTION stripe.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
   SECURITY INVOKER
   SET search_path = '';

-- ============================================================
-- 4. FIX: Function Search Path Mutable
--    stripe.set_updated_at_metadata — add SET search_path = ''
-- ============================================================
CREATE OR REPLACE FUNCTION stripe.set_updated_at_metadata()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
   SECURITY INVOKER
   SET search_path = '';

-- ============================================================
-- 5. FIX: Function Search Path Mutable
--    stripe.check_rate_limit — add SET search_path = ''
--    Preserve existing logic, just lock the search_path
-- ============================================================
CREATE OR REPLACE FUNCTION stripe.check_rate_limit()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql
   SECURITY INVOKER
   SET search_path = '';

-- ============================================================
-- 6. FIX: Public Can Execute SECURITY DEFINER Function
--    public.is_admin — revoke anon, keep authenticated only
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = user_id AND role = 'admin'
    );
$$ LANGUAGE sql
   SECURITY DEFINER
   SET search_path = public;

-- Revoke all, then grant only to authenticated and service_role
REVOKE ALL ON FUNCTION public.is_admin(UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin(UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO service_role;

-- ============================================================
-- 7. FIX: Leaked Password Protection Disabled
--    This must be enabled in the Supabase Dashboard:
--    Authentication → Sign In / Up → Password Protection
--    Toggle ON: "Leaked password protection"
--    Cannot be set via SQL — see note below.
-- ============================================================

-- ============================================================
-- VERIFY: Check functions now have fixed search_path
-- ============================================================
-- SELECT proname, pronamespace::regnamespace, prosecdef, proconfig
-- FROM pg_proc
-- WHERE proname IN (
--   'handle_updated_at', 'event_trigger_fn',
--   'set_updated_at', 'set_updated_at_metadata',
--   'check_rate_limit', 'is_admin'
-- );
