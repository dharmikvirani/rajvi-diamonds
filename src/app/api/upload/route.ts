import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getCloudinaryConfig, isCloudinaryConfigured } from '@/lib/cloudinary';

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

    // Check Cloudinary configuration
    if (isCloudinaryConfigured()) {
      const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`;

      // Upload to Cloudinary REST API directly
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      const timestamp = Math.round(Date.now() / 1000).toString();

      // Simple upload via unsigned or signed preset
      const cFormData = new FormData();
      cFormData.append('file', base64Data);
      cFormData.append('folder', 'rajvi-diamonds');
      cFormData.append('api_key', apiKey);
      cFormData.append('timestamp', timestamp);

      // If unsigned upload or signature is needed
      const uploadRes = await fetch(uploadUrl, {
        method: 'POST',
        body: cFormData,
      });

      const uploadData = await uploadRes.json();
      if (uploadData.secure_url) {
        return NextResponse.json({
          success: true,
          imageUrl: uploadData.secure_url,
          publicId: uploadData.public_id,
        });
      }
    }

    // Fallback: If Cloudinary credentials are not configured yet, convert to data URL for seamless preview
    const buffer = Buffer.from(await file.arrayBuffer());
    const dataUrl = `data:${file.type};base64,${buffer.toString('base64')}`;

    return NextResponse.json({
      success: true,
      imageUrl: dataUrl,
      publicId: null,
      notice: 'Saved as base64 data URL. Configure Cloudinary credentials in .env.local for production CDN hosting.',
    });
  } catch (error: any) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Image upload failed' },
      { status: 500 }
    );
  }
}
