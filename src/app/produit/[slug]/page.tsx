import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts } from '@/lib/products';
import { formatPrice } from '@/lib/shop';
import { ProductOrderBox } from './ProductOrderBox';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const products = getProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Modèle Introuvable | momoShop Sénégal',
      description: 'Le t-shirt demandé est introuvable sur la boutique momoShop.',
    };
  }

  const title = `${product.name} — T-Shirt Coton Mercerisé Coupe Ajustée`;
  const description = `${product.tagline}. Pur coton peigné mercerisé, col rond structuré au ras du cou, coupe athlétique tailored fit. Prix : ${formatPrice(
    product.price_cfa,
  )}. Commande directe sur WhatsApp.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://momoshop.sn/produit/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | momoShop Sénégal`,
      description,
      url: `https://momoshop.sn/produit/${product.slug}`,
      siteName: 'momoShop Sénégal',
      locale: 'fr_SN',
      type: 'website',
      images: [
        {
          url: product.image,
          width: 800,
          height: 1000,
          alt: `${product.name} en coton peigné mercerisé - momoShop Sénégal`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | momoShop`,
      description,
      images: [product.image],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = getProducts();
  const otherProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 6);

  // Schema.org Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [`https://momoshop.sn${product.image}`],
    description: product.description || product.tagline,
    sku: product.id,
    mpn: product.id,
    brand: {
      '@type': 'Brand',
      name: 'momoShop',
    },
    category: 'Clothing > Tops > T-Shirts',
    material: product.composition,
    color: product.color.name,
    offers: {
      '@type': 'Offer',
      url: `https://momoshop.sn/produit/${product.slug}`,
      priceCurrency: 'XOF',
      price: product.price_cfa,
      priceValidUntil: '2027-12-31',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'momoShop SARL',
      },
    },
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col justify-between">
      {/* Schema.org Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Mini Header */}
      <header className="sticky top-0 z-30 border-b-2 border-ink bg-paper/95 backdrop-blur-md py-3.5">
        <div className="container-x flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative h-8 w-8 overflow-hidden rounded-lg border-2 border-ink bg-paper p-0.5 shadow-[1.5px_1.5px_0_0_var(--color-ink)] group-hover:bg-acid transition-all">
              <Image
                src="/images/logo.png"
                alt="momoShop"
                fill
                sizes="32px"
                className="object-contain p-0.5"
              />
            </div>
            <span className="font-display text-2xl font-black text-ink uppercase tracking-tight">
              momo<span className="text-coral">Shop</span>
            </span>
          </Link>

          <Link
            href="/#catalogue"
            className="rounded-full border-2 border-ink bg-paper px-4 py-1.5 font-mono text-xs font-bold uppercase text-ink shadow-[2px_2px_0_0_var(--color-ink)] hover:bg-acid hover:-translate-y-0.5 transition-all"
          >
            ← Retour au catalogue
          </Link>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav aria-label="Fil d'Ariane" className="border-b border-ink/10 bg-canvas py-2.5">
        <div className="container-x flex items-center gap-2 font-mono text-xs text-muted">
          <Link href="/" className="hover:text-coral transition-colors">
            Accueil
          </Link>
          <span>/</span>
          <Link href="/#catalogue" className="hover:text-coral transition-colors">
            Catalogue
          </Link>
          <span>/</span>
          <span className="text-ink font-semibold truncate">{product.name}</span>
        </div>
      </nav>

      {/* Main Product Container */}
      <main className="container-x py-8 sm:py-12 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Media Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl border-2 sm:border-[2.5px] border-ink bg-studio shadow-pop">
              {/* Product Badge */}
              <div className="absolute left-3 top-3 sm:left-4 sm:top-4 z-10 rounded-full border border-ink bg-acid px-3 py-1 font-mono text-xs font-bold tracking-wider text-ink shadow-[1.5px_1.5px_0_0_var(--color-ink)] uppercase">
                {product.badge}
              </div>

              {/* High-res Image */}
              <Image
                src={product.image}
                alt={`${product.name} - Coton peigné mercerisé momoShop`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-top"
              />
            </div>

            {/* Quick Feature Badges below image */}
            <div className="grid grid-cols-3 gap-2 font-mono text-[0.72rem] text-center font-bold">
              <div className="rounded-xl border border-ink/15 bg-paper p-2.5 shadow-xs">
                <span className="block text-coral text-base mb-0.5">✦</span>
                <span>Coton Mercerisé</span>
              </div>
              <div className="rounded-xl border border-ink/15 bg-paper p-2.5 shadow-xs">
                <span className="block text-coral text-base mb-0.5">◈</span>
                <span>Col Structuré</span>
              </div>
              <div className="rounded-xl border border-ink/15 bg-paper p-2.5 shadow-xs">
                <span className="block text-coral text-base mb-0.5">▲</span>
                <span>Coupe Ajustée</span>
              </div>
            </div>
          </div>

          {/* Right Column: Information, Order & Specs */}
          <div className="lg:col-span-6 flex flex-col space-y-6">
            {/* Header / Titles */}
            <div>
              <div className="eyebrow mb-2.5 text-[0.72rem]">ÉDITION LIMITÉE • PUR COTON</div>

              <h1 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-ink">
                {product.name}
              </h1>

              <p className="mt-2 text-sm sm:text-base text-muted leading-relaxed">
                {product.tagline}
              </p>
            </div>

            {/* Color Swatch & Palette Navigation */}
            <div className="rounded-2xl border border-ink/15 bg-paper p-4 shadow-xs">
              <div className="flex items-center justify-between font-mono text-xs font-semibold text-ink mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-ink/30 shadow-xs"
                    style={{ backgroundColor: product.color.hex }}
                  />
                  <span>
                    Nuance : <strong className="text-coral uppercase">{product.color.name}</strong>
                  </span>
                </div>
                <span className="text-muted text-[0.7rem] uppercase">
                  {allProducts.length} teintes disponibles
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {allProducts.map((p) => {
                  const isActive = p.id === product.id;
                  return (
                    <Link
                      key={p.id}
                      href={`/produit/${p.slug}`}
                      title={p.name}
                      className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition-transform ${
                        isActive
                          ? 'border-ink scale-110 shadow-[2px_2px_0_0_var(--color-ink)]'
                          : 'border-transparent hover:scale-105 opacity-80 hover:opacity-100'
                      }`}
                      aria-label={`Voir le ${p.name}`}
                    >
                      <span
                        className="h-6 w-6 rounded-full border border-black/20"
                        style={{ backgroundColor: p.color.hex }}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Order Interactive Section (Sizes, Quantity, WhatsApp) */}
            <ProductOrderBox product={product} />

            {/* Product Narrative & Technical Specifications */}
            <div className="space-y-4">
              <div className="rounded-2xl border-2 border-ink bg-paper p-5 shadow-pop">
                <h2 className="font-display text-base font-black uppercase text-ink mb-3">
                  Description du Modèle
                </h2>
                <p className="text-xs sm:text-sm text-ink/80 leading-relaxed">
                  {product.description}
                </p>

                <div className="mt-5 border-t border-ink/10 pt-4 space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-ink/5">
                    <span className="font-mono text-muted uppercase">Matière</span>
                    <span className="font-semibold text-ink text-right">{product.composition}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-ink/5">
                    <span className="font-mono text-muted uppercase">Coupe</span>
                    <span className="font-semibold text-ink text-right">{product.fit}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-ink/5">
                    <span className="font-mono text-muted uppercase">Col</span>
                    <span className="font-semibold text-ink text-right">{product.collar}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-ink/5">
                    <span className="font-mono text-muted uppercase">Teinture</span>
                    <span className="font-semibold text-ink text-right">{product.dye}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-mono text-muted uppercase">Finition</span>
                    <span className="font-semibold text-ink text-right">{product.weight}</span>
                  </div>
                </div>
              </div>

              {/* Care Instructions */}
              <div className="rounded-2xl border border-ink/10 bg-canvas/60 p-4 font-mono text-xs text-muted space-y-1.5">
                <span className="font-bold uppercase text-ink block mb-1">Conseils d&apos;Entretien Textile :</span>
                <p>• Lavage machine à 30°C sur l&apos;envers pour préserver le lustre mercerisé.</p>
                <p>• Repassage doux à moyen sur l&apos;envers.</p>
                <p>• Ne pas utiliser de javel ou de sèche-linge afin de conserver l&apos;élasticité du col.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Suggestion / Other Nuances Section */}
        {otherProducts.length > 0 && (
          <section className="mt-16 sm:mt-24 border-t-2 border-ink pt-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <div className="eyebrow mb-2">COLLECTION MOMOSHOP</div>
                <h2 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-ink">
                  Découvrir les Autres Nuances
                </h2>
              </div>
              <Link
                href="/#catalogue"
                className="font-mono text-xs font-bold uppercase text-coral hover:underline"
              >
                Voir tout le catalogue ({allProducts.length} teintes) →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {otherProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/produit/${item.slug}`}
                  className="group flex flex-col rounded-2xl border-2 border-ink bg-paper overflow-hidden shadow-pop hover:-translate-y-1 hover:shadow-pop-lg transition-all"
                >
                  <div className="relative aspect-[3/4] w-full bg-studio overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    />
                    <div
                      className="absolute top-2 right-2 h-3.5 w-3.5 rounded-full border border-ink/40 shadow-xs"
                      style={{ backgroundColor: item.color.hex }}
                    />
                  </div>
                  <div className="p-3">
                    <span className="font-display text-xs font-bold uppercase truncate block text-ink group-hover:text-coral transition-colors">
                      {item.name}
                    </span>
                    <span className="font-mono text-[0.7rem] text-muted">
                      {formatPrice(item.price_cfa)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t-2 border-ink bg-paper py-8 text-center text-xs text-muted font-mono">
        <div className="container-x flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 momoShop Sénégal 🇸🇳 • T-Shirts Coton Mercerisé Coupe Ajustée</p>
          <div className="flex gap-4">
            <Link href="/livraison-retours" className="hover:text-coral transition-colors">
              Livraison & Retours
            </Link>
            <Link href="/cgv" className="hover:text-coral transition-colors">
              CGV
            </Link>
            <Link href="/mentions-legales" className="hover:text-coral transition-colors">
              Mentions Légales
            </Link>
            <Link href="/confidentialite" className="hover:text-coral transition-colors">
              Confidentialité
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
