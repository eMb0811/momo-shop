import React from 'react';
import { getProducts } from '@/lib/products';
import { Storefront } from '@/components/Storefront';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const products = getProducts();

  return <Storefront products={products} />;
}
