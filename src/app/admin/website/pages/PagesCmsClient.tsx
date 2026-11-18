'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PageCmsContent } from '@/lib/types';
import { Save, Loader2, Upload, Plus, Trash2, FileText, Sparkles } from 'lucide-react';
import AdminToast from '@/components/admin/AdminToast';

interface PagesCmsClientProps {
  initialAbout: PageCmsContent['about'];
  initialContact: PageCmsContent['contact'];
  initialPrivacy: PageCmsContent['privacy'];
}

export default function PagesCmsClient({
  initialAbout,
  initialContact,
  initialPrivacy,
}: PagesCmsClientProps) {
  const [activeTab, setActiveTab] = useState<'about' | 'contact' | 'privacy'>('about');
  const [about, setAbout] = useState(initialAbout);
  const [contact, setContact] = useState(initialContact);
  const [privacy, setPrivacy] = useState(initialPrivacy);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const handleSave = async (page: 'about' | 'contact' | 'privacy', content: any) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_page_cms',
          payload: { page, content },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to update page');
      showToast(`${page.toUpperCase()} page content updated successfully`);
    } catch (err: any) {
      showToast(err.message || 'Error updating page', 'error');
    } finally {
      setIsSaving(false);
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
            Individual Public Pages CMS
          </h2>
          <p className="text-[13px] font-sans text-rajvi-offWhite/65 mt-1">
            Manage long-form editorial copy, workshop narratives, contact support prompts, and legal privacy terms.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-[#12110F] p-1 border border-rajvi-borderDark rounded-sm">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-3 py-1.5 text-xs font-sans uppercase tracking-wider rounded-sm transition-colors ${
              activeTab === 'about'
                ? 'bg-rajvi-gold text-rajvi-black font-semibold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            About Us (/about)
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-3 py-1.5 text-xs font-sans uppercase tracking-wider rounded-sm transition-colors ${
              activeTab === 'contact'
                ? 'bg-rajvi-gold text-rajvi-black font-semibold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Contact (/contact)
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3 py-1.5 text-xs font-sans uppercase tracking-wider rounded-sm transition-colors ${
              activeTab === 'privacy'
                ? 'bg-rajvi-gold text-rajvi-black font-semibold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Privacy (/privacy)
          </button>
        </div>
      </div>

      {/* TAB 1: ABOUT US PAGE */}
      {activeTab === 'about' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave('about', about);
          }}
          className="bg-[#181714] border border-rajvi-borderDark rounded-sm p-6 space-y-6"
        >
          <div className="flex items-center gap-2 pb-3 border-b border-rajvi-borderDark/60">
            <FileText className="w-4 h-4 text-rajvi-gold" />
            <h3 className="font-serif text-lg text-white font-normal">About Us Page Content</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/80 mb-1.5">
                Hero Heading
              </label>
              <input
                type="text"
                value={about.hero_title}
                onChange={(e) => setAbout({ ...about, hero_title: e.target.value })}
                className="w-full bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm px-3.5 py-2 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/80 mb-1.5">
                Hero Badge
              </label>
              <input
                type="text"
                value={about.hero_badge}
                onChange={(e) => setAbout({ ...about, hero_badge: e.target.value })}
                className="w-full bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm px-3.5 py-2 text-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-white/80 mb-1.5">
              Hero Introduction
            </label>
            <textarea
              rows={2}
              value={about.hero_subtitle}
              onChange={(e) => setAbout({ ...about, hero_subtitle: e.target.value })}
              className="w-full bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm px-3.5 py-2 text-white text-xs"
            />
          </div>

          {/* Genesis & Ethos Story */}
          <div className="space-y-4 pt-4 border-t border-rajvi-borderDark/60">
            <h4 className="text-xs uppercase tracking-wider text-rajvi-gold font-semibold">
              Section 2: Genesis & Ethos Story
            </h4>
            <div>
              <label className="block text-xs uppercase text-white/70 mb-1">Story Heading</label>
              <input
                type="text"
                value={about.story_heading}
                onChange={(e) => setAbout({ ...about, story_heading: e.target.value })}
                className="w-full bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm px-3.5 py-2 text-white text-xs"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase text-white/70 mb-1">Story Paragraph 1</label>
                <textarea
                  rows={4}
                  value={about.story_p1}
                  onChange={(e) => setAbout({ ...about, story_p1: e.target.value })}
                  className="w-full bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm px-3.5 py-2 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-white/70 mb-1">Story Paragraph 2</label>
                <textarea
                  rows={4}
                  value={about.story_p2}
                  onChange={(e) => setAbout({ ...about, story_p2: e.target.value })}
                  className="w-full bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm px-3.5 py-2 text-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Surat Lapidary Workshop Section */}
          <div className="space-y-4 pt-4 border-t border-rajvi-borderDark/60">
            <h4 className="text-xs uppercase tracking-wider text-rajvi-gold font-semibold">
              Section 4: Surat Lapidary Workshop
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase text-white/70 mb-1">Workshop Heading</label>
                <input
                  type="text"
                  value={about.craftsmanship_heading}
                  onChange={(e) => setAbout({ ...about, craftsmanship_heading: e.target.value })}
                  className="w-full bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm px-3.5 py-2 text-white text-xs mb-3"
                />
                <label className="block text-xs uppercase text-white/70 mb-1">Workshop Description</label>
                <textarea
                  rows={3}
                  value={about.craftsmanship_desc}
                  onChange={(e) => setAbout({ ...about, craftsmanship_desc: e.target.value })}
                  className="w-full bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm px-3.5 py-2 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-white/70 mb-1">Workshop Image URL</label>
                <input
                  type="text"
                  value={about.craftsmanship_image}
                  onChange={(e) => setAbout({ ...about, craftsmanship_image: e.target.value })}
                  className="w-full bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm px-3.5 py-2 text-white text-xs mb-2"
                />
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
                    if (d.success) setAbout({ ...about, craftsmanship_image: d.imageUrl });
                  }}
                  className="text-xs text-white/60 file:mr-2 file:py-1 file:px-2.5 file:bg-rajvi-gold file:text-rajvi-black file:rounded-sm file:border-0"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-rajvi-gold hover:bg-rajvi-goldLight text-rajvi-black font-semibold text-xs uppercase tracking-wider rounded-sm transition-colors shadow-sm"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save About Page Content</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: CONTACT US PAGE */}
      {activeTab === 'contact' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave('contact', contact);
          }}
          className="bg-[#181714] border border-rajvi-borderDark rounded-sm p-6 space-y-6"
        >
          <div className="flex items-center gap-2 pb-3 border-b border-rajvi-borderDark/60">
            <FileText className="w-4 h-4 text-rajvi-gold" />
            <h3 className="font-serif text-lg text-white font-normal">Contact Page Prompts</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/80 mb-1.5">
                Hero Heading
              </label>
              <input
                type="text"
                value={contact.hero_title}
                onChange={(e) => setContact({ ...contact, hero_title: e.target.value })}
                className="w-full bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm px-3.5 py-2 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/80 mb-1.5">
                Hero Badge
              </label>
              <input
                type="text"
                value={contact.hero_badge}
                onChange={(e) => setContact({ ...contact, hero_badge: e.target.value })}
                className="w-full bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm px-3.5 py-2 text-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-white/80 mb-1.5">
              Hero Subtitle
            </label>
            <textarea
              rows={2}
              value={contact.hero_subtitle}
              onChange={(e) => setContact({ ...contact, hero_subtitle: e.target.value })}
              className="w-full bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm px-3.5 py-2 text-white text-xs"
            />
          </div>

          {/* WhatsApp Support Box */}
          <div className="space-y-4 pt-4 border-t border-rajvi-borderDark/60">
            <h4 className="text-xs uppercase tracking-wider text-rajvi-gold font-semibold">
              WhatsApp Support Highlight Box
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase text-white/70 mb-1">Box Title</label>
                <input
                  type="text"
                  value={contact.whatsapp_box_title}
                  onChange={(e) => setContact({ ...contact, whatsapp_box_title: e.target.value })}
                  className="w-full bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm px-3.5 py-2 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-white/70 mb-1">Box Tagline</label>
                <input
                  type="text"
                  value={contact.whatsapp_box_subtitle}
                  onChange={(e) => setContact({ ...contact, whatsapp_box_subtitle: e.target.value })}
                  className="w-full bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm px-3.5 py-2 text-white text-xs"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase text-white/70 mb-1">Box Description</label>
              <textarea
                rows={2}
                value={contact.whatsapp_box_desc}
                onChange={(e) => setContact({ ...contact, whatsapp_box_desc: e.target.value })}
                className="w-full bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm px-3.5 py-2 text-white text-xs"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-rajvi-gold hover:bg-rajvi-goldLight text-rajvi-black font-semibold text-xs uppercase tracking-wider rounded-sm transition-colors shadow-sm"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Contact Page Prompts</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: PRIVACY POLICY PAGE */}
      {activeTab === 'privacy' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave('privacy', privacy);
          }}
          className="bg-[#181714] border border-rajvi-borderDark rounded-sm p-6 space-y-6"
        >
          <div className="flex items-center gap-2 pb-3 border-b border-rajvi-borderDark/60">
            <FileText className="w-4 h-4 text-rajvi-gold" />
            <h3 className="font-serif text-lg text-white font-normal">Privacy Policy Document</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/80 mb-1">
                Document Title
              </label>
              <input
                type="text"
                value={privacy.title}
                onChange={(e) => setPrivacy({ ...privacy, title: e.target.value })}
                className="w-full bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm px-3 py-1.5 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/80 mb-1">
                Badge
              </label>
              <input
                type="text"
                value={privacy.badge}
                onChange={(e) => setPrivacy({ ...privacy, badge: e.target.value })}
                className="w-full bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm px-3 py-1.5 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/80 mb-1">
                Last Updated Notice
              </label>
              <input
                type="text"
                value={privacy.last_updated}
                onChange={(e) => setPrivacy({ ...privacy, last_updated: e.target.value })}
                className="w-full bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm px-3 py-1.5 text-white text-xs"
              />
            </div>
          </div>

          {/* Policy Sections */}
          <div className="space-y-4 pt-4 border-t border-rajvi-borderDark/60">
            <div className="flex items-center justify-between">
              <h4 className="text-xs uppercase tracking-wider text-rajvi-gold font-semibold">
                Policy Sections & Legal Clauses
              </h4>
              <button
                type="button"
                onClick={() => {
                  const newSecs = [
                    ...privacy.sections,
                    {
                      id: `sec-${Date.now()}`,
                      heading: `${privacy.sections.length + 1}. Clause Title`,
                      content: 'Policy clause text content.',
                    },
                  ];
                  setPrivacy({ ...privacy, sections: newSecs });
                }}
                className="inline-flex items-center gap-1.5 text-xs text-rajvi-gold hover:text-rajvi-goldLight font-medium"
              >
                <Plus className="w-3.5 h-3.5" /> Add Clause
              </button>
            </div>

            <div className="space-y-3">
              {privacy.sections.map((sec, idx) => (
                <div key={sec.id} className="p-4 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="text"
                      value={sec.heading}
                      onChange={(e) => {
                        const newSecs = [...privacy.sections];
                        newSecs[idx] = { ...newSecs[idx], heading: e.target.value };
                        setPrivacy({ ...privacy, sections: newSecs });
                      }}
                      className="flex-1 bg-[#161513] border border-rajvi-borderDark rounded-sm px-2.5 py-1 text-white text-xs font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPrivacy({
                          ...privacy,
                          sections: privacy.sections.filter((_, i) => i !== idx),
                        });
                      }}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={sec.content}
                    onChange={(e) => {
                      const newSecs = [...privacy.sections];
                      newSecs[idx] = { ...newSecs[idx], content: e.target.value };
                      setPrivacy({ ...privacy, sections: newSecs });
                    }}
                    className="w-full bg-[#161513] border border-rajvi-borderDark rounded-sm px-2.5 py-1.5 text-white/80 text-xs leading-relaxed"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-rajvi-gold hover:bg-rajvi-goldLight text-rajvi-black font-semibold text-xs uppercase tracking-wider rounded-sm transition-colors shadow-sm"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Privacy Policy</span>
            </button>
          </div>
        </form>
      )}

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
