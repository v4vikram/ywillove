'use client';

import { useEffect, useState } from 'react';
import type { Product } from '@/features/product/types';
import { getProduct } from '../api';
import { ProductForm } from './product-form';

export function EditProduct({ slug }: { slug: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    getProduct(slug)
      .then(setProduct)
      .catch(() => setMissing(true));
  }, [slug]);

  if (missing) return <p className="mt-8 text-sm text-muted-foreground">Product not found.</p>;
  if (!product) return <p className="mt-8 text-sm text-muted-foreground">Loading…</p>;

  return (
    <>
      <h1 className="text-2xl">{product.title}</h1>
      <ProductForm product={product} />
    </>
  );
}
