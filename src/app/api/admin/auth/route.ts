import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase';
import { signAdminToken } from '@/lib/auth';

const ADMIN_COOKIE_NAME = 'rajvi_admin_session';

// Rate limiting map for admin login attempts (IP -> timestamps)
const loginAttemptMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_LOGIN_ATTEMPTS = 5;

export async function POST(request: NextRequest) {
  try {
    const { action, email, password } = await request.json();

    if (action === 'logout') {
      const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
      response.cookies.delete(ADMIN_COOKIE_NAME);
      return response;
    }

    if (action === 'login') {
      // 1. IP Rate Limiting Check
      const ip =
        request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
        request.headers.get('x-real-ip') ||
        'anonymous';

      const now = Date.now();
      const attempts = (loginAttemptMap.get(ip) || []).filter(
        (ts) => now - ts < RATE_LIMIT_WINDOW_MS
      );

      if (attempts.length >= MAX_LOGIN_ATTEMPTS) {
        return NextResponse.json(
          {
            success: false,
            error: 'Too many login attempts. Please wait 1 minute before trying again.',
          },
          { status: 429 }
        );
      }

      if (!email || !password) {
        attempts.push(now);
        loginAttemptMap.set(ip, attempts);
        return NextResponse.json(
          { success: false, error: 'Email and password are required' },
          { status: 400 }
        );
      }

      const normalizedEmail = email.trim().toLowerCase();

      // 2. Direct Master Passkey Check (Instant access using ADMIN_SECRET_KEY configured in .env)
      const envSecret = process.env.ADMIN_SECRET_KEY;
      if (
        envSecret &&
        envSecret.trim() !== '' &&
        password === envSecret
      ) {
        // Successful login: reset rate limit for this IP
        loginAttemptMap.delete(ip);

        const response = NextResponse.json({
          success: true,
          message: 'Authenticated successfully via master passkey',
        });

        const signedToken = signAdminToken(envSecret);

        response.cookies.set(ADMIN_COOKIE_NAME, signedToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7,
          path: '/',
        });

        return response;
      }

      // 3. Authenticate via Supabase Auth (if registered in Supabase Authentication)
      const supabase = createClient();
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

        if (error || !data.session) {
          attempts.push(now);
          loginAttemptMap.set(ip, attempts);
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
            attempts.push(now);
            loginAttemptMap.set(ip, attempts);
            return NextResponse.json(
              { success: false, error: 'Access denied: User is not an authorized administrator' },
              { status: 403 }
            );
          }
        }

        // Successful login: reset rate limit
        loginAttemptMap.delete(ip);

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

      attempts.push(now);
      loginAttemptMap.set(ip, attempts);
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
