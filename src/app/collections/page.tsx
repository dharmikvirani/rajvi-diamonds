import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import CollectionsView from '@/components/public/CollectionsView';
import InquiryCTA from '@/components/public/InquiryCTA';
import WhatsAppButton from '@/components/public/WhatsAppButton';
import {
  getCategories,
  getDiamonds,
  getSiteSettings,
  getHeaderSettings,
  getFooterSettings,
  getWebsiteNavigation,
  getSeoSettings,
} from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  const pageSeo = seo.page_seo?.['/collections'] || {};

  return {
    title: pageSeo.title || 'Fancy Diamond Collections & Cut Catalogue | Rajvi Diamonds',
    description:
      pageSeo.description ||
      'Browse the complete Rajvi Diamonds catalogue of fancy diamond cuts including Rose Octagone, Tulip, and geometric step cuts. Calibrated sizes for jewellery designers and trade buyers.',
    openGraph: {
      title: pageSeo.title || 'Fancy Diamond Collections & Cut Catalogue | Rajvi Diamonds',
      description: pageSeo.description,
      images: pageSeo.og_image ? [pageSeo.og_image] : [],
    },
  };
}

interface CollectionsPageProps {
  searchParams?: {
    category?: string;
  };
}

export default async function CollectionsPage({ searchParams }: CollectionsPageProps) {
  const [
    settings,
    categories,
    diamonds,
    headerSettings,
    navLinks,
    footerSettings,
    footerColNav,
    footerNav,
  ] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getDiamonds(),
    getHeaderSettings(),
    getWebsiteNavigation('header'),
    getFooterSettings(),
    getWebsiteNavigation('footer_collections'),
    getWebsiteNavigation('footer_navigation'),
  ]);

  // Only display categories supported by actual product data or confirmed business offerings
  const supportedCategories = categories.filter((cat) =>
    diamonds.some((d) => d.category_id === cat.id)
  );

  const initialCat = searchParams?.category || 'all';

  return (
    <div className="min-h-screen bg-rajvi-offWhite text-rajvi-textDark flex flex-col">
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

      {/* Catalogue Hero Banner (Clean Light Editorial Theme) */}
      <section className="bg-white border-b border-rajvi-borderLight py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[11px] uppercase tracking-[0.25em] text-rajvi-gold font-semibold block mb-3">
            Manufactured Cut Portfolio
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-rajvi-textDark mb-4">
            Fancy Diamond Catalogue
          </h1>
          <p className="text-rajvi-textMuted text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Discover our curated fancy cut silhouettes, each available in calibrated millimeter sizes or custom parcel orders for bespoke jewellery creation.
          </p>
        </div>
      </section>

      {/* Dynamic Collection Grid with Filters */}
      <main className="flex-grow">
        <CollectionsView
          initialDiamonds={diamonds}
          categories={supportedCategories.length > 0 ? supportedCategories : categories}
          initialCategoryFilter={initialCat}
        />
      </main>

      {/* Bottom Inquiry CTA */}
      <InquiryCTA whatsappNumber={settings.whatsapp_number} />

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
        variant="floating"
      />
    </div>
  );
}
