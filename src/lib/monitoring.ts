import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getProducts } from './products';
import type { CategoryFilter, Product, Size } from './types';
import { formatPrice } from './shop';

export type MonitoringEventType =
  | 'page_view'
  | 'filter_select'
  | 'product_view'
  | 'add_to_cart'
  | 'whatsapp_product_order'
  | 'whatsapp_cart_order'
  | 'whatsapp_floating_click';

export type DeviceType = 'mobile' | 'desktop';

export type TrafficSource =
  | 'Direct'
  | 'WhatsApp'
  | 'Instagram'
  | 'TikTok'
  | 'Facebook'
  | 'Google'
  | 'Autre';

export interface MonitoringEvent {
  id: string;
  timestamp: string;
  type: MonitoringEventType;
  device: DeviceType;
  source: TrafficSource;
  visitorHash: string;
  productId?: string;
  productName?: string;
  colorName?: string;
  colorHex?: string;
  size?: Size;
  qty?: number;
  amountCfa?: number;
  category?: CategoryFilter;
  itemsCount?: number;
  path?: string;
}

export interface MonitoringErrorLog {
  id: string;
  timestamp: string;
  source: 'client' | 'server' | 'healthcheck';
  message: string;
  stack?: string;
  url?: string;
  userAgent?: string;
}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  pageViews: number;
  uniqueVisitors: number;
  visitorHashes: string[];
  productViews: number;
  addToCarts: number;
  whatsappOrders: number;
  whatsappFloatingClicks: number;
  potentialRevenueCfa: number;
  errorsCount: number;
}

export interface ProductAnalytics {
  productId: string;
  name: string;
  colorName: string;
  colorHex: string;
  views: number;
  addToCarts: number;
  whatsappOrders: number;
  potentialRevenueCfa: number;
  sizes: Partial<Record<Size, number>>;
}

export interface HealthHistoryPoint {
  timestamp: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  latencyMs: number;
  memoryRssMb: number;
  osMemoryUsedPercent: number;
}

export interface MonitoringStore {
  version: number;
  updatedAt: string;
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
  daily: Record<string, DailyStats>;
  products: Record<string, ProductAnalytics>;
  recentEvents: MonitoringEvent[];
  recentErrors: MonitoringErrorLog[];
  healthHistory: HealthHistoryPoint[];
}

export interface StockAlertItem {
  productId: string;
  productName: string;
  colorName: string;
  colorHex: string;
  size: Size;
  stock: number;
  severity: 'out_of_stock' | 'low_stock';
}

export interface SystemHealthReport {
  status: 'healthy' | 'degraded' | 'unhealthy';
  app: string;
  version: string;
  timestamp: string;
  latencyMs: number;
  system: {
    nodeVersion: string;
    platform: string;
    arch: string;
    cpuCores: number;
    loadAvg1m: number;
    loadAvg5m: number;
    processUptimeSec: number;
    osUptimeSec: number;
    memory: {
      rssMb: number;
      heapUsedMb: number;
      heapTotalMb: number;
      osTotalMb: number;
      osFreeMb: number;
      osUsedPercent: number;
    };
  };
  catalog: {
    healthy: boolean;
    productsCount: number;
    totalUnitsInStock: number;
    outOfStockCount: number;
    lowStockCount: number;
    missingImages: string[];
    stockAlerts: StockAlertItem[];
  };
  webhook: {
    configured: boolean;
    provider: 'discord' | 'slack' | 'telegram' | 'generic' | 'none';
  };
  issues: string[];
}

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const MONITORING_FILE = path.join(DATA_DIR, 'monitoring.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

const MAX_RECENT_EVENTS = 200;
const MAX_RECENT_ERRORS = 100;
const MAX_HEALTH_HISTORY = 120;
const MAX_DAILY_RETENTION_DAYS = 90;

// In-memory singleton cache + file mtime tracking + alert throttling
const globalForMonitoring = globalThis as unknown as {
  __momoMonitoringStore?: MonitoringStore;
  __momoMonitoringMtimeMs?: number;
  __momoAlertThrottle?: Map<string, number>;
};

function createEmptyStore(): MonitoringStore {
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    totals: {
      pageViews: 0,
      uniqueVisitorsAllTime: 0,
      productViews: 0,
      addToCarts: 0,
      whatsappOrders: 0,
      whatsappFloatingClicks: 0,
      potentialRevenueCfa: 0,
      errorsCount: 0,
    },
    devices: {
      mobile: 0,
      desktop: 0,
    },
    sources: {
      Direct: 0,
      WhatsApp: 0,
      Instagram: 0,
      TikTok: 0,
      Facebook: 0,
      Google: 0,
      Autre: 0,
    },
    sizesDemand: {
      XS: 0,
      S: 0,
      M: 0,
      L: 0,
      XL: 0,
      XXL: 0,
    },
    categoriesDemand: {
      all: 0,
      neutres: 0,
      pop: 0,
      nature: 0,
    },
    daily: {},
    products: {},
    recentEvents: [],
    recentErrors: [],
    healthHistory: [],
  };
}

