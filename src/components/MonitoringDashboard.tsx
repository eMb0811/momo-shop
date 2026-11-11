'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import type {
  DailyStats,
  DeviceType,
  HealthHistoryPoint,
  MonitoringErrorLog,
  MonitoringEvent,
  ProductAnalytics,
  SystemHealthReport,
  TrafficSource,
} from '@/lib/monitoring';
import type { CategoryFilter, Product, Size } from '@/lib/types';
import { formatPrice } from '@/lib/shop';

interface StatsApiResponse {
  updatedAt: string;
  isDefaultPassword: boolean;
  totals: {
    pageViews: number;
    uniqueVisitorsAllTime: number;
    productViews: number;
    addToCarts: number;
    whatsappOrders: number;
    whatsappFloatingClicks: number;
    potentialRevenueCfa: number;
    errorsCount: number;
  };
  devices: Record<DeviceType, number>;
  sources: Record<TrafficSource, number>;
  sizesDemand: Record<Size, number>;
  categoriesDemand: Record<CategoryFilter, number>;
  daily: Omit<DailyStats, 'visitorHashes'>[];
  productsAnalytics: ProductAnalytics[];
  recentEvents: MonitoringEvent[];
  recentErrors: MonitoringErrorLog[];
  healthHistory: HealthHistoryPoint[];
  health: SystemHealthReport;
  catalogProducts: Product[];
}

type ActiveTab = 'analytics' | 'system' | 'stock' | 'logs';

