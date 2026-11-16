'use client';

import React from 'react';
import { Menu, ShieldCheck } from 'lucide-react';

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
  title?: string;
  adminEmail?: string;
}

export default function AdminHeader({
  onOpenMobileMenu,
  title = 'Overview',
  adminEmail = 'admin@rajvidiamonds.com',
}: AdminHeaderProps) {
  return (
    <header className="h-16 bg-[#161513] border-b border-rajvi-borderDark/80 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden text-rajvi-offWhite/80 hover:text-white"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="font-serif text-lg sm:text-xl font-normal text-rajvi-offWhite tracking-wide">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-rajvi-charcoal border border-rajvi-borderDark text-[11px] text-rajvi-goldLight">
          <ShieldCheck className="w-3.5 h-3.5 text-rajvi-gold" />
          <span>{adminEmail}</span>
        </div>
      </div>
    </header>
  );
}
