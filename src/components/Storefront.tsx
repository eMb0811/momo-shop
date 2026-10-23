'use client';

import React, { useState } from 'react';
import type { Product } from '@/lib/types';
import { CartProvider } from '@/context/CartContext';
import { Header } from '@/components/Header';
import { HeroCarousel } from '@/components/HeroCarousel';
import { KineticMarquee } from '@/components/KineticMarquee';
import { CatalogueSection } from '@/components/CatalogueSection';
import { CartDrawer } from '@/components/CartDrawer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { Footer } from '@/components/Footer';
import { SizeGuideModal } from '@/components/SizeGuideModal';

interface StorefrontProps {
  products: Product[];
}

export function Storefront({ products }: StorefrontProps) {
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col bg-canvas text-ink">
        <Header />

        <main className="flex-1">
          {/* Zero-Text Hero Carousel */}
          <HeroCarousel />

          {/* Kinetic Streetwear Marquee Bar */}
          <KineticMarquee />

          {/* Catalogue with Modern Filters & Product Cards */}
          <CatalogueSection products={products} />
        </main>

        <Footer onOpenSizeGuide={() => setIsSizeGuideOpen(true)} />

        {/* Global Slide-over Cart Drawer */}
        <CartDrawer />

        {/* Floating WhatsApp Bubble */}
        <FloatingWhatsApp />

        {/* Root Size Guide Modal */}
        <SizeGuideModal
          isOpen={isSizeGuideOpen}
          onClose={() => setIsSizeGuideOpen(false)}
        />
      </div>
    </CartProvider>
  );
}
