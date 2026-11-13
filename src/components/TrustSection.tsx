'use client';

import React from 'react';

interface TrustCard {
  title: string;
  subtitle: string;
  badge: string;
  iconBg: string;
  icon: React.ReactNode;
  tags: { label: string; bg?: string; text?: string }[];
}

const TRUST_CARDS: TrustCard[] = [
  {
    title: '100% Coton Mercerisé Peigné',
    subtitle: 'Soyeux, éclat durable et col structuré indéformable qui ne vrille jamais au lavage.',
    badge: 'PREMIUM QUALITY',
    iconBg: 'bg-acid',
    icon: (
      <svg className="w-6 h-6 text-ink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    tags: [
      { label: 'Toucher soyeux' },
      { label: 'Col ras du cou' },
    ],
  },
  {
    title: 'Livraison 100% Gratuite Partout',
    subtitle: 'Actuellement offerte sur tout Dakar (en 24h) et dans toutes les régions du Sénégal, sans minimum de commande !',
    badge: 'OFFERTE 100%',
    iconBg: 'bg-coral text-white',
    icon: (
      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    tags: [
      { label: 'Dakar en 24h' },
      { label: '0 FCFA Partout' },
    ],
  },
  {
    title: 'Paiement à la Réception',
    subtitle: 'Payez en toute sérénité à l’arrivée de votre commande : Wave 💙, Orange Money 🧡 ou Espèces 💵.',
    badge: '0 RISQUE',
    iconBg: 'bg-whatsapp/20 text-ink',
    icon: (
      <svg className="w-6 h-6 text-ink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
        <line x1="6" y1="15" x2="10" y2="15" />
      </svg>
    ),
    tags: [
      { label: 'Wave 💙', bg: 'bg-[#1aa0ff]/15 text-[#0066cc]' },
      { label: 'Orange Money 🧡', bg: 'bg-[#ff7900]/15 text-[#cc5200]' },
      { label: 'Espèces 💵', bg: 'bg-ink/10 text-ink' },
    ],
  },
  {
    title: 'Échange de Taille Garanti',
    subtitle: 'Taille pas tout à fait ajustée ? Échange facile et rapide sous 48h directement avec notre coursier.',
    badge: 'SERVICE 48H',
    iconBg: 'bg-ink text-white',
    icon: (
      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
      </svg>
    ),
    tags: [
      { label: 'Échange sous 48h' },
      { label: 'Support WhatsApp' },
    ],
  },
];

export function TrustSection() {
  return (
    <section aria-label="Engagements et garanties momoShop" className="py-6 sm:py-10">
      <div className="container-x">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {TRUST_CARDS.map((card, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border-2 border-ink bg-paper p-4 sm:p-5 shadow-pop transition-all duration-200 hover:-translate-y-1 hover:shadow-pop-lg"
            >
              <div>
                {/* Header row with Icon and Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 border-ink shadow-[2px_2px_0_0_var(--color-ink)] transition-transform group-hover:scale-105 ${card.iconBg}`}
                  >
                    {card.icon}
                  </div>
                  <span className="font-mono text-[0.68rem] font-extrabold uppercase tracking-wider text-muted px-2.5 py-1 rounded-full border border-ink/15 bg-canvas">
                    {card.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display text-base sm:text-lg font-black text-ink uppercase tracking-tight leading-snug mb-2">
                  {card.title}
                </h3>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm text-muted leading-relaxed font-sans">
                  {card.subtitle}
                </p>
              </div>

              {/* Tags / Badges */}
              <div className="mt-5 pt-3 border-t border-dashed border-ink/15 flex flex-wrap gap-1.5 font-mono text-[0.7rem] font-bold">
                {card.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className={`px-2 py-0.5 rounded-md border border-ink/10 ${
                      tag.bg ? tag.bg : 'bg-canvas text-ink-soft'
                    }`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
