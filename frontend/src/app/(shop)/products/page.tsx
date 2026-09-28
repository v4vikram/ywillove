import type { Metadata } from 'next';
import { getProducts } from '@/features/product/api';
import { ProductCard } from '@/features/product/components/product-card';
import type { ProductFilters } from '@/features/product/types';

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Korean-fit baggy pants, oversized shirts and heavyweight tees.',
};

export default async function ProductsPage(props: PageProps<'/products'>) {
  // Filters live in the URL, not in state — shareable, back-button-safe, and the
  // server can read them directly.
  const filters = (await props.searchParams) as ProductFilters;
  const { products, total } = await getProducts(filters);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex items-baseline justify-between">
        <h1 className="text-2xl">Shop</h1>
        <p className="eyebrow">
          {total} {total === 1 ? 'piece' : 'pieces'}
        </p>
      </div>

      {products.length ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Nothing here yet.</p>
      )}
    </section>
  );
}
