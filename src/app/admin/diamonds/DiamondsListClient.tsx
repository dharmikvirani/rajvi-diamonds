'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Diamond } from '@/lib/types';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Sparkles,
  ExternalLink,
  Loader2,
  Gem,
} from 'lucide-react';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import { useToast } from '@/components/admin/AdminToast';

interface DiamondsListClientProps {
  initialDiamonds: Diamond[];
}

export default function DiamondsListClient({ initialDiamonds }: DiamondsListClientProps) {
  const { showToast } = useToast();
  const [diamonds, setDiamonds] = useState<Diamond[]>(initialDiamonds);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Diamond | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered = diamonds.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.shape.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = async (diamond: Diamond, field: 'is_active' | 'is_featured') => {
    setLoadingId(diamond.id);
    const updatedValue = !diamond[field];

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_diamond',
          payload: {
            ...diamond,
            [field]: updatedValue,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setDiamonds((prev) =>
          prev.map((d) => (d.id === diamond.id ? { ...d, [field]: updatedValue } : d))
        );
        const label = field === 'is_active' ? (updatedValue ? 'Active (Live)' : 'Disabled') : (updatedValue ? 'Featured on Showcase' : 'Unfeatured');
        showToast(`"${diamond.name}" set to ${label}.`, 'success');
      } else {
        throw new Error(data.error || 'Failed to update status');
      }
    } catch (err: any) {
      showToast(err.message || 'Status update error', 'error');
    } finally {
      setLoadingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_diamond',
          payload: { id: deleteTarget.id },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setDiamonds((prev) => prev.filter((d) => d.id !== deleteTarget.id));
        showToast(`"${deleteTarget.name}" permanently deleted.`, 'info');
      } else {
        throw new Error(data.error || 'Failed to delete diamond');
      }
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-rajvi-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search cuts by name or geometry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#1C1A17] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold transition-colors"
          />
        </div>

        <Link
          href="/admin/diamonds/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-rajvi-gold hover:bg-rajvi-goldLight text-rajvi-black text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Diamond Cut</span>
        </Link>
      </div>

      {/* Diamond Cut Records Table */}
      <div className="bg-[#181714] border border-rajvi-borderDark/80 rounded-sm overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1F1E1A] text-rajvi-offWhite/60 uppercase tracking-wider text-[10px] font-semibold">
              <tr>
                <th className="py-3 px-6">Cut / Image</th>
                <th className="py-3 px-6">Shape</th>
                <th className="py-3 px-6">Category</th>
                <th className="py-3 px-6">Color & Clarity</th>
                <th className="py-3 px-6">Sizes</th>
                <th className="py-3 px-6 text-center">Featured</th>
                <th className="py-3 px-6 text-center">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rajvi-borderDark/40 text-rajvi-offWhite/80">
              {filtered.map((diamond) => {
                const primaryImage =
                  diamond.images.find((i) => i.is_primary) || diamond.images[0];
                const activeSizesCount = diamond.sizes.filter((s) => s.is_available).length;

                return (
                  <tr key={diamond.id} className="hover:bg-rajvi-charcoal/30 transition-colors">
                    {/* Diamond Name & Thumb */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-sm overflow-hidden bg-rajvi-charcoal shrink-0 border border-rajvi-borderDark">
                          {primaryImage ? (
                            <Image
                              src={primaryImage.image_url}
                              alt={diamond.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-rajvi-muted">
                              No Img
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-serif text-sm font-normal text-rajvi-offWhite">
                            {diamond.name}
                          </div>
                          <span className="text-[11px] text-rajvi-muted block">
                            /{diamond.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Shape */}
                    <td className="py-3.5 px-6 font-medium">{diamond.shape}</td>

                    {/* Category */}
                    <td className="py-3.5 px-6 text-rajvi-goldLight text-[11px]">
                      {diamond.category?.name || 'Unassigned'}
                    </td>

                    {/* Color & Clarity */}
                    <td className="py-3.5 px-6">
                      <div className="flex flex-col gap-0.5 text-[11px]">
                        {diamond.color ? (
                          <span className="text-rajvi-gold">
                            Color: <strong className="text-rajvi-offWhite font-semibold">{diamond.color}</strong>
                          </span>
                        ) : (
                          <span className="text-rajvi-muted text-[10px]">No Color</span>
                        )}
                        {diamond.clarity ? (
                          <span className="text-rajvi-goldLight">
                            Clarity: <strong className="text-rajvi-offWhite font-semibold">{diamond.clarity}</strong>
                          </span>
                        ) : (
                          <span className="text-rajvi-muted text-[10px]">No Clarity</span>
                        )}
                      </div>
                    </td>

                    {/* Sizes Count */}
                    <td className="py-3.5 px-6">
                      <span className="text-[11px]">
                        {activeSizesCount} active ({diamond.sizes.length} total)
                      </span>
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-3.5 px-6 text-center">
                      <button
                        onClick={() => toggleStatus(diamond, 'is_featured')}
                        disabled={loadingId === diamond.id}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] uppercase font-semibold transition-colors ${
                          diamond.is_featured
                            ? 'bg-amber-950/40 text-amber-300 border border-amber-800/40'
                            : 'bg-rajvi-charcoal text-rajvi-muted border border-rajvi-borderDark'
                        }`}
                      >
                        <Sparkles className="w-3 h-3 text-rajvi-gold" />
                        <span>{diamond.is_featured ? 'Yes' : 'No'}</span>
                      </button>
                    </td>

                    {/* Active Status Toggle */}
                    <td className="py-3.5 px-6 text-center">
                      <button
                        onClick={() => toggleStatus(diamond, 'is_active')}
                        disabled={loadingId === diamond.id}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-[10px] uppercase font-semibold transition-colors ${
                          diamond.is_active
                            ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                            : 'bg-red-950/40 text-red-400 border border-red-800/40'
                        }`}
                      >
                        {diamond.is_active ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>Disabled</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <a
                          href={`/collections/${diamond.slug}`}
                          target="_blank"
                          title="Preview Live Page"
                          className="text-rajvi-muted hover:text-rajvi-gold transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>

                        <Link
                          href={`/admin/diamonds/${diamond.id}`}
                          title="Edit Diamond"
                          className="text-rajvi-offWhite/80 hover:text-rajvi-gold transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => setDeleteTarget(diamond)}
                          title="Delete Diamond"
                          className="text-red-400/80 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-16 px-6 text-center">
                    <div className="max-w-xs mx-auto flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-rajvi-charcoal flex items-center justify-center mb-3 text-rajvi-gold border border-rajvi-borderDark">
                        <Gem className="w-6 h-6" />
                      </div>
                      <h4 className="font-serif text-base text-rajvi-offWhite font-normal">
                        No diamond cuts found
                      </h4>
                      <p className="text-xs text-rajvi-muted mt-1 leading-relaxed">
                        {search
                          ? `No diamond cuts match "${search}". Try clearing your search.`
                          : 'No diamond cuts are recorded in your inventory yet.'}
                      </p>
                      {search && (
                        <button
                          type="button"
                          onClick={() => setSearch('')}
                          className="mt-3 text-xs text-rajvi-gold hover:text-rajvi-goldLight underline font-medium"
                        >
                          Clear Search Filter
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Diamond Cut"
        message={`Are you sure you want to permanently delete "${deleteTarget?.name}"? All associated gallery images and size records will be removed.`}
        confirmLabel="Delete Cut"
        isDestructive
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
