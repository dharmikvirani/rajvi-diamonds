import React from 'react';
import { Award, Compass, Eye, HeartHandshake, Layers } from 'lucide-react';

export default function WhyChooseUs() {
  const pillars = [
    {
      icon: Eye,
      title: 'Fancy Cut Specialization',
      description:
        'Rather than ordinary commercial round brilliants, our dedicated focus is on extraordinary fancy shapes, antique rose cuts, and distinctive geometric contours.',
    },
    {
      icon: Award,
      title: 'Uncompromising Quality Commitment',
      description:
        'Every rough stone is carefully evaluated for interior optical clarity, face-up brilliance, and facet symmetry before it enters the cutting wheel.',
    },
    {
      icon: Compass,
      title: 'Artisanal Craftsmanship',
      description:
        'Our lapidary artisans combine generational diamond polishing mastery with contemporary precision tools to hand-orient each facet angle.',
    },
    {
      icon: Layers,
      title: 'Calibrated Variety of Cuts',
      description:
        'From our signature Rose Octagone to organic Tulip cuts and architectural hexagons, we supply diverse silhouettes in exact millimeter specifications.',
    },
    {
      icon: HeartHandshake,
      title: 'Enduring Trade Partnerships',
      description:
        'We work intimately with independent jewellery designers, bespoke ateliers, and international wholesalers, prioritizing integrity and responsive communication.',
    },
  ];

  return (
    <section className="bg-rajvi-black py-24 border-t border-rajvi-borderDark/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-rajvi-gold font-semibold block mb-3">
            Our Hallmarks
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-rajvi-offWhite font-normal tracking-tight">
            Why Partner with Rajvi Diamonds
          </h2>
          <p className="mt-4 text-rajvi-offWhite/70 text-sm sm:text-base leading-relaxed">
            Distinguished by rare cut mastery, millimeter precision, and dedicated personalized trade support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-rajvi-cardDark border border-rajvi-borderDark p-8 rounded-sm hover:border-rajvi-gold/40 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-sm bg-rajvi-charcoal border border-rajvi-gold/20 flex items-center justify-center mb-6 group-hover:border-rajvi-gold transition-colors">
                  <Icon className="w-6 h-6 text-rajvi-gold" />
                </div>
                <h3 className="font-serif text-xl text-rajvi-offWhite mb-3 font-normal group-hover:text-rajvi-goldLight transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-rajvi-offWhite/70 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}

          {/* Quick Inquiry Card */}
          <div className="bg-gradient-to-br from-rajvi-charcoal to-rajvi-cardDark border border-rajvi-gold/30 p-8 rounded-sm flex flex-col justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-rajvi-gold font-semibold block mb-2">
                Custom Cuts & Projects
              </span>
              <h3 className="font-serif text-xl text-rajvi-offWhite mb-3 font-normal">
                Looking for Bespoke Cut Proportions?
              </h3>
              <p className="text-xs sm:text-sm text-rajvi-offWhite/70 leading-relaxed">
                Connect directly with our master lapidary team to discuss tailored parcels, custom millimeter sizes, or one-of-a-kind shapes.
              </p>
            </div>
            <div className="pt-6">
              <a
                href="/contact"
                className="inline-block px-5 py-2.5 bg-rajvi-gold text-rajvi-black text-xs uppercase tracking-widest font-semibold hover:bg-rajvi-goldLight transition-colors"
              >
                Submit Trade Inquiry
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
