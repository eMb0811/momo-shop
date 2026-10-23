'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface HeroSlide {
  images: {
    src: string;
    alt: string;
  }[];
}

const SLIDES: HeroSlide[] = [
  {
    images: [
      { src: '/images/mockneck_black.jpg', alt: 'T-Shirt Noir Coton Mercerisé' },
      { src: '/images/mockneck_terracotta.jpg', alt: 'T-Shirt Terracotta Coton Mercerisé' },
      { src: '/images/mockneck_sage.jpg', alt: 'T-Shirt Vert Sauge Coton Mercerisé' },
    ],
  },
  {
    images: [
      { src: '/images/mockneck_navy.jpg', alt: 'T-Shirt Bleu Minuit Coton Mercerisé' },
      { src: '/images/mockneck_saffron.jpg', alt: 'T-Shirt Jaune Safran Coton Mercerisé' },
      { src: '/images/mockneck_white.jpg', alt: 'T-Shirt Blanc Coton Mercerisé' },
    ],
  },
  {
    images: [
      { src: '/images/mockneck_terracotta.jpg', alt: 'T-Shirt Terracotta Coton Mercerisé' },
      { src: '/images/mockneck_black.jpg', alt: 'T-Shirt Noir Coton Mercerisé' },
      { src: '/images/mockneck_saffron.jpg', alt: 'T-Shirt Jaune Safran Coton Mercerisé' },
    ],
  },
  {
    images: [
      { src: '/images/mockneck_sage.jpg', alt: 'T-Shirt Vert Sauge Coton Mercerisé' },
      { src: '/images/mockneck_navy.jpg', alt: 'T-Shirt Bleu Minuit Coton Mercerisé' },
      { src: '/images/mockneck_white.jpg', alt: 'T-Shirt Blanc Coton Mercerisé' },
    ],
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
      aria-label="Galerie de nos t-shirts"
      className="pt-6 pb-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="container-x">
        <div className="relative aspect-[4/3] sm:aspect-[16/8] md:aspect-[21/9] max-h-[580px] w-full overflow-hidden rounded-2xl sm:rounded-3xl border-2 sm:border-[2.5px] border-ink bg-studio shadow-[6px_6px_0_0_var(--color-ink)] sm:shadow-[8px_8px_0_0_var(--color-ink)]">
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
                <div className="grid h-full w-full grid-cols-1 sm:grid-cols-3">
                  {slide.images.map((img, imgIdx) => (
                    <div
                      key={imgIdx}
                      className={`relative h-full w-full overflow-hidden bg-studio ${
                        imgIdx > 0 ? 'hidden sm:block sm:border-l-2 sm:border-ink' : ''
                      }`}
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        priority={index === 0 && imgIdx === 0}
                        className={`object-cover object-top transition-transform duration-1000 ease-out ${
                          isActive ? 'scale-100' : 'scale-105'
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={prev}
            aria-label="Image précédente"
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-ink bg-paper/95 text-ink shadow-[2.5px_2.5px_0_0_var(--color-ink)] transition-all hover:bg-acid hover:scale-105 active:scale-95"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            type="button"
            onClick={next}
            aria-label="Image suivante"
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-ink bg-paper/95 text-ink shadow-[2.5px_2.5px_0_0_var(--color-ink)] transition-all hover:bg-acid hover:scale-105 active:scale-95"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Progress Indicators */}
          <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex w-56 sm:w-64 gap-2 rounded-full border border-white/20 bg-ink/75 px-3 py-1.5 backdrop-blur-md">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrent(idx)}
                aria-label={`Aller au groupe de t-shirts ${idx + 1}`}
                className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/30"
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
