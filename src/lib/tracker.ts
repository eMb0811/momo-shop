'use client';

import type { CategoryFilter, Size } from './types';
import type { MonitoringEventType } from './monitoring';

export interface TrackEventPayload {
  type: MonitoringEventType;
  productId?: string;
  productName?: string;
  colorName?: string;
  colorHex?: string;
  size?: Size;
  qty?: number;
  amountCfa?: number;
  category?: CategoryFilter;
  itemsCount?: number;
}

export function trackEvent(payload: TrackEventPayload): void {
  if (typeof window === 'undefined') return;

  const data = JSON.stringify({
    ...payload,
    referrer: document.referrer || undefined,
    path: window.location.pathname,
  });

  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([data], { type: 'application/json' });
      const queued = navigator.sendBeacon('/api/monitoring/track', blob);
      if (queued) return;
    }

    void fetch('/api/monitoring/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data,
      keepalive: true,
    }).catch(() => {
      // Fail silently on tracking errors to never impact storefront UX
    });
  } catch {
    // Ignore client-side network failures
  }
}

export function trackClientError(error: {
  message: string;
  stack?: string;
  url?: string;
}): void {
  if (typeof window === 'undefined') return;

  try {
    void fetch('/api/monitoring/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kind: 'error',
        message: error.message,
        stack: error.stack,
        url: error.url ?? window.location.href,
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}
