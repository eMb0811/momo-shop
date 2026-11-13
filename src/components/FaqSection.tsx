'use client';

import React, { useState } from 'react';
import { whatsappUrl } from '@/lib/shop';

interface FaqItem {
  question: string;
  category: string;
  answer: string | React.ReactNode;
}

const FAQS: FaqItem[] = [
  {
    category: 'Matière & Qualité',
    question: 'Quels sont les avantages uniques du coton mercerisé peigné ?',
    answer: (
      <div className="space-y-2 text-xs sm:text-sm text-ink-soft leading-relaxed">
        <p>
          La <strong>mercerisation</strong> est un procédé textile haut de gamme appliqué à des fibres de coton longues et peignées. Il resserre la structure moléculaire de la fibre pour offrir :
        </p>
        <ul className="list-disc pl-5 space-y-1 text-muted">
          <li><strong>Un toucher soyeux et lisse</strong> incomparable, extrêmement doux sur la peau.</li>
          <li><strong>Un éclat satiné subtil</strong> qui donne un aspect luxueux et habillé à vos tenues.</li>
          <li><strong>Un col structuré indéformable</strong> qui reste parfaitement au ras du cou sans gondoler ni se détendre.</li>
          <li><strong>Une rétention des couleurs supérieure</strong> : la teinte ne fane pas au soleil ni aux lavages répétés.</li>
        </ul>
      </div>
    ),
  },
  {
    category: 'Coupe & Guide Tailles',
    question: 'Comment taille la coupe athlétique ? Quelle taille choisir ?',
    answer: (
      <div className="space-y-2 text-xs sm:text-sm text-ink-soft leading-relaxed">
        <p>
          Nos t-shirts ont été dessinés avec une <strong>coupe athlétique ajustée (tailored fit)</strong> moderne : manches courtes galbant les biceps, épaules soulignées, col ras du cou fermé et tombé droit élégant.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2 font-mono text-xs">
          <div className="p-3 bg-canvas rounded-xl border border-ink/10">
            <span className="font-bold text-ink block mb-1">🎯 Coupe Ajustée (Recommandé)</span>
            <p className="text-muted">Prenez votre taille habituelle (ex: M pour 1m75 / 72kg).</p>
          </div>
          <div className="p-3 bg-canvas rounded-xl border border-ink/10">
            <span className="font-bold text-ink block mb-1">👕 Coupe Regular / Ample</span>
            <p className="text-muted">Prenez une taille au-dessus de votre taille normale (ex: L au lieu de M).</p>
          </div>
        </div>
        <p className="text-muted text-xs">
          💡 En cas d&apos;hésitation, notre équipe vous conseille en direct sur WhatsApp. De plus, <strong>l&apos;échange de taille sous 48h est garanti</strong> avec notre coursier.
        </p>
      </div>
    ),
  },
  {
    category: 'Livraison & Délais',
    question: 'Quels sont les délais et tarifs de livraison à Dakar et dans les régions ?',
    answer: (
      <div className="space-y-2 text-xs sm:text-sm text-ink-soft leading-relaxed">
        <p className="font-bold text-coral">
          🎁 La livraison est actuellement 100% GRATUITE partout au Sénégal, sans minimum de commande !
        </p>
        <p>
          Nos délais d&apos;acheminement restent ultra rapides et suivis :
        </p>
        <ul className="space-y-2 pt-1 font-mono text-xs">
          <li className="flex items-start justify-between gap-3 p-2.5 rounded-lg bg-canvas border border-ink/10">
            <div>
              <span className="font-bold text-ink block">Dakar Centre & Ouest (Plateau, Médina, Almadies, Mermoz, Point E)</span>
              <span className="text-muted text-[0.72rem]">Livraison express en 24h chrono</span>
            </div>
            <span className="font-bold text-coral shrink-0">GRATUITE (0 FCFA)</span>
          </li>
          <li className="flex items-start justify-between gap-3 p-2.5 rounded-lg bg-canvas border border-ink/10">
            <div>
              <span className="font-bold text-ink block">Dakar Banlieue (Pikine, Guédiawaye, Rufisque, Keur Massar)</span>
              <span className="text-muted text-[0.72rem]">Livraison express en 24h</span>
            </div>
            <span className="font-bold text-coral shrink-0">GRATUITE (0 FCFA)</span>
          </li>
          <li className="flex items-start justify-between gap-3 p-2.5 rounded-lg bg-canvas border border-ink/10">
            <div>
              <span className="font-bold text-ink block">Régions du Sénégal (Thiès, Mbour, Saint-Louis, Kaolack, etc.)</span>
              <span className="text-muted text-[0.72rem]">Expédition sécurisée sous 48h à 72h</span>
            </div>
            <span className="font-bold text-coral shrink-0">GRATUITE (0 FCFA)</span>
          </li>
        </ul>
      </div>
    ),
  },
  {
    category: 'Paiement à la Livraison',
    question: 'Quels sont les moyens de paiement acceptés à la livraison ?',
    answer: (
      <div className="space-y-2 text-xs sm:text-sm text-ink-soft leading-relaxed">
        <p>
          Chez <strong>momoShop</strong>, le paiement s’effectue <strong>exclusivement à la livraison</strong> après réception et inspection de votre t-shirt :
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <div className="p-3 bg-canvas rounded-xl border border-ink/10 flex flex-col justify-between">
            <span className="font-display font-black text-sm text-[#0066cc] flex items-center gap-1.5">
              Wave 💙
            </span>
            <span className="text-[0.72rem] text-muted mt-1 font-mono">0 frais, instantané auprès du coursier.</span>
          </div>
          <div className="p-3 bg-canvas rounded-xl border border-ink/10 flex flex-col justify-between">
            <span className="font-display font-black text-sm text-[#cc5200] flex items-center gap-1.5">
              Orange Money 🧡
            </span>
            <span className="text-[0.72rem] text-muted mt-1 font-mono">Transfert direct ou paiement marchand.</span>
          </div>
          <div className="p-3 bg-canvas rounded-xl border border-ink/10 flex flex-col justify-between">
            <span className="font-display font-black text-sm text-ink flex items-center gap-1.5">
              Espèces 💵
            </span>
            <span className="text-[0.72rem] text-muted mt-1 font-mono">Remise directe au livreur (prévoir l’appoint).</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    category: 'Entretien & Longévité',
    question: 'Comment entretenir et laver mon t-shirt pour préserver le col et l’éclat ?',
    answer: (
      <div className="space-y-2 text-xs sm:text-sm text-ink-soft leading-relaxed">
        <p>
          Notre coton mercerisé peigné est conçu pour garder son éclat et sa structure pendant des années en respectant ces quelques conseils simples :
        </p>
        <ul className="list-disc pl-5 space-y-1 text-muted text-xs sm:text-sm">
          <li>Lavage en machine à 30°C ou lavage doux à la main, de préférence sur l&apos;envers.</li>
          <li>Ne pas utiliser de chlore ni d’agents blanchissants abrasifs.</li>
          <li>Séchage naturel à l’air libre sur cintre (éviter le sèche-linge haute température).</li>
          <li>Repassage à température moyenne sur l&apos;envers. Le col restera parfaitement tendu et structuré !</li>
        </ul>
      </div>
    ),
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" aria-label="Foire Aux Questions" className="py-12 sm:py-16 bg-canvas border-t-2 border-ink/10">
      <div className="container-x">
        {/* Header */}
        <div className="max-w-2xl mb-10 sm:mb-12">
          <div className="eyebrow mb-2 text-[0.68rem] sm:text-[0.72rem] py-1 px-3">
            QUESTIONS FRÉQUENTES • FAQ
          </div>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-black text-ink uppercase tracking-tight">
            Tout ce que vous devez savoir
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
            Matière, coupe ajustée, délais de livraison à Dakar et garanties : retrouvez les réponses à vos questions les plus courantes.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-3 sm:space-y-4 max-w-4xl">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border-2 border-ink bg-paper shadow-pop transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left transition-colors hover:bg-canvas/50"
                >
                  <div className="space-y-1 pr-2">
                    <span className="font-mono text-[0.68rem] font-bold uppercase tracking-wider text-coral block">
                      {faq.category}
                    </span>
                    <span className="font-display font-black text-base sm:text-lg text-ink uppercase tracking-tight leading-snug block">
                      {faq.question}
                    </span>
                  </div>

                  <div
                    className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl border-2 border-ink transition-transform duration-200 ${
                      isOpen ? 'bg-acid rotate-180' : 'bg-canvas'
                    }`}
                  >
                    <svg
                      className="w-4 h-4 text-ink"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 border-t border-dashed border-ink/15 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp Assistance Banner */}
        <div className="mt-10 max-w-4xl rounded-2xl border-2 border-ink bg-paper p-6 sm:p-8 shadow-pop flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="font-mono text-xs font-bold text-whatsapp uppercase tracking-wider block">
              ● Assistance en direct
            </span>
            <h3 className="font-display font-black text-lg sm:text-xl text-ink uppercase">
              Une question spécifique sur votre commande ?
            </h3>
            <p className="text-xs sm:text-sm text-muted max-w-lg">
              Notre équipe à Dakar vous répond personnellement en moins de 5 minutes sur WhatsApp.
            </p>
          </div>
          <a
            href={whatsappUrl('Bonjour momoShop ! J\'ai une question concernant vos t-shirts.')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-whatsapp px-6 py-3 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-ink shadow-[3px_3px_0_0_#0d0d11] transition-all hover:bg-[#34e277] hover:-translate-y-0.5 shrink-0"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z" />
            </svg>
            <span>Poser une question</span>
          </a>
        </div>
      </div>
    </section>
  );
}
