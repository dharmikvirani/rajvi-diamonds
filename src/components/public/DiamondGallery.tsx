'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ZoomIn, Sparkles } from 'lucide-react';
import { DiamondImage } from '@/lib/types';

interface DiamondGalleryProps {
  images: DiamondImage[];
  diamondName: string;
}

export default function DiamondGallery({ images, diamondName }: DiamondGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Fallback image if empty
  const galleryImages =
    images.length > 0
      ? images
      : [
          {
            id: 'fallback-1',
            diamond_id: 'temp',
            image_url: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1600&q=85',
            alt_text: diamondName,
            is_primary: true,
            display_order: 1,
            created_at: new Date().toISOString(),
          },
        ];

  const currentImage = galleryImages[selectedIndex] || galleryImages[0];

  return (
    <div className="flex flex-col space-y-4">
      {/* Main Image Display */}
      <div
        className="relative aspect-square w-full rounded-sm overflow-hidden bg-rajvi-offWhite border border-rajvi-borderLight group cursor-zoom-in"
        onClick={() => setIsZoomed(!isZoomed)}
      >
        <Image
          src={currentImage.image_url}
          alt={currentImage.alt_text || `${diamondName} View ${selectedIndex + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`object-cover object-center transition-all duration-500 ${
            isZoomed ? 'scale-125' : 'group-hover:scale-105'
          }`}
        />

        {/* Zoom hint badge */}
        <div className="absolute top-4 right-4 bg-black/60 text-white backdrop-blur-sm px-2.5 py-1 rounded-sm text-[11px] flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="w-3.5 h-3.5 text-rajvi-gold" />
          <span>{isZoomed ? 'Click to Reset' : 'Click to Zoom'}</span>
        </div>

        {/* Genuine cut hallmark */}
        <div className="absolute bottom-4 left-4 bg-rajvi-black/80 text-rajvi-goldLight border border-rajvi-gold/30 px-3 py-1 rounded-sm text-[10px] tracking-wider uppercase font-semibold flex items-center gap-1.5 backdrop-blur-sm">
          <Sparkles className="w-3 h-3 text-rajvi-gold" />
          <span>Rajvi Master Cut</span>
        </div>
      </div>

      {/* Thumbnails Navigation */}
      {galleryImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {galleryImages.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => {
                setSelectedIndex(idx);
                setIsZoomed(false);
              }}
              className={`relative w-20 h-20 rounded-sm overflow-hidden border-2 shrink-0 transition-all ${
                selectedIndex === idx
                  ? 'border-rajvi-gold shadow-md'
                  : 'border-rajvi-borderLight hover:border-rajvi-gold/50 opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={img.image_url}
                alt={img.alt_text || `Thumbnail ${idx + 1}`}
                fill
                className="object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
