import React from 'react';
import Image from 'next/image';
import { ArrowUpRight, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { Diamond } from '@/lib/types';
import { formatSizeMm } from '@/lib/utils';

interface DiamondCardProps {
  diamond: Diamond;
  theme?: 'dark' | 'light';
}

export default function DiamondCard({ diamond, theme = 'light' }: DiamondCardProps) {
  // Primary image
  const primaryImage =
    diamond.images.find((img) => img.is_primary) ||
    diamond.images[0] || {
      image_url:
        'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1200&q=80',
      alt_text: diamond.name,
    };

  // Secondary image for smooth luxury hover reveal
  const secondaryImage =
    diamond.images.length > 1
      ? diamond.images.find((img) => img.id !== primaryImage.id) || diamond.images[1]
      : null;

  // Available size range calculation
  const availableSizes = diamond.sizes.filter((s) => s.is_available);
  let sizeRangeText = 'Bespoke / Upon Request';
  if (availableSizes.length === 1) {
    sizeRangeText = `${formatSizeMm(availableSizes[0].size_mm)}`;
  } else if (availableSizes.length > 1) {
    const sorted = [...availableSizes].sort((a, b) => a.size_mm - b.size_mm);
    const min = formatSizeMm(sorted[0].size_mm);
    const max = formatSizeMm(sorted[sorted.length - 1].size_mm);
    sizeRangeText = `${min} – ${max}`;
  }

  // Format multi-color display
  const colors =
    diamond.available_colors && diamond.available_colors.length > 0
      ? diamond.available_colors
      : diamond.color
      ? [diamond.color]
      : [];

  let colorText = '';
  if (colors.length === 1) {
    colorText = `Color ${colors[0]}`;
  } else if (colors.length > 1) {
    colorText =
      colors.length <= 3
        ? `Colors ${colors.join(', ')}`
        : `Colors ${colors[0]} – ${colors[colors.length - 1]}`;
  }

  // Format multi-clarity display
  const clarities =
    diamond.available_clarities && diamond.available_clarities.length > 0
      ? diamond.available_clarities
      : diamond.clarity
      ? [diamond.clarity]
      : [];

  let clarityText = '';
  if (clarities.length === 1) {
    clarityText = clarities[0];
  } else if (clarities.length > 1) {
    clarityText =
      clarities.length <= 3
        ? clarities.join(', ')
        : `${clarities[0]} – ${clarities[clarities.length - 1]}`;
  }

  const availability = diamond.availability_status || (availableSizes.length > 0 ? 'Available' : 'Made to Order');
  const isAvailableNow = availability === 'Available';

  const isDark = theme === 'dark';

  return (
    <div
      className={`group relative flex flex-col rounded-sm transition-all duration-300 ${
        isDark
          ? 'bg-rajvi-cardDark border border-rajvi-borderDark/80 hover:border-rajvi-gold/60 hover:shadow-luxuryDark'
          : 'bg-white border border-rajvi-borderLight hover:border-rajvi-gold/50 shadow-sm hover:shadow-luxury'
      }`}
    >
      {/* Image Container with Luxury Dual-Image Hover */}
      <a
        href={`/collections/${diamond.slug}`}
        className="relative aspect-square w-full overflow-hidden bg-rajvi-charcoal/5 block"
        aria-label={`View ${diamond.name} fancy cut details`}
      >
        {/* Primary View */}
        <Image
          src={primaryImage.image_url}
          alt={primaryImage.alt_text || diamond.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover object-center transition-all duration-700 ${
            secondaryImage
              ? 'group-hover:opacity-0 group-hover:scale-105'
              : 'group-hover:scale-105'
          }`}
        />

        {/* Secondary View on Hover (if available) */}
        {secondaryImage && (
          <Image
            src={secondaryImage.image_url}
            alt={secondaryImage.alt_text || `${diamond.name} Perspective`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
          />
        )}

        {/* Subtle Luxury Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

        {/* Featured Badge */}
        {diamond.is_featured && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold bg-rajvi-black/85 backdrop-blur-sm text-rajvi-goldLight border border-rajvi-gold/30 rounded-sm shadow-sm">
            <Sparkles className="w-3 h-3 text-rajvi-gold" />
            <span>Featured Cut</span>
          </span>
        )}

        {/* Availability Badge */}
        <span
          className={`absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 text-[10px] tracking-wider uppercase font-semibold rounded-sm backdrop-blur-sm shadow-sm ${
            isAvailableNow
              ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/40'
              : 'bg-black/75 text-amber-200 border border-amber-500/30'
          }`}
        >
          {isAvailableNow ? (
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          ) : (
            <Clock className="w-3 h-3 text-amber-400" />
          )}
          <span>{availability}</span>
        </span>

        {/* Shape Tag */}
        <span className="absolute bottom-3 left-3 px-2 py-0.5 text-[10px] tracking-wider uppercase bg-white/90 text-rajvi-charcoal font-medium rounded-sm backdrop-blur-sm shadow-sm">
          {diamond.shape}
        </span>

        {/* Multiple Color & Clarity Badge */}
        {(colorText || clarityText) && (
          <span className="absolute bottom-3 right-3 px-2.5 py-0.5 text-[10px] tracking-wider uppercase bg-black/85 text-rajvi-goldLight font-medium rounded-sm backdrop-blur-sm border border-rajvi-gold/30 shadow-sm">
            {[colorText, clarityText].filter(Boolean).join(' • ')}
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
              isDark
                ? 'text-white group-hover:text-rajvi-goldLight'
                : 'text-rajvi-textDark group-hover:text-rajvi-gold'
            }`}
          >
            <a href={`/collections/${diamond.slug}`}>{diamond.name}</a>
          </h3>

          {/* Short Description */}
          <p
            className={`text-xs line-clamp-2 leading-relaxed mb-4 ${
              isDark ? 'text-white/70' : 'text-rajvi-textMuted'
            }`}
          >
            {diamond.short_description}
          </p>

          {/* Specifications Pills Row - Only when actual data exists */}
          {(colors.length > 0 || clarities.length > 0) && (
            <div className="flex flex-wrap items-center gap-1.5 mb-4">
              {colors.length > 0 && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-sm font-medium ${
                    isDark
                      ? 'bg-[#1C1B17] border border-[#2A2722] text-rajvi-goldLight'
                      : 'bg-rajvi-offWhite border border-rajvi-borderLight text-rajvi-textDark'
                  }`}
                >
                  Color: {colors.join(', ')}
                </span>
              )}
              {clarities.length > 0 && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-sm font-medium ${
                    isDark
                      ? 'bg-[#1C1B17] border border-[#2A2722] text-rajvi-goldLight'
                      : 'bg-rajvi-offWhite border border-rajvi-borderLight text-rajvi-textDark'
                  }`}
                >
                  Clarity: {clarities.join(', ')}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Bottom Specs & Action Buttons */}
        <div
          className={`pt-4 border-t flex flex-col gap-3 mt-auto ${
            isDark ? 'border-[#2A2722]' : 'border-rajvi-lightGrey'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-[10px] uppercase tracking-wider ${
                isDark ? 'text-white/50' : 'text-rajvi-textMuted/80'
              }`}
            >
              Sizes Available
            </span>
            <span
              className={`text-xs font-semibold ${
                isDark ? 'text-white/90' : 'text-rajvi-textDark'
              }`}
            >
              {sizeRangeText}
            </span>
          </div>

          {/* Dual CTAs: View Details & Enquire Now */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href={`/collections/${diamond.slug}`}
              className={`inline-flex items-center justify-center gap-1 text-[11px] uppercase tracking-wider font-semibold py-2 px-3 rounded-sm transition-colors text-center ${
                isDark
                  ? 'border border-[#2A2722] text-white/80 hover:text-white hover:border-rajvi-gold/50 bg-[#161513]'
                  : 'border border-rajvi-borderLight text-rajvi-textDark hover:text-rajvi-gold hover:border-rajvi-gold bg-rajvi-offWhite'
              }`}
            >
              <span>View Details</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <a
              href={`/contact?diamond=${diamond.slug}&cut=${encodeURIComponent(diamond.name)}`}
              className="inline-flex items-center justify-center text-[11px] uppercase tracking-wider font-semibold py-2 px-3 rounded-sm bg-rajvi-gold hover:bg-rajvi-goldLight text-[#0D0C0A] transition-colors text-center shadow-sm"
            >
              <span>Enquire Now</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
