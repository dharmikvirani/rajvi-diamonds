import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import {
  getAllCategoriesAdmin,
  getAllDiamondColorsAdmin,
  getAllDiamondClaritiesAdmin,
  getDiamondByIdAdmin,
} from '@/lib/db';
import DiamondEditorForm from '@/components/admin/DiamondEditorForm';

export const dynamic = 'force-dynamic';

interface EditDiamondPageProps {
  params: {
    id: string;
  };
}

export default async function EditDiamondPage({ params }: EditDiamondPageProps) {
  const session = await getAdminSession();
  if (!session.isAdmin) {
    redirect('/admin/login');
  }

  const [categories, colors, clarities, diamond] = await Promise.all([
    getAllCategoriesAdmin(),
    getAllDiamondColorsAdmin(),
    getAllDiamondClaritiesAdmin(),
    getDiamondByIdAdmin(params.id),
  ]);

  if (!diamond) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <DiamondEditorForm
        initialDiamond={diamond}
        categories={categories}
        availableColors={colors}
        availableClarities={clarities}
      />
    </div>
  );
}
