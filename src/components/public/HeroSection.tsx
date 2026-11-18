'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Sparkles, MessageCircle, Gem } from 'lucide-react';

interface HeroSectionProps {
  heading?: string;
  subtitle?: string;
  badge?: string;
  imageUrl?: string;
  imageAlt?: string;
  buttons?: { label: string; href: string; variant?: string }[];
  items?: { id?: string; title: string; highlight: string; icon?: string }[];
  whatsappNumber?: string;
}

export default function HeroSection({
  heading = 'The Art of Extraordinary Diamonds',
  subtitle = 'Specializing in rare fancy-cut geometries, artisanal rose faceting, and calibrated millimeter parcels crafted with generational lapidary mastery in Surat.',
  badge = 'Fancy Cut Diamond Manufacturer • Surat',
  imageUrl,
  imageAlt = 'Rajvi Diamonds Rose Octagone Fancy Cut Macro Facets',
  buttons,
  items,
  whatsappNumber = '',
}: HeroSectionProps) {
  // Use authentic Rose Octagone Cloudinary macro photography as the primary spotlight diamond
  const heroDiamondImage =
    imageUrl && imageUrl.trim() !== '' && !imageUrl.includes('unsplash.com') && !imageUrl.includes('tef2et2mdtlcxvp3yvlb')
      ? imageUrl.trim()
      : 'https://res.cloudinary.com/b2fsbbzr/image/upload/v1794978442/rose-octagone-cut.png';

  const defaultButtons = [
    { label: 'Explore Collections', href: '/collections', variant: 'primary' },
    { label: 'Enquire Now', href: '/contact', variant: 'outline' },
  ];

  const actionButtons = buttons && buttons.length > 0 ? buttons : defaultButtons;

  const defaultItems = [
    { title: 'Rose Octagone', highlight: '8-Fold Dome' },
    { title: 'Tulip Cut', highlight: 'Floral Petal Silhouette' },
    { title: 'Calibrated Parcels', highlight: 'Precision Sizing' },
  ];

  const hallmarkPills = items && items.length > 0 ? items : defaultItems;

  return (
    <section className="relative min-h-[85vh] lg:min-h-[88vh] flex items-center justify-center overflow-hidden bg-[#0D0C0A] text-white py-16 sm:py-20 lg:py-24">
      {/* Subtle Warm Gold Ambient Glow */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-rajvi-gold/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[450px] h-[350px] bg-rajvi-gold/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Subtle Luxury Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-rajvi-gold/30 bg-[#161512]/90 backdrop-blur-md text-rajvi-goldLight text-[11px] uppercase tracking-[0.25em] font-medium mb-6 shadow-sm">
              <Gem className="w-3.5 h-3.5 text-rajvi-gold" />
              <span>{badge}</span>
            </div>

            {/* Headline: The Art of Extraordinary Diamonds */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-normal tracking-tight text-white leading-[1.12] mb-6">
              {heading.includes('The Art of') ? (
                <>
                  The Art of{' '}
                  <span className="gold-gradient-text italic font-serif">
                    {heading.replace('The Art of', '').trim() || 'Extraordinary Diamonds'}
                  </span>
                </>
              ) : (
                heading
              )}
            </h1>

            {/* Concise Supporting Description */}
            <p className="text-white/75 text-base sm:text-lg font-light max-w-xl mb-8 leading-relaxed font-sans">
              {subtitle}
            </p>

            {/* Dynamic Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
              {actionButtons.map((btn, bIdx) => (
                <a
                  key={bIdx}
                  href={btn.href || (btn.variant === 'primary' ? '/collections' : '/contact')}
                  className={`inline-flex items-center justify-center gap-3 px-8 py-3.5 font-semibold text-xs uppercase tracking-[0.2em] transition-all duration-300 rounded-sm text-center hover:scale-105 ${
                    btn.variant === 'primary'
                      ? 'bg-rajvi-gold hover:bg-rajvi-goldLight text-[#0D0C0A] shadow-goldGlow'
                      : 'border border-rajvi-gold/60 text-rajvi-goldLight hover:bg-rajvi-gold hover:text-[#0D0C0A]'
                  }`}
                >
                  {btn.variant === 'outline' && <MessageCircle className="w-4 h-4 text-rajvi-gold" />}
                  <span>{btn.label}</span>
                  {btn.variant === 'primary' && <ArrowRight className="w-4 h-4" />}
                </a>
              ))}
            </div>

            {/* Dynamic Hallmark Cuts Quick Pills */}
            <div className="pt-6 border-t border-[#2A2722]/80 w-full flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-white/60">
              {hallmarkPills.map((pill, pIdx) => (
                <React.Fragment key={pIdx}>
                  {pIdx > 0 && <span className="text-[#2A2722] hidden sm:inline">•</span>}
                  <span className="flex items-center gap-1.5 text-white/80">
                    <Sparkles className="w-3.5 h-3.5 text-rajvi-gold" />
                    <strong className="text-rajvi-goldLight font-medium">{pill.title}:</strong> {pill.highlight}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right Column: High-Visibility Real Diamond Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square w-full rounded-sm overflow-hidden bg-[#141311] border border-[#2A2722] shadow-luxuryDark group">
              <Image
                src={heroDiamondImage}
                alt={imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Minimal gradient at base only for caption readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0A]/90 via-transparent to-transparent opacity-80" />

              {/* Top Authentic Cut Badge */}
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 bg-[#0D0C0A]/90 backdrop-blur-md border border-rajvi-gold/40 text-rajvi-goldLight text-[10px] uppercase tracking-widest font-semibold rounded-sm">
                <Sparkles className="w-3 h-3 text-rajvi-gold" />
                <span>Featured Cut • Rose Octagone</span>
              </div>

              {/* Bottom Cut Label */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
                <div>
                  <span className="block font-serif text-base text-white font-medium">
                    Rose Octagone
                  </span>
                  <span className="text-[11px] text-white/60 font-light">
                    Calibrated: 4.0 mm – 6.0 mm
                  </span>
                </div>
                <a
                  href="/collections/rose-octagone"
                  className="px-3 py-1.5 bg-rajvi-gold/90 hover:bg-rajvi-gold text-[#0D0C0A] text-[10px] uppercase tracking-wider font-semibold rounded-sm transition-colors"
                >
                  View Cut
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}