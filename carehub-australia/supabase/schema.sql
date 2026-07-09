-- Scribe & Thrive Australia - Complete Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    full_name TEXT,
    email TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'starter', 'professional', 'enterprise')),
    subscription_status TEXT CHECK (subscription_status IN ('active', 'inactive', 'trialing', 'cancelled')),
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT UNIQUE,
    organization TEXT,
    phone TEXT,
    state TEXT
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Admin role helper used by RLS policies.
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = user_id AND role = 'admin'
    );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

REVOKE ALL ON FUNCTION public.is_admin(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO service_role;

-- ============================================================
-- RESOURCES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content TEXT,
    file_url TEXT,
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    access_tier TEXT DEFAULT 'free' CHECK (access_tier IN ('free', 'starter', 'professional', 'enterprise')),
    download_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true
);

-- ============================================================
-- BLOG POSTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    cover_image TEXT,
    tags TEXT[] DEFAULT '{}',
    is_published BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    seo_title TEXT,
    seo_description TEXT
);

CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- ASSESSMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL,
    answers JSONB NOT NULL,
    score INTEGER NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('low', 'moderate', 'high', 'severe')),
    recommendations TEXT[] DEFAULT '{}'
);

-- ============================================================
-- GENERATED DOCUMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.generated_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    context JSONB DEFAULT '{}'
);

-- ============================================================
-- SHIFT NOTES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.shift_notes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    client_name TEXT NOT NULL,
    date DATE NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    content TEXT NOT NULL,
    raw_data JSONB DEFAULT '{}'
);

-- ============================================================
-- COURSES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content JSONB DEFAULT '{}',
    duration_hours NUMERIC NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    category TEXT NOT NULL,
    thumbnail TEXT,
    access_tier TEXT DEFAULT 'free' CHECK (access_tier IN ('free', 'starter', 'professional', 'enterprise')),
    is_published BOOLEAN DEFAULT true,
    certificate_enabled BOOLEAN DEFAULT true
);

-- ============================================================
-- COURSE ENROLLMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.course_enrollments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    certificate_url TEXT,
    UNIQUE(user_id, course_id)
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shift_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    USING (public.is_admin(auth.uid()));

-- Resources policies
CREATE POLICY "Anyone can view published free resources"
    ON public.resources FOR SELECT
    USING (is_published = true AND access_tier = 'free');

CREATE POLICY "Authenticated users can view resources for their tier"
    ON public.resources FOR SELECT
    USING (
        auth.uid() IS NOT NULL AND
        is_published = true AND (
            access_tier = 'free' OR
            public.is_admin(auth.uid()) OR
            EXISTS (
                SELECT 1 FROM public.profiles p
                WHERE p.id = auth.uid() AND (
                    (access_tier = 'starter' AND p.subscription_tier IN ('starter', 'professional', 'enterprise')) OR
                    (access_tier = 'professional' AND p.subscription_tier IN ('professional', 'enterprise')) OR
                    (access_tier = 'enterprise' AND p.subscription_tier = 'enterprise')
                )
            )
        )
    );

-- Blog policies
CREATE POLICY "Anyone can view published blog posts"
    ON public.blog_posts FOR SELECT
    USING (is_published = true);

CREATE POLICY "Admins can manage blog posts"
    ON public.blog_posts FOR ALL
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

-- Assessments policies
CREATE POLICY "Users can view their own assessments"
    ON public.assessments FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create assessments"
    ON public.assessments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Generated documents policies
CREATE POLICY "Users can view their own documents"
    ON public.generated_documents FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create documents"
    ON public.generated_documents FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Shift notes policies
CREATE POLICY "Users can view their own shift notes"
    ON public.shift_notes FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create shift notes"
    ON public.shift_notes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Courses policies
CREATE POLICY "Anyone can view published courses"
    ON public.courses FOR SELECT
    USING (is_published = true);

-- Course enrollments policies
CREATE POLICY "Users can view their own enrollments"
    ON public.course_enrollments FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create enrollments"
    ON public.course_enrollments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enrollments"
    ON public.course_enrollments FOR UPDATE
    USING (auth.uid() = user_id);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON public.profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON public.assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_documents_user_id ON public.generated_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_shift_notes_user_id ON public.shift_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_shift_notes_date ON public.shift_notes(date);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user_id ON public.course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course_id ON public.course_enrollments(course_id);

-- ============================================================
-- CONTENT SEEDING
-- ============================================================

-- Production content should be added deliberately through admin tooling or
-- reviewed SQL migrations. This schema intentionally does not insert starter
-- resources or courses.
