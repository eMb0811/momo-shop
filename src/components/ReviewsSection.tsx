'use client';

import React from 'react';
import { whatsappUrl } from '@/lib/shop';

interface Review {
  name: string;
  location: string;
  rating: number;
  sizeBought: string;
  quote: string;
  badge: string;
  date: string;
}

const REVIEWS: Review[] = [
  {
    name: 'Moussa D.',
    location: 'Plateau, Dakar',
    rating: 5,
    sizeBought: 'Taille L • Noir Onyx',
    quote:
      'Franchement le col est impressionnant ! Il reste parfaitement plaqué au cou sans bâiller, même après une dizaine de lavages. Le coton mercerisé offre un toucher soyeux très haut de gamme. Rien à voir avec un t-shirt ordinaire.',
    badge: 'Livré en 3h au Plateau • Wave',
    date: 'Il y a 3 jours',
  },
  {
    name: 'Cheikh Tidiane B.',
    location: 'Point E, Dakar',
    rating: 5,
    sizeBought: 'Taille M • Vert Forêt',
    quote:
      'La coupe athlétique est exactement ce que je cherchais : les manches s’ajustent impeccablement aux biceps et le buste est cintré sans compresser. Tissu respirant même sous le soleil de Dakar.',
    badge: 'Livraison Express Point E • OM',
    date: 'Il y a 5 jours',
  },
  {
    name: 'Aminata S.',
    location: 'Almadies, Dakar',
    rating: 5,
    sizeBought: 'Taille M • Terracotta Studio',
    quote:
      'Acheté en cadeau pour mon époux. Il a adoré la nuance Terracotta et la tenue très nette du col rond. Le coursier était ponctuel aux Almadies et a attendu qu’il valide la taille. Service impeccable !',
    badge: 'Achat vérifié WhatsApp • Espèces',
    date: 'La semaine dernière',
  },
  {
    name: 'Ibrahima N.',
    location: 'Mermoz, Dakar',
    rating: 5,
    sizeBought: 'Taille XL • Bleu Royal',
    quote:
      'À 2 500 FCFA, c’est de loin le meilleur rapport qualité-prix de Dakar pour un basique premium. Le col ne gondole pas et l’éclat de la couleur reste intact. Déjà 5 commandes passées !',
    badge: 'Client fidèle • 5 commandes',
    date: 'Il y a 2 semaines',
  },
];

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex items-center gap-1 text-acid">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          className="w-4 h-4 fill-current drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]"
          viewBox="0 0 24 24"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

export function ReviewsSection() {
  return (
    <section aria-label="Avis clients vérifiés" className="py-12 sm:py-16 bg-canvas border-t-2 border-ink/10">
      <div className="container-x">
        {/* Header & Social Proof Intro */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div>
            <div className="eyebrow mb-2 text-[0.68rem] sm:text-[0.72rem] py-1 px-3">
              AVIS VÉRIFIÉS DAKAR • NOTE 4.9/5
            </div>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-black text-ink uppercase tracking-tight">
              Ce que Dakar dit de nos T-Shirts
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-muted max-w-xl leading-relaxed">
              Plus de 500 passionnés conquis par la tenue irréprochable du col ras du cou, la coupe athlétique et la douceur satinée du coton mercerisé.
            </p>
          </div>

          {/* Social Proof Badge / Trust Summary */}
          <div className="flex items-center gap-4 rounded-2xl border-2 border-ink bg-paper p-4 shadow-pop">
            <div className="text-center border-r border-ink/15 pr-4">
              <span className="font-display text-3xl font-black text-ink">4.9</span>
              <span className="font-mono text-xs text-muted block">/ 5.0</span>
            </div>
            <div className="space-y-1">
              <StarRating count={5} />
              <span className="font-mono text-[0.72rem] font-bold text-ink block">
                +380 avis clients vérifiés
              </span>
              <span className="font-mono text-[0.68rem] text-muted block">
                Dakar & Régions du Sénégal 🇸🇳
              </span>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {REVIEWS.map((review, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-xl sm:rounded-2xl border-2 border-ink bg-paper p-4 sm:p-5 shadow-pop transition-all duration-200 hover:-translate-y-1 hover:shadow-pop-lg"
            >
              <div>
                {/* Rating & Size Row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <StarRating count={review.rating} />
                  <span className="font-mono text-[0.68rem] font-bold text-ink/70 bg-canvas px-2 py-0.5 rounded border border-ink/10">
                    {review.date}
                  </span>
                </div>

                {/* Size bought tag */}
                <div className="inline-block mb-3">
                  <span className="font-mono text-[0.7rem] font-bold text-coral bg-coral/10 border border-coral/30 px-2.5 py-0.5 rounded-full">
                    {review.sizeBought}
                  </span>
                </div>

                {/* Quote */}
                <p className="text-xs sm:text-sm text-ink-soft leading-relaxed italic mb-4">
                  « {review.quote} »
                </p>
              </div>

              {/* Author footer */}
              <div className="pt-3 border-t border-dashed border-ink/15">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-black text-sm text-ink uppercase">
                      {review.name}
                    </h4>
                    <p className="text-[0.72rem] font-mono text-muted">{review.location}</p>
                  </div>
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-whatsapp/20 text-whatsapp border border-whatsapp"
                    title="Acheteur vérifié"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>

                {/* Badge verification detail */}
                <div className="mt-2 text-[0.68rem] font-mono text-muted flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-whatsapp" />
                  <span>{review.badge}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom review call to action */}
        <div className="mt-8 rounded-2xl border-2 border-ink bg-[#141416] p-5 sm:p-6 text-white shadow-pop flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-display font-black text-base sm:text-lg uppercase text-white">
              Vous avez reçu votre t-shirt momoShop ?
            </h3>
            <p className="text-xs sm:text-sm text-white/80 font-sans">
              Partagez votre retour en photo ou vidéo sur WhatsApp pour figurer dans notre sélection !
            </p>
          </div>
          <a
            href={whatsappUrl('Bonjour momoShop ! Je souhaite partager mon avis sur ma commande.')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-acid px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-ink shadow-[2px_2px_0_0_#ffffff] transition-transform hover:-translate-y-0.5 shrink-0"
          >
            <span>Envoyer un avis sur WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
