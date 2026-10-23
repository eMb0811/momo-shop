import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({
    status: 'healthy',
    app: 'momoShop (Next.js + TypeScript)',
    version: '3.0.0',
    timestamp: new Date().toISOString(),
  });
}
