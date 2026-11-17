import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { getAllDiamondsAdmin } from '@/lib/db';
import DiamondsListClient from './DiamondsListClient';

export const dynamic = 'force-dynamic';

export default async function AdminDiamondsPage() {
  const session = await getAdminSession();
  if (!session.isAdmin) {
    redirect('/admin/login');
  }

  const diamonds = await getAllDiamondsAdmin();

  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-rajvi-borderDark/60">
        <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-rajvi-gold font-medium block mb-1">
          Inventory & Catalogue
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-normal text-rajvi-offWhite tracking-tight sm:tracking-normal">
          Fancy Diamond Cuts
        </h2>
        <p className="text-[13px] font-sans text-rajvi-offWhite/65 mt-1.5">
          Manage cut profiles, millimeter dimensions, detailed descriptions, and high-resolution photography.
        </p>
      </div>

      <DiamondsListClient initialDiamonds={diamonds} />
    </div>
  );
}
