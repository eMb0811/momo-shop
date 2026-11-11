import { NextResponse, type NextRequest } from 'next/server';
import { getProducts } from '@/lib/products';
import type { CategoryFilter } from '@/lib/types';

export const dynamic = 'force-dynamic';

const VALID: CategoryFilter[] = ['all', 'neutres', 'pop', 'nature'];

export function GET(req: NextRequest) {
  const param = req.nextUrl.searchParams.get('category') ?? 'all';
  const category = (VALID as string[]).includes(param) ? (param as CategoryFilter) : 'all';
  const products = getProducts(category);
  return NextResponse.json({ count: products.length, products });
}
