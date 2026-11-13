import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { WHATSAPP_DISPLAY, whatsappUrl } from '@/lib/shop';

export const metadata: Metadata = {
  title: 'Livraison & Échanges de Taille',
  description:
    'Découvrez les zones de livraison à Dakar (24h) et en régions du Sénégal (48h-72h), nos tarifs forfaitaires et notre protocole d’échange de taille sous 48h.',
  alternates: {
    canonical: 'https://momoshop.sn/livraison-retours',
  },
};

const ZONES = [
  {
    name: 'Dakar Centre',
    neighborhoods: 'Plateau, Médina, Fann, Point E, Fass, Colobane, Gueule Tapée',
    price: 'GRATUITE (0 FCFA)',
    delay: '24h Express',
    badge: 'Offerte 🎁',
  },
  {
    name: 'Dakar Ouest & Nord',
    neighborhoods: 'Almadies, Ngor, Ouakam, Yoff, Mermoz, Sacré-Cœur, Liberté 1-6, Maristes',
    price: 'GRATUITE (0 FCFA)',
    delay: '24h Express',
    badge: 'Offerte 🎁',
  },
  {
    name: 'Dakar Banlieue',
    neighborhoods: 'Pikine, Guédiawaye, Keur Massar, Rufisque, Thiaroye, Bargny, Diamniadio',
    price: 'GRATUITE (0 FCFA)',
    delay: '24h Express',
    badge: 'Offerte 🎁',
  },
  {
    name: 'Régions du Sénégal',
    neighborhoods: 'Thiès, Mbour, Saly, Saint-Louis, Kaolack, Touba, Ziguinchor, Diourbel, Tamba',
    price: 'GRATUITE (0 FCFA)',
    delay: '48h à 72h',
    badge: 'Offerte 🎁',
  },
];

