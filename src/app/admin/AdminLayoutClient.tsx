'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { ToastProvider } from '@/components/admin/AdminToast';

interface AdminLayoutClientProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  adminEmail?: string;
}

export default function AdminLayoutClient({
  children,
  isAuthenticated,
  adminEmail,
}: AdminLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!isAuthenticated && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoginPage, router]);

  if (isLoginPage) {
    return <div className="min-h-screen bg-[#11100E]">{children}</div>;
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  // Derive title from pathname
  let pageTitle = 'Dashboard Overview';
  if (pathname?.includes('/admin/diamonds')) pageTitle = 'Diamond Cuts Management';
  else if (pathname?.includes('/admin/categories')) pageTitle = 'Cut Categories';
  else if (pathname?.includes('/admin/sizes')) pageTitle = 'Calibrated Sizes & Availability';
  else if (pathname?.includes('/admin/inquiries')) pageTitle = 'Customer Trade Inquiries';
  else if (pathname?.includes('/admin/settings')) pageTitle = 'Brand & Business Settings';

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#141311] text-rajvi-offWhite flex">
        {/* Sidebar */}
        <AdminSidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Main Container */}
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
            title={pageTitle}
            adminEmail={adminEmail}
          />
          <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
