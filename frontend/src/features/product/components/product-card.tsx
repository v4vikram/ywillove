import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/format';
import type { Product } from '../types';

export function ProductCard({ product }: { product: Product }) {
  const cover = product.images?.[0];

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-3/4 overflow-hidden bg-muted">
        {cover ? (
          <Image
            src={cover}
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center eyebrow">no image</div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-normal leading-snug">{product.title}</h3>
        <span className="text-sm tabular-nums">{formatPrice(product.basePrice)}</span>
      </div>

      {product.category ? <p className="mt-1 eyebrow">{product.category.name}</p> : null}
    </Link>
  );
}
