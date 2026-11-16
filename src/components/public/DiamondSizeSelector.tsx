'use client';

import React from 'react';
import { DiamondSize } from '@/lib/types';
import { formatSizeMm } from '@/lib/utils';
import { Info, Check } from 'lucide-react';

interface DiamondSizeSelectorProps {
  sizes: DiamondSize[];
  selectedSize: number | null;
  onSelectSize: (size: number | null) => void;
}

export default function DiamondSizeSelector({
  sizes,
  selectedSize,
  onSelectSize,
}: DiamondSizeSelectorProps) {
  // Only display sizes marked active and available
  const availableSizes = sizes
    .filter((s) => s.is_available)
    .sort((a, b) => a.size_mm - b.size_mm);

  if (availableSizes.length === 0) {
    return (
      <div className="bg-rajvi-offWhite border border-rajvi-borderLight p-4 rounded-sm">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-rajvi-gold shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-rajvi-textDark">
              Custom Sizing & Parcel Availability
            </h4>
            <p className="text-xs text-rajvi-textMuted mt-1 leading-relaxed">
              Sizes for this cut are tailored upon order. Please specify your desired dimensions in the inquiry form or on WhatsApp.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs uppercase tracking-widest font-semibold text-rajvi-textDark">
          Select Calibrated Size (Millimeters)
        </label>
        {selectedSize && (
          <button
            onClick={() => onSelectSize(null)}
            className="text-[11px] text-rajvi-gold hover:underline"
          >
            Clear Selection
          </button>
        )}
      </div>

      {/* Interactive Size Pills */}
      <div className="flex flex-wrap gap-2.5">
        {availableSizes.map((item) => {
          const isSelected = selectedSize === item.size_mm;
          return (
            <button
              key={item.id}
              onClick={() => onSelectSize(isSelected ? null : item.size_mm)}
              className={`px-4 py-2.5 rounded-sm text-xs font-semibold tracking-wider transition-all border flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-rajvi-charcoal text-white border-rajvi-charcoal shadow-sm ring-1 ring-rajvi-gold'
                  : 'bg-white text-rajvi-textDark border-rajvi-borderLight hover:border-rajvi-gold/80 hover:bg-rajvi-offWhite'
              }`}
            >
              {isSelected && <Check className="w-3.5 h-3.5 text-rajvi-gold" />}
              <span>{formatSizeMm(item.size_mm)}</span>
            </button>
          );
        })}
      </div>

      {/* Mandatory Availability Notice */}
      <div className="flex items-start gap-2 text-[11px] text-rajvi-textMuted bg-rajvi-offWhite p-2.5 rounded-sm border border-rajvi-borderLight/60">
        <Info className="w-3.5 h-3.5 text-rajvi-gold shrink-0 mt-0.5" />
        <p>
          Sizes shown reflect standard workshop calibration. Final availability, lot parcel counts, and delivery timelines will be confirmed by our team upon inquiry.
        </p>
      </div>
    </div>
  );
}
