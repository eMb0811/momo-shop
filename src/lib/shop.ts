import type { CartItem, Product, Size } from './types';

export const WHATSAPP_NUMBER = '221783901159';
export const WHATSAPP_DISPLAY = '+221 78 390 11 59';

export interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
  estimatedTime: string;
}

export const DEFAULT_DELIVERY_ZONE: DeliveryZone = {
  id: 'dakar-centre',
  name: 'Dakar Centre (Plateau, Médina, Fann, Point E)',
  fee: 0,
  estimatedTime: 'Livraison 24h (Gratuite)',
};

export const DELIVERY_ZONES: DeliveryZone[] = [
  DEFAULT_DELIVERY_ZONE,
  {
    id: 'dakar-ouest-nord',
    name: 'Dakar Ouest & Nord (Almadies, Ngor, Ouakam, Yoff, Mermoz)',
    fee: 0,
    estimatedTime: 'Livraison 24h (Gratuite)',
  },
  {
    id: 'dakar-banlieue',
    name: 'Dakar Banlieue (Pikine, Guédiawaye, Keur Massar, Rufisque)',
    fee: 0,
    estimatedTime: 'Livraison 24h (Gratuite)',
  },
  {
    id: 'regions-senegal',
    name: 'Régions du Sénégal (Thiès, Mbour, Saint-Louis, etc.)',
    fee: 0,
    estimatedTime: 'Expédition 48h-72h (Gratuite)',
  },
];

export type PaymentMethod = 'Wave' | 'Orange Money' | 'Espèces à la livraison';

export interface PaymentOption {
  id: PaymentMethod;
  label: string;
  icon: string;
}

export const PAYMENT_METHODS: PaymentOption[] = [
  { id: 'Wave', label: 'Wave', icon: '💙' },
  { id: 'Orange Money', label: 'Orange Money', icon: '🧡' },
  { id: 'Espèces à la livraison', label: 'Espèces à la livraison', icon: '💵' },
];

export interface CartOrderDetails {
  customerName?: string;
  zone?: DeliveryZone;
  address?: string;
  paymentMethod?: PaymentMethod;
}

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
  )} (Livraison 100% offerte 🎁). Pouvez-vous me confirmer la disponibilité ?`;
}

export function cartOrderMessage(
  items: CartItem[],
  details?: CartOrderDetails,
): string {
  const itemsTotal = items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
  const deliveryFee = details?.zone?.fee ?? 0;
  const grandTotal = itemsTotal + deliveryFee;

  const lines: string[] = [
    '🇸🇳 *COMMANDE MOMOSHOP DAKAR*',
    '--------------------------------',
  ];

  if (details?.customerName?.trim()) {
    lines.push(`👤 *Client :* ${details.customerName.trim()}`);
  }

  if (details?.zone) {
    lines.push(`📍 *Zone de livraison :* ${details.zone.name} (${details.zone.estimatedTime})`);
  }

  if (details?.address?.trim()) {
    lines.push(`🏠 *Adresse / Repère :* ${details.address.trim()}`);
  }

  if (details?.paymentMethod) {
    lines.push(`💳 *Mode de règlement :* ${details.paymentMethod}`);
  }

  if (details && (details.customerName || details.zone || details.address || details.paymentMethod)) {
    lines.push('--------------------------------');
  }

  lines.push('*Articles commandés :*');
  items.forEach((i) => {
    lines.push(`• ${i.name} — Taille ${i.size} (${i.colorName}) × ${i.qty} = ${formatPrice(i.unitPrice * i.qty)}`);
  });

  lines.push('--------------------------------');
  lines.push(`Sous-total articles : ${formatPrice(itemsTotal)}`);

  if (details?.zone) {
    lines.push(`Frais de livraison : OFFERTS (0 FCFA) • ${details.zone.estimatedTime}`);
    lines.push(`*TOTAL NET À PAYER : ${formatPrice(itemsTotal)}* (Livraison 100% offerte 🎁)`);
  } else {
    lines.push(`*TOTAL : ${formatPrice(itemsTotal)}* (Livraison offerte 🎁)`);
  }

  lines.push('--------------------------------');
  lines.push('Pouvez-vous me confirmer la prise en charge de ma commande ? Merci !');

  return lines.join('\n');
}
