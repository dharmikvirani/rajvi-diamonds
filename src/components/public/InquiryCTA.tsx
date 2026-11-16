import React from 'react';
import Image from 'next/image';
import WhatsAppButton from './WhatsAppButton';
import { ArrowRight, MessageSquare } from 'lucide-react';

interface InquiryCTAProps {
  whatsappNumber?: string;
}

export default function InquiryCTA({ whatsappNumber = '' }: InquiryCTAProps) {
  return (
    <section className="bg-gradient-to-b from-white via-[#FAF8F5] to-rajvi-offWhite py-24 border-t border-rajvi-borderLight relative overflow-hidden">
      {/* Subtle diamond facets atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-35">
        <Image
          src="https://images.unsplash.com/photo-1554283493-fbe7e5cd03cf?auto=format&fit=crop&w=1600&q=80"
          alt="Rajvi Diamonds Luxury Background"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/40 to-rajvi-offWhite/80" />
      </div>

      {/* Decorative luxury gold ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rajvi-gold/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-rajvi-gold/40 bg-white/90 text-rajvi-goldMuted text-xs uppercase tracking-widest font-medium mb-6 shadow-sm">
          <MessageSquare className="w-3.5 h-3.5 text-rajvi-gold" />
          <span>Direct Factory & Trade Inquiries</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-rajvi-textDark font-normal tracking-tight mb-6 leading-tight">
          Looking for Something <span className="gold-gradient-text italic">Extraordinary?</span>
        </h2>

        <p className="text-rajvi-textMuted text-sm sm:text-base max-w-xl mx-auto mb-10 leading-relaxed font-light">
          Whether you are seeking calibrated parcels of Rose Octagone, custom Tulip cut dimensions, or a dedicated manufacturing collaboration, our team is at your disposal.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <a
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-rajvi-gold hover:bg-rajvi-goldLight text-rajvi-black font-semibold text-xs uppercase tracking-widest transition-all duration-300 shadow-md hover:scale-105"
          >
            <span>Contact Rajvi Diamonds</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <WhatsAppButton
            phoneNumber={whatsappNumber}
            variant="outline"
            label="Instant WhatsApp Chat"
            className="w-full sm:w-auto bg-white border border-rajvi-gold text-rajvi-gold hover:bg-rajvi-gold hover:text-white shadow-sm"
          />
        </div>
      </div>
    </section>
  );
}