export function loadMonitoringStore(): MonitoringStore {
  try {
    if (fs.existsSync(MONITORING_FILE)) {
      const stat = fs.statSync(MONITORING_FILE);
      if (
        globalForMonitoring.__momoMonitoringStore &&
        globalForMonitoring.__momoMonitoringMtimeMs === stat.mtimeMs
      ) {
        return globalForMonitoring.__momoMonitoringStore;
      }

      const raw = fs.readFileSync(MONITORING_FILE, 'utf-8');
      const parsed = JSON.parse(raw) as Partial<MonitoringStore>;
      const base = createEmptyStore();
      const merged: MonitoringStore = {
        ...base,
        ...parsed,
        totals: { ...base.totals, ...(parsed.totals ?? {}) },
        devices: { ...base.devices, ...(parsed.devices ?? {}) },
        sources: { ...base.sources, ...(parsed.sources ?? {}) },
        sizesDemand: { ...base.sizesDemand, ...(parsed.sizesDemand ?? {}) },
        categoriesDemand: { ...base.categoriesDemand, ...(parsed.categoriesDemand ?? {}) },
        daily: parsed.daily ?? {},
        products: parsed.products ?? {},
        recentEvents: Array.isArray(parsed.recentEvents) ? parsed.recentEvents : [],
        recentErrors: Array.isArray(parsed.recentErrors) ? parsed.recentErrors : [],
        healthHistory: Array.isArray(parsed.healthHistory) ? parsed.healthHistory : [],
      };
      globalForMonitoring.__momoMonitoringStore = merged;
      globalForMonitoring.__momoMonitoringMtimeMs = stat.mtimeMs;
      return merged;
    }
  } catch (err) {
    console.warn('Could not read monitoring.json, initializing fresh store:', err);
  }

  if (globalForMonitoring.__momoMonitoringStore) {
    return globalForMonitoring.__momoMonitoringStore;
  }

  const fresh = createEmptyStore();
  globalForMonitoring.__momoMonitoringStore = fresh;
  return fresh;
}

