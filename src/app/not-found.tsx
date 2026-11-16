import React from 'react';
import Image from 'next/image';
import { ArrowLeft, Home, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-rajvi-black text-rajvi-offWhite flex flex-col items-center justify-center p-6 text-center">
      {/* Brand Logo */}
      <div className="relative h-14 w-48 mb-8">
        <Image
          src="/rajvi-diamonds-logo.jpg"
          alt="Rajvi Diamonds"
          width={1280}
          height={853}
          priority
          className="object-contain h-full w-auto mx-auto"
        />
      </div>

      <div className="max-w-md mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rajvi-gold/30 bg-rajvi-charcoal text-rajvi-gold text-xs uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Page Not Found</span>
        </div>

        <h1 className="font-serif text-5xl sm:text-6xl font-normal text-rajvi-offWhite">
          404
        </h1>

        <p className="text-sm text-rajvi-offWhite/70 leading-relaxed">
          The diamond cut or showcase page you are seeking could not be found or has been moved to our archive.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <a
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-rajvi-gold text-rajvi-black font-semibold text-xs uppercase tracking-widest hover:bg-rajvi-goldLight transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </a>

          <a
            href="/collections"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 border border-rajvi-gold/60 text-rajvi-gold hover:bg-rajvi-gold hover:text-rajvi-black font-semibold text-xs uppercase tracking-widest transition-colors"
          >
            <span>Browse Catalogue</span>
          </a>
        </div>
      </div>
    </div>
  );
}
