'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Category, Diamond, DiamondColorOption, DiamondClarityOption, DiamondImage, DiamondSize } from '@/lib/types';
import { initialDiamondColors, initialDiamondClarities } from '@/lib/seedData';
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  Star,
  CheckCircle,
  Loader2,
  Sparkles,
  X,
} from 'lucide-react';
import { formatSizeMm } from '@/lib/utils';

interface DiamondEditorFormProps {
  initialDiamond?: Diamond | null;
  categories: Category[];
  availableColors?: DiamondColorOption[];
  availableClarities?: DiamondClarityOption[];
}

export default function DiamondEditorForm({
  initialDiamond,
  categories,
  availableColors,
  availableClarities,
}: DiamondEditorFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialDiamond?.id);

  const [formData, setFormData] = useState({
    id: initialDiamond?.id || '',
    name: initialDiamond?.name || '',
    slug: initialDiamond?.slug || '',
    category_id: initialDiamond?.category_id || (categories[0]?.id || ''),
    shape: initialDiamond?.shape || '',
    color: initialDiamond?.color || '',
    clarity: initialDiamond?.clarity || '',
    short_description: initialDiamond?.short_description || '',
    description: initialDiamond?.description || '',
    is_featured: initialDiamond?.is_featured ?? false,
    is_active: initialDiamond?.is_active ?? true,
    display_order: initialDiamond?.display_order ?? 1,
    seo_title: initialDiamond?.seo_title || '',
    seo_description: initialDiamond?.seo_description || '',
  });

  // Multi-variant states
  const [selectedColors, setSelectedColors] = useState<string[]>(
    initialDiamond?.available_colors && initialDiamond.available_colors.length > 0
      ? initialDiamond.available_colors
      : initialDiamond?.color
      ? [initialDiamond.color]
      : []
  );

  const [selectedClarities, setSelectedClarities] = useState<string[]>(
    initialDiamond?.available_clarities && initialDiamond.available_clarities.length > 0
      ? initialDiamond.available_clarities
      : initialDiamond?.clarity
      ? [initialDiamond.clarity]
      : []
  );

  const [availabilityStatus, setAvailabilityStatus] = useState<
    'Available' | 'Made to Order' | 'Available on Inquiry'
  >(initialDiamond?.availability_status || 'Available');

  const [videoUrl, setVideoUrl] = useState<string>(initialDiamond?.video_url || '');

  const [colorsList, setColorsList] = useState<DiamondColorOption[]>(
    availableColors && availableColors.length > 0 ? availableColors : initialDiamondColors
  );
  const [claritiesList, setClaritiesList] = useState<DiamondClarityOption[]>(
    availableClarities && availableClarities.length > 0 ? availableClarities : initialDiamondClarities
  );

  const [showAddColorModal, setShowAddColorModal] = useState(false);
  const [newColorName, setNewColorName] = useState('');
  const [newColorCategory, setNewColorCategory] = useState<'standard' | 'fancy'>('standard');
  const [savingColor, setSavingColor] = useState(false);

  const [showAddClarityModal, setShowAddClarityModal] = useState(false);
  const [newClarityName, setNewClarityName] = useState('');
  const [newClarityLabel, setNewClarityLabel] = useState('');
  const [savingClarity, setSavingClarity] = useState(false);

  const [specs, setSpecs] = useState({
    cut_grade: initialDiamond?.specifications?.cut_grade || 'Excellent',
    symmetry: initialDiamond?.specifications?.symmetry || 'Excellent',
    polish: initialDiamond?.specifications?.polish || 'Excellent',
    fluorescence: initialDiamond?.specifications?.fluorescence || 'None',
    table_percentage: initialDiamond?.specifications?.table_percentage || '',
    depth_percentage: initialDiamond?.specifications?.depth_percentage || '',
    facet_count: initialDiamond?.specifications?.facet_count?.toString() || '',
    culet: initialDiamond?.specifications?.culet || '',
    girdle: initialDiamond?.specifications?.girdle || '',
    crafting_origin: initialDiamond?.specifications?.crafting_origin || 'Rajvi Master Lapidary Studio',
  });

  // Images state
  const [images, setImages] = useState<DiamondImage[]>(initialDiamond?.images || []);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Sizes state
  const [sizes, setSizes] = useState<DiamondSize[]>(initialDiamond?.sizes || []);
  const [newSizeMm, setNewSizeMm] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto generate slug from name
  const handleNameChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: isEditing ? prev.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    }));
  };

  // Add Image via URL
  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    const newImg: DiamondImage = {
      id: `img-${Date.now()}`,
      diamond_id: formData.id || 'temp',
      image_url: newImageUrl.trim(),
      alt_text: newImageAlt.trim() || formData.name,
      is_primary: images.length === 0,
      display_order: images.length + 1,
      created_at: new Date().toISOString(),
    };
    setImages((prev) => [...prev, newImg]);
    setNewImageUrl('');
    setNewImageAlt('');
  };

  // Upload image file
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      const resJson = await res.json();
      if (!res.ok || !resJson.success) {
        throw new Error(resJson.error || 'Failed to upload image');
      }

      const newImg: DiamondImage = {
        id: `img-${Date.now()}`,
        diamond_id: formData.id || 'temp',
        image_url: resJson.imageUrl,
        cloudinary_public_id: resJson.publicId,
        alt_text: formData.name,
        is_primary: images.length === 0,
        display_order: images.length + 1,
        created_at: new Date().toISOString(),
      };
      setImages((prev) => [...prev, newImg]);
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  // Set Primary Image
  const handleSetPrimary = (index: number) => {
    setImages((prev) =>
      prev.map((img, idx) => ({
        ...img,
        is_primary: idx === index,
      }))
    );
  };

  // Delete Image
  const handleDeleteImage = (index: number) => {
    setImages((prev) => {
      const filtered = prev.filter((_, idx) => idx !== index);
      if (filtered.length > 0 && !filtered.some((i) => i.is_primary)) {
        filtered[0].is_primary = true;
      }
      return filtered;
    });
  };

  // Add Size
  const handleAddSize = () => {
    const val = parseFloat(newSizeMm);
    if (isNaN(val) || val <= 0) {
      alert('Please enter a valid positive millimeter number (e.g. 4.5)');
      return;
    }

    if (sizes.some((s) => Math.abs(s.size_mm - val) < 0.001)) {
      alert(`Size ${val} mm already exists.`);
      return;
    }

    const newSize: DiamondSize = {
      id: `size-${Date.now()}`,
      diamond_id: formData.id || 'temp',
      size_mm: val,
      is_available: true,
      display_order: sizes.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setSizes((prev) => [...prev, newSize].sort((a, b) => a.size_mm - b.size_mm));
    setNewSizeMm('');
  };

  // Toggle size availability
  const handleToggleSizeAvailable = (sizeId: string) => {
    setSizes((prev) =>
      prev.map((s) => (s.id === sizeId ? { ...s, is_available: !s.is_available } : s))
    );
  };

  // Delete size
  const handleDeleteSize = (sizeId: string) => {
    setSizes((prev) => prev.filter((s) => s.id !== sizeId));
  };

  // Add custom color on the fly
  const handleSaveNewColor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColorName.trim()) return;
    setSavingColor(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_diamond_color',
          payload: {
            name: newColorName.trim(),
            category: newColorCategory,
            display_order: colorsList.length + 1,
            is_active: true,
          },
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setColorsList((prev) => [...prev, data.data]);
        setFormData((prev) => ({ ...prev, color: data.data.name }));
        setNewColorName('');
        setShowAddColorModal(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingColor(false);
    }
  };

  // Add custom clarity on the fly
  const handleSaveNewClarity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClarityName.trim()) return;
    setSavingClarity(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_diamond_clarity',
          payload: {
            name: newClarityName.trim(),
            label: newClarityLabel.trim() || newClarityName.trim(),
            display_order: claritiesList.length + 1,
            is_active: true,
          },
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setClaritiesList((prev) => [...prev, data.data]);
        setFormData((prev) => ({ ...prev, clarity: data.data.name }));
        setNewClarityName('');
        setNewClarityLabel('');
        setShowAddClarityModal(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingClarity(false);
    }
  };

  // Multi-variant handlers
  const handleToggleColor = (col: string) => {
    setSelectedColors((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  const handleToggleClarity = (clr: string) => {
    setSelectedClarities((prev) =>
      prev.includes(clr) ? prev.filter((c) => c !== clr) : [...prev, clr]
    );
  };

  const handleSetImageViewTag = (idx: number, view_tag: string) => {
    setImages((prev) =>
      prev.map((img, i) => (i === idx ? { ...img, view_tag } : img))
    );
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name.trim()) {
      setErrorMessage('Diamond Name is required.');
      return;
    }

    if (!formData.slug.trim()) {
      setErrorMessage('Slug is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: Partial<Diamond> = {
        ...formData,
        color: selectedColors[0] || (formData.color ? formData.color.trim() : null),
        clarity: selectedClarities[0] || (formData.clarity ? formData.clarity.trim() : null),
        available_colors: selectedColors,
        available_clarities: selectedClarities,
        availability_status: availabilityStatus,
        video_url: videoUrl.trim() || null,
        specifications: {
          ...specs,
          available_colors: selectedColors,
          available_clarities: selectedClarities,
          availability_status: availabilityStatus,
          video_url: videoUrl.trim() || null,
          facet_count: specs.facet_count ? parseInt(specs.facet_count) : undefined,
        },
        images,
        sizes,
      };

      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_diamond',
          payload,
        }),
      });

      const resJson = await res.json();
      if (!res.ok || !resJson.success) {
        throw new Error(resJson.error || 'Failed to save diamond');
      }

      router.push('/admin/diamonds');
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error saving diamond');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      <div className="flex items-center justify-between pb-4 border-b border-rajvi-borderDark/60">
        <div className="flex items-center gap-3">
          <a
            href="/admin/diamonds"
            className="p-2 rounded-sm bg-rajvi-charcoal hover:bg-rajvi-borderDark text-rajvi-offWhite transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </a>
          <div>
            <h2 className="font-serif text-xl sm:text-2xl text-rajvi-offWhite font-normal">
              {isEditing ? `Edit Diamond Cut: ${formData.name}` : 'Create New Diamond Cut'}
            </h2>
            <p className="text-xs text-rajvi-muted">
              Configure cut identity, specifications, multi-image gallery, and calibrated sizes.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-rajvi-gold hover:bg-rajvi-goldLight text-rajvi-black font-semibold text-xs uppercase tracking-wider rounded-sm transition-colors shadow-goldGlow disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Cut...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Diamond Cut</span>
            </>
          )}
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-950/40 border border-red-800 text-red-300 rounded-sm text-xs">
          {errorMessage}
        </div>
      )}

      {/* Grid: Main Info & Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Main Data */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section: Basic Identity */}
          <div className="bg-[#181714] border border-rajvi-borderDark/80 p-6 rounded-sm space-y-4">
            <h3 className="font-serif text-base text-rajvi-offWhite font-normal border-b border-rajvi-borderDark/60 pb-2">
              Cut Identification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-rajvi-offWhite/80 font-semibold mb-1">
                  Diamond Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rose Octagone"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-rajvi-offWhite/80 font-semibold mb-1">
                  URL Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. rose-octagone"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-rajvi-offWhite/80 font-semibold mb-1">
                  Category
                </label>
                <select
                  value={formData.category_id || ''}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold"
                >
                  <option value="">No Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-rajvi-offWhite/80 font-semibold mb-1">
                  Shape / Facet Profile <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Octagon Rose Cut"
                  value={formData.shape}
                  onChange={(e) => setFormData({ ...formData, shape: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold"
                />
              </div>

              {/* Availability Status */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-rajvi-offWhite/80 font-semibold mb-1">
                  Availability Status
                </label>
                <select
                  value={availabilityStatus}
                  onChange={(e) =>
                    setAvailabilityStatus(e.target.value as any)
                  }
                  className="w-full px-3 py-2 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold font-medium"
                >
                  <option value="Available">Available (In Stock Parcel)</option>
                  <option value="Made to Order">Made to Order (Bespoke Cut)</option>
                  <option value="Available on Inquiry">Available on Inquiry</option>
                </select>
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-rajvi-offWhite/80 font-semibold mb-1">
                  Diamond 360° Spin Video URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="e.g. Cloudinary video or YouTube/Vimeo link"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold"
                />
              </div>
            </div>

            {/* Multiple Available Colors & Presets */}
            <div className="pt-3 border-t border-rajvi-borderDark/40 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="block text-[11px] uppercase tracking-wider text-rajvi-offWhite/80 font-semibold">
                  Supported Color Grades ({selectedColors.length} Selected)
                </label>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span className="text-rajvi-muted">Presets:</span>
                  <button
                    type="button"
                    onClick={() => setSelectedColors(['D', 'E', 'F'])}
                    className="px-1.5 py-0.5 bg-[#1F1E1A] hover:bg-rajvi-gold hover:text-black text-rajvi-gold border border-rajvi-borderDark rounded-sm transition-colors"
                  >
                    D – F
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedColors(['D', 'E', 'F', 'G', 'H'])}
                    className="px-1.5 py-0.5 bg-[#1F1E1A] hover:bg-rajvi-gold hover:text-black text-rajvi-gold border border-rajvi-borderDark rounded-sm transition-colors"
                  >
                    D – H
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedColors([])}
                    className="px-1.5 py-0.5 bg-[#1F1E1A] hover:bg-red-500 hover:text-white text-rajvi-muted border border-rajvi-borderDark rounded-sm transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddColorModal(true)}
                    className="text-rajvi-gold hover:text-rajvi-goldLight ml-1 inline-flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add New</span>
                  </button>
                </div>
              </div>

              {/* Color Chips */}
              <div className="flex flex-wrap gap-1.5 p-2 bg-[#141311] border border-rajvi-borderDark/60 rounded-sm">
                {colorsList.map((c) => {
                  const isChecked = selectedColors.includes(c.name);
                  return (
                    <button
                      key={c.id || c.name}
                      type="button"
                      onClick={() => handleToggleColor(c.name)}
                      className={`px-2.5 py-1 text-xs rounded-sm transition-all border font-medium ${
                        isChecked
                          ? 'bg-rajvi-gold text-black border-rajvi-gold font-semibold shadow-sm scale-105'
                          : 'bg-[#1F1E1A] text-rajvi-offWhite/80 border-rajvi-borderDark hover:border-rajvi-gold/50'
                      }`}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Multiple Available Clarities & Presets */}
            <div className="pt-3 border-t border-rajvi-borderDark/40 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="block text-[11px] uppercase tracking-wider text-rajvi-offWhite/80 font-semibold">
                  Supported Clarity / Purity Grades ({selectedClarities.length} Selected)
                </label>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span className="text-rajvi-muted">Presets:</span>
                  <button
                    type="button"
                    onClick={() => setSelectedClarities(['FL', 'IF', 'VVS1', 'VVS2'])}
                    className="px-1.5 py-0.5 bg-[#1F1E1A] hover:bg-rajvi-gold hover:text-black text-rajvi-gold border border-rajvi-borderDark rounded-sm transition-colors"
                  >
                    FL – VVS2
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedClarities(['VVS1', 'VVS2', 'VS1', 'VS2'])}
                    className="px-1.5 py-0.5 bg-[#1F1E1A] hover:bg-rajvi-gold hover:text-black text-rajvi-gold border border-rajvi-borderDark rounded-sm transition-colors"
                  >
                    VVS – VS
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedClarities([])}
                    className="px-1.5 py-0.5 bg-[#1F1E1A] hover:bg-red-500 hover:text-white text-rajvi-muted border border-rajvi-borderDark rounded-sm transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddClarityModal(true)}
                    className="text-rajvi-gold hover:text-rajvi-goldLight ml-1 inline-flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add New</span>
                  </button>
                </div>
              </div>

              {/* Clarity Chips */}
              <div className="flex flex-wrap gap-1.5 p-2 bg-[#141311] border border-rajvi-borderDark/60 rounded-sm">
                {claritiesList.map((c) => {
                  const isChecked = selectedClarities.includes(c.name);
                  return (
                    <button
                      key={c.id || c.name}
                      type="button"
                      onClick={() => handleToggleClarity(c.name)}
                      className={`px-2.5 py-1 text-xs rounded-sm transition-all border font-medium ${
                        isChecked
                          ? 'bg-rajvi-gold text-black border-rajvi-gold font-semibold shadow-sm scale-105'
                          : 'bg-[#1F1E1A] text-rajvi-offWhite/80 border-rajvi-borderDark hover:border-rajvi-gold/50'
                      }`}
                      title={c.label}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-rajvi-offWhite/80 font-semibold mb-1">
                Short Description (Cards & Previews)
              </label>
              <textarea
                rows={2}
                placeholder="A concise summary highlighting the cut's distinctive geometry and optical dispersion..."
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                className="w-full px-3 py-2 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-rajvi-offWhite/80 font-semibold mb-1">
                Detailed Cut Narrative & Craftsmanship Story
              </label>
              <textarea
                rows={5}
                placeholder="Full editorial description explaining facet orientation, light return, and setting suitability..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold"
              />
            </div>
          </div>

          {/* Section: Image Gallery Management */}
          <div className="bg-[#181714] border border-rajvi-borderDark/80 p-6 rounded-sm space-y-4">
            <h3 className="font-serif text-base text-rajvi-offWhite font-normal border-b border-rajvi-borderDark/60 pb-2">
              Diamond Photography & Gallery
            </h3>

            {/* Existing Images Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <div
                    key={img.id || idx}
                    className={`relative rounded-sm overflow-hidden border p-1 group bg-[#1F1E1A] ${
                      img.is_primary ? 'border-rajvi-gold shadow-sm' : 'border-rajvi-borderDark'
                    }`}
                  >
                    <div className="relative aspect-square w-full">
                      <Image
                        src={img.image_url}
                        alt={img.alt_text || 'Diamond View'}
                        fill
                        className="object-cover rounded-sm"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[10px]">
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(idx)}
                        className={`flex items-center gap-1 font-semibold ${
                          img.is_primary ? 'text-rajvi-gold' : 'text-rajvi-muted hover:text-white'
                        }`}
                      >
                        <Star className={`w-3 h-3 ${img.is_primary ? 'fill-current' : ''}`} />
                        <span>{img.is_primary ? 'Primary' : 'Set Primary'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteImage(idx)}
                        className="text-red-400 hover:text-red-300"
                        title="Delete Image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* View Perspective Selector */}
                    <div className="mt-1.5 pt-1.5 border-t border-rajvi-borderDark/60">
                      <select
                        value={img.view_tag || (idx === 0 ? 'front' : idx === 1 ? 'side' : idx === 2 ? 'close_up' : 'general')}
                        onChange={(e) => handleSetImageViewTag(idx, e.target.value)}
                        className="w-full text-[10px] py-1 px-1.5 bg-[#151411] border border-rajvi-borderDark rounded-sm text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold"
                      >
                        <option value="front">Front Face</option>
                        <option value="side">Side Profile</option>
                        <option value="close_up">Close-Up Facets</option>
                        <option value="table">Table & Crown</option>
                        <option value="hand">Hand Scale</option>
                        <option value="general">General View</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Image Inputs */}
            <div className="pt-4 border-t border-rajvi-borderDark/40 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-6">
                <label className="block text-[10px] uppercase tracking-wider text-rajvi-muted mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://... or Cloudinary link"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-[10px] uppercase tracking-wider text-rajvi-muted mb-1">
                  Alt Text
                </label>
                <input
                  type="text"
                  placeholder="Image description"
                  value={newImageAlt}
                  onChange={(e) => setNewImageAlt(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="w-full py-2 bg-rajvi-charcoal hover:bg-rajvi-borderDark text-rajvi-gold text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors"
                >
                  Add URL
                </button>
              </div>
            </div>

            {/* Direct File Upload to Cloudinary / Server */}
            <div className="pt-2 flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-[#1F1E1A] border border-rajvi-borderDark hover:border-rajvi-gold rounded-sm text-xs text-rajvi-offWhite font-medium transition-colors">
                <Upload className="w-3.5 h-3.5 text-rajvi-gold" />
                <span>{uploadingImage ? 'Uploading Image...' : 'Upload Image File'}</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingImage}
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <span className="text-[10px] text-rajvi-muted">
                Accepts JPG, PNG, WebP
              </span>
            </div>
          </div>

          {/* Section: Lapidary Specifications */}
          <div className="bg-[#181714] border border-rajvi-borderDark/80 p-6 rounded-sm space-y-4">
            <h3 className="font-serif text-base text-rajvi-offWhite font-normal border-b border-rajvi-borderDark/60 pb-2">
              Lapidary Specifications (JSONB)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-rajvi-muted mb-1">
                  Cut Grade
                </label>
                <input
                  type="text"
                  value={specs.cut_grade}
                  onChange={(e) => setSpecs({ ...specs, cut_grade: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-rajvi-muted mb-1">
                  Symmetry
                </label>
                <input
                  type="text"
                  value={specs.symmetry}
                  onChange={(e) => setSpecs({ ...specs, symmetry: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-rajvi-muted mb-1">
                  Polish
                </label>
                <input
                  type="text"
                  value={specs.polish}
                  onChange={(e) => setSpecs({ ...specs, polish: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-rajvi-muted mb-1">
                  Fluorescence
                </label>
                <input
                  type="text"
                  value={specs.fluorescence}
                  onChange={(e) => setSpecs({ ...specs, fluorescence: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-rajvi-muted mb-1">
                  Table / Crown Style
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dome Rose Cut"
                  value={specs.table_percentage}
                  onChange={(e) => setSpecs({ ...specs, table_percentage: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-rajvi-muted mb-1">
                  Depth Percentage
                </label>
                <input
                  type="text"
                  placeholder="e.g. 35% - 42%"
                  value={specs.depth_percentage}
                  onChange={(e) => setSpecs({ ...specs, depth_percentage: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-rajvi-muted mb-1">
                  Facet Count
                </label>
                <input
                  type="number"
                  placeholder="e.g. 24"
                  value={specs.facet_count}
                  onChange={(e) => setSpecs({ ...specs, facet_count: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-rajvi-muted mb-1">
                  Culet
                </label>
                <input
                  type="text"
                  placeholder="e.g. Flat Base"
                  value={specs.culet}
                  onChange={(e) => setSpecs({ ...specs, culet: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-rajvi-muted mb-1">
                  Girdle
                </label>
                <input
                  type="text"
                  placeholder="e.g. Faceted, Medium"
                  value={specs.girdle}
                  onChange={(e) => setSpecs({ ...specs, girdle: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Sizes, Status, SEO */}
        <div className="space-y-8">
          {/* Section: Status & Display */}
          <div className="bg-[#181714] border border-rajvi-borderDark/80 p-6 rounded-sm space-y-4">
            <h3 className="font-serif text-base text-rajvi-offWhite font-normal border-b border-rajvi-borderDark/60 pb-2">
              Visibility & Publishing
            </h3>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded border-rajvi-borderDark text-rajvi-gold focus:ring-rajvi-gold h-4 w-4"
                />
                <span className="text-xs font-medium text-rajvi-offWhite">
                  Active in Catalogue
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="rounded border-rajvi-borderDark text-rajvi-gold focus:ring-rajvi-gold h-4 w-4"
                />
                <span className="text-xs font-medium text-rajvi-goldLight flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rajvi-gold" />
                  <span>Featured Cut (Homepage)</span>
                </span>
              </label>
            </div>

            <div className="pt-2">
              <label className="block text-[10px] uppercase tracking-wider text-rajvi-muted mb-1">
                Display Order Sort
              </label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-1.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite"
              />
            </div>
          </div>

          {/* Section: Calibrated Sizes */}
          <div className="bg-[#181714] border border-rajvi-borderDark/80 p-6 rounded-sm space-y-4">
            <h3 className="font-serif text-base text-rajvi-offWhite font-normal border-b border-rajvi-borderDark/60 pb-2">
              Calibrated Millimeter Sizes
            </h3>

            {/* Existing sizes */}
            {sizes.length > 0 ? (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {sizes.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-2 rounded-sm bg-[#1F1E1A] border border-rajvi-borderDark/60 text-xs"
                  >
                    <span className="font-semibold text-rajvi-goldLight">
                      {formatSizeMm(s.size_mm)}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleSizeAvailable(s.id)}
                        className={`text-[10px] uppercase px-2 py-0.5 rounded-sm font-semibold ${
                          s.is_available
                            ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                            : 'bg-red-950/40 text-red-400 border border-red-800/40'
                        }`}
                      >
                        {s.is_available ? 'Available' : 'Disabled'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteSize(s.id)}
                        className="text-red-400 hover:text-red-300 p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-rajvi-muted">
                No sizes configured yet. Add calibrated millimeter sizes below.
              </p>
            )}

            {/* Add Size Input */}
            <div className="pt-2 flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 4.5"
                value={newSizeMm}
                onChange={(e) => setNewSizeMm(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold"
              />
              <button
                type="button"
                onClick={handleAddSize}
                className="px-3 py-1.5 bg-rajvi-gold hover:bg-rajvi-goldLight text-rajvi-black font-semibold text-xs rounded-sm shrink-0 uppercase tracking-wider"
              >
                Add mm
              </button>
            </div>
          </div>

          {/* Section: SEO Metadata */}
          <div className="bg-[#181714] border border-rajvi-borderDark/80 p-6 rounded-sm space-y-4">
            <h3 className="font-serif text-base text-rajvi-offWhite font-normal border-b border-rajvi-borderDark/60 pb-2">
              Search Engine Optimization (SEO)
            </h3>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-rajvi-muted mb-1">
                Meta Title
              </label>
              <input
                type="text"
                placeholder="e.g. Rose Octagone Fancy Cut | Rajvi Diamonds"
                value={formData.seo_title}
                onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                className="w-full px-3 py-1.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-rajvi-muted mb-1">
                Meta Description
              </label>
              <textarea
                rows={3}
                placeholder="Concise Google search description..."
                value={formData.seo_description}
                onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                className="w-full px-3 py-1.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add Custom Color Modal */}
      {showAddColorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#181714] border border-rajvi-gold/40 rounded-sm p-6 max-w-sm w-full space-y-4 shadow-luxuryDark">
            <div className="flex items-center justify-between border-b border-rajvi-borderDark pb-3">
              <h4 className="font-serif text-lg text-rajvi-offWhite font-normal">
                Add Diamond Color Grade
              </h4>
              <button
                type="button"
                onClick={() => setShowAddColorModal(false)}
                className="text-rajvi-muted hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-rajvi-offWhite/80 font-semibold mb-1">
                Color Name / Grade
              </label>
              <input
                type="text"
                placeholder="e.g. Fancy Vivid Pink, D, O-P"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                className="w-full px-3 py-2 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-rajvi-offWhite/80 font-semibold mb-1">
                Category
              </label>
              <select
                value={newColorCategory}
                onChange={(e) => setNewColorCategory(e.target.value as 'standard' | 'fancy')}
                className="w-full px-3 py-2 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold"
              >
                <option value="standard">Standard Alphabetical (D – Z)</option>
                <option value="fancy">Fancy Color (Yellow, Pink, etc.)</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-rajvi-borderDark">
              <button
                type="button"
                onClick={() => setShowAddColorModal(false)}
                className="px-4 py-2 text-xs text-rajvi-muted hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={savingColor || !newColorName.trim()}
                onClick={handleSaveNewColor}
                className="px-4 py-2 bg-rajvi-gold hover:bg-rajvi-goldLight text-rajvi-black font-semibold text-xs uppercase tracking-wider rounded-sm disabled:opacity-50"
              >
                {savingColor ? 'Saving...' : 'Add & Select'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Clarity Modal */}
      {showAddClarityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#181714] border border-rajvi-gold/40 rounded-sm p-6 max-w-sm w-full space-y-4 shadow-luxuryDark">
            <div className="flex items-center justify-between border-b border-rajvi-borderDark pb-3">
              <h4 className="font-serif text-lg text-rajvi-offWhite font-normal">
                Add Purity / Clarity Grade
              </h4>
              <button
                type="button"
                onClick={() => setShowAddClarityModal(false)}
                className="text-rajvi-muted hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-rajvi-offWhite/80 font-semibold mb-1">
                Clarity Code
              </label>
              <input
                type="text"
                placeholder="e.g. VVS1, VS2, SI1"
                value={newClarityName}
                onChange={(e) => setNewClarityName(e.target.value)}
                className="w-full px-3 py-2 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-rajvi-offWhite/80 font-semibold mb-1">
                Full Label Description
              </label>
              <input
                type="text"
                placeholder="e.g. Very Very Slightly Included 1"
                value={newClarityLabel}
                onChange={(e) => setNewClarityLabel(e.target.value)}
                className="w-full px-3 py-2 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-rajvi-borderDark">
              <button
                type="button"
                onClick={() => setShowAddClarityModal(false)}
                className="px-4 py-2 text-xs text-rajvi-muted hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={savingClarity || !newClarityName.trim()}
                onClick={handleSaveNewClarity}
                className="px-4 py-2 bg-rajvi-gold hover:bg-rajvi-goldLight text-rajvi-black font-semibold text-xs uppercase tracking-wider rounded-sm disabled:opacity-50"
              >
                {savingClarity ? 'Saving...' : 'Add & Select'}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