function formatDuration(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (d > 0) return `${d}j ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function eventMeta(type: MonitoringEvent['type']): {
  label: string;
  dot: string;
  pill: string;
} {
  switch (type) {
    case 'whatsapp_product_order':
      return {
        label: 'Commande WhatsApp',
        dot: 'bg-emerald-400',
        pill: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      };
    case 'whatsapp_cart_order':
      return {
        label: 'Panier WhatsApp',
        dot: 'bg-emerald-400',
        pill: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
      };
    case 'add_to_cart':
      return {
        label: 'Ajout Panier',
        dot: 'bg-orange-400',
        pill: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
      };
    case 'product_view':
      return {
        label: 'Vue Produit',
        dot: 'bg-sky-400',
        pill: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
      };
    case 'filter_select':
      return {
        label: 'Filtre Catalogue',
        dot: 'bg-violet-400',
        pill: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
      };
    case 'whatsapp_floating_click':
      return {
        label: 'Contact WhatsApp',
        dot: 'bg-teal-400',
        pill: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
      };
    default:
      return {
        label: 'Visite Page',
        dot: 'bg-zinc-400',
        pill: 'bg-zinc-800 text-zinc-300 border-zinc-700',
      };
  }
}

export function MonitoringDashboard({ initialAuthorized }: { initialAuthorized: boolean }) {
  const [authorized, setAuthorized] = useState(initialAuthorized);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [data, setData] = useState<StatsApiResponse | null>(null);
  const [loading, setLoading] = useState(initialAuthorized);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('analytics');
  const [statusBanner, setStatusBanner] = useState<{ type: 'ok' | 'err'; text: string } | null>(
    null
  );

  // Stock editor local state
  const [stockSearch, setStockSearch] = useState('');
  const [editingProducts, setEditingProducts] = useState<
    Record<string, { priceCfa: number; stock: Record<Size, number>; saving?: boolean }>
  >({});

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/monitoring/stats', { cache: 'no-store' });
      if (res.status === 401) {
        setAuthorized(false);
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error('Erreur lors du chargement des métriques');
      const json = (await res.json()) as StatsApiResponse;
      setData(json);
      setAuthorized(true);

      setEditingProducts((prev) => {
        const next = { ...prev };
        for (const p of json.catalogProducts) {
          if (!next[p.id]) {
            next[p.id] = {
              priceCfa: p.price_cfa,
              stock: { ...p.stock },
            };
          }
        }
        return next;
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authorized) {
      void fetchStats();
    }
  }, [authorized, fetchStats]);

  useEffect(() => {
    if (!authorized || !autoRefresh) return;
    const timer = setInterval(() => {
      void fetchStats();
    }, 10000);
    return () => clearInterval(timer);
  }, [authorized, autoRefresh, fetchStats]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      const res = await fetch('/api/monitoring/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setAuthError(json.error ?? 'Mot de passe invalide');
      } else {
        setAuthorized(true);
        setLoading(true);
        void fetchStats();
      }
    } catch {
      setAuthError('Erreur réseau lors de la connexion');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/monitoring/auth', { method: 'DELETE' });
    setAuthorized(false);
    setData(null);
    setPassword('');
  };

  const handleTestWebhook = async () => {
    setStatusBanner(null);
    const res = await fetch('/api/monitoring/actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'test_webhook' }),
    });
    const json = (await res.json()) as { sent?: boolean; reason?: string };
    if (json.sent) {
      setStatusBanner({
        type: 'ok',
        text: 'Notification de test envoyée avec succès sur votre Webhook !',
      });
    } else {
      setStatusBanner({
        type: 'err',
        text: `Échec d’envoi Webhook : ${json.reason ?? 'Vérifiez ALERT_WEBHOOK_URL dans .env'}`,
      });
    }
  };

  const handleSaveProduct = async (productId: string) => {
    const edit = editingProducts[productId];
    if (!edit) return;

    setEditingProducts((prev) => ({
      ...prev,
      [productId]: { ...edit, saving: true },
    }));
    setStatusBanner(null);

    try {
      const res = await fetch('/api/monitoring/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_product',
          productId,
          priceCfa: edit.priceCfa,
          stock: edit.stock,
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setStatusBanner({ type: 'err', text: json.error ?? 'Échec de sauvegarde' });
      } else {
        setStatusBanner({
          type: 'ok',
          text: 'Catalogue products.json mis à jour en direct !',
        });
        await fetchStats();
      }
    } finally {
      setEditingProducts((prev) => ({
        ...prev,
        [productId]: { ...(prev[productId] ?? edit), saving: false },
      }));
    }
  };

  const handleClearErrors = async () => {
    await fetch('/api/monitoring/actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'clear_errors' }),
    });
    setStatusBanner({ type: 'ok', text: 'Journal des erreurs purgé.' });
    await fetchStats();
  };

  const handleResetAnalytics = async () => {
    if (!window.confirm('Confirmer la remise à zéro de toutes les statistiques boutique ?')) {
      return;
    }
    await fetch('/api/monitoring/actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reset_analytics' }),
    });
    setStatusBanner({ type: 'ok', text: 'Statistiques réinitialisées.' });
    await fetchStats();
  };

  const handleExportJson = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `momoshop-monitoring-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCsv = () => {
    if (!data) return;
    const rows = [
      [
        'Date',
        'Visiteurs Uniques',
        'Pages Vues',
        'Vues Produit',
        'Ajouts Panier',
        'Commandes WhatsApp',
        'CA Potentiel FCFA',
        'Erreurs',
      ],
      ...data.daily.map((d) => [
        d.date,
        String(d.uniqueVisitors),
        String(d.pageViews),
        String(d.productViews),
        String(d.addToCarts),
        String(d.whatsappOrders),
        String(d.potentialRevenueCfa),
        String(d.errorsCount),
      ]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `momoshop-daily-stats-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ============================================================================
  // LOGIN SCREEN (DARK SAAS OBSERVABILITY THEME)
  // ============================================================================
  if (!authorized) {
    return (
      <div className="relative min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-between p-4 sm:p-8 overflow-hidden">
        {/* Ambient Glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[600px] rounded-full bg-orange-500/10 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-[100px]" />

        <header className="relative z-10 mx-auto w-full max-w-6xl flex items-center justify-between py-2">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 font-display text-sm font-black text-zinc-950">
              M
            </span>
            <span className="font-display text-xl font-black tracking-tight text-white">
              momo<span className="text-orange-500">Pulse</span>
            </span>
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-zinc-800 bg-zinc-900/80 px-3.5 py-1.5 font-mono text-xs text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors"
          >
            ← Retour à la boutique
          </Link>
        </header>

        <main className="relative z-10 my-auto mx-auto w-full max-w-md rounded-2xl border border-zinc-800/90 bg-zinc-900/75 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 font-mono text-[0.68rem] font-semibold uppercase tracking-wider text-orange-400 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
            Console d&apos;Observabilité
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Connexion Monitoring
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Accédez aux télémétries temps réel, à l&apos;entonnoir WhatsApp et à la gestion des stocks de{' '}
            <strong className="text-zinc-200">momoShop</strong>.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="monitoring-password"
                className="block font-mono text-xs font-medium text-zinc-300 mb-1.5"
              >
                Clé d&apos;accès (<code className="text-orange-400">MONITORING_PASSWORD</code>)
              </label>
              <input
                id="monitoring-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950/90 px-4 py-3 font-mono text-sm text-white placeholder-zinc-600 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            {authError && (
              <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3.5 py-2.5 font-mono text-xs text-rose-300">
                ✕ {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-950 shadow-lg shadow-orange-500/20 hover:brightness-110 transition-all disabled:opacity-50"
            >
              {authLoading ? 'Authentification...' : 'Déverrouiller la Console →'}
            </button>
          </form>

          <div className="mt-6 rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3.5 font-mono text-[0.7rem] text-zinc-400 leading-relaxed">
            💡 Par défaut (si <code className="text-zinc-200">MONITORING_PASSWORD</code> n&apos;est pas défini dans <code className="text-zinc-200">.env</code>), utilisez :{' '}
            <code className="text-orange-400 font-bold">momoshop-admin-2026</code>
          </div>
        </main>

        <footer className="relative z-10 text-center font-mono text-xs text-zinc-500 py-4">
          momoPulse Observability Engine v3.0 • Sans Cookie & Temps Réel
        </footer>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#09090b] text-zinc-100 flex items-center justify-center p-6">
        <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/90 px-6 py-4 font-mono text-xs text-zinc-300 shadow-2xl">
          <span className="h-2.5 w-2.5 rounded-full bg-orange-500 animate-ping" />
          Synchronisation des métriques momoShop...
        </div>
      </div>
    );
  }

  const { totals, health } = data;
  const conversionRate =
    totals.uniqueVisitorsAllTime > 0
      ? Math.round((totals.whatsappOrders / totals.uniqueVisitorsAllTime) * 1000) / 10
      : 0;
  const cartRate =
    totals.pageViews > 0 ? Math.round((totals.addToCarts / totals.pageViews) * 1000) / 10 : 0;

  const totalDevices = Math.max(1, (data.devices.mobile ?? 0) + (data.devices.desktop ?? 0));
  const mobilePct = Math.round(((data.devices.mobile ?? 0) / totalDevices) * 100);

  const filteredCatalog = data.catalogProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(stockSearch.toLowerCase()) ||
      p.color.name.toLowerCase().includes(stockSearch.toLowerCase())
  );

  const last14Days = data.daily.slice(-14);
  const maxDailyViews = Math.max(1, ...last14Days.map((d) => d.pageViews));

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 pb-20 selection:bg-orange-500 selection:text-zinc-950">
      {/* Subtle Top Ambient Gradient */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-64 bg-gradient-to-b from-orange-500/5 via-zinc-900/0 to-transparent" />

      {/* Sticky Glassmorphic Command Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-[#09090b]/85 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3 py-3.5">
          {/* Left Brand + Status */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 font-display text-sm font-black text-zinc-950 shadow-md shadow-orange-500/20">
                M
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-base sm:text-lg font-bold tracking-tight text-white">
                    momo<span className="text-orange-500">Pulse</span>
                  </span>
                  <span className="hidden sm:inline-block rounded border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 font-mono text-[0.62rem] text-zinc-400">
                    v3.0
                  </span>
                </div>
              </div>
            </Link>

            <div className="h-4 w-px bg-zinc-800 mx-1 hidden sm:block" />

            {/* Live Status Pill */}
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[0.7rem] font-medium ${
                health.status === 'healthy'
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                  : health.status === 'degraded'
                  ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                  : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  health.status === 'healthy'
                    ? 'bg-emerald-400 animate-pulse'
                    : health.status === 'degraded'
                    ? 'bg-amber-400 animate-pulse'
                    : 'bg-rose-400 animate-ping'
                }`}
              />
              <span>
                {health.status === 'healthy'
                  ? 'Système Opérationnel'
                  : health.status === 'degraded'
                  ? 'Performance Dégradée'
                  : 'Incident Critique'}
              </span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-300">{health.latencyMs} ms</span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setAutoRefresh((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-mono text-xs transition-colors ${
                autoRefresh
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  autoRefresh ? 'bg-emerald-400 animate-ping' : 'bg-zinc-600'
                }`}
              />
              {autoRefresh ? 'Live 10s' : 'En pause'}
            </button>

            <button
              type="button"
              onClick={() => void fetchStats()}
              className="rounded-lg border border-zinc-800 bg-zinc-900/90 px-2.5 py-1.5 font-mono text-xs text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              ↻ Actualiser
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              className="rounded-lg border border-zinc-800 bg-zinc-900/90 px-2.5 py-1.5 font-mono text-xs text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              ↓ CSV
            </button>

            <button
              type="button"
              onClick={handleExportJson}
              className="rounded-lg border border-zinc-800 bg-zinc-900/90 px-2.5 py-1.5 font-mono text-xs text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              ↓ JSON
            </button>

            <Link
              href="/"
              className="rounded-lg border border-zinc-800 bg-zinc-900/90 px-2.5 py-1.5 font-mono text-xs text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors"
            >
              Boutique ↗
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 font-mono text-xs text-rose-300 hover:bg-rose-500/20 transition-colors"
            >
              Sortir
            </button>
          </div>
        </div>

        {/* Sub-bar Navigation Tabs */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto border-t border-zinc-900 pt-1">
          {[
            {
              id: 'analytics' as ActiveTab,
              label: 'Vue d’ensemble & Entonnoir',
              badge: `${totals.whatsappOrders} cmd`,
            },
            {
              id: 'system' as ActiveTab,
              label: 'Infrastructure & Docker',
              badge: `${health.system.memory.osUsedPercent}% RAM`,
            },
            {
              id: 'stock' as ActiveTab,
              label: 'Stocks & Prix en Direct',
              badge: `${health.catalog.lowStockCount + health.catalog.outOfStockCount} alertes`,
            },
            {
              id: 'logs' as ActiveTab,
              label: 'Flux Temps Réel & Erreurs',
              badge: `${data.recentEvents.length} évts`,
            },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 whitespace-nowrap px-4 py-2.5 font-mono text-xs font-medium transition-colors ${
                  isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[0.65rem] ${
                    isActive
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                      : 'bg-zinc-900 text-zinc-500'
                  }`}
                >
                  {tab.badge}
                </span>
                {isActive && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-orange-500 to-amber-400" />
                )}
              </button>
            );
          })}
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Default Password Warning */}
        {data.isDefaultPassword && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 font-mono text-xs text-amber-200 flex flex-wrap items-center justify-between gap-2">
            <span>
              ⚠️ <strong>Sécurité :</strong> Le mot de passe par défaut est actif. Définissez{' '}
              <code className="rounded bg-amber-950/80 px-1.5 py-0.5 text-amber-300">
                MONITORING_PASSWORD
              </code>{' '}
              dans votre fichier <code className="font-bold">.env</code> en production.
            </span>
          </div>
        )}

        {/* Action Feedback Banner */}
        {statusBanner && (
          <div
            className={`rounded-xl border px-4 py-3 font-mono text-xs flex items-center justify-between ${
              statusBanner.type === 'ok'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                : 'border-rose-500/40 bg-rose-500/10 text-rose-200'
            }`}
          >
            <span>{statusBanner.text}</span>
            <button
              type="button"
              onClick={() => setStatusBanner(null)}
              className="text-zinc-400 hover:text-white px-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* =====================================================================
            TAB 1: ANALYTICS & CONVERSION FUNNEL
        ===================================================================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* 6 Modern KPI Cards */}
            <div className="grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-6">
              <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.68rem] uppercase tracking-wider text-zinc-400">
                    Visiteurs Uniques
                  </span>
                  <span className="h-2 w-2 rounded-full bg-sky-400" />
                </div>
                <p className="mt-2 font-display text-2xl sm:text-3xl font-bold text-white">
                  {totals.uniqueVisitorsAllTime}
                </p>
                <p className="mt-1 font-mono text-[0.65rem] text-zinc-500">
                  Empreinte SHA-256 anonyme
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.68rem] uppercase tracking-wider text-zinc-400">
                    Pages Vues
                  </span>
                  <span className="h-2 w-2 rounded-full bg-zinc-400" />
                </div>
                <p className="mt-2 font-display text-2xl sm:text-3xl font-bold text-white">
                  {totals.pageViews}
                </p>
                <p className="mt-1 font-mono text-[0.65rem] text-zinc-500">
                  Sessions boutique chargées
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.68rem] uppercase tracking-wider text-zinc-400">
                    Vues Produits
                  </span>
                  <span className="h-2 w-2 rounded-full bg-violet-400" />
                </div>
                <p className="mt-2 font-display text-2xl sm:text-3xl font-bold text-white">
                  {totals.productViews}
                </p>
                <p className="mt-1 font-mono text-[0.65rem] text-zinc-500">
                  Fiches détail consultées
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.68rem] uppercase tracking-wider text-zinc-400">
                    Ajouts Panier
                  </span>
                  <span className="h-2 w-2 rounded-full bg-orange-400" />
                </div>
                <p className="mt-2 font-display text-2xl sm:text-3xl font-bold text-orange-400">
                  {totals.addToCarts}
                </p>
                <p className="mt-1 font-mono text-[0.65rem] text-zinc-500">
                  Taux d&apos;ajout : {cartRate}%
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.68rem] uppercase tracking-wider text-emerald-300">
                    Commandes WhatsApp
                  </span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="mt-2 font-display text-2xl sm:text-3xl font-bold text-emerald-400">
                  {totals.whatsappOrders}
                </p>
                <p className="mt-1 font-mono text-[0.65rem] text-emerald-300/70">
                  Conv: {conversionRate}% (+{totals.whatsappFloatingClicks} contact)
                </p>
              </div>

              <div className="rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/15 via-amber-500/5 to-transparent p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.68rem] uppercase tracking-wider text-amber-300">
                    Volume Initié
                  </span>
                  <span className="font-mono text-[0.65rem] text-amber-400">FCFA</span>
                </div>
                <p className="mt-2 font-display text-xl sm:text-2xl font-bold text-white">
                  {formatPrice(totals.potentialRevenueCfa)}
                </p>
                <p className="mt-1 font-mono text-[0.65rem] text-zinc-400">
                  Intentions WhatsApp cumulées
                </p>
              </div>
            </div>

            {/* Funnel + Traffic Sources Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Conversion Funnel + Daily Activity Chart */}
              <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-5 sm:p-6 lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-base sm:text-lg font-bold text-white">
                      Entonnoir de Conversion E-Commerce
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Progression des visiteurs depuis l&apos;arrivée sur la boutique jusqu&apos;au clic WhatsApp
                    </p>
                  </div>
                </div>

                {(() => {
                  const base = Math.max(1, totals.pageViews);
                  const steps = [
                    {
                      label: '1. Sessions / Pages Vues',
                      count: totals.pageViews,
                      bar: 'from-sky-500 to-blue-500',
                    },
                    {
                      label: '2. Fiches T-Shirt Consultées',
                      count: totals.productViews,
                      bar: 'from-violet-500 to-purple-500',
                    },
                    {
                      label: '3. Articles Ajoutés au Panier',
                      count: totals.addToCarts,
                      bar: 'from-orange-500 to-amber-500',
                    },
                    {
                      label: '4. Commandes WhatsApp Initiées',
                      count: totals.whatsappOrders,
                      bar: 'from-emerald-500 to-teal-400',
                    },
                  ];
                  return (
                    <div className="space-y-3.5">
                      {steps.map((step) => {
                        const pct = Math.min(100, Math.round((step.count / base) * 100));
                        return (
                          <div key={step.label} className="space-y-1.5">
                            <div className="flex justify-between font-mono text-xs">
                              <span className="text-zinc-300">{step.label}</span>
                              <span className="font-semibold text-white">
                                {step.count}{' '}
                                <span className="text-zinc-500 font-normal">({pct}%)</span>
                              </span>
                            </div>
                            <div className="h-2.5 w-full rounded-full bg-zinc-950 border border-zinc-800/80 overflow-hidden">
                              <div
                                className={`h-full rounded-full bg-gradient-to-r ${step.bar} transition-all duration-500`}
                                style={{ width: `${Math.max(pct, step.count > 0 ? 4 : 0)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* Daily Activity Bar Chart */}
                <div className="border-t border-zinc-800/80 pt-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      Activité Journalière (14 derniers jours)
                    </h3>
                    <div className="flex items-center gap-3 font-mono text-[0.68rem] text-zinc-400">
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-sm bg-sky-500" /> Visites
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-sm bg-emerald-400" /> WhatsApp
                      </span>
                    </div>
                  </div>

                  {last14Days.length === 0 ? (
                    <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/50 py-6 text-center font-mono text-xs text-zinc-500">
                      Les courbes journalières s&apos;afficheront dès les premières visites.
                    </div>
                  ) : (
                    <div className="grid grid-cols-7 sm:grid-cols-14 gap-2 items-end h-28 pt-4 px-2 rounded-xl border border-zinc-800/60 bg-zinc-950/50">
                      {last14Days.map((day) => {
                        const hPct = Math.max(8, Math.round((day.pageViews / maxDailyViews) * 100));
                        const wPct = Math.min(
                          100,
                          Math.round((day.whatsappOrders / Math.max(1, day.pageViews)) * 100)
                        );
                        return (
                          <div
                            key={day.date}
                            className="flex flex-col items-center gap-1.5 h-full justify-end group"
                            title={`${day.date} : ${day.pageViews} vues, ${day.whatsappOrders} cmd WhatsApp (${formatPrice(day.potentialRevenueCfa)})`}
                          >
                            <div className="w-full max-w-[22px] bg-zinc-900 rounded-t-md overflow-hidden flex flex-col justify-end h-full">
                              <div
                                className="w-full bg-sky-500/80 group-hover:bg-sky-400 transition-all relative flex flex-col justify-end rounded-t-sm"
                                style={{ height: `${hPct}%` }}
                              >
                                {day.whatsappOrders > 0 && (
                                  <div
                                    className="w-full bg-emerald-400"
                                    style={{ height: `${Math.max(20, wPct)}%` }}
                                  />
                                )}
                              </div>
                            </div>
                            <span className="font-mono text-[0.6rem] text-zinc-500">
                              {day.date.slice(5)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Sizes Demand */}
                <div className="border-t border-zinc-800/80 pt-5">
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                    Demande par Taille (Ajouts Panier + Commandes WhatsApp)
                  </h3>
                  <div className="grid grid-cols-6 gap-2.5">
                    {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as Size[]).map((sz) => {
                      const count = data.sizesDemand[sz] ?? 0;
                      return (
                        <div
                          key={sz}
                          className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3 text-center hover:border-zinc-700 transition-colors"
                        >
                          <div className="font-mono text-xs font-bold text-orange-400">{sz}</div>
                          <div className="mt-1 font-display text-xl font-bold text-white">
                            {count}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Devices & Acquisition Channels */}
              <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-5 sm:p-6 flex flex-col justify-between space-y-6">
                <div>
                  <h2 className="font-display text-base sm:text-lg font-bold text-white mb-1">
                    Appareils & Canaux
                  </h2>
                  <p className="text-xs text-zinc-400 mb-4">
                    Répartition Mobile vs Desktop et sources d&apos;entrée
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3.5">
                      <span className="font-mono text-[0.68rem] text-zinc-400 uppercase">
                        📱 Mobile
                      </span>
                      <p className="mt-1 font-display text-2xl font-bold text-white">
                        {data.devices.mobile ?? 0}
                      </p>
                      <span className="font-mono text-[0.65rem] text-emerald-400">
                        {mobilePct}% du trafic
                      </span>
                    </div>
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3.5">
                      <span className="font-mono text-[0.68rem] text-zinc-400 uppercase">
                        💻 Desktop
                      </span>
                      <p className="mt-1 font-display text-2xl font-bold text-white">
                        {data.devices.desktop ?? 0}
                      </p>
                      <span className="font-mono text-[0.65rem] text-sky-400">
                        {100 - mobilePct}% du trafic
                      </span>
                    </div>
                  </div>

                  {/* Mobile vs Desktop Bar */}
                  <div className="h-2 w-full rounded-full bg-sky-500/40 overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 transition-all"
                      style={{ width: `${mobilePct}%` }}
                    />
                  </div>
                </div>

                <div className="border-t border-zinc-800/80 pt-5 flex-1">
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                    Sources de Trafic
                  </h3>
                  <div className="space-y-2 font-mono text-xs">
                    {Object.entries(data.sources)
                      .sort((a, b) => b[1] - a[1])
                      .map(([src, count]) => (
                        <div
                          key={src}
                          className="flex items-center justify-between rounded-lg border border-zinc-800/60 bg-zinc-950/60 px-3 py-2"
                        >
                          <span className="text-zinc-300">{src}</span>
                          <span className="rounded bg-zinc-800 px-2 py-0.5 font-bold text-orange-400">
                            {count}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Performance Table */}
            <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div>
                  <h2 className="font-display text-base sm:text-lg font-bold text-white">
                    Performance par T-Shirt & Nuance
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Classement en temps réel selon les commandes WhatsApp, ajouts panier et consultations
                  </p>
                </div>
              </div>

              {data.productsAnalytics.length === 0 ? (
                <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/50 py-10 text-center font-mono text-xs text-zinc-500">
                  Aucune interaction produit enregistrée pour le moment. Testez un clic produit ou un ajout panier sur la boutique.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse font-mono text-xs">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-400 uppercase text-[0.68rem]">
                        <th className="py-3 pr-4">Modèle & Nuance</th>
                        <th className="py-3 px-3 text-right">Vues Fiche</th>
                        <th className="py-3 px-3 text-right">Ajouts Panier</th>
                        <th className="py-3 px-3 text-right">Clics WhatsApp</th>
                        <th className="py-3 pl-3 text-right">Volume Initié</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {data.productsAnalytics.map((prod) => (
                        <tr
                          key={prod.productId}
                          className="hover:bg-zinc-800/30 transition-colors"
                        >
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-3">
                              <span
                                className="h-4 w-4 rounded-full border border-white/20 shrink-0 shadow-sm"
                                style={{ backgroundColor: prod.colorHex }}
                              />
                              <div>
                                <div className="font-semibold text-zinc-100">{prod.name}</div>
                                <div className="text-[0.68rem] text-zinc-500">{prod.colorName}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right text-zinc-300">{prod.views}</td>
                          <td className="py-3 px-3 text-right font-semibold text-orange-400">
                            {prod.addToCarts}
                          </td>
                          <td className="py-3 px-3 text-right font-semibold text-emerald-400">
                            {prod.whatsappOrders}
                          </td>
                          <td className="py-3 pl-3 text-right font-bold text-white">
                            {formatPrice(prod.potentialRevenueCfa)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 2: SYSTEM HEALTH & DOCKER INFRASTRUCTURE
        ===================================================================== */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            {/* Uptime Visual Bar (BetterStack / Uptime Kuma style) */}
            <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div>
                  <h2 className="font-display text-base sm:text-lg font-bold text-white">
                    Historique de Disponibilité (/api/health)
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Derniers contrôles de santé du conteneur Next.js et vérification du catalogue
                  </p>
                </div>
                <span className="font-mono text-xs text-emerald-400 font-semibold">
                  Latence actuelle : {health.latencyMs} ms
                </span>
              </div>

              <div className="flex items-center gap-1 h-8 pt-1">
                {Array.from({ length: 40 }).map((_, idx) => {
                  const point = data.healthHistory[39 - idx];
                  if (!point) {
                    return (
                      <div
                        key={idx}
                        className="flex-1 h-full rounded-sm bg-zinc-800/60"
                        title="Pas de mesure"
                      />
                    );
                  }
                  const color =
                    point.status === 'healthy'
                      ? 'bg-emerald-400 hover:bg-emerald-300'
                      : point.status === 'degraded'
                      ? 'bg-amber-400 hover:bg-amber-300'
                      : 'bg-rose-500 hover:bg-rose-400';
                  return (
                    <div
                      key={idx}
                      className={`flex-1 h-full rounded-sm transition-colors ${color}`}
                      title={`${new Date(point.timestamp).toLocaleTimeString('fr-FR')} — ${point.status.toUpperCase()} (${point.latencyMs} ms, RAM ${point.osMemoryUsedPercent}%)`}
                    />
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Memory Card */}
              <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-5">
                <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                  Mémoire Serveur & Node.js
                </span>
                <p className="mt-2 font-display text-3xl font-bold text-white">
                  {health.system.memory.osUsedPercent}%
                </p>
                <div className="mt-2.5 h-2 w-full rounded-full bg-zinc-950 border border-zinc-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      health.system.memory.osUsedPercent > 85 ? 'bg-rose-500' : 'bg-emerald-400'
                    }`}
                    style={{ width: `${health.system.memory.osUsedPercent}%` }}
                  />
                </div>
                <div className="mt-4 space-y-1.5 font-mono text-xs text-zinc-400">
                  <div className="flex justify-between">
                    <span>RAM OS Libre / Totale :</span>
                    <strong className="text-zinc-200">
                      {health.system.memory.osFreeMb} / {health.system.memory.osTotalMb} Mo
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Processus Node RSS :</span>
                    <strong className="text-zinc-200">{health.system.memory.rssMb} Mo</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Heap JS Utilisé :</span>
                    <strong className="text-zinc-200">
                      {health.system.memory.heapUsedMb} / {health.system.memory.heapTotalMb} Mo
                    </strong>
                  </div>
                </div>
              </div>

              {/* CPU & Uptime Card */}
              <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-5">
                <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                  Uptime & Processeur
                </span>
                <p className="mt-2 font-display text-3xl font-bold text-white">
                  {formatDuration(health.system.processUptimeSec)}
                </p>
                <p className="font-mono text-xs text-emerald-400 mt-1">
                  Conteneur actif sans interruption
                </p>
                <div className="mt-4 space-y-1.5 font-mono text-xs text-zinc-400">
                  <div className="flex justify-between">
                    <span>Uptime Hôte OS :</span>
                    <strong className="text-zinc-200">
                      {formatDuration(health.system.osUptimeSec)}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>CPU / Load Avg (1m) :</span>
                    <strong className="text-zinc-200">
                      {health.system.cpuCores} cœurs ({health.system.loadAvg1m})
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Environnement :</span>
                    <strong className="text-zinc-200">
                      Node {health.system.nodeVersion} ({health.system.platform}/{health.system.arch})
                    </strong>
                  </div>
                </div>
              </div>

              {/* Webhook Card */}
              <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-5 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                    Canal d&apos;Alerte Webhook
                  </span>
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        health.webhook.configured ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                    />
                    <span className="font-display text-xl font-bold text-white uppercase">
                      {health.webhook.configured
                        ? `Connecté (${health.webhook.provider})`
                        : 'Non configuré'}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                    Configurez <code className="font-mono text-orange-400">ALERT_WEBHOOK_URL</code>{' '}
                    dans <code className="font-mono text-zinc-200">.env</code> (Discord, Slack ou Telegram) pour recevoir les notifications de commandes WhatsApp et d&apos;incidents.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleTestWebhook}
                  className="mt-4 w-full rounded-xl border border-orange-500/40 bg-orange-500/15 px-4 py-2.5 font-mono text-xs font-semibold text-orange-300 hover:bg-orange-500/25 transition-colors"
                >
                  🔔 Envoyer une alerte test
                </button>
              </div>
            </div>

            {/* Catalog Integrity */}
            <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div>
                  <h2 className="font-display text-base sm:text-lg font-bold text-white">
                    Intégrité du Catalogue & Alertes de Stock
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Vérification automatique de <code className="text-zinc-300">products.json</code> et des fichiers images dans <code className="text-zinc-300">public/images/</code>
                  </p>
                </div>
                <span className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 font-mono text-xs text-zinc-300">
                  {health.catalog.productsCount} modèles •{' '}
                  <strong className="text-emerald-400">{health.catalog.totalUnitsInStock}</strong>{' '}
                  unités en stock
                </span>
              </div>

              {health.catalog.missingImages.length > 0 && (
                <div className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 font-mono text-xs text-rose-300">
                  <strong>Images introuvables :</strong> {health.catalog.missingImages.join(', ')}
                </div>
              )}

              {health.catalog.stockAlerts.length === 0 ? (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 font-mono text-xs text-emerald-300">
                  ✓ Tous les stocks des 21 nuances sont au-dessus du seuil d&apos;alerte.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {health.catalog.stockAlerts.map((alert) => (
                    <div
                      key={`${alert.productId}-${alert.size}`}
                      className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/70 px-3.5 py-2.5 font-mono text-xs"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span
                          className="h-3 w-3 rounded-full border border-white/20 shrink-0"
                          style={{ backgroundColor: alert.colorHex }}
                        />
                        <span className="text-zinc-200 truncate">{alert.productName}</span>
                        <span className="text-zinc-500">({alert.size})</span>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[0.65rem] font-semibold ${
                          alert.severity === 'out_of_stock'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {alert.stock === 0 ? 'Épuisé' : `Reste ${alert.stock}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 3: LIVE STOCK & PRICE MANAGER
        ===================================================================== */}
        {activeTab === 'stock' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-4 sm:p-5">
              <div>
                <h2 className="font-display text-base sm:text-lg font-bold text-white">
                  Éditeur de Stocks & Prix en Direct (products.json)
                </h2>
                <p className="text-xs text-zinc-400">
                  Ajustez vos stocks par taille ou vos tarifs FCFA sans connexion SSH : la boutique est mise à jour instantanément.
                </p>
              </div>
              <input
                type="search"
                value={stockSearch}
                onChange={(e) => setStockSearch(e.target.value)}
                placeholder="Filtrer par couleur ou nom..."
                className="rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 font-mono text-xs text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none sm:w-64"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredCatalog.map((product) => {
                const edit = editingProducts[product.id] ?? {
                  priceCfa: product.price_cfa,
                  stock: product.stock,
                };
                return (
                  <div
                    key={product.id}
                    className="rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-4 sm:p-5 flex flex-col justify-between gap-4 hover:border-zinc-700/80 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span
                          className="h-5 w-5 rounded-full border border-white/25 shrink-0 shadow"
                          style={{ backgroundColor: product.color.hex }}
                        />
                        <div>
                          <h3 className="font-display text-sm sm:text-base font-bold text-white">
                            {product.name}
                          </h3>
                          <p className="font-mono text-[0.68rem] text-zinc-500">
                            {product.id} • {product.color.category.toUpperCase()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min={500}
                          step={500}
                          value={edit.priceCfa}
                          onChange={(e) =>
                            setEditingProducts((prev) => ({
                              ...prev,
                              [product.id]: {
                                ...edit,
                                priceCfa: Number(e.target.value),
                              },
                            }))
                          }
                          aria-label={`Prix FCFA pour ${product.name}`}
                          className="w-24 rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1 font-mono text-xs font-bold text-right text-amber-400 focus:border-orange-500 focus:outline-none"
                        />
                        <span className="font-mono text-[0.7rem] text-zinc-500">FCFA</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-6 gap-2">
                      {product.sizes.map((sz) => {
                        const val = edit.stock[sz] ?? 0;
                        return (
                          <label
                            key={sz}
                            className={`flex flex-col items-center rounded-xl border p-2 font-mono text-xs transition-colors ${
                              val === 0
                                ? 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                                : val <= 5
                                ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                                : 'border-zinc-800 bg-zinc-950/80 text-zinc-200'
                            }`}
                          >
                            <span className="text-[0.65rem] text-zinc-400">{sz}</span>
                            <input
                              type="number"
                              min={0}
                              max={999}
                              value={val}
                              onChange={(e) =>
                                setEditingProducts((prev) => ({
                                  ...prev,
                                  [product.id]: {
                                    ...edit,
                                    stock: {
                                      ...edit.stock,
                                      [sz]: Math.max(0, Number(e.target.value)),
                                    },
                                  },
                                }))
                              }
                              className="mt-1 w-full bg-transparent text-center font-bold text-white focus:outline-none"
                            />
                          </label>
                        );
                      })}
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        disabled={edit.saving}
                        onClick={() => void handleSaveProduct(product.id)}
                        className="rounded-xl bg-zinc-100 px-4 py-1.5 font-mono text-xs font-bold text-zinc-950 hover:bg-orange-400 transition-colors disabled:opacity-50"
                      >
                        {edit.saving ? 'Sauvegarde...' : '✓ Enregistrer'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 4: LIVE LOGS & ERRORS
        ===================================================================== */}
        {activeTab === 'logs' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Live Visitor Events */}
            <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-display text-base sm:text-lg font-bold text-white">
                    Flux d&apos;Événements en Direct
                  </h2>
                  <p className="text-xs text-zinc-400">
                    60 dernières actions visiteurs enregistrées sur la boutique
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetAnalytics}
                  className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 font-mono text-[0.7rem] text-rose-300 hover:bg-rose-500/20"
                >
                  Réinitialiser
                </button>
              </div>

              {data.recentEvents.length === 0 ? (
                <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/50 py-12 text-center font-mono text-xs text-zinc-500">
                  En attente d&apos;activité sur la boutique...
                </div>
              ) : (
                <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
                  {data.recentEvents.map((ev) => {
                    const meta = eventMeta(ev.type);
                    return (
                      <div
                        key={ev.id}
                        className="rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-3 font-mono text-xs flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.65rem] font-medium ${meta.pill}`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                              {meta.label}
                            </span>
                            <span className="text-[0.68rem] text-zinc-500">
                              {ev.device.toUpperCase()} • {ev.source} • #{ev.visitorHash.slice(0, 6)}
                            </span>
                          </div>
                          {ev.productName && (
                            <div className="text-zinc-200 font-medium pt-0.5">
                              {ev.productName}{' '}
                              {ev.size ? (
                                <span className="text-orange-400">• Taille {ev.size}</span>
                              ) : (
                                ''
                              )}{' '}
                              {ev.qty && ev.qty > 1 ? `×${ev.qty}` : ''}
                              {ev.amountCfa ? (
                                <span className="text-emerald-400 ml-1">
                                  ({formatPrice(ev.amountCfa)})
                                </span>
                              ) : (
                                ''
                              )}
                            </div>
                          )}
                        </div>
                        <span className="text-[0.68rem] text-zinc-500 shrink-0">
                          {new Date(ev.timestamp).toLocaleTimeString('fr-FR')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Application Errors Log */}
            <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-display text-base sm:text-lg font-bold text-white">
                    Inspecteur d&apos;Erreurs ({data.recentErrors.length})
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Exceptions JavaScript client, erreurs Next.js et alertes santé
                  </p>
                </div>
                {data.recentErrors.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearErrors}
                    className="rounded-lg border border-zinc-700 bg-zinc-800 px-2.5 py-1 font-mono text-[0.7rem] text-zinc-300 hover:text-white"
                  >
                    Purger
                  </button>
                )}
              </div>

              {data.recentErrors.length === 0 ? (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 py-12 text-center font-mono text-xs text-emerald-300">
                  ✓ Aucune erreur applicative enregistrée.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[540px] overflow-y-auto pr-1">
                  {data.recentErrors.map((err) => (
                    <div
                      key={err.id}
                      className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-3.5 font-mono text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="rounded bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 text-[0.65rem] font-semibold uppercase text-rose-300">
                          {err.source}
                        </span>
                        <span className="text-[0.68rem] text-zinc-500">
                          {new Date(err.timestamp).toLocaleString('fr-FR')}
                        </span>
                      </div>
                      <p className="font-semibold text-rose-200 break-words">{err.message}</p>
                      {err.url && (
                        <p className="text-[0.68rem] text-zinc-500 truncate">URL: {err.url}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
