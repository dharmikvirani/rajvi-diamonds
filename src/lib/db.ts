import fs from 'fs';
import path from 'path';
import { createAdminClient, createClient, isSupabaseConfigured } from './supabase';
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
} from './types';
import {
  initialCategories,
  initialDiamonds,
  initialDiamondColors,
  initialDiamondClarities,
  initialInquiries,
  initialSiteSettings,
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
}

function getDefaultStoreData(): LocalStoreData {
  return {
    categories: JSON.parse(JSON.stringify(initialCategories)),
    diamonds: JSON.parse(JSON.stringify(initialDiamonds)),
    diamondColors: JSON.parse(JSON.stringify(initialDiamondColors)),
    diamondClarities: JSON.parse(JSON.stringify(initialDiamondClarities)),
    inquiries: JSON.parse(JSON.stringify(initialInquiries)),
    settings: JSON.parse(JSON.stringify(initialSiteSettings)),
  };
}

let inMemoryCache: LocalStoreData | null = null;

function readLocalStore(): LocalStoreData {
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

// ----------------- Categories -----------------

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
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

    if (filters?.category) {
      query = query.eq('categories.slug', filters.category);
    }

    if (filters?.shape) {
      query = query.ilike('shape', `%${filters.shape}%`);
    }

    if (filters?.color && filters.color !== 'all') {
      query = query.eq('color', filters.color);
    }

    if (filters?.clarity && filters.clarity !== 'all') {
      query = query.eq('clarity', filters.clarity);
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,short_description.ilike.%${filters.search}%`);
    }

    const { data, error } = await query.order('display_order', { ascending: true });

    if (!error && data && data.length > 0) {
      return data as Diamond[];
    }
  }

  // Local persistent fallback filtering
  const store = readLocalStore();
  let results = store.diamonds.filter((d) => d.is_active);

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
    results = results.filter((d) => d.color?.toLowerCase() === filters.color!.toLowerCase());
  }

  if (filters?.clarity && filters.clarity !== 'all') {
    results = results.filter((d) => d.clarity?.toLowerCase() === filters.clarity!.toLowerCase());
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
      return data as Diamond[];
    }
  }
  const store = readLocalStore();
  return store.diamonds.map((d) => ({
    ...d,
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
      return data as Diamond;
    }
  }

  const store = readLocalStore();
  const diamond = store.diamonds.find((d) => d.slug === slug && d.is_active);
  if (!diamond) return null;

  return {
    ...diamond,
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
      return data as Diamond;
    }
  }

  const store = readLocalStore();
  const diamond = store.diamonds.find((d) => d.id === id);
  if (!diamond) return null;

  return {
    ...diamond,
    category: store.categories.find((c) => c.id === diamond.category_id),
  };
}

export async function saveDiamond(diamondData: Partial<Diamond>): Promise<Diamond> {
  const supabase = createAdminClient();
  const now = new Date().toISOString();

  if (supabase) {
    if (diamondData.id) {
      const { data, error } = await supabase
        .from('diamonds')
        .update({
          category_id: diamondData.category_id,
          name: diamondData.name,
          slug: diamondData.slug,
          short_description: diamondData.short_description,
          description: diamondData.description,
          shape: diamondData.shape,
          color: diamondData.color ?? null,
          clarity: diamondData.clarity ?? null,
          specifications: diamondData.specifications,
          is_featured: diamondData.is_featured ?? false,
          is_active: diamondData.is_active ?? true,
          seo_title: diamondData.seo_title,
          seo_description: diamondData.seo_description,
          display_order: diamondData.display_order ?? 0,
          updated_at: now,
        })
        .eq('id', diamondData.id)
        .select()
        .single();

      if (!error && data) return data as Diamond;
    } else {
      const { data, error } = await supabase
        .from('diamonds')
        .insert({
          category_id: diamondData.category_id,
          name: diamondData.name,
          slug: diamondData.slug,
          short_description: diamondData.short_description,
          description: diamondData.description,
          shape: diamondData.shape,
          color: diamondData.color ?? null,
          clarity: diamondData.clarity ?? null,
          specifications: diamondData.specifications,
          is_featured: diamondData.is_featured ?? false,
          is_active: diamondData.is_active ?? true,
          seo_title: diamondData.seo_title,
          seo_description: diamondData.seo_description,
          display_order: diamondData.display_order ?? 0,
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();

      if (!error && data) return data as Diamond;
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
        images: diamondData.images || store.diamonds[idx].images,
        sizes: diamondData.sizes || store.diamonds[idx].sizes,
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
    images: diamondData.images || [],
    sizes: diamondData.sizes || [],
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
    const { error } = await supabase.from('diamonds').delete().eq('id', id);
    if (!error) return true;
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
    const updatePayload: any = { status, updated_at: now };
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
  const featuredDiamonds = diamonds.filter((d) => d.is_featured).length;
  const newInquiries = inquiries.filter((i) => i.status === 'New').length;

  return {
    totalDiamonds: diamonds.length,
    activeDiamonds,
    featuredDiamonds,
    totalCategories: categories.length,
    totalInquiries: inquiries.length,
    newInquiries,
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
