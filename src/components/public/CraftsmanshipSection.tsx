'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Compass, Sparkles, Eye, CheckCircle2 } from 'lucide-react';

export default function CraftsmanshipSection() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      step: '01',
      title: 'Diamond Selection',
      tagline: 'Rough Evaluation & Optical Orientation',
      description:
        'Every rough crystal is rigorously evaluated for crystal lattice purity, natural grain, and optical transparency before planning the optimal fancy silhouette.',
      image: '/images/cuts2.jpeg',
      alt: 'Rough diamond evaluation and crystal orientation planning',
      badge: 'Rough Planning',
    },
    {
      step: '02',
      title: 'Precision Cutting',
      tagline: 'Laser Kerfing & Facet Geometry',
      description:
        'Advanced kerfing defines the exact geometric perimeter—establishing the crisp eight-fold octagon dome or the curved petal lines of the Tulip cut.',
      image: '/images/cuts.jpeg',
      alt: 'Precision diamond blocking and laser kerfing',
      badge: 'Geometric Kerfing',
    },
    {
      step: '03',
      title: 'Expert Polishing',
      tagline: 'Artisanal Scaife Faceting in Surat',
      description:
        'Master lapidaries in our Surat workshop hand-orient each facet plane against the cast iron scaife wheel, achieving mirror-like optical luster and fire.',
      image: '/images/polish.jpeg',
      alt: 'Artisan diamond polishing on cast iron scaife wheel in Surat workshop',
      badge: 'Master Lapidary',
    },
    {
      step: '04',
      title: 'Final Diamond',
      tagline: 'Microscopic Inspection & Calibrated Sizing',
      description:
        'Each completed diamond undergoes darkfield microscopic examination and precision gauge measurement to ensure exact millimeter consistency.',
      image: '/images/cuts3.jpeg',
      alt: 'Final finished fancy cut diamond inspection',
      badge: 'Final Calibration',
    },
  ];

  return (
    <section className="py-24 sm:py-32 bg-[#12110F] text-white border-t border-[#2A2722] relative overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-rajvi-gold/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-rajvi-gold/30 bg-[#1A1916] text-rajvi-goldLight text-[11px] uppercase tracking-[0.25em] font-medium mb-4 shadow-sm">
            <Compass className="w-3.5 h-3.5 text-rajvi-gold" />
            <span>Generational Lapidary Mastery</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white leading-tight">
            The Art Behind Every Diamond
          </h2>
          <p className="mt-4 text-white/70 text-sm sm:text-base leading-relaxed font-light max-w-xl mx-auto">
            From raw crystal selection to hand-guided scaife polishing, discover the disciplined four-stage journey of our fancy cut diamonds.
          </p>
        </div>

        {/* Process Showcase: Large Photography alongside Text */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Large Photography with Smooth Transition */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-sm overflow-hidden bg-[#0D0C0A] border border-[#2A2722] shadow-luxuryDark group">
              <Image
                src={steps[activeStep].image}
                alt={steps[activeStep].alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center transition-all duration-700 ease-in-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0A]/85 via-transparent to-transparent" />

              {/* Step Pill */}
              <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1 bg-[#0D0C0A]/90 backdrop-blur-md border border-rajvi-gold/40 text-rajvi-goldLight text-[11px] uppercase tracking-widest font-semibold rounded-sm">
                <Sparkles className="w-3 h-3 text-rajvi-gold" />
                <span>Step {steps[activeStep].step} • {steps[activeStep].badge}</span>
              </div>

              {/* Bottom Caption */}
              <div className="absolute bottom-4 left-4 right-4 p-4 bg-[#0D0C0A]/85 backdrop-blur-md border border-[#2A2722] rounded-sm">
                <span className="text-[10px] uppercase tracking-widest text-rajvi-gold block mb-1">
                  Stage {steps[activeStep].step}
                </span>
                <p className="font-serif text-lg text-white font-normal">
                  {steps[activeStep].title} — {steps[activeStep].tagline}
                </p>
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
                      ? 'bg-[#181714] border-rajvi-gold/80 shadow-md ring-1 ring-rajvi-gold/20'
                      : 'bg-[#141311] border-[#2A2722] hover:border-[#3A3731] hover:bg-[#161512]'
                  }`}
                >
                  <div
                    className={`font-serif text-2xl font-light shrink-0 transition-colors ${
                      isActive ? 'text-rajvi-gold' : 'text-white/30'
                    }`}
                  >
                    {item.step}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3
                        className={`font-serif text-lg font-normal transition-colors ${
                          isActive ? 'text-white' : 'text-white/80'
                        }`}
                      >
                        {item.title}
                      </h3>
                      {isActive && (
                        <CheckCircle2 className="w-4 h-4 text-rajvi-gold shrink-0" />
                      )}
                    </div>

                    <p className="text-xs text-white/60 leading-relaxed font-light">
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