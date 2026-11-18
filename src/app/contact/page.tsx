import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import ContactForm from '@/components/public/ContactForm';
import WhatsAppButton from '@/components/public/WhatsAppButton';
import {
  getSiteSettings,
  getPageCms,
  getHeaderSettings,
  getFooterSettings,
  getWebsiteNavigation,
  getSeoSettings,
} from '@/lib/db';
import { Mail, Phone, MapPin, Instagram, MessageCircle, Clock, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  const pageSeo = seo.page_seo?.['/contact'] || {};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rajvidiamonds.com';

  return {
    title: pageSeo.title || 'Contact Rajvi Diamonds | Trade & Direct Inquiries',
    description:
      pageSeo.description ||
      'Contact Rajvi Diamonds for fancy cut diamond wholesale orders, bespoke jewellery manufacturing parcels, and calibrated diamond availability.',
    alternates: {
      canonical: `${siteUrl}/contact`,
    },
    openGraph: {
      title: pageSeo.title || 'Contact Rajvi Diamonds | Trade & Direct Inquiries',
      description: pageSeo.description,
      url: `${siteUrl}/contact`,
      images: pageSeo.og_image ? [pageSeo.og_image] : [],
    },
  };
}

export default async function ContactPage() {
  const [
    settings,
    contactCms,
    headerSettings,
    navLinks,
    footerSettings,
    footerColNav,
    footerNav,
  ] = await Promise.all([
    getSiteSettings(),
    getPageCms('contact'),
    getHeaderSettings(),
    getWebsiteNavigation('header'),
    getFooterSettings(),
    getWebsiteNavigation('footer_collections'),
    getWebsiteNavigation('footer_navigation'),
  ]);

  const cleanWhatsAppNumber = (settings.whatsapp_number || '').replace(/[^0-9]/g, '');

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

      {/* Hero Header (Clean Light Theme with Gold Accent) */}
      <section className="bg-white border-b border-rajvi-borderLight py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[11px] uppercase tracking-[0.25em] text-rajvi-gold font-semibold block mb-3">
            {contactCms.hero_badge || 'Trade & Client Communications'}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-rajvi-textDark mb-4">
            {contactCms.hero_title || 'Connect with Rajvi Diamonds'}
          </h1>
          <p className="text-rajvi-textMuted text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {contactCms.hero_subtitle ||
              'Reach out directly to our diamond team to discuss fancy cut orders, parcel calibrations, bespoke sizes, or trade collaborations.'}
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Direct Contact Details & WhatsApp */}
          <div className="lg:col-span-5 space-y-8">
            {/* WhatsApp Direct Highlight Box */}
            <div className="bg-[#11100E] text-white p-8 rounded-sm border border-rajvi-gold/30 shadow-luxuryDark space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-white font-normal">
                    {contactCms.whatsapp_box_title || 'Instant WhatsApp Support'}
                  </h3>
                  <p className="text-xs text-rajvi-offWhite/70">
                    {contactCms.whatsapp_box_subtitle || 'Fast response for availability & parcels'}
                  </p>
                </div>
              </div>

              <p className="text-xs text-rajvi-offWhite/80 leading-relaxed">
                {contactCms.whatsapp_box_desc ||
                  'Connect directly with our master sales desk on WhatsApp for real-time video diamond previews, stone measurements, and stock confirmation.'}
              </p>

              <div className="pt-2">
                <WhatsAppButton
                  phoneNumber={settings.whatsapp_number}
                  variant="primary"
                  className="w-full text-center"
                  label="Message on WhatsApp"
                />
              </div>
            </div>

            {/* Business Contact Info Cards */}
            <div className="bg-white border border-rajvi-borderLight rounded-sm p-8 shadow-sm space-y-6">
              <h3 className="font-serif text-xl text-rajvi-textDark font-normal pb-3 border-b border-rajvi-lightGrey">
                {contactCms.direct_channels_title || 'Direct Contact Channels'}
              </h3>

              <div className="space-y-4 text-xs">
                {settings.contact_email && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-rajvi-gold shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-rajvi-textMuted font-semibold">
                        Email Inquiry
                      </span>
                      <a
                        href={`mailto:${settings.contact_email}`}
                        className="text-rajvi-textDark hover:text-rajvi-gold font-medium"
                      >
                        {settings.contact_email}
                      </a>
                    </div>
                  </div>
                )}

                {settings.phone_number && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-rajvi-gold shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-rajvi-textMuted font-semibold">
                        Direct Phone / Call
                      </span>
                      <a
                        href={`tel:${settings.phone_number.replace(/\s+/g, '')}`}
                        className="text-rajvi-textDark hover:text-rajvi-gold font-medium"
                      >
                        {settings.phone_number}
                      </a>
                    </div>
                  </div>
                )}

                {settings.whatsapp_number && (
                  <div className="flex items-start gap-3">
                    <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-rajvi-textMuted font-semibold">
                        WhatsApp Sales Desk
                      </span>
                      <a
                        href={`https://wa.me/${cleanWhatsAppNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-rajvi-textDark hover:text-rajvi-gold font-medium"
                      >
                        {settings.whatsapp_number}
                      </a>
                    </div>
                  </div>
                )}

                {settings.instagram_url && (
                  <div className="flex items-start gap-3">
                    <Instagram className="w-4 h-4 text-rajvi-gold shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-rajvi-textMuted font-semibold">
                        Instagram Atelier
                      </span>
                      <a
                        href={settings.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-rajvi-textDark hover:text-rajvi-gold font-medium"
                      >
                        @rajvidiamonds
                      </a>
                    </div>
                  </div>
                )}

                {settings.business_address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-rajvi-gold shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-rajvi-textMuted font-semibold">
                        Manufacturing Atelier Location
                      </span>
                      <p className="text-rajvi-textDark leading-relaxed">
                        {settings.business_address}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Diamond Inquiry Submission Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-rajvi-borderLight rounded-sm p-8 sm:p-10 shadow-luxury">
              <div className="mb-6 pb-4 border-b border-rajvi-lightGrey">
                <span className="text-[10px] uppercase tracking-widest text-rajvi-gold font-semibold block mb-1">
                  B2B & Private Orders
                </span>
                <h3 className="font-serif text-2xl text-rajvi-textDark font-normal">
                  Send a Cut or Parcel Inquiry
                </h3>
                <p className="text-xs text-rajvi-textMuted mt-1">
                  Our diamond cutting desk will respond within 24 hours with stone availability and calibration specifications.
                </p>
              </div>

              <ContactForm />
            </div>
          </div>
        </div>
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
        variant="floating"
      />
    </div>
  );
}
