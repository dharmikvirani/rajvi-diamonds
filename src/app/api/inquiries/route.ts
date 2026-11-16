import { NextRequest, NextResponse } from 'next/server';
import { validateInquiryForm } from '@/lib/validations';
import { submitInquiry } from '@/lib/db';

// Simple in-memory rate limiting map (IP -> timestamps)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

export async function POST(request: NextRequest) {
  try {
    // 1. IP Rate Limiting
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'anonymous';

    const now = Date.now();
    const timestamps = (rateLimitMap.get(ip) || []).filter(
      (ts) => now - ts < RATE_LIMIT_WINDOW_MS
    );

    if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit reached. Please wait a minute before submitting another inquiry.',
        },
        { status: 429 }
      );
    }

    timestamps.push(now);
    rateLimitMap.set(ip, timestamps);

    // 2. Parse payload
    const body = await request.json();

    // 3. Server-side validation
    const validation = validateInquiryForm(body);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          errors: validation.errors,
          error: Object.values(validation.errors)[0] || 'Invalid submission data.',
        },
        { status: 400 }
      );
    }

    // 4. Save to database
    const savedInquiry = await submitInquiry({
      full_name: body.fullName.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone.trim(),
      company_name: body.companyName?.trim() || null,
      inquiry_type: body.inquiryType,
      diamond_id: body.diamondId || null,
      diamond_name: body.diamondName?.trim() || undefined,
      selected_size: body.selectedSize?.trim() || null,
      message: body.message.trim(),
    });

    return NextResponse.json({
      success: true,
      message: 'Inquiry received successfully. Our team will contact you shortly.',
      inquiryId: savedInquiry.id,
    });
  } catch (error: any) {
    console.error('Inquiry submission error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process inquiry. Please try contacting us directly via WhatsApp.',
      },
      { status: 500 }
    );
  }
}
