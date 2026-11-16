import React from 'react';
import { DiamondSpecifications } from '@/lib/types';

interface DiamondSpecsTableProps {
  specifications: DiamondSpecifications;
  shape: string;
  cutName?: string;
  size?: string | null;
  color?: string | null;
  clarity?: string | null;
}

export default function DiamondSpecsTable({
  specifications,
  shape,
  cutName,
  size,
  color,
  clarity,
}: DiamondSpecsTableProps) {
  const primarySpecs: { label: string; value: string }[] = [];

  if (cutName) primarySpecs.push({ label: 'Cut', value: cutName });
  if (shape && shape !== cutName) primarySpecs.push({ label: 'Shape / Geometry', value: shape });
  if (size) primarySpecs.push({ label: 'Size', value: size });
  if (color) primarySpecs.push({ label: 'Color', value: color });
  if (clarity) primarySpecs.push({ label: 'Purity / Clarity', value: clarity });

  const lapidarySpecs = [
    { label: 'Cut Grade', value: specifications?.cut_grade || 'Master Artisan Grade' },
    { label: 'Symmetry', value: specifications?.symmetry || 'Excellent' },
    { label: 'Polish', value: specifications?.polish || 'Excellent' },
    { label: 'Fluorescence', value: specifications?.fluorescence || 'None' },
    specifications?.table_percentage ? { label: 'Table / Crown Proportions', value: specifications.table_percentage } : null,
    specifications?.depth_percentage ? { label: 'Depth Proportions', value: specifications.depth_percentage } : null,
    specifications?.facet_count ? { label: 'Facet Configuration', value: `${specifications.facet_count} Facets` } : null,
    specifications?.girdle ? { label: 'Girdle Style', value: specifications.girdle } : null,
    specifications?.culet ? { label: 'Culet Treatment', value: specifications.culet } : null,
    { label: 'Crafting Origin', value: specifications?.crafting_origin || 'Rajvi Master Lapidary Studio' },
  ].filter((item): item is { label: string; value: string } => Boolean(item && item.value && String(item.value).trim() !== ''));

  const customEntries = specifications?.custom_attributes
    ? Object.entries(specifications.custom_attributes).filter(([_, val]) => val && String(val).trim() !== '')
    : [];

  const allSpecs = [...primarySpecs, ...lapidarySpecs];

  return (
    <div className="bg-white border border-rajvi-borderLight rounded-sm p-6 sm:p-8 shadow-sm">
      <h3 className="font-serif text-xl sm:text-2xl text-rajvi-textDark font-normal mb-6 pb-3 border-b border-rajvi-lightGrey flex items-center justify-between">
        <span>Cut Specifications & Lapidary Metrics</span>
        <span className="text-xs uppercase tracking-widest text-rajvi-gold font-sans font-semibold">
          Workshop Standard
        </span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 text-xs">
        {allSpecs.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between py-2 border-b border-rajvi-lightGrey/60"
          >
            <span className="text-rajvi-textMuted uppercase tracking-wider font-medium text-[11px]">
              {item.label}
            </span>
            <span className="text-rajvi-textDark font-semibold text-right">
              {item.value}
            </span>
          </div>
        ))}

        {/* Custom attributes if present */}
        {customEntries.map(([key, val]) => (
          <div
            key={key}
            className="flex items-center justify-between py-2 border-b border-rajvi-lightGrey/60"
          >
            <span className="text-rajvi-textMuted uppercase tracking-wider font-medium text-[11px]">
              {key}
            </span>
            <span className="text-rajvi-textDark font-semibold text-right">
              {val}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 text-[11px] text-rajvi-textMuted leading-relaxed">
        * Specifications represent average workshop benchmarks for this cut. Each individual diamond parcel is calibrated to ensure maximal optical performance and facet cohesion.
      </div>
    </div>
  );
}
