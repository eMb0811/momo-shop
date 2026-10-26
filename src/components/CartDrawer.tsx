'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { cartOrderMessage, formatPrice, whatsappUrl } from '@/lib/shop';

export function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQty, removeFromCart, totalCount, totalPrice } = useCart();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCartOpen(false);
    };
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const handleGroupedWhatsAppOrder = () => {
    if (cart.length === 0) return;
    const msg = cartOrderMessage(cart);
    window.open(whatsappUrl(msg), '_blank');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex justify-end"
    >
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-ink/70 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over Drawer */}
      <div className="relative z-10 flex h-full w-full max-w-md flex-col border-l-2 border-ink bg-paper shadow-2xl animate-in slide-in-from-right duration-250">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b-2 border-ink bg-canvas px-4 sm:px-6 py-3.5 sm:py-5">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <h3 className="font-display text-lg sm:text-xl font-extrabold text-ink uppercase tracking-tight">
              Mon Panier
            </h3>
            <span className="rounded-full bg-coral px-2 sm:px-2.5 py-0.5 font-mono text-[0.7rem] sm:text-xs font-bold text-white">
              {totalCount}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            aria-label="Fermer le panier"
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-ink/20 text-ink hover:bg-paper transition-colors text-xs sm:text-sm"
          >
            ✕
          </button>
        </div>

        {/* Drawer Body (Items List) */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-3 sm:space-y-4">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-ink bg-canvas shadow-pop mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <p className="font-display text-lg font-bold text-ink">Votre panier est vide</p>
              <p className="mt-1 text-xs text-muted max-w-xs">
                Sélectionnez vos t-shirts dans le catalogue pour composer votre commande.
              </p>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="btn-ink mt-6 text-xs"
              >
                Explorer le catalogue ↓
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.key}
                className="flex gap-4 rounded-2xl border border-ink/15 bg-canvas/40 p-3.5 transition-all hover:border-ink/30"
              >
                {/* Thumbnail */}
                <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl border border-ink/20 bg-studio">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-cover object-top"
                  />
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-display text-sm font-bold text-ink uppercase">
                        {item.name}
                      </h4>
                      <p className="font-mono text-[0.72rem] text-muted">
                        Taille : <strong className="text-coral">{item.size}</strong> • {item.colorName}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.key)}
                      aria-label="Supprimer cet article"
                      className="text-muted hover:text-coral transition-colors text-sm p-1"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {/* Qty buttons */}
                    <div className="flex items-center gap-2 rounded-lg border border-ink/20 bg-paper px-2 py-0.5">
                      <button
                        type="button"
                        onClick={() => updateQty(item.key, -1)}
                        className="font-bold text-ink hover:text-coral px-1 text-xs"
                      >
                        −
                      </button>
                      <span className="font-mono text-xs font-bold text-ink min-w-4 text-center">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.key, 1)}
                        className="font-bold text-ink hover:text-coral px-1 text-xs"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-display text-sm font-extrabold text-ink">
                      {formatPrice(item.unitPrice * item.qty)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="border-t-2 border-ink bg-canvas p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-xs font-bold text-muted uppercase tracking-wider">
                Total ({totalCount} articles)
              </span>
              <span className="font-display text-xl sm:text-2xl font-black text-ink">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleGroupedWhatsAppOrder}
              className="btn-whatsapp w-full min-h-[2.6rem] sm:min-h-[3rem] text-xs sm:text-sm py-2 px-3 sm:px-6"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.772.84 2.791.84 3.184 0 5.77-2.587 5.77-5.766.001-3.182-2.585-5.766-5.77-5.766zm9.969 5.766c0 5.518-4.482 10-10 10-1.745 0-3.376-.452-4.805-1.242l-7.195 1.886 1.921-7.017c-.86-1.468-1.353-3.181-1.353-5.008 0-5.518 4.482-10 10-10 5.518 0 10 4.482 10 10z"/>
              </svg>
              <span>Commander tout sur WhatsApp</span>
            </button>

            <p className="text-center font-mono text-[0.65rem] sm:text-[0.68rem] text-muted">
              Paiement à la livraison • Échange direct avec notre service client
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
