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
    <header className="h-16 bg-[#161513] border-b border-rajvi-borderDark/80 px-6 sm:px-8 lg:px-10 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden text-rajvi-offWhite/80 hover:text-white transition-colors p-1"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="font-serif text-lg sm:text-xl font-normal text-rajvi-offWhite tracking-normal">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F1E1A] border border-rajvi-borderDark text-xs font-sans text-rajvi-offWhite/85">
          <ShieldCheck className="w-4 h-4 text-rajvi-gold shrink-0" />
          <span>{adminEmail}</span>
        </div>
      </div>
    </header>
  );
}
