-- ==============================================================================
-- RAJVI DIAMONDS – MASTER DATABASE SCHEMA & INITIAL SEED
-- Compatible with Supabase PostgreSQL (Mumbai / ap-south-1)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. ADMIN USERS TABLE
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 2. CATEGORIES TABLE
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 3. DIAMONDS (PRODUCT SHOWCASE) TABLE
-- Supports: id, product_name, slug, description, diamond_shape, size, color,
--           clarity, purity, price, images, is_active, created_at, updated_at
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS diamonds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    product_name TEXT,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    shape TEXT NOT NULL,
    diamond_shape TEXT,
    size TEXT,
    color TEXT,
    clarity TEXT,
    purity TEXT,
    price NUMERIC(12, 2),
    images JSONB DEFAULT '[]'::jsonb,
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
CREATE INDEX IF NOT EXISTS idx_diamonds_color ON diamonds(color);
CREATE INDEX IF NOT EXISTS idx_diamonds_clarity ON diamonds(clarity);
CREATE INDEX IF NOT EXISTS idx_diamonds_order ON diamonds(display_order);

-- Field synchronization trigger to keep aliases in sync
CREATE OR REPLACE FUNCTION sync_diamond_fields()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.name IS NOT NULL AND (NEW.product_name IS NULL OR NEW.product_name = '') THEN
        NEW.product_name := NEW.name;
    ELSIF NEW.product_name IS NOT NULL AND (NEW.name IS NULL OR NEW.name = '') THEN
        NEW.name := NEW.product_name;
    END IF;

    IF NEW.shape IS NOT NULL AND (NEW.diamond_shape IS NULL OR NEW.diamond_shape = '') THEN
        NEW.diamond_shape := NEW.shape;
    ELSIF NEW.diamond_shape IS NOT NULL AND (NEW.shape IS NULL OR NEW.shape = '') THEN
        NEW.shape := NEW.diamond_shape;
    END IF;

    IF NEW.clarity IS NOT NULL AND (NEW.purity IS NULL OR NEW.purity = '') THEN
        NEW.purity := NEW.clarity;
    ELSIF NEW.purity IS NOT NULL AND (NEW.clarity IS NULL OR NEW.clarity = '') THEN
        NEW.clarity := NEW.purity;
    END IF;

    NEW.updated_at := timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_diamond_fields ON diamonds;
CREATE TRIGGER trg_sync_diamond_fields
BEFORE INSERT OR UPDATE ON diamonds
FOR EACH ROW EXECUTE FUNCTION sync_diamond_fields();

-- ------------------------------------------------------------------------------
-- 4. DIAMOND IMAGES TABLE (Multiple Images with Cloudinary CDN Support)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 5. DIAMOND SIZES TABLE (Supports Calibrated Millimeter Sizing: 4, 4.5, 5, 5.5, 6 mm)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 6. DIAMOND COLORS TABLE (Standard D-Z + Fancy Colors)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS diamond_colors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL DEFAULT 'standard',
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_diamond_colors_active_order ON diamond_colors(is_active, display_order);

-- ------------------------------------------------------------------------------
-- 7. DIAMOND PURITY / CLARITY TABLE (FL to I3)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS diamond_clarities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    label TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_diamond_clarities_active_order ON diamond_clarities(is_active, display_order);

-- ------------------------------------------------------------------------------
-- 8. INQUIRIES TABLE (Customer B2B / Instagram / WhatsApp Inquiries)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    company_name TEXT,
    inquiry_type TEXT NOT NULL,
    diamond_id UUID REFERENCES diamonds(id) ON DELETE SET NULL,
    selected_size TEXT,
    selected_color TEXT,
    selected_clarity TEXT,
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

-- ------------------------------------------------------------------------------
-- 9. SITE SETTINGS TABLE (Key-Value Dynamic Brand Configuration)
-- ------------------------------------------------------------------------------
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
ALTER TABLE diamond_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE diamond_clarities ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Clean existing policies before recreating
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public categories are viewable by everyone" ON categories;
    DROP POLICY IF EXISTS "Public diamonds are viewable by everyone" ON diamonds;
    DROP POLICY IF EXISTS "Public diamond images are viewable by everyone" ON diamond_images;
    DROP POLICY IF EXISTS "Public diamond sizes are viewable by everyone" ON diamond_sizes;
    DROP POLICY IF EXISTS "Public read active diamond colors" ON diamond_colors;
    DROP POLICY IF EXISTS "Public read active diamond clarities" ON diamond_clarities;
    DROP POLICY IF EXISTS "Public site settings are viewable by everyone" ON site_settings;
    DROP POLICY IF EXISTS "Public can insert inquiries" ON inquiries;
    DROP POLICY IF EXISTS "Admins have full access to categories" ON categories;
    DROP POLICY IF EXISTS "Admins have full access to diamonds" ON diamonds;
    DROP POLICY IF EXISTS "Admins have full access to diamond images" ON diamond_images;
    DROP POLICY IF EXISTS "Admins have full access to diamond sizes" ON diamond_sizes;
    DROP POLICY IF EXISTS "Admin full access to diamond colors" ON diamond_colors;
    DROP POLICY IF EXISTS "Admin full access to diamond clarities" ON diamond_clarities;
    DROP POLICY IF EXISTS "Admins have full access to inquiries" ON inquiries;
    DROP POLICY IF EXISTS "Admins have full access to site settings" ON site_settings;
    DROP POLICY IF EXISTS "Admins can view admin_users list" ON admin_users;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

