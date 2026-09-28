'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/format';
import type { Product } from '@/features/product/types';
import { revalidateCatalog } from '../actions';
import { deactivateProduct, listProducts } from '../api';

export function AdminProducts() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    listProducts()
      .then((r) => setProducts(r.products))
      .catch(() => setProducts([]));
  }, []);

  function handleDeactivate(product: Product) {
    startTransition(async () => {
      try {
        await deactivateProduct(product.id);
        await revalidateCatalog();
        setProducts((current) => current?.filter((p) => p.id !== product.id) ?? null);
        toast.success(`${product.title} hidden from the store`);
      } catch {
        toast.error('Could not update the product');
      }
    });
  }

  return (
    <>
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl">Products</h1>
        <Link
          href="/admin/products/new"
          className="border border-foreground bg-foreground px-6 py-2.5 text-sm text-background transition-opacity hover:opacity-85"
        >
          New product
        </Link>
      </div>

      {!products ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
      ) : !products.length ? (
        <p className="mt-8 text-sm text-muted-foreground">No products yet.</p>
      ) : (
        <ul className="mt-8 divide-y border-y">
          {products.map((product) => (
            <li key={product.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
              <div>
                <Link href={`/admin/products/${product.slug}`} className="text-sm hover:opacity-60">
                  {product.title}
                </Link>
                <p className="mt-1 eyebrow">
                  {product.category?.name ?? 'Uncategorised'} · {formatPrice(product.basePrice)}
                </p>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <Link href={`/products/${product.slug}`} className="hover:opacity-60">
                  View
                </Link>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleDeactivate(product)}
                  className="text-muted-foreground hover:text-destructive disabled:opacity-50"
                >
                  Hide
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-6 text-xs text-muted-foreground">
        Hiding soft-deletes a product. Past orders keep their own copy of the name and price, so
        invoices never change.
      </p>
    </>
  );
}
