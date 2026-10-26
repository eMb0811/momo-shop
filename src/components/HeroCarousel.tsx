'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

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
      aria-label="Galerie de nos t-shirts en 3D"
      className="pt-4 sm:pt-6 pb-6 sm:pb-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="container-x">
        <div className="relative aspect-[16/10] sm:aspect-[16/8] md:aspect-[21/9] max-h-[580px] w-full overflow-hidden rounded-2xl sm:rounded-3xl border-2 sm:border-[2.5px] border-ink bg-studio shadow-[5px_5px_0_0_var(--color-ink)] sm:shadow-[8px_8px_0_0_var(--color-ink)]">
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
                <div className="relative h-full w-full overflow-hidden bg-studio">
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

          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={prev}
            aria-label="Image précédente"
            className="absolute left-2.5 sm:left-5 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-ink bg-paper/95 text-ink shadow-[2px_2px_0_0_var(--color-ink)] sm:shadow-[2.5px_2.5px_0_0_var(--color-ink)] transition-all hover:bg-acid hover:scale-105 active:scale-95"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            type="button"
            onClick={next}
            aria-label="Image suivante"
            className="absolute right-2.5 sm:right-5 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-ink bg-paper/95 text-ink shadow-[2px_2px_0_0_var(--color-ink)] sm:shadow-[2.5px_2.5px_0_0_var(--color-ink)] transition-all hover:bg-acid hover:scale-105 active:scale-95"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Progress Indicators */}
          <div className="absolute bottom-2.5 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex w-36 sm:w-64 gap-1.5 sm:gap-2 rounded-full border border-white/25 bg-ink/80 px-2.5 sm:px-3 py-1 sm:py-1.5 backdrop-blur-md">
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
