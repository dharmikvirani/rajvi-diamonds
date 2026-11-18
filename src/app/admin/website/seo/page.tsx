import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { getSeoSettings } from '@/lib/db';
import SeoCmsClient from './SeoCmsClient';

export const dynamic = 'force-dynamic';

export default async function AdminSeoPage() {
  const session = await getAdminSession();
  if (!session.isAdmin) {
    redirect('/admin/login');
  }

  const seoSettings = await getSeoSettings();

  return (
    <div className="space-y-6">
      <SeoCmsClient initialSeo={seoSettings} />
    </div>
  );
}
