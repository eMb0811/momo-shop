'use client';

import React, { useState } from 'react';
import type { Product, Size } from '@/lib/types';
import { formatPrice, productOrderMessage, whatsappUrl } from '@/lib/shop';
import { trackEvent } from '@/lib/tracker';
import { SizeGuideModal } from '@/components/SizeGuideModal';
import { useCart } from '@/context/CartContext';

interface ProductOrderBoxProps {
  product: Product;
}

export function ProductOrderBox({ product }: ProductOrderBoxProps) {
  const [selectedSize, setSelectedSize] = useState<Size>('M');
  const [qty, setQty] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  // Safely access CartContext if available
  let cartContext: ReturnType<typeof useCart> | null = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    cartContext = useCart();
  } catch {
    cartContext = null;
  }

  const currentStock = product.stock[selectedSize] ?? 10;
  const isOutOfStock = currentStock === 0;
  const isLowStock = currentStock > 0 && currentStock <= 5;

  const handleWhatsAppOrder = () => {
    trackEvent({
      type: 'whatsapp_product_order',
      productId: product.id,
      productName: product.name,
      colorName: product.color.name,
      colorHex: product.color.hex,
      size: selectedSize,
      qty,
      amountCfa: product.price_cfa * qty,
    });
    const message = productOrderMessage(product, selectedSize, qty);
    window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer');
  };

  const handleAddToCart = () => {
    if (cartContext?.addToCart) {
      cartContext.addToCart(product, selectedSize, qty);
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 2500);
    } else {
      // Fallback directly to WhatsApp order if cart provider is absent
      handleWhatsAppOrder();
    }
  };

  return (
    <div className="space-y-6">
      {/* Price Block */}
      <div className="rounded-2xl border-2 border-ink bg-paper p-5 shadow-pop">
        <div className="flex items-baseline justify-between border-b border-ink/10 pb-3">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl sm:text-4xl font-black text-ink">
              {formatPrice(product.price_cfa * qty)}
            </span>
            {qty > 1 && (
              <span className="font-mono text-xs text-muted">
                ({formatPrice(product.price_cfa)} / unité)
              </span>
            )}
          </div>
          <span className="rounded-full border border-ink/20 bg-acid/40 px-3 py-1 font-mono text-xs font-bold uppercase text-ink">
            En Stock
          </span>
        </div>

        {/* Size Selection */}
        <div className="mt-5">
          <div className="flex items-center justify-between font-mono text-xs font-semibold text-ink mb-2.5">
            <span>
              Taille sélectionnée : <strong className="text-coral uppercase">{selectedSize}</strong>
            </span>
            <button
              type="button"
              onClick={() => setIsSizeGuideOpen(true)}
              className="text-coral hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              Guide des tailles ↗
            </button>
          </div>

          <div className="grid grid-cols-6 gap-2">
            {product.sizes.map((size) => {
              const isSelected = size === selectedSize;
              const sizeStock = product.stock[size] ?? 0;
              const isSizeEmpty = sizeStock === 0;

              return (
                <button
                  key={size}
                  type="button"
                  disabled={isSizeEmpty}
                  onClick={() => setSelectedSize(size)}
                  className={`flex h-11 items-center justify-center rounded-xl border-2 font-mono text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'border-ink bg-ink text-white shadow-[2px_2px_0_0_var(--color-coral)] scale-105'
                      : isSizeEmpty
                      ? 'border-dashed border-ink/20 text-muted opacity-40 cursor-not-allowed'
                      : 'border-ink/20 bg-canvas text-ink hover:border-ink hover:bg-paper'
                  }`}
                  aria-label={`Taille ${size}${isSizeEmpty ? ' (épuisée)' : ''}`}
                >
                  {size}
                </button>
              );
            })}
          </div>

          {/* Stock indicator */}
          <div className="mt-2.5 flex items-center gap-2 font-mono text-xs">
            {isOutOfStock ? (
              <span className="text-coral font-bold">✕ Rupture de stock en taille {selectedSize}</span>
            ) : isLowStock ? (
              <span className="text-coral font-semibold">
                ⚠️ Plus que {currentStock} pièces disponibles en taille {selectedSize}
              </span>
            ) : (
              <span className="text-muted">
                ✓ Taille {selectedSize} disponible pour expédition immédiate
              </span>
            )}
          </div>
        </div>

        {/* Quantity Picker */}
        <div className="mt-5 flex items-center justify-between rounded-xl border border-ink/15 bg-canvas/60 p-3">
          <span className="font-mono text-xs font-semibold text-ink uppercase tracking-wider">
            Quantité
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={qty <= 1}
              onClick={() => setQty((prev) => Math.max(1, prev - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink bg-paper font-bold text-ink hover:bg-acid disabled:opacity-30 transition-colors cursor-pointer"
              aria-label="Diminuer la quantité"
            >
              −
            </button>
            <span className="w-8 text-center font-mono text-sm font-black text-ink">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((prev) => prev + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink bg-paper font-bold text-ink hover:bg-acid transition-colors cursor-pointer"
              aria-label="Augmenter la quantité"
            >
              +
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-3">
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleWhatsAppOrder}
            className="w-full flex items-center justify-center gap-3 rounded-xl border-2 border-ink bg-whatsapp px-6 py-3.5 font-display text-sm sm:text-base font-black uppercase text-ink shadow-pop hover:-translate-y-0.5 hover:shadow-pop-lg active:translate-y-0 active:shadow-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.772.84 2.791.84 3.184 0 5.77-2.587 5.77-5.766.001-3.182-2.585-5.766-5.77-5.766zm9.969 5.766c0 5.518-4.482 10-10 10-1.745 0-3.376-.452-4.805-1.242l-7.195 1.886 1.921-7.017c-.86-1.468-1.353-3.181-1.353-5.008 0-5.518 4.482-10 10-10 5.518 0 10 4.482 10 10z"/>
            </svg>
            <span>
              {isOutOfStock ? 'Taille indisponible' : `Commander sur WhatsApp (${formatPrice(product.price_cfa * qty)})`}
            </span>
          </button>

          {cartContext && (
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-ink bg-paper px-6 py-3 font-display text-sm font-bold uppercase text-ink shadow-[2px_2px_0_0_var(--color-ink)] hover:bg-canvas transition-all cursor-pointer disabled:opacity-50"
            >
              {addedNotice ? '✓ Ajouté au panier !' : 'Ajouter au Panier'}
            </button>
          )}
        </div>
      </div>

      {/* Reassurance Points */}
      <div className="rounded-2xl border border-ink/10 bg-canvas/60 p-5 space-y-3 font-mono text-xs text-muted">
        <div className="flex items-center gap-2.5 text-ink font-semibold">
          <span className="text-base">🎁</span>
          <span>Livraison 100% GRATUITE partout au Sénégal (Dakar 24h & Régions)</span>
        </div>
        <div className="flex items-center gap-2.5 text-ink font-semibold">
          <span className="text-base">💵</span>
          <span>Paiement à la réception par Wave, Orange Money ou Espèces</span>
        </div>
        <div className="flex items-center gap-2.5 text-ink font-semibold">
          <span className="text-base">🔄</span>
          <span>Échange de taille facile sous 48h avec notre livreur</span>
        </div>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  );
}
