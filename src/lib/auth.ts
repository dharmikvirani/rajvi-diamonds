import { cookies } from 'next/headers';
import { createAdminClient, createClient } from './supabase';

const ADMIN_COOKIE_NAME = 'rajvi_admin_session';
const DEFAULT_FALLBACK_SECRET = 'RajviLuxurySecure2024!';

export interface AuthSession {
  isAdmin: boolean;
  email?: string;
  userId?: string;
}

/**
 * Checks if current request is authenticated as an administrator
 */
export async function getAdminSession(): Promise<AuthSession> {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return { isAdmin: false };
  }

  // 1. Check against local secret fallback
  const adminSecret = process.env.ADMIN_SECRET_KEY || DEFAULT_FALLBACK_SECRET;
  if (sessionToken === adminSecret) {
    return {
      isAdmin: true,
      email: 'admin@rajvidiamonds.com',
      userId: 'local-admin-root',
    };
  }

  // 2. Check Supabase Auth session token
  const supabase = createClient();
  if (supabase) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(sessionToken);
      if (!error && user) {
        // Verify user is an active admin in admin_users table
        const adminDb = createAdminClient();
        if (adminDb) {
          const { data: adminRecord } = await adminDb
            .from('admin_users')
            .select('*')
            .eq('auth_user_id', user.id)
            .eq('is_active', true)
            .single();

          if (adminRecord) {
            return {
              isAdmin: true,
              email: user.email,
              userId: user.id,
            };
          }
        } else {
          return {
            isAdmin: true,
            email: user.email,
            userId: user.id,
          };
        }
      }
    } catch {
      // Fall through
    }
  }

  return { isAdmin: false };
}
