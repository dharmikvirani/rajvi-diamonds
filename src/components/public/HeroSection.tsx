'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import WhatsAppButton from './WhatsAppButton';

interface HeroSectionProps {
  heading?: string;
  subtitle?: string;
  whatsappNumber?: string;
}

export default function HeroSection({
  heading = 'The Art of Extraordinary Diamonds',
  subtitle = 'Discover exceptional fancy diamond cuts crafted for brilliance.',
  whatsappNumber = '+919876543210',
}: HeroSectionProps) {
  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden bg-rajvi-black">
      {/* Background Diamond Photography & Atmosphere */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=2000&q=85"
          alt="Rajvi Diamonds Luxury Fancy Diamond Craftsmanship"
          fill
          priority
          className="object-cover object-center opacity-25 scale-105 transition-transform duration-1000"
        />
        {/* Deep luxury vignette gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-rajvi-black via-rajvi-black/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-rajvi-black via-transparent to-rajvi-black" />
        <div className="absolute inset-0 bg-radial-vignette opacity-70" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        {/* Subtle Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-rajvi-gold/30 bg-rajvi-charcoal/60 backdrop-blur-sm text-rajvi-goldLight text-[11px] uppercase tracking-[0.25em] font-medium mb-8">
          <Sparkles className="w-3.5 h-3.5 text-rajvi-gold" />
          <span>Premier Fancy Diamond Manufacturer</span>
        </div>

        {/* Cinematic Heading */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-rajvi-offWhite leading-[1.1] mb-6">
          <span className="block">{heading.split('Extraordinary')[0]}</span>
          <span className="gold-gradient-text italic font-normal">
            Extraordinary Diamonds
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-rajvi-offWhite/80 text-base sm:text-xl font-light max-w-2xl mx-auto mb-10 leading-relaxed">
          {subtitle}
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <a
            href="/collections"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-rajvi-gold hover:bg-rajvi-goldLight text-rajvi-black font-semibold text-xs uppercase tracking-widest transition-all duration-300 shadow-goldGlow hover:scale-105"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <WhatsAppButton
            phoneNumber={whatsappNumber}
            variant="outline"
            label="Inquire via WhatsApp"
            className="w-full sm:w-auto"
          />
        </div>

        {/* Subtle Feature Tickers */}
        <div className="mt-16 pt-8 border-t border-rajvi-borderDark/40 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-xs text-rajvi-offWhite/60 tracking-wider uppercase font-medium">
          <div>
            <span className="block text-rajvi-gold text-sm font-serif">Rose Octagone</span>
            <span className="text-[10px] text-rajvi-muted">Eight-Fold Geometric Dome</span>
          </div>
          <div>
            <span className="block text-rajvi-gold text-sm font-serif">Tulip Cut</span>
            <span className="text-[10px] text-rajvi-muted">Floral Petal Silhouette</span>
          </div>
          <div>
            <span className="block text-rajvi-gold text-sm font-serif">Bespoke Millimeter</span>
            <span className="text-[10px] text-rajvi-muted">Calibrated Parcel Sizes</span>
          </div>
          <div>
            <span className="block text-rajvi-gold text-sm font-serif">Trade Direct</span>
            <span className="text-[10px] text-rajvi-muted">Wholesaler & Atelier Inquiries</span>
          </div>
        </div>
      </div>
    </section>
  );
}
