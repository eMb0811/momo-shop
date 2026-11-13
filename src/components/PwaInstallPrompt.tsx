'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const STORAGE_KEY = 'momoshop_pwa_install_dismissed_v1';

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true); // default true to avoid flash
  const [isDismissed, setIsDismissed] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 1. Check standalone mode (already installed as PWA)
    const checkStandalone = (): boolean => {
      if (typeof window === 'undefined') return false;
      const isDisplayStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isNavStandalone = Boolean(
        (window.navigator as unknown as { standalone?: boolean }).standalone
      );
      const isAndroidApp = document.referrer.startsWith('android-app://');
      return isDisplayStandalone || isNavStandalone || isAndroidApp;
    };

    const standalone = checkStandalone();
    setIsStandalone(standalone);

    // 2. Check if user already dismissed the prompt
    const dismissed = localStorage.getItem(STORAGE_KEY) === 'true';
    setIsDismissed(dismissed);

    if (standalone || dismissed) {
      return;
    }

    // 3. Detect iOS device
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIos(isIosDevice);

    // 4. Capture beforeinstallprompt for Android / Chrome / Edge
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!mounted || isStandalone || isDismissed) {
    return null;
  }

  // Only show if we either have an install prompt captured OR we are on iOS Safari
  const canShowAndroidPrompt = Boolean(deferredPrompt);
  const canShowIosPrompt = isIos;

  if (!canShowAndroidPrompt && !canShowIosPrompt) {
    return null;
  }

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsDismissed(true);
        localStorage.setItem(STORAGE_KEY, 'true');
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.warn('Erreur lors de l’installation PWA', err);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  return (
    <aside
      aria-label="Proposition d’installation de l'application"
      className="fixed bottom-20 md:bottom-6 left-3 right-3 md:left-auto md:right-6 md:max-w-md z-40 rounded-2xl border-2 border-ink bg-paper p-4 shadow-pop animate-fade-in"
    >
      <div className="flex items-start gap-3">
        {/* App Icon */}
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border-2 border-ink bg-canvas p-1 shadow-[2px_2px_0_0_var(--color-ink)]">
          <Image
            src="/images/logo.png"
            alt="momoShop"
            fill
            sizes="48px"
            className="object-contain"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h2 className="font-display text-sm font-black tracking-tight text-ink uppercase">
              Installer momoShop
            </h2>
            <span className="rounded-full border border-ink bg-acid px-1.5 py-0.2 font-mono text-[0.6rem] font-bold text-ink shadow-[1px_1px_0_0_var(--color-ink)]">
              App Web
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted font-sans leading-snug">
            Accès instantané, navigation fluide et catalogue disponible hors-ligne.
          </p>

          {/* Android / Desktop Chrome 1-Click Action */}
          {canShowAndroidPrompt && (
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 rounded-full border-2 border-ink bg-acid px-3.5 py-1.5 font-mono text-xs font-bold text-ink shadow-[2px_2px_0_0_var(--color-ink)] transition-transform active:scale-95 hover:bg-acid/90"
              >
                <span>Installer en 1 clic</span>
                <span>⚡</span>
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="font-mono text-xs text-muted hover:text-ink underline underline-offset-2 px-1"
              >
                Plus tard
              </button>
            </div>
          )}

          {/* iOS Safari Visual Steps */}
          {canShowIosPrompt && !canShowAndroidPrompt && (
            <div className="mt-2.5 rounded-xl border border-ink/15 bg-canvas/70 p-2.5 font-mono text-[0.72rem] text-ink leading-relaxed">
              <div className="font-bold flex items-center gap-1 text-ink">
                <span>Sur iPhone (Safari) :</span>
              </div>
              <ol className="mt-1 space-y-1 list-decimal list-inside text-muted">
                <li>
                  Touchez <span className="font-bold text-ink">Partager</span>{' '}
                  <span className="inline-block rounded border border-ink/30 px-1 py-0.2 text-[0.7rem] bg-paper text-ink font-sans">
                    ⎋
                  </span>
                </li>
                <li>
                  Sélectionnez{' '}
                  <span className="font-bold text-ink">Sur l’écran d’accueil</span>{' '}
                  <span className="inline-block rounded border border-ink/30 px-1 py-0.2 text-[0.7rem] bg-paper text-ink font-sans">
                    ⊞
                  </span>
                </li>
              </ol>
            </div>
          )}
        </div>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Fermer la suggestion d'installation"
          className="absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full border border-ink/20 bg-paper text-ink hover:bg-canvas active:scale-95 text-xs font-bold"
        >
          ✕
        </button>
      </div>
    </aside>
  );
}