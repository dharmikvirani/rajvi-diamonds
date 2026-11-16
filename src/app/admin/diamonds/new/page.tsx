import React from 'react';
import { getAllCategoriesAdmin } from '@/lib/db';
import DiamondEditorForm from '@/components/admin/DiamondEditorForm';

export const dynamic = 'force-dynamic';

export default async function NewDiamondPage() {
  const categories = await getAllCategoriesAdmin();

  return (
    <div className="space-y-6">
      <DiamondEditorForm categories={categories} />
    </div>
  );
}
