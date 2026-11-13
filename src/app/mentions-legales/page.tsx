import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from '@/lib/shop';

export const metadata: Metadata = {
  title: 'Mentions Légales',
  description:
    'Mentions légales et informations juridiques régissant le site et la boutique momoShop SARL à Dakar, Sénégal.',
  alternates: {
    canonical: 'https://momoshop.sn/mentions-legales',
  },
};

export default function MentionsLegalesPage() {
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
        <div className="eyebrow mb-3">CADRE JURIDIQUE SÉNÉGAL</div>
        <h1 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-ink mb-2">
          Mentions Légales
        </h1>
        <p className="font-mono text-xs text-muted mb-8">
          Dernière révision officielle : 16 octobre 2026
        </p>

        <div className="space-y-6 text-sm sm:text-base leading-relaxed text-ink/90">
          {/* Section 1 */}
          <section className="rounded-2xl border border-ink/10 bg-paper p-6 shadow-xs">
            <h2 className="font-display text-lg font-bold text-ink uppercase mb-3">
              1. Éditeur de la plateforme
            </h2>
            <p className="text-muted mb-3">
              Le présent site web et service de vente en ligne accessible à l&apos;adresse{' '}
              <strong className="text-ink">momoshop.sn</strong> est édité par la société :
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-muted text-sm font-sans">
              <li>
                <strong className="text-ink">Raison sociale :</strong> momoShop SARL
              </li>
              <li>
                <strong className="text-ink">Forme juridique :</strong> Société à Responsabilité Limitée de droit sénégalais
              </li>
              <li>
                <strong className="text-ink">Siège social :</strong> Avenue Cheikh Anta Diop, Fann-Point E, Dakar, Sénégal
              </li>
              <li>
                <strong className="text-ink">Registre du Commerce (RCCM) :</strong> SN.DKR.2024.B.18920
              </li>
              <li>
                <strong className="text-ink">Numéro NINEA :</strong> 009823412 2V2
              </li>
              <li>
                <strong className="text-ink">Courriel officiel :</strong>{' '}
                <a href="mailto:contact@momoshop.sn" className="text-coral hover:underline font-mono">
                  contact@momoshop.sn
                </a>
              </li>
              <li>
                <strong className="text-ink">Support Client & Commandes WhatsApp :</strong>{' '}
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-coral hover:underline font-mono"
                >
                  {WHATSAPP_DISPLAY}
                </a>
              </li>
              <li>
                <strong className="text-ink">Directeur de la publication :</strong> Direction Générale momoShop SARL
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="rounded-2xl border border-ink/10 bg-paper p-6 shadow-xs">
            <h2 className="font-display text-lg font-bold text-ink uppercase mb-3">
              2. Hébergement & Infrastructure technique
            </h2>
            <p className="text-muted text-sm leading-relaxed mb-3">
              Le site est hébergé sur une infrastructure serveur dédiée virtualisée (VPS haute disponibilité) :
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-muted text-sm">
              <li>
                <strong className="text-ink">Serveur applicatif :</strong> Environnement Node.js / Next.js conteneurisé sous Linux Debian LTS
              </li>
              <li>
                <strong className="text-ink">Serveur web frontal / Reverse Proxy :</strong> Caddy Web Server avec gestion automatisée des certificats TLS/SSL via l&apos;autorité de certification Let&apos;s Encrypt (chiffrement RSA 4096 bits & ECDSA)
              </li>
              <li>
                <strong className="text-ink">Supervision & Télémétrie :</strong> Monitoring d&apos;infrastructure avec alerting 24h/7j et protection anti-DDoS en bordure de réseau
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="rounded-2xl border border-ink/10 bg-paper p-6 shadow-xs">
            <h2 className="font-display text-lg font-bold text-ink uppercase mb-3">
              3. Propriété intellectuelle & Droits réservés
            </h2>
            <p className="text-muted text-sm leading-relaxed mb-3">
              L&apos;ensemble des éléments constituant le site momoShop (notamment la marque momoShop, le logo, les visuels de collections de t-shirts, les textes descriptifs, les éléments graphiques et la charte chromatique pop-streetwear) est la propriété exclusive de momoShop SARL ou fait l&apos;objet d&apos;une licence d&apos;exploitation légale.
            </p>
            <p className="text-muted text-sm leading-relaxed">
              Toute reproduction, représentation, diffusion ou exploitation partielle ou totale des contenus sans accord préalable écrit de momoShop SARL est formellement prohibée et sanctionnée par les dispositions du Code de la Propriété Intellectuelle sénégalais et des conventions internationales de l&apos;OAPI.
            </p>
          </section>

          {/* Section 4 */}
          <section className="rounded-2xl border border-ink/10 bg-paper p-6 shadow-xs">
            <h2 className="font-display text-lg font-bold text-ink uppercase mb-3">
              4. Données personnelles & Conformité CDP
            </h2>
            <p className="text-muted text-sm leading-relaxed mb-3">
              momoShop SARL applique scrupuleusement les dispositions de la loi sénégalaise n° 2008-12 du 25 janvier 2008 relative à la protection des données à caractère personnel et les recommandations de la Commission de Protection des Données Personnelles (CDP) du Sénégal.
            </p>
            <p className="text-muted text-sm leading-relaxed mb-3">
              Les données personnelles transmises (nom, contact téléphonique, adresse de livraison à Dakar ou dans les régions) sont exclusivement réservées à la bonne exécution logistique des commandes et au service client via WhatsApp.
            </p>
            <p className="text-xs text-muted">
              Pour consulter le détail de vos droits d&apos;accès, de rectification et de suppression, veuillez consulter notre{' '}
              <Link href="/confidentialite" className="text-coral hover:underline font-bold">
                Politique de Confidentialité
              </Link>.
            </p>
          </section>

          {/* Section 5 */}
          <section className="rounded-2xl border border-ink/10 bg-paper p-6 shadow-xs">
            <h2 className="font-display text-lg font-bold text-ink uppercase mb-3">
              5. Droit applicable & Litiges
            </h2>
            <p className="text-muted text-sm leading-relaxed">
              Les présentes mentions légales sont régies par le droit de la République du Sénégal. En cas de différend relatif à l&apos;interprétation ou à l&apos;exécution du service, et à défaut de règlement amiable entre les parties, compétence expresse est attribuée aux tribunaux compétents de Dakar.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-ink/10 bg-paper py-8 text-center text-xs text-muted font-mono">
        <div className="container-x flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 momoShop Sénégal 🇸🇳 • Atelier de confection textile & prêt-à-porter urbain</p>
          <div className="flex gap-4">
            <Link href="/livraison-retours" className="hover:text-coral transition-colors">
              Livraison & Retours
            </Link>
            <Link href="/cgv" className="hover:text-coral transition-colors">
              CGV
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