export default function LivraisonRetoursPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col justify-between">
      {/* Mini Header */}
      <header className="border-b-2 border-ink bg-paper py-4">
        <div className="container-x flex items-center justify-between">
          <Link href="/" className="font-display text-2xl font-black text-ink uppercase">
            momo<span className="text-coral">Shop</span>
          </Link>
          <Link
            href="/"
            className="rounded-full border-2 border-ink bg-paper px-4 py-1.5 font-mono text-xs font-bold uppercase text-ink shadow-[2px_2px_0_0_var(--color-ink)] hover:bg-acid transition-all"
          >
            ← Retour à la boutique
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-x py-12 max-w-4xl flex-1">
        <div className="eyebrow mb-3">EXPÉDITION & GARANTIE SÉNÉGAL</div>
        <h1 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-ink mb-2">
          Livraison & Échanges de Taille
        </h1>
        <p className="font-mono text-xs text-muted mb-8">
          Service de messagerie urbaine et interurbaine • Dakar & ensemble des régions
        </p>

        {/* Promo Free Delivery Banner */}
        <div className="mb-8 rounded-2xl border-2 border-ink bg-acid p-4 sm:p-5 shadow-pop flex items-center gap-3">
          <span className="text-2xl sm:text-3xl shrink-0">🎁</span>
          <div>
            <h3 className="font-display text-sm sm:text-base font-black uppercase text-ink">
              Offre Spéciale : Livraison 100% Gratuite partout au Sénégal !
            </h3>
            <p className="text-xs sm:text-sm text-ink-soft mt-0.5">
              Pour le moment, tous les frais d&apos;expédition sont pris en charge par momoShop à Dakar et dans toutes les régions, sans minimum d&apos;achat.
            </p>
          </div>
        </div>

        {/* Zones and Fees Section */}
        <section className="mb-12">
          <h2 className="font-display text-xl sm:text-2xl font-black uppercase text-ink mb-4">
            1. Zones de Livraison & Tarifs Forfaitaires
          </h2>
          <p className="text-muted text-sm sm:text-base leading-relaxed mb-6">
            Nos coursiers dédiés sillonnent Dakar tous les jours pour vous livrer directement à domicile, à votre bureau ou à un point de repère convenu. Pour les régions, nous collaborons avec des transporteurs express partenaires fiables.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ZONES.map((zone) => (
              <div
                key={zone.name}
                className="flex flex-col justify-between rounded-2xl border-2 border-ink bg-paper p-5 shadow-pop hover:-translate-y-0.5 hover:shadow-pop-lg transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display text-lg font-bold text-ink uppercase">
                      {zone.name}
                    </span>
                    <span className="rounded-full border border-ink/20 bg-acid/40 px-2.5 py-0.5 font-mono text-[0.7rem] font-bold text-ink uppercase">
                      {zone.badge}
                    </span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed mb-4">
                    {zone.neighborhoods}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-ink/10 pt-3">
                  <div>
                    <span className="block font-mono text-[0.7rem] text-muted uppercase">Délai estimé</span>
                    <span className="font-mono text-xs font-bold text-ink">{zone.delay}</span>
                  </div>
                  <div className="text-right">
                    <span className="block font-mono text-[0.7rem] text-muted uppercase">Tarif livraison</span>
                    <span className="font-display text-lg font-black text-coral">{zone.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How Delivery Works */}
        <section className="mb-12 rounded-2xl border-2 border-ink bg-paper p-6 sm:p-8 shadow-pop">
          <h2 className="font-display text-xl sm:text-2xl font-black uppercase text-ink mb-4">
            2. Comment se Déroule Votre Livraison ?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-sans text-sm">
            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink bg-acid font-display text-lg font-black text-ink shadow-[2px_2px_0_0_var(--color-ink)]">
                1
              </div>
              <h3 className="font-bold text-ink uppercase text-sm">Confirmation WhatsApp</h3>
              <p className="text-xs text-muted leading-relaxed">
                Dès la commande enregistrée, notre équipe vous contacte sur WhatsApp pour confirmer les articles, tailles et le créneau qui vous convient.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink bg-acid font-display text-lg font-black text-ink shadow-[2px_2px_0_0_var(--color-ink)]">
                2
              </div>
              <h3 className="font-bold text-ink uppercase text-sm">Appel du Coursier</h3>
              <p className="text-xs text-muted leading-relaxed">
                Le livreur vous appelle 15 à 30 minutes avant son arrivée pour affiner le point de repère précis (mosquée, station, pharmacie, etc.).
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink bg-acid font-display text-lg font-black text-ink shadow-[2px_2px_0_0_var(--color-ink)]">
                3
              </div>
              <h3 className="font-bold text-ink uppercase text-sm">Paiement à Réception</h3>
              <p className="text-xs text-muted leading-relaxed">
                Vous réceptionnez votre colis et effectuez le règlement en main propre via Wave, Orange Money ou espèces sans aucun frais caché.
              </p>
            </div>
          </div>
        </section>

        {/* Protocol for Size Exchange */}
        <section className="mb-12">
          <div className="eyebrow mb-2">ENGAGEMENT SÉRÉNITÉ</div>
          <h2 className="font-display text-xl sm:text-2xl font-black uppercase text-ink mb-4">
            3. Protocole d&apos;Échange de Taille sous 48h
          </h2>
          <p className="text-muted text-sm sm:text-base leading-relaxed mb-6">
            Une taille trop ajustée ou trop ample ? Aucun problème. Chez momoShop, nous comprenons qu&apos;une coupe athlétique sur mesure nécessite parfois un ajustement. Vous bénéficiez d&apos;une garantie d&apos;échange sous 48 heures.
          </p>

          <div className="rounded-2xl border border-ink/10 bg-paper p-6 sm:p-8 space-y-6">
            <div className="flex items-start gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-coral text-white font-mono text-xs font-bold shadow-[1.5px_1.5px_0_0_var(--color-ink)]">
                A
              </span>
              <div>
                <h4 className="font-display font-bold uppercase text-ink text-sm sm:text-base">
                  Contactez le support WhatsApp
                </h4>
                <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
                  Envoyez un message WhatsApp au <strong className="text-ink">{WHATSAPP_DISPLAY}</strong> en précisant votre nom, le modèle concerné et la nouvelle taille souhaitée (XS, S, M, L, XL, XXL).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-coral text-white font-mono text-xs font-bold shadow-[1.5px_1.5px_0_0_var(--color-ink)]">
                B
              </span>
              <div>
                <h4 className="font-display font-bold uppercase text-ink text-sm sm:text-base">
                  Réservation immédiate du t-shirt
                </h4>
                <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
                  Nous bloquons immédiatement votre nouvel exemplaire dans notre stock atelier afin d&apos;éviter toute rupture de stock.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-coral text-white font-mono text-xs font-bold shadow-[1.5px_1.5px_0_0_var(--color-ink)]">
                C
              </span>
              <div>
                <h4 className="font-display font-bold uppercase text-ink text-sm sm:text-base">
                  Échange en main propre avec le coursier
                </h4>
                <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
                  Notre coursier repasse à votre adresse. Vous lui remettez le t-shirt non conforme (non lavé, non porté, avec ses étiquettes) et il vous remet instantanément votre nouvelle pièce.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-dashed border-ink/20 bg-canvas/60 p-4 font-mono text-xs text-muted">
              <strong className="text-ink uppercase block mb-1">Règles d&apos;acceptation de l&apos;échange :</strong>
              <p>• Le t-shirt ne doit avoir été ni lavé, ni parfumé, ni détérioré.</p>
              <p>• Les étiquettes momoShop en col et carton d&apos;origine doivent être intactes.</p>
              <p>• La demande doit intervenir dans les 48 heures calendaires suivant la réception initiale.</p>
            </div>
          </div>
        </section>

        {/* WhatsApp Help CTA */}
        <section className="rounded-2xl border-2 border-ink bg-acid/20 p-6 sm:p-8 text-center shadow-pop">
          <h3 className="font-display text-xl sm:text-2xl font-black uppercase text-ink mb-2">
            Une Question sur Votre Livraison ?
          </h3>
          <p className="text-xs sm:text-sm text-muted max-w-lg mx-auto mb-6">
            Notre équipe logistique vous répond en direct sur WhatsApp pour organiser ou décaler un passage de coursier.
          </p>
          <a
            href={whatsappUrl('Bonjour momoShop ! J’ai une question concernant la livraison de ma commande.')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full border-2 border-ink bg-whatsapp px-6 py-3 font-mono text-xs sm:text-sm font-bold uppercase text-ink shadow-[2px_2px_0_0_var(--color-ink)] hover:scale-105 transition-transform"
          >
            <span>Contacter le support logistique WhatsApp ({WHATSAPP_DISPLAY})</span>
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-ink/10 bg-paper py-8 text-center text-xs text-muted font-mono">
        <div className="container-x flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 momoShop Sénégal 🇸🇳 • Logistique & Expéditions Express</p>
          <div className="flex gap-4">
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
