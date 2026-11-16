import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: number | string;
  subValue?: string;
  icon: LucideIcon;
  badge?: string;
}

export default function StatsCard({
  label,
  value,
  subValue,
  icon: Icon,
  badge,
}: StatsCardProps) {
  return (
    <div className="bg-[#1C1A17] border border-rajvi-borderDark/80 p-6 rounded-sm shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] uppercase tracking-wider text-rajvi-offWhite/60 font-semibold">
          {label}
        </span>
        <div className="w-9 h-9 rounded-sm bg-rajvi-charcoal border border-rajvi-borderDark flex items-center justify-center text-rajvi-gold">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <span className="font-serif text-3xl font-normal text-rajvi-offWhite">
          {value}
        </span>
        {badge && (
          <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-sm bg-rajvi-gold/20 text-rajvi-goldLight border border-rajvi-gold/40">
            {badge}
          </span>
        )}
      </div>

      {subValue && (
        <span className="text-xs text-rajvi-offWhite/50 mt-2 block">
          {subValue}
        </span>
      )}
    </div>
  );
}
