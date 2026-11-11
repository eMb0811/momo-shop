import { NextResponse, type NextRequest } from 'next/server';
import { isRequestAuthorized } from '@/lib/monitoring-auth';
import {
  clearMonitoringErrors,
  resetMonitoringAnalytics,
  sendWebhookAlert,
  updateProductCatalogItem,
} from '@/lib/monitoring';
import type { Size } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  if (!isRequestAuthorized(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      action?: string;
      productId?: string;
      priceCfa?: number;
      stock?: Partial<Record<Size, number>>;
    };

    switch (body.action) {
      case 'test_webhook': {
        const res = await sendWebhookAlert({
          level: 'info',
          title: 'Test de connexion Webhook réussi',
          message:
            'Votre canal d’alerte momoShop est opérationnel ! Vous recevrez ici les alertes de santé serveur, les stocks critiques et les intentions de commandes WhatsApp.',
        });
        return NextResponse.json(res);
      }

      case 'update_product': {
        if (!body.productId) {
          return NextResponse.json({ error: 'productId requis' }, { status: 400 });
        }
        const result = await updateProductCatalogItem({
          productId: body.productId,
          priceCfa: body.priceCfa,
          stock: body.stock,
        });
        return NextResponse.json({ ok: true, ...result });
      }

      case 'clear_errors': {
        clearMonitoringErrors();
        return NextResponse.json({ ok: true });
      }

      case 'reset_analytics': {
        resetMonitoringAnalytics();
        return NextResponse.json({ ok: true });
      }

      default:
        return NextResponse.json({ error: 'Action inconnue' }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur serveur' },
      { status: 500 }
    );
  }
}
