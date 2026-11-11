import React from 'react';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { createSessionToken, MONITORING_COOKIE_NAME } from '@/lib/monitoring-auth';
import { MonitoringDashboard } from '@/components/MonitoringDashboard';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Monitoring & Analytics',
  description: 'Console de supervision temps réel, santé serveur et analytics e-commerce momoShop.',
  robots: { index: false, follow: false },
};

export default async function MonitoringPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(MONITORING_COOKIE_NAME)?.value;
  const expectedToken = createSessionToken();
  const isAuthorized = Boolean(sessionCookie && sessionCookie === expectedToken);

  return <MonitoringDashboard initialAuthorized={isAuthorized} />;
}
