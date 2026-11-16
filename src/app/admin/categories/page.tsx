import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { getAllCategoriesAdmin } from '@/lib/db';
import CategoriesClient from './CategoriesClient';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const session = await getAdminSession();
  if (!session.isAdmin) {
    redirect('/admin/login');
  }

  const categories = await getAllCategoriesAdmin();

  return (
    <div className="space-y-6">
      <CategoriesClient initialCategories={categories} />
    </div>
  );
}
