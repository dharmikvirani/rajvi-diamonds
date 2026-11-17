'use client';

import React, { useState } from 'react';
import { Diamond, SiteSettings } from '@/lib/types';
import DiamondGallery from './DiamondGallery';
import DiamondSizeSelector from './DiamondSizeSelector';
import DiamondSpecsTable from './DiamondSpecsTable';
import ContactForm from './ContactForm';
import WhatsAppButton from './WhatsAppButton';
import DiamondCard from './DiamondCard';
import {
  ShieldCheck,
  Sparkles,
  MessageCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Tag,
  DollarSign,
  ChevronDown,
} from 'lucide-react';
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
  // Available sizes
  const availableSizesList = (diamond.sizes || []).filter((s) => s.is_available);
  const defaultSize = availableSizesList.length > 0 ? availableSizesList[0].size_mm : null;
  const [selectedSizeMm, setSelectedSizeMm] = useState<number | null>(defaultSize);

  // Available colors
  const availableColors =
    diamond.available_colors && diamond.available_colors.length > 0
      ? diamond.available_colors
      : diamond.color
      ? [diamond.color]
      : [];
  const [selectedColor, setSelectedColor] = useState<string>(
    availableColors.length > 0 ? availableColors[0] : diamond.color || ''
  );

  // Available clarities
  const availableClarities =
    diamond.available_clarities && diamond.available_clarities.length > 0
      ? diamond.available_clarities
      : diamond.clarity
      ? [diamond.clarity]
      : [];
  const [selectedClarity, setSelectedClarity] = useState<string>(
    availableClarities.length > 0 ? availableClarities[0] : diamond.clarity || ''
  );

  const formattedSelectedSize = selectedSizeMm ? formatSizeMm(selectedSizeMm) : null;
  const pageUrl = `${siteUrl}/collections/${diamond.slug}`;

  const availability =
    diamond.availability_status || (availableSizesList.length > 0 ? 'Available' : 'Made to Order');
  const isAvailableNow = availability === 'Available';

  // Build dynamic CTA labels
  const dynamicSpecsSummary = [
    formattedSelectedSize,
    selectedColor ? `Color ${selectedColor}` : null,
    selectedClarity ? `Clarity ${selectedClarity}` : null,
  ]
    .filter(Boolean)
    .join(' • ');

  const handleScrollToInquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('inquiry-form-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
        {/* Left Column: Multi-View Gallery */}
        <div className="lg:col-span-7">
          <DiamondGallery
            images={diamond.images}
            diamondName={diamond.name}
            videoUrl={diamond.video_url}
          />
        </div>

        {/* Right Column: Diamond Specifications & Dynamic Selectors */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
          <div>
            {/* Category & Status Badges */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                {diamond.category && (
                  <span className="text-[11px] uppercase tracking-widest text-rajvi-gold font-semibold">
                    {diamond.category.name}
                  </span>
                )}
                <span className="text-rajvi-borderDark/40">|</span>
                <span className="text-[11px] uppercase tracking-widest text-rajvi-textMuted font-medium">
                  {diamond.shape}
                </span>
              </div>

              {/* Dynamic Availability Status Badge */}
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-[11px] uppercase tracking-wider font-semibold border ${
                  isAvailableNow
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}
              >
                {isAvailableNow ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                )}
                <span>{availability}</span>
              </span>
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-rajvi-offWhite border border-rajvi-borderLight text-rajvi-textDark text-[11px] font-medium mb-6">
              <ShieldCheck className="w-4 h-4 text-rajvi-gold" />
              <span>Artisanal Lapidary Cut in Surat, Gujarat • 100% Conflict-Free</span>
            </div>

            {/* Dynamic Variant Selectors */}
            <div className="space-y-6 pt-6 border-t border-rajvi-lightGrey mb-8">
              {/* 1. Size Selector */}
              <div>
                <DiamondSizeSelector
                  sizes={diamond.sizes}
                  selectedSize={selectedSizeMm}
                  onSelectSize={setSelectedSizeMm}
                />
              </div>

              {/* 2. Dynamic Color Selection */}
              {availableColors.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs uppercase tracking-wider text-rajvi-textMuted font-semibold">
                      Select Color Grade
                    </label>
                    <span className="text-xs text-rajvi-gold font-medium">
                      Selected: <strong>{selectedColor || 'None'}</strong>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map((color) => {
                      const isSelected = selectedColor.toLowerCase() === color.toLowerCase();
                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-all border ${
                            isSelected
                              ? 'bg-rajvi-black text-rajvi-gold border-rajvi-gold shadow-sm scale-105'
                              : 'bg-white text-rajvi-textDark border-rajvi-borderLight hover:border-rajvi-gold/60'
                          }`}
                        >
                          {color.length <= 2 ? `Color ${color}` : color}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Dynamic Clarity / Purity Selection */}
              {availableClarities.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs uppercase tracking-wider text-rajvi-textMuted font-semibold">
                      Select Clarity / Purity Grade
                    </label>
                    <span className="text-xs text-rajvi-gold font-medium">
                      Selected: <strong>{selectedClarity || 'None'}</strong>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableClarities.map((clarity) => {
                      const isSelected = selectedClarity.toLowerCase() === clarity.toLowerCase();
                      return (
                        <button
                          key={clarity}
                          type="button"
                          onClick={() => setSelectedClarity(clarity)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-all border ${
                            isSelected
                              ? 'bg-rajvi-black text-rajvi-gold border-rajvi-gold shadow-sm scale-105'
                              : 'bg-white text-rajvi-textDark border-rajvi-borderLight hover:border-rajvi-gold/60'
                          }`}
                        >
                          {clarity}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Active Selection Summary Card */}
              {dynamicSpecsSummary && (
                <div className="p-3 bg-rajvi-offWhite border border-rajvi-borderLight rounded-sm flex items-center justify-between text-xs">
                  <span className="text-rajvi-textMuted">Configured Cut:</span>
                  <span className="font-semibold text-rajvi-textDark">{dynamicSpecsSummary}</span>
                </div>
              )}
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-3 pt-2">
              {/* Request Price & Trade Quote Button */}
              <button
                type="button"
                onClick={handleScrollToInquiry}
                className="w-full inline-flex items-center justify-center gap-2.5 py-4 px-6 bg-rajvi-gold hover:bg-rajvi-goldLight text-rajvi-black font-semibold text-xs uppercase tracking-widest transition-all duration-300 shadow-md hover:scale-[1.01]"
              >
                <DollarSign className="w-4 h-4 text-rajvi-black" />
                <span>
                  Request Price Quote {dynamicSpecsSummary ? `(${dynamicSpecsSummary})` : ''}
                </span>
              </button>

              {/* WhatsApp Inquiry Button with Dynamic Prefilled Message */}
              <WhatsAppButton
                phoneNumber={settings.whatsapp_number}
                diamondName={diamond.name}
                selectedSize={formattedSelectedSize}
                color={selectedColor}
                clarity={selectedClarity}
                pageUrl={pageUrl}
                variant="outline"
                className="w-full text-center py-3.5 bg-white border border-rajvi-gold text-rajvi-gold hover:bg-rajvi-gold hover:text-white shadow-sm"
                label="Direct WhatsApp Inquiry with Master Cutter"
              />
            </div>
          </div>

          {/* Quick Notice */}
          <div className="pt-6 border-t border-rajvi-lightGrey text-[11px] text-rajvi-textMuted leading-relaxed">
            Rajvi Diamonds operates direct lapidary manufacturing in Surat, Gujarat. We supply calibrated parcels, single matched pairs, and bespoke private-label silhouettes to global jewelers.
          </div>
        </div>
      </div>

      {/* Detailed Description Section */}
      <div className="bg-white border border-rajvi-borderLight rounded-sm p-8 sm:p-12 mb-16 shadow-sm">
        <h2 className="font-serif text-2xl sm:text-3xl text-rajvi-textDark font-normal mb-6 pb-3 border-b border-rajvi-lightGrey">
          The Art & Architecture of the {diamond.name} Cut
        </h2>
        <div className="prose max-w-none text-xs sm:text-sm text-rajvi-textDark/85 leading-relaxed space-y-4 whitespace-pre-line font-light">
          {diamond.description}
        </div>
      </div>

      {/* Dynamic Specifications Table */}
      <div className="mb-20">
        <DiamondSpecsTable
          specifications={diamond.specifications}
          shape={diamond.shape}
          cutName={diamond.name}
          size={formattedSelectedSize}
          color={selectedColor}
          clarity={selectedClarity}
        />
      </div>

      {/* Dedicated Inquiry Form Section */}
      <div id="inquiry-form-section" className="mb-24 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-rajvi-gold font-semibold block mb-2">
            Inquire for {diamond.name}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-rajvi-textDark font-normal">
            Request Diamond Availability & Parcel Pricing
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-rajvi-textMuted">
            {dynamicSpecsSummary
              ? `You have selected ${dynamicSpecsSummary}. Fill the trade form below or connect via WhatsApp for an immediate quotation.`
              : 'Specify your requirements below. Our diamond specialists in Surat will respond within 24 business hours.'}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <ContactForm
            initialDiamondName={diamond.name}
            initialSize={formattedSelectedSize}
            initialColor={selectedColor}
            initialClarity={selectedClarity}
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