-- 1. Public Read Active Records
CREATE POLICY "Public categories are viewable by everyone" 
ON categories FOR SELECT USING (is_active = true);

CREATE POLICY "Public diamonds are viewable by everyone" 
ON diamonds FOR SELECT USING (is_active = true);

CREATE POLICY "Public diamond images are viewable by everyone" 
ON diamond_images FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM diamonds 
        WHERE diamonds.id = diamond_images.diamond_id AND diamonds.is_active = true
    )
);

CREATE POLICY "Public diamond sizes are viewable by everyone" 
ON diamond_sizes FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM diamonds 
        WHERE diamonds.id = diamond_sizes.diamond_id AND diamonds.is_active = true
    )
);

CREATE POLICY "Public read active diamond colors"
ON diamond_colors FOR SELECT USING (is_active = true);

CREATE POLICY "Public read active diamond clarities"
ON diamond_clarities FOR SELECT USING (is_active = true);

CREATE POLICY "Public site settings are viewable by everyone" 
ON site_settings FOR SELECT USING (true);

-- 2. Public Insert Inquiries
CREATE POLICY "Public can insert inquiries" 
ON inquiries FOR INSERT WITH CHECK (true);

-- 3. Authenticated Admin Full CRUD Policies
CREATE POLICY "Admins have full access to categories" 
ON categories FOR ALL TO authenticated 
USING (auth.uid() IN (SELECT auth_user_id FROM admin_users WHERE is_active = true))
WITH CHECK (auth.uid() IN (SELECT auth_user_id FROM admin_users WHERE is_active = true));

CREATE POLICY "Admins have full access to diamonds" 
ON diamonds FOR ALL TO authenticated 
USING (auth.uid() IN (SELECT auth_user_id FROM admin_users WHERE is_active = true))
WITH CHECK (auth.uid() IN (SELECT auth_user_id FROM admin_users WHERE is_active = true));

CREATE POLICY "Admins have full access to diamond images" 
ON diamond_images FOR ALL TO authenticated 
USING (auth.uid() IN (SELECT auth_user_id FROM admin_users WHERE is_active = true))
WITH CHECK (auth.uid() IN (SELECT auth_user_id FROM admin_users WHERE is_active = true));

CREATE POLICY "Admins have full access to diamond sizes" 
ON diamond_sizes FOR ALL TO authenticated 
USING (auth.uid() IN (SELECT auth_user_id FROM admin_users WHERE is_active = true))
WITH CHECK (auth.uid() IN (SELECT auth_user_id FROM admin_users WHERE is_active = true));

CREATE POLICY "Admin full access to diamond colors" 
ON diamond_colors FOR ALL TO authenticated 
USING (auth.uid() IN (SELECT auth_user_id FROM admin_users WHERE is_active = true))
WITH CHECK (auth.uid() IN (SELECT auth_user_id FROM admin_users WHERE is_active = true));

CREATE POLICY "Admin full access to diamond clarities" 
ON diamond_clarities FOR ALL TO authenticated 
USING (auth.uid() IN (SELECT auth_user_id FROM admin_users WHERE is_active = true))
WITH CHECK (auth.uid() IN (SELECT auth_user_id FROM admin_users WHERE is_active = true));

CREATE POLICY "Admins have full access to inquiries" 
ON inquiries FOR ALL TO authenticated 
USING (auth.uid() IN (SELECT auth_user_id FROM admin_users WHERE is_active = true))
WITH CHECK (auth.uid() IN (SELECT auth_user_id FROM admin_users WHERE is_active = true));

CREATE POLICY "Admins have full access to site settings" 
ON site_settings FOR ALL TO authenticated 
USING (auth.uid() IN (SELECT auth_user_id FROM admin_users WHERE is_active = true))
WITH CHECK (auth.uid() IN (SELECT auth_user_id FROM admin_users WHERE is_active = true));

CREATE POLICY "Admins can view admin_users list" 
ON admin_users FOR SELECT TO authenticated 
USING (auth.uid() IN (SELECT auth_user_id FROM admin_users WHERE is_active = true));

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

