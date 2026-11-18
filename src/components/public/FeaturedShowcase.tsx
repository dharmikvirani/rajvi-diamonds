'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, MessageSquare, Gem, Sparkles, CheckCircle2 } from 'lucide-react';
import { Diamond } from '@/lib/types';
import { formatSizeMm } from '@/lib/utils';

interface FeaturedShowcaseProps {
  diamonds: Diamond[];
  whatsappNumber?: string;
}

export default function FeaturedShowcase({
  diamonds,
  whatsappNumber = '',
}: FeaturedShowcaseProps) {
  // Find Rose Octagone and Tulip from real database records
  const roseOctagone = diamonds.find(
    (d) => d.slug === 'rose-octagone' || d.name.toLowerCase().includes('rose')
  ) || diamonds[0];

  const tulip = diamonds.find(
    (d) => d.slug === 'tulip' || d.name.toLowerCase().includes('tulip')
  ) || diamonds[1] || diamonds[0];

  const showcaseItems = [
    {
      diamond: roseOctagone,
      tag: 'Signature Architectural Dome',
      heroImage:
        roseOctagone?.images?.[0]?.image_url ||
        'https://res.cloudinary.com/b2fsbbzr/image/upload/v1794891750/rajvi-diamonds/tef2et2mdtlcxvp3yvlb.jpg',
      alt: 'Rose Octagone Master Faceted Diamond Dome',
      highlightBadge: 'Eight-Fold Symmetry',
      subtitle:
        'A masterwork of geometric precision featuring an eight-fold stepped crown that draws light into a mesmerizing, concentric kaleidoscope of brilliance.',
      sizes:
        roseOctagone?.sizes && roseOctagone.sizes.length > 0
          ? roseOctagone.sizes.map((s) => formatSizeMm(s.size_mm)).join(', ')
          : '4.0 mm, 4.5 mm, 5.0 mm, 5.5 mm, 6.0 mm',
    },
    {
      diamond: tulip,
      tag: 'Organic Botanical Silhouette',
      heroImage:
        tulip?.images?.[0]?.image_url ||
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1400&q=85',
      alt: 'Tulip Cut Fancy Diamond Floral Silhouette',
      highlightBadge: 'Curvilinear Scintillation',
      subtitle:
        'Inspired by petal contours, the Tulip Cut combines soft organic silhouettes with modern facet angles for radiant dispersion and singular distinction.',
      sizes:
        tulip?.sizes && tulip.sizes.length > 0
          ? tulip.sizes.map((s) => formatSizeMm(s.size_mm)).join(', ')
          : 'Bespoke Millimeter / Made to Order',
    },
  ].filter((item) => Boolean(item.diamond));

  if (showcaseItems.length === 0) return null;

  return (
    <section className="py-24 sm:py-32 bg-[#12110F] text-white border-t border-[#2A2722] relative overflow-hidden">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-rajvi-gold/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-rajvi-gold/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-rajvi-gold/30 bg-[#1A1916] text-rajvi-goldLight text-[11px] uppercase tracking-[0.25em] font-medium mb-4 shadow-sm">
            <Gem className="w-3.5 h-3.5 text-rajvi-gold" />
            <span>Artisanal Spotlight</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white leading-tight">
            Spotlight on Signature Cuts
          </h2>
          <p className="mt-4 text-white/70 text-sm sm:text-base leading-relaxed font-light max-w-2xl mx-auto">
            A deeper look into our flagship fancy diamond cuts—each individually oriented to unleash maximum brilliance, facet integrity, and bespoke luxury.
          </p>
        </div>

        {/* Editorial Spotlight Cards (Alternating Layout) */}
        <div className="space-y-20 lg:space-y-28">
          {showcaseItems.map((item, idx) => {
            const isReversed = idx % 2 === 1;
            const diamond = item.diamond!;

            return (
              <div
                key={diamond.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center bg-[#171613] border border-[#2A2722] rounded-sm p-6 sm:p-10 lg:p-12 hover:border-rajvi-gold/50 transition-all duration-500 shadow-luxuryDark group"
              >
                {/* Large Product Photography */}
                <div
                  className={`lg:col-span-7 relative ${
                    isReversed ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-sm overflow-hidden bg-[#0D0C0A] border border-[#2A2722]/80">
                    <Image
                      src={item.heroImage}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0A]/80 via-transparent to-transparent opacity-60" />

                    {/* Badge */}
                    <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 bg-[#0D0C0A]/90 backdrop-blur-md border border-rajvi-gold/40 text-rajvi-goldLight text-[10px] uppercase tracking-widest font-semibold rounded-sm">
                      <Sparkles className="w-3 h-3 text-rajvi-gold" />
                      <span>{item.highlightBadge}</span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/80">
                      <span className="bg-[#0D0C0A]/85 backdrop-blur-sm px-2.5 py-1 rounded-sm border border-[#2A2722] uppercase tracking-wider text-[10px]">
                        Shape: {diamond.shape}
                      </span>
                      <span className="bg-[#0D0C0A]/85 backdrop-blur-sm px-2.5 py-1 rounded-sm border border-[#2A2722] uppercase tracking-wider text-[10px] text-emerald-300">
                        {diamond.availability_status || 'Available'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Editorial Content Column */}
                <div
                  className={`lg:col-span-5 flex flex-col justify-between space-y-6 ${
                    isReversed ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <div>
                    <span className="text-[11px] uppercase tracking-[0.22em] text-rajvi-gold font-semibold block mb-2">
                      {item.tag}
                    </span>
                    <h3 className="font-serif text-3xl sm:text-4xl text-white font-normal tracking-tight mb-4 leading-tight">
                      {diamond.name}
                    </h3>
                    <p className="text-white/75 text-sm sm:text-base leading-relaxed font-light mb-6">
                      {item.subtitle}
                    </p>

                    {/* Available Sizes from Actual Data */}
                    <div className="p-4 bg-[#11100E] border border-[#2A2722] rounded-sm mb-6">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-rajvi-gold font-medium mb-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-rajvi-gold" />
                        <span>Calibrated Millimeter Sizes</span>
                      </div>
                      <p className="text-xs sm:text-sm text-white/90 font-medium">
                        {item.sizes}
                      </p>
                    </div>

                    {/* Color & Clarity info if exists */}
                    {(diamond.available_colors?.length || diamond.available_clarities?.length) && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {diamond.available_colors?.length && (
                          <span className="text-[11px] px-2.5 py-1 bg-[#1C1B17] border border-[#2A2722] rounded-sm text-white/80">
                            Colors: {diamond.available_colors.join(', ')}
                          </span>
                        )}
                        {diamond.available_clarities?.length && (
                          <span className="text-[11px] px-2.5 py-1 bg-[#1C1B17] border border-[#2A2722] rounded-sm text-white/80">
                            Clarity: {diamond.available_clarities.join(', ')}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Two Buttons: Explore Collection & Enquire Now */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                    <a
                      href={`/collections/${diamond.slug}`}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-rajvi-gold hover:bg-rajvi-goldLight text-[#0D0C0A] font-semibold text-xs uppercase tracking-widest rounded-sm transition-all shadow-sm hover:scale-105 text-center"
                    >
                      <span>Explore Collection</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>

                    <a
                      href={`/contact?diamond=${diamond.slug}&cut=${encodeURIComponent(diamond.name)}`}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-[#2A2722] text-white/90 hover:text-white hover:border-rajvi-gold/60 bg-[#141311] font-semibold text-xs uppercase tracking-widest rounded-sm transition-colors text-center"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-rajvi-gold" />
                      <span>Enquire Now</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}