import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import DiamondDetailClient from '@/components/public/DiamondDetailClient';
import WhatsAppButton from '@/components/public/WhatsAppButton';
import {
  getDiamondBySlug,
  getDiamonds,
  getSiteSettings,
  getHeaderSettings,
  getFooterSettings,
  getWebsiteNavigation,
} from '@/lib/db';

interface DiamondDetailPageProps {
  params: {
    slug: string;
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: DiamondDetailPageProps): Promise<Metadata> {
  const diamond = await getDiamondBySlug(params.slug);
  if (!diamond) {
    return {
      title: 'Diamond Not Found | Rajvi Diamonds',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rajvidiamonds.com';
  const primaryImg =
    diamond.images.find((i) => i.is_primary)?.image_url ||
    diamond.images[0]?.image_url ||
    '/rajvi-diamonds-logo.png';

  return {
    title: diamond.seo_title || `${diamond.name} Fancy Diamond Cut`,
    description:
      diamond.seo_description ||
      diamond.short_description ||
      `Explore the ${diamond.name} fancy cut diamond by Rajvi Diamonds. Exceptional precision, hand-oriented faceting, and calibrated sizes.`,
    alternates: {
      canonical: `${siteUrl}/collections/${diamond.slug}`,
    },
    openGraph: {
      title: `${diamond.name} Fancy Diamond Cut | Rajvi Diamonds`,
      description: diamond.short_description,
      url: `${siteUrl}/collections/${diamond.slug}`,
      type: 'article',
      images: [
        {
          url: primaryImg,
          width: 1200,
          height: 1200,
          alt: diamond.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${diamond.name} Fancy Diamond Cut | Rajvi Diamonds`,
      description: diamond.short_description,
      images: [primaryImg],
    },
  };
}

export default async function DiamondDetailPage({ params }: DiamondDetailPageProps) {
  const [
    settings,
    diamond,
    allDiamonds,
    headerSettings,
    navLinks,
    footerSettings,
    footerColNav,
    footerNav,
  ] = await Promise.all([
    getSiteSettings(),
    getDiamondBySlug(params.slug),
    getDiamonds(),
    getHeaderSettings(),
    getWebsiteNavigation('header'),
    getFooterSettings(),
    getWebsiteNavigation('footer_collections'),
    getWebsiteNavigation('footer_navigation'),
  ]);

  if (!diamond) {
    notFound();
  }

  // Filter out the current diamond for related cuts
  const relatedDiamonds = allDiamonds
    .filter((d) => d.id !== diamond.id)
    .slice(0, 3);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rajvidiamonds.com';

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: diamond.name,
    image: (diamond.images || []).map((i) => i.image_url),
    description: diamond.short_description || diamond.description,
    category: diamond.category?.name || 'Fancy Cut Diamonds',
    brand: {
      '@type': 'Brand',
      name: 'Rajvi Diamonds',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      availability:
        diamond.availability_status === 'Made to Order'
          ? 'https://schema.org/PreOrder'
          : 'https://schema.org/InStock',
      url: `${siteUrl}/collections/${diamond.slug}`,
    },
  };

  return (
    <div className="min-h-screen bg-rajvi-offWhite text-rajvi-textDark flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {/* Header */}
      <Header
        whatsappNumber={settings.whatsapp_number}
        brandName={settings.brand_name}
        logoUrl={headerSettings.logo_url}
        navLinks={navLinks}
        showCta={headerSettings.show_cta}
        ctaLabel={headerSettings.cta_label}
        ctaHref={headerSettings.cta_href}
        showWhatsApp={headerSettings.show_whatsapp}
      />

      {/* Main Detail Client */}
      <main className="flex-grow">
        <DiamondDetailClient
          diamond={diamond}
          relatedDiamonds={relatedDiamonds}
          settings={settings}
          siteUrl={siteUrl}
        />
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        footerSettings={footerSettings}
        collectionLinks={footerColNav}
        navigationLinks={footerNav}
      />

      {/* Floating WhatsApp Action */}
      <WhatsAppButton
        phoneNumber={settings.whatsapp_number}
        diamondName={diamond.name}
        variant="floating"
      />
    </div>
  );
}
