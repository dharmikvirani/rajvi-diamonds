import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import WhatsAppButton from '@/components/public/WhatsAppButton';
import InquiryCTA from '@/components/public/InquiryCTA';
import {
  getSiteSettings,
  getPageCms,
  getHeaderSettings,
  getFooterSettings,
  getWebsiteNavigation,
  getSeoSettings,
} from '@/lib/db';
import { Sparkles, ShieldCheck, Eye, Compass, HeartHandshake } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  const pageSeo = seo.page_seo?.['/about'] || {};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rajvidiamonds.com';

  return {
    title: pageSeo.title || 'About Rajvi Diamonds | Artisanal Fancy Diamond Cutters',
    description:
      pageSeo.description ||
      'Learn about Rajvi Diamonds, our devotion to fancy cut lapidary craftsmanship, geometric precision, and trusted wholesale diamond relationships.',
    alternates: {
      canonical: `${siteUrl}/about`,
    },
    openGraph: {
      title: pageSeo.title || 'About Rajvi Diamonds | Artisanal Fancy Diamond Cutters',
      description: pageSeo.description,
      url: `${siteUrl}/about`,
      images: pageSeo.og_image ? [pageSeo.og_image] : [],
    },
  };
}

export default async function AboutPage() {
  const [
    settings,
    aboutCms,
    headerSettings,
    navLinks,
    footerSettings,
    footerColNav,
    footerNav,
  ] = await Promise.all([
    getSiteSettings(),
    getPageCms('about'),
    getHeaderSettings(),
    getWebsiteNavigation('header'),
    getFooterSettings(),
    getWebsiteNavigation('footer_collections'),
    getWebsiteNavigation('footer_navigation'),
  ]);

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

      {/* Hero Section (Light Luxury Theme) */}
      <section className="relative py-24 sm:py-32 bg-gradient-to-b from-[#FAF8F5] via-white to-rajvi-offWhite border-b border-rajvi-borderLight overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-rajvi-gold/40 bg-white/90 text-rajvi-goldMuted text-xs uppercase tracking-[0.2em] font-medium mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-rajvi-gold" />
            <span>{aboutCms.hero_badge || 'The Heritage of Artistry'}</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-normal tracking-tight text-rajvi-textDark mb-6 leading-tight max-w-4xl mx-auto">
            {aboutCms.hero_title.includes('Fancy Cut Diamonds') ? (
              <>
                {aboutCms.hero_title.split('Fancy Cut Diamonds')[0]}
                <span className="gold-gradient-text italic">Fancy Cut Diamonds</span>
              </>
            ) : (
              aboutCms.hero_title
            )}
          </h1>

          <p className="text-rajvi-textMuted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-light">
            {aboutCms.hero_subtitle || settings.about_brand_intro}
          </p>
        </div>
      </section>

      {/* Section 2: The Rajvi Diamonds Story */}
      <section className="bg-white text-rajvi-textDark py-24 border-b border-rajvi-borderLight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Story Text */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] text-rajvi-gold font-semibold block">
                Our Genesis & Ethos
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-rajvi-textDark font-normal tracking-tight leading-tight">
                {aboutCms.story_heading}
              </h2>
              <div className="prose max-w-none text-xs sm:text-sm text-rajvi-textMuted leading-relaxed space-y-4">
                <p>{aboutCms.story_p1 || settings.about_story}</p>
                <p>{aboutCms.story_p2}</p>
              </div>
            </div>

            {/* Visual Photography */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] rounded-sm overflow-hidden border border-rajvi-borderLight shadow-luxury bg-white p-2">
                <div className="relative w-full h-full rounded-sm overflow-hidden">
                  <Image
                    src={aboutCms.story_image || '/images/cuts2.jpeg'}
                    alt="Rajvi Diamonds Loose Fancy Diamond Silhouette"
                    fill
                    className="object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Our Expertise & Quality Commitment */}
      <section className="bg-[#FAF9F6] py-24 border-b border-rajvi-borderLight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-rajvi-gold font-semibold block mb-3">
              Lapidary Discipline
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-rajvi-textDark font-normal tracking-tight">
              {aboutCms.expertise_heading || 'Our Core Expertise'}
            </h2>
            <p className="mt-4 text-rajvi-textMuted text-sm sm:text-base leading-relaxed">
              {aboutCms.expertise_subtitle || settings.about_expertise}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(aboutCms.expertise_items || []).map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-rajvi-borderLight p-6 rounded-sm shadow-sm hover:shadow-luxury transition-all"
              >
                <div className="w-10 h-10 rounded-sm bg-[#FAF8F5] border border-rajvi-borderLight flex items-center justify-center mb-4">
                  <Compass className="w-5 h-5 text-rajvi-gold" />
                </div>
                <h3 className="font-serif text-base text-rajvi-textDark mb-2 font-normal">
                  {item.title}
                </h3>
                <p className="text-xs text-rajvi-textMuted leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Surat Lapidary Craftsmanship Process & Real Workshop Gallery */}
      <section className="bg-white py-24 border-b border-rajvi-borderLight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-rajvi-gold font-semibold block mb-3">
              Surat Atelier Heritage
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-rajvi-textDark font-normal tracking-tight">
              {aboutCms.craftsmanship_heading || 'Surat Lapidary Craftsmanship & Workshop'}
            </h2>
            <p className="mt-4 text-rajvi-textMuted text-sm sm:text-base leading-relaxed">
              {aboutCms.craftsmanship_desc ||
                'Situated in Surat, the diamond cutting capital of the world, our artisans bring generations of lapidary mastery to each fancy cut. Explore our authentic workshop process—from rough crystal planning to high-precision scaife polishing.'}
            </p>
          </div>

          {/* 4-Stage Real Workshop Photographic Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-[#FAF8F5] border border-rajvi-borderLight rounded-sm overflow-hidden shadow-sm group">
              <div className="relative aspect-[4/3] overflow-hidden bg-white">
                <Image
                  src="/images/cuts2.jpeg"
                  alt="Rough diamond crystal evaluation and grain planning in Surat"
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/80 text-rajvi-goldLight text-[10px] uppercase tracking-wider font-semibold rounded-sm backdrop-blur-sm">
                  Stage 01
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-base text-rajvi-textDark font-normal mb-1.5">
                  Crystal Evaluation
                </h3>
                <p className="text-xs text-rajvi-textMuted leading-relaxed">
                  Rough crystal analysis assesses internal grain axes and transparency to determine the optimal fancy-cut silhouette.
                </p>
              </div>
            </div>

            <div className="bg-[#FAF8F5] border border-rajvi-borderLight rounded-sm overflow-hidden shadow-sm group">
              <div className="relative aspect-[4/3] overflow-hidden bg-white">
                <Image
                  src="/images/cuts.jpeg"
                  alt="Mathematical facet planning and geometric layout"
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/80 text-rajvi-goldLight text-[10px] uppercase tracking-wider font-semibold rounded-sm backdrop-blur-sm">
                  Stage 02
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-base text-rajvi-textDark font-normal mb-1.5">
                  Facet Geometry Planning
                </h3>
                <p className="text-xs text-rajvi-textMuted leading-relaxed">
                  Mathematical facet angles are calibrated to maximize light refraction and establish clean geometric contours.
                </p>
              </div>
            </div>

            <div className="bg-[#FAF8F5] border border-rajvi-borderLight rounded-sm overflow-hidden shadow-sm group">
              <div className="relative aspect-[4/3] overflow-hidden bg-white">
                <Image
                  src="/images/polish.jpeg"
                  alt="Artisan diamond hand-polishing on cast iron scaife wheel in Surat"
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/80 text-rajvi-goldLight text-[10px] uppercase tracking-wider font-semibold rounded-sm backdrop-blur-sm">
                  Stage 03
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-base text-rajvi-textDark font-normal mb-1.5">
                  Scaife Wheel Polishing
                </h3>
                <p className="text-xs text-rajvi-textMuted leading-relaxed">
                  Master polishers coax extraordinary optical luster on traditional cast-iron scaifes with diamond dust paste.
                </p>
              </div>
            </div>

            <div className="bg-[#FAF8F5] border border-rajvi-borderLight rounded-sm overflow-hidden shadow-sm group">
              <div className="relative aspect-[4/3] overflow-hidden bg-white">
                <Image
                  src="/images/cuts3.jpeg"
                  alt="Calibrated millimeter diamond parcel inspection and quality sorting"
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/80 text-rajvi-goldLight text-[10px] uppercase tracking-wider font-semibold rounded-sm backdrop-blur-sm">
                  Stage 04
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-base text-rajvi-textDark font-normal mb-1.5">
                  Quality & Parcel Calibration
                </h3>
                <p className="text-xs text-rajvi-textMuted leading-relaxed">
                  Microscopic inspection verifies symmetry, polish luster, and calibrated millimeter sizing before parcel dispatch.
                </p>
              </div>
            </div>
          </div>

          {/* Quality Standards & Manufacturing Capabilities */}
          <div className="bg-[#FAF8F5] border border-rajvi-borderLight rounded-sm p-8 sm:p-12 shadow-sm">
            <div className="max-w-2xl mb-8">
              <span className="text-xs uppercase tracking-[0.25em] text-rajvi-gold font-semibold block mb-2">
                Manufacturing Standards
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-rajvi-textDark font-normal">
                Technical Capabilities for Trade Partners
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
              <div className="space-y-2">
                <span className="font-semibold text-rajvi-textDark uppercase tracking-wider text-[11px] block">
                  Millimeter Sizing Precision
                </span>
                <p className="text-rajvi-textMuted leading-relaxed">
                  Calibrated to ±0.05mm tolerance ensuring effortless, repeatable setting into precision high jewellery mounts.
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-semibold text-rajvi-textDark uppercase tracking-wider text-[11px] block">
                  Microscopic Inspection
                </span>
                <p className="text-rajvi-textMuted leading-relaxed">
                  Every stone is examined under 10x to 40x magnification for crisp facet junctions, clean culets, and smooth girdles.
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-semibold text-rajvi-textDark uppercase tracking-wider text-[11px] block">
                  Mounting Optimization
                </span>
                <p className="text-rajvi-textMuted leading-relaxed">
                  Flat-base rose cuts and polished girdles designed specifically for flush, secure bezel and prong setting.
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-semibold text-rajvi-textDark uppercase tracking-wider text-[11px] block">
                  Bespoke Parcel Supply
                </span>
                <p className="text-rajvi-textMuted leading-relaxed">
                  Consistent parcel lots supplied to international ateliers, fine jewellery brands, and private designers worldwide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry CTA */}
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
