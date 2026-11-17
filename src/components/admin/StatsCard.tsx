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
    <div className="bg-[#1C1A17] border border-rajvi-borderDark/80 p-6 sm:p-7 rounded-sm shadow-sm hover:border-rajvi-gold/30 transition-all flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[12px] sm:text-[13px] font-sans uppercase tracking-wider text-rajvi-offWhite/75 font-medium">
          {label}
        </span>
        <div className="w-10 h-10 rounded-sm bg-[#24221E] border border-rajvi-borderDark flex items-center justify-center text-rajvi-gold shrink-0">
          <Icon className="w-[18px] h-[18px]" />
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <span className="font-serif text-3xl sm:text-[34px] font-normal text-rajvi-offWhite leading-none">
          {value}
        </span>
        {badge && (
          <span className="text-[11px] font-sans uppercase tracking-wide font-semibold px-2.5 py-0.5 rounded-sm bg-rajvi-gold/15 text-rajvi-gold border border-rajvi-gold/30">
            {badge}
          </span>
        )}
      </div>

      {subValue && (
        <span className="text-[12px] font-sans text-rajvi-offWhite/60 mt-3 block leading-normal">
          {subValue}
        </span>
      )}
    </div>
  );
}
