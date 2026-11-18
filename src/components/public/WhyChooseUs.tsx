import React from 'react';
import { Compass, Sparkles, Gem, Users, ArrowRight } from 'lucide-react';

export default function WhyChooseUs() {
  const propositions = [
    {
      icon: Compass,
      number: '01',
      title: 'Precision Craftsmanship',
      description:
        'Every diamond reflects attention to detail and precision, with facet angles mathematically calibrated to produce extraordinary light performance.',
    },
    {
      icon: Sparkles,
      number: '02',
      title: 'Exceptional Quality',
      description:
        'Focus on quality and carefully selected diamond specifications, ensuring superior optical clarity, polish luster, and symmetry in every parcel.',
    },
    {
      icon: Gem,
      number: '03',
      title: 'Distinctive Cuts',
      description:
        'Discover unique fancy-cut diamond designs—from our signature architectural Rose Octagone to organic floral silhouettes and custom geometries.',
    },
    {
      icon: Users,
      number: '04',
      title: 'Customer Commitment',
      description:
        'Dedicated support and personalized business inquiries, providing responsive consultation and tailored millimeter parcels for trade partners globally.',
    },
  ];

  return (
    <section className="bg-[#0D0C0A] text-white py-24 sm:py-28 border-t border-[#2A2722] relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-rajvi-gold/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="text-[11px] uppercase tracking-[0.25em] text-rajvi-gold font-semibold block mb-3">
            Why Partner with Rajvi
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-normal tracking-tight leading-tight">
            Excellence in Every Detail
          </h2>
          <p className="mt-4 text-white/70 text-sm sm:text-base leading-relaxed font-light max-w-xl mx-auto">
            The core pillars guiding every facet of our diamond cutting mastery and wholesale trade relationships.
          </p>
        </div>

        {/* 4 Value Propositions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {propositions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#141311] border border-[#2A2722] p-8 rounded-sm hover:border-rajvi-gold/60 transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between shadow-luxuryDark"
              >
                <div>
                  {/* Top Row: Icon & Roman Number */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 rounded-sm bg-[#1A1916] border border-[#2A2722] flex items-center justify-center group-hover:border-rajvi-gold/60 transition-colors">
                      <Icon className="w-5 h-5 text-rajvi-gold group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="font-serif text-xs text-white/30 tracking-widest uppercase">
                      {item.number}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl text-white mb-3 font-normal group-hover:text-rajvi-goldLight transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-white/65 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-[#2A2722]/80 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-rajvi-gold/80 font-medium">
                    Atelier Standard
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-rajvi-gold" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Minimal Bottom Strip */}
        <div className="mt-16 p-6 sm:p-8 bg-[#141311] border border-[#2A2722] rounded-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-serif text-lg text-white font-normal mb-1">
              Have Specific Diamond Cutting Requirements?
            </h4>
            <p className="text-xs text-white/60 font-light">
              Connect with our lapidary specialists to discuss bespoke millimeter dimensions and parcel quotations.
            </p>
          </div>

          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-rajvi-gold hover:bg-rajvi-goldLight text-[#0D0C0A] font-semibold text-xs uppercase tracking-widest rounded-sm transition-all shadow-sm hover:scale-105 shrink-0"
          >
            <span>Discuss Requirements</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
