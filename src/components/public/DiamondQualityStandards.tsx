import React from 'react';
import { Sparkles, Eye, ShieldCheck, Scale, Award, Gem } from 'lucide-react';

export default function DiamondQualityStandards() {
  const standards = [
    {
      icon: Gem,
      title: 'Ethical Rough Selection',
      subtitle: 'Natural Conflict-Free Origin',
      description:
        'Every parcel begins with responsibly sourced natural rough diamonds, selected for exceptional crystal purity, low internal strain, and optimal light transmission.',
    },
    {
      icon: Eye,
      title: 'Microscopic Facet Symmetry',
      subtitle: 'Laser-Calibrated Alignment',
      description:
        'Fancy cut contours require acute geometric precision. Our master lapidaries craft facet junctions under high magnification for maximum optical scintillation.',
    },
    {
      icon: Scale,
      title: 'Rigorous 4Cs Grading',
      subtitle: 'D–Z Colors & FL–VS Purities',
      description:
        'All diamonds are individually graded under standardized daylight gemological lighting to verify true color grade, clarity dispersion, and Polish/Symmetry ratings.',
    },
    {
      icon: Award,
      title: 'Precision Millimeter Calibration',
      subtitle: '±0.05 mm Parcel Uniformity',
      description:
        'Critical for high jewellery casting and pavé settings. We deliver calibrated parcels in matching diameters (4.0 mm, 4.5 mm, 5.0 mm, 5.5 mm, 6.0 mm).',
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-white border-b border-rajvi-borderLight/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-rajvi-gold/40 bg-rajvi-offWhite text-rajvi-gold text-[11px] uppercase tracking-[0.25em] font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Lapidary Excellence</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-rajvi-textDark tracking-tight mb-4 leading-tight">
            Diamond Quality & Craftsmanship Standards
          </h2>
          <p className="text-sm sm:text-base text-rajvi-textMuted font-light leading-relaxed">
            In Surat, the diamond capital of the world, Rajvi Diamonds blends centuries-old artisanal lapidary traditions with modern optical measurement tools to sculpt fancy cuts of extraordinary fire.
          </p>
        </div>

        {/* Quality Standards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {standards.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-rajvi-offWhite border border-rajvi-borderLight/80 rounded-sm p-6 sm:p-8 flex flex-col justify-between hover:border-rajvi-gold/60 transition-all duration-300 hover:shadow-luxury group"
              >
                <div>
                  <div className="w-12 h-12 rounded-sm bg-white border border-rajvi-borderLight/80 flex items-center justify-center text-rajvi-gold mb-6 group-hover:scale-110 group-hover:border-rajvi-gold/50 transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-rajvi-gold font-semibold block mb-1">
                    {item.subtitle}
                  </span>
                  <h3 className="font-serif text-xl text-rajvi-textDark font-normal mb-3">
                    {item.title}
                  </h3>
                  <p className="text-xs text-rajvi-textMuted leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-rajvi-borderLight/60 flex items-center gap-1.5 text-[11px] text-rajvi-gold font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Rajvi Standard</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
