'use client';

import React, { useState } from 'react';
import { Diamond, SiteSettings } from '@/lib/types';
import DiamondGallery from './DiamondGallery';
import DiamondSizeSelector from './DiamondSizeSelector';
import DiamondSpecsTable from './DiamondSpecsTable';
import ContactForm from './ContactForm';
import WhatsAppButton from './WhatsAppButton';
import DiamondCard from './DiamondCard';
import { ShieldCheck, Sparkles, MessageCircle, ArrowLeft } from 'lucide-react';
import { formatSizeMm } from '@/lib/utils';

interface DiamondDetailClientProps {
  diamond: Diamond;
  relatedDiamonds: Diamond[];
  settings: SiteSettings;
  siteUrl: string;
}

export default function DiamondDetailClient({
  diamond,
  relatedDiamonds,
  settings,
  siteUrl,
}: DiamondDetailClientProps) {
  const [selectedSizeMm, setSelectedSizeMm] = useState<number | null>(null);

  const formattedSelectedSize = selectedSizeMm ? formatSizeMm(selectedSizeMm) : null;
  const pageUrl = `${siteUrl}/collections/${diamond.slug}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Back link */}
      <div className="mb-8">
        <a
          href="/collections"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-rajvi-textMuted hover:text-rajvi-gold transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Diamond Catalogue</span>
        </a>
      </div>

      {/* Main Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-7">
          <DiamondGallery images={diamond.images} diamondName={diamond.name} />
        </div>

        {/* Right Column: Diamond Specifications & Inquiries */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
          <div>
            {/* Category, Shape, Color & Clarity Badges */}
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
              {diamond.category && (
                <span className="text-[11px] uppercase tracking-widest text-rajvi-gold font-semibold">
                  {diamond.category.name}
                </span>
              )}
              <span className="text-rajvi-borderDark/40">|</span>
              <span className="text-[11px] uppercase tracking-widest text-rajvi-textMuted font-medium">
                {diamond.shape}
              </span>
              {diamond.color && (
                <>
                  <span className="text-rajvi-borderDark/40">|</span>
                  <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-rajvi-offWhite border border-rajvi-borderLight text-rajvi-gold rounded-sm">
                    Color: {diamond.color}
                  </span>
                </>
              )}
              {diamond.clarity && (
                <>
                  <span className="text-rajvi-borderDark/40">|</span>
                  <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-rajvi-offWhite border border-rajvi-borderLight text-rajvi-gold rounded-sm">
                    Clarity: {diamond.clarity}
                  </span>
                </>
              )}
            </div>

            {/* Diamond Name */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-rajvi-textDark tracking-tight mb-4 leading-tight">
              {diamond.name}
            </h1>

            {/* Short Tagline / Description */}
            <p className="text-sm text-rajvi-textMuted leading-relaxed mb-6">
              {diamond.short_description}
            </p>

            {/* Workshop Guarantee Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-rajvi-offWhite border border-rajvi-borderLight text-rajvi-textDark text-[11px] font-medium mb-8">
              <ShieldCheck className="w-4 h-4 text-rajvi-gold" />
              <span>Precision Faceted & Hand-Inspected by Rajvi Diamonds</span>
            </div>

            {/* Size Selector */}
            <div className="pt-6 border-t border-rajvi-lightGrey mb-8">
              <DiamondSizeSelector
                sizes={diamond.sizes}
                selectedSize={selectedSizeMm}
                onSelectSize={setSelectedSizeMm}
              />
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-3 pt-2">
              {/* WhatsApp Inquiry Button with Dynamic Prefilled Message */}
              <WhatsAppButton
                phoneNumber={settings.whatsapp_number}
                diamondName={diamond.name}
                selectedSize={formattedSelectedSize}
                color={diamond.color}
                clarity={diamond.clarity}
                pageUrl={pageUrl}
                variant="primary"
                className="w-full text-center py-4"
                label={
                  selectedSizeMm
                    ? `Inquire on WhatsApp for ${formatSizeMm(selectedSizeMm)}`
                    : `Inquire on WhatsApp for ${diamond.name}`
                }
              />

              <a
                href="#inquiry-form-section"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-white border border-rajvi-borderLight hover:border-rajvi-gold text-rajvi-textDark hover:text-rajvi-gold text-xs uppercase tracking-widest font-semibold transition-colors"
              >
                <span>Submit Formal Inquiry Form</span>
              </a>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="pt-6 border-t border-rajvi-lightGrey text-[11px] text-rajvi-textMuted leading-relaxed">
            Rajvi Diamonds is a dedicated fancy cut manufacturer. We cater directly to diamond wholesalers, jewellery manufacturers, and bespoke designers worldwide.
          </div>
        </div>
      </div>

      {/* Detailed Description Section */}
      <div className="bg-white border border-rajvi-borderLight rounded-sm p-8 sm:p-12 mb-16 shadow-sm">
        <h2 className="font-serif text-2xl sm:text-3xl text-rajvi-textDark font-normal mb-6 pb-3 border-b border-rajvi-lightGrey">
          The Story of the {diamond.name} Cut
        </h2>
        <div className="prose max-w-none text-xs sm:text-sm text-rajvi-textDark/85 leading-relaxed space-y-4 whitespace-pre-line font-light">
          {diamond.description}
        </div>
      </div>

      {/* Specifications Table */}
      <div className="mb-20">
        <DiamondSpecsTable
          specifications={diamond.specifications}
          shape={diamond.shape}
          cutName={diamond.name}
          size={formattedSelectedSize}
          color={diamond.color}
          clarity={diamond.clarity}
        />
      </div>

      {/* Dedicated Inquiry Form Section */}
      <div id="inquiry-form-section" className="mb-24">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-rajvi-gold font-semibold block mb-2">
            Inquire for {diamond.name}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-rajvi-textDark font-normal">
            Request Diamond Availability & Parcel Specifications
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-rajvi-textMuted">
            {formattedSelectedSize
              ? `You have specified ${formattedSelectedSize} size. Fill the form below or connect via WhatsApp for fast quotation.`
              : 'Specify your requirements below. Our diamond specialists will respond within 24 business hours.'}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <ContactForm
            initialDiamondName={diamond.name}
            initialSize={formattedSelectedSize}
            initialColor={diamond.color}
            initialClarity={diamond.clarity}
            initialDiamondId={diamond.id}
            inquiryTypeDefault="Diamond Availability"
          />
        </div>
      </div>

      {/* Related Cuts Carousel / Grid */}
      {relatedDiamonds.length > 0 && (
        <div className="pt-16 border-t border-rajvi-borderLight">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-xs uppercase tracking-widest text-rajvi-gold font-semibold block mb-1">
                Explore More
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-rajvi-textDark font-normal">
                Complementary Fancy Cuts
              </h3>
            </div>
            <a
              href="/collections"
              className="text-xs uppercase tracking-wider text-rajvi-gold hover:text-rajvi-goldMuted font-semibold"
            >
              View All Cuts →
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedDiamonds.map((cut) => (
              <DiamondCard key={cut.id} diamond={cut} theme="light" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
