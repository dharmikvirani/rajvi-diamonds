export const getCloudinaryConfig = () => {
  return {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  };
};

export const isCloudinaryConfigured = (): boolean => {
  const { cloudName } = getCloudinaryConfig();
  return Boolean(cloudName && !cloudName.includes('your-cloudinary'));
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
