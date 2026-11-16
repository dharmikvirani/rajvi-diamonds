import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase';

const ADMIN_COOKIE_NAME = 'rajvi_admin_session';

export async function POST(request: NextRequest) {
  try {
    const { action, email, password } = await request.json();

    if (action === 'logout') {
      const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
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

      const normalizedEmail = email.trim().toLowerCase();

      // 1. Direct Master Passkey Check (Instant access using ADMIN_SECRET_KEY configured in .env)
      const envSecret = process.env.ADMIN_SECRET_KEY;
      if (
        envSecret &&
        envSecret.trim() !== '' &&
        password === envSecret
      ) {
        const response = NextResponse.json({
          success: true,
          message: 'Authenticated successfully via master passkey',
        });

        response.cookies.set(ADMIN_COOKIE_NAME, envSecret, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7,
          path: '/',
        });

        return response;
      }

      // 2. Authenticate via Supabase Auth (if registered in Supabase Authentication)
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
            .select('id, role, is_active')
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
          error:
            'Authentication failed. Please verify your credentials or configure Supabase Auth in your environment.',
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
