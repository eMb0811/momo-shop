'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import type { Product, Size } from '@/lib/types';
import { formatPrice, productOrderMessage, whatsappUrl } from '@/lib/shop';
import { useCart } from '@/context/CartContext';

interface ProductModalProps {
  product: Product | null;
  allProducts: Product[];
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (p: Product) => void;
  onOpenSizeGuide: () => void;
}

export function ProductModal({
  product,
  allProducts,
  isOpen,
  onClose,
  onSelectProduct,
  onOpenSizeGuide,
}: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState<Size>('M');
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    if (product) {
      setSelectedSize('M');
      setQty(1);
    }
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const currentStock = product.stock[selectedSize] ?? 10;
  const isOutOfStock = currentStock === 0;

  const handleWhatsAppOrder = () => {
    const text = productOrderMessage(product, selectedSize, qty);
    window.open(whatsappUrl(text), '_blank');
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, qty);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-ink/75 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 my-auto w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-2xl sm:rounded-3xl border-2 sm:border-[2.5px] border-ink bg-paper shadow-[6px_6px_0_0_var(--color-ink)] sm:shadow-[10px_10px_0_0_var(--color-ink)] animate-in fade-in zoom-in-95 duration-200 flex flex-col md:grid md:grid-cols-2">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer la fiche produit"
          className="absolute right-3 top-3 sm:right-4 sm:top-4 z-20 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 border-ink bg-paper text-ink shadow-[1.5px_1.5px_0_0_var(--color-ink)] sm:shadow-[2px_2px_0_0_var(--color-ink)] hover:bg-acid transition-all text-xs sm:text-base"
        >
          ✕
        </button>

        {/* Left Media Column */}
        <div className="relative aspect-[16/10] sm:aspect-[4/3] md:aspect-auto md:h-full w-full bg-studio shrink-0 border-b-2 md:border-b-0 md:border-r-2 border-ink">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-top"
            priority
          />
          <div className="absolute left-3 top-3 sm:left-4 sm:top-4 rounded-full border border-ink bg-acid px-2.5 py-0.5 sm:px-3 sm:py-1 font-mono text-[0.65rem] sm:text-xs font-bold tracking-wider text-ink shadow-[1px_1px_0_0_var(--color-ink)] sm:shadow-[1.5px_1.5px_0_0_var(--color-ink)] uppercase">
            {product.badge}
          </div>
        </div>

        {/* Right Info Column */}
        <div className="flex flex-1 flex-col p-4 sm:p-8 overflow-y-auto">
          <div className="eyebrow self-start mb-1.5 sm:mb-2 text-[0.65rem] sm:text-[0.72rem] py-1 px-2.5 sm:px-3.5">100% COTON MERCERISÉ</div>

          <h2 className="font-display text-xl sm:text-3xl font-black text-ink uppercase tracking-tight">
            {product.name}
          </h2>

          <p className="mt-1 text-xs sm:text-sm text-muted leading-relaxed">
            {product.tagline}
          </p>

          <div className="mt-3 sm:mt-4 flex items-baseline gap-2.5 sm:gap-3 border-y border-ink/10 py-2 sm:py-3">
            <span className="font-display text-2xl sm:text-3xl font-black text-ink">
              {formatPrice(product.price_cfa * qty)}
            </span>
            {qty > 1 && (
              <span className="font-mono text-xs text-muted">
                ({formatPrice(product.price_cfa)} / unité)
              </span>
            )}
          </div>

          {/* Colors Swatches inside Modal */}
          <div className="mt-3.5 sm:mt-5">
            <div className="flex items-center justify-between text-[0.72rem] sm:text-xs font-mono font-semibold text-ink mb-1.5 sm:mb-2">
              <span>Nuance : <strong className="text-coral">{product.color.name}</strong></span>
              <span className="text-muted">{allProducts.length} couleurs disponibles</span>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {allProducts.map((p) => {
                const isActive = p.id === product.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onSelectProduct(p)}
                    title={p.name}
                    className={`relative flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border-2 transition-transform ${
                      isActive
                        ? 'border-ink scale-110 shadow-[1.5px_1.5px_0_0_var(--color-ink)] sm:shadow-[2px_2px_0_0_var(--color-ink)]'
                        : 'border-transparent hover:scale-105'
                    }`}
                  >
                    <span
                      className="h-5 w-5 sm:h-6 sm:w-6 rounded-full border border-black/20"
                      style={{ backgroundColor: p.color.hex }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selector + Size Guide Link */}
          <div className="mt-3.5 sm:mt-5">
            <div className="flex items-center justify-between text-[0.72rem] sm:text-xs font-mono font-semibold text-ink mb-1.5 sm:mb-2">
              <span>Taille : <strong className="text-coral">{selectedSize}</strong></span>
              <button
                type="button"
                onClick={onOpenSizeGuide}
                className="text-coral hover:underline font-bold"
              >
                Guide des tailles ↗
              </button>
            </div>

            <div className="grid grid-cols-6 gap-1 sm:gap-2">
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
                    className={`flex h-8.5 sm:h-10 items-center justify-center rounded-lg sm:rounded-xl border-2 font-mono text-[0.72rem] sm:text-xs font-bold transition-all ${
                      isSelected
                        ? 'border-ink bg-ink text-white shadow-[1.5px_1.5px_0_0_var(--color-coral)] sm:shadow-[2px_2px_0_0_var(--color-coral)]'
                        : isSizeEmpty
                        ? 'border-dashed border-ink/20 text-muted opacity-40 cursor-not-allowed'
                        : 'border-ink/20 bg-canvas text-ink hover:border-ink hover:bg-paper'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Picker */}
          <div className="mt-3.5 sm:mt-5 flex items-center justify-between rounded-xl border border-ink/15 bg-canvas/60 p-2 sm:p-3">
            <span className="font-mono text-[0.72rem] sm:text-xs font-semibold text-ink uppercase">Quantité</span>
            <div className="flex items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                disabled={qty <= 1}
                onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-ink bg-paper font-bold text-ink hover:bg-acid disabled:opacity-30 text-xs sm:text-sm"
              >
                −
              </button>
              <span className="w-5 sm:w-6 text-center font-mono font-bold text-ink text-xs sm:text-sm">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((prev) => prev + 1)}
                className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-ink bg-paper font-bold text-ink hover:bg-acid text-xs sm:text-sm"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 sm:mt-6 flex flex-col gap-2 sm:gap-2.5">
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleWhatsAppOrder}
              className="btn-whatsapp w-full min-h-[2.6rem] sm:min-h-[3rem] text-xs sm:text-sm py-2 px-3 sm:px-6 gap-2"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.772.84 2.791.84 3.184 0 5.77-2.587 5.77-5.766.001-3.182-2.585-5.766-5.77-5.766zm9.969 5.766c0 5.518-4.482 10-10 10-1.745 0-3.376-.452-4.805-1.242l-7.195 1.886 1.921-7.017c-.86-1.468-1.353-3.181-1.353-5.008 0-5.518 4.482-10 10-10 5.518 0 10 4.482 10 10z"/>
              </svg>
              <span className="truncate">{isOutOfStock ? 'Taille Épuisée' : 'Commander directement sur WhatsApp'}</span>
            </button>

            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className="btn-ink w-full min-h-[2.6rem] sm:min-h-[3rem] text-xs sm:text-sm py-2 px-3 sm:px-6"
            >
              Ajouter au Panier ({formatPrice(product.price_cfa * qty)})
            </button>
          </div>

          {/* Technical Specifications */}
          <div className="mt-4 sm:mt-6 border-t border-ink/10 pt-3 sm:pt-4 text-[0.72rem] sm:text-xs text-ink/80 space-y-1.5 sm:space-y-2">
            <div className="flex justify-between py-1 border-b border-ink/5">
              <span className="font-mono text-muted uppercase">Matière</span>
              <span className="font-medium">{product.composition}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-ink/5">
              <span className="font-mono text-muted uppercase">Coupe</span>
              <span className="font-medium">{product.fit}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-ink/5">
              <span className="font-mono text-muted uppercase">Col</span>
              <span className="font-medium">{product.collar}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="font-mono text-muted uppercase">Teinture</span>
              <span className="font-medium">{product.dye}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
