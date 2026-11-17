import crypto from 'crypto';

export const getCloudinaryConfig = () => {
  return {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  };
};

export const isCloudinaryConfigured = (): boolean => {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  return Boolean(
    cloudName &&
    apiKey &&
    apiSecret &&
    !cloudName.includes('your-cloudinary') &&
    !cloudName.includes('your-cloud-name')
  );
};

/**
 * Returns optimized Cloudinary URL with responsive transformations
 */
export const getOptimizedImageUrl = (
  url: string,
  options?: { width?: number; height?: number; crop?: string; quality?: string | number }
): string => {
  if (!url) return '';
  if (!url.includes('cloudinary.com')) return url;

  const width = options?.width ? `w_${options.width}` : '';
  const height = options?.height ? `h_${options.height}` : '';
  const crop = options?.crop ? `c_${options.crop}` : 'c_limit';
  const quality = options?.quality ? `q_${options.quality}` : 'q_auto';
  const format = 'f_auto';

  const transformations = [crop, width, height, quality, format].filter(Boolean).join(',');

  // Insert transformations into /upload/
  if (url.includes('/upload/')) {
    return url.replace('/upload/', `/upload/${transformations}/`);
  }

  return url;
};

/**
 * Deletes an image from Cloudinary using server-side signed API
 */
export async function deleteCloudinaryImage(publicId: string): Promise<boolean> {
  try {
    if (!publicId || !publicId.trim()) return false;
    const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
    if (!cloudName || !apiKey || !apiSecret) return false;

    const timestamp = Math.round(Date.now() / 1000).toString();
    const paramsToSign = `public_id=${publicId}&timestamp=${timestamp}`;
    const signature = crypto
      .createHash('sha1')
      .update(paramsToSign + apiSecret)
      .digest('hex');

    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    return data.result === 'ok';
  } catch (err) {
    console.error('Error deleting Cloudinary image:', err);
    return false;
  }
}
