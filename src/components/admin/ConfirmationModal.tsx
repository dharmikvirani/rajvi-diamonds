'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />

      {/* Modal Dialog */}
      <div className="relative bg-[#1A1815] border border-rajvi-borderDark text-rajvi-offWhite max-w-md w-full p-6 rounded-sm shadow-luxuryDark z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-sm flex items-center justify-center ${
                isDestructive
                  ? 'bg-red-950/40 text-red-400 border border-red-800/40'
                  : 'bg-rajvi-charcoal text-rajvi-gold border border-rajvi-gold/30'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-normal text-rajvi-offWhite">
              {title}
            </h3>
          </div>

          <button
            onClick={onCancel}
            className="text-rajvi-offWhite/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-rajvi-offWhite/70 leading-relaxed mb-6">
          {message}
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-sm border border-rajvi-borderDark text-xs uppercase tracking-wider text-rajvi-offWhite/80 hover:bg-rajvi-charcoal transition-colors font-semibold"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2 rounded-sm text-xs uppercase tracking-wider font-semibold transition-colors ${
              isDestructive
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-rajvi-gold hover:bg-rajvi-goldLight text-rajvi-black'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
