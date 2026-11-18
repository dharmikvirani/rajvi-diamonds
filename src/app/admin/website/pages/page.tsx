import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { getPageCms } from '@/lib/db';
import PagesCmsClient from './PagesCmsClient';

export const dynamic = 'force-dynamic';

export default async function AdminPagesCmsPage() {
  const session = await getAdminSession();
  if (!session.isAdmin) {
    redirect('/admin/login');
  }

  const [aboutCms, contactCms, privacyCms] = await Promise.all([
    getPageCms('about'),
    getPageCms('contact'),
    getPageCms('privacy'),
  ]);

  return (
    <div className="space-y-6">
      <PagesCmsClient
        initialAbout={aboutCms}
        initialContact={contactCms}
        initialPrivacy={privacyCms}
      />
    </div>
  );
}