export function saveMonitoringStore(store: MonitoringStore): void {
  store.updatedAt = new Date().toISOString();

  // Prune daily entries older than 90 days
  const keys = Object.keys(store.daily).sort();
  if (keys.length > MAX_DAILY_RETENTION_DAYS) {
    const toRemove = keys.slice(0, keys.length - MAX_DAILY_RETENTION_DAYS);
    for (const k of toRemove) {
      delete store.daily[k];
    }
  }

  globalForMonitoring.__momoMonitoringStore = store;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tmpFile = `${MONITORING_FILE}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(store, null, 2), 'utf-8');
    fs.renameSync(tmpFile, MONITORING_FILE);
    const stat = fs.statSync(MONITORING_FILE);
    globalForMonitoring.__momoMonitoringMtimeMs = stat.mtimeMs;
  } catch (err) {
    console.error('Failed to persist monitoring.json:', err);
  }
}

export function computeVisitorHash(
  ip: string,
  userAgent: string,
  acceptLang: string,
  dateKey: string
): string {
  const secretSalt = process.env.MONITORING_PASSWORD ?? 'momoshop-privacy-salt-2026';
  const payload = `${ip}|${userAgent}|${acceptLang}|${dateKey}|${secretSalt}`;
  return crypto.createHash('sha256').update(payload).digest('hex').slice(0, 16);
}

export function detectDevice(userAgent: string): DeviceType {
  const ua = userAgent.toLowerCase();
  if (/android|iphone|ipad|ipod|mobile|iemobile|opera mini/i.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

export function detectTrafficSource(referrer?: string): TrafficSource {
  if (!referrer) return 'Direct';
  const r = referrer.toLowerCase();
  if (r.includes('whatsapp') || r.includes('wa.me')) return 'WhatsApp';
  if (r.includes('instagram') || r.includes('ig.me')) return 'Instagram';
  if (r.includes('tiktok')) return 'TikTok';
  if (r.includes('facebook') || r.includes('fb.com') || r.includes('fb.me')) return 'Facebook';
  if (r.includes('google.')) return 'Google';
  return 'Autre';
}

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function ensureDailyEntry(store: MonitoringStore, dateKey: string): DailyStats {
  if (!store.daily[dateKey]) {
    store.daily[dateKey] = {
      date: dateKey,
      pageViews: 0,
      uniqueVisitors: 0,
      visitorHashes: [],
      productViews: 0,
      addToCarts: 0,
      whatsappOrders: 0,
      whatsappFloatingClicks: 0,
      potentialRevenueCfa: 0,
      errorsCount: 0,
    };
  }
  return store.daily[dateKey];
}

function ensureProductEntry(
  store: MonitoringStore,
  productId: string,
  name: string,
  colorName: string,
  colorHex: string
): ProductAnalytics {
  if (!store.products[productId]) {
    store.products[productId] = {
      productId,
      name,
      colorName,
      colorHex,
      views: 0,
      addToCarts: 0,
      whatsappOrders: 0,
      potentialRevenueCfa: 0,
      sizes: {},
    };
  }
  return store.products[productId];
}

export function detectWebhookProvider(
  url?: string
): 'discord' | 'slack' | 'telegram' | 'generic' | 'none' {
  if (!url || !url.trim()) return 'none';
  const lower = url.toLowerCase();
  if (lower.includes('discord.com/api/webhooks') || lower.includes('discordapp.com/api/webhooks')) {
    return 'discord';
  }
  if (lower.includes('hooks.slack.com')) {
    return 'slack';
  }
  if (lower.includes('api.telegram.org')) {
    return 'telegram';
  }
  return 'generic';
}

export async function sendWebhookAlert(params: {
  title: string;
  message: string;
  level: 'info' | 'warning' | 'error' | 'order';
  throttleKey?: string;
  throttleMs?: number;
}): Promise<{ sent: boolean; reason?: string }> {
  const webhookUrl = process.env.ALERT_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    return { sent: false, reason: 'ALERT_WEBHOOK_URL non configuré dans .env' };
  }

  if (params.throttleKey) {
    if (!globalForMonitoring.__momoAlertThrottle) {
      globalForMonitoring.__momoAlertThrottle = new Map();
    }
    const lastSent = globalForMonitoring.__momoAlertThrottle.get(params.throttleKey) ?? 0;
    const cooldown = params.throttleMs ?? 5 * 60 * 1000;
    if (Date.now() - lastSent < cooldown) {
      return { sent: false, reason: 'Alerte temporisée (anti-spam actif)' };
    }
    globalForMonitoring.__momoAlertThrottle.set(params.throttleKey, Date.now());
  }

  const provider = detectWebhookProvider(webhookUrl);
  const emoji =
    params.level === 'order'
      ? '🛍️'
      : params.level === 'error'
      ? '🚨'
      : params.level === 'warning'
      ? '⚠️'
      : '✅';
  const formattedText = `${emoji} **[momoShop] ${params.title}**\n${params.message}\n🕒 ${new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Dakar' })} (Dakar)`;

  try {
    let bodyPayload: Record<string, unknown>;
    if (provider === 'discord') {
      bodyPayload = { content: formattedText };
    } else if (provider === 'slack') {
      bodyPayload = { text: formattedText.replace(/\*\*/g, '*') };
    } else if (provider === 'telegram') {
      const parsedUrl = new URL(webhookUrl);
      const chatId = parsedUrl.searchParams.get('chat_id') ?? process.env.TELEGRAM_CHAT_ID;
      bodyPayload = {
        chat_id: chatId,
        text: `${emoji} [momoShop] ${params.title}\n${params.message}`,
      };
    } else {
      bodyPayload = {
        app: 'momoShop',
        level: params.level,
        title: params.title,
        message: params.message,
        text: formattedText,
        timestamp: new Date().toISOString(),
      };
    }

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyPayload),
    });

    if (!res.ok) {
      return { sent: false, reason: `HTTP ${res.status}` };
    }
    return { sent: true };
  } catch (err) {
    return { sent: false, reason: err instanceof Error ? err.message : 'Erreur réseau' };
  }
}

