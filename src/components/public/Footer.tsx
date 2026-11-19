import React from 'react';
import Image from 'next/image';
import { Mail, Phone, MapPin, Instagram, MessageCircle, ShieldCheck } from 'lucide-react';
import { SiteSettings } from '@/lib/types';

interface FooterProps {
  settings: SiteSettings;
  theme?: 'light' | 'dark';
  footerSettings?: {
    logo_url?: string;
    brand_description?: string;
    disclaimer?: string;
    copyright_text?: string;
    show_socials?: boolean;
    footer_badge?: string;
  };
  collectionLinks?: { label: string; href: string }[];
  navigationLinks?: { label: string; href: string }[];
}

export default function Footer({
  settings,
  theme = 'light',
  footerSettings,
  collectionLinks: customCollectionLinks,
  navigationLinks: customNavLinks,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  const cleanWhatsAppNumber = (settings.whatsapp_number || '').replace(/[^0-9]/g, '');
  const isDark = theme === 'dark';

  const defaultCollectionLinks = [
    { label: 'Rose Octagone Cut', href: '/collections/rose-octagone' },
    { label: 'Tulip Cut', href: '/collections/tulip' },
    { label: 'Geometric Fancy Cuts', href: '/collections' },
    { label: 'Botanical & Floral Cuts', href: '/collections' },
  ];

  const defaultNavLinks = [
    { label: 'Home', href: '/' },
    { label: 'Diamond Catalogue', href: '/collections' },
    { label: 'About Rajvi Diamonds', href: '/about' },
    { label: 'Trade Inquiries', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Admin Portal', href: '/admin' },
  ];

  const colLinks = customCollectionLinks && customCollectionLinks.length > 0 ? customCollectionLinks : defaultCollectionLinks;
  const navLinks = customNavLinks && customNavLinks.length > 0 ? customNavLinks : defaultNavLinks;

  // Guarantee high-contrast logo on light and dark footers
  const lightThemeLogo = '/rajvi-diamonds-logo-display.png';
  const darkThemeLogo = '/rajvi-diamonds-logo-light.png';
  const logoSrc = isDark
    ? (footerSettings?.logo_url && !footerSettings.logo_url.includes('logo-display') ? footerSettings.logo_url : darkThemeLogo)
    : (footerSettings?.logo_url && !footerSettings.logo_url.includes('logo-light') ? footerSettings.logo_url : lightThemeLogo);

  const brandDesc = footerSettings?.brand_description || settings.footer_text || 'Manufacturer and supplier of exceptional fancy diamond cuts. Dedicated to precision craftsmanship, rarity, and enduring trade excellence.';
  const badgeText = footerSettings?.footer_badge || 'Fancy Diamond Specialist • Surat';
  const disclaimerText = footerSettings?.disclaimer || 'Premium Fancy Cut Showcase (B2B & Private Inquiry)';

  // Clean copyright text to prevent duplicate "©" and years
  const rawCopyright = footerSettings?.copyright_text || `${settings.brand_name || 'Rajvi Diamonds'}. All rights reserved.`;
  const cleanCopyright = rawCopyright
    .replace(/^©\s*/i, '')
    .replace(/^\d{4}\s*/, '')
    .trim();

  return (
    <footer
      className={`border-t pt-16 pb-12 mt-auto transition-colors duration-300 ${
        isDark
          ? 'bg-[#0D0C0A] text-white border-[#2A2722]'
          : 'bg-[#F5F2EB] text-rajvi-textDark border-rajvi-borderLight'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-12 sm:mb-16">
          {/* Col 1: Brand & Logo */}
          <div className="space-y-6">
            <a href="/" className="inline-block group" aria-label={settings.brand_name}>
              <div className="relative h-14 sm:h-16 w-44 sm:w-52 flex items-center justify-start overflow-hidden transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={logoSrc}
                  alt={settings.brand_name}
                  width={1089}
                  height={840}
                  className="object-contain object-left h-full w-auto"
                />
              </div>
            </a>
            <p
              className={`text-xs sm:text-sm leading-relaxed max-w-sm ${
                isDark ? 'text-white/60' : 'text-rajvi-textMuted'
              }`}
            >
              {brandDesc}
            </p>
            <div className="flex items-center gap-2.5 text-rajvi-gold text-xs tracking-wider uppercase font-semibold">
              <ShieldCheck className="w-4 h-4 text-rajvi-gold" />
              <span>{badgeText}</span>
            </div>
          </div>

          {/* Col 2: Diamond Collections */}
          <div className="space-y-4">
            <h3
              className={`text-xs uppercase tracking-widest font-semibold font-serif ${
                isDark ? 'text-white' : 'text-rajvi-textDark'
              }`}
            >
              Fancy Collections
            </h3>
            <ul
              className={`space-y-2.5 text-xs ${
                isDark ? 'text-white/60' : 'text-rajvi-textMuted'
              }`}
            >
              {colLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="hover:text-rajvi-gold transition-colors block py-0.5"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/collections"
                  className="hover:text-rajvi-gold transition-colors block py-0.5 text-rajvi-gold font-medium"
                >
                  View Complete Catalogue →
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigation */}
          <div className="space-y-4">
            <h3
              className={`text-xs uppercase tracking-widest font-semibold font-serif ${
                isDark ? 'text-white' : 'text-rajvi-textDark'
              }`}
            >
              Navigation
            </h3>
            <ul
              className={`space-y-2.5 text-xs ${
                isDark ? 'text-white/60' : 'text-rajvi-textMuted'
              }`}
            >
              {navLinks.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="hover:text-rajvi-gold transition-colors block py-0.5">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact Information */}
          <div className="space-y-4">
            <h3
              className={`text-xs uppercase tracking-widest font-semibold font-serif ${
                isDark ? 'text-white' : 'text-rajvi-textDark'
              }`}
            >
              Direct Contact
            </h3>
            <div
              className={`space-y-3 text-xs ${
                isDark ? 'text-white/60' : 'text-rajvi-textMuted'
              }`}
            >
              {settings.contact_email && (
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="flex items-start gap-2.5 hover:text-rajvi-gold transition-colors"
                >
                  <Mail className="w-4 h-4 text-rajvi-gold shrink-0 mt-0.5" />
                  <span className={isDark ? 'text-white/90' : 'text-rajvi-textDark'}>
                    {settings.contact_email}
                  </span>
                </a>
              )}
              {settings.phone_number && (
                <a
                  href={`tel:${settings.phone_number.replace(/\s+/g, '')}`}
                  className="flex items-start gap-2.5 hover:text-rajvi-gold transition-colors"
                >
                  <Phone className="w-4 h-4 text-rajvi-gold shrink-0 mt-0.5" />
                  <span className={isDark ? 'text-white/90' : 'text-rajvi-textDark'}>
                    {settings.phone_number}
                  </span>
                </a>
              )}
              {settings.whatsapp_number && (
                <a
                  href={`https://wa.me/${cleanWhatsAppNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 hover:text-rajvi-gold transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
                  <span className={`${isDark ? 'text-white/90' : 'text-rajvi-textDark'} font-medium`}>
                    WhatsApp: {settings.whatsapp_number}
                  </span>
                </a>
              )}
              <a
                href={settings.instagram_url || 'https://instagram.com/rajvidiamonds'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 hover:text-rajvi-gold transition-colors"
              >
                <Instagram className="w-4 h-4 text-rajvi-gold shrink-0 mt-0.5" />
                <span className={isDark ? 'text-white/90' : 'text-rajvi-textDark'}>
                  Instagram @rajvidiamonds
                </span>
              </a>
              {settings.business_address && (
                <div className="flex items-start gap-2.5 pt-1">
                  <MapPin className="w-4 h-4 text-rajvi-gold shrink-0 mt-0.5" />
                  <span className={`leading-relaxed ${isDark ? 'text-white/60' : 'text-rajvi-textMuted'}`}>
                    {settings.business_address}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom divider and copyright */}
        <div
          className={`border-t pt-8 flex flex-col sm:flex-row items-center justify-between text-xs gap-4 ${
            isDark ? 'border-[#2A2722] text-white/50' : 'border-rajvi-borderLight text-rajvi-textMuted'
          }`}
        >
          <p>© {currentYear} {cleanCopyright}</p>
          <div className="flex items-center space-x-6">
            <a href="/privacy" className="hover:text-rajvi-gold transition-colors">
              Privacy Policy
            </a>
            <span className={isDark ? 'text-white/20' : 'text-rajvi-borderLight'}>|</span>
            <span>{disclaimerText}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
