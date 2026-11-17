import React from 'react';
import { Compass, Sparkles, MessageCircle, FileText, CheckCircle2 } from 'lucide-react';
import WhatsAppButton from './WhatsAppButton';

interface CustomCuttingSectionProps {
  whatsappNumber?: string;
}

export default function CustomCuttingSection({
  whatsappNumber = '+919924151515',
}: CustomCuttingSectionProps) {
  const customFeatures = [
    'Proprietary & Exclusive Silhouette Cutting (Under NDA)',
    'Millimeter Calibrated Parcels (4 mm, 4.5 mm, 5 mm, 5.5 mm, 6 mm)',
    'Precision Matched Pairs for Solitaire Earrings & Three-Stone Suites',
    'Custom Layouts for High Jewellery Collars, Bracelets & Halos',
    'Certified Conflict-Free Natural Rough Sourced Directly',
    'Export Delivery with Full Insurance & Parcel Documentation',
  ];

  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-white via-rajvi-offWhite to-white border-b border-rajvi-borderLight/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-rajvi-gold/30 rounded-sm p-8 sm:p-14 shadow-luxury relative overflow-hidden">
          {/* Subtle decorative gold corner accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-rajvi-gold/15 to-transparent pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Col: Custom Lapidary Details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-rajvi-gold/40 bg-rajvi-offWhite text-rajvi-gold text-[11px] uppercase tracking-[0.25em] font-semibold">
                <Compass className="w-3.5 h-3.5" />
                <span>Bespoke Lapidary Studio</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-rajvi-textDark tracking-tight leading-tight">
                Custom Diamond Cutting & Calibrated Parcel Manufacturing
              </h2>

              <p className="text-sm sm:text-base text-rajvi-textMuted font-light leading-relaxed">
                Have a signature silhouette, bespoke engagement suite, or specific millimeter requirement that standard wholesale markets cannot supply?
              </p>

              <p className="text-xs sm:text-sm text-rajvi-textDark/80 leading-relaxed font-light">
                Our Surat lapidary studio collaborates directly with fine jewellery maisons, independent ateliers, and private designers worldwide to engineer custom fancy cut parcels tailored to exact CAD mountings.
              </p>

              {/* Feature Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {customFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-rajvi-textDark/90">
                    <CheckCircle2 className="w-4 h-4 text-rajvi-gold shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                <WhatsAppButton
                  phoneNumber={whatsappNumber}
                  variant="primary"
                  className="w-full sm:w-auto px-8 py-3.5 text-center shadow-md"
                  label="Discuss Custom Silhouette on WhatsApp"
                  customMessage="Hello Rajvi Diamonds, I am interested in discussing a custom diamond cutting project / bespoke parcel order."
                />

                <a
                  href="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-rajvi-borderLight hover:border-rajvi-gold text-rajvi-textDark hover:text-rajvi-gold text-xs uppercase tracking-widest font-semibold transition-colors shadow-sm"
                >
                  <FileText className="w-4 h-4" />
                  <span>Submit Custom Specs Form</span>
                </a>
              </div>
            </div>

            {/* Right Col: Surat Workshop Credential Card */}
            <div className="lg:col-span-5 bg-rajvi-offWhite border border-rajvi-borderLight rounded-sm p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-rajvi-borderLight">
                <div className="w-10 h-10 rounded-full bg-white border border-rajvi-gold/40 flex items-center justify-center text-rajvi-gold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-rajvi-textDark font-medium">
                    Rajvi Diamonds Studio
                  </h4>
                  <span className="text-[11px] text-rajvi-textMuted">Surat, Gujarat, India</span>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start justify-between pb-3 border-b border-rajvi-borderLight/60">
                  <span className="text-rajvi-textMuted uppercase text-[10px] tracking-wider">
                    Location
                  </span>
                  <span className="font-semibold text-rajvi-textDark text-right">
                    Surat Diamond Hub, Gujarat
                  </span>
                </div>

                <div className="flex items-start justify-between pb-3 border-b border-rajvi-borderLight/60">
                  <span className="text-rajvi-textMuted uppercase text-[10px] tracking-wider">
                    Core Specialization
                  </span>
                  <span className="font-semibold text-rajvi-textDark text-right">
                    Rose Octagone, Tulip & Fancy Cuts
                  </span>
                </div>

                <div className="flex items-start justify-between pb-3 border-b border-rajvi-borderLight/60">
                  <span className="text-rajvi-textMuted uppercase text-[10px] tracking-wider">
                    Millimeter Range
                  </span>
                  <span className="font-semibold text-rajvi-textDark text-right">
                    4.0 mm to 6.0 mm+ Calibrated
                  </span>
                </div>

                <div className="flex items-start justify-between pb-3 border-b border-rajvi-borderLight/60">
                  <span className="text-rajvi-textMuted uppercase text-[10px] tracking-wider">
                    Order Model
                  </span>
                  <span className="font-semibold text-rajvi-textDark text-right">
                    Wholesale Parcels & Matched Pairs
                  </span>
                </div>

                <div className="flex items-start justify-between">
                  <span className="text-rajvi-textMuted uppercase text-[10px] tracking-wider">
                    Direct Channel
                  </span>
                  <span className="font-semibold text-rajvi-gold text-right">
                    WhatsApp & Verified Inquiry
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
