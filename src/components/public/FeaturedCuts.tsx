import React from 'react';
import { Diamond } from '@/lib/types';
import DiamondCard from './DiamondCard';
import { ArrowRight } from 'lucide-react';

interface FeaturedCutsProps {
  diamonds: Diamond[];
}

export default function FeaturedCuts({ diamonds }: FeaturedCutsProps) {
  if (!diamonds || diamonds.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-24 border-t border-rajvi-borderLight">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] text-rajvi-gold font-semibold block mb-3">
              Curated Masterpieces
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-rajvi-textDark font-normal tracking-tight">
              Featured Diamond Cuts
            </h2>
            <p className="mt-4 text-rajvi-textMuted text-sm sm:text-base leading-relaxed">
              Explore our signature fancy cut silhouettes, each meticulously proportioned to deliver extraordinary scintillation, distinctive character, and artistic grandeur.
            </p>
          </div>

          <a
            href="/collections"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-rajvi-gold hover:text-rajvi-goldMuted font-semibold transition-colors group self-start md:self-auto"
          >
            <span>View All Collections</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* Diamond Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {diamonds.map((diamond) => (
            <DiamondCard key={diamond.id} diamond={diamond} theme="light" />
          ))}
        </div>
      </div>
    </section>
  );
}
