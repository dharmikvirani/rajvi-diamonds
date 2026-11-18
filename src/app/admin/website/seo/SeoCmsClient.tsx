'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { SeoSettings } from '@/lib/types';
import { Save, Loader2, Upload, Search, Globe, CheckCircle2 } from 'lucide-react';
import AdminToast from '@/components/admin/AdminToast';

interface SeoCmsClientProps {
  initialSeo: SeoSettings;
}

export default function SeoCmsClient({ initialSeo }: SeoCmsClientProps) {
  const [seo, setSeo] = useState<SeoSettings>(initialSeo);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_seo_settings',
          payload: seo,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to save SEO settings');
      showToast('SEO metadata configuration successfully saved');
    } catch (err: any) {
      showToast(err.message || 'Error saving SEO settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleOgUpload = async (e: React.ChangeEvent<HTMLInputElement>, pageKey?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'OG Image upload failed');

      if (!pageKey) {
        setSeo((prev) => ({ ...prev, default_og_image: data.imageUrl }));
      } else {
        setSeo((prev) => ({
          ...prev,
          page_seo: {
            ...prev.page_seo,
            [pageKey]: {
              ...(prev.page_seo[pageKey] || {}),
              og_image: data.imageUrl,
            },
          },
        }));
      }
      showToast('OG Image uploaded to Cloudinary');
    } catch (err: any) {
      showToast(err.message || 'Upload failed', 'error');
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const pages = [
    { key: '/', label: 'Homepage (/)' },
    { key: '/collections', label: 'Diamond Catalogue (/collections)' },
    { key: '/about', label: 'About Us (/about)' },
    { key: '/contact', label: 'Contact Us (/contact)' },
    { key: '/privacy', label: 'Privacy Policy (/privacy)' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-rajvi-borderDark/60">
        <div>
          <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-rajvi-gold font-medium block mb-1">
            Website Management
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-rajvi-offWhite tracking-tight">
            SEO & Social Metadata
          </h2>
          <p className="text-[13px] font-sans text-rajvi-offWhite/65 mt-1">
            Configure global search engine titles, OpenGraph sharing cards, keywords, and per-page meta descriptions.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* GLOBAL DEFAULT SEO */}
        <div className="bg-[#181714] border border-rajvi-borderDark rounded-sm p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-rajvi-borderDark/60">
            <Globe className="w-4 h-4 text-rajvi-gold" />
            <h3 className="font-serif text-lg text-white font-normal">Global SEO Defaults</h3>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-white/80 mb-1.5">
              Default Site Title
            </label>
            <input
              type="text"
              value={seo.default_title}
              onChange={(e) => setSeo({ ...seo, default_title: e.target.value })}
              className="w-full bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm px-3.5 py-2 text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-white/80 mb-1.5">
              Default Meta Description
            </label>
            <textarea
              rows={2}
              value={seo.default_description}
              onChange={(e) => setSeo({ ...seo, default_description: e.target.value })}
              className="w-full bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm px-3.5 py-2 text-white text-xs leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-white/80 mb-1.5">
              Keywords (Comma-separated)
            </label>
            <input
              type="text"
              value={(seo.default_keywords || []).join(', ')}
              onChange={(e) =>
                setSeo({
                  ...seo,
                  default_keywords: e.target.value.split(',').map((k) => k.trim()).filter(Boolean),
                })
              }
              className="w-full bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm px-3.5 py-2 text-white text-xs"
            />
          </div>

          {/* Default OG Image */}
          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-wider text-white/80">
              Default Social Sharing OpenGraph Image
            </label>
            <div className="flex items-center gap-4">
              {seo.default_og_image && (
                <div className="relative h-16 w-28 rounded-sm overflow-hidden border border-rajvi-borderDark shrink-0 bg-[#0D0C0A]">
                  <Image
                    src={seo.default_og_image}
                    alt="OG Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1 space-y-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleOgUpload(e)}
                  disabled={isUploading}
                  className="text-xs text-white/60 file:mr-2 file:py-1 file:px-2.5 file:bg-rajvi-gold file:text-rajvi-black file:rounded-sm file:border-0"
                />
                <input
                  type="text"
                  placeholder="Or enter direct image URL"
                  value={seo.default_og_image}
                  onChange={(e) => setSeo({ ...seo, default_og_image: e.target.value })}
                  className="w-full bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm px-3 py-1 text-white text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* PER-PAGE OVERRIDES */}
        <div className="bg-[#181714] border border-rajvi-borderDark rounded-sm p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-rajvi-borderDark/60">
            <Search className="w-4 h-4 text-rajvi-gold" />
            <h3 className="font-serif text-lg text-white font-normal">Per-Page SEO Overrides</h3>
          </div>

          <div className="space-y-4">
            {pages.map((p) => {
              const current = seo.page_seo?.[p.key] || {};
              return (
                <div
                  key={p.key}
                  className="p-4 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm space-y-3"
                >
                  <span className="text-xs uppercase tracking-wider text-rajvi-gold font-semibold block">
                    {p.label}
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Page SEO Title"
                      value={current.title || ''}
                      onChange={(e) =>
                        setSeo({
                          ...seo,
                          page_seo: {
                            ...seo.page_seo,
                            [p.key]: { ...current, title: e.target.value },
                          },
                        })
                      }
                      className="bg-[#161513] border border-rajvi-borderDark rounded-sm px-3 py-1.5 text-white text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Page Meta Description"
                      value={current.description || ''}
                      onChange={(e) =>
                        setSeo({
                          ...seo,
                          page_seo: {
                            ...seo.page_seo,
                            [p.key]: { ...current, description: e.target.value },
                          },
                        })
                      }
                      className="bg-[#161513] border border-rajvi-borderDark rounded-sm px-3 py-1.5 text-white text-xs"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-rajvi-gold hover:bg-rajvi-goldLight text-rajvi-black font-semibold text-xs uppercase tracking-wider rounded-sm transition-colors shadow-sm"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save All SEO Configurations</span>
          </button>
        </div>
      </form>

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
