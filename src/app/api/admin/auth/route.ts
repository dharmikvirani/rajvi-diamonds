import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient, createAdminClient } from '@/lib/supabase';

const ADMIN_COOKIE_NAME = 'rajvi_admin_session';
const DEFAULT_FALLBACK_SECRET = 'RajviLuxurySecure2024!';

export async function POST(request: NextRequest) {
  try {
    const { action, email, password } = await request.json();

    if (action === 'logout') {
      const response = NextResponse.json({ success: true, message: 'Logged out' });
      response.cookies.delete(ADMIN_COOKIE_NAME);
      return response;
    }

    if (action === 'login') {
      if (!email || !password) {
        return NextResponse.json(
          { success: false, error: 'Email and password are required' },
          { status: 400 }
        );
      }

      // Check against configured fallback admin credentials
      const adminSecret = process.env.ADMIN_SECRET_KEY || DEFAULT_FALLBACK_SECRET;
      const normalizedEmail = email.trim().toLowerCase();

      if (
        (normalizedEmail === 'admin@rajvidiamonds.com' || normalizedEmail === 'admin') &&
        password === adminSecret
      ) {
        const response = NextResponse.json({
          success: true,
          message: 'Authenticated successfully as administrator',
        });

        response.cookies.set(ADMIN_COOKIE_NAME, adminSecret, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/',
        });

        return response;
      }

      // Check Supabase Auth
      const supabase = createClient();
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

        if (error || !data.session) {
          return NextResponse.json(
            { success: false, error: 'Invalid administrator credentials' },
            { status: 401 }
          );
        }

        // Verify user is an active admin in admin_users table
        const adminDb = createAdminClient();
        if (adminDb) {
          const { data: adminRecord, error: adminErr } = await adminDb
            .from('admin_users')
            .select('*')
            .eq('auth_user_id', data.user.id)
            .eq('is_active', true)
            .single();

          if (adminErr || !adminRecord) {
            return NextResponse.json(
              { success: false, error: 'Access denied: User is not an authorized administrator' },
              { status: 403 }
            );
          }
        }

        const response = NextResponse.json({
          success: true,
          message: 'Authenticated successfully via Supabase Auth',
        });

        response.cookies.set(ADMIN_COOKIE_NAME, data.session.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7,
          path: '/',
        });

        return response;
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Invalid administrator credentials. (Default local: admin@rajvidiamonds.com / RajviLuxurySecure2024!)',
        },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Admin auth error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
