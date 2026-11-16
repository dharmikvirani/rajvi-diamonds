import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import WhatsAppButton from '@/components/public/WhatsAppButton';
import InquiryCTA from '@/components/public/InquiryCTA';
import { getSiteSettings } from '@/lib/db';
import { Sparkles, ShieldCheck, Eye, Compass, HeartHandshake } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Rajvi Diamonds | Artisanal Fancy Diamond Cutters',
  description:
    'Learn about Rajvi Diamonds, our devotion to fancy cut lapidary craftsmanship, geometric precision, and trusted wholesale diamond relationships.',
};

export const revalidate = 60;

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen bg-rajvi-offWhite text-rajvi-textDark flex flex-col">
      {/* Header */}
      <Header
        whatsappNumber={settings.whatsapp_number}
        brandName={settings.brand_name}
      />

      {/* Hero Section (Light Luxury Theme) */}
      <section className="relative py-24 sm:py-32 bg-gradient-to-b from-[#FAF8F5] via-white to-rajvi-offWhite border-b border-rajvi-borderLight overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-rajvi-gold/40 bg-white/90 text-rajvi-goldMuted text-xs uppercase tracking-[0.2em] font-medium mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-rajvi-gold" />
            <span>The Heritage of Artistry</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-normal tracking-tight text-rajvi-textDark mb-6 leading-tight max-w-4xl mx-auto">
            Dedicated Exclusively to the World of <span className="gold-gradient-text italic">Fancy Cut Diamonds</span>
          </h1>

          <p className="text-rajvi-textMuted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-light">
            {settings.about_brand_intro}
          </p>
        </div>
      </section>

      {/* Section 2: The Rajvi Diamonds Story (Light Editorial Section) */}
      <section className="bg-white text-rajvi-textDark py-24 border-b border-rajvi-borderLight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Story Text */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] text-rajvi-gold font-semibold block">
                Our Genesis & Ethos
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-rajvi-textDark font-normal tracking-tight leading-tight">
                Beyond Standard Brilliant Cuts: Coaxing Rare Character from Rough Diamonds
              </h2>
              <div className="prose max-w-none text-xs sm:text-sm text-rajvi-textMuted leading-relaxed space-y-4">
                <p>{settings.about_story}</p>
                <p>
                  While conventional commercial cutting prioritizes automated yield and uniform round brilliants, Rajvi Diamonds embraces the distinct discipline of fancy shapes. We see beauty in geometry, architectural symmetry, and historical rose faceting that diffuse light with subtle, hypnotic warmth.
                </p>
              </div>
            </div>

            {/* Visual Photography */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] rounded-sm overflow-hidden border border-rajvi-borderLight shadow-luxury bg-white p-2">
                <div className="relative w-full h-full rounded-sm overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1750767323874-5946ad2c7e91?auto=format&fit=crop&w=1200&q=85"
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
              Our Core Expertise
            </h2>
            <p className="mt-4 text-rajvi-textMuted text-sm sm:text-base leading-relaxed">
              {settings.about_expertise}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-rajvi-borderLight p-8 rounded-sm shadow-sm hover:shadow-luxury transition-all">
              <Compass className="w-8 h-8 text-rajvi-gold mb-4" />
              <h3 className="font-serif text-xl text-rajvi-textDark mb-3 font-normal">
                Geometric Facet Alignment
              </h3>
              <p className="text-xs sm:text-sm text-rajvi-textMuted leading-relaxed">
                Precision orientation of facet angles ensures internal light bounce rather than light leakage, creating fire and dispersion unique to non-round fancy cuts.
              </p>
            </div>

            <div className="bg-white border border-rajvi-borderLight p-8 rounded-sm shadow-sm hover:shadow-luxury transition-all">
              <ShieldCheck className="w-8 h-8 text-rajvi-gold mb-4" />
              <h3 className="font-serif text-xl text-rajvi-textDark mb-3 font-normal">
                Quality Commitment
              </h3>
              <p className="text-xs sm:text-sm text-rajvi-textMuted leading-relaxed">
                {settings.about_quality}
              </p>
            </div>

            <div className="bg-white border border-rajvi-borderLight p-8 rounded-sm shadow-sm hover:shadow-luxury transition-all">
              <HeartHandshake className="w-8 h-8 text-rajvi-gold mb-4" />
              <h3 className="font-serif text-xl text-rajvi-textDark mb-3 font-normal">
                Our Vision
              </h3>
              <p className="text-xs sm:text-sm text-rajvi-textMuted leading-relaxed">
                {settings.about_vision}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry CTA */}
      <InquiryCTA whatsappNumber={settings.whatsapp_number} />

      {/* Footer */}
      <Footer settings={settings} />

      {/* Floating WhatsApp Action */}
      <WhatsAppButton
        phoneNumber={settings.whatsapp_number}
        variant="floating"
      />
    </div>
  );
}
