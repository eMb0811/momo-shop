import { NextResponse, type NextRequest } from 'next/server';
import {
  recordMonitoringError,
  recordMonitoringEvent,
  type MonitoringEventType,
} from '@/lib/monitoring';
import type { CategoryFilter, Size } from '@/lib/types';

export const dynamic = 'force-dynamic';

const VALID_EVENTS: MonitoringEventType[] = [
  'page_view',
  'filter_select',
  'product_view',
  'add_to_cart',
  'whatsapp_product_order',
  'whatsapp_cart_order',
  'whatsapp_floating_click',
];

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      '127.0.0.1';
    const userAgent = req.headers.get('user-agent') ?? 'unknown';
    const acceptLang = req.headers.get('accept-language') ?? 'fr';

    if (body.kind === 'error') {
      const message =
        typeof body.message === 'string' && body.message.trim()
          ? body.message.trim()
          : 'Erreur client inconnue';
      await recordMonitoringError({
        source: 'client',
        message,
        stack: typeof body.stack === 'string' ? body.stack : undefined,
        url: typeof body.url === 'string' ? body.url : undefined,
        userAgent,
      });
      return NextResponse.json({ ok: true });
    }

    const type = body.type as MonitoringEventType;
    if (!VALID_EVENTS.includes(type)) {
      return NextResponse.json({ error: 'Type événement invalide' }, { status: 400 });
    }

    await recordMonitoringEvent({
      type,
      ip,
      userAgent,
      acceptLang,
      referrer: typeof body.referrer === 'string' ? body.referrer : req.headers.get('referer') ?? undefined,
      productId: typeof body.productId === 'string' ? body.productId : undefined,
      productName: typeof body.productName === 'string' ? body.productName : undefined,
      colorName: typeof body.colorName === 'string' ? body.colorName : undefined,
      colorHex: typeof body.colorHex === 'string' ? body.colorHex : undefined,
      size: typeof body.size === 'string' ? (body.size as Size) : undefined,
      qty: typeof body.qty === 'number' ? body.qty : undefined,
      amountCfa: typeof body.amountCfa === 'number' ? body.amountCfa : undefined,
      category: typeof body.category === 'string' ? (body.category as CategoryFilter) : undefined,
      itemsCount: typeof body.itemsCount === 'number' ? body.itemsCount : undefined,
      path: typeof body.path === 'string' ? body.path : undefined,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Error in /api/monitoring/track:', err);
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }
}
