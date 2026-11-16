'use client';

import React from 'react';
import { Search, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { Category } from '@/lib/types';

interface DiamondFilterBarProps {
  categories: Category[];
  availableShapes: string[];
  availableSizes: number[];
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (val: string) => void;
  selectedShape: string;
  onShapeChange: (val: string) => void;
  selectedSize: string;
  onSizeChange: (val: string) => void;
  sortBy: string;
  onSortChange: (val: string) => void;
  featuredOnly: boolean;
  onFeaturedToggle: () => void;
  onResetFilters: () => void;
  totalResults: number;
}

export default function DiamondFilterBar({
  categories,
  availableShapes,
  availableSizes,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedShape,
  onShapeChange,
  selectedSize,
  onSizeChange,
  sortBy,
  onSortChange,
  featuredOnly,
  onFeaturedToggle,
  onResetFilters,
  totalResults,
}: DiamondFilterBarProps) {
  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedCategory !== 'all' ||
    selectedShape !== 'all' ||
    selectedSize !== 'all' ||
    featuredOnly ||
    sortBy !== 'default';

  return (
    <div className="bg-white border border-rajvi-borderLight/80 rounded-sm p-6 mb-10 shadow-sm">
      {/* Top Search & Reset Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 border-b border-rajvi-lightGrey">
        {/* Search Input */}
        <div className="relative flex-grow max-w-md">
          <Search className="w-4 h-4 text-rajvi-textMuted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search fancy cuts by name or geometry..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-rajvi-offWhite border border-rajvi-borderLight rounded-sm text-rajvi-textDark placeholder:text-rajvi-textMuted focus:outline-none focus:border-rajvi-gold focus:ring-1 focus:ring-rajvi-gold transition-colors"
          />
        </div>

        {/* Total count & reset button */}
        <div className="flex items-center justify-between md:justify-end gap-4 text-xs">
          <span className="text-rajvi-textMuted font-medium">
            Showing <strong className="text-rajvi-textDark">{totalResults}</strong> cuts
          </span>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 text-rajvi-gold hover:text-rajvi-goldMuted font-semibold uppercase tracking-wider text-[11px] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Selectors Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-6">
        {/* Category Filter */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-rajvi-textMuted font-semibold mb-1.5">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full text-xs py-2 px-3 bg-rajvi-offWhite border border-rajvi-borderLight rounded-sm text-rajvi-textDark focus:outline-none focus:border-rajvi-gold"
          >
            <option value="all">All Cut Families</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Shape Filter */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-rajvi-textMuted font-semibold mb-1.5">
            Shape / Geometry
          </label>
          <select
            value={selectedShape}
            onChange={(e) => onShapeChange(e.target.value)}
            className="w-full text-xs py-2 px-3 bg-rajvi-offWhite border border-rajvi-borderLight rounded-sm text-rajvi-textDark focus:outline-none focus:border-rajvi-gold"
          >
            <option value="all">All Shapes</option>
            {availableShapes.map((shape) => (
              <option key={shape} value={shape}>
                {shape}
              </option>
            ))}
          </select>
        </div>

        {/* Available Size Filter */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-rajvi-textMuted font-semibold mb-1.5">
            Available Size
          </label>
          <select
            value={selectedSize}
            onChange={(e) => onSizeChange(e.target.value)}
            className="w-full text-xs py-2 px-3 bg-rajvi-offWhite border border-rajvi-borderLight rounded-sm text-rajvi-textDark focus:outline-none focus:border-rajvi-gold"
          >
            <option value="all">All Sizes</option>
            {availableSizes.map((size) => (
              <option key={size} value={size.toString()}>
                {Number.isInteger(size) ? size.toFixed(0) : size.toFixed(1)} mm
              </option>
            ))}
          </select>
        </div>

        {/* Sorting Dropdown */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-rajvi-textMuted font-semibold mb-1.5">
            Sort Order
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full text-xs py-2 px-3 bg-rajvi-offWhite border border-rajvi-borderLight rounded-sm text-rajvi-textDark focus:outline-none focus:border-rajvi-gold"
          >
            <option value="default">Curated Order</option>
            <option value="name-asc">Alphabetical (A – Z)</option>
            <option value="name-desc">Alphabetical (Z – A)</option>
          </select>
        </div>
      </div>

      {/* Featured Only Toggle Pill */}
      <div className="mt-4 pt-4 border-t border-rajvi-lightGrey flex items-center justify-between">
        <label className="inline-flex items-center gap-2 cursor-pointer select-none text-xs text-rajvi-textDark">
          <input
            type="checkbox"
            checked={featuredOnly}
            onChange={onFeaturedToggle}
            className="rounded border-rajvi-borderLight text-rajvi-gold focus:ring-rajvi-gold h-4 w-4"
          />
          <span className="font-medium">Show Featured Cuts Only</span>
        </label>

        <span className="text-[11px] text-rajvi-textMuted hidden sm:inline-block">
          All cuts strictly manufactured for discovery & inquiry. No retail checkout.
        </span>
      </div>
    </div>
  );
}
