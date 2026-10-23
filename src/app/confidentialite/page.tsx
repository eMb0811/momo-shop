import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité',
  description: 'Politique de protection des données personnelles de la boutique momoShop.',
};

export default function ConfidentialitePage() {
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
      <main className="container-x py-12 max-w-3xl">
        <div className="eyebrow mb-3">INFORMATIONS LÉGALES</div>
        <h1 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-ink mb-2">
          Politique de Confidentialité
        </h1>
        <p className="font-mono text-xs text-muted mb-8">
          Dernière mise à jour : 16 octobre 2026
        </p>

        <div className="space-y-8 text-sm sm:text-base leading-relaxed text-ink/90">
          <section className="rounded-2xl border border-ink/10 bg-paper p-6 shadow-xs">
            <h2 className="font-display text-lg font-bold text-ink uppercase mb-2">
              1. Responsable du traitement
            </h2>
            <p className="text-muted">
              Les données personnelles collectées sur le site <strong>momoShop</strong> sont traitées par momoShop SARL, société immatriculée au registre du commerce de Dakar, Sénégal. Contact délégué à la protection des données : <code className="bg-canvas px-1.5 py-0.5 rounded font-mono text-xs text-coral">privacy@momoshop.sn</code>.
            </p>
          </section>

          <section className="rounded-2xl border border-ink/10 bg-paper p-6 shadow-xs">
            <h2 className="font-display text-lg font-bold text-ink uppercase mb-2">
              2. Données collectées
            </h2>
            <p className="text-muted mb-3">
              Nous collectons uniquement les informations strictement nécessaires à la préparation et à l&apos;expédition de vos commandes de t-shirts :
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted text-sm">
              <li>Nom et prénom du destinataire</li>
              <li>Numéro de téléphone et identifiant WhatsApp (pour la confirmation et le suivi de livraison)</li>
              <li>Adresse de livraison complète à Dakar ou en région</li>
              <li>Articles sélectionnés (teintes, tailles, quantités)</li>
            </ul>
            <p className="mt-3 text-xs text-muted">
              Aucune coordonnée bancaire n&apos;est stockée sur nos serveurs. Les règlements s&apos;effectuent directement à la livraison selon les modalités convenues lors de votre commande sur WhatsApp.
            </p>
          </section>

          <section className="rounded-2xl border border-ink/10 bg-paper p-6 shadow-xs">
            <h2 className="font-display text-lg font-bold text-ink uppercase mb-2">
              3. Finalités du traitement
            </h2>
            <p className="text-muted mb-2">
              Vos informations sont utilisées pour :
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted text-sm">
              <li>Préparer et acheminer vos colis de t-shirts en coton mercerisé.</li>
              <li>Vous transmettre les confirmations et mises à jour de livraison via WhatsApp.</li>
              <li>Assurer le service après-vente et la gestion d&apos;éventuels échanges de taille.</li>
            </ul>
            <p className="mt-3 text-xs text-muted">
              Nous ne vendons, ne louons et ne transmettons aucune donnée personnelle à des fins publicitaires tierces.
            </p>
          </section>

          <section className="rounded-2xl border border-ink/10 bg-paper p-6 shadow-xs">
            <h2 className="font-display text-lg font-bold text-ink uppercase mb-2">
              4. Durée de conservation & Vos droits
            </h2>
            <p className="text-muted text-sm">
              Conformément à la réglementation sur la protection des données, vous disposez d&apos;un droit d&apos;accès, de rectification et d&apos;effacement de vos données personnelles à tout moment. Vous pouvez exercer ce droit par simple courriel à <code className="bg-canvas px-1.5 py-0.5 rounded font-mono text-xs text-coral">contact@momoshop.sn</code>.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-ink/10 bg-paper py-6 text-center text-xs text-muted font-mono">
        © 2026 momoShop Sénégal 🇸🇳 • Atelier de confection textile
      </footer>
    </div>
  );
}
