import { MetadataRoute } from 'next';
import { getAllDiamondsAdmin, getCategories } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rajvidiamonds.com';
  const now = new Date();

  // Core static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/collections`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Dynamic diamond cut routes
  const diamonds = await getAllDiamondsAdmin();
  const diamondRoutes: MetadataRoute.Sitemap = diamonds
    .filter((d) => d.is_active)
    .map((diamond) => ({
      url: `${siteUrl}/collections/${diamond.slug}`,
      lastModified: new Date(diamond.updated_at || now),
      changeFrequency: 'weekly',
      priority: 0.85,
    }));

  return [...staticRoutes, ...diamondRoutes];
}
