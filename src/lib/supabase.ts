import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Node.js SSR transport shim when native WebSocket is not present in Node 20
class NodeTransportShim {}

const defaultClientOptions: any = {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  ...(typeof window === 'undefined' && typeof (globalThis as any).WebSocket === 'undefined'
    ? { realtime: { transport: NodeTransportShim } }
    : {}),
};

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('your-project-id') &&
    !supabaseUrl.includes('your-supabase-url')
  );
};

export const createClient = () => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  return createSupabaseClient(supabaseUrl, supabaseAnonKey, defaultClientOptions);
};

export const createAdminClient = () => {
  if (!supabaseUrl || !supabaseServiceKey || supabaseUrl.includes('your-supabase-url') || supabaseUrl.includes('your-project-id')) {
    return null;
  }
  return createSupabaseClient(supabaseUrl, supabaseServiceKey, defaultClientOptions);
};
