import React from 'react';
import { getAllCategoriesAdmin } from '@/lib/db';
import CategoriesClient from './CategoriesClient';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const categories = await getAllCategoriesAdmin();

  return (
    <div className="space-y-6">
      <CategoriesClient initialCategories={categories} />
    </div>
  );
}
