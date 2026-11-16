import React from 'react';
import { getAllDiamondsAdmin } from '@/lib/db';
import DiamondsListClient from './DiamondsListClient';

export const dynamic = 'force-dynamic';

export default async function AdminDiamondsPage() {
  const diamonds = await getAllDiamondsAdmin();

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-rajvi-borderDark/60">
        <span className="text-[10px] uppercase tracking-widest text-rajvi-gold font-semibold block">
          Inventory & Catalogue
        </span>
        <h2 className="font-serif text-2xl font-normal text-rajvi-offWhite">
          Fancy Diamond Cuts
        </h2>
        <p className="text-xs text-rajvi-offWhite/60 mt-1">
          Manage cut profiles, millimeter dimensions, detailed descriptions, and high-resolution photography.
        </p>
      </div>

      <DiamondsListClient initialDiamonds={diamonds} />
    </div>
  );
}
