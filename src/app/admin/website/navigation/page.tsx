import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { getHeaderSettings, getAllWebsiteNavigationAdmin } from '@/lib/db';
import NavigationClient from './NavigationClient';

export const dynamic = 'force-dynamic';

export default async function AdminNavigationPage() {
  const session = await getAdminSession();
  if (!session.isAdmin) {
    redirect('/admin/login');
  }

  const [headerSettings, navigationItems] = await Promise.all([
    getHeaderSettings(),
    getAllWebsiteNavigationAdmin(),
  ]);

  return (
    <div className="space-y-6">
      <NavigationClient
        initialHeaderSettings={headerSettings}
        initialNavigation={navigationItems}
      />
    </div>
  );
}
