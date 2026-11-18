'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CmsGalleryItem } from '@/lib/types';
import {
  Upload,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Edit2,
  Save,
  Loader2,
  Images,
  CheckCircle2,
} from 'lucide-react';
import AdminToast from '@/components/admin/AdminToast';

interface GalleryCmsClientProps {
  initialGallery: CmsGalleryItem[];
}

export default function GalleryCmsClient({ initialGallery }: GalleryCmsClientProps) {
  const [gallery, setGallery] = useState<CmsGalleryItem[]>(initialGallery);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<CmsGalleryItem>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  // Upload new images to gallery via Cloudinary
  const handleUploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    let successCount = 0;

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || 'Upload failed');

        const saveRes = await fetch('/api/admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'save_gallery_item',
            payload: {
              image_url: data.imageUrl,
              cloudinary_public_id: data.publicId,
              caption: file.name.replace(/\.[^/.]+$/, ''),
              alt_text: file.name.replace(/\.[^/.]+$/, ''),
              category: 'general',
              display_order: gallery.length + 1,
              is_active: true,
            },
          }),
        });
        const savedData = await saveRes.json();
        if (savedData.success) {
          setGallery((prev) => [...prev, savedData.data]);
          successCount++;
        }
      } catch (err: any) {
        showToast(err.message || 'Error uploading file', 'error');
      }
    }

    setIsUploading(false);
    if (successCount > 0) {
      showToast(`Uploaded ${successCount} image(s) to gallery`);
    }
    if (e.target) e.target.value = '';
  };

  // Reorder gallery
  const handleMove = async (index: number, direction: 'left' | 'right') => {
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= gallery.length) return;

    const list = [...gallery];
    const [moved] = list.splice(index, 1);
    list.splice(targetIdx, 0, moved);

    setGallery(list);

    try {
      const orderedIds = list.map((g) => g.id);
      await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reorder_gallery',
          payload: { orderedIds },
        }),
      });
      showToast('Gallery order updated');
    } catch (err: any) {
      showToast(err.message || 'Error updating order', 'error');
    }
  };

  // Toggle active
  const handleToggleActive = async (item: CmsGalleryItem) => {
    const newActive = !item.is_active;
    try {
      await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_gallery_item',
          payload: { ...item, is_active: newActive },
        }),
      });

      setGallery((prev) =>
        prev.map((g) => (g.id === item.id ? { ...g, is_active: newActive } : g))
      );
      showToast(`Image ${newActive ? 'activated' : 'hidden'}`);
    } catch (err: any) {
      showToast(err.message || 'Error updating item', 'error');
    }
  };

  // Delete image
  const handleDelete = async (item: CmsGalleryItem) => {
    if (!confirm('Are you sure you want to delete this gallery image? This will also purge it from Cloudinary.')) {
      return;
    }

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_gallery_item',
          payload: { id: item.id },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to delete');

      setGallery((prev) => prev.filter((g) => g.id !== item.id));
      showToast('Image deleted from gallery & Cloudinary');
    } catch (err: any) {
      showToast(err.message || 'Error deleting image', 'error');
    }
  };

  // Save metadata edit
  const handleSaveEdit = async (id: string) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_gallery_item',
          payload: { id, ...editForm },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to save');

      setGallery((prev) => prev.map((g) => (g.id === id ? { ...g, ...editForm } : g)));
      setEditingId(null);
      showToast('Image details saved');
    } catch (err: any) {
      showToast(err.message || 'Error saving details', 'error');
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
            Brand Media Gallery
          </h2>
          <p className="text-[13px] font-sans text-rajvi-offWhite/65 mt-1">
            Curate high-resolution atelier photography, facet close-ups, and diamond cut showcase media.
          </p>
        </div>

        <div>
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-rajvi-gold hover:bg-rajvi-goldLight text-rajvi-black font-semibold text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-sm">
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span>Upload Images to Gallery</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleUploadImages}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map((item, idx) => (
          <div
            key={item.id}
            className={`bg-[#181714] border rounded-sm overflow-hidden flex flex-col justify-between transition-all ${
              item.is_active ? 'border-rajvi-borderDark' : 'border-rajvi-borderDark/30 opacity-50'
            }`}
          >
            {/* Image Preview */}
            <div className="relative aspect-[4/3] w-full bg-[#0D0C0A]">
              <Image
                src={item.image_url}
                alt={item.alt_text || 'Gallery Image'}
                fill
                className="object-cover"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-sm bg-black/70 text-[10px] font-mono text-rajvi-gold">
                #{idx + 1}
              </span>
            </div>

            {/* Metadata Card */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              {editingId === item.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Caption"
                    value={editForm.caption || ''}
                    onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })}
                    className="w-full bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm px-2.5 py-1 text-white text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Alt text"
                    value={editForm.alt_text || ''}
                    onChange={(e) => setEditForm({ ...editForm, alt_text: e.target.value })}
                    className="w-full bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm px-2.5 py-1 text-white text-xs"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleSaveEdit(item.id)}
                      className="px-3 py-1 bg-rajvi-gold text-rajvi-black rounded-sm text-[11px] font-semibold"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-2.5 py-1 border border-rajvi-borderDark text-white/60 text-[11px]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-xs text-white/90 font-medium line-clamp-2">
                    {item.caption || 'No caption set'}
                  </p>
                  <p className="text-[11px] text-white/40 line-clamp-1">
                    Alt: {item.alt_text || '—'}
                  </p>
                </div>
              )}

              {/* Action Toolbar */}
              <div className="pt-3 border-t border-rajvi-borderDark/60 flex items-center justify-between text-white/60">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMove(idx, 'left')}
                    disabled={idx === 0}
                    className="p-1 hover:text-white disabled:opacity-20"
                    title="Move Left"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(idx, 'right')}
                    disabled={idx === gallery.length - 1}
                    className="p-1 hover:text-white disabled:opacity-20"
                    title="Move Right"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingId(item.id);
                      setEditForm({ caption: item.caption, alt_text: item.alt_text, category: item.category });
                    }}
                    className="p-1 hover:text-white"
                    title="Edit Caption & Alt"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleToggleActive(item)}
                    className="p-1 hover:text-white"
                    title={item.is_active ? 'Hide Image' : 'Show Image'}
                  >
                    {item.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-red-400" />}
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-1 text-red-400 hover:text-red-300"
                    title="Delete Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
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
