import React from 'react';
import Image from 'next/image';
import { Compass, Hammer, Cpu, CheckCircle, ArrowRight } from 'lucide-react';

export default function ManufacturingWorkshop() {
  const steps = [
    {
      step: '01',
      title: '3D Optical Mapping & Rough Planning',
      description:
        'Each rough diamond crystal undergoes computerized Sarine/Argyle scanning to map crystal axes and internal grain. Our master planners align table and pavilion angles to maximize light dispersion for specific fancy silhouettes.',
      badge: 'Sarine 3D Analysis',
    },
    {
      step: '02',
      title: 'Laser Kerfing & Pre-Shaping',
      description:
        'State-of-the-art diode laser systems execute non-contact kerfing to establish the outer contour—whether the eight-fold geometry of the Rose Octagone or the organic curves of the Tulip cut.',
      badge: 'Sub-Micron Laser Kerf',
    },
    {
      step: '03',
      title: 'Artisanal Scaife Faceting & Polishing',
      description:
        'Hand-guided by senior Surat lapidaries with decades of fancy cut experience. Each facet is placed against the cast iron scaife with exact pressure and angular orientation, polishing to mirror-like luster.',
      badge: 'Master Hand Lapidary',
    },
    {
      step: '04',
      title: 'Microscopic Optical Inspection & Sizing',
      description:
        'Every finished diamond is examined under 40x darkfield binocular magnification. Calibrated gauges ensure precision millimeter matching before parcels are sealed for dispatch.',
      badge: '40x Darkfield QC',
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#181714] text-rajvi-offWhite border-b border-rajvi-borderDark/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] text-rajvi-gold font-semibold block mb-2">
              Inside Our Surat Workshop
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-rajvi-offWhite tracking-tight leading-tight">
              Artisan Manufacturing & The Lapidary Process
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-rajvi-offWhite/70 max-w-md font-light leading-relaxed">
            Every Rajvi Diamonds parcel is manufactured in Surat, Gujarat—combining mathematical geometric planning with multi-generational lapidary mastery.
          </p>
        </div>

        {/* 4-Step Process Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="relative bg-[#1F1E1A] border border-rajvi-borderDark/80 rounded-sm p-6 sm:p-8 flex flex-col justify-between hover:border-rajvi-gold/60 transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-serif text-3xl font-light text-rajvi-gold/80 group-hover:text-rajvi-gold transition-colors">
                    {item.step}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-sm bg-rajvi-black/60 text-rajvi-gold border border-rajvi-gold/20">
                    {item.badge}
                  </span>
                </div>

                <h3 className="font-serif text-lg sm:text-xl text-rajvi-offWhite font-normal mb-3 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-rajvi-offWhite/65 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-rajvi-borderDark/60 flex items-center gap-1.5 text-[11px] text-rajvi-gold font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Zero Compromise Lapidary</span>
              </div>
            </div>
          ))}
        </div>

        {/* Workshop Trust Strip */}
        <div className="mt-16 p-6 sm:p-8 bg-[#141311] border border-rajvi-borderDark/60 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h4 className="font-serif text-lg text-rajvi-offWhite font-normal mb-1">
              Direct Manufacturer Pricing & Trade Transparency
            </h4>
            <p className="text-xs text-rajvi-offWhite/60 font-light">
              By cutting out intermediary trading desks, we supply diamond parcels directly from our Surat lapidary studio to trade partners globally.
            </p>
          </div>

          <a
            href="/collections"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-rajvi-gold hover:bg-rajvi-goldLight text-rajvi-black text-xs uppercase tracking-widest font-semibold transition-colors shadow-md"
          >
            <span>Explore Diamond Cuts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
