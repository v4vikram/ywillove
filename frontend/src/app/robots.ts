import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Per-user and transactional pages have nothing to rank for.
      disallow: ['/admin', '/cart', '/checkout', '/orders', '/account'],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
