import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { getCmsGallery } from '@/lib/db';
import GalleryCmsClient from './GalleryCmsClient';

export const dynamic = 'force-dynamic';

export default async function AdminGalleryPage() {
  const session = await getAdminSession();
  if (!session.isAdmin) {
    redirect('/admin/login');
  }

  // Include inactive images for admin management
  const galleryItems = await getCmsGallery(true);

  return (
    <div className="space-y-6">
      <GalleryCmsClient initialGallery={galleryItems} />
    </div>
  );
}
