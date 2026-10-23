import { NextResponse } from 'next/server';
import { getProduct } from '@/lib/products';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) {
    return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 });
  }
  return NextResponse.json(product);
}
