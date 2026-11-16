import React from 'react';
import Image from 'next/image';
import { Mail, Phone, MapPin, Instagram, MessageCircle, ShieldCheck } from 'lucide-react';
import { SiteSettings } from '@/lib/types';

interface FooterProps {
  settings: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const cleanWhatsAppNumber = (settings.whatsapp_number || '').replace(/[^0-9]/g, '');

  return (
    <footer className="bg-[#11100E] text-rajvi-offWhite border-t border-rajvi-borderDark/80 pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Col 1: Brand & Existing Logo */}
          <div className="space-y-6">
            <a href="/" className="inline-block">
              <div className="relative h-14 w-48 overflow-hidden">
                <Image
                  src="/rajvi-diamonds-logo.jpg"
                  alt={settings.brand_name}
                  width={1280}
                  height={853}
                  className="object-contain h-full w-auto"
                />
              </div>
            </a>
            <p className="text-rajvi-offWhite/70 text-xs sm:text-sm leading-relaxed max-w-sm">
              {settings.footer_text ||
                'Manufacturer and supplier of exceptional fancy diamond cuts. Dedicated to precision craftsmanship, rarity, and enduring trade excellence.'}
            </p>
            <div className="flex items-center gap-3 text-rajvi-gold text-xs tracking-wider uppercase font-semibold">
              <ShieldCheck className="w-4 h-4 text-rajvi-gold" />
              <span>Fancy Diamond Specialist</span>
            </div>
          </div>

          {/* Col 2: Diamond Collections */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-rajvi-gold font-semibold font-serif">
              Fancy Collections
            </h3>
            <ul className="space-y-2.5 text-xs text-rajvi-offWhite/70">
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
                  className="hover:text-rajvi-gold transition-colors block py-0.5 text-rajvi-goldLight/90"
                >
                  View Complete Catalogue →
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigation */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-rajvi-gold font-semibold font-serif">
              Company
            </h3>
            <ul className="space-y-2.5 text-xs text-rajvi-offWhite/70">
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
                  className="hover:text-rajvi-gold/80 transition-colors block py-0.5 text-rajvi-muted"
                >
                  Admin Portal
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Information */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-rajvi-gold font-semibold font-serif">
              Direct Contact
            </h3>
            <div className="space-y-3 text-xs text-rajvi-offWhite/80">
              {settings.contact_email && (
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="flex items-start gap-2.5 hover:text-rajvi-gold transition-colors"
                >
                  <Mail className="w-4 h-4 text-rajvi-gold shrink-0 mt-0.5" />
                  <span>{settings.contact_email}</span>
                </a>
              )}
              {settings.phone_number && (
                <a
                  href={`tel:${settings.phone_number.replace(/\s+/g, '')}`}
                  className="flex items-start gap-2.5 hover:text-rajvi-gold transition-colors"
                >
                  <Phone className="w-4 h-4 text-rajvi-gold shrink-0 mt-0.5" />
                  <span>{settings.phone_number}</span>
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
                  <span>WhatsApp: {settings.whatsapp_number}</span>
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
                  <span>Instagram @rajvidiamonds</span>
                </a>
              )}
              {settings.business_address && (
                <div className="flex items-start gap-2.5 text-rajvi-offWhite/60 pt-1">
                  <MapPin className="w-4 h-4 text-rajvi-gold shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{settings.business_address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom divider and copyright */}
        <div className="border-t border-rajvi-borderDark/60 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-rajvi-muted gap-4">
          <p>© {currentYear} {settings.brand_name}. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <a href="/privacy" className="hover:text-rajvi-gold transition-colors">
              Privacy Policy
            </a>
            <span className="text-rajvi-borderDark">|</span>
            <span className="text-rajvi-muted">
              Premium Fancy Cut Showcase (B2B & Private Inquiry)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
