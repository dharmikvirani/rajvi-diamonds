export type InquiryType =
  | 'General Inquiry'
  | 'Wholesale Inquiry'
  | 'Jewellery Manufacturing Inquiry'
  | 'Diamond Availability'
  | 'Other';

export type InquiryStatus =
  | 'New'
  | 'Contacted'
  | 'In Progress'
  | 'Resolved'
  | 'Archived';

export interface AdminUser {
  id: string;
  auth_user_id?: string | null;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface DiamondSpecifications {
  cut_grade?: string;
  symmetry?: string;
  polish?: string;
  fluorescence?: string;
  table_percentage?: string;
  depth_percentage?: string;
  facet_count?: number;
  culet?: string;
  girdle?: string;
  crafting_origin?: string;
  custom_attributes?: Record<string, string>;
}

export interface DiamondImage {
  id: string;
  diamond_id: string;
  image_url: string;
  cloudinary_public_id?: string | null;
  alt_text: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

export interface DiamondSize {
  id: string;
  diamond_id: string;
  size_mm: number;
  is_available: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Diamond {
  id: string;
  category_id?: string | null;
  category?: Category;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  shape: string;
  specifications: DiamondSpecifications;
  is_featured: boolean;
  is_active: boolean;
  seo_title?: string;
  seo_description?: string;
  display_order: number;
  images: DiamondImage[];
  sizes: DiamondSize[];
  created_at: string;
  updated_at: string;
}

export interface Inquiry {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  company_name?: string | null;
  inquiry_type: InquiryType;
  diamond_id?: string | null;
  diamond_name?: string;
  selected_size?: string | null;
  message: string;
  status: InquiryStatus;
  internal_notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  brand_name: string;
  tagline: string;
  whatsapp_number: string;
  contact_email: string;
  phone_number: string;
  instagram_url: string;
  business_address: string;
  footer_text: string;
  hero_heading: string;
  hero_subtitle: string;
  about_brand_intro: string;
  about_story: string;
  about_expertise: string;
  about_quality: string;
  about_vision: string;
}

export interface FilterParams {
  category?: string;
  shape?: string;
  size?: string;
  search?: string;
  featured?: boolean;
  sort?: 'name-asc' | 'name-desc' | 'featured' | 'newest';
}
