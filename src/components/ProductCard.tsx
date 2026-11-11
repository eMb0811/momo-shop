'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import type { Product, Size } from '@/lib/types';
import { formatPrice, productOrderMessage, whatsappUrl } from '@/lib/shop';
import { useCart } from '@/context/CartContext';
import { trackEvent } from '@/lib/tracker';

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
}

export function ProductCard({ product, onOpenModal }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<Size>('M');
  const { addToCart } = useCart();

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
      qty: 1,
      amountCfa: product.price_cfa,
    });
    const text = productOrderMessage(product, selectedSize, 1);
    window.open(whatsappUrl(text), '_blank');
  };

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-ink bg-paper shadow-pop transition-all duration-200 hover:-translate-y-1 hover:shadow-pop-lg">
      {/* Top Media Box */}
      <div className="relative">
        {/* Badge */}
        <div className="absolute left-2.5 top-2.5 sm:left-3 sm:top-3 z-10 rounded-full border border-ink bg-acid px-2.5 py-0.5 sm:px-3 sm:py-1 font-mono text-[0.65rem] sm:text-[0.7rem] font-bold tracking-wider text-ink shadow-[1px_1px_0_0_var(--color-ink)] sm:shadow-[1.5px_1.5px_0_0_var(--color-ink)] uppercase">
          {product.badge}
        </div>

        {/* Product Image */}
        <button
          type="button"
          onClick={() => onOpenModal(product)}
          className="relative block aspect-[3/4] w-full overflow-hidden bg-studio text-left"
          aria-label={`Voir les détails du ${product.name}`}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-5">
        {/* Color Pill */}
        <div className="mb-1.5 sm:mb-2 flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full border border-ink/40 shadow-xs"
            style={{ backgroundColor: product.color.hex }}
          />
          <span className="font-mono text-[0.7rem] sm:text-xs font-semibold uppercase tracking-wider text-muted">
            {product.color.name}
          </span>
        </div>

        {/* Title */}
        <button
          type="button"
          onClick={() => onOpenModal(product)}
          className="text-left font-display text-lg sm:text-xl font-extrabold tracking-tight text-ink uppercase hover:text-coral transition-colors"
        >
          {product.name}
        </button>

        {/* Tagline */}
        <p className="mt-1 text-[0.75rem] sm:text-xs text-muted leading-relaxed line-clamp-2">
          {product.tagline}
        </p>

        {/* Price */}
        <div className="mt-3 sm:mt-4 flex items-baseline justify-between border-t border-ink/10 pt-2.5 sm:pt-3">
          <span className="font-display text-xl sm:text-2xl font-black text-ink">
            {formatPrice(product.price_cfa)}
          </span>
          <span className="font-mono text-[0.65rem] sm:text-[0.7rem] font-semibold tracking-wider text-muted uppercase">
            Coton Mercerisé
          </span>
        </div>

        {/* Size Selection */}
        <div className="mt-3 sm:mt-4">
          <div className="flex items-center justify-between text-[0.72rem] sm:text-xs font-mono font-semibold mb-1.5 sm:mb-2 text-ink">
            <span>Taille : <strong className="text-coral font-bold">{selectedSize}</strong></span>
            {isLowStock && <span className="text-coral text-[0.65rem] sm:text-[0.7rem] font-bold">Stock limité ({currentStock})</span>}
            {isOutOfStock && <span className="text-coral text-[0.65rem] sm:text-[0.7rem] font-bold">Épuisé</span>}
          </div>

          <div className="grid grid-cols-6 gap-1 sm:gap-1.5">
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
                  className={`flex h-8 sm:h-9 items-center justify-center rounded-md sm:rounded-lg border font-mono text-[0.72rem] sm:text-xs font-bold transition-all ${
                    isSelected
                      ? 'border-ink bg-ink text-white shadow-[1.5px_1.5px_0_0_var(--color-coral)] sm:shadow-[2px_2px_0_0_var(--color-coral)]'
                      : isSizeEmpty
                      ? 'border-dashed border-ink/20 text-muted opacity-40 cursor-not-allowed'
                      : 'border-ink/20 bg-canvas text-ink hover:border-ink hover:bg-paper'
                  }`}
                  aria-label={`Taille ${size}`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 sm:mt-5 flex flex-col gap-2">
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleWhatsAppOrder}
            className="btn-whatsapp w-full min-h-[2.6rem] sm:min-h-[3rem] text-xs sm:text-[0.82rem] py-2 px-3 sm:px-6 gap-2"
          >
            <svg className="w-4 h-4 sm:w-[18px] sm:h-[18px]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.772.84 2.791.84 3.184 0 5.77-2.587 5.77-5.766.001-3.182-2.585-5.766-5.77-5.766zm9.969 5.766c0 5.518-4.482 10-10 10-1.745 0-3.376-.452-4.805-1.242l-7.195 1.886 1.921-7.017c-.86-1.468-1.353-3.181-1.353-5.008 0-5.518 4.482-10 10-10 5.518 0 10 4.482 10 10z"/>
            </svg>
            <span className="truncate">{isOutOfStock ? 'Taille Épuisée' : 'Commander sur WhatsApp'}</span>
          </button>

          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => addToCart(product, selectedSize, 1)}
              className="btn-ghost min-h-[2.35rem] sm:min-h-[2.75rem] text-[0.7rem] sm:text-[0.75rem] px-1.5 sm:px-2"
            >
              + Au Panier
            </button>
            <button
              type="button"
              onClick={() => onOpenModal(product)}
              className="btn-ghost min-h-[2.35rem] sm:min-h-[2.75rem] text-[0.7rem] sm:text-[0.75rem] px-1.5 sm:px-2 text-ink hover:text-coral"
            >
              Détails & Guide ↗
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
