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
          d.shape.toLowerCase().includes(q)
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
    setSortBy('default');
    setFeaturedOnly(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Filter and search bar */}
      <DiamondFilterBar
        categories={categories}
        availableShapes={availableShapes}
        availableSizes={availableSizes}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedShape={selectedShape}
        onShapeChange={setSelectedShape}
        selectedSize={selectedSize}
        onSizeChange={setSelectedSize}
        sortBy={sortBy}
        onSortChange={setSortBy}
        featuredOnly={featuredOnly}
        onFeaturedToggle={() => setFeaturedOnly(!featuredOnly)}
        onResetFilters={handleResetFilters}
        totalResults={filteredDiamonds.length}
      />

      {/* Results Grid */}
      {displayedDiamonds.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedDiamonds.map((diamond) => (
            <DiamondCard key={diamond.id} diamond={diamond} theme="light" />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-rajvi-borderLight rounded-sm p-16 text-center max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-rajvi-offWhite border border-rajvi-borderLight flex items-center justify-center mx-auto mb-4 text-rajvi-textMuted">
            <PackageSearch className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl text-rajvi-textDark font-normal mb-2">
            No Matching Diamond Cuts
          </h3>
          <p className="text-xs sm:text-sm text-rajvi-textMuted leading-relaxed mb-6">
            We could not find diamond cuts matching your current filter criteria. Try resetting the filters or searching for specific geometries like Rose Octagone or Tulip.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2.5 bg-rajvi-gold text-rajvi-black font-semibold text-xs uppercase tracking-widest hover:bg-rajvi-goldLight transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-12">
          <button
            onClick={() => setVisibleCount((prev) => prev + 12)}
            className="px-8 py-3.5 bg-white border border-rajvi-borderLight hover:border-rajvi-gold text-rajvi-textDark hover:text-rajvi-gold text-xs uppercase tracking-widest font-semibold transition-all shadow-sm"
          >
            Load More Cuts ({filteredDiamonds.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
