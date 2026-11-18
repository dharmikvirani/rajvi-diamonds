import fs from 'fs';
import path from 'path';
import { createAdminClient, createClient, isSupabaseConfigured } from './supabase';
import { deleteCloudinaryImage } from './cloudinary';
import {
  Category,
  Diamond,
  DiamondColorOption,
  DiamondClarityOption,
  DiamondImage,
  DiamondSize,
  FilterParams,
  Inquiry,
  InquiryStatus,
  SiteSettings,
  CmsSection,
  WebsiteNavigationItem,
  CmsGalleryItem,
  HeaderSettings,
  FooterSettings,
  PageCmsContent,
  SeoSettings,
} from './types';
import {
  initialCategories,
  initialDiamonds,
  initialDiamondColors,
  initialDiamondClarities,
  initialInquiries,
  initialSiteSettings,
  initialCmsSections,
  initialWebsiteNavigation,
  initialCmsGallery,
  initialHeaderSettings,
  initialFooterSettings,
  initialPageCms,
  initialSeoSettings,
} from './seedData';

// Persistent local store file for development / standalone mode
const LOCAL_STORE_PATH = path.join(process.cwd(), '.local-db.json');

export interface LocalStoreData {
  categories: Category[];
  diamonds: Diamond[];
  diamondColors: DiamondColorOption[];
  diamondClarities: DiamondClarityOption[];
  inquiries: Inquiry[];
  settings: SiteSettings;
  cmsSections: CmsSection[];
  navigation: WebsiteNavigationItem[];
  gallery: CmsGalleryItem[];
  headerSettings: HeaderSettings;
  footerSettings: FooterSettings;
  pageCms: PageCmsContent;
  seoSettings: SeoSettings;
}

function getDefaultStoreData(): LocalStoreData {
  return {
    categories: JSON.parse(JSON.stringify(initialCategories)),
    diamonds: JSON.parse(JSON.stringify(initialDiamonds)),
    diamondColors: JSON.parse(JSON.stringify(initialDiamondColors)),
    diamondClarities: JSON.parse(JSON.stringify(initialDiamondClarities)),
    inquiries: JSON.parse(JSON.stringify(initialInquiries)),
    settings: JSON.parse(JSON.stringify(initialSiteSettings)),
    cmsSections: JSON.parse(JSON.stringify(initialCmsSections)),
    navigation: JSON.parse(JSON.stringify(initialWebsiteNavigation)),
    gallery: JSON.parse(JSON.stringify(initialCmsGallery)),
    headerSettings: JSON.parse(JSON.stringify(initialHeaderSettings)),
    footerSettings: JSON.parse(JSON.stringify(initialFooterSettings)),
    pageCms: JSON.parse(JSON.stringify(initialPageCms)),
    seoSettings: JSON.parse(JSON.stringify(initialSeoSettings)),
  };
}

let inMemoryCache: LocalStoreData | null = null;

function readLocalStore(): LocalStoreData {
  if (inMemoryCache) {
    return inMemoryCache;
  }
  try {
    if (fs.existsSync(LOCAL_STORE_PATH)) {
      const content = fs.readFileSync(LOCAL_STORE_PATH, 'utf-8');
      if (content && content.trim()) {
        const parsed = JSON.parse(content);
        const store: LocalStoreData = {
          categories: Array.isArray(parsed.categories) ? parsed.categories : initialCategories,
          diamonds: Array.isArray(parsed.diamonds) ? parsed.diamonds : initialDiamonds,
          diamondColors: Array.isArray(parsed.diamondColors) ? parsed.diamondColors : initialDiamondColors,
          diamondClarities: Array.isArray(parsed.diamondClarities) ? parsed.diamondClarities : initialDiamondClarities,
          inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : initialInquiries,
          settings: { ...initialSiteSettings, ...(parsed.settings || {}) },
          cmsSections: Array.isArray(parsed.cmsSections) ? parsed.cmsSections : initialCmsSections,
          navigation: Array.isArray(parsed.navigation) ? parsed.navigation : initialWebsiteNavigation,
          gallery: Array.isArray(parsed.gallery) ? parsed.gallery : initialCmsGallery,
          headerSettings: { ...initialHeaderSettings, ...(parsed.headerSettings || {}) },
          footerSettings: { ...initialFooterSettings, ...(parsed.footerSettings || {}) },
          pageCms: { ...initialPageCms, ...(parsed.pageCms || {}) },
          seoSettings: { ...initialSeoSettings, ...(parsed.seoSettings || {}) },
        };
        inMemoryCache = store;
        return store;
      }
    }
  } catch (error) {
    console.error('Error reading .local-db.json, using fallback:', error);
    if (inMemoryCache) {
      return inMemoryCache;
    }
  }

  const defaultStore = getDefaultStoreData();
  writeLocalStore(defaultStore);
  inMemoryCache = defaultStore;
  return defaultStore;
}

function writeLocalStore(store: LocalStoreData): void {
  try {
    inMemoryCache = store;
    fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing .local-db.json:', error);
  }
}

function sortImages(images: DiamondImage[]): DiamondImage[] {
  if (!images || !Array.isArray(images)) return [];
  return [...images].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return (a.display_order ?? 0) - (b.display_order ?? 0);
  });
}

function sortSizes(sizes: DiamondSize[]): DiamondSize[] {
  if (!sizes || !Array.isArray(sizes)) return [];
  return [...sizes].sort((a, b) => (Number(a.size_mm) || 0) - (Number(b.size_mm) || 0));
}

export function formatDiamondRow(d: any): Diamond {
  if (!d) return d;
  const specs = d.specifications || {};

  // Find images: prefer relational diamond_images, fallback to JSONB
  const jsonbImages: any[] = Array.isArray(d.images) ? d.images : [];
  const relationalImages: any[] = Array.isArray(d.diamond_images) ? d.diamond_images : [];
  const baseImages = relationalImages.length > 0 ? relationalImages : jsonbImages;

  // Enrich images with view_tag if present in jsonb
  const enrichedImages = baseImages.map((img: any, idx: number) => {
    const matchingJson = jsonbImages.find(
      (j: any) => j.image_url === img.image_url || (j.id && j.id === img.id)
    );
    return {
      id: img.id || `img-${idx}`,
      diamond_id: d.id,
      image_url: img.image_url,
      cloudinary_public_id: img.cloudinary_public_id || null,
      alt_text: img.alt_text || d.name || '',
      is_primary: Boolean(img.is_primary ?? idx === 0),
      display_order: img.display_order ?? idx + 1,
      view_tag: img.view_tag || matchingJson?.view_tag || 'general',
      created_at: img.created_at || new Date().toISOString(),
    };
  });

  // Extract multiple colors
  let availableColors: string[] = [];
  if (Array.isArray(d.available_colors) && d.available_colors.length > 0) {
    availableColors = d.available_colors;
  } else if (Array.isArray(specs.available_colors) && specs.available_colors.length > 0) {
    availableColors = specs.available_colors;
  } else if (d.color && typeof d.color === 'string') {
    availableColors = d.color.includes(',')
      ? d.color.split(',').map((c: string) => c.trim()).filter(Boolean)
      : [d.color.trim()];
  }

  // Extract multiple clarities
  let availableClarities: string[] = [];
  if (Array.isArray(d.available_clarities) && d.available_clarities.length > 0) {
    availableClarities = d.available_clarities;
  } else if (Array.isArray(specs.available_clarities) && specs.available_clarities.length > 0) {
    availableClarities = specs.available_clarities;
  } else if (d.clarity && typeof d.clarity === 'string') {
    availableClarities = d.clarity.includes(',')
      ? d.clarity.split(',').map((c: string) => c.trim()).filter(Boolean)
      : [d.clarity.trim()];
  }

  const availabilityStatus =
    d.availability_status ||
    specs.availability_status ||
    (d.sizes && d.sizes.some((s: any) => s.is_available) ? 'Available' : 'Made to Order');

  const videoUrl = d.video_url || specs.video_url || null;

  return {
    ...d,
    available_colors: availableColors,
    available_clarities: availableClarities,
    availability_status: availabilityStatus,
    video_url: videoUrl,
    specifications: specs,
    images: sortImages(enrichedImages),
    sizes: sortSizes(d.sizes || []),
  };
}