-- 1. Insert Initial Categories
INSERT INTO categories (id, name, slug, description, image_url, is_active, display_order)
VALUES
  ('c0000000-0000-0000-0000-000000000001', 'Geometric Fancy Cuts', 'geometric-fancy-cuts', 'Architectural faceting showcasing symmetry, clean planar reflections, and historic lapidary precision.', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80', true, 1),
  ('c0000000-0000-0000-0000-000000000002', 'Botanical & Organic Cuts', 'botanical-organic-cuts', 'Nature-inspired silhouettes sculpted with petal facets and romantic vintage allure.', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80', true, 2),
  ('c0000000-0000-0000-0000-000000000003', 'Antique & Heritage Cuts', 'antique-heritage-cuts', 'Reimagined historical cuts balancing subtle dispersion with dramatic crown proportions.', 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1200&q=80', true, 3)
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name, description = EXCLUDED.description, image_url = EXCLUDED.image_url;

-- 2. Insert Initial Diamonds
INSERT INTO diamonds (
    id, category_id, name, product_name, slug, short_description, description, 
    shape, diamond_shape, size, color, clarity, purity, price,
    specifications, is_featured, is_active, seo_title, seo_description, display_order
) VALUES (
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'Rose Octagone',
    'Rose Octagone',
    'rose-octagone',
    'An eight-sided geometric rose cut featuring triangular facets rising into a serene domed crown.',
    'The Rose Octagone cut by Rajvi Diamonds represents the pinnacle of geometric fancy diamond craftsmanship. Combining the eight-sided strength of an octagon with the delicate, fire-diffusing facet structure of a rose cut, this stone produces soft, luminous scintillation that captures attention from every angle. Each facet is hand-oriented by master diamond cutters to maximize interior reflections while preserving the flat base characteristic of historic rose cuts.',
    'Octagon Rose Cut',
    'Octagon Rose Cut',
    '4.00 - 6.00 mm',
    'D',
    'VVS1',
    'VVS1',
    NULL,
    '{
        "cut_grade": "Excellent",
        "symmetry": "Very Good to Excellent",
        "polish": "Excellent",
        "fluorescence": "None to Faint",
        "table_percentage": "Dome Rose Cut (Facet Crown)",
        "depth_percentage": "35% - 42%",
        "facet_count": 24,
        "culet": "Flat Base",
        "girdle": "Faceted, Medium to Slightly Thick",
        "crafting_origin": "Artisanal Fancy Lapidary Studio"
    }'::jsonb,
    true,
    true,
    'Rose Octagone Fancy Diamond Cut | Rajvi Diamonds',
    'Discover the Rose Octagone diamond cut by Rajvi Diamonds. Exceptional eight-sided rose cut available in calibrated millimeter sizes for luxury jewellery designers.',
    1
), (
    'd0000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000002',
    'Tulip',
    'Tulip',
    'tulip',
    'An organic floral cut featuring graceful petal contours, sculpted for romantic brilliance and depth.',
    'The Tulip cut by Rajvi Diamonds is an exquisite testament to floral lapidary artistry. Embodying the soft elegance of blossoming flower petals, the Tulip cut combines organic curvatures with rigorous geometric symmetry to produce lively internal light refraction. Designed specifically for distinctive statement pieces, high jewellery creations, and bespoke engagement suites. Note: Size availability is configured per inquiry.',
    'Floral Tulip Cut',
    'Floral Tulip Cut',
    'Bespoke per inquiry',
    'F',
    'VS1',
    'VS1',
    NULL,
    '{
        "cut_grade": "Excellent",
        "symmetry": "Excellent",
        "polish": "Excellent",
        "fluorescence": "None",
        "table_percentage": "56% - 62%",
        "depth_percentage": "60% - 66%",
        "facet_count": 57,
        "culet": "Pointed",
        "girdle": "Thin to Medium, Polished",
        "crafting_origin": "Artisanal Fancy Lapidary Studio"
    }'::jsonb,
    true,
    true,
    'Tulip Fancy Diamond Cut | Rajvi Diamonds',
    'Explore the Tulip fancy diamond cut by Rajvi Diamonds. A botanical petal silhouette with extraordinary fire, crafted for bespoke high jewellery.',
    2
) ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name, description = EXCLUDED.description, short_description = EXCLUDED.short_description;

-- 3. Insert Initial Calibrated Sizes for Rose Octagone: 4 mm, 4.5 mm, 5 mm, 5.5 mm, 6 mm
INSERT INTO diamond_sizes (diamond_id, size_mm, is_available, display_order)
VALUES
  ('d0000000-0000-0000-0000-000000000001', 4.00, true, 1),
  ('d0000000-0000-0000-0000-000000000001', 4.50, true, 2),
  ('d0000000-0000-0000-0000-000000000001', 5.00, true, 3),
  ('d0000000-0000-0000-0000-000000000001', 5.50, true, 4),
  ('d0000000-0000-0000-0000-000000000001', 6.00, true, 5)
ON CONFLICT (diamond_id, size_mm) DO UPDATE
SET is_available = EXCLUDED.is_available, display_order = EXCLUDED.display_order;

-- 4. Insert Images for Rose Octagone & Tulip
INSERT INTO diamond_images (diamond_id, image_url, alt_text, is_primary, display_order)
VALUES
  ('d0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1400&q=85', 'Rajvi Diamonds Rose Octagone Cut - Primary Angle', true, 1),
  ('d0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1400&q=85', 'Rose Octagone Geometric Facet Reflections', false, 2),
  ('d0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1400&q=85', 'Rajvi Diamonds Tulip Cut Fancy Diamond - Front Face', true, 1),
  ('d0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1400&q=85', 'Tulip Diamond Floral Symmetry and Dispersion', false, 2);

-- 5. Insert Diamond Color Options (D-Z + Fancy Colors)
INSERT INTO diamond_colors (name, category, display_order, is_active) VALUES
    ('D', 'standard', 1, true),
    ('E', 'standard', 2, true),
    ('F', 'standard', 3, true),
    ('G', 'standard', 4, true),
    ('H', 'standard', 5, true),
    ('I', 'standard', 6, true),
    ('J', 'standard', 7, true),
    ('K', 'standard', 8, true),
    ('L', 'standard', 9, true),
    ('M', 'standard', 10, true),
    ('N', 'standard', 11, true),
    ('O', 'standard', 12, true),
    ('P', 'standard', 13, true),
    ('Q', 'standard', 14, true),
    ('R', 'standard', 15, true),
    ('S', 'standard', 16, true),
    ('T', 'standard', 17, true),
    ('U', 'standard', 18, true),
    ('V', 'standard', 19, true),
    ('W', 'standard', 20, true),
    ('X', 'standard', 21, true),
    ('Y', 'standard', 22, true),
    ('Z', 'standard', 23, true),
    ('Fancy Yellow', 'fancy', 24, true),
    ('Fancy Pink', 'fancy', 25, true),
    ('Fancy Blue', 'fancy', 26, true),
    ('Fancy Green', 'fancy', 27, true),
    ('Fancy Orange', 'fancy', 28, true),
    ('Fancy Purple', 'fancy', 29, true),
    ('Fancy Brown', 'fancy', 30, true),
    ('Fancy Black', 'fancy', 31, true),
    ('Fancy Champagne', 'fancy', 32, true)
ON CONFLICT (name) DO NOTHING;

-- 6. Insert Diamond Clarity / Purity Options (FL to I3)
INSERT INTO diamond_clarities (name, label, display_order, is_active) VALUES
    ('FL', 'Flawless', 1, true),
    ('IF', 'Internally Flawless', 2, true),
    ('VVS1', 'Very Very Slightly Included 1', 3, true),
    ('VVS2', 'Very Very Slightly Included 2', 4, true),
    ('VS1', 'Very Slightly Included 1', 5, true),
    ('VS2', 'Very Slightly Included 2', 6, true),
    ('SI1', 'Slightly Included 1', 7, true),
    ('SI2', 'Slightly Included 2', 8, true),
    ('I1', 'Included 1', 9, true),
    ('I2', 'Included 2', 10, true),
    ('I3', 'Included 3', 11, true)
ON CONFLICT (name) DO NOTHING;

-- 7. Insert Initial Site Settings
INSERT INTO site_settings (setting_key, setting_value)
VALUES
  ('brand_name', '"Rajvi Diamonds"'::jsonb),
  ('tagline', '"The Art of Extraordinary Diamonds"'::jsonb),
  ('whatsapp_number', '"+919123456789"'::jsonb),
  ('contact_email', '"inquiry@rajvidiamonds.com"'::jsonb),
  ('phone_number', '"+919123456789"'::jsonb),
  ('instagram_url', '"https://instagram.com/rajvidiamonds"'::jsonb),
  ('business_address', '"C-108, Vrundavan Nager Soc, Near Gitanjli petrol pump, Varachha Road, Surat, Gujarat"'::jsonb),
  ('footer_text', '"Manufacturer and supplier of exceptional fancy diamond cuts. Dedicated to precision craftsmanship, rarity, and enduring trade excellence."'::jsonb),
  ('hero_heading', '"The Art of Extraordinary Diamonds"'::jsonb),
  ('hero_subtitle', '"Discover exceptional fancy diamond cuts crafted for brilliance."'::jsonb),
  ('hero_image_url', '"https://images.unsplash.com/photo-1750767323886-164156e82e62?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"'::jsonb)
ON CONFLICT (setting_key) DO UPDATE 
SET setting_value = EXCLUDED.setting_value, updated_at = timezone('utc'::text, now());
