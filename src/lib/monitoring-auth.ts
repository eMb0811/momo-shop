import crypto from 'node:crypto';
import type { NextRequest } from 'next/server';

export const MONITORING_COOKIE_NAME = 'momoshop_monitoring_session';
const DEFAULT_DEV_PASSWORD = 'momoshop-admin-2026';

export function getMonitoringPassword(): { password: string; isDefaultPassword: boolean } {
  const envPass = process.env.MONITORING_PASSWORD?.trim();
  if (envPass && envPass.length > 0) {
    return { password: envPass, isDefaultPassword: false };
  }
  return { password: DEFAULT_DEV_PASSWORD, isDefaultPassword: true };
}

export function createSessionToken(): string {
  const { password } = getMonitoringPassword();
  return crypto
    .createHmac('sha256', password)
    .update('momoshop-monitoring-authenticated-v1')
    .digest('hex');
}

export function verifyMonitoringPassword(candidate: string): boolean {
  const { password } = getMonitoringPassword();
  const a = Buffer.from(candidate);
  const b = Buffer.from(password);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function isRequestAuthorized(req: NextRequest): boolean {
  const expected = createSessionToken();
  const cookieToken = req.cookies.get(MONITORING_COOKIE_NAME)?.value;
  if (cookieToken && cookieToken === expected) {
    return true;
  }

  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const raw = authHeader.slice(7).trim();
    if (verifyMonitoringPassword(raw)) {
      return true;
    }
  }

  return false;
}
