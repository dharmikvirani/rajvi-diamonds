import React from 'react';
import WhatsAppButton from './WhatsAppButton';
import { Mail, MessageCircle, Sparkles } from 'lucide-react';

interface InquiryCTAProps {
  whatsappNumber?: string;
}

export default function InquiryCTA({ whatsappNumber = '' }: InquiryCTAProps) {
  return (
    <section className="bg-[#0D0C0A] text-white py-24 sm:py-32 border-t border-[#2A2722] relative overflow-hidden">
      {/* Subtle Gold Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-rajvi-gold/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtle Luxury Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-rajvi-gold/30 bg-[#161512] text-rajvi-goldLight text-[11px] uppercase tracking-[0.25em] font-medium mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-rajvi-gold" />
          <span>Direct Trade & Bespoke Cutting Inquiries</span>
        </div>

        {/* Heading */}
        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-normal tracking-tight mb-6 leading-tight">
          Looking for Something{' '}
          <span className="gold-gradient-text italic font-serif">
            Exceptional?
          </span>
        </h2>

        {/* Description */}
        <p className="text-white/75 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed font-light">
          Connect with Rajvi Diamonds to explore our collection and discuss your diamond requirements.
        </p>

        {/* Two Action Buttons: WhatsApp Enquiry & Contact Us */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <WhatsAppButton
            phoneNumber={whatsappNumber}
            variant="primary"
            label="WhatsApp Enquiry"
            className="w-full sm:w-auto px-8 py-4 text-xs uppercase tracking-widest font-semibold shadow-goldGlow hover:scale-105"
          />

          <a
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#2A2722] text-white/90 hover:text-white hover:border-rajvi-gold/60 bg-[#141311] font-semibold text-xs uppercase tracking-widest rounded-sm transition-all duration-300 hover:scale-105"
          >
            <Mail className="w-4 h-4 text-rajvi-gold" />
            <span>Contact Us</span>
          </a>
        </div>
      </div>
    </section>
  );
}