export async function recordMonitoringEvent(input: {
  type: MonitoringEventType;
  ip: string;
  userAgent: string;
  acceptLang: string;
  referrer?: string;
  productId?: string;
  productName?: string;
  colorName?: string;
  colorHex?: string;
  size?: Size;
  qty?: number;
  amountCfa?: number;
  category?: CategoryFilter;
  itemsCount?: number;
  path?: string;
}): Promise<MonitoringEvent> {
  const store = loadMonitoringStore();
  const dateKey = getTodayKey();
  const daily = ensureDailyEntry(store, dateKey);

  const visitorHash = computeVisitorHash(
    input.ip,
    input.userAgent,
    input.acceptLang,
    dateKey
  );
  const device = detectDevice(input.userAgent);
  const source = detectTrafficSource(input.referrer);

  if (!daily.visitorHashes.includes(visitorHash)) {
    daily.visitorHashes.push(visitorHash);
    daily.uniqueVisitors = daily.visitorHashes.length;
    store.totals.uniqueVisitorsAllTime += 1;
    store.devices[device] = (store.devices[device] ?? 0) + 1;
    store.sources[source] = (store.sources[source] ?? 0) + 1;
  }

  switch (input.type) {
    case 'page_view': {
      store.totals.pageViews += 1;
      daily.pageViews += 1;
      break;
    }
    case 'filter_select': {
      const cat = input.category ?? 'all';
      store.categoriesDemand[cat] = (store.categoriesDemand[cat] ?? 0) + 1;
      break;
    }
    case 'product_view': {
      store.totals.productViews += 1;
      daily.productViews += 1;
      if (input.productId) {
        const prod = ensureProductEntry(
          store,
          input.productId,
          input.productName ?? input.productId,
          input.colorName ?? '',
          input.colorHex ?? '#111111'
        );
        prod.views += 1;
      }
      break;
    }
    case 'add_to_cart': {
      const qty = input.qty ?? 1;
      store.totals.addToCarts += qty;
      daily.addToCarts += qty;
      if (input.size) {
        store.sizesDemand[input.size] = (store.sizesDemand[input.size] ?? 0) + qty;
      }
      if (input.productId) {
        const prod = ensureProductEntry(
          store,
          input.productId,
          input.productName ?? input.productId,
          input.colorName ?? '',
          input.colorHex ?? '#111111'
        );
        prod.addToCarts += qty;
        if (input.size) {
          prod.sizes[input.size] = (prod.sizes[input.size] ?? 0) + qty;
        }
      }
      break;
    }
    case 'whatsapp_product_order': {
      const qty = input.qty ?? 1;
      const amount = input.amountCfa ?? 0;
      store.totals.whatsappOrders += 1;
      store.totals.potentialRevenueCfa += amount;
      daily.whatsappOrders += 1;
      daily.potentialRevenueCfa += amount;

      if (input.size) {
        store.sizesDemand[input.size] = (store.sizesDemand[input.size] ?? 0) + qty;
      }
      if (input.productId) {
        const prod = ensureProductEntry(
          store,
          input.productId,
          input.productName ?? input.productId,
          input.colorName ?? '',
          input.colorHex ?? '#111111'
        );
        prod.whatsappOrders += 1;
        prod.potentialRevenueCfa += amount;
        if (input.size) {
          prod.sizes[input.size] = (prod.sizes[input.size] ?? 0) + qty;
        }
      }

      // Send real-time WhatsApp order intention alert
      void sendWebhookAlert({
        level: 'order',
        title: 'Nouvelle intention de commande WhatsApp (Produit)',
        message: `Article : ${input.productName ?? input.productId} (${input.colorName ?? ''})\nTaille : ${input.size ?? 'M'} × ${qty}\nMontant : ${formatPrice(amount)}\nAppareil : ${device.toUpperCase()}`,
      });
      break;
    }
    case 'whatsapp_cart_order': {
      const amount = input.amountCfa ?? 0;
      const itemsCount = input.itemsCount ?? 1;
      store.totals.whatsappOrders += 1;
      store.totals.potentialRevenueCfa += amount;
      daily.whatsappOrders += 1;
      daily.potentialRevenueCfa += amount;

      void sendWebhookAlert({
        level: 'order',
        title: 'Nouvelle commande Panier WhatsApp',
        message: `Panier groupé : ${itemsCount} article(s) (${input.productName ?? 'Sélection multiple'})\nMontant total : ${formatPrice(amount)}\nAppareil : ${device.toUpperCase()}`,
      });
      break;
    }
    case 'whatsapp_floating_click': {
      store.totals.whatsappFloatingClicks += 1;
      daily.whatsappFloatingClicks += 1;
      break;
    }
  }

  const eventRecord: MonitoringEvent = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    type: input.type,
    device,
    source,
    visitorHash,
    productId: input.productId,
    productName: input.productName,
    colorName: input.colorName,
    colorHex: input.colorHex,
    size: input.size,
    qty: input.qty,
    amountCfa: input.amountCfa,
    category: input.category,
    itemsCount: input.itemsCount,
    path: input.path,
  };

  store.recentEvents.unshift(eventRecord);
  if (store.recentEvents.length > MAX_RECENT_EVENTS) {
    store.recentEvents = store.recentEvents.slice(0, MAX_RECENT_EVENTS);
  }

  saveMonitoringStore(store);
  return eventRecord;
}

