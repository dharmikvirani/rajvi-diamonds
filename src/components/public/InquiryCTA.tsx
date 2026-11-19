import React from 'react';
import WhatsAppButton from './WhatsAppButton';
import { Mail, MessageCircle, Sparkles } from 'lucide-react';

interface InquiryCTAProps {
  whatsappNumber?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  description?: string;
  whatsappLabel?: string;
  contactLabel?: string;
  contactHref?: string;
}

export default function InquiryCTA({
  whatsappNumber = '',
  title = 'Looking for Something Exceptional?',
  subtitle = 'Direct Trade & Bespoke Cutting Inquiries',
  badge = 'Direct Trade & Bespoke Cutting Inquiries',
  description = 'Connect with Rajvi Diamonds to explore our collection and discuss your diamond requirements.',
  whatsappLabel = 'WhatsApp Enquiry',
  contactLabel = 'Contact Us',
  contactHref = '/contact',
}: InquiryCTAProps) {
  return (
    <section className="bg-gradient-to-b from-[#FDFBF7] via-[#FAF8F5] to-[#F5F2EB] text-rajvi-textDark py-20 sm:py-24 border-t border-rajvi-borderLight relative overflow-hidden">
      {/* Subtle Gold Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-rajvi-gold/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtle Luxury Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-rajvi-gold/40 bg-white/90 text-rajvi-goldMuted text-[11px] uppercase tracking-[0.25em] font-medium mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-rajvi-gold" />
          <span>{badge}</span>
        </div>

        {/* Heading */}
        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-rajvi-textDark font-normal tracking-tight mb-6 leading-tight">
          {title.includes('Something') ? (
            <>
              {title.split('Something')[0]}Something{' '}
              <span className="gold-gradient-text italic font-serif">
                {title.split('Something')[1]?.trim() || 'Exceptional?'}
              </span>
            </>
          ) : (
            title
          )}
        </h2>

        {/* Description */}
        <p className="text-rajvi-textMuted text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed font-light">
          {description}
        </p>

        {/* Two Action Buttons: WhatsApp Enquiry & Contact Us */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <WhatsAppButton
            phoneNumber={whatsappNumber}
            variant="primary"
            label={whatsappLabel}
            className="w-full sm:w-auto px-8 py-4 text-xs uppercase tracking-widest font-semibold shadow-luxury hover:scale-105"
          />

          <a
            href={contactHref}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-rajvi-gold text-rajvi-textDark hover:bg-rajvi-gold hover:text-[#0D0C0A] bg-white/90 font-semibold text-xs uppercase tracking-widest rounded-sm transition-all duration-300 hover:scale-105 shadow-sm"
          >
            <Mail className="w-4 h-4 text-rajvi-gold" />
            <span>{contactLabel}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
