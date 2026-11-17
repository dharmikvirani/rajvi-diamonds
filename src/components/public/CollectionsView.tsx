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
  const [selectedAvailability, setSelectedAvailability] = useState('all');
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

  // Extract distinct colors (supporting multiple colors per diamond)
  const availableColors = useMemo(() => {
    const set = new Set<string>();
    initialDiamonds.forEach((d) => {
      if (Array.isArray(d.available_colors)) {
        d.available_colors.forEach((c) => c && set.add(c.trim()));
      }
      if (d.color && d.color.trim()) {
        d.color.split(',').forEach((c) => c && set.add(c.trim()));
      }
    });
    return Array.from(set).sort();
  }, [initialDiamonds]);

  // Extract distinct clarities (supporting multiple clarities per diamond)
  const availableClarities = useMemo(() => {
    const set = new Set<string>();
    initialDiamonds.forEach((d) => {
      if (Array.isArray(d.available_clarities)) {
        d.available_clarities.forEach((c) => c && set.add(c.trim()));
      }
      if (d.clarity && d.clarity.trim()) {
        d.clarity.split(',').forEach((c) => c && set.add(c.trim()));
      }
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
          (d.clarity && d.clarity.toLowerCase().includes(q)) ||
          (d.available_colors && d.available_colors.some((c) => c.toLowerCase().includes(q))) ||
          (d.available_clarities && d.available_clarities.some((c) => c.toLowerCase().includes(q)))
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

    // Color filter (supports multi-color grades)
    if (selectedColor !== 'all') {
      const qColor = selectedColor.toLowerCase();
      result = result.filter(
        (d) =>
          d.color?.toLowerCase() === qColor ||
          (d.available_colors && d.available_colors.some((c) => c.toLowerCase() === qColor))
      );
    }

    // Clarity filter (supports multi-clarity grades)
    if (selectedClarity !== 'all') {
      const qClarity = selectedClarity.toLowerCase();
      result = result.filter(
        (d) =>
          d.clarity?.toLowerCase() === qClarity ||
          (d.available_clarities && d.available_clarities.some((c) => c.toLowerCase() === qClarity))
      );
    }

    // Availability status filter
    if (selectedAvailability !== 'all') {
      const qAvail = selectedAvailability.toLowerCase();
      result = result.filter(
        (d) => d.availability_status?.toLowerCase() === qAvail
      );
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
    selectedAvailability,
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
    setSelectedAvailability('all');
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
        selectedAvailability={selectedAvailability}
        onAvailabilityChange={setSelectedAvailability}
        sortBy={sortBy}
        onSortChange={setSortBy}
        featuredOnly={featuredOnly}
        onFeaturedToggle={() => setFeaturedOnly(!featuredOnly)}
        onResetFilters={handleResetFilters}
        totalResults={filteredDiamonds.length}
      />

      {/* Diamonds Grid */}
      {displayedDiamonds.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedDiamonds.map((diamond) => (
            <DiamondCard key={diamond.id} diamond={diamond} theme="light" />
          ))}
        </div>
      ) : (
        /* Empty Results State */
        <div className="text-center py-20 bg-white border border-rajvi-borderLight/80 rounded-sm p-8 shadow-sm">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-rajvi-offWhite border border-rajvi-gold/30 flex items-center justify-center text-rajvi-gold">
            <PackageSearch className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-rajvi-textDark font-normal mb-2">
            No Fancy Cuts Match Your Filter Criteria
          </h3>
          <p className="text-xs sm:text-sm text-rajvi-textMuted max-w-md mx-auto mb-6">
            We specialize in bespoke parcel manufacturing in Surat. If your required shape, millimeter or purity is not listed, our lapidary specialists can craft it to exact specification.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleResetFilters}
              className="px-6 py-3 bg-rajvi-gold hover:bg-rajvi-goldLight text-rajvi-black font-semibold text-xs uppercase tracking-widest transition-colors shadow-sm"
            >
              Reset All Filters
            </button>
            <a
              href="/contact"
              className="px-6 py-3 bg-white border border-rajvi-borderLight hover:border-rajvi-gold text-rajvi-textDark hover:text-rajvi-gold font-semibold text-xs uppercase tracking-widest transition-colors shadow-sm"
            >
              Inquire Custom Cutting
            </a>
          </div>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-12">
          <button
            onClick={() => setVisibleCount((prev) => prev + 12)}
            className="px-8 py-3.5 bg-white border border-rajvi-borderLight hover:border-rajvi-gold text-rajvi-textDark hover:text-rajvi-gold text-xs uppercase tracking-widest font-semibold transition-colors shadow-sm"
          >
            Load More Cuts ({filteredDiamonds.length - visibleCount} Remaining)
          </button>
        </div>
      )}
    </div>
  );
}
