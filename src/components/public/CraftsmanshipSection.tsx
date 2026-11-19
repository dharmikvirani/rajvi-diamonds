'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Compass, Sparkles, Eye, CheckCircle2 } from 'lucide-react';

interface CraftsmanshipSectionProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  items?: {
    id?: string;
    step: string;
    title: string;
    tagline: string;
    description: string;
    image_url: string;
    image_alt?: string;
    badge: string;
  }[];
}

export default function CraftsmanshipSection({
  title = 'Our Craftsmanship',
  subtitle = 'From raw stone evaluation to scaife polishing in Surat, explore the disciplined journey behind our fancy cut diamonds.',
  badge = 'Artisanal Process',
  items,
}: CraftsmanshipSectionProps) {
  const [activeStep, setActiveStep] = useState(0);

  const defaultSteps = [
    {
      step: '01',
      title: 'Diamond Selection',
      tagline: 'Rough Evaluation & Shape Planning',
      description:
        'Each rough crystal is carefully evaluated for optical transparency and natural grain structure before determining the ideal fancy-cut silhouette.',
      image_url: '/images/cuts2.jpeg',
      image_alt: 'Rough diamond evaluation and shape planning',
      badge: 'Crystal Planning',
    },
    {
      step: '02',
      title: 'Facet Planning',
      tagline: 'Geometric Contours & Proportions',
      description:
        'Facet proportions are mathematically calculated to shape the distinctive geometry—whether the eight-fold dome of Rose Octagone or the curves of the Tulip cut.',
      image_url: '/images/cuts.jpeg',
      image_alt: 'Diamond facet planning and geometric proportions',
      badge: 'Facet Geometry',
    },
    {
      step: '03',
      title: 'Expert Polishing',
      tagline: 'Hand-Polishing on the Scaife Wheel',
      description:
        'Skilled lapidaries in our Surat workshop hand-polish facet planes against the scaife wheel, achieving clean facet junction lines and optical luster.',
      image_url: '/images/polish.jpeg',
      image_alt: 'Diamond hand-polishing on scaife wheel in Surat workshop',
      badge: 'Surat Lapidary',
    },
    {
      step: '04',
      title: 'Final Diamond',
      tagline: 'Quality Inspection & Calibrated Sizing',
      description:
        'Each finished diamond is carefully inspected for symmetry, polish luster, and exact millimeter dimensions before parcel dispatch.',
      image_url: '/images/cuts3.jpeg',
      image_alt: 'Final finished fancy cut diamond inspection',
      badge: 'Precision Sizing',
    },
  ];

  const steps = items && items.length > 0 ? items : defaultSteps;
  const currentStep = steps[activeStep] || steps[0];

  return (
    <section className="py-20 sm:py-24 bg-[#FDFBF7] text-rajvi-textDark border-t border-rajvi-borderLight relative overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-rajvi-gold/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-rajvi-gold/40 bg-white/90 text-rajvi-goldMuted text-[11px] uppercase tracking-[0.25em] font-medium mb-3 shadow-sm">
            <Compass className="w-3.5 h-3.5 text-rajvi-gold" />
            <span>{badge}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-rajvi-textDark leading-tight">
            {title}
          </h2>
          <p className="mt-3 text-rajvi-textMuted text-sm sm:text-base leading-relaxed font-light max-w-xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Process Showcase: Large Photography alongside Text */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Large Photography with Smooth Transition */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-sm overflow-hidden bg-white border border-rajvi-borderLight shadow-luxury group p-2">
              <div className="relative w-full h-full rounded-sm overflow-hidden">
                <Image
                  src={currentStep.image_url || '/images/cuts2.jpeg'}
                  alt={currentStep.image_alt || currentStep.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover object-center transition-all duration-700 ease-in-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Step Pill */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1 bg-white/95 backdrop-blur-md border border-rajvi-gold/40 text-rajvi-textDark text-[11px] uppercase tracking-widest font-semibold rounded-sm shadow-sm">
                  <Sparkles className="w-3 h-3 text-rajvi-gold" />
                  <span>Step {currentStep.step} • {currentStep.badge}</span>
                </div>

                {/* Bottom Caption */}
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/95 backdrop-blur-md border border-rajvi-borderLight rounded-sm shadow-sm">
                  <span className="text-[10px] uppercase tracking-widest text-rajvi-gold block mb-1 font-semibold">
                    Stage {currentStep.step}
                  </span>
                  <p className="font-serif text-lg text-rajvi-textDark font-normal">
                    {currentStep.title} — {currentStep.tagline}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Step-by-Step Interactive Progression */}
          <div className="lg:col-span-5 space-y-4">
            {steps.map((item, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full text-left p-5 sm:p-6 rounded-sm border transition-all duration-300 flex items-start gap-4 ${
                    isActive
                      ? 'bg-white border-rajvi-gold shadow-luxury ring-1 ring-rajvi-gold/30'
                      : 'bg-[#FAF8F5] border-rajvi-borderLight hover:border-rajvi-gold/60 hover:bg-white'
                  }`}
                >
                  <div
                    className={`font-serif text-2xl font-light shrink-0 transition-colors ${
                      isActive ? 'text-rajvi-gold font-medium' : 'text-rajvi-textMuted/40'
                    }`}
                  >
                    {item.step}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3
                        className={`font-serif text-lg font-normal transition-colors ${
                          isActive ? 'text-rajvi-textDark font-medium' : 'text-rajvi-textDark/85'
                        }`}
                      >
                        {item.title}
                      </h3>
                      {isActive && (
                        <CheckCircle2 className="w-4 h-4 text-rajvi-gold shrink-0" />
                      )}
                    </div>

                    <p className="text-xs text-rajvi-textMuted leading-relaxed font-light">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}