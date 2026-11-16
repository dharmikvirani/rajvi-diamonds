-- ==============================================================================
-- RAJVI DIAMONDS – COLOR & PURITY (CLARITY) ENHANCEMENT
-- Supabase PostgreSQL Migration
-- ==============================================================================

-- 1. ADD NULLABLE COLOR & CLARITY COLUMNS TO DIAMONDS & INQUIRIES TABLES
ALTER TABLE diamonds ADD COLUMN IF NOT EXISTS color TEXT;
ALTER TABLE diamonds ADD COLUMN IF NOT EXISTS clarity TEXT;

ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS selected_color TEXT;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS selected_clarity TEXT;

CREATE INDEX IF NOT EXISTS idx_diamonds_color ON diamonds(color);
CREATE INDEX IF NOT EXISTS idx_diamonds_clarity ON diamonds(clarity);

-- 2. CREATE DIAMOND COLORS MANAGEMENT TABLE
CREATE TABLE IF NOT EXISTS diamond_colors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL DEFAULT 'standard', -- 'standard' or 'fancy'
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_diamond_colors_active_order ON diamond_colors(is_active, display_order);

-- 3. CREATE DIAMOND PURITY / CLARITY MANAGEMENT TABLE
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

-- 4. ENABLE RLS POLICIES
ALTER TABLE diamond_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE diamond_clarities ENABLE ROW LEVEL SECURITY;

-- Public can read active options
CREATE POLICY "Public read active diamond colors"
    ON diamond_colors FOR SELECT
    USING (is_active = true);

CREATE POLICY "Public read active diamond clarities"
    ON diamond_clarities FOR SELECT
    USING (is_active = true);

-- Admins full access
CREATE POLICY "Admin full access to diamond colors"
    ON diamond_colors FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.auth_user_id = auth.uid()
            AND admin_users.is_active = true
        )
    );

CREATE POLICY "Admin full access to diamond clarities"
    ON diamond_clarities FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.auth_user_id = auth.uid()
            AND admin_users.is_active = true
        )
    );

-- 5. PRE-SEED STANDARD & FANCY DIAMOND COLORS
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

-- 6. PRE-SEED STANDARD DIAMOND PURITY / CLARITY GRADES
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
