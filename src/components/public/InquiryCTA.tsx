import React from 'react';
import WhatsAppButton from './WhatsAppButton';
import { ArrowRight, MessageSquare } from 'lucide-react';

interface InquiryCTAProps {
  whatsappNumber?: string;
}

export default function InquiryCTA({ whatsappNumber = '+919876543210' }: InquiryCTAProps) {
  return (
    <section className="bg-gradient-to-b from-rajvi-black to-[#0E0D0B] py-24 border-t border-rajvi-borderDark relative overflow-hidden">
      {/* Decorative luxury gold ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rajvi-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rajvi-gold/30 bg-rajvi-charcoal/80 text-rajvi-gold text-xs uppercase tracking-widest font-medium mb-6">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Direct Factory & Trade Inquiries</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-rajvi-offWhite font-normal tracking-tight mb-6 leading-tight">
          Looking for Something <span className="gold-gradient-text italic">Extraordinary?</span>
        </h2>

        <p className="text-rajvi-offWhite/80 text-sm sm:text-base max-w-xl mx-auto mb-10 leading-relaxed font-light">
          Whether you are seeking calibrated parcels of Rose Octagone, custom Tulip cut dimensions, or a dedicated manufacturing collaboration, our team is at your disposal.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <a
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-rajvi-gold hover:bg-rajvi-goldLight text-rajvi-black font-semibold text-xs uppercase tracking-widest transition-all duration-300 shadow-goldGlow hover:scale-105"
          >
            <span>Contact Rajvi Diamonds</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <WhatsAppButton
            phoneNumber={whatsappNumber}
            variant="outline"
            label="Instant WhatsApp Chat"
            className="w-full sm:w-auto"
          />
        </div>
      </div>
    </section>
  );
}
