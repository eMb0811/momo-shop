import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/monitoring', '/api/'],
    },
    sitemap: 'https://momoshop.sn/sitemap.xml',
  };
}
