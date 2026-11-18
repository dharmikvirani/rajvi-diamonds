import React from 'react';
import Image from 'next/image';
import { ArrowRight, Compass, Gem, Sparkles, HeartHandshake } from 'lucide-react';
import { SiteSettings } from '@/lib/types';

interface BrandStoryProps {
  settings: SiteSettings;
}

export default function BrandStory({ settings }: BrandStoryProps) {
  const brandIntro =
    settings.about_brand_intro ||
    'Rajvi Diamonds is a dedicated manufacturer and supplier of premier fancy diamond cuts, serving esteemed jewellery houses, private designers, and international diamond connoisseurs.';

  const brandStory =
    settings.about_story ||
    'Founded with a profound reverence for rare geometric and artisanal silhouettes, Rajvi Diamonds bridges heritage lapidary techniques with modern dimensional precision. Our master diamond polishers coax unprecedented fire and character from rough stones, producing singular fancy cuts that cannot be replicated by automated mass production.';

  return (
    <section className="bg-[#0D0C0A] text-white py-24 sm:py-32 border-t border-[#2A2722] relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-rajvi-gold/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Visual Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-sm overflow-hidden border border-[#2A2722] shadow-luxuryDark bg-[#141311] p-2">
              <div className="relative w-full h-full rounded-sm overflow-hidden">
                <Image
                  src="/images/cuts2.jpeg"
                  alt="Rajvi Diamonds Artisanal Fancy Cut Diamonds"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0A]/90 via-[#0D0C0A]/30 to-transparent" />
                
                {/* Editorial Quote Box */}
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#141311]/90 backdrop-blur-md border border-rajvi-gold/30 rounded-sm shadow-md">
                  <p className="font-serif text-xs sm:text-sm text-white/90 italic leading-relaxed">
                    &ldquo;A diamond’s true brilliance lies not in mass repetition, but in the harmony of rare geometry and individual cut character.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-rajvi-gold font-semibold">
              <Gem className="w-4 h-4 text-rajvi-gold" />
              <span>Heritage & Artistry</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-normal tracking-tight leading-tight">
              The Rajvi Diamonds Story
            </h2>

            <div className="space-y-4 text-white/75 text-sm sm:text-base leading-relaxed font-light">
              <p>{brandIntro}</p>
              <p>{brandStory}</p>
            </div>

            {/* 4 Story Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#2A2722]">
              <div className="flex items-start gap-3">
                <Compass className="w-4 h-4 text-rajvi-gold shrink-0 mt-1" />
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-white">
                    Distinctive Cuts
                  </h4>
                  <p className="text-xs text-white/60 mt-0.5 font-light">
                    Specialized focus on non-traditional fancy and antique silhouettes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-rajvi-gold shrink-0 mt-1" />
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-white">
                    Lapidary Quality
                  </h4>
                  <p className="text-xs text-white/60 mt-0.5 font-light">
                    Micro-calibrated facet symmetry and crisp corner integrity.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Gem className="w-4 h-4 text-rajvi-gold shrink-0 mt-1" />
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-white">
                    Master Craftsmanship
                  </h4>
                  <p className="text-xs text-white/60 mt-0.5 font-light">
                    Surat atelier polishing combining generational craft and precision.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <HeartHandshake className="w-4 h-4 text-rajvi-gold shrink-0 mt-1" />
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-white">
                    Customer Relationships
                  </h4>
                  <p className="text-xs text-white/60 mt-0.5 font-light">
                    Long-term trust with bespoke jewelers and diamond wholesalers.
                  </p>
                </div>
              </div>
            </div>

            {/* Learn More CTA */}
            <div className="pt-4">
              <a
                href="/about"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-rajvi-gold hover:text-rajvi-goldLight font-semibold group"
              >
                <span>Learn More About Our Journey</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
