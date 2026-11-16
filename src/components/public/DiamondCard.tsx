import React from 'react';
import Image from 'next/image';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { Diamond } from '@/lib/types';
import { formatSizeMm } from '@/lib/utils';

interface DiamondCardProps {
  diamond: Diamond;
  theme?: 'dark' | 'light';
}

export default function DiamondCard({ diamond, theme = 'light' }: DiamondCardProps) {
  // Get primary image or first available
  const primaryImage =
    diamond.images.find((img) => img.is_primary) ||
    diamond.images[0] || {
      image_url: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1200&q=80',
      alt_text: diamond.name,
    };

  // Compute available size range
  const availableSizes = diamond.sizes.filter((s) => s.is_available);
  let sizeRangeText = 'Available upon inquiry';
  if (availableSizes.length === 1) {
    sizeRangeText = `${formatSizeMm(availableSizes[0].size_mm)}`;
  } else if (availableSizes.length > 1) {
    const sorted = [...availableSizes].sort((a, b) => a.size_mm - b.size_mm);
    const min = formatSizeMm(sorted[0].size_mm);
    const max = formatSizeMm(sorted[sorted.length - 1].size_mm);
    sizeRangeText = `${min} – ${max}`;
  }

  const isDark = theme === 'dark';

  return (
    <div
      className={`group relative flex flex-col rounded-sm transition-all duration-300 ${
        isDark
          ? 'bg-rajvi-cardDark border border-rajvi-borderDark/80 hover:border-rajvi-gold/60 hover:shadow-luxuryDark'
          : 'bg-white border border-rajvi-borderLight hover:border-rajvi-gold/50 shadow-sm hover:shadow-luxury'
      }`}
    >
      {/* Image Container */}
      <a
        href={`/collections/${diamond.slug}`}
        className="relative aspect-square w-full overflow-hidden bg-rajvi-charcoal/10"
      >
        <Image
          src={primaryImage.image_url}
          alt={primaryImage.alt_text || diamond.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Featured Badge */}
        {diamond.is_featured && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold bg-rajvi-black/85 backdrop-blur-sm text-rajvi-goldLight border border-rajvi-gold/30 rounded-sm">
            <Sparkles className="w-3 h-3 text-rajvi-gold" />
            <span>Featured Cut</span>
          </span>
        )}

        {/* Shape Tag */}
        <span className="absolute bottom-3 left-3 px-2 py-0.5 text-[10px] tracking-wider uppercase bg-white/90 text-rajvi-charcoal font-medium rounded-sm backdrop-blur-sm">
          {diamond.shape}
        </span>

        {/* Color & Clarity Badge */}
        {(diamond.color || diamond.clarity) && (
          <span className="absolute bottom-3 right-3 px-2 py-0.5 text-[10px] tracking-wider uppercase bg-black/80 text-rajvi-goldLight font-medium rounded-sm backdrop-blur-sm border border-rajvi-gold/30">
            {[diamond.color ? `Color ${diamond.color}` : '', diamond.clarity].filter(Boolean).join(' • ')}
          </span>
        )}
      </a>

      {/* Card Details */}
      <div className="p-6 flex flex-col flex-grow justify-between">
        <div>
          {/* Category */}
          {diamond.category && (
            <p className="text-[11px] uppercase tracking-widest text-rajvi-gold font-medium mb-1.5">
              {diamond.category.name}
            </p>
          )}

          {/* Diamond Name */}
          <h3
            className={`font-serif text-xl sm:text-2xl font-normal mb-2 transition-colors ${
              isDark ? 'text-rajvi-offWhite group-hover:text-rajvi-goldLight' : 'text-rajvi-textDark group-hover:text-rajvi-gold'
            }`}
          >
            <a href={`/collections/${diamond.slug}`}>{diamond.name}</a>
          </h3>

          {/* Short Description */}
          <p
            className={`text-xs line-clamp-2 leading-relaxed mb-4 ${
              isDark ? 'text-rajvi-offWhite/70' : 'text-rajvi-textMuted'
            }`}
          >
            {diamond.short_description}
          </p>
        </div>

        {/* Bottom Specs & Action */}
        <div
          className={`pt-4 border-t flex items-center justify-between mt-auto ${
            isDark ? 'border-rajvi-borderDark/60' : 'border-rajvi-lightGrey'
          }`}
        >
          <div>
            <span
              className={`block text-[10px] uppercase tracking-wider ${
                isDark ? 'text-rajvi-muted' : 'text-rajvi-textMuted/80'
              }`}
            >
              Sizes Available
            </span>
            <span
              className={`text-xs font-semibold ${
                isDark ? 'text-rajvi-offWhite' : 'text-rajvi-textDark'
              }`}
            >
              {sizeRangeText}
            </span>
          </div>

          <a
            href={`/collections/${diamond.slug}`}
            className={`inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold transition-colors ${
              isDark
                ? 'text-rajvi-gold hover:text-rajvi-goldLight'
                : 'text-rajvi-textDark hover:text-rajvi-gold'
            }`}
          >
            <span>View Cut</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
