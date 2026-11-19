import React from 'react';
import Image from 'next/image';
import { ArrowRight, Compass, Gem, Sparkles, HeartHandshake } from 'lucide-react';
import { SiteSettings } from '@/lib/types';

interface BrandStoryProps {
  settings?: SiteSettings;
  title?: string;
  subtitle?: string;
  badge?: string;
  intro?: string;
  story?: string;
  quote?: string;
  imageUrl?: string;
  imageAlt?: string;
  pillars?: { title: string; description: string; icon?: string }[];
  buttonLabel?: string;
  buttonHref?: string;
}

const iconMap: Record<string, any> = {
  Compass,
  Sparkles,
  Gem,
  HeartHandshake,
};

export default function BrandStory({
  settings,
  title = 'About Rajvi Diamonds',
  subtitle = 'Surat Atelier Heritage',
  badge = 'Surat Atelier Heritage',
  intro,
  story,
  quote = 'A diamond’s true brilliance lies in the harmony of rare geometry and individual cut character.',
  imageUrl = '/images/cuts2.jpeg',
  imageAlt = 'Rajvi Diamonds Artisanal Fancy Cut Diamonds',
  pillars,
  buttonLabel = 'Learn More About Our Journey',
  buttonHref = '/about',
}: BrandStoryProps) {
  const brandIntro =
    intro ||
    settings?.about_brand_intro ||
    'Rajvi Diamonds is a dedicated manufacturer and supplier of premier fancy diamond cuts, serving esteemed jewellery houses, private designers, and international diamond connoisseurs.';

  const brandStory =
    story ||
    settings?.about_story ||
    'Founded with a profound reverence for rare geometric and artisanal silhouettes, Rajvi Diamonds bridges heritage lapidary techniques with modern dimensional precision. Our master diamond polishers coax unprecedented fire and character from rough stones, producing singular fancy cuts that cannot be replicated by automated mass production.';

  const defaultPillars = [
    {
      title: 'Distinctive Cuts',
      description: 'Specialized focus on non-traditional fancy and antique silhouettes.',
      icon: 'Compass',
    },
    {
      title: 'Lapidary Quality',
      description: 'Micro-calibrated facet symmetry and crisp corner integrity.',
      icon: 'Sparkles',
    },
    {
      title: 'Master Craftsmanship',
      description: 'Surat atelier polishing combining generational craft and precision.',
      icon: 'Gem',
    },
    {
      title: 'Customer Relationships',
      description: 'Long-term trust with bespoke jewelers and diamond wholesalers.',
      icon: 'HeartHandshake',
    },
  ];

  const storyPillars = pillars && pillars.length > 0 ? pillars : defaultPillars;

  return (
    <section className="bg-white text-rajvi-textDark py-20 sm:py-24 border-t border-rajvi-borderLight relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-rajvi-gold/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Visual Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-sm overflow-hidden border border-rajvi-borderLight shadow-luxury bg-[#FDFBF7] p-2">
              <div className="relative w-full h-full rounded-sm overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Editorial Quote Box */}
                {quote && (
                  <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/95 backdrop-blur-md border border-rajvi-gold/40 rounded-sm shadow-md">
                    <p className="font-serif text-xs sm:text-sm text-rajvi-textDark italic leading-relaxed">
                      &ldquo;{quote}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-rajvi-gold font-semibold">
              <Gem className="w-4 h-4 text-rajvi-gold" />
              <span>{badge}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-rajvi-textDark font-normal tracking-tight leading-tight">
              {title}
            </h2>

            <div className="space-y-4 text-rajvi-textMuted text-sm sm:text-base leading-relaxed font-light">
              <p>{brandIntro}</p>
              <p>{brandStory}</p>
            </div>

            {/* Dynamic Story Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-rajvi-lightGrey">
              {storyPillars.map((p, idx) => {
                const Icon = (p.icon && iconMap[p.icon]) || Sparkles;
                return (
                  <div key={idx} className="flex items-start gap-3">
                    <Icon className="w-4 h-4 text-rajvi-gold shrink-0 mt-1" />
                    <div>
                      <h4 className="text-xs uppercase tracking-wider font-semibold text-rajvi-textDark">
                        {p.title}
                      </h4>
                      <p className="text-xs text-rajvi-textMuted mt-0.5 font-light">
                        {p.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Learn More CTA */}
            {buttonLabel && (
              <div className="pt-4">
                <a
                  href={buttonHref}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-rajvi-gold hover:text-rajvi-goldMuted font-semibold group"
                >
                  <span>{buttonLabel}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
