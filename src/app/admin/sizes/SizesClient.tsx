'use client';

import React, { useState } from 'react';
import { Diamond, DiamondSize } from '@/lib/types';
import { Ruler, Plus, Trash2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { formatSizeMm } from '@/lib/utils';

interface SizesClientProps {
  diamonds: Diamond[];
}

export default function SizesClient({ diamonds }: SizesClientProps) {
  const [selectedDiamondId, setSelectedDiamondId] = useState<string>(
    diamonds[0]?.id || ''
  );
  const [diamondsState, setDiamondsState] = useState<Diamond[]>(diamonds);
  const [newSizeValue, setNewSizeValue] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const currentDiamond = diamondsState.find((d) => d.id === selectedDiamondId);

  const handleAddSize = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const val = parseFloat(newSizeValue);
    if (isNaN(val) || val <= 0) {
      setErrorMessage('Please enter a valid positive decimal or integer millimeter value (e.g. 4.5).');
      return;
    }

    if (currentDiamond?.sizes.some((s) => Math.abs(s.size_mm - val) < 0.001)) {
      setErrorMessage(`Size ${val} mm already exists for ${currentDiamond.name}.`);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_size',
          payload: {
            diamondId: selectedDiamondId,
            sizeData: {
              size_mm: val,
              is_available: true,
            },
          },
        }),
      });

      const resJson = await res.json();
      if (!res.ok || !resJson.success) {
        throw new Error(resJson.error || 'Failed to add size');
      }

      setDiamondsState((prev) =>
        prev.map((d) => {
          if (d.id === selectedDiamondId) {
            const updated = [...d.sizes, resJson.data].sort((a, b) => a.size_mm - b.size_mm);
            return { ...d, sizes: updated };
          }
          return d;
        })
      );

      setNewSizeValue('');
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailable = async (size: DiamondSize) => {
    try {
      const updatedAvail = !size.is_available;
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_size',
          payload: {
            diamondId: selectedDiamondId,
            sizeData: {
              ...size,
              is_available: updatedAvail,
            },
          },
        }),
      });

      const resJson = await res.json();
      if (resJson.success) {
        setDiamondsState((prev) =>
          prev.map((d) => {
            if (d.id === selectedDiamondId) {
              return {
                ...d,
                sizes: d.sizes.map((s) => (s.id === size.id ? { ...s, is_available: updatedAvail } : s)),
              };
            }
            return d;
          })
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSize = async (sizeId: string) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_size',
          payload: {
            diamondId: selectedDiamondId,
            sizeId,
          },
        }),
      });

      const resJson = await res.json();
      if (resJson.success) {
        setDiamondsState((prev) =>
          prev.map((d) => {
            if (d.id === selectedDiamondId) {
              return {
                ...d,
                sizes: d.sizes.filter((s) => s.id !== sizeId),
              };
            }
            return d;
          })
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-rajvi-borderDark/60">
        <span className="text-[10px] uppercase tracking-widest text-rajvi-gold font-semibold block">
          Lapidary Calibrations
        </span>
        <h2 className="font-serif text-2xl font-normal text-rajvi-offWhite">
          Size & Millimeter Dimension Management
        </h2>
        <p className="text-xs text-rajvi-offWhite/60 mt-1">
          Configure available millimeter size tiers per fancy cut. Supports decimal measurements (e.g. 4.5 mm, 5.5 mm).
        </p>
      </div>

      {/* Select Diamond Cut Selector */}
      <div className="bg-[#181714] border border-rajvi-borderDark/80 p-6 rounded-sm shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-rajvi-offWhite/80 font-semibold mb-1">
            Selected Diamond Cut
          </label>
          <select
            value={selectedDiamondId}
            onChange={(e) => setSelectedDiamondId(e.target.value)}
            className="px-3.5 py-2 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold font-serif min-w-[240px]"
          >
            {diamondsState.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.sizes.length} sizes configured)
              </option>
            ))}
          </select>
        </div>

        {currentDiamond && (
          <div className="text-right">
            <span className="text-xs text-rajvi-gold block font-serif">
              {currentDiamond.shape}
            </span>
            <span className="text-[11px] text-rajvi-muted">
              {currentDiamond.sizes.filter((s) => s.is_available).length} active sizes currently live
            </span>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-950/40 border border-red-800 text-red-300 rounded-sm text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Two Column Layout: Existing Sizes Table & Add Size Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Table of Sizes */}
        <div className="lg:col-span-8 bg-[#181714] border border-rajvi-borderDark/80 rounded-sm overflow-hidden shadow-sm">
          <div className="p-4 border-b border-rajvi-borderDark/60 flex items-center justify-between">
            <h3 className="font-serif text-base text-rajvi-offWhite font-normal">
              Configured Sizes for {currentDiamond?.name}
            </h3>
            <span className="text-[11px] text-rajvi-muted font-mono">
              Total: {currentDiamond?.sizes.length || 0}
            </span>
          </div>

          {currentDiamond && currentDiamond.sizes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1F1E1A] text-rajvi-offWhite/60 uppercase tracking-wider text-[10px] font-semibold">
                  <tr>
                    <th className="py-3 px-6">Size (mm)</th>
                    <th className="py-3 px-6">Measurement Note</th>
                    <th className="py-3 px-6 text-center">Live Availability</th>
                    <th className="py-3 px-6 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rajvi-borderDark/40 text-rajvi-offWhite/80">
                  {currentDiamond.sizes.map((size) => (
                    <tr key={size.id} className="hover:bg-rajvi-charcoal/30 transition-colors">
                      <td className="py-3.5 px-6 font-semibold font-serif text-sm text-rajvi-goldLight">
                        {formatSizeMm(size.size_mm)}
                      </td>
                      <td className="py-3.5 px-6 text-rajvi-offWhite/60 text-[11px]">
                        Exact calibrated diameter
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleAvailable(size)}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-[10px] uppercase font-semibold transition-colors ${
                            size.is_available
                              ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                              : 'bg-red-950/40 text-red-400 border border-red-800/40'
                          }`}
                        >
                          {size.is_available ? (
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
                      <td className="py-3.5 px-6 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteSize(size.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                          title="Delete Size"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-rajvi-muted">
              No calibrated sizes recorded for {currentDiamond?.name}. Use the form on the right to add millimeter sizes.
            </div>
          )}
        </div>

        {/* Add Size Form */}
        <div className="lg:col-span-4 bg-[#181714] border border-rajvi-borderDark/80 p-6 rounded-sm shadow-sm space-y-4 h-fit">
          <div className="flex items-center gap-2 border-b border-rajvi-borderDark/60 pb-3">
            <Ruler className="w-4 h-4 text-rajvi-gold" />
            <h3 className="font-serif text-base text-rajvi-offWhite font-normal">
              Add Calibrated Size
            </h3>
          </div>

          <form onSubmit={handleAddSize} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-rajvi-offWhite/80 font-semibold mb-1">
                Size Value (mm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="50"
                placeholder="e.g. 4.5, 5, 5.5, 6"
                value={newSizeValue}
                onChange={(e) => setNewSizeValue(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite focus:outline-none focus:border-rajvi-gold font-mono"
              />
              <span className="text-[10px] text-rajvi-muted mt-1 block">
                Supports decimal increments (e.g. 4.5 mm)
              </span>
            </div>

            <button
              type="submit"
              disabled={loading || !currentDiamond}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-rajvi-gold hover:bg-rajvi-goldLight text-rajvi-black font-semibold text-xs uppercase tracking-wider rounded-sm transition-colors shadow-goldGlow disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{loading ? 'Adding Size...' : `Add Size to ${currentDiamond?.name}`}</span>
            </button>
          </form>

          <div className="p-3 bg-[#1F1E1A] border border-rajvi-borderDark/60 rounded-sm text-[11px] text-rajvi-muted leading-relaxed">
            Note: As per brand guidelines, sizes are not preselected automatically on client-facing product pages to ensure availability is verified with the workshop.
          </div>
        </div>
      </div>
    </div>
  );
}
