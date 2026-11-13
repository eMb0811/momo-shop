import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'momoShop — T-Shirts Coton Mercerisé Dakar',
    short_name: 'momoShop',
    description:
      'Boutique urbaine de t-shirts coupe ajustée en pur coton peigné mercerisé à Dakar, Sénégal. Commande directe sur WhatsApp.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f6f4ee',
    theme_color: '#0d0d11',
    orientation: 'portrait',
    icons: [
      {
        src: '/images/logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable' as unknown as 'any',
      },
      {
        src: '/images/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable' as unknown as 'any',
      },
    ],
    categories: ['shopping', 'lifestyle'],
  };
}
