import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { getAllCategoriesAdmin, getAllDiamondColorsAdmin, getAllDiamondClaritiesAdmin } from '@/lib/db';
import DiamondEditorForm from '@/components/admin/DiamondEditorForm';

export const dynamic = 'force-dynamic';

export default async function NewDiamondPage() {
  const session = await getAdminSession();
  if (!session.isAdmin) {
    redirect('/admin/login');
  }

  const [categories, colors, clarities] = await Promise.all([
    getAllCategoriesAdmin(),
    getAllDiamondColorsAdmin(),
    getAllDiamondClaritiesAdmin(),
  ]);

  return (
    <div className="space-y-6">
      <DiamondEditorForm
        categories={categories}
        availableColors={colors}
        availableClarities={clarities}
      />
    </div>
  );
}
