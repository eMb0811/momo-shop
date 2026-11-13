'use client';

import React from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { formatPrice, productOrderMessage, whatsappUrl } from '@/lib/shop';
import { trackEvent } from '@/lib/tracker';

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
}

export function ProductCard({ product, onOpenModal }: ProductCardProps) {
  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackEvent({
      type: 'whatsapp_product_order',
      productId: product.id,
      productName: product.name,
      colorName: product.color.name,
      colorHex: product.color.hex,
      size: 'M',
      qty: 1,
      amountCfa: product.price_cfa,
    });
    const text = productOrderMessage(product, 'M', 1);
    window.open(whatsappUrl(text), '_blank');
  };

  return (
    <article
      onClick={() => onOpenModal(product)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl sm:rounded-2xl border-2 border-ink bg-paper shadow-pop transition-all duration-200 hover:-translate-y-1 hover:shadow-pop-lg cursor-pointer"
    >
      {/* Top Media Box */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-studio">
        {/* Badge */}
        <div className="absolute left-2 top-2 sm:left-2.5 sm:top-2.5 z-10 rounded-full border border-ink bg-acid px-2 py-0.5 font-mono text-[0.6rem] sm:text-[0.68rem] font-bold tracking-wider text-ink shadow-[1px_1px_0_0_var(--color-ink)] uppercase">
          {product.badge}
        </div>

        {/* Free Delivery Tag */}
        <div className="absolute right-2 top-2 sm:right-2.5 sm:top-2.5 z-10 rounded-full border border-ink bg-paper/95 px-2 py-0.5 font-mono text-[0.58rem] sm:text-[0.65rem] font-black text-coral shadow-[1px_1px_0_0_var(--color-ink)] uppercase">
          Livraison 0 F 🎁
        </div>

        {/* Product Image */}
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Hover Quick View Overlay (desktop) */}
        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-ink/70 via-ink/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center">
          <span className="font-mono text-[0.7rem] font-bold text-white uppercase tracking-wider bg-ink/80 px-3 py-1 rounded-full border border-white/20 backdrop-blur-xs">
            Aperçu & Tailles ↗
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-2.5 sm:p-4">
        {/* Color Pill & Sizes preview */}
        <div className="mb-1 flex items-center justify-between gap-1.5 font-mono text-[0.65rem] sm:text-xs">
          <div className="flex items-center gap-1.5 min-w-0 truncate">
            <span
              className="h-2.5 w-2.5 rounded-full border border-ink/40 shrink-0"
              style={{ backgroundColor: product.color.hex }}
            />
            <span className="font-semibold uppercase tracking-wider text-muted truncate">
              {product.color.name}
            </span>
          </div>
          <span className="shrink-0 text-[0.6rem] sm:text-[0.68rem] font-bold text-muted bg-canvas px-1.5 py-0.5 rounded border border-ink/10">
            XS-XXL
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display text-sm sm:text-base font-extrabold tracking-tight text-ink uppercase truncate group-hover:text-coral transition-colors">
          {product.name}
        </h3>

        {/* Price */}
        <div className="mt-1 mb-2.5 flex items-baseline justify-between">
          <span className="font-display text-base sm:text-xl font-black text-ink">
            {formatPrice(product.price_cfa)}
          </span>
          <span className="font-mono text-[0.6rem] sm:text-[0.68rem] font-semibold text-muted uppercase">
            Mercerisé
          </span>
        </div>

        {/* Compact Actions */}
        <div className="mt-auto grid grid-cols-2 gap-1.5 pt-2 border-t border-ink/10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenModal(product);
            }}
            className="flex h-8 sm:h-9 items-center justify-center rounded-lg sm:rounded-xl border border-ink bg-canvas hover:bg-paper font-mono text-[0.65rem] sm:text-[0.72rem] font-bold text-ink uppercase transition-all shadow-xs"
            aria-label={`Choisir la taille du ${product.name}`}
          >
            Tailles ↗
          </button>

          <button
            type="button"
            onClick={handleWhatsAppOrder}
            className="flex h-8 sm:h-9 items-center justify-center gap-1 rounded-lg sm:rounded-xl border border-ink bg-whatsapp hover:bg-whatsapp/90 font-mono text-[0.65rem] sm:text-[0.72rem] font-black text-ink uppercase transition-all shadow-xs"
            aria-label={`Commander ${product.name} sur WhatsApp`}
          >
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.772.84 2.791.84 3.184 0 5.77-2.587 5.77-5.766.001-3.182-2.585-5.766-5.77-5.766zm9.969 5.766c0 5.518-4.482 10-10 10-1.745 0-3.376-.452-4.805-1.242l-7.195 1.886 1.921-7.017c-.86-1.468-1.353-3.181-1.353-5.008 0-5.518 4.482-10 10-10 5.518 0 10 4.482 10 10z"/>
            </svg>
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    </article>
  );
}
