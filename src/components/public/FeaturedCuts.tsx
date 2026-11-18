import React from 'react';
import { Diamond } from '@/lib/types';
import DiamondCard from './DiamondCard';
import { ArrowRight, Sparkles } from 'lucide-react';

interface FeaturedCutsProps {
  diamonds: Diamond[];
  theme?: 'dark' | 'light';
  title?: string;
  subtitle?: string;
  badge?: string;
  buttonLabel?: string;
  buttonHref?: string;
}

export default function FeaturedCuts({
  diamonds,
  theme = 'dark',
  title = 'Featured Diamond Collections',
  subtitle = 'Discover distinctive diamond cuts crafted with precision.',
  badge = 'Curated Masterpieces',
  buttonLabel = 'View Complete Catalogue',
  buttonHref = '/collections',
}: FeaturedCutsProps) {
  if (!diamonds || diamonds.length === 0) {
    return null;
  }

  const isDark = theme === 'dark';

  return (
    <section
      className={`py-20 sm:py-24 border-t ${
        isDark
          ? 'bg-[#0D0C0A] text-white border-[#2A2722]'
          : 'bg-white text-rajvi-textDark border-rajvi-borderLight'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-rajvi-gold font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{badge}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight leading-tight">
              {title}
            </h2>
            <p
              className={`mt-3 text-sm sm:text-base leading-relaxed font-light ${
                isDark ? 'text-white/70' : 'text-rajvi-textMuted'
              }`}
            >
              {subtitle}
            </p>
          </div>

          <a
            href={buttonHref}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-rajvi-gold hover:text-rajvi-goldLight font-semibold transition-colors group self-start md:self-auto"
          >
            <span>{buttonLabel}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* Diamond Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {diamonds.map((diamond) => (
            <DiamondCard
              key={diamond.id}
              diamond={diamond}
              theme={theme}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
