import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { getAllDiamondsAdmin } from '@/lib/db';
import SizesClient from './SizesClient';

export const dynamic = 'force-dynamic';

export default async function AdminSizesPage() {
  const session = await getAdminSession();
  if (!session.isAdmin) {
    redirect('/admin/login');
  }

  const diamonds = await getAllDiamondsAdmin();

  return (
    <div className="space-y-6">
      <SizesClient diamonds={diamonds} />
    </div>
  );
}
