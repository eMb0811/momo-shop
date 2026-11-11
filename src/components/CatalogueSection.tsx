'use client';

import React, { useState } from 'react';
import type { CategoryFilter, Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { SizeGuideModal } from './SizeGuideModal';

interface CatalogueSectionProps {
  products: Product[];
  onOpenSizeGuideModal?: (openFn: () => void) => void;
}

export function CatalogueSection({ products }: CatalogueSectionProps) {
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const filtered = products.filter((p) => {
    if (filter === 'all') return true;
    return p.color.category === filter;
  });

  const neutresCount = products.filter((p) => p.color.category === 'neutres').length;
  const popCount = products.filter((p) => p.color.category === 'pop').length;
  const natureCount = products.filter((p) => p.color.category === 'nature').length;

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleOpenSizeGuide = () => {
    setIsSizeGuideOpen(true);
  };

  return (
    <section id="catalogue" className="pt-10 sm:pt-16 pb-14 sm:pb-20">
      <div className="container-x">
        {/* Header & Filter Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6 mb-8 sm:mb-10">
          <div>
            <div className="eyebrow mb-2 text-[0.68rem] sm:text-[0.72rem] py-1 px-3">COLLECTION COTON MERCERISÉ • COUPE AJUSTÉE</div>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-black text-ink uppercase tracking-tight">
              Nos T-Shirts Coton Mercerisé
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`rounded-full border-2 px-3 sm:px-4 py-1.5 sm:py-2 font-mono text-[0.72rem] sm:text-xs font-bold uppercase transition-all ${
                filter === 'all'
                  ? 'border-ink bg-coral text-white shadow-pop'
                  : 'border-ink bg-paper text-ink hover:bg-canvas'
              }`}
            >
              Toutes ({products.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('neutres')}
              className={`rounded-full border-2 px-3 sm:px-4 py-1.5 sm:py-2 font-mono text-[0.72rem] sm:text-xs font-bold uppercase transition-all ${
                filter === 'neutres'
                  ? 'border-ink bg-coral text-white shadow-pop'
                  : 'border-ink bg-paper text-ink hover:bg-canvas'
              }`}
            >
              Neutres & Basiques ({neutresCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('pop')}
              className={`rounded-full border-2 px-3 sm:px-4 py-1.5 sm:py-2 font-mono text-[0.72rem] sm:text-xs font-bold uppercase transition-all ${
                filter === 'pop'
                  ? 'border-ink bg-coral text-white shadow-pop'
                  : 'border-ink bg-paper text-ink hover:bg-canvas'
              }`}
            >
              Vives & Pop ({popCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('nature')}
              className={`rounded-full border-2 px-3 sm:px-4 py-1.5 sm:py-2 font-mono text-[0.72rem] sm:text-xs font-bold uppercase transition-all ${
                filter === 'nature'
                  ? 'border-ink bg-coral text-white shadow-pop'
                  : 'border-ink bg-paper text-ink hover:bg-canvas'
              }`}
            >
              Nature & Douces ({natureCount})
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenModal={handleOpenProduct}
            />
          ))}
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        allProducts={products}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onOpenSizeGuide={handleOpenSizeGuide}
      />

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </section>
  );
}
