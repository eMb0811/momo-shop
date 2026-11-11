export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type ColorCategory = 'neutres' | 'pop' | 'nature';

export interface ProductColor {
  name: string;
  hex: string;
  category: ColorCategory;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  color: ProductColor;
  badge: string;
  price_eur: number;
  price_cfa: number;
  image: string;
  weight: string;
  composition: string;
  fit: string;
  collar: string;
  dye: string;
  sizes: Size[];
  stock: Record<Size, number>;
  description: string;
}

export interface CartItem {
  key: string; // `${productId}-${size}`
  productId: string;
  name: string;
  colorName: string;
  hex: string;
  image: string;
  size: Size;
  unitPrice: number; // FCFA
  qty: number;
}

export type CategoryFilter = 'all' | ColorCategory;
