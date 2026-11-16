import React from 'react';
import { getAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminLayoutClient from './AdminLayoutClient';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  return (
    <AdminLayoutClient isAuthenticated={session.isAdmin} adminEmail={session.email}>
      {children}
    </AdminLayoutClient>
  );
}
