import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { getSiteSettings, getAllDiamondColorsAdmin, getAllDiamondClaritiesAdmin } from '@/lib/db';
import SettingsClient from './SettingsClient';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const session = await getAdminSession();
  if (!session.isAdmin) {
    redirect('/admin/login');
  }

  const [settings, colors, clarities] = await Promise.all([
    getSiteSettings(),
    getAllDiamondColorsAdmin(),
    getAllDiamondClaritiesAdmin(),
  ]);

  return (
    <div className="space-y-6">
      <SettingsClient
        initialSettings={settings}
        initialColors={colors}
        initialClarities={clarities}
      />
    </div>
  );
}
