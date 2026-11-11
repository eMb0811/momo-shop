import { NextResponse, type NextRequest } from 'next/server';
import { getMonitoringPassword, isRequestAuthorized } from '@/lib/monitoring-auth';
import { getSystemHealthReport, loadMonitoringStore } from '@/lib/monitoring';
import { getProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

export function GET(req: NextRequest) {
  if (!isRequestAuthorized(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const store = loadMonitoringStore();
  const health = getSystemHealthReport(false);
  const products = getProducts('all');
  const { isDefaultPassword } = getMonitoringPassword();

  // Strip visitorHashes arrays from daily response payload for compactness
  const dailySummary = Object.values(store.daily)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((d) => ({
      date: d.date,
      pageViews: d.pageViews,
      uniqueVisitors: d.uniqueVisitors,
      productViews: d.productViews,
      addToCarts: d.addToCarts,
      whatsappOrders: d.whatsappOrders,
      whatsappFloatingClicks: d.whatsappFloatingClicks,
      potentialRevenueCfa: d.potentialRevenueCfa,
      errorsCount: d.errorsCount,
    }));

  return NextResponse.json({
    updatedAt: store.updatedAt,
    isDefaultPassword,
    totals: store.totals,
    devices: store.devices,
    sources: store.sources,
    sizesDemand: store.sizesDemand,
    categoriesDemand: store.categoriesDemand,
    daily: dailySummary,
    productsAnalytics: Object.values(store.products).sort(
      (a, b) => b.whatsappOrders - a.whatsappOrders || b.addToCarts - a.addToCarts || b.views - a.views
    ),
    recentEvents: store.recentEvents.slice(0, 60),
    recentErrors: store.recentErrors.slice(0, 50),
    healthHistory: store.healthHistory.slice(0, 40),
    health,
    catalogProducts: products,
  });
}
