'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Gem,
  Layers,
  Ruler,
  Inbox,
  Settings,
  LogOut,
  ExternalLink,
  X,
  LayoutTemplate,
  Navigation,
  PanelBottom,
  Images,
  FileText,
  Search,
} from 'lucide-react';

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function AdminSidebar({
  mobileOpen = false,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const coreNavItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Diamonds', href: '/admin/diamonds', icon: Gem },
    { label: 'Categories', href: '/admin/categories', icon: Layers },
    { label: 'Sizes & Dimensions', href: '/admin/sizes', icon: Ruler },
    { label: 'Inquiries', href: '/admin/inquiries', icon: Inbox },
  ];

  const cmsNavItems = [
    { label: 'Homepage Sections', href: '/admin/website/homepage', icon: LayoutTemplate },
    { label: 'Header & Navigation', href: '/admin/website/navigation', icon: Navigation },
    { label: 'Footer Editor', href: '/admin/website/footer', icon: PanelBottom },
    { label: 'Media Gallery', href: '/admin/website/gallery', icon: Images },
    { label: 'Page Content', href: '/admin/website/pages', icon: FileText },
    { label: 'General Settings', href: '/admin/settings', icon: Settings },
    { label: 'SEO Settings', href: '/admin/website/seo', icon: Search },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const content = (
    <div className="flex flex-col h-full bg-[#12110F] text-rajvi-offWhite border-r border-rajvi-borderDark/80 w-64">
      {/* Brand & Logo Header */}
      <div className="p-6 border-b border-rajvi-borderDark/60 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="relative h-12 w-48 flex items-center justify-start overflow-hidden">
            <Image
              src="/rajvi-diamonds-logo-light.png"
              alt="Rajvi Diamonds"
              width={1089}
              height={840}
              className="object-contain object-left h-full w-auto"
            />
          </div>
        </Link>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden text-rajvi-offWhite/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="px-6 py-2">
        <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-rajvi-gold font-medium">
          Admin Portal
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3.5 py-4 space-y-6 overflow-y-auto">
        {/* Core Management */}
        <div className="space-y-1">
          {coreNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-3.5 py-2 rounded-sm text-[13px] font-sans font-medium transition-all ${
                  isActive
                    ? 'bg-rajvi-gold text-rajvi-black font-semibold shadow-sm'
                    : 'text-rajvi-offWhite/80 hover:bg-[#1E1C18] hover:text-rajvi-goldLight'
                }`}
              >
                <Icon className="w-[17px] h-[17px] shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Website Management */}
        <div className="space-y-1">
          <div className="px-3 pb-1.5 pt-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-rajvi-gold/80 font-semibold">
              Website Management
            </span>
          </div>
          {cmsNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-3.5 py-2 rounded-sm text-[13px] font-sans font-medium transition-all ${
                  isActive
                    ? 'bg-rajvi-gold text-rajvi-black font-semibold shadow-sm'
                    : 'text-rajvi-offWhite/80 hover:bg-[#1E1C18] hover:text-rajvi-goldLight'
                }`}
              >
                <Icon className="w-[17px] h-[17px] shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-rajvi-borderDark/60 space-y-1.5">
        <a
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 rounded-sm text-[12px] font-sans text-rajvi-offWhite/70 hover:text-rajvi-gold hover:bg-[#1E1C18]/60 transition-colors"
        >
          <span className="tracking-wide">View Public Site</span>
          <ExternalLink className="w-4 h-4 text-rajvi-offWhite/50" />
        </a>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] font-sans text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-sm transition-colors font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 h-screen sticky top-0">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative z-10">{content}</div>
        </div>
      )}
    </>
  );
}
