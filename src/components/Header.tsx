'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export function Header() {
  const { totalCount, setIsCartOpen } = useCart();

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-ink text-acid font-mono text-[0.65rem] sm:text-xs font-bold tracking-[0.1em] sm:tracking-[0.12em] py-1.5 sm:py-2 px-3 text-center border-b border-ink/20">
        <div className="container-x flex items-center justify-center">
          <span className="sm:hidden truncate">★ LIVRAISON 100% GRATUITE PARTOUT (DAKAR & RÉGIONS) • COTON MERCERISÉ ★</span>
          <span className="hidden sm:inline">★ LIVRAISON 100% GRATUITE PARTOUT AU SÉNÉGAL (DAKAR 24H & RÉGIONS) • COTON MERCERISÉ 2 500 FCFA ★</span>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 w-full border-b border-ink/10 bg-canvas/85 backdrop-blur-xl transition-all duration-200">
        <div className="container-x flex h-16 sm:h-20 items-center justify-between">
          {/* Brand Identity */}
          <Link href="/" className="group flex items-center gap-2 sm:gap-3">
            <div className="relative h-9 w-9 sm:h-11 sm:w-11 overflow-hidden rounded-lg sm:rounded-xl border-2 border-ink bg-paper p-0.5 sm:p-1 shadow-[2px_2px_0_0_var(--color-ink)] transition-transform group-hover:scale-105">
              <Image
                src="/images/logo.png"
                alt="momoShop Logo"
                fill
                sizes="44px"
                className="object-contain p-0.5 sm:p-1"
                priority
              />
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-ink uppercase">
                momo<span className="text-coral">Shop</span>
              </span>
              <span className="rounded-full border border-ink bg-acid px-2 py-0.5 sm:px-2.5 font-mono text-[0.6rem] sm:text-[0.68rem] font-bold tracking-wider text-ink shadow-[1px_1px_0_0_var(--color-ink)] sm:shadow-[1.5px_1.5px_0_0_var(--color-ink)] uppercase">
                Sénégal 🇸🇳
              </span>
            </div>
          </Link>

          {/* Right Navigation & Cart Trigger */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <Link
              href="#catalogue"
              className="hidden sm:inline-flex font-mono text-xs font-bold tracking-wider uppercase text-ink hover:text-coral transition-colors"
            >
              Catalogue
            </Link>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label="Ouvrir le panier"
              className="group relative flex h-9 sm:h-11 items-center gap-1.5 sm:gap-2.5 rounded-full border-2 border-ink bg-paper px-2.5 sm:px-4 font-mono text-xs font-bold tracking-wider text-ink shadow-[2px_2px_0_0_var(--color-ink)] sm:shadow-[2.5px_2.5px_0_0_var(--color-ink)] transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--color-ink)] active:translate-y-0"
            >
              <svg className="w-4 h-4 sm:w-[18px] sm:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span>Panier</span>
              <span className="flex h-4.5 min-w-4.5 sm:h-5 sm:min-w-5 items-center justify-center rounded-full bg-coral px-1 font-mono text-[0.65rem] sm:text-[0.7rem] font-black text-white">
                {totalCount}
              </span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