export async function recordMonitoringError(input: {
  source: 'client' | 'server' | 'healthcheck';
  message: string;
  stack?: string;
  url?: string;
  userAgent?: string;
}): Promise<MonitoringErrorLog> {
  const store = loadMonitoringStore();
  const dateKey = getTodayKey();
  const daily = ensureDailyEntry(store, dateKey);

  store.totals.errorsCount += 1;
  daily.errorsCount += 1;

  const errLog: MonitoringErrorLog = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    source: input.source,
    message: input.message.slice(0, 500),
    stack: input.stack?.slice(0, 1500),
    url: input.url,
    userAgent: input.userAgent,
  };

  store.recentErrors.unshift(errLog);
  if (store.recentErrors.length > MAX_RECENT_ERRORS) {
    store.recentErrors = store.recentErrors.slice(0, MAX_RECENT_ERRORS);
  }

  saveMonitoringStore(store);

  void sendWebhookAlert({
    level: 'error',
    title: `Erreur applicative (${input.source.toUpperCase()})`,
    message: `${errLog.message}${input.url ? `\nURL : ${input.url}` : ''}`,
    throttleKey: `err:${errLog.message.slice(0, 80)}`,
    throttleMs: 5 * 60 * 1000,
  });

  return errLog;
}

export function getSystemHealthReport(recordHistory = false): SystemHealthReport {
  const start = performance.now();
  const issues: string[] = [];

  // 1. System & Node.js metrics
  const mem = process.memoryUsage();
  const rssMb = Math.round((mem.rss / 1024 / 1024) * 10) / 10;
  const heapUsedMb = Math.round((mem.heapUsed / 1024 / 1024) * 10) / 10;
  const heapTotalMb = Math.round((mem.heapTotal / 1024 / 1024) * 10) / 10;
  const osTotalMb = Math.round(os.totalmem() / 1024 / 1024);
  const osFreeMb = Math.round(os.freemem() / 1024 / 1024);
  const osUsedPercent = Math.round(((osTotalMb - osFreeMb) / Math.max(1, osTotalMb)) * 100);
  const loadAvg = os.loadavg();

  if (osUsedPercent >= 92) {
    issues.push(`Mémoire serveur critique (${osUsedPercent}% utilisée)`);
  }

  // 2. Catalog & image integrity
  const products = getProducts('all');
  const catalogHealthy = products.length > 0;
  if (!catalogHealthy) {
    issues.push('Catalogue products.json vide ou illisible');
  }

  let totalUnitsInStock = 0;
  let outOfStockCount = 0;
  let lowStockCount = 0;
  const missingImages: string[] = [];
  const stockAlerts: StockAlertItem[] = [];

  for (const product of products) {
    const imgRel = product.image.startsWith('/') ? product.image.slice(1) : product.image;
    const imgFull = path.join(process.cwd(), 'public', imgRel);
    if (!fs.existsSync(imgFull)) {
      missingImages.push(`${product.id}: ${product.image}`);
    }

    for (const size of product.sizes) {
      const count = product.stock[size] ?? 0;
      totalUnitsInStock += count;
      if (count === 0) {
        outOfStockCount += 1;
        stockAlerts.push({
          productId: product.id,
          productName: product.name,
          colorName: product.color.name,
          colorHex: product.color.hex,
          size,
          stock: count,
          severity: 'out_of_stock',
        });
      } else if (count <= 5) {
        lowStockCount += 1;
        stockAlerts.push({
          productId: product.id,
          productName: product.name,
          colorName: product.color.name,
          colorHex: product.color.hex,
          size,
          stock: count,
          severity: 'low_stock',
        });
      }
    }
  }

  if (missingImages.length > 0) {
    issues.push(`${missingImages.length} image(s) produit introuvable(s) dans public/`);
  }

  let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
  if (!catalogHealthy) {
    status = 'unhealthy';
  } else if (issues.length > 0) {
    status = 'degraded';
  }

  const latencyMs = Math.max(1, Math.round((performance.now() - start) * 100) / 100);
  const webhookUrl = process.env.ALERT_WEBHOOK_URL?.trim();

  const report: SystemHealthReport = {
    status,
    app: 'momoShop (Next.js + TypeScript)',
    version: '3.0.0',
    timestamp: new Date().toISOString(),
    latencyMs,
    system: {
      nodeVersion: process.version,
      platform: os.platform(),
      arch: os.arch(),
      cpuCores: os.cpus().length,
      loadAvg1m: Math.round((loadAvg[0] ?? 0) * 100) / 100,
      loadAvg5m: Math.round((loadAvg[1] ?? 0) * 100) / 100,
      processUptimeSec: Math.round(process.uptime()),
      osUptimeSec: Math.round(os.uptime()),
      memory: {
        rssMb,
        heapUsedMb,
        heapTotalMb,
        osTotalMb,
        osFreeMb,
        osUsedPercent,
      },
    },
    catalog: {
      healthy: catalogHealthy && missingImages.length === 0,
      productsCount: products.length,
      totalUnitsInStock,
      outOfStockCount,
      lowStockCount,
      missingImages,
      stockAlerts,
    },
    webhook: {
      configured: Boolean(webhookUrl),
      provider: detectWebhookProvider(webhookUrl),
    },
    issues,
  };

  if (recordHistory) {
    const store = loadMonitoringStore();
    store.healthHistory.unshift({
      timestamp: report.timestamp,
      status: report.status,
      latencyMs: report.latencyMs,
      memoryRssMb: rssMb,
      osMemoryUsedPercent: osUsedPercent,
    });
    if (store.healthHistory.length > MAX_HEALTH_HISTORY) {
      store.healthHistory = store.healthHistory.slice(0, MAX_HEALTH_HISTORY);
    }
    saveMonitoringStore(store);

    if (report.status !== 'healthy') {
      void sendWebhookAlert({
        level: report.status === 'unhealthy' ? 'error' : 'warning',
        title: `État de santé : ${report.status.toUpperCase()}`,
        message: report.issues.join('\n') || 'Anomalie détectée sur /api/health',
        throttleKey: `health:${report.status}`,
        throttleMs: 15 * 60 * 1000,
      });
    }
  }

  return report;
}

