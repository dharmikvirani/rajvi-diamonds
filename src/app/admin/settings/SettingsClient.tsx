'use client';

import React, { useState } from 'react';
import { SiteSettings } from '@/lib/types';
import { Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface SettingsClientProps {
  initialSettings: SiteSettings;
}

export default function SettingsClient({ initialSettings }: SettingsClientProps) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      <div className="flex items-center justify-between pb-4 border-b border-rajvi-borderDark/60">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-rajvi-gold font-semibold block">
            Configuration
          </span>
          <h2 className="font-serif text-2xl font-normal text-rajvi-offWhite">
            Brand Identity & Global Settings
          </h2>
          <p className="text-xs text-rajvi-offWhite/60 mt-1">
            Manage contact channels, WhatsApp routing, homepage slogans, and editorial about sections.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-rajvi-gold hover:bg-rajvi-goldLight text-rajvi-black font-semibold text-xs uppercase tracking-wider rounded-sm transition-colors shadow-goldGlow disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Updating...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </>
          )}
        </button>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800 text-emerald-300 rounded-sm text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-950/40 border border-red-800 text-red-300 rounded-sm text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Col 1: Brand & Direct Contact Channels */}
        <div className="space-y-6">
          <div className="bg-[#181714] border border-rajvi-borderDark/80 p-6 rounded-sm space-y-4">
            <h3 className="font-serif text-base text-rajvi-offWhite font-normal border-b border-rajvi-borderDark/60 pb-2">
              Brand & Channels
            </h3>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-rajvi-offWhite/80 font-semibold mb-1">
                Brand Name
              </label>
              <input
                type="text"
                name="brand_name"
                value={settings.brand_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-rajvi-offWhite/80 font-semibold mb-1">
                WhatsApp Routing Number (with Country Code)
              </label>
              <input
                type="text"
                name="whatsapp_number"
                placeholder="+919876543210"
                value={settings.whatsapp_number}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite font-mono focus:outline-none focus:border-rajvi-gold"
              />
              <span className="text-[10px] text-rajvi-muted mt-1 block">
                All prefilled WhatsApp customer inquiries will route to this number.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-rajvi-offWhite/80 font-semibold mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contact_email"
                  value={settings.contact_email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-rajvi-offWhite/80 font-semibold mb-1">
                  Direct Phone Number
                </label>
                <input
                  type="text"
                  name="phone_number"
                  value={settings.phone_number}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-rajvi-offWhite/80 font-semibold mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                name="instagram_url"
                value={settings.instagram_url}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-rajvi-offWhite/80 font-semibold mb-1">
                Business Address (Diamond Bourse / Studio)
              </label>
              <textarea
                rows={2}
                name="business_address"
                value={settings.business_address}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-rajvi-offWhite/80 font-semibold mb-1">
                Footer Summary Text
              </label>
              <textarea
                rows={2}
                name="footer_text"
                value={settings.footer_text}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold"
              />
            </div>
          </div>
        </div>

        {/* Col 2: Homepage Hero & Editorial About Content */}
        <div className="space-y-6">
          <div className="bg-[#181714] border border-rajvi-borderDark/80 p-6 rounded-sm space-y-4">
            <h3 className="font-serif text-base text-rajvi-offWhite font-normal border-b border-rajvi-borderDark/60 pb-2">
              Homepage Hero
            </h3>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-rajvi-offWhite/80 font-semibold mb-1">
                Hero Heading
              </label>
              <input
                type="text"
                name="hero_heading"
                value={settings.hero_heading}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-rajvi-offWhite/80 font-semibold mb-1">
                Hero Subtitle
              </label>
              <textarea
                rows={2}
                name="hero_subtitle"
                value={settings.hero_subtitle}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold"
              />
            </div>
          </div>

          <div className="bg-[#181714] border border-rajvi-borderDark/80 p-6 rounded-sm space-y-4">
            <h3 className="font-serif text-base text-rajvi-offWhite font-normal border-b border-rajvi-borderDark/60 pb-2">
              Editorial About Us Content
            </h3>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-rajvi-offWhite/80 font-semibold mb-1">
                Brand Introduction
              </label>
              <textarea
                rows={3}
                name="about_brand_intro"
                value={settings.about_brand_intro}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-rajvi-offWhite/80 font-semibold mb-1">
                The Rajvi Diamonds Story
              </label>
              <textarea
                rows={4}
                name="about_story"
                value={settings.about_story}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-rajvi-offWhite/80 font-semibold mb-1">
                Our Lapidary Expertise
              </label>
              <textarea
                rows={3}
                name="about_expertise"
                value={settings.about_expertise}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-rajvi-offWhite/80 font-semibold mb-1">
                Quality Commitment
              </label>
              <textarea
                rows={3}
                name="about_quality"
                value={settings.about_quality}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-rajvi-offWhite/80 font-semibold mb-1">
                Our Vision
              </label>
              <textarea
                rows={3}
                name="about_vision"
                value={settings.about_vision}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
