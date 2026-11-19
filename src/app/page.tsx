import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import HeroSection from '@/components/public/HeroSection';
import FeaturedCuts from '@/components/public/FeaturedCuts';
import WhyChooseUs from '@/components/public/WhyChooseUs';
import CraftsmanshipSection from '@/components/public/CraftsmanshipSection';
import BrandStory from '@/components/public/BrandStory';
import InquiryCTA from '@/components/public/InquiryCTA';
import WhatsAppButton from '@/components/public/WhatsAppButton';
import {
  getDiamonds,
  getSiteSettings,
  getCmsSections,
  getHeaderSettings,
  getFooterSettings,
  getWebsiteNavigation,
  getSeoSettings,
} from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { Eye } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  const pageSeo = seo.page_seo?.['/'] || {};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rajvidiamonds.com';

  const title = pageSeo.title || seo.default_title || 'Rajvi Diamonds | The Art of Extraordinary Diamonds';
  const description =
    pageSeo.description ||
    seo.default_description ||
    'Discover distinctive fancy-cut diamonds from Rajvi Diamonds. Featuring Rose Octagone, Tulip, and calibrated millimeter fancy cuts crafted in Surat, India.';
  const ogImage = pageSeo.og_image || seo.default_og_image;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}`,
      images: ogImage ? [ogImage] : [],
    },
  };
}

interface HomePageProps {
  searchParams?: {
    preview?: string;
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const session = await getAdminSession();
  const isPreview = searchParams?.preview === 'true' && session.isAdmin;

  const [
    settings,
    featuredDiamonds,
    cmsSections,
    headerSettings,
    navLinks,
    footerSettings,
    footerColNav,
    footerNav,
  ] = await Promise.all([
    getSiteSettings(),
    getDiamonds({ featured: true }),
    getCmsSections('home', isPreview),
    getHeaderSettings(),
    getWebsiteNavigation('header'),
    getFooterSettings(),
    getWebsiteNavigation('footer_collections'),
    getWebsiteNavigation('footer_navigation'),
  ]);

  return (
    <main className="min-h-screen bg-rajvi-offWhite text-rajvi-textDark flex flex-col selection:bg-rajvi-gold selection:text-white">
      {/* Draft Preview Indicator Banner */}
      {isPreview && (
        <div className="bg-amber-500/20 border-b border-amber-500/40 text-amber-200 px-4 py-2.5 text-xs text-center flex items-center justify-center gap-2 sticky top-0 z-50 backdrop-blur-md">
          <Eye className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>
            <strong>CMS Draft Preview Active:</strong> You are viewing unpublished revisions. Live site visitors see the published version.
          </span>
          <a
            href="/"
            className="underline font-semibold ml-2 hover:text-white"
          >
            Exit Preview
          </a>
        </div>
      )}

      {/* Header & Dynamic Navigation */}
      <Header
        whatsappNumber={settings.whatsapp_number}
        brandName={settings.brand_name}
        theme="light"
        logoUrl={headerSettings.logo_url}
        navLinks={navLinks}
        showCta={headerSettings.show_cta}
        ctaLabel={headerSettings.cta_label}
        ctaHref={headerSettings.cta_href}
        showWhatsApp={headerSettings.show_whatsapp}
      />

      {/* Dynamic Modular Homepage Sections */}
      {cmsSections.map((sec) => {
        switch (sec.section_key) {
          case 'hero':
            return (
              <HeroSection
                key={sec.id}
                heading={sec.title || settings.hero_heading}
                subtitle={sec.subtitle || settings.hero_subtitle}
                badge={sec.badge}
                imageUrl={sec.image_url || settings.hero_image_url}
                imageAlt={sec.image_alt}
                buttons={sec.buttons}
                items={sec.items}
                whatsappNumber={settings.whatsapp_number}
              />
            );

          case 'featured_cuts':
            return (
              <FeaturedCuts
                key={sec.id}
                diamonds={featuredDiamonds}
                title={sec.title}
                subtitle={sec.subtitle}
                badge={sec.badge}
                buttonLabel={sec.buttons?.[0]?.label}
                buttonHref={sec.buttons?.[0]?.href}
                theme="light"
              />
            );

          case 'why_choose_us':
            return (
              <WhyChooseUs
                key={sec.id}
                title={sec.title}
                subtitle={sec.subtitle}
                badge={sec.badge}
                items={sec.items}
              />
            );

          case 'craftsmanship':
            return (
              <CraftsmanshipSection
                key={sec.id}
                title={sec.title}
                subtitle={sec.subtitle}
                badge={sec.badge}
                items={sec.items}
              />
            );

          case 'brand_story':
            return (
              <BrandStory
                key={sec.id}
                settings={settings}
                title={sec.title}
                subtitle={sec.subtitle}
                badge={sec.badge}
                intro={sec.description}
                quote={sec.subtitle}
                imageUrl={sec.image_url}
                imageAlt={sec.image_alt}
                pillars={sec.items}
                buttonLabel={sec.buttons?.[0]?.label}
                buttonHref={sec.buttons?.[0]?.href}
              />
            );

          case 'inquiry_cta':
            return (
              <InquiryCTA
                key={sec.id}
                whatsappNumber={settings.whatsapp_number}
                title={sec.title}
                subtitle={sec.subtitle}
                badge={sec.badge}
                description={sec.description}
                whatsappLabel={sec.buttons?.[0]?.label}
                contactLabel={sec.buttons?.[1]?.label}
                contactHref={sec.buttons?.[1]?.href}
              />
            );

          default:
            return null;
        }
      })}

      {/* Footer & Dynamic Links */}
      <Footer
        settings={settings}
        theme="light"
        footerSettings={footerSettings}
        collectionLinks={footerColNav}
        navigationLinks={footerNav}
      />

      {/* Floating WhatsApp Quick Action */}
      <WhatsAppButton
        phoneNumber={settings.whatsapp_number}
        variant="floating"
      />
    </main>
  );
}
