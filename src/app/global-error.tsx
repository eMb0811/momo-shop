'use client';

import React, { useEffect } from 'react';
import { trackClientError } from '@/lib/tracker';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    trackClientError({
      message: `GlobalError: ${error.message || 'Erreur critique'}`,
      stack: error.stack,
    });
  }, [error]);

  return (
    <html lang="fr">
      <body className="min-h-screen bg-[#f6f4ee] text-[#111111] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full rounded-3xl border-2 border-[#111111] bg-white p-8 text-center">
          <h1 className="text-2xl font-black uppercase">Erreur Critique</h1>
          <p className="mt-2 text-sm text-gray-600">
            Une erreur inattendue s&apos;est produite. L&apos;incident a été transmis au système de monitoring momoShop.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="mt-6 rounded-xl border-2 border-[#111111] bg-[#111111] px-5 py-2.5 text-xs font-bold uppercase text-white"
          >
            Recharger l&apos;application
          </button>
        </div>
      </body>
    </html>
  );
}