// ----------------- Categories -----------------

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (!error && data && data.length > 0) {
      return data;
    }
  }
  const store = readLocalStore();
  return store.categories.filter((c) => c.is_active);
}

export async function getAllCategoriesAdmin(): Promise<Category[]> {
  const supabase = createAdminClient() || createClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (!error && data) {
      return data;
    }
  }
  const store = readLocalStore();
  return store.categories;
}

export async function saveCategory(category: Partial<Category>): Promise<Category> {
  const supabase = createAdminClient();
  const now = new Date().toISOString();

  if (supabase) {
    if (category.id) {
      const { data, error } = await supabase
        .from('categories')
        .update({
          name: category.name,
          slug: category.slug,
          description: category.description,
          image_url: category.image_url,
          is_active: category.is_active ?? true,
          display_order: category.display_order ?? 0,
          updated_at: now,
        })
        .eq('id', category.id)
        .select()
        .single();

      if (!error && data) return data;
    } else {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: category.name,
          slug: category.slug,
          description: category.description,
          image_url: category.image_url,
          is_active: category.is_active ?? true,
          display_order: category.display_order ?? 0,
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();

      if (!error && data) return data;
    }
  }

  // Local persistent fallback
  const store = readLocalStore();
  if (category.id) {
    const idx = store.categories.findIndex((c) => c.id === category.id);
    if (idx >= 0) {
      store.categories[idx] = {
        ...store.categories[idx],
        ...category,
        updated_at: now,
      } as Category;
      writeLocalStore(store);
      return store.categories[idx];
    }
  }

  const newCat: Category = {
    id: category.id || `cat-${Date.now()}`,
    name: category.name || 'New Category',
    slug: category.slug || `category-${Date.now()}`,
    description: category.description || '',
    image_url: category.image_url || '',
    is_active: category.is_active ?? true,
    display_order: category.display_order ?? store.categories.length + 1,
    created_at: now,
    updated_at: now,
  };
  store.categories.push(newCat);
  writeLocalStore(store);
  return newCat;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const supabase = createAdminClient();
  if (supabase) {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) return true;
  }
  const store = readLocalStore();
  store.categories = store.categories.filter((c) => c.id !== id);
  writeLocalStore(store);
  return true;
}

// ----------------- Diamonds -----------------