export async function updateProductCatalogItem(input: {
  productId: string;
  priceCfa?: number;
  stock?: Partial<Record<Size, number>>;
}): Promise<{ updated: Product; lowStockTriggered: string[] }> {
  const raw = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
  const products = JSON.parse(raw) as Product[];
  const target = products.find((p) => p.id === input.productId);
  if (!target) {
    throw new Error(`Produit introuvable : ${input.productId}`);
  }
  if (typeof input.priceCfa === 'number' && input.priceCfa > 0) {
    target.price_cfa = Math.round(input.priceCfa);
  }

  const lowStockTriggered: string[] = [];
  if (input.stock) {
    for (const size of target.sizes) {
      const val = input.stock[size];
      if (typeof val === 'number' && val >= 0) {
        target.stock[size] = Math.round(val);
        if (target.stock[size] <= 2) {
          lowStockTriggered.push(`${size} (${target.stock[size]})`);
        }
      }
    }
  }

  const tmpPath = `${PRODUCTS_FILE}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(products, null, 2), 'utf-8');
  fs.renameSync(tmpPath, PRODUCTS_FILE);

  if (lowStockTriggered.length > 0) {
    void sendWebhookAlert({
      level: 'warning',
      title: `Stock bas ou épuisé : ${target.name}`,
      message: `Nuance : ${target.color.name}\nTailles critiques : ${lowStockTriggered.join(', ')}`,
      throttleKey: `stock:${target.id}`,
      throttleMs: 60 * 1000,
    });
  }

  return { updated: target, lowStockTriggered };
}

export function clearMonitoringErrors(): void {
  const store = loadMonitoringStore();
  store.recentErrors = [];
  store.totals.errorsCount = 0;
  saveMonitoringStore(store);
}

export function resetMonitoringAnalytics(): void {
  const fresh = createEmptyStore();
  saveMonitoringStore(fresh);
}
