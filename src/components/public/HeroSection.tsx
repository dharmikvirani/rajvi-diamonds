'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Sparkles, MessageCircle } from 'lucide-react';
import WhatsAppButton from './WhatsAppButton';

interface HeroSectionProps {
  heading?: string;
  subtitle?: string;
  imageUrl?: string;
  whatsappNumber?: string;
}

export default function HeroSection({
  heading = 'Crafted to Reflect Brilliance.',
  subtitle = 'Discover exceptional fancy-cut diamonds, where precision craftsmanship meets timeless elegance.',
  imageUrl,
  whatsappNumber = '',
}: HeroSectionProps) {
  // Use user-provided macro diamond asset as default, or custom setting
  const bgImage = imageUrl && imageUrl.trim() !== '' && !imageUrl.includes('unsplash.com')
    ? imageUrl.trim()
    : '/images/cuts.jpeg';

  return (
    <section className="relative min-h-[90vh] lg:min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#0D0C0A] text-white">
      {/* Background Diamond Photography & Atmosphere */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bgImage}
          alt="Rajvi Diamonds Macro Fancy Cut Diamond Facets"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-45 scale-100 transition-transform duration-1000 ease-out"
        />
        {/* Sophisticated dark luxury overlays ensuring high contrast & luminous diamond facets */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0C0A]/90 via-[#0D0C0A]/60 to-[#0D0C0A]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0C0A]/95 via-transparent to-[#0D0C0A]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0D0C0A_80%)] opacity-80" />
      </div>

      {/* Subtle Gold Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-rajvi-gold/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24 sm:py-28 flex flex-col items-center">
        {/* Subtle Luxury Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-rajvi-gold/30 bg-[#141311]/80 backdrop-blur-md text-rajvi-goldLight text-[11px] uppercase tracking-[0.28em] font-medium mb-8 shadow-luxuryDark animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-rajvi-gold" />
          <span>Premier Fancy Cut Diamond Manufacturer • Surat</span>
        </div>

        {/* Cinematic Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-normal tracking-tight text-white leading-[1.12] mb-6 max-w-4xl">
          Crafted to Reflect{' '}
          <span className="gold-gradient-text italic font-serif">
            Brilliance.
          </span>
        </h1>

        {/* Supporting Description */}
        <p className="text-white/75 text-base sm:text-lg md:text-xl font-light max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
          {subtitle}
        </p>

        {/* Two CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto">
          {/* Button 1: Explore Our Collection */}
          <a
            href="/collections"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-rajvi-gold hover:bg-rajvi-goldLight text-[#0D0C0A] font-semibold text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-goldGlow hover:scale-105 rounded-sm"
          >
            <span>Explore Our Collection</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          {/* Button 2: Enquire Now */}
          <a
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 border border-rajvi-gold/60 text-rajvi-goldLight hover:bg-rajvi-gold hover:text-[#0D0C0A] font-semibold text-xs uppercase tracking-[0.2em] transition-all duration-300 rounded-sm hover:scale-105"
          >
            <MessageCircle className="w-4 h-4 text-rajvi-gold group-hover:text-[#0D0C0A]" />
            <span>Enquire Now</span>
          </a>
        </div>

        {/* Signature Features Strip */}
        <div className="mt-16 sm:mt-20 w-full pt-8 border-t border-[#2A2722]/80">
          <div className="bg-[#141311]/85 backdrop-blur-md border border-[#2A2722] rounded-sm py-5 px-4 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#2A2722]/80 text-center shadow-luxuryDark">
            <div className="pt-2 sm:pt-0">
              <span className="block text-rajvi-goldLight text-sm sm:text-base font-serif font-medium">Rose Octagone</span>
              <span className="text-[11px] text-white/50 tracking-wider uppercase mt-1 block">Eight-Fold Faceted Dome</span>
            </div>
            <div className="pt-2 sm:pt-0 sm:pl-4">
              <span className="block text-rajvi-goldLight text-sm sm:text-base font-serif font-medium">Tulip Cut</span>
              <span className="text-[11px] text-white/50 tracking-wider uppercase mt-1 block">Floral Petal Silhouette</span>
            </div>
            <div className="pt-2 sm:pt-0 sm:pl-4">
              <span className="block text-rajvi-goldLight text-sm sm:text-base font-serif font-medium">Calibrated Sizes</span>
              <span className="text-[11px] text-white/50 tracking-wider uppercase mt-1 block">Exact Millimeter Parcels</span>
            </div>
            <div className="pt-2 sm:pt-0 sm:pl-4">
              <span className="block text-rajvi-goldLight text-sm sm:text-base font-serif font-medium">Surat Atelier</span>
              <span className="text-[11px] text-white/50 tracking-wider uppercase mt-1 block">Artisan Diamond Cutting</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
