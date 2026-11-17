-- ==============================================================================
-- RAJVI DIAMONDS – MULTI-VARIANT, AVAILABILITY STATUS & IMAGE VIEW TAGS
-- Supabase PostgreSQL Migration
-- ==============================================================================

-- 1. ADD MULTI-VARIANT COLUMNS TO DIAMONDS TABLE
ALTER TABLE diamonds ADD COLUMN IF NOT EXISTS available_colors TEXT[] DEFAULT '{}'::text[];
ALTER TABLE diamonds ADD COLUMN IF NOT EXISTS available_clarities TEXT[] DEFAULT '{}'::text[];
ALTER TABLE diamonds ADD COLUMN IF NOT EXISTS availability_status TEXT NOT NULL DEFAULT 'Available';
ALTER TABLE diamonds ADD COLUMN IF NOT EXISTS video_url TEXT;

-- 2. ADD VIEW TAG COLUMN TO DIAMOND_IMAGES TABLE
ALTER TABLE diamond_images ADD COLUMN IF NOT EXISTS view_tag TEXT NOT NULL DEFAULT 'general';

-- 3. INDEXES
CREATE INDEX IF NOT EXISTS idx_diamonds_availability_status ON diamonds(availability_status);
CREATE INDEX IF NOT EXISTS idx_diamond_images_view_tag ON diamond_images(view_tag);
