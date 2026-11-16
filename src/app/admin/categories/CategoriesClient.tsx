'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Category } from '@/lib/types';
import { Plus, Edit, Trash2, CheckCircle, XCircle, Save, X, Loader2 } from 'lucide-react';
import ConfirmationModal from '@/components/admin/ConfirmationModal';

interface CategoriesClientProps {
  initialCategories: Category[];
}

export default function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenNew = () => {
    setEditingCategory({
      name: '',
      slug: '',
      description: '',
      image_url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80',
      is_active: true,
      display_order: categories.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory({ ...cat });
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    if (!editingCategory) return;
    setEditingCategory({
      ...editingCategory,
      name: val,
      slug: editingCategory.id
        ? editingCategory.slug
        : val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    });
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_category',
          payload: editingCategory,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (editingCategory.id) {
          setCategories((prev) =>
            prev.map((c) => (c.id === editingCategory.id ? data.data : c))
          );
        } else {
          setCategories((prev) => [...prev, data.data]);
        }
        setIsModalOpen(false);
        setEditingCategory(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_category',
          payload: { id: deleteTarget.id },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-rajvi-borderDark/60">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-rajvi-gold font-semibold block">
            Classification
          </span>
          <h2 className="font-serif text-2xl font-normal text-rajvi-offWhite">
            Cut Categories
          </h2>
        </div>

        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-rajvi-gold hover:bg-rajvi-goldLight text-rajvi-black font-semibold text-xs uppercase tracking-wider rounded-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-[#181714] border border-rajvi-borderDark/80 rounded-sm overflow-hidden flex flex-col justify-between shadow-sm"
          >
            <div className="relative aspect-[16/9] w-full bg-[#1F1E1A]">
              {cat.image_url && (
                <Image
                  src={cat.image_url}
                  alt={cat.name}
                  fill
                  className="object-cover"
                />
              )}
              <div className="absolute top-3 right-3">
                <span
                  className={`px-2 py-0.5 rounded-sm text-[10px] uppercase font-semibold ${
                    cat.is_active
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 backdrop-blur-sm'
                      : 'bg-red-950/80 text-red-400 border border-red-800/40 backdrop-blur-sm'
                  }`}
                >
                  {cat.is_active ? 'Active' : 'Disabled'}
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-rajvi-gold font-semibold">
                  Order #{cat.display_order}
                </span>
                <h3 className="font-serif text-xl text-rajvi-offWhite font-normal mt-1">
                  {cat.name}
                </h3>
                <span className="text-xs text-rajvi-muted font-mono block mb-2">
                  /{cat.slug}
                </span>
                <p className="text-xs text-rajvi-offWhite/70 leading-relaxed line-clamp-3">
                  {cat.description}
                </p>
              </div>

              <div className="pt-4 border-t border-rajvi-borderDark/60 flex items-center justify-end gap-3 text-xs">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="inline-flex items-center gap-1.5 text-rajvi-gold hover:text-rajvi-goldLight font-medium"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => setDeleteTarget(cat)}
                  className="inline-flex items-center gap-1.5 text-red-400 hover:text-red-300 font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {isModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative bg-[#1A1815] border border-rajvi-borderDark text-rajvi-offWhite max-w-lg w-full p-6 sm:p-8 rounded-sm shadow-luxuryDark z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-rajvi-borderDark/60 mb-6">
              <h3 className="font-serif text-xl font-normal text-rajvi-offWhite">
                {editingCategory.id ? 'Edit Category' : 'Create Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-rajvi-offWhite/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-rajvi-offWhite/80 font-semibold mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Geometric Fancy Cuts"
                  value={editingCategory.name || ''}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-rajvi-offWhite/80 font-semibold mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={editingCategory.slug || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite font-mono focus:outline-none focus:border-rajvi-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-rajvi-offWhite/80 font-semibold mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-rajvi-offWhite/80 font-semibold mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={editingCategory.image_url || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, image_url: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-rajvi-offWhite/80 font-semibold mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editingCategory.display_order ?? 1}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        display_order: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={editingCategory.is_active ?? true}
                      onChange={(e) =>
                        setEditingCategory({ ...editingCategory, is_active: e.target.checked })
                      }
                      className="rounded border-rajvi-borderDark text-rajvi-gold focus:ring-rajvi-gold h-4 w-4"
                    />
                    <span className="text-xs font-medium text-rajvi-offWhite">
                      Active
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-rajvi-borderDark/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-rajvi-borderDark text-xs uppercase tracking-wider text-rajvi-offWhite/70 hover:bg-rajvi-charcoal font-semibold rounded-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-rajvi-gold hover:bg-rajvi-goldLight text-rajvi-black font-semibold text-xs uppercase tracking-wider rounded-sm transition-colors shadow-goldGlow disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Category"
        message={`Are you sure you want to delete the category "${deleteTarget?.name}"? Any diamonds in this category will become unassigned.`}
        confirmLabel="Delete Category"
        isDestructive
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
