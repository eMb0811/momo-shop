import type { CartItem, Product, Size } from './types';

export const WHATSAPP_NUMBER = '221783901159';
export const WHATSAPP_DISPLAY = '+221 78 390 11 59';

export function formatPrice(fcfa: number): string {
  // Espace fine insécable remplacée par une espace classique pour un rendu homogène
  return `${fcfa.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} FCFA`;
}

export function whatsappUrl(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function productOrderMessage(product: Product, size: Size, qty = 1): string {
  const qtyStr = qty > 1 ? ` (${qty} exemplaires)` : '';
  return `Bonjour momoShop ! Je souhaite commander le ${product.name} en taille ${size}${qtyStr} pour un montant de ${formatPrice(
    product.price_cfa * qty,
  )}. Pouvez-vous me confirmer la disponibilité ?`;
}

export function cartOrderMessage(items: CartItem[]): string {
  const lines = items.map(
    (i) => `• ${i.name} — Taille ${i.size} × ${i.qty} = ${formatPrice(i.unitPrice * i.qty)}`,
  );
  const total = items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
  return [
    'Bonjour momoShop ! Je souhaite passer la commande suivante :',
    '',
    ...lines,
    '',
    `Total : ${formatPrice(total)}`,
    '',
    'Pouvez-vous me confirmer la disponibilité et la livraison ?',
  ].join('\n');
}
