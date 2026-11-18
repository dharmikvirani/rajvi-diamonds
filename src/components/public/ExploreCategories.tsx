import React from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { Category } from '@/lib/types';

interface ExploreCategoriesProps {
  categories: Category[];
  theme?: 'light' | 'dark';
}

export default function ExploreCategories({ categories, theme = 'dark' }: ExploreCategoriesProps) {
  if (!categories || categories.length === 0) return null;

  const isDark = theme === 'dark';

  return (
    <section
      className={`py-24 sm:py-28 border-t ${
        isDark
          ? 'bg-[#12110F] text-white border-[#2A2722]'
          : 'bg-rajvi-offWhite text-rajvi-textDark border-rajvi-borderLight'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-rajvi-gold font-semibold block mb-3">
            Catalogue Overview
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight">
            Explore Fancy Cut Families
          </h2>
          <p
            className={`mt-4 text-sm sm:text-base font-light ${
              isDark ? 'text-white/70' : 'text-rajvi-textMuted'
            }`}
          >
            Categorized by geometric discipline, historical inspiration, and optical character.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`/collections?category=${cat.slug}`}
              className={`group relative aspect-[4/5] rounded-sm overflow-hidden border transition-all duration-500 flex flex-col justify-end p-8 ${
                isDark
                  ? 'border-[#2A2722] hover:border-rajvi-gold/60 bg-[#171614] shadow-luxuryDark'
                  : 'border-rajvi-borderLight hover:border-rajvi-gold/60 bg-white shadow-sm hover:shadow-luxury'
              }`}
            >
              <Image
                src={cat.image_url || 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1200&q=80'}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              {/* Refined gradient overlay ensuring photo remains visible */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0A]/90 via-[#0D0C0A]/30 to-transparent" />

              <div className="relative z-10 space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-rajvi-goldLight font-semibold block">
                  Cut Collection
                </span>
                <h3 className="font-serif text-2xl text-white group-hover:text-rajvi-goldLight transition-colors font-normal flex items-center justify-between">
                  <span>{cat.name}</span>
                  <ArrowUpRight className="w-5 h-5 text-rajvi-goldLight opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-white/80 line-clamp-2 leading-relaxed font-light">
                  {cat.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
