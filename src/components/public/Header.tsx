'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import WhatsAppButton from './WhatsAppButton';

interface HeaderProps {
  whatsappNumber?: string;
  brandName?: string;
}

export default function Header({
  whatsappNumber = '',
  brandName = 'Rajvi Diamonds',
}: HeaderProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Collections', href: '/collections' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-rajvi-borderLight py-2.5 sm:py-3 shadow-luxury'
          : 'bg-white/90 backdrop-blur-sm border-b border-rajvi-borderLight/80 py-3 sm:py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo - Preserving exact original proportions & artwork */}
        <a href="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative h-[56px] sm:h-[64px] md:h-[70px] w-[145px] sm:w-[170px] md:w-[195px] flex items-center justify-start overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
            <Image
              src="/rajvi-diamonds-logo-display.png"
              alt={brandName}
              width={1089}
              height={840}
              priority
              className="object-contain object-left h-full w-auto"
            />
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname?.startsWith(link.href);
            return (
              <a
                key={link.href}
                href={link.href}
                className={`text-xs uppercase tracking-widest font-medium transition-all duration-200 relative py-1 ${
                  isActive
                    ? 'text-rajvi-gold font-semibold'
                    : 'text-rajvi-textDark hover:text-rajvi-gold'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-rajvi-gold rounded-full" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Desktop Right CTA */}
        <div className="hidden md:flex items-center gap-4">
          <WhatsAppButton phoneNumber={whatsappNumber} variant="header" />
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="p-2 text-rajvi-textDark hover:text-rajvi-gold transition-colors focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-rajvi-borderLight px-6 py-6 space-y-5 animate-in slide-in-from-top-4 duration-300 shadow-luxury">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname?.startsWith(link.href);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-sm uppercase tracking-widest py-2 border-b border-rajvi-borderLight/60 flex items-center justify-between ${
                    isActive
                      ? 'text-rajvi-gold font-semibold'
                      : 'text-rajvi-textDark hover:text-rajvi-gold'
                  }`}
                >
                  <span>{link.label}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-40 text-rajvi-textMuted" />
                </a>
              );
            })}
          </nav>

          <div className="pt-2">
            <WhatsAppButton
              phoneNumber={whatsappNumber}
              variant="outline"
              className="w-full text-center"
            />
          </div>
        </div>
      )}
    </header>
  );
}
