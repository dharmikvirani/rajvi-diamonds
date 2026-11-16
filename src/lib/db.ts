import { createAdminClient, createClient, isSupabaseConfigured } from './supabase';
import {
  Category,
  Diamond,
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
  initialInquiries,
  initialSiteSettings,
} from './seedData';

// In-memory runtime store for development fallback when Supabase is not yet linked
let memoryCategories: Category[] = [...initialCategories];
let memoryDiamonds: Diamond[] = [...initialDiamonds];
let memoryInquiries: Inquiry[] = [...initialInquiries];
let memorySettings: SiteSettings = { ...initialSiteSettings };

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
  return memoryCategories.filter((c) => c.is_active);
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
  return memoryCategories;
}

export async function saveCategory(category: Partial<Category>): Promise<Category> {
  const supabase = createAdminClient();
  const now = new Date().toISOString();

  if (supabase) {
    if (category.id && memoryCategories.some((c) => c.id === category.id)) {
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

  // Memory fallback
  if (category.id) {
    const idx = memoryCategories.findIndex((c) => c.id === category.id);
    if (idx >= 0) {
      memoryCategories[idx] = {
        ...memoryCategories[idx],
        ...category,
        updated_at: now,
      } as Category;
      return memoryCategories[idx];
    }
  }

  const newCat: Category = {
    id: category.id || `cat-${Date.now()}`,
    name: category.name || 'New Category',
    slug: category.slug || `category-${Date.now()}`,
    description: category.description || '',
    image_url: category.image_url || '',
    is_active: category.is_active ?? true,
    display_order: category.display_order ?? memoryCategories.length + 1,
    created_at: now,
    updated_at: now,
  };
  memoryCategories.push(newCat);
  return newCat;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const supabase = createAdminClient();
  if (supabase) {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) return true;
  }
  memoryCategories = memoryCategories.filter((c) => c.id !== id);
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

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,short_description.ilike.%${filters.search}%`);
    }

    const { data, error } = await query.order('display_order', { ascending: true });

    if (!error && data && data.length > 0) {
      return data as Diamond[];
    }
  }

  // Memory fallback filtering
  let results = memoryDiamonds.filter((d) => d.is_active);

  if (filters?.featured) {
    results = results.filter((d) => d.is_featured);
  }

  if (filters?.category && filters.category !== 'all') {
    results = results.filter((d) => {
      const cat = memoryCategories.find((c) => c.id === d.category_id);
      return cat?.slug === filters.category;
    });
  }

  if (filters?.shape && filters.shape !== 'all') {
    results = results.filter((d) => d.shape.toLowerCase().includes(filters.shape!.toLowerCase()));
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
    category: memoryCategories.find((c) => c.id === d.category_id),
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
  return memoryDiamonds.map((d) => ({
    ...d,
    category: memoryCategories.find((c) => c.id === d.category_id),
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

  const diamond = memoryDiamonds.find((d) => d.slug === slug && d.is_active);
  if (!diamond) return null;

  return {
    ...diamond,
    category: memoryCategories.find((c) => c.id === diamond.category_id),
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

  const diamond = memoryDiamonds.find((d) => d.id === id);
  if (!diamond) return null;

  return {
    ...diamond,
    category: memoryCategories.find((c) => c.id === diamond.category_id),
  };
}

export async function saveDiamond(diamondData: Partial<Diamond>): Promise<Diamond> {
  const supabase = createAdminClient();
  const now = new Date().toISOString();

  if (supabase) {
    // If Supabase is available, perform upsert on diamonds table
    if (diamondData.id && memoryDiamonds.some((d) => d.id === diamondData.id)) {
      const { data, error } = await supabase
        .from('diamonds')
        .update({
          category_id: diamondData.category_id,
          name: diamondData.name,
          slug: diamondData.slug,
          short_description: diamondData.short_description,
          description: diamondData.description,
          shape: diamondData.shape,
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

  // Memory fallback
  if (diamondData.id) {
    const idx = memoryDiamonds.findIndex((d) => d.id === diamondData.id);
    if (idx >= 0) {
      memoryDiamonds[idx] = {
        ...memoryDiamonds[idx],
        ...diamondData,
        images: diamondData.images || memoryDiamonds[idx].images,
        sizes: diamondData.sizes || memoryDiamonds[idx].sizes,
        updated_at: now,
      } as Diamond;
      return memoryDiamonds[idx];
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
    specifications: diamondData.specifications || {},
    is_featured: diamondData.is_featured ?? false,
    is_active: diamondData.is_active ?? true,
    seo_title: diamondData.seo_title || '',
    seo_description: diamondData.seo_description || '',
    display_order: diamondData.display_order ?? memoryDiamonds.length + 1,
    images: diamondData.images || [],
    sizes: diamondData.sizes || [],
    created_at: now,
    updated_at: now,
  };
  memoryDiamonds.push(newDiamond);
  return newDiamond;
}

export async function deleteDiamond(id: string): Promise<boolean> {
  const supabase = createAdminClient();
  if (supabase) {
    const { error } = await supabase.from('diamonds').delete().eq('id', id);
    if (!error) return true;
  }
  memoryDiamonds = memoryDiamonds.filter((d) => d.id !== id);
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

  // Memory fallback
  const diamond = memoryDiamonds.find((d) => d.id === diamondId);
  if (!diamond) throw new Error('Diamond not found');

  if (sizeData.id) {
    const idx = diamond.sizes.findIndex((s) => s.id === sizeData.id);
    if (idx >= 0) {
      diamond.sizes[idx] = {
        ...diamond.sizes[idx],
        size_mm: sizeData.size_mm,
        is_available: sizeData.is_available,
        display_order: sizeData.display_order ?? diamond.sizes[idx].display_order,
        updated_at: now,
      };
      return diamond.sizes[idx];
    }
  }

  // Check duplicate size
  const exists = diamond.sizes.some((s) => Math.abs(s.size_mm - sizeData.size_mm) < 0.001);
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
  return newSize;
}

export async function deleteDiamondSize(diamondId: string, sizeId: string): Promise<boolean> {
  const supabase = createAdminClient();
  if (supabase) {
    const { error } = await supabase.from('diamond_sizes').delete().eq('id', sizeId);
    if (!error) return true;
  }
  const diamond = memoryDiamonds.find((d) => d.id === diamondId);
  if (diamond) {
    diamond.sizes = diamond.sizes.filter((s) => s.id !== sizeId);
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
  message: string;
}): Promise<Inquiry> {
  const now = new Date().toISOString();
  const supabase = createClient();

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
    message: data.message,
    status: 'New',
    internal_notes: null,
    created_at: now,
    updated_at: now,
  };
  memoryInquiries.unshift(newInq);
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

  let list = [...memoryInquiries];
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

  const idx = memoryInquiries.findIndex((i) => i.id === id);
  if (idx >= 0) {
    memoryInquiries[idx] = {
      ...memoryInquiries[idx],
      status,
      internal_notes: internalNotes !== undefined ? internalNotes : memoryInquiries[idx].internal_notes,
      updated_at: now,
    };
    return memoryInquiries[idx];
  }

  throw new Error('Inquiry not found');
}

// ----------------- Site Settings -----------------

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createClient();
  if (supabase) {
    const { data, error } = await supabase.from('site_settings').select('*');
    if (!error && data && data.length > 0) {
      const settingsMap: any = { ...memorySettings };
      data.forEach((row: { setting_key: string; setting_value: any }) => {
        settingsMap[row.setting_key] = row.setting_value;
      });
      return settingsMap as SiteSettings;
    }
  }
  return memorySettings;
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

  memorySettings = { ...memorySettings, ...settings };
  return memorySettings;
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
