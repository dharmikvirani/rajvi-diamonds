'use client';

import React, { useState, useMemo } from 'react';
import { Category, Diamond } from '@/lib/types';
import DiamondCard from './DiamondCard';
import DiamondFilterBar from './DiamondFilterBar';
import { Sparkles, PackageSearch } from 'lucide-react';

interface CollectionsViewProps {
  initialDiamonds: Diamond[];
  categories: Category[];
  initialCategoryFilter?: string;
}

export default function CollectionsView({
  initialDiamonds,
  categories,
  initialCategoryFilter = 'all',
}: CollectionsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryFilter);
  const [selectedShape, setSelectedShape] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [selectedClarity, setSelectedClarity] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  // Extract distinct shapes
  const availableShapes = useMemo(() => {
    const set = new Set<string>();
    initialDiamonds.forEach((d) => {
      if (d.shape) set.add(d.shape);
    });
    return Array.from(set).sort();
  }, [initialDiamonds]);

  // Extract distinct sizes
  const availableSizes = useMemo(() => {
    const set = new Set<number>();
    initialDiamonds.forEach((d) => {
      d.sizes.forEach((s) => {
        if (s.is_available) set.add(s.size_mm);
      });
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [initialDiamonds]);

  // Extract distinct colors
  const availableColors = useMemo(() => {
    const set = new Set<string>();
    initialDiamonds.forEach((d) => {
      if (d.color && d.color.trim()) set.add(d.color.trim());
    });
    return Array.from(set).sort();
  }, [initialDiamonds]);

  // Extract distinct clarities
  const availableClarities = useMemo(() => {
    const set = new Set<string>();
    initialDiamonds.forEach((d) => {
      if (d.clarity && d.clarity.trim()) set.add(d.clarity.trim());
    });
    return Array.from(set).sort();
  }, [initialDiamonds]);

  // Filter & sort logic
  const filteredDiamonds = useMemo(() => {
    let result = [...initialDiamonds];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.short_description.toLowerCase().includes(q) ||
          d.shape.toLowerCase().includes(q) ||
          (d.color && d.color.toLowerCase().includes(q)) ||
          (d.clarity && d.clarity.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((d) => {
        const cat = categories.find((c) => c.id === d.category_id);
        return cat?.slug === selectedCategory;
      });
    }

    // Shape filter
    if (selectedShape !== 'all') {
      result = result.filter((d) => d.shape === selectedShape);
    }

    // Size filter
    if (selectedSize !== 'all') {
      const targetSize = parseFloat(selectedSize);
      result = result.filter((d) =>
        d.sizes.some((s) => s.is_available && Math.abs(s.size_mm - targetSize) < 0.01)
      );
    }

    // Color filter
    if (selectedColor !== 'all') {
      result = result.filter((d) => d.color?.toLowerCase() === selectedColor.toLowerCase());
    }

    // Clarity filter
    if (selectedClarity !== 'all') {
      result = result.filter((d) => d.clarity?.toLowerCase() === selectedClarity.toLowerCase());
    }

    // Featured only
    if (featuredOnly) {
      result = result.filter((d) => d.is_featured);
    }

    // Sorting
    if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else {
      result.sort((a, b) => a.display_order - b.display_order);
    }

    return result;
  }, [
    initialDiamonds,
    searchQuery,
    selectedCategory,
    selectedShape,
    selectedSize,
    selectedColor,
    selectedClarity,
    featuredOnly,
    sortBy,
    categories,
  ]);

  const displayedDiamonds = filteredDiamonds.slice(0, visibleCount);
  const hasMore = visibleCount < filteredDiamonds.length;

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedShape('all');
    setSelectedSize('all');
    setSelectedColor('all');
    setSelectedClarity('all');
    setFeaturedOnly(false);
    setSortBy('default');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Comprehensive Filter Bar */}
      <DiamondFilterBar
        categories={categories}
        availableShapes={availableShapes}
        availableSizes={availableSizes}
        availableColors={availableColors}
        availableClarities={availableClarities}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedShape={selectedShape}
        onShapeChange={setSelectedShape}
        selectedSize={selectedSize}
        onSizeChange={setSelectedSize}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
        selectedClarity={selectedClarity}
        onClarityChange={setSelectedClarity}
        sortBy={sortBy}
        onSortChange={setSortBy}
        featuredOnly={featuredOnly}
        onFeaturedToggle={() => setFeaturedOnly(!featuredOnly)}
        onResetFilters={handleResetFilters}
        totalResults={filteredDiamonds.length}
      />

      {/* Results Diamond Grid */}
      {displayedDiamonds.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedDiamonds.map((diamond) => (
            <DiamondCard key={diamond.id} diamond={diamond} theme="light" />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white border border-rajvi-borderLight rounded-sm p-8 shadow-sm">
          <div className="w-12 h-12 mx-auto rounded-full bg-rajvi-offWhite flex items-center justify-center mb-4">
            <PackageSearch className="w-6 h-6 text-rajvi-gold" />
          </div>
          <h3 className="font-serif text-xl text-rajvi-textDark font-normal mb-2">
            No Fancy Cuts Match Your Specific Filter Criteria
          </h3>
          <p className="text-xs sm:text-sm text-rajvi-textMuted max-w-md mx-auto mb-6">
            We accommodate bespoke millimeter dimensions, antique rose domes, and custom diamond parcel inquiries directly via our master lapidary workshop.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2.5 bg-rajvi-gold hover:bg-rajvi-goldLight text-rajvi-black font-semibold text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-16 pt-8 border-t border-rajvi-borderLight">
          <button
            onClick={() => setVisibleCount((prev) => prev + 12)}
            className="px-8 py-3.5 bg-white border border-rajvi-gold hover:bg-rajvi-gold hover:text-white text-rajvi-gold font-semibold text-xs uppercase tracking-widest transition-all shadow-sm"
          >
            Load More Cuts ({filteredDiamonds.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
