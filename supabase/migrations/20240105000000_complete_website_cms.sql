-- ==============================================================================
-- RAJVI DIAMONDS – COMPLETE WEBSITE CMS SCHEMA MIGRATION
-- Compatible with Supabase PostgreSQL (ap-south-1)
-- ==============================================================================

-- 1. CMS SECTIONS TABLE (Supports Modular Homepage & Inner Page Sections with Draft vs. Published Workflow)
CREATE TABLE IF NOT EXISTS cms_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_slug TEXT NOT NULL DEFAULT 'home',
    section_key TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL DEFAULT '',
    subtitle TEXT NOT NULL DEFAULT '',
    badge TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    image_url TEXT NOT NULL DEFAULT '',
    image_mobile_url TEXT NOT NULL DEFAULT '',
    image_alt TEXT NOT NULL DEFAULT '',
    buttons JSONB NOT NULL DEFAULT '[]'::jsonb,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    draft_data JSONB,
    has_draft BOOLEAN NOT NULL DEFAULT false,
    published_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_cms_sections_page_order ON cms_sections(page_slug, display_order);
CREATE INDEX IF NOT EXISTS idx_cms_sections_key ON cms_sections(section_key);
CREATE INDEX IF NOT EXISTS idx_cms_sections_active ON cms_sections(is_active);

-- 2. WEBSITE NAVIGATION TABLE (Header & Multi-Column Footer Menus)
CREATE TABLE IF NOT EXISTS website_navigation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_location TEXT NOT NULL DEFAULT 'header', -- 'header' | 'footer_collections' | 'footer_navigation'
    label TEXT NOT NULL,
    href TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_external BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_navigation_location ON website_navigation(menu_location, display_order);
CREATE INDEX IF NOT EXISTS idx_navigation_active ON website_navigation(is_active);

-- 3. CMS MEDIA GALLERY TABLE (Curated Brand Photography & Media Library)
CREATE TABLE IF NOT EXISTS cms_gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_url TEXT NOT NULL,
    cloudinary_public_id TEXT,
    caption TEXT NOT NULL DEFAULT '',
    alt_text TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT 'general',
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_gallery_order ON cms_gallery(is_active, display_order);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE cms_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_navigation ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_gallery ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Public read published sections" ON cms_sections;
    DROP POLICY IF EXISTS "Public read active navigation" ON website_navigation;
    DROP POLICY IF EXISTS "Public read active gallery" ON cms_gallery;
    DROP POLICY IF EXISTS "Admin full access to cms_sections" ON cms_sections;
    DROP POLICY IF EXISTS "Admin full access to website_navigation" ON website_navigation;
    DROP POLICY IF EXISTS "Admin full access to cms_gallery" ON cms_gallery;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

-- Public can read active records
CREATE POLICY "Public read published sections"
ON cms_sections FOR SELECT
USING (is_active = true);

CREATE POLICY "Public read active navigation"
ON website_navigation FOR SELECT
USING (is_active = true);

CREATE POLICY "Public read active gallery"
ON cms_gallery FOR SELECT
USING (is_active = true);

-- Authenticated admins have full CRUD access
CREATE POLICY "Admin full access to cms_sections"
ON cms_sections FOR ALL TO authenticated
USING (auth.uid() IN (SELECT auth_user_id FROM admin_users WHERE is_active = true))
WITH CHECK (auth.uid() IN (SELECT auth_user_id FROM admin_users WHERE is_active = true));

CREATE POLICY "Admin full access to website_navigation"
ON website_navigation FOR ALL TO authenticated
USING (auth.uid() IN (SELECT auth_user_id FROM admin_users WHERE is_active = true))
WITH CHECK (auth.uid() IN (SELECT auth_user_id FROM admin_users WHERE is_active = true));

CREATE POLICY "Admin full access to cms_gallery"
ON cms_gallery FOR ALL TO authenticated
USING (auth.uid() IN (SELECT auth_user_id FROM admin_users WHERE is_active = true))
WITH CHECK (auth.uid() IN (SELECT auth_user_id FROM admin_users WHERE is_active = true));
