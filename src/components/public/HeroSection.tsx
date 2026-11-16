'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import WhatsAppButton from './WhatsAppButton';

interface HeroSectionProps {
  heading?: string;
  subtitle?: string;
  imageUrl?: string;
  whatsappNumber?: string;
}

export default function HeroSection({
  heading = 'The Art of Extraordinary Diamonds',
  subtitle = 'Discover exceptional fancy diamond cuts crafted for brilliance.',
  imageUrl,
  whatsappNumber = '',
}: HeroSectionProps) {
  const defaultImage =
    'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=2000&q=85';
  const bgImage = imageUrl && imageUrl.trim() !== '' ? imageUrl.trim() : defaultImage;

  const hasExtraordinary = heading.includes('Extraordinary Diamonds');
  const mainPart = hasExtraordinary
    ? heading.replace('Extraordinary Diamonds', '').trim()
    : heading;

  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-white to-rajvi-offWhite">
      {/* Background Diamond Photography & Atmosphere */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bgImage}
          alt="Rajvi Diamonds Pure Loose Diamond Facets"
          fill
          priority
          className="object-cover object-center opacity-65 scale-100 transition-transform duration-1000"
        />
        {/* Soft light luxury overlays that keep the diamond photo clearly visible while preserving dark text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/30 to-rajvi-offWhite/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-transparent to-white/60" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        {/* Subtle Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-rajvi-gold/40 bg-white/90 backdrop-blur-sm text-rajvi-goldMuted text-[11px] uppercase tracking-[0.25em] font-medium mb-8 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-rajvi-gold" />
          <span>Premier Fancy Diamond Manufacturer</span>
        </div>

        {/* Cinematic Heading */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-rajvi-textDark leading-[1.15] mb-6">
          <span className="block">{mainPart}</span>{' '}
          {hasExtraordinary && (
            <span className="gold-gradient-text italic font-normal">
              Extraordinary Diamonds
            </span>
          )}
        </h1>

        {/* Subtitle */}
        <p className="text-rajvi-textMuted text-base sm:text-xl font-light max-w-2xl mx-auto mb-10 leading-relaxed">
          {subtitle}
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <a
            href="/collections"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-rajvi-gold hover:bg-rajvi-goldLight text-rajvi-black font-semibold text-xs uppercase tracking-widest transition-all duration-300 shadow-md hover:scale-105"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <WhatsAppButton
            phoneNumber={whatsappNumber}
            variant="outline"
            label="Inquire via WhatsApp"
            className="w-full sm:w-auto bg-white border border-rajvi-gold text-rajvi-gold hover:bg-rajvi-gold hover:text-white shadow-sm"
          />
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 pt-8 border-t border-rajvi-borderLight/80">
          <div className="bg-white/85 backdrop-blur-sm border border-rajvi-borderLight/80 rounded-sm shadow-sm py-6 px-4 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-rajvi-borderLight/60 text-center">
            <div className="pt-3 sm:pt-0">
              <span className="block text-rajvi-gold text-sm sm:text-base font-serif font-medium">Rose Octagone</span>
              <span className="text-[11px] text-rajvi-textMuted tracking-wider uppercase mt-1 block">Eight-Fold Geometric Dome</span>
            </div>
            <div className="pt-3 sm:pt-0 sm:pl-4">
              <span className="block text-rajvi-gold text-sm sm:text-base font-serif font-medium">Tulip Cut</span>
              <span className="text-[11px] text-rajvi-textMuted tracking-wider uppercase mt-1 block">Floral Petal Silhouette</span>
            </div>
            <div className="pt-3 sm:pt-0 sm:pl-4">
              <span className="block text-rajvi-gold text-sm sm:text-base font-serif font-medium">Bespoke Millimeter</span>
              <span className="text-[11px] text-rajvi-textMuted tracking-wider uppercase mt-1 block">Calibrated Parcel Sizes</span>
            </div>
            <div className="pt-3 sm:pt-0 sm:pl-4">
              <span className="block text-rajvi-gold text-sm sm:text-base font-serif font-medium">Trade Direct</span>
              <span className="text-[11px] text-rajvi-textMuted tracking-wider uppercase mt-1 block">Wholesaler & Atelier Inquiries</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
