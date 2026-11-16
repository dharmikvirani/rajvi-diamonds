-- ==============================================================================
-- RAJVI DIAMONDS – PRODUCTION DATABASE SCHEMA
-- Supabase PostgreSQL Migration
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_admin_users_auth_id ON admin_users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active_order ON categories(is_active, display_order);

-- 3. DIAMONDS TABLE
CREATE TABLE IF NOT EXISTS diamonds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    shape TEXT NOT NULL,
    specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    seo_title TEXT,
    seo_description TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_diamonds_slug ON diamonds(slug);
CREATE INDEX IF NOT EXISTS idx_diamonds_active_featured ON diamonds(is_active, is_featured);
CREATE INDEX IF NOT EXISTS idx_diamonds_category_id ON diamonds(category_id);
CREATE INDEX IF NOT EXISTS idx_diamonds_shape ON diamonds(shape);
CREATE INDEX IF NOT EXISTS idx_diamonds_order ON diamonds(display_order);

-- 4. DIAMOND IMAGES TABLE
CREATE TABLE IF NOT EXISTS diamond_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    diamond_id UUID NOT NULL REFERENCES diamonds(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    cloudinary_public_id TEXT,
    alt_text TEXT NOT NULL DEFAULT '',
    is_primary BOOLEAN NOT NULL DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_diamond_images_diamond_id ON diamond_images(diamond_id);
CREATE INDEX IF NOT EXISTS idx_diamond_images_primary ON diamond_images(is_primary);

-- 5. DIAMOND SIZES TABLE
CREATE TABLE IF NOT EXISTS diamond_sizes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    diamond_id UUID NOT NULL REFERENCES diamonds(id) ON DELETE CASCADE,
    size_mm NUMERIC(6, 2) NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_diamond_size UNIQUE(diamond_id, size_mm)
);

CREATE INDEX IF NOT EXISTS idx_diamond_sizes_diamond_id ON diamond_sizes(diamond_id);
CREATE INDEX IF NOT EXISTS idx_diamond_sizes_available ON diamond_sizes(is_available);

-- 6. INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    company_name TEXT,
    inquiry_type TEXT NOT NULL,
    diamond_id UUID REFERENCES diamonds(id) ON DELETE SET NULL,
    selected_size TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'In Progress', 'Resolved', 'Archived')),
    internal_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_type ON inquiries(inquiry_type);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_diamond_id ON inquiries(diamond_id);

-- 7. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key TEXT NOT NULL UNIQUE,
    setting_value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(setting_key);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE diamonds ENABLE ROW LEVEL SECURITY;
ALTER TABLE diamond_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE diamond_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public can view active categories
CREATE POLICY "Public categories are viewable by everyone" 
ON categories FOR SELECT 
USING (is_active = true);

-- Public can view active diamonds
CREATE POLICY "Public diamonds are viewable by everyone" 
ON diamonds FOR SELECT 
USING (is_active = true);

-- Public can view diamond images for active diamonds
CREATE POLICY "Public diamond images are viewable by everyone" 
ON diamond_images FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM diamonds 
        WHERE diamonds.id = diamond_images.diamond_id AND diamonds.is_active = true
    )
);

-- Public can view diamond sizes for active diamonds
CREATE POLICY "Public diamond sizes are viewable by everyone" 
ON diamond_sizes FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM diamonds 
        WHERE diamonds.id = diamond_sizes.diamond_id AND diamonds.is_active = true
    )
);

-- Public can read site settings
CREATE POLICY "Public site settings are viewable by everyone" 
ON site_settings FOR SELECT 
USING (true);

-- Public can insert inquiries
CREATE POLICY "Public can insert inquiries" 
ON inquiries FOR INSERT 
WITH CHECK (true);

-- Authenticated admins have full access across tables
CREATE POLICY "Admins have full access to categories" 
ON categories FOR ALL 
TO authenticated 
USING (auth.uid() IN (SELECT auth_user_id FROM admin_users WHERE is_active = true))
WITH CHECK (auth.uid() IN (SELECT auth_user_id FROM admin_users WHERE is_active = true));

CREATE POLICY "Admins have full access to diamonds" 
ON diamonds FOR ALL 
TO authenticated 
USING (auth.uid() IN (SELECT auth_user_id FROM admin_users WHERE is_active = true))
WITH CHECK (auth.uid() IN (SELECT auth_user_id FROM admin_users WHERE is_active = true));

CREATE POLICY "Admins have full access to diamond images" 
ON diamond_images FOR ALL 
TO authenticated 
USING (auth.uid() IN (SELECT auth_user_id FROM admin_users WHERE is_active = true))
WITH CHECK (auth.uid() IN (SELECT auth_user_id FROM admin_users WHERE is_active = true));

CREATE POLICY "Admins have full access to diamond sizes" 
ON diamond_sizes FOR ALL 
TO authenticated 
USING (auth.uid() IN (SELECT auth_user_id FROM admin_users WHERE is_active = true))
WITH CHECK (auth.uid() IN (SELECT auth_user_id FROM admin_users WHERE is_active = true));

CREATE POLICY "Admins have full access to inquiries" 
ON inquiries FOR ALL 
TO authenticated 
USING (auth.uid() IN (SELECT auth_user_id FROM admin_users WHERE is_active = true))
WITH CHECK (auth.uid() IN (SELECT auth_user_id FROM admin_users WHERE is_active = true));

CREATE POLICY "Admins have full access to site settings" 
ON site_settings FOR ALL 
TO authenticated 
USING (auth.uid() IN (SELECT auth_user_id FROM admin_users WHERE is_active = true))
WITH CHECK (auth.uid() IN (SELECT auth_user_id FROM admin_users WHERE is_active = true));

CREATE POLICY "Admins can view admin_users list" 
ON admin_users FOR SELECT 
TO authenticated 
USING (auth.uid() IN (SELECT auth_user_id FROM admin_users WHERE is_active = true));
