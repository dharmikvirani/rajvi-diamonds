import React from 'react';
import { getAllDiamondsAdmin } from '@/lib/db';
import SizesClient from './SizesClient';

export const dynamic = 'force-dynamic';

export default async function AdminSizesPage() {
  const diamonds = await getAllDiamondsAdmin();

  return (
    <div className="space-y-6">
      <SizesClient diamonds={diamonds} />
    </div>
  );
}
