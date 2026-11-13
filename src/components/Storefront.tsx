'use client';

import React, { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { CartProvider } from '@/context/CartContext';
import { Header } from '@/components/Header';
import { HeroCarousel } from '@/components/HeroCarousel';
import { KineticMarquee } from '@/components/KineticMarquee';
import { TrustSection } from '@/components/TrustSection';
import { CatalogueSection } from '@/components/CatalogueSection';
import { ReviewsSection } from '@/components/ReviewsSection';
import { FaqSection } from '@/components/FaqSection';
import { CartDrawer } from '@/components/CartDrawer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { Footer } from '@/components/Footer';
import { SizeGuideModal } from '@/components/SizeGuideModal';
import { trackClientError, trackEvent } from '@/lib/tracker';

interface StorefrontProps {
  products: Product[];
}

export function Storefront({ products }: StorefrontProps) {
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  useEffect(() => {
    trackEvent({ type: 'page_view' });

    const onError = (event: ErrorEvent) => {
      trackClientError({
        message: event.message || 'Erreur JavaScript client',
        stack: event.error instanceof Error ? event.error.stack : undefined,
        url: window.location.href,
      });
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason =
        event.reason instanceof Error
          ? event.reason.message
          : String(event.reason ?? 'Promesse rejetée non gérée');
      trackClientError({
        message: `UnhandledRejection: ${reason}`,
        stack: event.reason instanceof Error ? event.reason.stack : undefined,
        url: window.location.href,
      });
    };

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onUnhandledRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
    };
  }, []);

  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col bg-canvas text-ink">
        <Header />

        <main className="flex-1">
          {/* Hero Carousel with Streetwear Typography & CTAs Overlay */}
          <HeroCarousel />

          {/* Kinetic Streetwear Marquee Bar */}
          <KineticMarquee />

          {/* Reassurance Cards (100% Coton Mercerisé, 24h Express, Paiement Réception, Échange 48h) */}
          <TrustSection />

          {/* Catalogue with Modern Filters & Product Cards */}
          <CatalogueSection products={products} />

          {/* Verified Local Client Reviews in Dakar */}
          <ReviewsSection />

          {/* Interactive FAQ Accordion */}
          <FaqSection />
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
