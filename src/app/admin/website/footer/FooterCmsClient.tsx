'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FooterSettings } from '@/lib/types';
import { Save, Loader2, Upload, PanelBottom } from 'lucide-react';
import AdminToast from '@/components/admin/AdminToast';

interface FooterCmsClientProps {
  initialFooterSettings: FooterSettings;
}

export default function FooterCmsClient({ initialFooterSettings }: FooterCmsClientProps) {
  const [settings, setSettings] = useState<FooterSettings>(initialFooterSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_footer_settings',
          payload: settings,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to update footer settings');
      showToast('Footer settings successfully saved');
    } catch (err: any) {
      showToast(err.message || 'Error saving footer settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Logo upload failed');

      setSettings((prev) => ({ ...prev, logo_url: data.imageUrl }));
      showToast('Footer logo uploaded to Cloudinary');
    } catch (err: any) {
      showToast(err.message || 'Error uploading logo', 'error');
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-rajvi-borderDark/60">
        <div>
          <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-rajvi-gold font-medium block mb-1">
            Website Management
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-rajvi-offWhite tracking-tight">
            Footer Content & Branding
          </h2>
          <p className="text-[13px] font-sans text-rajvi-offWhite/65 mt-1">
            Configure footer logo, brand summary, trust badge, legal disclaimer, and copyright notice.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#181714] border border-rajvi-borderDark rounded-sm p-6 space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-rajvi-borderDark/60">
          <PanelBottom className="w-4 h-4 text-rajvi-gold" />
          <h3 className="font-serif text-lg text-white font-normal">Footer Specifications</h3>
        </div>

        {/* Logo Upload */}
        <div className="space-y-3">
          <label className="block text-xs font-sans uppercase tracking-wider text-rajvi-offWhite/80">
            Footer Logo Artwork
          </label>
          <div className="flex items-center gap-4">
            <div className="h-16 w-44 bg-[#0D0C0A] border border-rajvi-borderDark rounded-sm flex items-center justify-center p-2 relative overflow-hidden">
              <Image
                src={settings.logo_url || '/rajvi-diamonds-logo-light.png'}
                alt="Footer Brand Logo"
                width={1089}
                height={840}
                className="object-contain max-h-full max-w-full"
              />
            </div>

            <div className="space-y-1.5 flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={isUploading}
                className="text-xs text-white/60 file:mr-3 file:py-1.5 file:px-3 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-rajvi-gold file:text-rajvi-black"
              />
              <input
                type="text"
                placeholder="Or enter direct image URL"
                value={settings.logo_url}
                onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                className="w-full bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm px-3 py-1.5 text-white text-xs"
              />
            </div>
          </div>
        </div>

        {/* Brand Description */}
        <div>
          <label className="block text-xs font-sans uppercase tracking-wider text-rajvi-offWhite/80 mb-2">
            Footer Brand Description
          </label>
          <textarea
            rows={3}
            value={settings.brand_description}
            onChange={(e) => setSettings({ ...settings, brand_description: e.target.value })}
            className="w-full bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm px-3.5 py-2.5 text-white text-xs leading-relaxed"
          />
        </div>

        {/* Badge & Disclaimer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-rajvi-offWhite/80 mb-2">
              Footer Trust Badge Text
            </label>
            <input
              type="text"
              value={settings.footer_badge}
              onChange={(e) => setSettings({ ...settings, footer_badge: e.target.value })}
              className="w-full bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm px-3.5 py-2 text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-rajvi-offWhite/80 mb-2">
              Legal Disclaimer Sub-Label
            </label>
            <input
              type="text"
              value={settings.disclaimer}
              onChange={(e) => setSettings({ ...settings, disclaimer: e.target.value })}
              className="w-full bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm px-3.5 py-2 text-white text-xs"
            />
          </div>
        </div>

        {/* Copyright Text */}
        <div>
          <label className="block text-xs font-sans uppercase tracking-wider text-rajvi-offWhite/80 mb-2">
            Copyright Line Notice
          </label>
          <input
            type="text"
            value={settings.copyright_text}
            onChange={(e) => setSettings({ ...settings, copyright_text: e.target.value })}
            className="w-full bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm px-3.5 py-2 text-white text-xs"
          />
        </div>

        {/* Toggle Socials */}
        <div className="pt-2">
          <label className="flex items-center gap-2 text-xs text-white/80 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.show_socials}
              onChange={(e) => setSettings({ ...settings, show_socials: e.target.checked })}
              className="rounded border-rajvi-borderDark text-rajvi-gold focus:ring-0"
            />
            <span>Display Social Media Icons in Footer</span>
          </label>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-rajvi-gold hover:bg-rajvi-goldLight text-rajvi-black font-semibold text-xs uppercase tracking-wider rounded-sm transition-colors shadow-sm"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Footer Settings</span>
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
