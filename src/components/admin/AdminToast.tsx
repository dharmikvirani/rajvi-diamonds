'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'success') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      setToasts((prev) => [...prev, { id, type, message }]);

      setTimeout(() => {
        removeToast(id);
      }, 4500);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          let borderClass = 'border-emerald-700/60 bg-[#161f18] text-emerald-200';
          let Icon = CheckCircle2;
          let iconColor = 'text-emerald-400';

          if (toast.type === 'error') {
            borderClass = 'border-red-800/60 bg-[#241313] text-red-200';
            Icon = AlertCircle;
            iconColor = 'text-red-400';
          } else if (toast.type === 'info') {
            borderClass = 'border-rajvi-gold/60 bg-[#1f1d16] text-rajvi-goldLight';
            Icon = Info;
            iconColor = 'text-rajvi-gold';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-4 rounded-sm border shadow-luxuryDark flex items-start justify-between gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200 ${borderClass}`}
            >
              <div className="flex items-start gap-2.5">
                <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${iconColor}`} />
                <p className="text-xs font-medium leading-relaxed">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-white/40 hover:text-white transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Graceful fallback if used outside provider
    return {
      showToast: (message: string) => {
        console.log('[Toast]:', message);
      },
    };
  }
  return context;
}
