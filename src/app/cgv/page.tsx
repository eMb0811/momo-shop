import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from '@/lib/shop';

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente (CGV)',
  description:
    'Conditions Générales de Vente de la boutique momoShop : commandes WhatsApp, tarifs en FCFA, livraison à Dakar et régions, paiement Wave, Orange Money et espèces.',
  alternates: {
    canonical: 'https://momoshop.sn/cgv',
  },
};

export default function CGVPage() {
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

      {/* Main Legal Content */}
      <main className="container-x py-12 max-w-3xl flex-1">
        <div className="eyebrow mb-3">CADRE CONTRACTUEL & COMMERCIAL</div>
        <h1 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-ink mb-2">
          Conditions Générales de Vente
        </h1>
        <p className="font-mono text-xs text-muted mb-8">
          En vigueur à compter du 16 octobre 2026 • République du Sénégal 🇸🇳
        </p>

        <div className="space-y-6 text-sm sm:text-base leading-relaxed text-ink/90">
          {/* Article 1 */}
          <section className="rounded-2xl border border-ink/10 bg-paper p-6 shadow-xs">
            <h2 className="font-display text-lg font-bold text-ink uppercase mb-3">
              Article 1. Préambule & Identification du Vendeur
            </h2>
            <p className="text-muted text-sm leading-relaxed mb-3">
              Les présentes Conditions Générales de Vente (ci-après les « CGV ») régissent l&apos;ensemble des relations commerciales entre :
            </p>
            <p className="text-muted text-sm leading-relaxed mb-3">
              La société <strong className="text-ink">momoShop SARL</strong>, société immatriculée au Registre du Commerce et du Crédit Mobilier de Dakar sous le numéro RCCM <strong className="text-ink">SN.DKR.2024.B.18920</strong> (NINEA : 009823412 2V2), dont le siège social est situé Avenue Cheikh Anta Diop, Dakar, Sénégal (contact email : <code className="bg-canvas px-1.5 py-0.5 rounded font-mono text-xs text-coral">contact@momoshop.sn</code>, téléphone/WhatsApp : <strong className="text-ink">{WHATSAPP_DISPLAY}</strong>), ci-après dénommée « momoShop » ;
            </p>
            <p className="text-muted text-sm leading-relaxed">
              Et toute personne physique ou morale procédant à l&apos;achat d&apos;articles sur la plateforme en ligne <strong className="text-ink">momoshop.sn</strong> ou via le canal officiel WhatsApp, ci-après dénommée le « Client ».
            </p>
          </section>

          {/* Article 2 */}
          <section className="rounded-2xl border border-ink/10 bg-paper p-6 shadow-xs">
            <h2 className="font-display text-lg font-bold text-ink uppercase mb-3">
              Article 2. Produits & Caractéristiques
            </h2>
            <p className="text-muted text-sm leading-relaxed mb-3">
              momoShop commercialise des t-shirts haut de gamme confectionnés en <strong className="text-ink">100% pur coton peigné mercerisé</strong>, dotés d&apos;un <strong className="text-ink">col rond structuré au ras du cou</strong> et d&apos;une <strong className="text-ink">coupe ajustée athlétique (Tailored Fit)</strong> avec manches ajustées aux biceps.
            </p>
            <p className="text-muted text-sm leading-relaxed">
              Chaque produit est proposé en 21 nuances exclusives et en tailles XS, S, M, L, XL et XXL selon les disponibilités affichées en temps réel sur la boutique. Les photographies et descriptifs sont établis avec la plus grande fidélité possible aux teintes réelles.
            </p>
          </section>

          {/* Article 3 */}
          <section className="rounded-2xl border border-ink/10 bg-paper p-6 shadow-xs">
            <h2 className="font-display text-lg font-bold text-ink uppercase mb-3">
              Article 3. Tarifs en Francs CFA (XOF)
            </h2>
            <p className="text-muted text-sm leading-relaxed mb-3">
              Les prix affichés sur le site sont exprimés en <strong className="text-ink">Francs CFA (FCFA / XOF)</strong>, toutes taxes comprises (TTC). Le tarif standard de référence de nos t-shirts est de <strong className="text-coral font-bold">2 500 FCFA l&apos;unité</strong>.
            </p>
            <p className="text-muted text-sm leading-relaxed">
              <strong className="text-coral">Offre spéciale en cours :</strong> Les frais de livraison sont actuellement <strong className="text-ink">100% gratuits et offerts</strong> pour toute commande expédiée à Dakar ou dans les régions du Sénégal.
            </p>
          </section>

          {/* Article 4 */}
          <section className="rounded-2xl border border-ink/10 bg-paper p-6 shadow-xs">
            <h2 className="font-display text-lg font-bold text-ink uppercase mb-3">
              Article 4. Processus de Commande Directe via WhatsApp
            </h2>
            <p className="text-muted text-sm leading-relaxed mb-3">
              Afin d&apos;offrir un service rapide, personnalisé et sans friction au Sénégal, la finalisation des commandes s&apos;opère directement via <strong className="text-ink">WhatsApp</strong> :
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted text-sm">
              <li>Le Client sélectionne ses articles, teintes et tailles sur le catalogue en ligne.</li>
              <li>Le Client clique sur le bouton de commande WhatsApp ou valide son panier d&apos;achat.</li>
              <li>Un message pré-rempli récapitulant les articles et le montant total est transmis instantanément à notre service commercial au <strong className="text-ink">{WHATSAPP_DISPLAY}</strong>.</li>
              <li>Notre équipe confirme immédiatement la disponibilité en stock, recueille l&apos;adresse précise / repère de livraison et programme le passage du coursier.</li>
            </ol>
          </section>

          {/* Article 5 */}
          <section className="rounded-2xl border border-ink/10 bg-paper p-6 shadow-xs">
            <h2 className="font-display text-lg font-bold text-ink uppercase mb-3">
              Article 5. Modalités de Paiement à la Livraison
            </h2>
            <p className="text-muted text-sm leading-relaxed mb-3">
              Aucun paiement en ligne par carte bancaire n&apos;est exigé lors de la commande. Le règlement s&apos;effectue <strong className="text-ink">100% à la livraison</strong> lors de la remise en main propre des articles par notre coursier :
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
              <div className="rounded-xl border border-ink/15 bg-canvas/60 p-3 text-center">
                <span className="block font-mono text-base font-bold text-blue-600 mb-1">Wave 💙</span>
                <span className="text-xs text-muted">Paiement instantané sans frais au coursier</span>
              </div>
              <div className="rounded-xl border border-ink/15 bg-canvas/60 p-3 text-center">
                <span className="block font-mono text-base font-bold text-orange-600 mb-1">Orange Money 🧡</span>
                <span className="text-xs text-muted">Transfert ou paiement marchand direct</span>
              </div>
              <div className="rounded-xl border border-ink/15 bg-canvas/60 p-3 text-center">
                <span className="block font-mono text-base font-bold text-green-700 mb-1">Espèces 💵</span>
                <span className="text-xs text-muted">Remise d&apos;espèces au livreur à réception</span>
              </div>
            </div>
            <p className="text-xs text-muted">
              Le Client s&apos;engage à honorer le montant total de la commande lors de la présentation du colis par le livreur.
            </p>
          </section>

          {/* Article 6 */}
          <section className="rounded-2xl border border-ink/10 bg-paper p-6 shadow-xs">
            <h2 className="font-display text-lg font-bold text-ink uppercase mb-3">
              Article 6. Livraison & Délais d&apos;Acheminement
            </h2>
            <p className="text-muted text-sm leading-relaxed mb-3">
              momoShop assure la livraison sur l&apos;ensemble du territoire sénégalais avec des délais optimisés :
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-muted text-sm mb-3">
              <li>
                <strong className="text-ink">Dakar Express (24h) :</strong> Livraison en 24h ouvrées (Dakar Centre 1 500 FCFA, Dakar Ouest & Nord 2 000 FCFA, Banlieue 2 500 FCFA).
              </li>
              <li>
                <strong className="text-ink">Régions du Sénégal (48h à 72h) :</strong> Expédition sécurisée via nos partenaires de messagerie (Thiès, Mbour, Saint-Louis, Kaolack, Touba, etc. au tarif forfaitaire de 3 500 FCFA).
              </li>
            </ul>
            <p className="text-muted text-sm leading-relaxed">
              Le livreur contacte systématiquement le Client par appel ou WhatsApp avant son passage afin de convenir du créneau horaire exact.
            </p>
          </section>

          {/* Article 7 */}
          <section className="rounded-2xl border border-ink/10 bg-paper p-6 shadow-xs">
            <h2 className="font-display text-lg font-bold text-ink uppercase mb-3">
              Article 7. Politique d&apos;Échange de Taille & Retours
            </h2>
            <p className="text-muted text-sm leading-relaxed mb-3">
              Votre satisfaction quant au tombé et à la carrure de nos t-shirts est notre priorité absolue :
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted text-sm">
              <li>
                <strong className="text-ink">Délai d&apos;échange :</strong> Le Client dispose d&apos;un délai de <strong className="text-ink">48 heures</strong> suivant la réception de son colis pour solliciter un échange de taille (ou de couleur sous réserve de disponibilité).
              </li>
              <li>
                <strong className="text-ink">Conditions d&apos;acceptation :</strong> L&apos;article doit être impérativement retourné dans son état neuf d&apos;origine, non porté, non lavé, exempt de parfum ou traces, avec toutes ses étiquettes d&apos;origine intactes.
              </li>
              <li>
                <strong className="text-ink">Procédure :</strong> Un simple message sur WhatsApp à notre service client permet de planifier le passage de notre coursier pour l&apos;échange.
              </li>
            </ul>
          </section>

          {/* Article 8 */}
          <section className="rounded-2xl border border-ink/10 bg-paper p-6 shadow-xs">
            <h2 className="font-display text-lg font-bold text-ink uppercase mb-3">
              Article 8. Droit Applicable & Règlement des Litiges
            </h2>
            <p className="text-muted text-sm leading-relaxed">
              Les présentes CGV sont soumises à la législation en vigueur en République du Sénégal. En cas de réclamation ou de litige, une solution amiable sera systématiquement recherchée en priorité avec le Client. À défaut d&apos;accord amiable, le litige sera soumis à la juridiction compétente du Tribunal de Commerce de Dakar.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-ink/10 bg-paper py-8 text-center text-xs text-muted font-mono">
        <div className="container-x flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 momoShop Sénégal 🇸🇳 • Conditions Générales de Vente</p>
          <div className="flex gap-4">
            <Link href="/livraison-retours" className="hover:text-coral transition-colors">
              Livraison & Retours
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
