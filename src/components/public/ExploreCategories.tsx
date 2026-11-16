import React from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { Category } from '@/lib/types';

interface ExploreCategoriesProps {
  categories: Category[];
}

export default function ExploreCategories({ categories }: ExploreCategoriesProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="bg-rajvi-black py-24 border-t border-rajvi-borderDark/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-rajvi-gold font-semibold block mb-3">
            Catalogue Overview
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-rajvi-offWhite font-normal tracking-tight">
            Explore Fancy Cut Families
          </h2>
          <p className="mt-4 text-rajvi-offWhite/70 text-sm sm:text-base">
            Categorized by geometric discipline, historical inspiration, and optical character.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`/collections?category=${cat.slug}`}
              className="group relative aspect-[4/5] rounded-sm overflow-hidden border border-rajvi-borderDark hover:border-rajvi-gold/60 transition-all duration-500 shadow-luxuryDark flex flex-col justify-end p-8"
            >
              <Image
                src={cat.image_url || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80'}
                alt={cat.name}
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-rajvi-black via-rajvi-black/60 to-transparent" />

              <div className="relative z-10 space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-rajvi-gold font-semibold block">
                  Cut Collection
                </span>
                <h3 className="font-serif text-2xl text-rajvi-offWhite group-hover:text-rajvi-goldLight transition-colors font-normal flex items-center justify-between">
                  <span>{cat.name}</span>
                  <ArrowUpRight className="w-5 h-5 text-rajvi-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-rajvi-offWhite/70 line-clamp-2 leading-relaxed">
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
