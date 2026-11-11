'use client';

import React, { useEffect } from 'react';
import { trackClientError } from '@/lib/tracker';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    trackClientError({
      message: error.message || 'Erreur rendu Next.js',
      stack: error.stack,
    });
  }, [error]);

  return (
    <div className="min-h-screen bg-canvas text-ink flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-3xl border-2 border-ink bg-paper p-8 shadow-pop text-center">
        <div className="eyebrow mx-auto mb-3">INCIDENT TECHNIQUE</div>
        <h1 className="font-display text-2xl sm:text-3xl font-black uppercase text-ink">
          Une erreur est survenue
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
          Notre système de monitoring a automatiquement enregistré cet incident. Vous pouvez réessayer ou revenir à l&apos;accueil.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="btn-ink text-xs"
          >
            Réessayer
          </button>
          <a href="/" className="btn-ghost text-xs">
            Retour à la boutique
          </a>
        </div>
      </div>
    </div>
  );
}
