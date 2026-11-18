'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CmsSection, CmsBenefitCardItem, CmsCraftsmanshipStageItem } from '@/lib/types';
import {
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Plus,
  Trash2,
  Upload,
  Sparkles,
  Save,
  Send,
  X,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import AdminToast from '@/components/admin/AdminToast';

interface HomepageCmsClientProps {
  initialSections: CmsSection[];
}

export default function HomepageCmsClient({ initialSections }: HomepageCmsClientProps) {
  const [sections, setSections] = useState<CmsSection[]>(initialSections);
  const [editingSection, setEditingSection] = useState<CmsSection | null>(null);
  const [formData, setFormData] = useState<Partial<CmsSection>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  // Reorder sections
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIndex, 0, moved);

    setSections(newSections);

    try {
      const orderedKeys = newSections.map((s) => s.section_key);
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reorder_sections',
          payload: { orderedKeys },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to reorder sections');
      showToast('Section order updated successfully');
    } catch (err: any) {
      showToast(err.message || 'Error reordering sections', 'error');
    }
  };

  // Toggle section visibility
  const handleToggleVisibility = async (section: CmsSection) => {
    const newActive = !section.is_active;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_section_visibility',
          payload: { sectionKey: section.section_key, isActive: newActive },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to toggle visibility');

      setSections((prev) =>
        prev.map((s) => (s.section_key === section.section_key ? { ...s, is_active: newActive } : s))
      );
      showToast(`Section ${newActive ? 'enabled' : 'hidden'} on live website`);
    } catch (err: any) {
      showToast(err.message || 'Error updating section', 'error');
    }
  };

  // Publish section directly
  const handlePublishSection = async (sectionKey: string) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'publish_section',
          payload: { sectionKey },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to publish section');

      setSections((prev) =>
        prev.map((s) => (s.section_key === sectionKey ? { ...s, ...data.data, has_draft: false, draft_data: null } : s))
      );
      showToast('Section published live to website!', 'success');
      if (editingSection?.section_key === sectionKey) {
        setEditingSection(null);
      }
    } catch (err: any) {
      showToast(err.message || 'Error publishing section', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Open edit modal
  const handleOpenEdit = (section: CmsSection) => {
    setEditingSection(section);
    // Use draft data if present, otherwise live data
    setFormData({
      title: section.title,
      subtitle: section.subtitle,
      badge: section.badge,
      description: section.description,
      image_url: section.image_url,
      image_alt: section.image_alt,
      buttons: section.buttons ? JSON.parse(JSON.stringify(section.buttons)) : [],
      items: section.items ? JSON.parse(JSON.stringify(section.items)) : [],
      ...(section.draft_data || {}),
    });
  };

  // Save Draft
  const handleSaveDraft = async () => {
    if (!editingSection) return;
    setIsSaving(true);

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_section_draft',
          payload: {
            sectionKey: editingSection.section_key,
            draftData: formData,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to save draft');

      setSections((prev) =>
        prev.map((s) =>
          s.section_key === editingSection.section_key
            ? { ...s, draft_data: formData, has_draft: true }
            : s
        )
      );

      showToast('Draft saved successfully. (Live site remains unchanged until published)');
      setEditingSection(null);
    } catch (err: any) {
      showToast(err.message || 'Error saving draft', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Image Upload handler via Cloudinary
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: string = 'image_url') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Image upload failed');

      setFormData((prev) => ({ ...prev, [targetField]: data.imageUrl }));
      showToast('Image uploaded to Cloudinary');
    } catch (err: any) {
      showToast(err.message || 'Upload failed', 'error');
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  // Section names mapping
  const getSectionTitle = (key: string) => {
    switch (key) {
      case 'hero':
        return '1. Hero Showcase Section';
      case 'featured_cuts':
        return '2. Featured Diamond Collections';
      case 'why_choose_us':
        return '3. Why Choose Rajvi Diamonds';
      case 'craftsmanship':
        return '4. Our Craftsmanship';
      case 'brand_story':
        return '5. About Rajvi Diamonds';
      case 'inquiry_cta':
        return '6. Custom Diamond Enquiry CTA';
      default:
        return key;
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-rajvi-borderDark/60">
        <div>
          <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-rajvi-gold font-medium block mb-1">
            Website Management
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-rajvi-offWhite tracking-tight">
            Homepage Sections & Content
          </h2>
          <p className="text-[13px] font-sans text-rajvi-offWhite/65 mt-1">
            Reorder sections, toggle visibility, edit content, and publish changes without modifying code.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/?preview=true"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 border border-rajvi-gold/40 text-rajvi-goldLight hover:bg-rajvi-gold/10 text-[13px] font-sans uppercase tracking-wider font-medium rounded-sm transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Preview Live Site</span>
          </a>
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-4">
        {sections.map((section, idx) => (
          <div
            key={section.section_key}
            className={`bg-[#181714] border rounded-sm p-5 sm:p-6 transition-all ${
              section.is_active
                ? 'border-rajvi-borderDark/80 hover:border-rajvi-gold/40'
                : 'border-rajvi-borderDark/30 opacity-60'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-4">
                {/* Index Pill */}
                <div className="w-9 h-9 rounded-sm bg-[#12110F] border border-rajvi-borderDark/60 flex items-center justify-center font-serif text-sm text-rajvi-gold shrink-0">
                  {idx + 1}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-serif text-lg text-rajvi-offWhite font-normal">
                      {getSectionTitle(section.section_key)}
                    </h3>

                    {/* Status badges */}
                    {section.has_draft ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-sans uppercase tracking-wider font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Draft Pending
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-sans uppercase tracking-wider font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Published
                      </span>
                    )}

                    {!section.is_active && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-sans uppercase tracking-wider font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                        Hidden
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-rajvi-offWhite/60 line-clamp-1 max-w-xl">
                    {section.title || section.subtitle || 'Custom content configured'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                {/* Move Up */}
                <button
                  onClick={() => handleMove(idx, 'up')}
                  disabled={idx === 0}
                  className="p-2 text-rajvi-offWhite/70 hover:text-white disabled:opacity-20 transition-colors"
                  title="Move Up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>

                {/* Move Down */}
                <button
                  onClick={() => handleMove(idx, 'down')}
                  disabled={idx === sections.length - 1}
                  className="p-2 text-rajvi-offWhite/70 hover:text-white disabled:opacity-20 transition-colors"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                {/* Visibility Toggle */}
                <button
                  onClick={() => handleToggleVisibility(section)}
                  className={`p-2 transition-colors ${
                    section.is_active
                      ? 'text-rajvi-offWhite/70 hover:text-white'
                      : 'text-red-400 hover:text-red-300'
                  }`}
                  title={section.is_active ? 'Hide Section' : 'Show Section'}
                >
                  {section.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                {/* Edit Button */}
                <button
                  onClick={() => handleOpenEdit(section)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#22201C] hover:bg-rajvi-gold hover:text-rajvi-black text-rajvi-offWhite text-xs font-sans uppercase tracking-wider font-medium rounded-sm transition-colors border border-rajvi-borderDark"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                {/* Publish Button (when draft is pending) */}
                {section.has_draft && (
                  <button
                    onClick={() => handlePublishSection(section.section_key)}
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-sans uppercase tracking-wider font-semibold rounded-sm transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#161513] border border-rajvi-borderDark rounded-sm w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-rajvi-borderDark/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-rajvi-gold font-semibold block mb-0.5">
                  Section Content Editor
                </span>
                <h3 className="font-serif text-xl text-white font-normal">
                  {getSectionTitle(editingSection.section_key)}
                </h3>
              </div>

              <button
                onClick={() => setEditingSection(null)}
                className="text-white/60 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Common Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-sans uppercase tracking-wider text-rajvi-offWhite/80 mb-2">
                    Section Heading / Headline
                  </label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm px-3.5 py-2.5 text-white focus:outline-none focus:border-rajvi-gold text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-sans uppercase tracking-wider text-rajvi-offWhite/80 mb-2">
                    Section Subtitle / Badge
                  </label>
                  <input
                    type="text"
                    value={formData.badge || formData.subtitle || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, badge: e.target.value, subtitle: e.target.value })
                    }
                    className="w-full bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm px-3.5 py-2.5 text-white focus:outline-none focus:border-rajvi-gold text-sm"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-sans uppercase tracking-wider text-rajvi-offWhite/80 mb-2">
                  Supporting Description / Copy
                </label>
                <textarea
                  rows={3}
                  value={formData.subtitle || formData.description || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subtitle: e.target.value,
                      description: e.target.value,
                    })
                  }
                  className="w-full bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm px-3.5 py-2.5 text-white focus:outline-none focus:border-rajvi-gold text-sm leading-relaxed"
                />
              </div>

              {/* HERO SECTION SPECIFIC FIELDS */}
              {editingSection.section_key === 'hero' && (
                <div className="space-y-5 pt-4 border-t border-rajvi-borderDark/60">
                  <h4 className="text-xs uppercase tracking-wider text-rajvi-gold font-semibold">
                    Hero Showcase Image & CTAs
                  </h4>

                  {/* Image Upload */}
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {formData.image_url && (
                      <div className="relative w-32 h-32 rounded-sm overflow-hidden border border-rajvi-borderDark shrink-0 bg-[#0D0C0A]">
                        <Image
                          src={formData.image_url}
                          alt="Hero Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    <div className="flex-1 space-y-2">
                      <label className="block text-[11px] font-sans text-rajvi-offWhite/80">
                        Upload Hero Macro Diamond Photo (Cloudinary)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'image_url')}
                        disabled={isUploading}
                        className="text-xs text-white/60 file:mr-3 file:py-1.5 file:px-3 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-rajvi-gold file:text-rajvi-black hover:file:bg-rajvi-goldLight"
                      />
                      {isUploading && (
                        <p className="text-xs text-rajvi-gold flex items-center gap-1.5 mt-1">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading to Cloudinary...
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Hallmark Pills */}
                  <div>
                    <label className="block text-[11px] font-sans uppercase tracking-wider text-rajvi-offWhite/80 mb-2">
                      Hallmark Cut Pills (Displayed below CTAs)
                    </label>
                    <div className="space-y-2">
                      {(formData.items || []).map((pill: any, pIdx: number) => (
                        <div key={pIdx} className="flex items-center gap-3">
                          <input
                            type="text"
                            placeholder="Title (e.g. Rose Octagone)"
                            value={pill.title || ''}
                            onChange={(e) => {
                              const newItems = [...(formData.items || [])];
                              newItems[pIdx] = { ...newItems[pIdx], title: e.target.value };
                              setFormData({ ...formData, items: newItems });
                            }}
                            className="bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm px-3 py-1.5 text-white text-xs flex-1"
                          />
                          <input
                            type="text"
                            placeholder="Highlight (e.g. 8-Fold Dome)"
                            value={pill.highlight || ''}
                            onChange={(e) => {
                              const newItems = [...(formData.items || [])];
                              newItems[pIdx] = { ...newItems[pIdx], highlight: e.target.value };
                              setFormData({ ...formData, items: newItems });
                            }}
                            className="bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm px-3 py-1.5 text-white text-xs flex-1"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newItems = (formData.items || []).filter((_: any, idx: number) => idx !== pIdx);
                              setFormData({ ...formData, items: newItems });
                            }}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const newItems = [
                            ...(formData.items || []),
                            { id: `hp-${Date.now()}`, title: 'New Cut', highlight: 'Specification', icon: 'Sparkles' },
                          ];
                          setFormData({ ...formData, items: newItems });
                        }}
                        className="inline-flex items-center gap-1.5 text-xs text-rajvi-gold hover:text-rajvi-goldLight font-medium pt-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Hallmark Pill
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* WHY CHOOSE RAJVI SPECIFIC FIELDS (BENEFIT CARDS) */}
              {editingSection.section_key === 'why_choose_us' && (
                <div className="space-y-4 pt-4 border-t border-rajvi-borderDark/60">
                  <h4 className="text-xs uppercase tracking-wider text-rajvi-gold font-semibold">
                    Core Benefit Cards (4 Pillars)
                  </h4>
                  <div className="space-y-3">
                    {(formData.items || []).map((card: CmsBenefitCardItem, cIdx: number) => (
                      <div
                        key={cIdx}
                        className="p-4 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm space-y-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <input
                            type="text"
                            placeholder="Number (e.g. 01)"
                            value={card.number || ''}
                            onChange={(e) => {
                              const newItems = [...(formData.items || [])];
                              newItems[cIdx] = { ...newItems[cIdx], number: e.target.value };
                              setFormData({ ...formData, items: newItems });
                            }}
                            className="w-20 bg-[#161513] border border-rajvi-borderDark rounded-sm px-2.5 py-1 text-white text-xs font-mono"
                          />
                          <input
                            type="text"
                            placeholder="Card Title"
                            value={card.title || ''}
                            onChange={(e) => {
                              const newItems = [...(formData.items || [])];
                              newItems[cIdx] = { ...newItems[cIdx], title: e.target.value };
                              setFormData({ ...formData, items: newItems });
                            }}
                            className="flex-1 bg-[#161513] border border-rajvi-borderDark rounded-sm px-2.5 py-1 text-white text-xs font-semibold"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newItems = (formData.items || []).filter((_: any, idx: number) => idx !== cIdx);
                              setFormData({ ...formData, items: newItems });
                            }}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          placeholder="Card Description"
                          value={card.description || ''}
                          onChange={(e) => {
                            const newItems = [...(formData.items || [])];
                            newItems[cIdx] = { ...newItems[cIdx], description: e.target.value };
                            setFormData({ ...formData, items: newItems });
                          }}
                          className="w-full bg-[#161513] border border-rajvi-borderDark rounded-sm px-2.5 py-1.5 text-white/80 text-xs"
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const newItems = [
                          ...(formData.items || []),
                          {
                            id: `prop-${Date.now()}`,
                            number: `0${(formData.items?.length || 0) + 1}`,
                            title: 'New Proposition',
                            description: 'Description of the benefit.',
                            icon: 'Sparkles',
                            display_order: (formData.items?.length || 0) + 1,
                            is_active: true,
                          },
                        ];
                        setFormData({ ...formData, items: newItems });
                      }}
                      className="inline-flex items-center gap-1.5 text-xs text-rajvi-gold hover:text-rajvi-goldLight font-medium"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Benefit Card
                    </button>
                  </div>
                </div>
              )}

              {/* CRAFTSMANSHIP SPECIFIC FIELDS (STAGES) */}
              {editingSection.section_key === 'craftsmanship' && (
                <div className="space-y-4 pt-4 border-t border-rajvi-borderDark/60">
                  <h4 className="text-xs uppercase tracking-wider text-rajvi-gold font-semibold">
                    Craftsmanship Stages
                  </h4>
                  <div className="space-y-3">
                    {(formData.items || []).map((stage: CmsCraftsmanshipStageItem, sIdx: number) => (
                      <div
                        key={sIdx}
                        className="p-4 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm space-y-3"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input
                            type="text"
                            placeholder="Step Number (e.g. 01)"
                            value={stage.step || ''}
                            onChange={(e) => {
                              const newItems = [...(formData.items || [])];
                              newItems[sIdx] = { ...newItems[sIdx], step: e.target.value };
                              setFormData({ ...formData, items: newItems });
                            }}
                            className="bg-[#161513] border border-rajvi-borderDark rounded-sm px-2.5 py-1 text-white text-xs font-mono"
                          />
                          <input
                            type="text"
                            placeholder="Stage Title"
                            value={stage.title || ''}
                            onChange={(e) => {
                              const newItems = [...(formData.items || [])];
                              newItems[sIdx] = { ...newItems[sIdx], title: e.target.value };
                              setFormData({ ...formData, items: newItems });
                            }}
                            className="bg-[#161513] border border-rajvi-borderDark rounded-sm px-2.5 py-1 text-white text-xs font-semibold"
                          />
                          <input
                            type="text"
                            placeholder="Badge (e.g. Surat Lapidary)"
                            value={stage.badge || ''}
                            onChange={(e) => {
                              const newItems = [...(formData.items || [])];
                              newItems[sIdx] = { ...newItems[sIdx], badge: e.target.value };
                              setFormData({ ...formData, items: newItems });
                            }}
                            className="bg-[#161513] border border-rajvi-borderDark rounded-sm px-2.5 py-1 text-white text-xs"
                          />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 items-start">
                          <div className="flex-1 w-full space-y-2">
                            <input
                              type="text"
                              placeholder="Tagline / Subheading"
                              value={stage.tagline || ''}
                              onChange={(e) => {
                                const newItems = [...(formData.items || [])];
                                newItems[sIdx] = { ...newItems[sIdx], tagline: e.target.value };
                                setFormData({ ...formData, items: newItems });
                              }}
                              className="w-full bg-[#161513] border border-rajvi-borderDark rounded-sm px-2.5 py-1 text-white/90 text-xs"
                            />
                            <textarea
                              rows={2}
                              placeholder="Stage narrative"
                              value={stage.description || ''}
                              onChange={(e) => {
                                const newItems = [...(formData.items || [])];
                                newItems[sIdx] = { ...newItems[sIdx], description: e.target.value };
                                setFormData({ ...formData, items: newItems });
                              }}
                              className="w-full bg-[#161513] border border-rajvi-borderDark rounded-sm px-2.5 py-1.5 text-white/80 text-xs"
                            />
                          </div>

                          <div className="w-full sm:w-48 space-y-1.5">
                            <label className="text-[10px] uppercase text-white/60 block">Stage Photo</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const f = e.target.files?.[0];
                                if (!f) return;
                                const fd = new FormData();
                                fd.append('file', f);
                                const res = await fetch('/api/upload', { method: 'POST', body: fd });
                                const d = await res.json();
                                if (d.success && d.imageUrl) {
                                  const newItems = [...(formData.items || [])];
                                  newItems[sIdx] = { ...newItems[sIdx], image_url: d.imageUrl };
                                  setFormData({ ...formData, items: newItems });
                                  showToast('Stage image updated via Cloudinary');
                                }
                              }}
                              className="text-[10px] text-white/50 file:py-1 file:px-2 file:rounded-sm file:border-0 file:bg-rajvi-gold file:text-rajvi-black"
                            />
                            {stage.image_url && (
                              <p className="text-[10px] text-white/40 truncate">{stage.image_url}</p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              const newItems = (formData.items || []).filter((_: any, idx: number) => idx !== sIdx);
                              setFormData({ ...formData, items: newItems });
                            }}
                            className="text-red-400 hover:text-red-300 p-1 self-start sm:self-center"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const newItems = [
                          ...(formData.items || []),
                          {
                            id: `stg-${Date.now()}`,
                            step: `0${(formData.items?.length || 0) + 1}`,
                            title: 'New Stage',
                            tagline: 'Stage Subheading',
                            description: 'Description of the craftsmanship process.',
                            badge: 'Precision',
                            image_url: '/images/cuts2.jpeg',
                            display_order: (formData.items?.length || 0) + 1,
                            is_active: true,
                          },
                        ];
                        setFormData({ ...formData, items: newItems });
                      }}
                      className="inline-flex items-center gap-1.5 text-xs text-rajvi-gold hover:text-rajvi-goldLight font-medium"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Craftsmanship Stage
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-rajvi-borderDark/80 flex items-center justify-between bg-[#12110F]">
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                className="px-4 py-2 border border-rajvi-borderDark text-white/70 hover:text-white rounded-sm text-xs font-sans uppercase tracking-wider"
              >
                Cancel
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-sm text-xs font-sans uppercase tracking-wider font-semibold transition-colors"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save as Draft</span>
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    await handleSaveDraft();
                    if (editingSection) {
                      await handlePublishSection(editingSection.section_key);
                    }
                  }}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-rajvi-gold hover:bg-rajvi-goldLight text-rajvi-black rounded-sm text-xs font-sans uppercase tracking-wider font-semibold shadow-sm transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Publish Directly</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast feedback */}
      {toast && (
        <AdminToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
