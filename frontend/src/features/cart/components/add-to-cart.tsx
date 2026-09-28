'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/format';
import type { ProductVariant } from '@/features/product/types';
import { useCart } from '../cart-context';

export function AddToCart({ variants }: { variants: ProductVariant[] }) {
  const { add } = useCart();
  const [selectedId, setSelectedId] = useState(variants[0]?.id ?? '');
  const [isPending, startTransition] = useTransition();

  const selected = variants.find((v) => v.id === selectedId);
  const sizes = [...new Set(variants.map((v) => v.size))];

  if (!variants.length) {
    return <p className="text-sm text-muted-foreground">Sold out.</p>;
  }

  function handleAdd() {
    startTransition(async () => {
      try {
        await add(selectedId);
        toast.success('Added to cart');
      } catch {
        toast.error('Could not add to cart');
      }
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow mb-3">Size</p>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => {
            const variant = variants.find((v) => v.size === size)!;
            const isActive = selected?.size === size;

            return (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedId(variant.id)}
                aria-pressed={isActive}
                className={`min-w-12 border px-4 py-2 text-sm transition-colors ${
                  isActive
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border hover:border-foreground'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={isPending || !selected}
        className="w-full border border-foreground bg-foreground px-7 py-3.5 text-sm text-background transition-opacity hover:opacity-85 disabled:opacity-50"
      >
        {isPending ? 'Adding…' : `Add to cart — ${formatPrice(selected?.price ?? 0)}`}
      </button>
    </div>
  );
}
