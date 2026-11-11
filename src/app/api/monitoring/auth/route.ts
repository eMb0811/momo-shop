import { NextResponse, type NextRequest } from 'next/server';
import {
  createSessionToken,
  MONITORING_COOKIE_NAME,
  verifyMonitoringPassword,
} from '@/lib/monitoring-auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { password?: string };
    const candidate = body.password?.trim() ?? '';

    if (!candidate || !verifyMonitoringPassword(candidate)) {
      return NextResponse.json(
        { error: 'Mot de passe administrateur incorrect.' },
        { status: 401 }
      );
    }

    const token = createSessionToken();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(MONITORING_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
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
