import React from 'react';
import { notFound } from 'next/navigation';
import { getAllCategoriesAdmin, getDiamondByIdAdmin } from '@/lib/db';
import DiamondEditorForm from '@/components/admin/DiamondEditorForm';

export const dynamic = 'force-dynamic';

interface EditDiamondPageProps {
  params: {
    id: string;
  };
}

export default async function EditDiamondPage({ params }: EditDiamondPageProps) {
  const [categories, diamond] = await Promise.all([
    getAllCategoriesAdmin(),
    getDiamondByIdAdmin(params.id),
  ]);

  if (!diamond) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <DiamondEditorForm initialDiamond={diamond} categories={categories} />
    </div>
  );
}
