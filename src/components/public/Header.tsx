'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight, ArrowRight } from 'lucide-react';
import WhatsAppButton from './WhatsAppButton';

interface HeaderProps {
  whatsappNumber?: string;
  brandName?: string;
  theme?: 'light' | 'dark';
}

export default function Header({
  whatsappNumber = '',
  brandName = 'Rajvi Diamonds',
  theme = 'light',
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

  const isDark = theme === 'dark';

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isDark
          ? isScrolled
            ? 'bg-[#0D0C0A]/95 backdrop-blur-md border-b border-[#2A2722] py-2.5 sm:py-3 shadow-luxuryDark'
            : 'bg-[#0D0C0A]/85 backdrop-blur-sm border-b border-[#2A2722]/60 py-3 sm:py-4'
          : isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-rajvi-borderLight py-2.5 sm:py-3 shadow-luxury'
          : 'bg-white/90 backdrop-blur-sm border-b border-rajvi-borderLight/80 py-3 sm:py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo - Preserving exact original proportions & authentic artwork */}
        <a href="/" className="flex items-center gap-3 group shrink-0" aria-label={brandName}>
          <div className="relative h-[56px] sm:h-[64px] md:h-[70px] w-[150px] sm:w-[175px] md:w-[200px] flex items-center justify-start overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
            <Image
              src={isDark ? '/rajvi-diamonds-logo-light.png' : '/rajvi-diamonds-logo-display.png'}
              alt={brandName}
              width={1089}
              height={840}
              priority
              className="object-contain object-left h-full w-auto"
            />
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname?.startsWith(link.href);
            return (
              <a
                key={link.href}
                href={link.href}
                className={`text-[11px] uppercase tracking-[0.22em] font-medium transition-all duration-200 relative py-1.5 ${
                  isActive
                    ? 'text-rajvi-gold font-semibold'
                    : isDark
                    ? 'text-white/80 hover:text-rajvi-gold'
                    : 'text-rajvi-textDark hover:text-rajvi-gold'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-rajvi-goldMuted via-rajvi-gold to-rajvi-goldLight rounded-full" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Desktop Right CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-4 py-2 bg-rajvi-gold hover:bg-rajvi-goldLight text-[#0D0C0A] font-semibold text-[11px] uppercase tracking-widest rounded-sm transition-all duration-300 shadow-sm hover:scale-105"
          >
            <span>Enquire Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <WhatsAppButton phoneNumber={whatsappNumber} variant="header" />
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className={`p-2 transition-colors focus:outline-none ${
              isDark
                ? 'text-white/90 hover:text-rajvi-gold'
                : 'text-rajvi-textDark hover:text-rajvi-gold'
            }`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-rajvi-gold" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden px-6 py-6 space-y-5 animate-in slide-in-from-top-4 duration-300 border-b shadow-luxuryDark ${
            isDark
              ? 'bg-[#12110F] border-[#2A2722] text-white'
              : 'bg-white border-rajvi-borderLight text-rajvi-textDark'
          }`}
        >
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
                  className={`text-xs uppercase tracking-widest py-2.5 border-b flex items-center justify-between ${
                    isDark ? 'border-[#2A2722]/80' : 'border-rajvi-borderLight/60'
                  } ${
                    isActive
                      ? 'text-rajvi-gold font-semibold'
                      : isDark
                      ? 'text-white/80 hover:text-rajvi-gold'
                      : 'text-rajvi-textDark hover:text-rajvi-gold'
                  }`}
                >
                  <span>{link.label}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-50 text-rajvi-gold" />
                </a>
              );
            })}
          </nav>

          <div className="pt-2 flex flex-col gap-3">
            <a
              href="/contact"
              className="w-full text-center py-3 bg-rajvi-gold text-[#0D0C0A] font-semibold text-xs uppercase tracking-widest rounded-sm hover:bg-rajvi-goldLight transition-colors"
            >
              Enquire Now
            </a>
            <WhatsAppButton
              phoneNumber={whatsappNumber}
              variant="outline"
              className={`w-full text-center ${
                isDark
                  ? 'border-rajvi-gold/60 text-rajvi-gold hover:bg-rajvi-gold/10'
                  : ''
              }`}
            />
          </div>
        </div>
      )}
    </header>
  );
}
