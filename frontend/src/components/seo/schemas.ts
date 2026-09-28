import { site } from '@/lib/site';
import type { Product } from '@/features/product/types';

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: site.url,
    description: site.description,
    email: site.email,
    sameAs: [site.instagram],
  };
}

// Enables the sitelinks search box in Google results.
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: site.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${site.url}/products?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function productSchema(product: Product, rating?: { average: number; count: number }) {
  const inStock = (product.variants ?? []).some((variant) => variant.isActive);

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description ?? undefined,
    image: product.images,
    sku: product.variants?.[0]?.supplierSku,
    brand: { '@type': 'Brand', name: site.name },
    offers: {
      '@type': 'Offer',
      url: `${site.url}/products/${product.slug}`,
      priceCurrency: 'INR',
      price: product.basePrice,
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
    // Only emitted when real reviews exist — inventing ratings is a manual action
    // from Google, not just a wasted rich result.
    ...(rating?.count
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: rating.average.toFixed(1),
            reviewCount: rating.count,
          },
        }
      : {}),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${site.url}${item.url}`,
    })),
  };
}
