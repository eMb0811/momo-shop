'use client';

import React from 'react';
import { whatsappUrl } from '@/lib/shop';
import { trackEvent } from '@/lib/tracker';

export function FloatingWhatsApp() {
  const url = whatsappUrl(
    'Bonjour momoShop ! Je souhaite des informations sur vos t-shirts en coton mercerisé.'
  );

  return (
    <aside
      aria-label="Contact WhatsApp Direct"
      className="fixed bottom-3.5 right-3.5 sm:bottom-6 sm:right-6 z-40 flex items-center"
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent({ type: 'whatsapp_floating_click' })}
        aria-label="Contacter momoShop sur WhatsApp"
        className="group relative flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full border-2 border-ink bg-whatsapp text-ink shadow-[3px_3px_0_0_var(--color-ink)] sm:shadow-[4px_4px_0_0_var(--color-ink)] transition-transform duration-200 hover:scale-110 active:scale-95"
      >
        {/* Pulse effect */}
        <span className="absolute inset-0 rounded-full bg-whatsapp opacity-75 animate-ping-slow pointer-events-none" />

        {/* WhatsApp Icon */}
        <svg
          className="relative z-10 w-6 h-6 sm:w-8 sm:h-8"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.772.84 2.791.84 3.184 0 5.77-2.587 5.77-5.766.001-3.182-2.585-5.766-5.77-5.766zm9.969 5.766c0 5.518-4.482 10-10 10-1.745 0-3.376-.452-4.805-1.242l-7.195 1.886 1.921-7.017c-.86-1.468-1.353-3.181-1.353-5.008 0-5.518 4.482-10 10-10 5.518 0 10 4.482 10 10z" />
        </svg>

        {/* Notification Badge */}
        <span className="absolute -top-1 -right-1 z-20 flex h-4.5 w-4.5 sm:h-5 sm:w-5 items-center justify-center rounded-full border border-ink bg-coral font-mono text-[0.6rem] sm:text-[0.65rem] font-black text-white">
          1
        </span>

        {/* Tooltip */}
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-xl border-2 border-ink bg-paper px-3 py-1.5 font-mono text-xs font-bold text-ink opacity-0 shadow-[2px_2px_0_0_var(--color-ink)] transition-opacity duration-200 group-hover:opacity-100 hidden sm:inline-block">
          Discuter sur WhatsApp
        </span>
      </a>
    </aside>
  );
}
