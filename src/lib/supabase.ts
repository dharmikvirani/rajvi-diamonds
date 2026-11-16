import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('your-supabase-url')
  );
};

export const createClient = () => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
};

export const createAdminClient = () => {
  if (!supabaseUrl || !supabaseServiceKey || supabaseUrl.includes('your-supabase-url')) {
    return null;
  }
  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
