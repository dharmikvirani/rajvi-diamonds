'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { HeaderSettings, WebsiteNavigationItem } from '@/lib/types';
import {
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Loader2,
  Upload,
  CheckCircle2,
  ExternalLink,
  Navigation,
  Sliders,
} from 'lucide-react';
import AdminToast from '@/components/admin/AdminToast';

interface NavigationClientProps {
  initialHeaderSettings: HeaderSettings;
  initialNavigation: WebsiteNavigationItem[];
}

export default function NavigationClient({
  initialHeaderSettings,
  initialNavigation,
}: NavigationClientProps) {
  const [headerSettings, setHeaderSettings] = useState<HeaderSettings>(initialHeaderSettings);
  const [navigation, setNavigation] = useState<WebsiteNavigationItem[]>(initialNavigation);
  const [activeTab, setActiveTab] = useState<'header' | 'footer_collections' | 'footer_navigation'>('header');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  // Header settings save
  const handleSaveHeader = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_header_settings',
          payload: headerSettings,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to update header');
      showToast('Header configuration updated successfully');
    } catch (err: any) {
      showToast(err.message || 'Error updating header', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Logo upload
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

      setHeaderSettings((prev) => ({ ...prev, logo_url: data.imageUrl }));
      showToast('Logo uploaded to Cloudinary');
    } catch (err: any) {
      showToast(err.message || 'Error uploading logo', 'error');
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  // Navigation Links for active tab
  const activeItems = navigation
    .filter((n) => n.menu_location === activeTab)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  // Add new link
  const handleAddLink = async () => {
    try {
      const newOrder = activeItems.length + 1;
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_navigation_item',
          payload: {
            menu_location: activeTab,
            label: 'New Link',
            href: '/',
            display_order: newOrder,
            is_active: true,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to add link');

      setNavigation((prev) => [...prev, data.data]);
      showToast('Navigation link added');
    } catch (err: any) {
      showToast(err.message || 'Error adding link', 'error');
    }
  };

  // Update link
  const handleUpdateLink = async (id: string, updates: Partial<WebsiteNavigationItem>) => {
    const target = navigation.find((n) => n.id === id);
    if (!target) return;
    const updated = { ...target, ...updates };

    setNavigation((prev) => prev.map((n) => (n.id === id ? updated : n)));

    try {
      await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_navigation_item',
          payload: updated,
        }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Move link up / down
  const handleMoveLink = async (id: string, direction: 'up' | 'down') => {
    const list = [...activeItems];
    const idx = list.findIndex((n) => n.id === id);
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    const [moved] = list.splice(idx, 1);
    list.splice(targetIdx, 0, moved);

    const orderedIds = list.map((item) => item.id);

    setNavigation((prev) => {
      const other = prev.filter((n) => n.menu_location !== activeTab);
      const updatedList = list.map((item, i) => ({ ...item, display_order: i + 1 }));
      return [...other, ...updatedList];
    });

    try {
      await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reorder_navigation',
          payload: { orderedIds },
        }),
      });
      showToast('Menu order updated');
    } catch (err: any) {
      showToast(err.message || 'Error reordering menu', 'error');
    }
  };

  // Delete link
  const handleDeleteLink = async (id: string) => {
    if (!confirm('Are you sure you want to delete this navigation link?')) return;

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_navigation_item',
          payload: { id },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to delete link');

      setNavigation((prev) => prev.filter((n) => n.id !== id));
      showToast('Navigation link deleted');
    } catch (err: any) {
      showToast(err.message || 'Error deleting link', 'error');
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
            Header & Navigation Menus
          </h2>
          <p className="text-[13px] font-sans text-rajvi-offWhite/65 mt-1">
            Manage website logo, header CTA button, and all header & footer menu links.
          </p>
        </div>
      </div>

      {/* SECTION 1: HEADER LOGO & CTA CONFIGURATION */}
      <form
        onSubmit={handleSaveHeader}
        className="bg-[#181714] border border-rajvi-borderDark rounded-sm p-6 space-y-6"
      >
        <div className="flex items-center gap-2 pb-3 border-b border-rajvi-borderDark/60">
          <Sliders className="w-4 h-4 text-rajvi-gold" />
          <h3 className="font-serif text-lg text-white font-normal">Header Identity & CTAs</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logo Section */}
          <div className="space-y-4">
            <label className="block text-xs font-sans uppercase tracking-wider text-rajvi-offWhite/80">
              Header Logo Artwork
            </label>
            <div className="flex items-center gap-4">
              <div className="h-16 w-44 bg-[#0D0C0A] border border-rajvi-borderDark rounded-sm flex items-center justify-center p-2 relative overflow-hidden">
                <Image
                  src={headerSettings.logo_url || '/rajvi-diamonds-logo-light.png'}
                  alt="Brand Logo"
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
                  value={headerSettings.logo_url}
                  onChange={(e) =>
                    setHeaderSettings({ ...headerSettings, logo_url: e.target.value })
                  }
                  className="w-full bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm px-3 py-1.5 text-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Header Action Button */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-sans uppercase tracking-wider text-rajvi-offWhite/80">
                Header CTA Button
              </label>
              <label className="flex items-center gap-2 text-xs text-white/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={headerSettings.show_cta}
                  onChange={(e) =>
                    setHeaderSettings({ ...headerSettings, show_cta: e.target.checked })
                  }
                  className="rounded border-rajvi-borderDark text-rajvi-gold focus:ring-0"
                />
                <span>Enable Header CTA</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-white/60 uppercase mb-1">Button Label</label>
                <input
                  type="text"
                  value={headerSettings.cta_label}
                  onChange={(e) =>
                    setHeaderSettings({ ...headerSettings, cta_label: e.target.value })
                  }
                  className="w-full bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm px-3 py-1.5 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] text-white/60 uppercase mb-1">Destination URL</label>
                <input
                  type="text"
                  value={headerSettings.cta_href}
                  onChange={(e) =>
                    setHeaderSettings({ ...headerSettings, cta_href: e.target.value })
                  }
                  className="w-full bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm px-3 py-1.5 text-white text-xs"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs text-white/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={headerSettings.show_whatsapp}
                  onChange={(e) =>
                    setHeaderSettings({ ...headerSettings, show_whatsapp: e.target.checked })
                  }
                  className="rounded border-rajvi-borderDark text-rajvi-gold focus:ring-0"
                />
                <span>Display WhatsApp Quick Action Button in Header</span>
              </label>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-rajvi-gold hover:bg-rajvi-goldLight text-rajvi-black font-semibold text-xs uppercase tracking-wider rounded-sm transition-colors shadow-sm"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Header Settings</span>
          </button>
        </div>
      </form>

      {/* SECTION 2: NAVIGATION LINKS BUILDER */}
      <div className="bg-[#181714] border border-rajvi-borderDark rounded-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rajvi-borderDark/60">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-rajvi-gold" />
            <h3 className="font-serif text-lg text-white font-normal">Navigation Menus</h3>
          </div>

          {/* Menu Location Tabs */}
          <div className="flex items-center gap-1.5 bg-[#12110F] p-1 border border-rajvi-borderDark rounded-sm">
            <button
              onClick={() => setActiveTab('header')}
              className={`px-3 py-1.5 text-xs font-sans uppercase tracking-wider rounded-sm transition-colors ${
                activeTab === 'header'
                  ? 'bg-rajvi-gold text-rajvi-black font-semibold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Header Menu
            </button>
            <button
              onClick={() => setActiveTab('footer_collections')}
              className={`px-3 py-1.5 text-xs font-sans uppercase tracking-wider rounded-sm transition-colors ${
                activeTab === 'footer_collections'
                  ? 'bg-rajvi-gold text-rajvi-black font-semibold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Footer Collections
            </button>
            <button
              onClick={() => setActiveTab('footer_navigation')}
              className={`px-3 py-1.5 text-xs font-sans uppercase tracking-wider rounded-sm transition-colors ${
                activeTab === 'footer_navigation'
                  ? 'bg-rajvi-gold text-rajvi-black font-semibold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Footer Navigation
            </button>
          </div>
        </div>

        {/* Links Table */}
        <div className="space-y-3">
          {activeItems.map((item, idx) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm"
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="w-6 font-mono text-xs text-rajvi-gold text-center">{idx + 1}</span>

                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => handleUpdateLink(item.id, { label: e.target.value })}
                  placeholder="Link Label"
                  className="bg-[#161513] border border-rajvi-borderDark rounded-sm px-3 py-1.5 text-white text-xs font-medium w-48"
                />

                <input
                  type="text"
                  value={item.href}
                  onChange={(e) => handleUpdateLink(item.id, { href: e.target.value })}
                  placeholder="Link Destination URL"
                  className="bg-[#161513] border border-rajvi-borderDark rounded-sm px-3 py-1.5 text-white/90 text-xs flex-1 font-mono"
                />
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <label className="flex items-center gap-1.5 text-xs text-white/70 mr-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.is_active}
                    onChange={(e) => handleUpdateLink(item.id, { is_active: e.target.checked })}
                    className="rounded border-rajvi-borderDark text-rajvi-gold focus:ring-0"
                  />
                  <span>Active</span>
                </label>

                <button
                  onClick={() => handleMoveLink(item.id, 'up')}
                  disabled={idx === 0}
                  className="p-1.5 text-white/70 hover:text-white disabled:opacity-20"
                  title="Move Up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleMoveLink(item.id, 'down')}
                  disabled={idx === activeItems.length - 1}
                  className="p-1.5 text-white/70 hover:text-white disabled:opacity-20"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDeleteLink(item.id)}
                  className="p-1.5 text-red-400 hover:text-red-300 ml-1"
                  title="Delete Link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddLink}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#24221D] hover:bg-rajvi-gold hover:text-rajvi-black text-rajvi-offWhite text-xs font-sans uppercase tracking-wider font-medium rounded-sm transition-colors border border-rajvi-borderDark"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Menu Link</span>
        </button>
      </div>

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
