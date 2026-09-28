import type { MetadataRoute } from 'next';
import { getProducts } from '@/features/product/api';
import { site } from '@/lib/site';

const STATIC_PATHS = ['', '/products', '/contact', '/shipping', '/returns', '/privacy', '/terms'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { products } = await getProducts().catch(() => ({ products: [] }));

  return [
    ...STATIC_PATHS.map((path) => ({
      url: `${site.url}${path}`,
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.6,
    })),
    ...products.map((product) => ({
      url: `${site.url}/products/${product.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
