import { NextResponse } from 'next/server';
import { getSystemHealthReport } from '@/lib/monitoring';

export const dynamic = 'force-dynamic';

export function GET() {
  const report = getSystemHealthReport(true);
  const httpStatus = report.status === 'unhealthy' ? 503 : 200;

  return NextResponse.json(report, {
    status: httpStatus,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
