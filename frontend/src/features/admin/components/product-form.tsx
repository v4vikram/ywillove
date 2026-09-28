'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api/types';
import type { Category, Product } from '@/features/product/types';
import { revalidateCatalog } from '../actions';
import { createProduct, listCategories, updateProduct, type VariantInput } from '../api';

const EMPTY_VARIANT: VariantInput = { size: '', color: '', price: '', supplierSku: '' };

const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState(product?.title ?? '');
  const [slug, setSlug] = useState(product?.slug ?? '');
  const [images, setImages] = useState((product?.images ?? []).join('\n'));
  const [variants, setVariants] = useState<VariantInput[]>(
    product?.variants?.length
      ? product.variants.map((v) => ({
          size: v.size,
          color: v.color,
          price: v.price,
          supplierSku: v.supplierSku,
        }))
      : [EMPTY_VARIANT],
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    listCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  function updateVariant(index: number, patch: Partial<VariantInput>) {
    setVariants((current) => current.map((v, i) => (i === index ? { ...v, ...patch } : v)));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const data = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>;

    const payload = {
      title,
      slug: slug || slugify(title),
      description: data.description,
      basePrice: data.basePrice,
      categoryId: Number(data.categoryId),
      images: images.split('\n').map((line) => line.trim()).filter(Boolean),
      // Variants are only sent on create; the update endpoint patches the product row.
      ...(isEdit ? {} : { variants: variants.filter((v) => v.size && v.supplierSku) }),
    };

    startTransition(async () => {
      try {
        if (isEdit) {
          await updateProduct(product!.id, payload);
        } else {
          await createProduct(payload);
        }

        await revalidateCatalog();
        toast.success(isEdit ? 'Product updated' : 'Product created');
        router.push('/admin/products');
        router.refresh();
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Could not save the product');
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-6">
      <div>
        <label htmlFor="title" className="eyebrow">Title</label>
        <input
          id="title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            if (!isEdit) setSlug(slugify(event.target.value));
          }}
          required
          className="mt-2 w-full border-b border-border bg-transparent py-2.5 text-sm outline-none focus:border-foreground"
        />
      </div>

      <div>
        <label htmlFor="slug" className="eyebrow">Slug</label>
        <input
          id="slug"
          value={slug}
          onChange={(event) => setSlug(slugify(event.target.value))}
          required
          className="mt-2 w-full border-b border-border bg-transparent py-2.5 font-mono text-sm outline-none focus:border-foreground"
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          {isEdit ? 'Changing this breaks existing links and loses the page’s ranking.' : 'Auto-filled from the title.'}
        </p>
      </div>

      <div>
        <label htmlFor="description" className="eyebrow">Description</label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={product?.description ?? ''}
          className="mt-2 w-full border border-border bg-transparent p-3 text-sm outline-none focus:border-foreground"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="basePrice" className="eyebrow">Base price (₹)</label>
          <input
            id="basePrice"
            name="basePrice"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={product?.basePrice ?? ''}
            className="mt-2 w-full border-b border-border bg-transparent py-2.5 text-sm outline-none focus:border-foreground"
          />
        </div>

        <div>
          <label htmlFor="categoryId" className="eyebrow">Category</label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={product?.categoryId ?? ''}
            className="mt-2 w-full border-b border-border bg-transparent py-2.5 text-sm outline-none focus:border-foreground"
          >
            <option value="" disabled>Select…</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="images" className="eyebrow">Image URLs — one per line</label>
        <textarea
          id="images"
          rows={3}
          value={images}
          onChange={(event) => setImages(event.target.value)}
          placeholder="https://res.cloudinary.com/…"
          className="mt-2 w-full border border-border bg-transparent p-3 font-mono text-xs outline-none focus:border-foreground"
        />
      </div>

      {!isEdit ? (
        <fieldset>
          <legend className="eyebrow">Variants</legend>
          <p className="mt-1.5 text-xs text-muted-foreground">
            SKU must match the Qikink product SKU — that is what gets sent for printing.
          </p>

          <div className="mt-4 space-y-3">
            {variants.map((variant, index) => (
              <div key={index} className="grid gap-2 sm:grid-cols-[1fr_1fr_1fr_1.5fr_auto]">
                <VariantInputField placeholder="Size" value={variant.size} onChange={(v) => updateVariant(index, { size: v })} />
                <VariantInputField placeholder="Colour" value={variant.color} onChange={(v) => updateVariant(index, { color: v })} />
                <VariantInputField placeholder="Price" value={variant.price} onChange={(v) => updateVariant(index, { price: v })} />
                <VariantInputField placeholder="Qikink SKU" value={variant.supplierSku} onChange={(v) => updateVariant(index, { supplierSku: v })} />
                <button
                  type="button"
                  onClick={() => setVariants((c) => c.filter((_, i) => i !== index))}
                  disabled={variants.length === 1}
                  aria-label="Remove variant"
                  className="px-2 text-sm text-muted-foreground hover:text-destructive disabled:opacity-30"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setVariants((c) => [...c, { ...EMPTY_VARIANT }])}
            className="mt-3 text-sm underline underline-offset-2 hover:opacity-60"
          >
            Add variant
          </button>
        </fieldset>
      ) : (
        <p className="border border-border p-4 text-xs text-muted-foreground">
          Variants are set when a product is created. Editing them needs its own endpoint — not
          built yet.
        </p>
      )}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="border border-foreground bg-foreground px-7 py-3 text-sm text-background transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          {isPending ? 'Saving…' : isEdit ? 'Save changes' : 'Create product'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-border px-7 py-3 text-sm hover:border-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function VariantInputField({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      aria-label={placeholder}
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground"
    />
  );
}
