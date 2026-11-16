-- ==============================================================================
-- RAJVI DIAMONDS – COMPLETE PRODUCT & SPECIFICATION SCHEMA MIGRATION
-- ==============================================================================

-- 1. Ensure columns exist on diamonds
ALTER TABLE diamonds ADD COLUMN IF NOT EXISTS product_name TEXT;
ALTER TABLE diamonds ADD COLUMN IF NOT EXISTS diamond_shape TEXT;
ALTER TABLE diamonds ADD COLUMN IF NOT EXISTS size TEXT;
ALTER TABLE diamonds ADD COLUMN IF NOT EXISTS color TEXT;
ALTER TABLE diamonds ADD COLUMN IF NOT EXISTS clarity TEXT;
ALTER TABLE diamonds ADD COLUMN IF NOT EXISTS purity TEXT;
ALTER TABLE diamonds ADD COLUMN IF NOT EXISTS price NUMERIC(12, 2);
ALTER TABLE diamonds ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- 2. Indexes
CREATE INDEX IF NOT EXISTS idx_diamonds_color ON diamonds(color);
CREATE INDEX IF NOT EXISTS idx_diamonds_clarity ON diamonds(clarity);
CREATE INDEX IF NOT EXISTS idx_diamonds_shape ON diamonds(shape);

-- 3. Field synchronization trigger
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

-- Populate existing rows
UPDATE diamonds SET 
    product_name = COALESCE(product_name, name),
    diamond_shape = COALESCE(diamond_shape, shape),
    purity = COALESCE(purity, clarity);
