import fs from 'node:fs';
import path from 'node:path';
import type { CategoryFilter, Product } from './types';

export function getProducts(category: CategoryFilter = 'all'): Product[] {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'products.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    const products = JSON.parse(raw) as Product[];
    if (category === 'all') return products;
    return products.filter((p) => p.color.category === category);
  } catch (err) {
    console.error('Error reading products.json:', err);
    return [];
  }
}

export function getProduct(idOrSlug: string): Product | undefined {
  const products = getProducts();
  return products.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
}

export function getProductBySlug(slug: string): Product | undefined {
  return getProduct(slug);
}

