'use client';

import React, { useState } from 'react';
import { DiamondColorOption, DiamondClarityOption, SiteSettings } from '@/lib/types';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Palette,
  Sparkles,
  Sliders,
} from 'lucide-react';

interface SettingsClientProps {
  initialSettings: SiteSettings;
  initialColors?: DiamondColorOption[];
  initialClarities?: DiamondClarityOption[];
}

export default function SettingsClient({
  initialSettings,
  initialColors = [],
  initialClarities = [],
}: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'colors' | 'clarities'>('general');

  // General Settings State
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Colors State
  const [colors, setColors] = useState<DiamondColorOption[]>(initialColors);
  const [newColorName, setNewColorName] = useState('');
  const [newColorCategory, setNewColorCategory] = useState<'standard' | 'fancy'>('standard');
  const [isAddingColor, setIsAddingColor] = useState(false);

  // Clarities State
  const [clarities, setClarities] = useState<DiamondClarityOption[]>(initialClarities);
  const [newClarityName, setNewClarityName] = useState('');
  const [newClarityLabel, setNewClarityLabel] = useState('');
  const [isAddingClarity, setIsAddingClarity] = useState(false);

  const [loadingOptionId, setLoadingOptionId] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);
    setIsSaving(true);

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_settings',
          payload: settings,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update settings');
      }

      setSuccessMessage('Business settings and content successfully updated.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Error updating settings');
    } finally {
      setIsSaving(false);
    }
  };

  // Color actions
  const handleAddColor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColorName.trim()) return;

    setIsAddingColor(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_diamond_color',
          payload: {
            name: newColorName.trim(),
            category: newColorCategory,
            display_order: colors.length + 1,
            is_active: true,
          },
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setColors((prev) => [...prev, data.data]);
        setNewColorName('');
        setSuccessMessage(`Color grade "${data.data.name}" added successfully.`);
      } else {
        throw new Error(data.error || 'Failed to add color');
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsAddingColor(false);
    }
  };

  const handleToggleColorActive = async (col: DiamondColorOption) => {
    setLoadingOptionId(col.id);
    const updated = !col.is_active;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_diamond_color',
          payload: { ...col, is_active: updated },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setColors((prev) => prev.map((c) => (c.id === col.id ? { ...c, is_active: updated } : c)));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOptionId(null);
    }
  };

  const handleDeleteColor = async (id: string) => {
    if (!confirm('Are you sure you want to remove this diamond color option?')) return;
    setLoadingOptionId(id);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_diamond_color',
          payload: { id },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setColors((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOptionId(null);
    }
  };

  // Clarity actions
  const handleAddClarity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClarityName.trim()) return;

    setIsAddingClarity(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_diamond_clarity',
          payload: {
            name: newClarityName.trim(),
            label: newClarityLabel.trim() || newClarityName.trim(),
            display_order: clarities.length + 1,
            is_active: true,
          },
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setClarities((prev) => [...prev, data.data]);
        setNewClarityName('');
        setNewClarityLabel('');
        setSuccessMessage(`Clarity grade "${data.data.name}" added successfully.`);
      } else {
        throw new Error(data.error || 'Failed to add clarity');
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsAddingClarity(false);
    }
  };

  const handleToggleClarityActive = async (clr: DiamondClarityOption) => {
    setLoadingOptionId(clr.id);
    const updated = !clr.is_active;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_diamond_clarity',
          payload: { ...clr, is_active: updated },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setClarities((prev) =>
          prev.map((c) => (c.id === clr.id ? { ...c, is_active: updated } : c))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOptionId(null);
    }
  };

  const handleDeleteClarity = async (id: string) => {
    if (!confirm('Are you sure you want to remove this diamond clarity grade?')) return;
    setLoadingOptionId(id);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_diamond_clarity',
          payload: { id },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setClarities((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOptionId(null);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-rajvi-borderDark/60">
        <div>
          <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-rajvi-gold font-medium block mb-1">
            Configuration
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-rajvi-offWhite tracking-tight sm:tracking-normal">
            Brand Identity & Diamond Attributes
          </h2>
          <p className="text-[13px] font-sans text-rajvi-offWhite/65 mt-1.5">
            Manage contact channels, editorial content, and configurable diamond color and purity options.
          </p>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center space-x-2 border-b border-rajvi-borderDark">
        <button
          type="button"
          onClick={() => {
            setActiveTab('general');
            setSuccessMessage(null);
            setErrorMessage(null);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-[13px] font-sans font-medium uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'general'
              ? 'border-rajvi-gold text-rajvi-gold bg-rajvi-gold/5'
              : 'border-transparent text-rajvi-offWhite/70 hover:text-white hover:border-rajvi-borderDark'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>General Settings</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('colors');
            setSuccessMessage(null);
            setErrorMessage(null);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-[13px] font-sans font-medium uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'colors'
              ? 'border-rajvi-gold text-rajvi-gold bg-rajvi-gold/5'
              : 'border-transparent text-rajvi-offWhite/70 hover:text-white hover:border-rajvi-borderDark'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Diamond Color Options ({colors.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('clarities');
            setSuccessMessage(null);
            setErrorMessage(null);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-[13px] font-sans font-medium uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'clarities'
              ? 'border-rajvi-gold text-rajvi-gold bg-rajvi-gold/5'
              : 'border-transparent text-rajvi-offWhite/70 hover:text-white hover:border-rajvi-borderDark'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Purity / Clarity Grades ({clarities.length})</span>
        </button>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800 text-emerald-300 rounded-sm text-[13px] font-sans flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-950/40 border border-red-800 text-red-300 rounded-sm text-[13px] font-sans flex items-center gap-2 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* TAB 1: GENERAL SETTINGS */}
      {activeTab === 'general' && (
        <form onSubmit={handleSettingsSubmit} className="space-y-8">
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-rajvi-gold hover:bg-rajvi-goldLight text-rajvi-black font-semibold text-[13px] font-sans uppercase tracking-wider rounded-sm transition-colors shadow-sm disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save General Settings</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Business Channels */}
            <div className="bg-[#181714] border border-rajvi-borderDark/80 p-6 sm:p-7 rounded-sm space-y-5">
              <h3 className="font-serif text-lg sm:text-xl text-rajvi-offWhite font-normal border-b border-rajvi-borderDark/60 pb-3">
                Brand & Contact Channels
              </h3>

              <div>
                <label className="block text-[12px] font-sans uppercase tracking-wider text-rajvi-offWhite/80 font-medium mb-1.5">
                  Brand Name
                </label>
                <input
                  type="text"
                  name="brand_name"
                  value={settings.brand_name}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-[13px] font-sans text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold transition-colors"
                />
              </div>

              <div>
                <label className="block text-[12px] font-sans uppercase tracking-wider text-rajvi-offWhite/80 font-medium mb-1.5">
                  Brand Tagline
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={settings.tagline}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-[13px] font-sans text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold transition-colors"
                />
              </div>

              <div>
                <label className="block text-[12px] font-sans uppercase tracking-wider text-rajvi-offWhite/80 font-medium mb-1.5">
                  WhatsApp Direct Number (With Country Code)
                </label>
                <input
                  type="text"
                  name="whatsapp_number"
                  placeholder="+919820000000"
                  value={settings.whatsapp_number}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-[13px] font-mono text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold transition-colors"
                />
              </div>

              <div>
                <label className="block text-[12px] font-sans uppercase tracking-wider text-rajvi-offWhite/80 font-medium mb-1.5">
                  Inquiry Email Address
                </label>
                <input
                  type="email"
                  name="contact_email"
                  value={settings.contact_email}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-[13px] font-sans text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold transition-colors"
                />
              </div>

              <div>
                <label className="block text-[12px] font-sans uppercase tracking-wider text-rajvi-offWhite/80 font-medium mb-1.5">
                  Direct Phone Number
                </label>
                <input
                  type="text"
                  name="phone_number"
                  value={settings.phone_number}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-[13px] font-sans text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold transition-colors"
                />
              </div>

              <div>
                <label className="block text-[12px] font-sans uppercase tracking-wider text-rajvi-offWhite/80 font-medium mb-1.5">
                  Instagram Profile URL
                </label>
                <input
                  type="url"
                  name="instagram_url"
                  value={settings.instagram_url}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-[13px] font-sans text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold transition-colors"
                />
              </div>

              <div>
                <label className="block text-[12px] font-sans uppercase tracking-wider text-rajvi-offWhite/80 font-medium mb-1.5">
                  Bourse / Office Address
                </label>
                <textarea
                  rows={2}
                  name="business_address"
                  value={settings.business_address}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-[13px] font-sans text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold transition-colors leading-relaxed"
                />
              </div>
            </div>

            {/* Editorial Copy */}
            <div className="bg-[#181714] border border-rajvi-borderDark/80 p-6 sm:p-7 rounded-sm space-y-5">
              <h3 className="font-serif text-lg sm:text-xl text-rajvi-offWhite font-normal border-b border-rajvi-borderDark/60 pb-3">
                Editorial Story & Copy
              </h3>

              <div>
                <label className="block text-[12px] font-sans uppercase tracking-wider text-rajvi-offWhite/80 font-medium mb-1.5">
                  Hero Heading
                </label>
                <input
                  type="text"
                  name="hero_heading"
                  value={settings.hero_heading}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-[14px] font-serif text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold transition-colors"
                />
              </div>

              <div>
                <label className="block text-[12px] font-sans uppercase tracking-wider text-rajvi-offWhite/80 font-medium mb-1.5">
                  Hero Subtitle
                </label>
                <textarea
                  rows={2}
                  name="hero_subtitle"
                  value={settings.hero_subtitle}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-[13px] font-sans text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold transition-colors leading-relaxed"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[12px] font-sans uppercase tracking-wider text-rajvi-offWhite/80 font-medium">
                    Hero Section Background Diamond Image
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setSettings((prev) => ({
                        ...prev,
                        hero_image_url:
                          'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=2000&q=85',
                      }))
                    }
                    className="text-[11px] font-sans uppercase tracking-wider text-rajvi-gold hover:text-rajvi-goldLight transition-colors font-medium"
                  >
                    Reset to Default Photo
                  </button>
                </div>
                <input
                  type="url"
                  name="hero_image_url"
                  placeholder="https://images.unsplash.com/photo-... or custom diamond image URL"
                  value={settings.hero_image_url || ''}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-[13px] font-mono text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold transition-colors"
                />
                <p className="text-[11px] font-sans text-rajvi-offWhite/50 mt-1">
                  Enter any diamond photography image URL. Changes reflect instantly on the homepage.
                </p>

                {/* Live Preview */}
                {settings.hero_image_url && (
                  <div className="mt-2.5 p-2 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm flex items-center gap-3">
                    <div className="relative w-20 h-12 bg-black rounded-sm overflow-hidden shrink-0 border border-rajvi-borderDark">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={settings.hero_image_url}
                        alt="Hero Preview"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <div className="text-[12px] text-rajvi-offWhite/70 truncate flex-1 font-mono">
                      {settings.hero_image_url}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[12px] font-sans uppercase tracking-wider text-rajvi-offWhite/80 font-medium mb-1.5">
                  Brand Introduction
                </label>
                <textarea
                  rows={3}
                  name="about_brand_intro"
                  value={settings.about_brand_intro}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-[13px] font-sans text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold transition-colors leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[12px] font-sans uppercase tracking-wider text-rajvi-offWhite/80 font-medium mb-1.5">
                  Our Lapidary Story
                </label>
                <textarea
                  rows={4}
                  name="about_story"
                  value={settings.about_story}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-[13px] font-sans text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold transition-colors leading-relaxed"
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: DIAMOND COLORS MANAGEMENT */}
      {activeTab === 'colors' && (
        <div className="space-y-6">
          {/* Add New Color Form */}
          <div className="bg-[#181714] border border-rajvi-borderDark/80 p-6 sm:p-7 rounded-sm">
            <h3 className="font-serif text-lg text-rajvi-offWhite font-normal mb-5 flex items-center justify-between">
              <span>Add Diamond Color Grade</span>
              <span className="text-[11px] uppercase tracking-wider text-rajvi-gold font-sans font-medium">
                Available to Admin Dropdowns & Filters
              </span>
            </h3>

            <form onSubmit={handleAddColor} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
              <div className="sm:col-span-5">
                <label className="block text-[12px] font-sans uppercase tracking-wider text-rajvi-offWhite/80 font-medium mb-1.5">
                  Color Grade Name / Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. D, E, Fancy Vivid Yellow"
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-[13px] font-sans text-rajvi-offWhite placeholder:text-rajvi-offWhite/40 focus:outline-none focus:border-rajvi-gold transition-colors"
                  required
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-[12px] font-sans uppercase tracking-wider text-rajvi-offWhite/80 font-medium mb-1.5">
                  Category
                </label>
                <select
                  value={newColorCategory}
                  onChange={(e) => setNewColorCategory(e.target.value as 'standard' | 'fancy')}
                  className="w-full px-3.5 py-2.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-[13px] font-sans text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold transition-colors"
                >
                  <option value="standard">Standard Alphabetical (D – Z)</option>
                  <option value="fancy">Fancy Color (Yellow, Pink, etc.)</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <button
                  type="submit"
                  disabled={isAddingColor || !newColorName.trim()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-5 bg-rajvi-gold hover:bg-rajvi-goldLight text-rajvi-black font-semibold text-[13px] font-sans uppercase tracking-wider rounded-sm disabled:opacity-50 transition-colors shadow-sm"
                >
                  {isAddingColor ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  <span>Add Color</span>
                </button>
              </div>
            </form>
          </div>

          {/* Colors List Table */}
          <div className="bg-[#181714] border border-rajvi-borderDark/80 rounded-sm overflow-hidden shadow-sm">
            <div className="p-5 sm:p-6 border-b border-rajvi-borderDark/60 flex items-center justify-between">
              <h4 className="font-serif text-base sm:text-lg text-rajvi-offWhite font-normal">
                Configured Diamond Colors ({colors.length})
              </h4>
              <span className="text-[12px] font-sans text-rajvi-offWhite/60">
                Standard & fancy colors selectable in Diamond Management
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px] font-sans">
                <thead className="bg-[#1F1E1A] text-rajvi-offWhite/70 uppercase tracking-wider text-[11px] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Order</th>
                    <th className="py-3 px-4">Color Grade</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rajvi-borderDark/40 text-rajvi-offWhite/85">
                  {colors.map((c, idx) => (
                    <tr key={c.id || idx} className="hover:bg-rajvi-charcoal/30 transition-colors">
                      <td className="py-3.5 px-4 text-rajvi-offWhite/50 font-mono">{idx + 1}</td>
                      <td className="py-3.5 px-4 font-semibold text-rajvi-gold">
                        {c.name}
                      </td>
                      <td className="py-3.5 px-4 text-[12px] capitalize text-rajvi-offWhite/75">
                        {c.category}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleColorActive(c)}
                          disabled={loadingOptionId === c.id}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm text-[11px] font-sans uppercase font-semibold transition-colors ${
                            c.is_active
                              ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                              : 'bg-red-950/40 text-red-400 border border-red-800/40'
                          }`}
                        >
                          {c.is_active ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          <span>{c.is_active ? 'Active' : 'Disabled'}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteColor(c.id)}
                          disabled={loadingOptionId === c.id}
                          className="text-red-400 hover:text-red-300 p-1"
                          title="Delete Color"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DIAMOND CLARITIES MANAGEMENT */}
      {activeTab === 'clarities' && (
        <div className="space-y-6">
          {/* Add New Clarity Form */}
          <div className="bg-[#181714] border border-rajvi-borderDark/80 p-6 sm:p-7 rounded-sm">
            <h3 className="font-serif text-lg text-rajvi-offWhite font-normal mb-5 flex items-center justify-between">
              <span>Add Purity / Clarity Grade</span>
              <span className="text-[11px] uppercase tracking-wider text-rajvi-gold font-sans font-medium">
                GIA & Trade Clarity Benchmarks
              </span>
            </h3>

            <form onSubmit={handleAddClarity} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
              <div className="sm:col-span-4">
                <label className="block text-[12px] font-sans uppercase tracking-wider text-rajvi-offWhite/80 font-medium mb-1.5">
                  Clarity Grade Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. VVS1, VS2"
                  value={newClarityName}
                  onChange={(e) => setNewClarityName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-[13px] font-sans text-rajvi-offWhite placeholder:text-rajvi-offWhite/40 focus:outline-none focus:border-rajvi-gold transition-colors"
                  required
                />
              </div>

              <div className="sm:col-span-5">
                <label className="block text-[12px] font-sans uppercase tracking-wider text-rajvi-offWhite/80 font-medium mb-1.5">
                  Full Description Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. Very Very Slightly Included 1"
                  value={newClarityLabel}
                  onChange={(e) => setNewClarityLabel(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-[13px] font-sans text-rajvi-offWhite placeholder:text-rajvi-offWhite/40 focus:outline-none focus:border-rajvi-gold transition-colors"
                  required
                />
              </div>

              <div className="sm:col-span-3">
                <button
                  type="submit"
                  disabled={isAddingClarity || !newClarityName.trim()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-5 bg-rajvi-gold hover:bg-rajvi-goldLight text-rajvi-black font-semibold text-[13px] font-sans uppercase tracking-wider rounded-sm disabled:opacity-50 transition-colors shadow-sm"
                >
                  {isAddingClarity ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  <span>Add Clarity</span>
                </button>
              </div>
            </form>
          </div>

          {/* Clarities List Table */}
          <div className="bg-[#181714] border border-rajvi-borderDark/80 rounded-sm overflow-hidden shadow-sm">
            <div className="p-5 sm:p-6 border-b border-rajvi-borderDark/60 flex items-center justify-between">
              <h4 className="font-serif text-base sm:text-lg text-rajvi-offWhite font-normal">
                Configured Diamond Clarities ({clarities.length})
              </h4>
              <span className="text-[12px] font-sans text-rajvi-offWhite/60">
                Standard purity grades selectable in Diamond Management
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px] font-sans">
                <thead className="bg-[#1F1E1A] text-rajvi-offWhite/70 uppercase tracking-wider text-[11px] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Order</th>
                    <th className="py-3 px-4">Grade Code</th>
                    <th className="py-3 px-4">Full Label</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rajvi-borderDark/40 text-rajvi-offWhite/85">
                  {clarities.map((clr, idx) => (
                    <tr key={clr.id || idx} className="hover:bg-rajvi-charcoal/30 transition-colors">
                      <td className="py-3.5 px-4 text-rajvi-offWhite/50 font-mono">{idx + 1}</td>
                      <td className="py-3.5 px-4 font-semibold text-rajvi-goldLight font-mono">
                        {clr.name}
                      </td>
                      <td className="py-3.5 px-4 text-rajvi-offWhite/90">
                        {clr.label}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleClarityActive(clr)}
                          disabled={loadingOptionId === clr.id}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm text-[11px] font-sans uppercase font-semibold transition-colors ${
                            clr.is_active
                              ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                              : 'bg-red-950/40 text-red-400 border border-red-800/40'
                          }`}
                        >
                          {clr.is_active ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          <span>{clr.is_active ? 'Active' : 'Disabled'}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteClarity(clr.id)}
                          disabled={loadingOptionId === clr.id}
                          className="text-red-400 hover:text-red-300 p-1"
                          title="Delete Clarity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
