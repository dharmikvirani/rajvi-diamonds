-- ==============================================================================
-- RAJVI DIAMONDS – INITIAL SEED DATA
-- ==============================================================================

-- 1. Insert Initial Categories
INSERT INTO categories (id, name, slug, description, image_url, is_active, display_order)
VALUES
  ('c0000000-0000-0000-0000-000000000001', 'Geometric Fancy Cuts', 'geometric-fancy-cuts', 'Architectural faceting showcasing symmetry, clean planar reflections, and historic lapidary precision.', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80', true, 1),
  ('c0000000-0000-0000-0000-000000000002', 'Botanical & Organic Cuts', 'botanical-organic-cuts', 'Nature-inspired silhouettes sculpted with petal facets and romantic vintage allure.', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80', true, 2),
  ('c0000000-0000-0000-0000-000000000003', 'Antique & Heritage Cuts', 'antique-heritage-cuts', 'Reimagined historical cuts balancing subtle dispersion with dramatic crown proportions.', 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1200&q=80', true, 3)
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Initial Diamonds
-- A. Rose Octagone
INSERT INTO diamonds (
    id, category_id, name, slug, short_description, description, shape, 
    specifications, is_featured, is_active, seo_title, seo_description, display_order
) VALUES (
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'Rose Octagone',
    'rose-octagone',
    'An eight-sided geometric rose cut featuring triangular facets rising into a serene domed crown.',
    'The Rose Octagone cut by Rajvi Diamonds represents the pinnacle of geometric fancy diamond craftsmanship. Combining the eight-sided strength of an octagon with the delicate, fire-diffusing facet structure of a rose cut, this stone produces soft, luminous scintillation that captures attention from every angle. Each facet is hand-oriented by master diamond cutters to maximize interior reflections while preserving the flat base characteristic of historic rose cuts.',
    'Octagon Rose Cut',
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
) ON CONFLICT (slug) DO NOTHING;

-- B. Tulip
INSERT INTO diamonds (
    id, category_id, name, slug, short_description, description, shape, 
    specifications, is_featured, is_active, seo_title, seo_description, display_order
) VALUES (
    'd0000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000002',
    'Tulip',
    'tulip',
    'An organic floral cut featuring graceful petal contours, sculpted for romantic brilliance and depth.',
    'The Tulip cut by Rajvi Diamonds is an exquisite testament to floral lapidary artistry. Embodying the soft elegance of blossoming flower petals, the Tulip cut combines organic curvatures with rigorous geometric symmetry to produce lively internal light refraction. Designed specifically for distinctive statement pieces, high jewellery creations, and bespoke engagement suites. Note: Size availability is configured per inquiry.',
    'Floral Tulip Cut',
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
) ON CONFLICT (slug) DO NOTHING;

-- 3. Insert Initial Sizes for Rose Octagone: 4 mm, 4.5 mm, 5 mm, 5.5 mm, 6 mm
INSERT INTO diamond_sizes (diamond_id, size_mm, is_available, display_order)
VALUES
  ('d0000000-0000-0000-0000-000000000001', 4.00, true, 1),
  ('d0000000-0000-0000-0000-000000000001', 4.50, true, 2),
  ('d0000000-0000-0000-0000-000000000001', 5.00, true, 3),
  ('d0000000-0000-0000-0000-000000000001', 5.50, true, 4),
  ('d0000000-0000-0000-0000-000000000001', 6.00, true, 5)
ON CONFLICT (diamond_id, size_mm) DO NOTHING;

-- 4. Insert Images for Rose Octagone & Tulip
INSERT INTO diamond_images (diamond_id, image_url, alt_text, is_primary, display_order)
VALUES
  ('d0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1400&q=85', 'Rajvi Diamonds Rose Octagone Cut - Primary Angle', true, 1),
  ('d0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1400&q=85', 'Rose Octagone Geometric Facet Reflections', false, 2),
  ('d0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1400&q=85', 'Rajvi Diamonds Tulip Cut Fancy Diamond - Front Face', true, 1),
  ('d0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1400&q=85', 'Tulip Diamond Floral Symmetry and Dispersion', false, 2);

-- 5. Insert Site Settings
INSERT INTO site_settings (setting_key, setting_value)
VALUES
  ('brand_name', '"Rajvi Diamonds"'::jsonb),
  ('tagline', '"The Art of Extraordinary Diamonds"'::jsonb),
  ('whatsapp_number', '"+919876543210"'::jsonb),
  ('contact_email', '"inquiry@rajvidiamonds.com"'::jsonb),
  ('phone_number', '"+91 98765 43210"'::jsonb),
  ('instagram_url', '"https://instagram.com/rajvidiamonds"'::jsonb),
  ('business_address', '"Bharat Diamond Bourse, BKC, Bandra East, Mumbai, Maharashtra 400051, India"'::jsonb),
  ('footer_text', '"Manufacturer and supplier of exceptional fancy diamond cuts. Dedicated to precision craftsmanship, rarity, and enduring trade excellence."'::jsonb),
  ('hero_heading', '"The Art of Extraordinary Diamonds"'::jsonb),
  ('hero_subtitle', '"Discover exceptional fancy diamond cuts crafted for brilliance."'::jsonb)
ON CONFLICT (setting_key) DO UPDATE 
SET setting_value = EXCLUDED.setting_value, updated_at = timezone('utc'::text, now());
