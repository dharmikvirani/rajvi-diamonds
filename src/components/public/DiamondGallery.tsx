'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  ZoomIn,
  Sparkles,
  Play,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Layers,
} from 'lucide-react';
import { DiamondImage } from '@/lib/types';

interface DiamondGalleryProps {
  images: DiamondImage[];
  diamondName: string;
  videoUrl?: string | null;
}

export default function DiamondGallery({
  images,
  diamondName,
  videoUrl,
}: DiamondGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeMedia, setActiveMedia] = useState<'image' | 'video'>('image');

  // Fallback image if empty
  const galleryImages =
    images && images.length > 0
      ? images
      : [
          {
            id: 'fallback-1',
            diamond_id: 'temp',
            image_url:
              'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1600&q=85',
            alt_text: diamondName,
            is_primary: true,
            display_order: 1,
            view_tag: 'front',
            created_at: new Date().toISOString(),
          },
        ];

  const currentImage = galleryImages[selectedIndex] || galleryImages[0];

  // Helper to determine friendly view label
  const getViewLabel = (img: DiamondImage, idx: number) => {
    if (img.view_tag && img.view_tag !== 'general') {
      switch (img.view_tag.toLowerCase()) {
        case 'front':
          return 'Front Face';
        case 'side':
          return 'Side Profile';
        case 'close_up':
        case 'close-up':
          return 'Close-Up Facets';
        case 'table':
          return 'Table & Crown';
        case 'hand':
          return 'Hand Scale';
        default:
          return img.view_tag;
      }
    }
    // Infer based on position
    if (idx === 0) return 'Front Face';
    if (idx === 1) return 'Side Profile';
    if (idx === 2) return 'Close-Up Facets';
    return `Perspective ${idx + 1}`;
  };

  const currentViewLabel = getViewLabel(currentImage, selectedIndex);

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev + 1) % galleryImages.length);
    setActiveMedia('image');
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    setActiveMedia('image');
  };

  return (
    <div className="flex flex-col space-y-4 select-none">
      {/* Quick Perspective Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] uppercase tracking-wider text-rajvi-textMuted font-semibold mr-1 flex items-center gap-1">
          <Eye className="w-3.5 h-3.5 text-rajvi-gold" />
          <span>Views:</span>
        </span>

        {galleryImages.map((img, idx) => {
          const label = getViewLabel(img, idx);
          const isActive = activeMedia === 'image' && selectedIndex === idx;
          return (
            <button
              key={img.id}
              onClick={() => {
                setSelectedIndex(idx);
                setActiveMedia('image');
                setIsZoomed(false);
              }}
              className={`px-3 py-1 text-[11px] uppercase tracking-wider rounded-sm transition-all font-medium border ${
                isActive
                  ? 'bg-rajvi-black text-rajvi-gold border-rajvi-gold shadow-sm'
                  : 'bg-white text-rajvi-textDark border-rajvi-borderLight hover:border-rajvi-gold/60'
              }`}
            >
              {label}
            </button>
          );
        })}

        {/* Video Tab (if video URL provided) */}
        {videoUrl && (
          <button
            onClick={() => setActiveMedia('video')}
            className={`inline-flex items-center gap-1 px-3 py-1 text-[11px] uppercase tracking-wider rounded-sm transition-all font-medium border ${
              activeMedia === 'video'
                ? 'bg-rajvi-gold text-black border-rajvi-gold font-semibold shadow-sm'
                : 'bg-white text-rajvi-textDark border-rajvi-borderLight hover:border-rajvi-gold/60'
            }`}
          >
            <Play className="w-3 h-3 fill-current" />
            <span>360° Video</span>
          </button>
        )}
      </div>

      {/* Main Display Container */}
      <div className="relative aspect-square w-full rounded-sm overflow-hidden bg-rajvi-offWhite border border-rajvi-borderLight group shadow-sm">
        {activeMedia === 'video' && videoUrl ? (
          /* Video Player */
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            {videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') || videoUrl.includes('vimeo.com') ? (
              <iframe
                src={videoUrl}
                title={`${diamondName} 360 Spin`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={videoUrl}
                controls
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain"
              />
            )}
          </div>
        ) : (
          /* Main Interactive Image Display */
          <div
            className="relative w-full h-full cursor-zoom-in"
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <Image
              src={currentImage.image_url}
              alt={currentImage.alt_text || `${diamondName} ${currentViewLabel}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 55vw"
              className={`object-cover object-center transition-all duration-500 ${
                isZoomed ? 'scale-150' : 'group-hover:scale-105'
              }`}
            />

            {/* Navigation Arrows for Quick Flipping */}
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  aria-label="Previous diamond image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 text-rajvi-textDark hover:bg-white hover:text-rajvi-gold flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Next diamond image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 text-rajvi-textDark hover:bg-white hover:text-rajvi-gold flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Top Right Action Badges (Zoom & Lightbox) */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed(!isZoomed);
                }}
                className="bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm px-2.5 py-1.5 rounded-sm text-[11px] flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <ZoomIn className="w-3.5 h-3.5 text-rajvi-gold" />
                <span>{isZoomed ? 'Reset' : 'Zoom'}</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLightboxOpen(true);
                }}
                aria-label="Open Fullscreen Lightbox"
                className="bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm p-1.5 rounded-sm text-[11px] flex items-center justify-center transition-colors shadow-sm"
              >
                <Maximize2 className="w-3.5 h-3.5 text-rajvi-gold" />
              </button>
            </div>

            {/* Active Perspective Badge */}
            <div className="absolute bottom-4 right-4 bg-black/80 text-white px-2.5 py-1 rounded-sm text-[10px] uppercase tracking-wider font-semibold backdrop-blur-sm border border-white/20">
              {currentViewLabel} ({selectedIndex + 1}/{galleryImages.length})
            </div>

            {/* Lapidary Hallmark */}
            <div className="absolute bottom-4 left-4 bg-rajvi-black/85 text-rajvi-goldLight border border-rajvi-gold/30 px-3 py-1 rounded-sm text-[10px] tracking-wider uppercase font-semibold flex items-center gap-1.5 backdrop-blur-sm shadow-sm">
              <Sparkles className="w-3 h-3 text-rajvi-gold" />
              <span>Rajvi Surat Lapidary Master Cut</span>
            </div>
          </div>
        )}
      </div>

      {/* Thumbnails Strip */}
      {galleryImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {galleryImages.map((img, idx) => {
            const isSelected = activeMedia === 'image' && selectedIndex === idx;
            const label = getViewLabel(img, idx);

            return (
              <button
                key={img.id}
                onClick={() => {
                  setSelectedIndex(idx);
                  setActiveMedia('image');
                  setIsZoomed(false);
                }}
                className={`relative w-20 h-20 rounded-sm overflow-hidden border-2 shrink-0 transition-all ${
                  isSelected
                    ? 'border-rajvi-gold shadow-md scale-105'
                    : 'border-rajvi-borderLight hover:border-rajvi-gold/60 opacity-75 hover:opacity-100'
                }`}
              >
                <Image
                  src={img.image_url}
                  alt={img.alt_text || `Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover object-center"
                />
                <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[9px] text-white py-0.5 text-center font-medium truncate px-1">
                  {label.split(' ')[0]}
                </span>
              </button>
            );
          })}

          {/* Video Thumbnail (if present) */}
          {videoUrl && (
            <button
              onClick={() => setActiveMedia('video')}
              className={`relative w-20 h-20 rounded-sm overflow-hidden border-2 shrink-0 flex flex-col items-center justify-center bg-rajvi-black transition-all ${
                activeMedia === 'video'
                  ? 'border-rajvi-gold shadow-md scale-105 text-rajvi-gold'
                  : 'border-rajvi-borderLight hover:border-rajvi-gold/60 text-white/70 hover:text-white'
              }`}
            >
              <Play className="w-6 h-6 fill-current mb-1" />
              <span className="text-[9px] uppercase tracking-wider font-semibold">Video</span>
            </button>
          )}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-rajvi-gold p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Main Large Lightbox Image */}
          <div
            className="relative max-w-4xl max-h-[80vh] w-full h-[75vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={currentImage.image_url}
              alt={currentImage.alt_text || diamondName}
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Lightbox Caption & Controls */}
          <div
            className="mt-4 flex items-center justify-between w-full max-w-4xl text-white text-xs px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <span className="font-serif text-base text-rajvi-goldLight">{diamondName}</span>
              <span className="text-white/60 ml-2">({currentViewLabel})</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                className="px-3 py-1.5 rounded-sm bg-white/15 hover:bg-white/30 text-white transition-colors"
              >
                Previous
              </button>
              <span className="text-white/70">
                {selectedIndex + 1} of {galleryImages.length}
              </span>
              <button
                onClick={handleNext}
                className="px-3 py-1.5 rounded-sm bg-white/15 hover:bg-white/30 text-white transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
