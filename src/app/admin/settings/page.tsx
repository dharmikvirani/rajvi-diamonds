import React from 'react';
import { getSiteSettings } from '@/lib/db';
import SettingsClient from './SettingsClient';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <SettingsClient initialSettings={settings} />
    </div>
  );
}
