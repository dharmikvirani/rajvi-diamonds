'use client';

import React from 'react';
import Image from 'next/image';
import { Instagram, ArrowUpRight, Sparkles } from 'lucide-react';

interface InstagramGalleryProps {
  instagramUrl?: string;
}

export default function InstagramGallery({
  instagramUrl = 'https://instagram.com/rajvidiamonds',
}: InstagramGalleryProps) {
  const galleryItems = [
    {
      src: '/images/cuts.jpeg',
      alt: 'Rajvi Diamonds Fancy Cut Diamond Collection',
      tag: 'Fancy Cut Parcels',
    },
    {
      src: '/images/polish.jpeg',
      alt: 'Artisan diamond polishing on cast iron scaife wheel in Surat atelier',
      tag: 'Surat Atelier Polishing',
    },
    {
      src: 'https://res.cloudinary.com/b2fsbbzr/image/upload/v1794891750/rajvi-diamonds/tef2et2mdtlcxvp3yvlb.jpg',
      alt: 'Rose Octagone Eight-Fold Geometric Faceted Dome',
      tag: 'Rose Octagone Crown',
    },
    {
      src: '/images/cuts2.jpeg',
      alt: 'Diamond facet symmetry and crystal dispersion',
      tag: 'Facet Symmetry',
    },
    {
      src: 'https://res.cloudinary.com/b2fsbbzr/image/upload/v1794891770/rajvi-diamonds/jxkquang9ap0ijqajtrt.jpg',
      alt: 'Side profile of artisanal fancy diamond cut',
      tag: 'Lapidary Profile',
    },
    {
      src: '/images/cuts3.jpeg',
      alt: 'Table reflection and fire in high-clarity diamond',
      tag: 'Optical Scintillation',
    },
  ];

  return (
    <section className="py-24 sm:py-28 bg-[#0D0C0A] text-white border-t border-[#2A2722] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-rajvi-gold font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Visual Gallery</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-white leading-tight">
              Discover Our World
            </h2>
            <p className="mt-3 text-white/70 text-sm sm:text-base leading-relaxed font-light">
              An intimate curation of our bespoke fancy cuts, facet geometries, and Surat atelier craftsmanship.
            </p>
          </div>

          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-rajvi-gold/50 rounded-sm text-rajvi-gold hover:bg-rajvi-gold hover:text-[#0D0C0A] text-xs uppercase tracking-widest font-semibold transition-all duration-300 self-start sm:self-auto hover:scale-105"
            >
              <Instagram className="w-4 h-4" />
              <span>Follow On Instagram</span>
            </a>
          )}
        </div>

        {/* 6-Item Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {galleryItems.map((item, idx) => (
            <div
              key={idx}
              className="group relative aspect-square rounded-sm overflow-hidden bg-[#141311] border border-[#2A2722] hover:border-rajvi-gold/60 transition-all duration-300 shadow-sm"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
              />
              {/* Luxury Hover Overlay */}
              <div className="absolute inset-0 bg-[#0D0C0A]/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5 sm:p-4">
                <div className="flex justify-end">
                  <span className="w-6 h-6 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-rajvi-goldLight">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-rajvi-goldLight font-medium block">
                    {item.tag}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}