import React from 'react';
import Image from 'next/image';
import { Mail, Phone, MapPin, Instagram, MessageCircle, ShieldCheck } from 'lucide-react';
import { SiteSettings } from '@/lib/types';

interface FooterProps {
  settings: SiteSettings;
  theme?: 'light' | 'dark';
}

export default function Footer({ settings, theme = 'light' }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const cleanWhatsAppNumber = (settings.whatsapp_number || '').replace(/[^0-9]/g, '');
  const isDark = theme === 'dark';

  return (
    <footer
      className={`border-t pt-16 pb-12 mt-auto transition-colors duration-300 ${
        isDark
          ? 'bg-[#0D0C0A] text-white border-[#2A2722]'
          : 'bg-[#F5F2EB] text-rajvi-textDark border-rajvi-borderLight'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Col 1: Brand & Logo */}
          <div className="space-y-6">
            <a href="/" className="inline-block group" aria-label={settings.brand_name}>
              <div className="relative h-14 sm:h-16 w-44 sm:w-52 flex items-center justify-start overflow-hidden transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={isDark ? '/rajvi-diamonds-logo-light.png' : '/rajvi-diamonds-logo-display.png'}
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
              {settings.footer_text ||
                'Manufacturer and supplier of exceptional fancy diamond cuts. Dedicated to precision craftsmanship, rarity, and enduring trade excellence.'}
            </p>
            <div className="flex items-center gap-2.5 text-rajvi-gold text-xs tracking-wider uppercase font-semibold">
              <ShieldCheck className="w-4 h-4 text-rajvi-gold" />
              <span>Fancy Diamond Specialist • Surat</span>
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
              <li>
                <a
                  href="/collections/rose-octagone"
                  className="hover:text-rajvi-gold transition-colors block py-0.5"
                >
                  Rose Octagone Cut
                </a>
              </li>
              <li>
                <a
                  href="/collections/tulip"
                  className="hover:text-rajvi-gold transition-colors block py-0.5"
                >
                  Tulip Cut
                </a>
              </li>
              <li>
                <a
                  href="/collections"
                  className="hover:text-rajvi-gold transition-colors block py-0.5"
                >
                  Geometric Fancy Cuts
                </a>
              </li>
              <li>
                <a
                  href="/collections"
                  className="hover:text-rajvi-gold transition-colors block py-0.5"
                >
                  Botanical & Floral Cuts
                </a>
              </li>
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
              <li>
                <a href="/" className="hover:text-rajvi-gold transition-colors block py-0.5">
                  Home
                </a>
              </li>
              <li>
                <a href="/collections" className="hover:text-rajvi-gold transition-colors block py-0.5">
                  Diamond Catalogue
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-rajvi-gold transition-colors block py-0.5">
                  About Rajvi Diamonds
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-rajvi-gold transition-colors block py-0.5">
                  Trade Inquiries
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-rajvi-gold transition-colors block py-0.5">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/admin"
                  className="hover:text-rajvi-gold transition-colors block py-0.5 text-white/40"
                >
                  Admin Portal
                </a>
              </li>
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
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 hover:text-rajvi-gold transition-colors"
                >
                  <Instagram className="w-4 h-4 text-rajvi-gold shrink-0 mt-0.5" />
                  <span className={isDark ? 'text-white/90' : 'text-rajvi-textDark'}>
                    Instagram @rajvidiamonds
                  </span>
                </a>
              )}
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
          <p>© {currentYear} {settings.brand_name}. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <a href="/privacy" className="hover:text-rajvi-gold transition-colors">
              Privacy Policy
            </a>
            <span className={isDark ? 'text-white/20' : 'text-rajvi-borderLight'}>|</span>
            <span>
              Premium Fancy Cut Showcase (B2B & Private Inquiry)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
