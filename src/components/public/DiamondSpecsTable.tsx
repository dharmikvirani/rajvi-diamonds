import React from 'react';
import { DiamondSpecifications } from '@/lib/types';

interface DiamondSpecsTableProps {
  specifications: DiamondSpecifications;
  shape: string;
}

export default function DiamondSpecsTable({ specifications, shape }: DiamondSpecsTableProps) {
  const specsList = [
    { label: 'Cut & Geometry', value: shape },
    { label: 'Cut Grade', value: specifications.cut_grade || 'Master Artisan Grade' },
    { label: 'Symmetry', value: specifications.symmetry || 'Excellent' },
    { label: 'Polish', value: specifications.polish || 'Excellent' },
    { label: 'Fluorescence', value: specifications.fluorescence || 'None' },
    { label: 'Table / Crown Proportions', value: specifications.table_percentage || 'Calibrated Dome' },
    { label: 'Depth Proportions', value: specifications.depth_percentage || 'Optically Balanced' },
    { label: 'Facet Configuration', value: specifications.facet_count ? `${specifications.facet_count} Facets` : 'Custom Faceted' },
    { label: 'Girdle Style', value: specifications.girdle || 'Polished / Faceted' },
    { label: 'Culet Treatment', value: specifications.culet || 'Precision Finished' },
    { label: 'Crafting Origin', value: specifications.crafting_origin || 'Rajvi Master Lapidary Studio' },
  ];

  const customEntries = specifications.custom_attributes
    ? Object.entries(specifications.custom_attributes)
    : [];

  return (
    <div className="bg-white border border-rajvi-borderLight rounded-sm p-6 sm:p-8 shadow-sm">
      <h3 className="font-serif text-xl sm:text-2xl text-rajvi-textDark font-normal mb-6 pb-3 border-b border-rajvi-lightGrey flex items-center justify-between">
        <span>Cut Specifications & Lapidary Metrics</span>
        <span className="text-xs uppercase tracking-widest text-rajvi-gold font-sans font-semibold">
          Workshop Standard
        </span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 text-xs">
        {specsList.map((item, idx) => (
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
