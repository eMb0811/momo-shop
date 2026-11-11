import { NextResponse, type NextRequest } from 'next/server';
import {
  createSessionToken,
  MONITORING_COOKIE_NAME,
  verifyMonitoringPassword,
} from '@/lib/monitoring-auth';

export const dynamic = 'force-dynamic';

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

const globalForRateLimit = globalThis as unknown as {
  __momoAuthAttempts?: Map<string, { count: number; lockedUntil: number }>;
};

export async function POST(req: NextRequest) {
  try {
    if (!globalForRateLimit.__momoAuthAttempts) {
      globalForRateLimit.__momoAuthAttempts = new Map();
    }

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      '127.0.0.1';

    const record = globalForRateLimit.__momoAuthAttempts.get(ip);
    if (record && record.lockedUntil > Date.now()) {
      const remainingMin = Math.ceil((record.lockedUntil - Date.now()) / 60000);
      return NextResponse.json(
        {
          error: `Trop de tentatives échouées. Accès bloqué temporairement (${remainingMin} min).`,
        },
        { status: 429 }
      );
    }

    const body = (await req.json()) as { password?: string };
    const candidate = body.password?.trim() ?? '';

    if (!candidate || !verifyMonitoringPassword(candidate)) {
      const currentCount = (record && record.lockedUntil <= Date.now() ? 0 : record?.count ?? 0) + 1;
      const lockedUntil = currentCount >= MAX_ATTEMPTS ? Date.now() + LOCKOUT_MS : 0;
      globalForRateLimit.__momoAuthAttempts.set(ip, { count: currentCount, lockedUntil });

      return NextResponse.json(
        { error: 'Clé d’accès administrateur incorrecte.' },
        { status: 401 }
      );
    }

    globalForRateLimit.__momoAuthAttempts.delete(ip);

    const token = createSessionToken();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(MONITORING_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 14, // 14 days
    });

    return res;
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(MONITORING_COOKIE_NAME);
  return res;
}
