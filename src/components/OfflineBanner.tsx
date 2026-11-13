'use client';

import React, { useEffect, useState } from 'react';

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Check initial online status on mount
    if (typeof navigator !== 'undefined') {
      setIsOffline(!navigator.onLine);
    }

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) {
    return null;
  }

  return (
    <aside
      role="status"
      aria-live="polite"
      className="fixed top-3 left-1/2 z-[100] -translate-x-1/2 flex items-center gap-2.5 rounded-full border border-line bg-ink px-4 py-2 text-xs font-mono font-semibold tracking-wide text-paper shadow-pop transition-all sm:text-sm"
    >
      <span className="relative flex h-2.5 w-2.5 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-acid opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-acid" />
      </span>
      <span>📡 Mode hors-ligne • Panier conservé localement</span>
    </aside>
  );
}
