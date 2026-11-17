'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { generateWhatsAppUrl } from '@/lib/utils';

interface WhatsAppButtonProps {
  phoneNumber: string;
  diamondName?: string;
  selectedSize?: string | number | null;
  color?: string | null;
  clarity?: string | null;
  pageUrl?: string;
  customMessage?: string;
  variant?: 'floating' | 'primary' | 'outline' | 'header';
  className?: string;
  label?: string;
}

export default function WhatsAppButton({
  phoneNumber,
  diamondName,
  selectedSize,
  color,
  clarity,
  pageUrl,
  customMessage,
  variant = 'primary',
  className = '',
  label,
}: WhatsAppButtonProps) {
  const hasPhone = Boolean(phoneNumber && phoneNumber.trim() !== '');

  if (!hasPhone) {
    if (variant === 'floating') return null;

    if (variant === 'header') {
      return (
        <a
          href="/contact"
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-rajvi-gold/40 text-rajvi-gold hover:text-rajvi-black hover:bg-rajvi-gold hover:border-rajvi-gold text-xs font-medium tracking-wider uppercase transition-all duration-300 ${className}`}
        >
          <MessageCircle className="w-3.5 h-3.5 text-current" />
          <span>Trade Inquiry</span>
        </a>
      );
    }

    if (variant === 'outline') {
      return (
        <a
          href="/contact"
          className={`inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-sm border border-rajvi-gold text-rajvi-gold hover:bg-rajvi-gold hover:text-rajvi-black text-xs uppercase tracking-widest font-semibold transition-all duration-300 ${className}`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>{label || 'Send Trade Inquiry'}</span>
        </a>
      );
    }

    return (
      <a
        href="/contact"
        className={`inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-sm bg-rajvi-gold hover:bg-rajvi-goldLight text-rajvi-black text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-md hover:shadow-lg ${className}`}
      >
        <MessageCircle className="w-4 h-4" />
        <span>{label || 'Send Trade Inquiry'}</span>
      </a>
    );
  }

  const url = generateWhatsAppUrl({
    phoneNumber,
    diamondName,
    selectedSize,
    color,
    clarity,
    pageUrl,
    customMessage,
  });

  if (variant === 'floating') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp Inquiry"
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 group ${className}`}
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline-block">
          WhatsApp Inquiry
        </span>
      </a>
    );
  }

  if (variant === 'header') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-rajvi-gold/40 text-rajvi-gold hover:text-rajvi-black hover:bg-rajvi-gold hover:border-rajvi-gold text-xs font-medium tracking-wider uppercase transition-all duration-300 ${className}`}
      >
        <MessageCircle className="w-3.5 h-3.5 text-current" />
        <span>WhatsApp Inquiry</span>
      </a>
    );
  }

  if (variant === 'outline') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-sm border border-rajvi-gold text-rajvi-gold hover:bg-rajvi-gold hover:text-rajvi-black text-xs uppercase tracking-widest font-semibold transition-all duration-300 ${className}`}
      >
        <MessageCircle className="w-4 h-4" />
        <span>{label || 'Inquire via WhatsApp'}</span>
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-sm bg-[#25D366] hover:bg-[#1ebd56] text-white text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-md hover:shadow-lg ${className}`}
    >
      <MessageCircle className="w-4 h-4 fill-current" />
      <span>{label || 'Inquire via WhatsApp'}</span>
    </a>
  );
}
