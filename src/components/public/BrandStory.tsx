import React from 'react';
import Image from 'next/image';
import { ArrowRight, Compass, Gem } from 'lucide-react';
import { SiteSettings } from '@/lib/types';

interface BrandStoryProps {
  settings: SiteSettings;
}

export default function BrandStory({ settings }: BrandStoryProps) {
  return (
    <section className="bg-rajvi-charcoal py-24 border-t border-b border-rajvi-borderDark/60 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Visual Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-sm overflow-hidden border border-rajvi-gold/20 shadow-luxuryDark">
              <Image
                src="https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1200&q=85"
                alt="Rajvi Diamonds Lapidary Artistry"
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rajvi-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-rajvi-black/90 backdrop-blur-md border border-rajvi-gold/30 rounded-sm">
                <p className="font-serif text-sm text-rajvi-goldLight italic">
                  &ldquo;A diamond’s true brilliance lies not in mass repetition, but in the harmony of rare geometry and individual cut character.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Right Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-rajvi-gold font-semibold">
              <Gem className="w-4 h-4 text-rajvi-gold" />
              <span>Artisanal Fancy Lapidary</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-rajvi-offWhite font-normal tracking-tight leading-tight">
              Crafting Fancy Diamond Cuts of Unrivaled Individuality
            </h2>

            <div className="space-y-4 text-rajvi-offWhite/80 text-sm sm:text-base leading-relaxed">
              <p>
                {settings.about_brand_intro ||
                  'Rajvi Diamonds is a dedicated manufacturer and supplier of premier fancy diamond cuts, serving esteemed jewellery houses, private designers, and international diamond connoisseurs.'}
              </p>
              <p className="text-rajvi-offWhite/70">
                {settings.about_story ||
                  'Founded with a profound reverence for rare geometric and artisanal silhouettes, Rajvi Diamonds bridges heritage lapidary techniques with modern dimensional precision. Our master diamond polishers coax unprecedented fire and character from rough stones, producing singular fancy cuts that cannot be replicated by automated mass production.'}
              </p>
            </div>

            {/* Quick Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-rajvi-borderDark">
              <div className="flex items-start gap-3">
                <Compass className="w-5 h-5 text-rajvi-gold shrink-0 mt-1" />
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-rajvi-offWhite">
                    Geometric Rigor
                  </h4>
                  <p className="text-xs text-rajvi-muted mt-0.5">
                    Micro-calibrated facet symmetry and crisp corner integrity.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Gem className="w-5 h-5 text-rajvi-gold shrink-0 mt-1" />
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-rajvi-offWhite">
                    Direct Trade Partnership
                  </h4>
                  <p className="text-xs text-rajvi-muted mt-0.5">
                    Tailored parcels for wholesalers and high jewellery ateliers.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <a
                href="/about"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-rajvi-gold hover:text-rajvi-goldLight font-semibold group"
              >
                <span>Read Full Brand Story</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
