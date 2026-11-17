import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getAdminSession } from '@/lib/auth';
import { getCloudinaryConfig, isCloudinaryConfigured } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // 1. Verify admin session
    const session = await getAdminSession();
    if (!session.isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized access' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const directUrl = formData.get('imageUrl') as string | null;

    if (directUrl && directUrl.trim()) {
      return NextResponse.json({
        success: true,
        imageUrl: directUrl.trim(),
        publicId: null,
      });
    }

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // 2. Validate file type & size (max 15MB)
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ success: false, error: 'Only image files are allowed' }, { status: 400 });
    }
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'Image exceeds 15MB size limit' }, { status: 400 });
    }

    // 3. Upload to Cloudinary
    if (isCloudinaryConfigured()) {
      const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
      const buffer = Buffer.from(await file.arrayBuffer());
      const timestamp = Math.round(Date.now() / 1000).toString();

      // Signed Cloudinary upload targeting rajvi-diamonds folder
      const paramsToSign = `folder=rajvi-diamonds&timestamp=${timestamp}`;
      const signature = crypto
        .createHash('sha1')
        .update(paramsToSign + apiSecret)
        .digest('hex');

      const cFormData = new FormData();
      cFormData.append('file', new Blob([buffer], { type: file.type }), file.name || 'diamond.jpg');
      cFormData.append('folder', 'rajvi-diamonds');
      cFormData.append('api_key', apiKey);
      cFormData.append('timestamp', timestamp);
      cFormData.append('signature', signature);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      const uploadRes = await fetch(uploadUrl, {
        method: 'POST',
        body: cFormData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || uploadData.error) {
        const errorMsg = uploadData.error?.message || 'Cloudinary upload failed';
        console.error('Cloudinary API error:', errorMsg);
        return NextResponse.json({ success: false, error: `Cloudinary error: ${errorMsg}` }, { status: 400 });
      }

      if (uploadData.secure_url) {
        return NextResponse.json({
          success: true,
          imageUrl: uploadData.secure_url,
          publicId: uploadData.public_id,
        });
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Cloudinary credentials are not properly configured. Check your environment variables.',
      },
      { status: 500 }
    );
  } catch (error: any) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Image upload failed' },
      { status: 500 }
    );
  }
}