export async function getDiamonds(filters?: FilterParams): Promise<Diamond[]> {
  const supabase = createClient();
  if (supabase) {
    let query = supabase
      .from('diamonds')
      .select('*, category:categories(*), images:diamond_images(*), sizes:diamond_sizes(*)')
      .eq('is_active', true);

    if (filters?.featured) {
      query = query.eq('is_featured', true);
    }

    if (filters?.category && filters.category !== 'all') {
      query = query.eq('categories.slug', filters.category);
    }

    if (filters?.shape && filters.shape !== 'all') {
      query = query.ilike('shape', `%${filters.shape}%`);
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,short_description.ilike.%${filters.search}%`);
    }

    const { data, error } = await query.order('display_order', { ascending: true });

    if (!error && data && data.length > 0) {
      let items: Diamond[] = data.map(formatDiamondRow);

      if (filters?.color && filters.color !== 'all') {
        const qColor = filters.color.toLowerCase();
        items = items.filter(
          (d) =>
            d.color?.toLowerCase() === qColor ||
            d.available_colors?.some((c) => c.toLowerCase() === qColor)
        );
      }

      if (filters?.clarity && filters.clarity !== 'all') {
        const qClarity = filters.clarity.toLowerCase();
        items = items.filter(
          (d) =>
            d.clarity?.toLowerCase() === qClarity ||
            d.available_clarities?.some((c) => c.toLowerCase() === qClarity)
        );
      }

      if (filters?.availability && filters.availability !== 'all') {
        const qAvail = filters.availability.toLowerCase();
        items = items.filter((d) => d.availability_status?.toLowerCase() === qAvail);
      }

      if (filters?.size && filters.size !== 'all') {
        const targetSize = parseFloat(filters.size);
        items = items.filter((d) =>
          d.sizes.some((s) => s.is_available && Math.abs(s.size_mm - targetSize) < 0.01)
        );
      }

      if (filters?.sort === 'name-asc') {
        items.sort((a, b) => a.name.localeCompare(b.name));
      } else if (filters?.sort === 'name-desc') {
        items.sort((a, b) => b.name.localeCompare(a.name));
      }

      return items;
    }
  }

  // Local persistent fallback filtering
  const store = readLocalStore();
  let results = store.diamonds.filter((d) => d.is_active).map(formatDiamondRow);

  if (filters?.featured) {
    results = results.filter((d) => d.is_featured);
  }

  if (filters?.category && filters.category !== 'all') {
    results = results.filter((d) => {
      const cat = store.categories.find((c) => c.id === d.category_id);
      return cat?.slug === filters.category;
    });
  }

  if (filters?.shape && filters.shape !== 'all') {
    results = results.filter((d) => d.shape.toLowerCase().includes(filters.shape!.toLowerCase()));
  }

  if (filters?.color && filters.color !== 'all') {
    const qColor = filters.color.toLowerCase();
    results = results.filter(
      (d) =>
        d.color?.toLowerCase() === qColor ||
        d.available_colors?.some((c) => c.toLowerCase() === qColor)
    );
  }

  if (filters?.clarity && filters.clarity !== 'all') {
    const qClarity = filters.clarity.toLowerCase();
    results = results.filter(
      (d) =>
        d.clarity?.toLowerCase() === qClarity ||
        d.available_clarities?.some((c) => c.toLowerCase() === qClarity)
    );
  }

  if (filters?.availability && filters.availability !== 'all') {
    const qAvail = filters.availability.toLowerCase();
    results = results.filter((d) => d.availability_status?.toLowerCase() === qAvail);
  }

  if (filters?.size && filters.size !== 'all') {
    const targetSize = parseFloat(filters.size);
    results = results.filter((d) =>
      d.sizes.some((s) => s.is_available && Math.abs(s.size_mm - targetSize) < 0.01)
    );
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase().trim();
    results = results.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.short_description.toLowerCase().includes(q) ||
        d.shape.toLowerCase().includes(q)
    );
  }

  if (filters?.sort === 'name-asc') {
    results.sort((a, b) => a.name.localeCompare(b.name));
  } else if (filters?.sort === 'name-desc') {
    results.sort((a, b) => b.name.localeCompare(a.name));
  } else {
    results.sort((a, b) => a.display_order - b.display_order);
  }

  return results.map((d) => ({
    ...d,
    category: store.categories.find((c) => c.id === d.category_id),
  }));
}

export async function getAllDiamondsAdmin(): Promise<Diamond[]> {
  const supabase = createAdminClient() || createClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('diamonds')
      .select('*, category:categories(*), images:diamond_images(*), sizes:diamond_sizes(*)')
      .order('display_order', { ascending: true });

    if (!error && data) {
      return data.map(formatDiamondRow) as Diamond[];
    }
  }
  const store = readLocalStore();
  return store.diamonds.map((d) => ({
    ...formatDiamondRow(d),
    category: store.categories.find((c) => c.id === d.category_id),
  }));
}

export async function getDiamondBySlug(slug: string): Promise<Diamond | null> {
  const supabase = createClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('diamonds')
      .select('*, category:categories(*), images:diamond_images(*), sizes:diamond_sizes(*)')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (!error && data) {
      return formatDiamondRow(data);
    }
  }

  const store = readLocalStore();
  const diamond = store.diamonds.find((d) => d.slug === slug && d.is_active);
  if (!diamond) return null;

  return {
    ...formatDiamondRow(diamond),
    category: store.categories.find((c) => c.id === diamond.category_id),
  };
}

export async function getDiamondByIdAdmin(id: string): Promise<Diamond | null> {
  const supabase = createAdminClient() || createClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('diamonds')
      .select('*, category:categories(*), images:diamond_images(*), sizes:diamond_sizes(*)')
      .eq('id', id)
      .single();

    if (!error && data) {
      return formatDiamondRow(data);
    }
  }

  const store = readLocalStore();
  const diamond = store.diamonds.find((d) => d.id === id);
  if (!diamond) return null;

  return {
    ...formatDiamondRow(diamond),
    category: store.categories.find((c) => c.id === diamond.category_id),
  };
}

export async function saveDiamond(diamondData: Partial<Diamond>): Promise<Diamond> {
  const supabase = createAdminClient();
  const now = new Date().toISOString();

  // Merge specifications with multi-variant options
  const mergedSpecs = {
    ...(diamondData.specifications || {}),
    available_colors:
      diamondData.available_colors ||
      diamondData.specifications?.available_colors ||
      (diamondData.color ? [diamondData.color] : []),
    available_clarities:
      diamondData.available_clarities ||
      diamondData.specifications?.available_clarities ||
      (diamondData.clarity ? [diamondData.clarity] : []),
    availability_status:
      diamondData.availability_status ||
      diamondData.specifications?.availability_status ||
      'Available',
    video_url: diamondData.video_url || diamondData.specifications?.video_url || null,
  };

  const primaryColor =
    diamondData.color ||
    (mergedSpecs.available_colors && mergedSpecs.available_colors[0]) ||
    null;
  const primaryClarity =
    diamondData.clarity ||
    (mergedSpecs.available_clarities && mergedSpecs.available_clarities[0]) ||
    null;

  if (supabase) {
    let savedId = diamondData.id;

    // 1. Upsert diamonds record in Supabase
    if (diamondData.id) {
      const { data, error } = await supabase
        .from('diamonds')
        .update({
          category_id: diamondData.category_id || null,
          name: diamondData.name,
          product_name: diamondData.name,
          slug: diamondData.slug,
          short_description: diamondData.short_description || '',
          description: diamondData.description || '',
          shape: diamondData.shape,
          diamond_shape: diamondData.shape,
          color: primaryColor,
          clarity: primaryClarity,
          purity: primaryClarity,
          specifications: mergedSpecs,
          is_featured: diamondData.is_featured ?? false,
          is_active: diamondData.is_active ?? true,
          seo_title: diamondData.seo_title,
          seo_description: diamondData.seo_description,
          display_order: diamondData.display_order ?? 0,
          images: Array.isArray(diamondData.images) ? diamondData.images : [],
          updated_at: now,
        })
        .eq('id', diamondData.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating diamond in Supabase:', error);
        throw new Error(error.message);
      }
      if (data) savedId = data.id;
    } else {
      const { data, error } = await supabase
        .from('diamonds')
        .insert({
          category_id: diamondData.category_id || null,
          name: diamondData.name || 'New Diamond Cut',
          product_name: diamondData.name || 'New Diamond Cut',
          slug: diamondData.slug || `cut-${Date.now()}`,
          short_description: diamondData.short_description || '',
          description: diamondData.description || '',
          shape: diamondData.shape || 'Fancy Cut',
          diamond_shape: diamondData.shape || 'Fancy Cut',
          color: primaryColor,
          clarity: primaryClarity,
          purity: primaryClarity,
          specifications: mergedSpecs,
          is_featured: diamondData.is_featured ?? false,
          is_active: diamondData.is_active ?? true,
          seo_title: diamondData.seo_title || '',
          seo_description: diamondData.seo_description || '',
          display_order: diamondData.display_order ?? 0,
          images: Array.isArray(diamondData.images) ? diamondData.images : [],
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();

      if (error) {
        console.error('Error inserting diamond in Supabase:', error);
        throw new Error(error.message);
      }
      if (data) savedId = data.id;
    }

    // 2. Synchronize diamond_images in Supabase
    if (savedId && Array.isArray(diamondData.images)) {
      // Find old images to track replaced Cloudinary public IDs
      const { data: existingImages } = await supabase
        .from('diamond_images')
        .select('cloudinary_public_id')
        .eq('diamond_id', savedId);

      const oldPublicIds = new Set(
        (existingImages || [])
          .map((img: any) => img.cloudinary_public_id)
          .filter(Boolean)
      );

      const newPublicIds = new Set(
        diamondData.images
          .map((img) => img.cloudinary_public_id)
          .filter(Boolean)
      );

      // Delete existing rows for this diamond in Supabase
      await supabase.from('diamond_images').delete().eq('diamond_id', savedId);

      // Insert fresh image rows
      if (diamondData.images.length > 0) {
        const imageRows = diamondData.images.map((img, idx) => ({
          diamond_id: savedId,
          image_url: img.image_url,
          cloudinary_public_id: img.cloudinary_public_id || null,
          alt_text: img.alt_text || diamondData.name || '',
          is_primary: idx === 0 ? true : Boolean(img.is_primary),
          display_order: img.display_order ?? idx + 1,
          created_at: now,
        }));

        const { error: insertImgErr } = await supabase.from('diamond_images').insert(imageRows);
        if (insertImgErr) {
          console.error('Error inserting diamond_images:', insertImgErr);
        }
      }

      // Safe cleanup of replaced Cloudinary images (only AFTER new records are saved)
      Array.from(oldPublicIds).forEach((oldId) => {
        if (!newPublicIds.has(oldId)) {
          deleteCloudinaryImage(oldId).catch((e) =>
            console.error('Cloudinary cleanup error for replaced image:', e)
          );
        }
      });
    }

    // 3. Synchronize diamond_sizes in Supabase
    if (savedId && Array.isArray(diamondData.sizes)) {
      await supabase.from('diamond_sizes').delete().eq('diamond_id', savedId);

      if (diamondData.sizes.length > 0) {
        const sizeRows = diamondData.sizes.map((s, idx) => ({
          diamond_id: savedId,
          size_mm: Number(s.size_mm),
          is_available: s.is_available ?? true,
          display_order: s.display_order ?? idx + 1,
          created_at: now,
          updated_at: now,
        }));

        const { error: sizeErr } = await supabase.from('diamond_sizes').insert(sizeRows);
        if (sizeErr) {
          console.error('Error inserting diamond_sizes:', sizeErr);
        }
      }
    }

    // 4. Fetch the complete updated diamond with all relations
    const { data: fullDiamond, error: fetchErr } = await supabase
      .from('diamonds')
      .select('*, category:categories(*), images:diamond_images(*), sizes:diamond_sizes(*)')
      .eq('id', savedId)
      .single();

    if (!fetchErr && fullDiamond) {
      const formatted: Diamond = formatDiamondRow(fullDiamond);

      // Also sync to local store cache
      const store = readLocalStore();
      const localIdx = store.diamonds.findIndex((d) => d.id === savedId);
      if (localIdx >= 0) {
        store.diamonds[localIdx] = formatted;
      } else {
        store.diamonds.push(formatted);
      }
      writeLocalStore(store);

      return formatted;
    }
  }

  // Local persistent fallback
  const store = readLocalStore();
  if (diamondData.id) {
    const idx = store.diamonds.findIndex((d) => d.id === diamondData.id);
    if (idx >= 0) {
      store.diamonds[idx] = {
        ...store.diamonds[idx],
        ...diamondData,
        images: sortImages(diamondData.images || store.diamonds[idx].images || []),
        sizes: sortSizes(diamondData.sizes || store.diamonds[idx].sizes || []),
        updated_at: now,
      } as Diamond;
      writeLocalStore(store);
      return store.diamonds[idx];
    }
  }

  const newDiamond: Diamond = {
    id: diamondData.id || `diamond-${Date.now()}`,
    category_id: diamondData.category_id || null,
    name: diamondData.name || 'New Diamond Cut',
    slug: diamondData.slug || `cut-${Date.now()}`,
    short_description: diamondData.short_description || '',
    description: diamondData.description || '',
    shape: diamondData.shape || 'Fancy Cut',
    color: diamondData.color ?? null,
    clarity: diamondData.clarity ?? null,
    specifications: diamondData.specifications || {},
    is_featured: diamondData.is_featured ?? false,
    is_active: diamondData.is_active ?? true,
    seo_title: diamondData.seo_title || '',
    seo_description: diamondData.seo_description || '',
    display_order: diamondData.display_order ?? store.diamonds.length + 1,
    images: sortImages(diamondData.images || []),
    sizes: sortSizes(diamondData.sizes || []),
    created_at: now,
    updated_at: now,
  };
  store.diamonds.push(newDiamond);
  writeLocalStore(store);
  return newDiamond;
}

export async function deleteDiamond(id: string): Promise<boolean> {
  const supabase = createAdminClient();
  if (supabase) {
    // 1. Fetch any images with cloudinary_public_id to clean up
    const { data: images } = await supabase
      .from('diamond_images')
      .select('cloudinary_public_id')
      .eq('diamond_id', id);

    if (images && images.length > 0) {
      for (const img of images) {
        if (img.cloudinary_public_id) {
          deleteCloudinaryImage(img.cloudinary_public_id).catch((e) =>
            console.error('Cloudinary delete error on diamond delete:', e)
          );
        }
      }
    }

    // 2. Delete diamond from Supabase (cascades to diamond_images and diamond_sizes)
    const { error } = await supabase.from('diamonds').delete().eq('id', id);
    if (error) {
      console.error('Error deleting diamond from Supabase:', error);
    }
  }

  const store = readLocalStore();
  store.diamonds = store.diamonds.filter((d) => d.id !== id);
  writeLocalStore(store);
  return true;
}

// ----------------- Diamond Sizes -----------------

export async function saveDiamondSize(
  diamondId: string,
  sizeData: { id?: string; size_mm: number; is_available: boolean; display_order?: number }
): Promise<DiamondSize> {
  const now = new Date().toISOString();
  const supabase = createAdminClient();

  if (supabase) {
    if (sizeData.id) {
      const { data, error } = await supabase
        .from('diamond_sizes')
        .update({
          size_mm: sizeData.size_mm,
          is_available: sizeData.is_available,
          display_order: sizeData.display_order ?? 0,
          updated_at: now,
        })
        .eq('id', sizeData.id)
        .select()
        .single();
      if (!error && data) return data;
    } else {
      const { data, error } = await supabase
        .from('diamond_sizes')
        .insert({
          diamond_id: diamondId,
          size_mm: sizeData.size_mm,
          is_available: sizeData.is_available,
          display_order: sizeData.display_order ?? 0,
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();
      if (!error && data) return data;
    }
  }

  // Local persistent fallback
  const store = readLocalStore();
  const diamond = store.diamonds.find((d) => d.id === diamondId);
  if (!diamond) throw new Error('Diamond not found');
  if (!diamond.sizes) diamond.sizes = [];

  if (sizeData.id) {
    const idx = diamond.sizes.findIndex((s) => s.id === sizeData.id);
    if (idx >= 0) {
      diamond.sizes[idx] = {
        ...diamond.sizes[idx],
        size_mm: Number(sizeData.size_mm),
        is_available: sizeData.is_available,
        display_order: sizeData.display_order ?? diamond.sizes[idx].display_order,
        updated_at: now,
      };
      writeLocalStore(store);
      return diamond.sizes[idx];
    }
  }

  // Check duplicate size
  const exists = diamond.sizes.some((s) => Math.abs(s.size_mm - Number(sizeData.size_mm)) < 0.001);
  if (exists) {
    throw new Error(`Size ${sizeData.size_mm} mm already exists for this diamond cut.`);
  }

  const newSize: DiamondSize = {
    id: sizeData.id || `size-${Date.now()}`,
    diamond_id: diamondId,
    size_mm: Number(sizeData.size_mm),
    is_available: sizeData.is_available,
    display_order: sizeData.display_order ?? diamond.sizes.length + 1,
    created_at: now,
    updated_at: now,
  };
  diamond.sizes.push(newSize);
  writeLocalStore(store);
  return newSize;
}

export async function deleteDiamondSize(diamondId: string, sizeId: string): Promise<boolean> {
  const supabase = createAdminClient();
  if (supabase) {
    const { error } = await supabase.from('diamond_sizes').delete().eq('id', sizeId);
    if (!error) return true;
  }
  const store = readLocalStore();
  const diamond = store.diamonds.find((d) => d.id === diamondId);
  if (diamond && diamond.sizes) {
    diamond.sizes = diamond.sizes.filter((s) => s.id !== sizeId);
    writeLocalStore(store);
  }
  return true;
}

// ----------------- Inquiries -----------------

export async function submitInquiry(data: {
  full_name: string;
  email: string;
  phone: string;
  company_name?: string | null;
  inquiry_type: string;
  diamond_id?: string | null;
  diamond_name?: string;
  selected_size?: string | null;
  selected_color?: string | null;
  selected_clarity?: string | null;
  message: string;
}): Promise<Inquiry> {
  const now = new Date().toISOString();
  const supabase = createAdminClient() || createClient();

  if (supabase) {
    const { data: inserted, error } = await supabase
      .from('inquiries')
      .insert({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        company_name: data.company_name || null,
        inquiry_type: data.inquiry_type,
        diamond_id: data.diamond_id || null,
        selected_size: data.selected_size || null,
        selected_color: data.selected_color || null,
        selected_clarity: data.selected_clarity || null,
        message: data.message,
        status: 'New',
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (!error && inserted) {
      return inserted as Inquiry;
    }
  }

  const store = readLocalStore();
  const newInq: Inquiry = {
    id: `inq-${Date.now()}`,
    full_name: data.full_name,
    email: data.email,
    phone: data.phone,
    company_name: data.company_name,
    inquiry_type: data.inquiry_type as any,
    diamond_id: data.diamond_id,
    diamond_name: data.diamond_name,
    selected_size: data.selected_size,
    selected_color: data.selected_color,
    selected_clarity: data.selected_clarity,
    message: data.message,
    status: 'New',
    internal_notes: null,
    created_at: now,
    updated_at: now,
  };
  store.inquiries.unshift(newInq);
  writeLocalStore(store);
  return newInq;
}

export async function getInquiriesAdmin(filters?: {
  status?: string;
  type?: string;
  search?: string;
}): Promise<Inquiry[]> {
  const supabase = createAdminClient();
  if (supabase) {
    let query = supabase.from('inquiries').select('*, diamonds(name)').order('created_at', { ascending: false });

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    if (filters?.type && filters.type !== 'all') {
      query = query.eq('inquiry_type', filters.type);
    }

    const { data, error } = await query;
    if (!error && data) {
      return data.map((item: any) => ({
        ...item,
        diamond_name: item.diamonds?.name || item.diamond_name,
      })) as Inquiry[];
    }
  }

  const store = readLocalStore();
  let list = [...store.inquiries];
  if (filters?.status && filters.status !== 'all') {
    list = list.filter((i) => i.status === filters.status);
  }
  if (filters?.type && filters.type !== 'all') {
    list = list.filter((i) => i.inquiry_type === filters.type);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (i) =>
        i.full_name.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        i.phone.toLowerCase().includes(q) ||
        (i.company_name && i.company_name.toLowerCase().includes(q)) ||
        i.message.toLowerCase().includes(q)
    );
  }

  return list;
}

export async function updateInquiryStatus(
  id: string,
  status: InquiryStatus,
  internalNotes?: string | null
): Promise<Inquiry> {
  const now = new Date().toISOString();
  const supabase = createAdminClient();

  if (supabase) {
    // Map to valid PostgreSQL check constraint: 'New' | 'Contacted' | 'In Progress' | 'Resolved' | 'Archived'
    let dbStatus: string = status;
    if (status === 'Converted') dbStatus = 'Resolved';
    else if (status === 'Closed') dbStatus = 'Archived';

    const updatePayload: any = { status: dbStatus, updated_at: now };
    if (internalNotes !== undefined) {
      updatePayload.internal_notes = internalNotes;
    }

    const { data, error } = await supabase
      .from('inquiries')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) return data as Inquiry;
    if (error) {
      console.error('Error updating inquiry status in Supabase:', error);
    }
  }

  const store = readLocalStore();
  const idx = store.inquiries.findIndex((i) => i.id === id);
  if (idx >= 0) {
    store.inquiries[idx] = {
      ...store.inquiries[idx],
      status,
      internal_notes: internalNotes !== undefined ? internalNotes : store.inquiries[idx].internal_notes,
      updated_at: now,
    };
    writeLocalStore(store);
    return store.inquiries[idx];
  }

  throw new Error('Inquiry not found');
}

export async function deleteInquiry(id: string): Promise<boolean> {
  const supabase = createAdminClient();
  if (supabase) {
    const { error } = await supabase.from('inquiries').delete().eq('id', id);
    if (error) {
      console.error('Error deleting inquiry from Supabase:', error);
    }
  }

  const store = readLocalStore();
  store.inquiries = store.inquiries.filter((i) => i.id !== id);
  writeLocalStore(store);
  return true;
}

// ----------------- Site Settings -----------------

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createClient();
  if (supabase) {
    const { data, error } = await supabase.from('site_settings').select('*');
    if (!error && data && data.length > 0) {
      const store = readLocalStore();
      const settingsMap: any = { ...store.settings };
      data.forEach((row: { setting_key: string; setting_value: any }) => {
        settingsMap[row.setting_key] = row.setting_value;
      });
      return settingsMap as SiteSettings;
    }
  }
  const store = readLocalStore();
  return store.settings;
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const supabase = createAdminClient();
  const now = new Date().toISOString();

  if (supabase) {
    const entries = Object.entries(settings);
    for (const [key, value] of entries) {
      await supabase
        .from('site_settings')
        .upsert(
          {
            setting_key: key,
            setting_value: value,
            updated_at: now,
          },
          { onConflict: 'setting_key' }
        );
    }
  }

  const store = readLocalStore();
  store.settings = { ...store.settings, ...settings };
  writeLocalStore(store);
  return store.settings;
}

// ----------------- Dashboard Stats -----------------

export async function getDashboardStats() {
  const [categories, diamonds, inquiries] = await Promise.all([
    getAllCategoriesAdmin(),
    getAllDiamondsAdmin(),
    getInquiriesAdmin(),
  ]);

  const activeDiamonds = diamonds.filter((d) => d.is_active).length;
  const inactiveDiamonds = diamonds.length - activeDiamonds;
  const featuredDiamonds = diamonds.filter((d) => d.is_featured).length;

  const newInquiries = inquiries.filter((i) => i.status === 'New').length;
  const contactedInquiries = inquiries.filter(
    (i) => i.status === 'Contacted' || i.status === 'In Progress'
  ).length;
  const convertedInquiries = inquiries.filter(
    (i) => i.status === 'Converted' || i.status === 'Resolved'
  ).length;

  return {
    totalDiamonds: diamonds.length,
    activeDiamonds,
    inactiveDiamonds,
    featuredDiamonds,
    totalCategories: categories.length,
    totalInquiries: inquiries.length,
    newInquiries,
    contactedInquiries,
    convertedInquiries,
    recentInquiries: inquiries.slice(0, 5),
  };
}

// ----------------- Diamond Colors -----------------

export async function getDiamondColors(): Promise<DiamondColorOption[]> {
  const supabase = createClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('diamond_colors')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (!error && data && data.length > 0) {
      return data;
    }
  }
  const store = readLocalStore();
  return store.diamondColors.filter((c) => c.is_active);
}

export async function getAllDiamondColorsAdmin(): Promise<DiamondColorOption[]> {
  const supabase = createAdminClient() || createClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('diamond_colors')
      .select('*')
      .order('display_order', { ascending: true });

    if (!error && data) {
      return data;
    }
  }
  const store = readLocalStore();
  return store.diamondColors;
}

export async function saveDiamondColor(colorData: Partial<DiamondColorOption>): Promise<DiamondColorOption> {
  const supabase = createAdminClient();
  const now = new Date().toISOString();

  if (supabase) {
    if (colorData.id) {
      const { data, error } = await supabase
        .from('diamond_colors')
        .update({
          name: colorData.name,
          category: colorData.category || 'standard',
          display_order: colorData.display_order ?? 0,
          is_active: colorData.is_active ?? true,
          updated_at: now,
        })
        .eq('id', colorData.id)
        .select()
        .single();

      if (!error && data) return data;
    } else {
      const { data, error } = await supabase
        .from('diamond_colors')
        .insert({
          name: colorData.name,
          category: colorData.category || 'standard',
          display_order: colorData.display_order ?? 0,
          is_active: colorData.is_active ?? true,
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();

      if (!error && data) return data;
    }
  }

  // Local persistent fallback
  const store = readLocalStore();
  if (colorData.id) {
    const idx = store.diamondColors.findIndex((c) => c.id === colorData.id);
    if (idx >= 0) {
      store.diamondColors[idx] = {
        ...store.diamondColors[idx],
        ...colorData,
        updated_at: now,
      } as DiamondColorOption;
      writeLocalStore(store);
      return store.diamondColors[idx];
    }
  }

  const newColor: DiamondColorOption = {
    id: colorData.id || `col-${Date.now()}`,
    name: colorData.name || 'New Color',
    category: colorData.category || 'standard',
    display_order: colorData.display_order ?? store.diamondColors.length + 1,
    is_active: colorData.is_active ?? true,
    created_at: now,
    updated_at: now,
  };
  store.diamondColors.push(newColor);
  writeLocalStore(store);
  return newColor;
}

export async function deleteDiamondColor(id: string): Promise<boolean> {
  const supabase = createAdminClient();
  if (supabase) {
    const { error } = await supabase.from('diamond_colors').delete().eq('id', id);
    if (!error) return true;
  }
  const store = readLocalStore();
  store.diamondColors = store.diamondColors.filter((c) => c.id !== id);
  writeLocalStore(store);
  return true;
}

// ----------------- Diamond Clarities -----------------

export async function getDiamondClarities(): Promise<DiamondClarityOption[]> {
  const supabase = createClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('diamond_clarities')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (!error && data && data.length > 0) {
      return data;
    }
  }
  const store = readLocalStore();
  return store.diamondClarities.filter((c) => c.is_active);
}

export async function getAllDiamondClaritiesAdmin(): Promise<DiamondClarityOption[]> {
  const supabase = createAdminClient() || createClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('diamond_clarities')
      .select('*')
      .order('display_order', { ascending: true });

    if (!error && data) {
      return data;
    }
  }
  const store = readLocalStore();
  return store.diamondClarities;
}

export async function saveDiamondClarity(clarityData: Partial<DiamondClarityOption>): Promise<DiamondClarityOption> {
  const supabase = createAdminClient();
  const now = new Date().toISOString();

  if (supabase) {
    if (clarityData.id) {
      const { data, error } = await supabase
        .from('diamond_clarities')
        .update({
          name: clarityData.name,
          label: clarityData.label || clarityData.name,
          display_order: clarityData.display_order ?? 0,
          is_active: clarityData.is_active ?? true,
          updated_at: now,
        })
        .eq('id', clarityData.id)
        .select()
        .single();

      if (!error && data) return data;
    } else {
      const { data, error } = await supabase
        .from('diamond_clarities')
        .insert({
          name: clarityData.name,
          label: clarityData.label || clarityData.name,
          display_order: clarityData.display_order ?? 0,
          is_active: clarityData.is_active ?? true,
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();

      if (!error && data) return data;
    }
  }

  // Local persistent fallback
  const store = readLocalStore();
  if (clarityData.id) {
    const idx = store.diamondClarities.findIndex((c) => c.id === clarityData.id);
    if (idx >= 0) {
      store.diamondClarities[idx] = {
        ...store.diamondClarities[idx],
        ...clarityData,
        updated_at: now,
      } as DiamondClarityOption;
      writeLocalStore(store);
      return store.diamondClarities[idx];
    }
  }

  const newClarity: DiamondClarityOption = {
    id: clarityData.id || `clr-${Date.now()}`,
    name: clarityData.name || 'New Clarity',
    label: clarityData.label || clarityData.name || 'New Clarity',
    display_order: clarityData.display_order ?? store.diamondClarities.length + 1,
    is_active: clarityData.is_active ?? true,
    created_at: now,
    updated_at: now,
  };
  store.diamondClarities.push(newClarity);
  writeLocalStore(store);
  return newClarity;
}

export async function deleteDiamondClarity(id: string): Promise<boolean> {
  const supabase = createAdminClient();
  if (supabase) {
    const { error } = await supabase.from('diamond_clarities').delete().eq('id', id);
    if (!error) return true;
  }
  const store = readLocalStore();
  store.diamondClarities = store.diamondClarities.filter((c) => c.id !== id);
  writeLocalStore(store);
  return true;
}

// ==============================================================================
// COMPLETE DYNAMIC WEBSITE CMS DATA LAYER
// ==============================================================================

// Helper to persist CMS setting in Supabase
async function persistCmsSetting(key: string, value: any): Promise<void> {
  const supabase = createAdminClient();
  if (supabase) {
    await supabase
      .from('site_settings')
      .upsert(
        {
          setting_key: key,
          setting_value: value,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'setting_key' }
      );
  }
}

// ----------------- 1. Homepage & Page CMS Sections -----------------

export async function getCmsSections(
  pageSlug: string = 'home',
  includeDrafts: boolean = false
): Promise<CmsSection[]> {
  let sections: CmsSection[] = [];
  const supabase = createClient();

  if (supabase) {
    const { data } = await supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_key', 'cms_sections')
      .single();

    if (data && Array.isArray(data.setting_value)) {
      sections = data.setting_value;
    }
  }

  if (!sections || sections.length === 0) {
    const store = readLocalStore();
    sections = store.cmsSections || initialCmsSections;
  }

  // Filter by page_slug
  let filtered = sections.filter((s) => (s.page_slug || 'home') === pageSlug);

  // If public view, only return active sections and published content
  if (!includeDrafts) {
    filtered = filtered.filter((s) => s.is_active);
    // Return clean published fields without draft overrides
    return filtered
      .map((s) => {
        const { draft_data, ...published } = s;
        return published as CmsSection;
      })
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
  }

  // If draft/admin view, apply draft_data overrides where present
  return filtered
    .map((s) => {
      if (s.has_draft && s.draft_data) {
        return {
          ...s,
          ...s.draft_data,
          has_draft: true,
          draft_data: s.draft_data,
        };
      }
      return s;
    })
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
}

export async function getCmsSectionByKey(
  sectionKey: string,
  includeDrafts: boolean = false
): Promise<CmsSection | null> {
  const sections = await getCmsSections('home', includeDrafts);
  return sections.find((s) => s.section_key === sectionKey) || null;
}

export async function saveCmsSectionDraft(
  sectionKey: string,
  draftData: Partial<CmsSection>
): Promise<CmsSection> {
  const supabase = createAdminClient();
  let sections: CmsSection[] = [];

  if (supabase) {
    const { data } = await supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_key', 'cms_sections')
      .single();

    if (data && Array.isArray(data.setting_value)) {
      sections = data.setting_value;
    }
  }

  if (!sections || sections.length === 0) {
    const store = readLocalStore();
    sections = store.cmsSections || initialCmsSections;
  }

  const now = new Date().toISOString();

  // Find or create section
  let idx = sections.findIndex((s) => s.section_key === sectionKey);
  if (idx === -1) {
    const initialSec = initialCmsSections.find((s) => s.section_key === sectionKey);
    if (initialSec) {
      sections.push(JSON.parse(JSON.stringify(initialSec)));
      idx = sections.length - 1;
    } else {
      throw new Error(`Section with key "${sectionKey}" not found.`);
    }
  }

  const existing = sections[idx];
  const mergedDraft = {
    ...(existing.draft_data || {}),
    ...draftData,
  };

  sections[idx] = {
    ...existing,
    draft_data: mergedDraft,
    has_draft: true,
    updated_at: now,
  };

  const store = readLocalStore();
  store.cmsSections = sections;
  writeLocalStore(store);
  await persistCmsSetting('cms_sections', sections);

  return sections[idx];
}

export async function publishCmsSection(sectionKey: string): Promise<CmsSection> {
  const supabase = createAdminClient();
  let sections: CmsSection[] = [];

  if (supabase) {
    const { data } = await supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_key', 'cms_sections')
      .single();

    if (data && Array.isArray(data.setting_value)) {
      sections = data.setting_value;
    }
  }

  if (!sections || sections.length === 0) {
    const store = readLocalStore();
    sections = store.cmsSections || initialCmsSections;
  }

  const now = new Date().toISOString();
  const idx = sections.findIndex((s) => s.section_key === sectionKey);
  if (idx === -1) {
    throw new Error(`Section with key "${sectionKey}" not found.`);
  }

  const sec = sections[idx];
  const draft = sec.draft_data || {};

  // Promote draft to published
  sections[idx] = {
    ...sec,
    ...draft,
    draft_data: null,
    has_draft: false,
    published_at: now,
    updated_at: now,
  };

  const store = readLocalStore();
  store.cmsSections = sections;
  writeLocalStore(store);
  await persistCmsSetting('cms_sections', sections);

  return sections[idx];
}

export async function reorderCmsSections(orderedKeys: string[]): Promise<boolean> {
  const supabase = createAdminClient();
  let sections: CmsSection[] = [];

  if (supabase) {
    const { data } = await supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_key', 'cms_sections')
      .single();

    if (data && Array.isArray(data.setting_value)) {
      sections = data.setting_value;
    }
  }

  if (!sections || sections.length === 0) {
    const store = readLocalStore();
    sections = store.cmsSections || initialCmsSections;
  }

  const now = new Date().toISOString();
  sections = sections.map((sec) => {
    const newIdx = orderedKeys.indexOf(sec.section_key);
    if (newIdx !== -1) {
      return {
        ...sec,
        display_order: newIdx + 1,
        updated_at: now,
      };
    }
    return sec;
  });

  const store = readLocalStore();
  store.cmsSections = sections;
  writeLocalStore(store);
  await persistCmsSetting('cms_sections', sections);
  return true;
}

export async function toggleCmsSectionVisibility(
  sectionKey: string,
  isActive: boolean
): Promise<boolean> {
  const supabase = createAdminClient();
  let sections: CmsSection[] = [];

  if (supabase) {
    const { data } = await supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_key', 'cms_sections')
      .single();

    if (data && Array.isArray(data.setting_value)) {
      sections = data.setting_value;
    }
  }

  if (!sections || sections.length === 0) {
    const store = readLocalStore();
    sections = store.cmsSections || initialCmsSections;
  }

  const now = new Date().toISOString();
  const idx = sections.findIndex((s) => s.section_key === sectionKey);
  if (idx !== -1) {
    sections[idx] = {
      ...sections[idx],
      is_active: isActive,
      updated_at: now,
    };
    const store = readLocalStore();
    store.cmsSections = sections;
    writeLocalStore(store);
    await persistCmsSetting('cms_sections', sections);
    return true;
  }
  return false;
}

// ----------------- 2. Website Navigation (Header & Footers) -----------------

export async function getWebsiteNavigation(
  menuLocation?: 'header' | 'footer_collections' | 'footer_navigation'
): Promise<WebsiteNavigationItem[]> {
  let nav: WebsiteNavigationItem[] = [];
  const supabase = createClient();

  if (supabase) {
    const { data } = await supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_key', 'website_navigation')
      .single();

    if (data && Array.isArray(data.setting_value)) {
      nav = data.setting_value;
    }
  }

  if (!nav || nav.length === 0) {
    const store = readLocalStore();
    nav = store.navigation || initialWebsiteNavigation;
  }

  if (menuLocation) {
    nav = nav.filter((n) => n.menu_location === menuLocation);
  }

  return nav
    .filter((n) => n.is_active)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
}

export async function getAllWebsiteNavigationAdmin(): Promise<WebsiteNavigationItem[]> {
  let nav: WebsiteNavigationItem[] = [];
  const supabase = createClient();

  if (supabase) {
    const { data } = await supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_key', 'website_navigation')
      .single();

    if (data && Array.isArray(data.setting_value)) {
      nav = data.setting_value;
    }
  }

  if (!nav || nav.length === 0) {
    const store = readLocalStore();
    nav = store.navigation || initialWebsiteNavigation;
  }

  return nav.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
}

export async function saveWebsiteNavigationItem(
  item: Partial<WebsiteNavigationItem>
): Promise<WebsiteNavigationItem> {
  const store = readLocalStore();
  const id = item.id || `nav-${Date.now()}`;

  const idx = store.navigation.findIndex((n) => n.id === id);
  const newItem: WebsiteNavigationItem = {
    id,
    menu_location: item.menu_location || 'header',
    label: item.label || 'New Link',
    href: item.href || '/',
    display_order: item.display_order ?? store.navigation.length + 1,
    is_active: item.is_active ?? true,
    is_external: item.is_external ?? false,
  };

  if (idx !== -1) {
    store.navigation[idx] = { ...store.navigation[idx], ...newItem };
  } else {
    store.navigation.push(newItem);
  }

  writeLocalStore(store);
  await persistCmsSetting('website_navigation', store.navigation);
  return newItem;
}

export async function deleteWebsiteNavigationItem(id: string): Promise<boolean> {
  const store = readLocalStore();
  store.navigation = store.navigation.filter((n) => n.id !== id);
  writeLocalStore(store);
  await persistCmsSetting('website_navigation', store.navigation);
  return true;
}

export async function reorderWebsiteNavigation(orderedIds: string[]): Promise<boolean> {
  const store = readLocalStore();
  store.navigation = store.navigation.map((item) => {
    const newIdx = orderedIds.indexOf(item.id);
    if (newIdx !== -1) {
      return { ...item, display_order: newIdx + 1 };
    }
    return item;
  });
  writeLocalStore(store);
  await persistCmsSetting('website_navigation', store.navigation);
  return true;
}

// ----------------- 3. Brand Media Gallery -----------------

export async function getCmsGallery(includeInactive: boolean = false): Promise<CmsGalleryItem[]> {
  let gallery: CmsGalleryItem[] = [];
  const supabase = createClient();

  if (supabase) {
    const { data } = await supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_key', 'cms_gallery')
      .single();

    if (data && Array.isArray(data.setting_value)) {
      gallery = data.setting_value;
    }
  }

  if (!gallery || gallery.length === 0) {
    const store = readLocalStore();
    gallery = store.gallery || initialCmsGallery;
  }

  if (!includeInactive) {
    gallery = gallery.filter((g) => g.is_active);
  }

  return gallery.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
}

export async function saveCmsGalleryItem(
  item: Partial<CmsGalleryItem>
): Promise<CmsGalleryItem> {
  const store = readLocalStore();
  const id = item.id || `gal-${Date.now()}`;
  const now = new Date().toISOString();

  const idx = store.gallery.findIndex((g) => g.id === id);
  const newItem: CmsGalleryItem = {
    id,
    image_url: item.image_url || '',
    cloudinary_public_id: item.cloudinary_public_id || null,
    caption: item.caption || '',
    alt_text: item.alt_text || '',
    category: item.category || 'general',
    display_order: item.display_order ?? store.gallery.length + 1,
    is_active: item.is_active ?? true,
    created_at: item.created_at || now,
    updated_at: now,
  };

  if (idx !== -1) {
    store.gallery[idx] = { ...store.gallery[idx], ...newItem };
  } else {
    store.gallery.push(newItem);
  }

  writeLocalStore(store);
  await persistCmsSetting('cms_gallery', store.gallery);
  return newItem;
}

export async function deleteCmsGalleryItem(id: string): Promise<boolean> {
  const store = readLocalStore();
  const target = store.gallery.find((g) => g.id === id);

  if (target?.cloudinary_public_id) {
    await deleteCloudinaryImage(target.cloudinary_public_id);
  }

  store.gallery = store.gallery.filter((g) => g.id !== id);
  writeLocalStore(store);
  await persistCmsSetting('cms_gallery', store.gallery);
  return true;
}

export async function reorderCmsGallery(orderedIds: string[]): Promise<boolean> {
  const store = readLocalStore();
  store.gallery = store.gallery.map((item) => {
    const newIdx = orderedIds.indexOf(item.id);
    if (newIdx !== -1) {
      return { ...item, display_order: newIdx + 1 };
    }
    return item;
  });
  writeLocalStore(store);
  await persistCmsSetting('cms_gallery', store.gallery);
  return true;
}

// ----------------- 4. Header & Footer Settings -----------------

export async function getHeaderSettings(): Promise<HeaderSettings> {
  const supabase = createClient();
  if (supabase) {
    const { data } = await supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_key', 'header_settings')
      .single();

    if (data && data.setting_value) {
      return { ...initialHeaderSettings, ...data.setting_value };
    }
  }

  const store = readLocalStore();
  return store.headerSettings || initialHeaderSettings;
}

export async function updateHeaderSettings(
  settings: Partial<HeaderSettings>
): Promise<HeaderSettings> {
  const store = readLocalStore();
  store.headerSettings = { ...store.headerSettings, ...settings };
  writeLocalStore(store);
  await persistCmsSetting('header_settings', store.headerSettings);
  return store.headerSettings;
}

export async function getFooterSettings(): Promise<FooterSettings> {
  const supabase = createClient();
  if (supabase) {
    const { data } = await supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_key', 'footer_settings')
      .single();

    if (data && data.setting_value) {
      return { ...initialFooterSettings, ...data.setting_value };
    }
  }

  const store = readLocalStore();
  return store.footerSettings || initialFooterSettings;
}

export async function updateFooterSettings(
  settings: Partial<FooterSettings>
): Promise<FooterSettings> {
  const store = readLocalStore();
  store.footerSettings = { ...store.footerSettings, ...settings };
  writeLocalStore(store);
  await persistCmsSetting('footer_settings', store.footerSettings);
  return store.footerSettings;
}

// ----------------- 5. Inner Pages Content (About, Contact, Privacy) -----------------

export async function getPageCms<K extends keyof PageCmsContent>(page: K): Promise<PageCmsContent[K]> {
  const supabase = createClient();
  if (supabase) {
    const { data } = await supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_key', `page_cms_${page}`)
      .single();

    if (data && data.setting_value) {
      return { ...initialPageCms[page], ...data.setting_value };
    }
  }

  const store = readLocalStore();
  return store.pageCms[page] || initialPageCms[page];
}

export async function updatePageCms<K extends keyof PageCmsContent>(
  page: K,
  content: Partial<PageCmsContent[K]>
): Promise<PageCmsContent[K]> {
  const store = readLocalStore();
  store.pageCms[page] = { ...store.pageCms[page], ...content };
  writeLocalStore(store);
  await persistCmsSetting(`page_cms_${page}`, store.pageCms[page]);
  return store.pageCms[page];
}

// ----------------- 6. Global SEO Metadata -----------------

export async function getSeoSettings(): Promise<SeoSettings> {
  const supabase = createClient();
  if (supabase) {
    const { data } = await supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_key', 'seo_settings')
      .single();

    if (data && data.setting_value) {
      return { ...initialSeoSettings, ...data.setting_value };
    }
  }

  const store = readLocalStore();
  return store.seoSettings || initialSeoSettings;
}

export async function updateSeoSettings(
  settings: Partial<SeoSettings>
): Promise<SeoSettings> {
  const store = readLocalStore();
  store.seoSettings = {
    ...store.seoSettings,
    ...settings,
    page_seo: {
      ...(store.seoSettings.page_seo || {}),
      ...(settings.page_seo || {}),
    },
  };
  writeLocalStore(store);
  await persistCmsSetting('seo_settings', store.seoSettings);
  return store.seoSettings;
}
