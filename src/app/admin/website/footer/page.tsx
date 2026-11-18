import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { getFooterSettings } from '@/lib/db';
import FooterCmsClient from './FooterCmsClient';

export const dynamic = 'force-dynamic';

export default async function AdminFooterPage() {
  const session = await getAdminSession();
  if (!session.isAdmin) {
    redirect('/admin/login');
  }

  const footerSettings = await getFooterSettings();

  return (
    <div className="space-y-6">
      <FooterCmsClient initialFooterSettings={footerSettings} />
    </div>
  );
}
