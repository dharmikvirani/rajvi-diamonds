'use client';

import React from 'react';
import Link from 'next/navigation';
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

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Diamonds', href: '/admin/diamonds', icon: Gem },
    { label: 'Categories', href: '/admin/categories', icon: Layers },
    { label: 'Sizes & Dimensions', href: '/admin/sizes', icon: Ruler },
    { label: 'Inquiries', href: '/admin/inquiries', icon: Inbox },
    { label: 'Site Settings', href: '/admin/settings', icon: Settings },
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
        <a href="/admin" className="flex items-center gap-3">
          <div className="relative h-9 w-32">
            <Image
              src="/rajvi-diamonds-logo.jpg"
              alt="Rajvi Diamonds"
              width={1280}
              height={853}
              className="object-contain h-full w-auto"
            />
          </div>
        </a>

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
        <span className="text-[10px] uppercase tracking-widest text-rajvi-gold font-semibold">
          Admin Portal
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname?.startsWith(item.href);

          return (
            <a
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-sm text-xs font-medium tracking-wider uppercase transition-colors ${
                isActive
                  ? 'bg-rajvi-gold text-rajvi-black font-semibold shadow-sm'
                  : 'text-rajvi-offWhite/75 hover:bg-rajvi-charcoal hover:text-rajvi-goldLight'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-rajvi-borderDark/60 space-y-2">
        <a
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 rounded-sm text-xs text-rajvi-offWhite/60 hover:text-rajvi-gold transition-colors"
        >
          <span className="text-[11px] uppercase tracking-wider">View Public Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-sm transition-colors uppercase tracking-wider font-semibold"
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
