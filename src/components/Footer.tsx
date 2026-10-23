'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { WHATSAPP_DISPLAY, whatsappUrl } from '@/lib/shop';

interface FooterProps {
  onOpenSizeGuide: () => void;
}

export function Footer({ onOpenSizeGuide }: FooterProps) {
  return (
    <footer className="mt-20 border-t-2 border-ink bg-paper pt-16 pb-12">
      <div className="container-x">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-xl border-2 border-ink bg-paper p-1 shadow-[2px_2px_0_0_var(--color-ink)]">
                <Image
                  src="/images/logo.png"
                  alt="momoShop Logo"
                  fill
                  sizes="40px"
                  className="object-contain p-1"
                />
              </div>
              <span className="font-display text-2xl font-black text-ink uppercase">
                momo<span className="text-coral">Shop</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              La boutique spécialisée du t-shirt à coupe ajustée athlétique en pur coton mercerisé. Col rond structuré au ras du cou, manches ajustées aux biceps et toucher soyeux haut de gamme.
            </p>

            <div className="flex flex-col gap-1.5 pt-2 font-mono text-[0.72rem] text-muted">
              <span className="border-b border-dashed border-ink/15 pb-1">
                ✓ 100% Coton Peigné Mercerisé Lisse
              </span>
              <span className="border-b border-dashed border-ink/15 pb-1">
                ✓ Col Rond Structuré au Ras du Cou
              </span>
              <span className="border-b border-dashed border-ink/15 pb-1">
                ✓ Commandes Directes & Suivi WhatsApp
              </span>
            </div>
          </div>

          {/* Nuances Col */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ink mb-4">
              Nuances Disponibles
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-muted">
              <li><Link href="#catalogue" className="hover:text-coral transition-colors">T-Shirt Noir</Link></li>
              <li><Link href="#catalogue" className="hover:text-coral transition-colors">T-Shirt Blanc</Link></li>
              <li><Link href="#catalogue" className="hover:text-coral transition-colors">T-Shirt Vert Sauge</Link></li>
              <li><Link href="#catalogue" className="hover:text-coral transition-colors">T-Shirt Terracotta</Link></li>
              <li><Link href="#catalogue" className="hover:text-coral transition-colors">T-Shirt Bleu Minuit</Link></li>
              <li><Link href="#catalogue" className="hover:text-coral transition-colors">T-Shirt Jaune Safran</Link></li>
            </ul>
          </div>

          {/* Informations Col */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ink mb-4">
              Informations
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-muted">
              <li>
                <Link href="#catalogue" className="hover:text-coral transition-colors">
                  Catalogue Complet
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenSizeGuide}
                  className="hover:text-coral transition-colors text-left"
                >
                  Guide des Tailles ↗
                </button>
              </li>
              <li>
                <Link href="/confidentialite" className="hover:text-coral transition-colors">
                  Politique de Confidentialité
                </Link>
              </li>
              <li>
                <a
                  href="mailto:contact@momoshop.sn"
                  className="hover:text-coral transition-colors"
                >
                  contact@momoshop.sn
                </a>
              </li>
            </ul>
          </div>

          {/* WhatsApp Direct Col */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ink mb-4">
              Commandes WhatsApp
            </h4>
            <p className="text-xs text-muted leading-relaxed mb-3">
              Notre équipe répond directement à vos messages pour vous conseiller sur les coupes, confirmer les tailles et organiser votre livraison.
            </p>
            <a
              href={whatsappUrl('Bonjour momoShop ! Je souhaite passer une commande.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-xs font-bold text-ink bg-whatsapp/20 hover:bg-whatsapp/40 px-3 py-2 rounded-xl border border-whatsapp transition-colors"
            >
              <span>WhatsApp : {WHATSAPP_DISPLAY}</span>
            </a>
            <p className="mt-3 font-mono text-[0.7rem] text-muted">
              Disponible du lundi au samedi • 9h00 - 20h00
            </p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-ink/10 pt-6 text-xs text-muted font-mono">
          <p>© 2026 momoShop Sénégal 🇸🇳 • T-Shirts Coton Mercerisé Coupe Ajustée.</p>
          <div className="flex gap-4">
            <Link href="/confidentialite" className="hover:text-ink transition-colors">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
