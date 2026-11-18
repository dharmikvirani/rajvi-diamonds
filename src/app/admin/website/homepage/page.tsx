import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { getCmsSections } from '@/lib/db';
import HomepageCmsClient from './HomepageCmsClient';

export const dynamic = 'force-dynamic';

export default async function AdminHomepageCmsPage() {
  const session = await getAdminSession();
  if (!session.isAdmin) {
    redirect('/admin/login');
  }

  // Admin view: include drafts to see unpublished changes
  const sections = await getCmsSections('home', true);

  return (
    <div className="space-y-6">
      <HomepageCmsClient initialSections={sections} />
    </div>
  );
}
