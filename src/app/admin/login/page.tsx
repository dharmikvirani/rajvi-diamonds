'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please provide your administrator email and password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed. Please verify credentials.');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#11100E] flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-[#181714] border border-rajvi-borderDark/80 p-8 sm:p-10 rounded-sm shadow-luxuryDark">
        {/* Brand Logo */}
        <div className="text-center mb-8">
          <div className="relative h-12 w-44 mx-auto mb-4">
            <Image
              src="/rajvi-diamonds-logo.jpg"
              alt="Rajvi Diamonds"
              width={1280}
              height={853}
              priority
              className="object-contain h-full w-auto mx-auto"
            />
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-rajvi-gold font-semibold block">
            Authorized Personnel Only
          </span>
          <h2 className="font-serif text-xl sm:text-2xl text-rajvi-offWhite font-normal mt-1">
            Management Portal
          </h2>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-sm bg-red-950/40 border border-red-800/50 flex items-start gap-3 text-red-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-rajvi-offWhite/80 font-semibold mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-rajvi-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="admin@rajvidiamonds.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite placeholder:text-rajvi-muted focus:outline-none focus:border-rajvi-gold transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-rajvi-offWhite/80 font-semibold mb-1.5">
              Secret Passkey
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-rajvi-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#1F1E1A] border border-rajvi-borderDark rounded-sm text-xs text-rajvi-offWhite placeholder:text-rajvi-muted focus:outline-none focus:border-rajvi-gold transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-6 bg-rajvi-gold hover:bg-rajvi-goldLight text-rajvi-black text-xs uppercase tracking-widest font-semibold rounded-sm transition-all shadow-goldGlow disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Access Admin Portal</span>
              </>
            )}
          </button>
        </form>

        {/* Demo credentials hint for development */}
        <div className="mt-8 pt-6 border-t border-rajvi-borderDark/60 text-center">
          <p className="text-[11px] text-rajvi-muted mb-2">
            Local Development Access:
          </p>
          <div className="inline-block p-2.5 bg-[#141311] border border-rajvi-borderDark/60 rounded text-[11px] font-mono text-rajvi-goldLight select-all">
            admin@rajvidiamonds.com / RajviLuxurySecure2024!
          </div>
        </div>
      </div>
    </div>
  );
}
