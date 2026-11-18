import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import WhatsAppButton from '@/components/public/WhatsAppButton';
import {
  getSiteSettings,
  getPageCms,
  getHeaderSettings,
  getFooterSettings,
  getWebsiteNavigation,
  getSeoSettings,
} from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  const pageSeo = seo.page_seo?.['/privacy'] || {};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rajvidiamonds.com';

  return {
    title: pageSeo.title || 'Privacy Policy | Rajvi Diamonds',
    description:
      pageSeo.description ||
      'Rajvi Diamonds privacy policy, inquiry data handling, and confidentiality commitments for trade clients.',
    alternates: {
      canonical: `${siteUrl}/privacy`,
    },
    openGraph: {
      title: pageSeo.title || 'Privacy Policy | Rajvi Diamonds',
      description: pageSeo.description,
      url: `${siteUrl}/privacy`,
      images: pageSeo.og_image ? [pageSeo.og_image] : [],
    },
  };
}

export default async function PrivacyPage() {
  const [
    settings,
    privacyCms,
    headerSettings,
    navLinks,
    footerSettings,
    footerColNav,
    footerNav,
  ] = await Promise.all([
    getSiteSettings(),
    getPageCms('privacy'),
    getHeaderSettings(),
    getWebsiteNavigation('header'),
    getFooterSettings(),
    getWebsiteNavigation('footer_collections'),
    getWebsiteNavigation('footer_navigation'),
  ]);

  return (
    <div className="min-h-screen bg-rajvi-offWhite text-rajvi-textDark flex flex-col">
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

      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="bg-white border border-rajvi-borderLight rounded-sm p-8 sm:p-12 shadow-sm space-y-8">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-rajvi-gold font-semibold block mb-2">
              {privacyCms.badge || 'Legal & Trust'}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-rajvi-textDark font-normal">
              {privacyCms.title || 'Privacy Policy & Client Data Confidentiality'}
            </h1>
            <p className="text-xs text-rajvi-textMuted mt-2">
              Last updated: {privacyCms.last_updated || 'January 2024'}
            </p>
          </div>

          <div className="prose max-w-none text-xs sm:text-sm text-rajvi-textMuted leading-relaxed space-y-6">
            {(privacyCms.sections || []).map((sec) => (
              <section key={sec.id} className="space-y-2">
                <h2 className="font-serif text-lg text-rajvi-textDark font-normal">
                  {sec.heading}
                </h2>
                <p>{sec.content}</p>
              </section>
            ))}
          </div>
        </div>
      </main>

      <Footer
        settings={settings}
        footerSettings={footerSettings}
        collectionLinks={footerColNav}
        navigationLinks={footerNav}
      />

      <WhatsAppButton
        phoneNumber={settings.whatsapp_number}
        variant="floating"
      />
    </div>
  );
}
