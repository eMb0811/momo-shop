'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { whatsappUrl } from '@/lib/shop';
import { trackEvent } from '@/lib/tracker';

export function MobileBottomNav() {
  const { totalCount, setIsCartOpen } = useCart();

  const handleScrollToTop = () => {
    if (typeof window === 'undefined') return;
    if (window.location.pathname !== '/') {
      window.location.href = '/';
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToCatalogue = () => {
    if (typeof window === 'undefined') return;
    if (window.location.pathname !== '/') {
      window.location.href = '/#catalogue';
      return;
    }
    const catalogueEl = document.getElementById('catalogue');
    if (catalogueEl) {
      catalogueEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.hash = 'catalogue';
    }
  };

  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  const handleWhatsApp = () => {
    trackEvent({ type: 'whatsapp_floating_click' });
    const url = whatsappUrl(
      'Bonjour momoShop ! J’aimerais avoir des renseignements sur vos t-shirts en coton mercerisé.'
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <nav
      aria-label="Navigation mobile principale"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-paper/95 backdrop-blur-md border-t-2 border-ink pb-[calc(0.4rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_12px_rgba(13,13,17,0.06)]"
    >
      <div className="grid grid-cols-4 items-center justify-around px-2">
        {/* 1. Accueil */}
        <button
          type="button"
          onClick={handleScrollToTop}
          className="group flex flex-col items-center justify-center gap-1 py-1 text-ink transition-transform duration-150 active:scale-95 focus:outline-none"
          aria-label="Retour à l'accueil"
        >
          <div className="flex h-6 w-6 items-center justify-center">
            <svg
              className="h-5 w-5 transition-colors group-hover:text-coral"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
          <span className="font-mono text-[0.65rem] font-bold tracking-tight uppercase">
            Accueil
          </span>
        </button>

        {/* 2. Catalogue */}
        <button
          type="button"
          onClick={handleScrollToCatalogue}
          className="group flex flex-col items-center justify-center gap-1 py-1 text-ink transition-transform duration-150 active:scale-95 focus:outline-none"
          aria-label="Voir le catalogue des t-shirts"
        >
          <div className="flex h-6 w-6 items-center justify-center">
            <svg
              className="h-5 w-5 transition-colors group-hover:text-coral"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
          </div>
          <span className="font-mono text-[0.65rem] font-bold tracking-tight uppercase">
            Catalogue
          </span>
        </button>

        {/* 3. Panier */}
        <button
          type="button"
          onClick={handleOpenCart}
          className="group relative flex flex-col items-center justify-center gap-1 py-1 text-ink transition-transform duration-150 active:scale-95 focus:outline-none"
          aria-label={`Ouvrir le panier, ${totalCount} article${totalCount > 1 ? 's' : ''}`}
        >
          <div className="relative flex h-6 w-6 items-center justify-center">
            <svg
              className="h-5 w-5 transition-colors group-hover:text-coral"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {totalCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full border border-ink bg-coral px-1 font-mono text-[0.58rem] font-black text-white shadow-[1px_1px_0_0_var(--color-ink)]">
                {totalCount}
              </span>
            )}
          </div>
          <span className="font-mono text-[0.65rem] font-bold tracking-tight uppercase">
            Panier
          </span>
        </button>

        {/* 4. WhatsApp Concierge */}
        <button
          type="button"
          onClick={handleWhatsApp}
          className="group flex flex-col items-center justify-center gap-1 py-1 text-ink transition-transform duration-150 active:scale-95 focus:outline-none"
          aria-label="Contacter momoShop sur WhatsApp"
        >
          <div className="flex h-6 w-6 items-center justify-center text-whatsapp">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.772.84 2.791.84 3.184 0 5.77-2.587 5.77-5.766.001-3.182-2.585-5.766-5.77-5.766zm9.969 5.766c0 5.518-4.482 10-10 10-1.745 0-3.376-.452-4.805-1.242l-7.195 1.886 1.921-7.017c-.86-1.468-1.353-3.181-1.353-5.008 0-5.518 4.482-10 10-10 5.518 0 10 4.482 10 10z" />
            </svg>
          </div>
          <span className="font-mono text-[0.65rem] font-bold tracking-tight uppercase text-ink">
            WhatsApp
          </span>
        </button>
      </div>
    </nav>
  );
}