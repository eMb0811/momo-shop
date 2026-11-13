'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { whatsappUrl } from '@/lib/shop';

interface HeroSlide {
  src: string;
  alt: string;
}

const SLIDES: HeroSlide[] = [
  {
    src: '/images/hero_3d_trio.jpg',
    alt: 'T-Shirts Momo Shop Rendu 3D avec Nuances de Fumée - Collection Coton Mercerisé',
  },
  {
    src: '/images/hero_3d_black.jpg',
    alt: 'T-Shirt Noir Minimaliste Rendu 3D Haute Définition avec Volutes de Fumée',
  },
  {
    src: '/images/hero_3d_terracotta.jpg',
    alt: 'T-Shirt Terracotta Premium Rendu 3D Ambiance Studio Douce et Fumée',
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 4800);
    return () => clearInterval(interval);
  }, [isPaused]);

  const prev = () => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const next = () => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  return (
    <section
      aria-label="Galerie de nos t-shirts en 3D et présentation"
      className="pt-4 sm:pt-6 pb-6 sm:pb-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="container-x">
        <div className="relative min-h-[460px] sm:min-h-[500px] md:min-h-[540px] aspect-[16/11] sm:aspect-[16/8] md:aspect-[21/9] max-h-[620px] w-full overflow-hidden rounded-2xl sm:rounded-3xl border-2 sm:border-[2.5px] border-ink bg-[#141416] shadow-[5px_5px_0_0_var(--color-ink)] sm:shadow-[8px_8px_0_0_var(--color-ink)]">
          {/* Slides */}
          {SLIDES.map((slide, index) => {
            const isActive = index === current;
            return (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                  isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <div className="relative h-full w-full overflow-hidden bg-[#141416]">
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1320px"
                    className={`object-cover object-center transition-transform duration-1000 ease-out ${
                      isActive ? 'scale-100' : 'scale-105'
                    }`}
                  />
                </div>
              </div>
            );
          })}

          {/* High-Contrast Streetwear Overlay Gradient */}
          <div className="absolute inset-0 z-15 bg-gradient-to-t from-ink/95 via-ink/70 to-ink/20 sm:bg-gradient-to-r sm:from-ink/95 sm:via-ink/75 sm:to-transparent pointer-events-none" />

          {/* Sleek Streetwear Typography & CTAs Overlay */}
          <div className="absolute inset-0 z-20 flex flex-col justify-end sm:justify-center p-5 sm:p-10 md:p-14 lg:p-16 pointer-events-none">
            <div className="max-w-xl sm:max-w-2xl pointer-events-auto space-y-3 sm:space-y-4">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 rounded-full border border-acid/50 bg-ink/80 px-3 sm:px-3.5 py-1 sm:py-1.5 backdrop-blur-md shadow-sm">
                <span className="h-2 w-2 rounded-full bg-acid animate-pulse" />
                <span className="font-mono text-[0.68rem] sm:text-xs font-bold uppercase tracking-widest text-acid">
                  ÉDITION LIMITÉE • 21 NUANCES
                </span>
              </div>

              {/* Title */}
              <h1 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black uppercase tracking-tight text-white leading-[1.08] drop-shadow-md">
                L&apos;Excellence du T-Shirt Coton Mercerisé
              </h1>

              {/* Subtitle */}
              <p className="font-sans text-xs sm:text-sm md:text-base font-medium text-white/90 leading-relaxed max-w-xl drop-shadow-sm">
                Col rond structuré au ras du cou • Coupe athlétique ajustée •{' '}
                <span className="font-bold text-acid font-mono tracking-tight bg-ink/70 px-2 py-0.5 rounded border border-acid/30">
                  2 500 FCFA
                </span>
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2 sm:pt-3">
                <a
                  href="#catalogue"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-acid px-5 sm:px-6 py-2.5 sm:py-3 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-ink shadow-[3px_3px_0_0_#0d0d11] transition-all hover:bg-white hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Explorer le catalogue ↓</span>
                </a>

                <a
                  href={whatsappUrl('Bonjour momoShop ! Je souhaite avoir des informations sur vos t-shirts coton mercerisé.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-whatsapp px-5 sm:px-6 py-2.5 sm:py-3 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-ink shadow-[3px_3px_0_0_#0d0d11] transition-all hover:bg-[#34e277] hover:-translate-y-0.5 active:translate-y-0"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z" />
                  </svg>
                  <span>WhatsApp direct</span>
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={prev}
            aria-label="Image précédente"
            className="absolute left-2.5 sm:left-5 top-1/2 -translate-y-1/2 z-30 flex h-8 w-8 sm:h-11 sm:w-11 items-center justify-center rounded-full border-2 border-ink bg-paper/95 text-ink shadow-[2px_2px_0_0_var(--color-ink)] sm:shadow-[2.5px_2.5px_0_0_var(--color-ink)] transition-all hover:bg-acid hover:scale-105 active:scale-95"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            type="button"
            onClick={next}
            aria-label="Image suivante"
            className="absolute right-2.5 sm:right-5 top-1/2 -translate-y-1/2 z-30 flex h-8 w-8 sm:h-11 sm:w-11 items-center justify-center rounded-full border-2 border-ink bg-paper/95 text-ink shadow-[2px_2px_0_0_var(--color-ink)] sm:shadow-[2.5px_2.5px_0_0_var(--color-ink)] transition-all hover:bg-acid hover:scale-105 active:scale-95"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Progress Indicators */}
          <div className="absolute bottom-3 sm:bottom-5 right-4 sm:right-8 z-30 flex w-24 sm:w-36 gap-1.5 rounded-full border border-white/25 bg-ink/85 px-2.5 py-1 sm:py-1.5 backdrop-blur-md">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrent(idx)}
                aria-label={`Aller au t-shirt 3D ${idx + 1}`}
                className="relative h-1 sm:h-1.5 flex-1 overflow-hidden rounded-full bg-white/30"
              >
                {idx === current && (
                  <span
                    key={`fill-${current}`}
                    className="absolute inset-0 bg-acid hero-progress"
                    style={{ animationDuration: isPaused ? '0s' : '4800ms' }}
                  />
                )}
                {idx < current && <span className="absolute inset-0 bg-acid" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
