import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProduct, getProducts } from '@/features/product/api';
import { AddToCart } from '@/features/cart/components/add-to-cart';
import { getProductReviews } from '@/features/review/api';
import { Stars } from '@/features/review/components/stars';
import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbSchema, productSchema } from '@/components/seo/schemas';
import { formatPrice } from '@/lib/format';

// Product pages carry the SEO weight, so they are prerendered at build time and
// revalidated by tag. A slug added after the build still renders on demand.
export async function generateStaticParams() {
  const { products } = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

async function loadProduct(slug: string) {
  try {
    return await getProduct(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata(props: PageProps<'/products/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await loadProduct(slug);

  if (!product) return { title: 'Not found' };

  return {
    title: product.title,
    description: product.description ?? undefined,
    openGraph: {
      title: product.title,
      description: product.description ?? undefined,
      images: product.images?.length ? [{ url: product.images[0] }] : undefined,
    },
  };
}

export default async function ProductPage(props: PageProps<'/products/[slug]'>) {
  const { slug } = await props.params;
  const product = await loadProduct(slug);

  if (!product) notFound();

  const variants = product.variants ?? [];
  const reviews = await getProductReviews(product.id);

  return (
    <>
      <JsonLd data={productSchema(product, { average: reviews.average, count: reviews.count })} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Shop', url: '/products' },
          { name: product.title, url: `/products/${product.slug}` },
        ])}
      />

      <article className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-2 lg:gap-16">
      <div className="space-y-3">
        {product.images?.length ? (
          product.images.map((src, index) => (
            <div key={src} className="relative aspect-3/4 overflow-hidden bg-muted">
              <Image
                src={src}
                alt={product.title}
                fill
                priority={index === 0}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ))
        ) : (
          <div className="flex aspect-3/4 items-center justify-center bg-muted eyebrow">
            no image
          </div>
        )}
      </div>

      <div className="lg:sticky lg:top-24 lg:h-fit">
        {product.category ? <p className="eyebrow">{product.category.name}</p> : null}
        <h1 className="mt-3 text-3xl">{product.title}</h1>
        <p className="mt-3 text-lg tabular-nums">{formatPrice(product.basePrice)}</p>

        {reviews.count ? (
          <p className="mt-3 flex items-center gap-2 text-sm">
            <Stars rating={Math.round(reviews.average)} label={`${reviews.average.toFixed(1)} out of 5`} />
            <span className="text-muted-foreground">
              {reviews.average.toFixed(1)} · {reviews.count}{' '}
              {reviews.count === 1 ? 'review' : 'reviews'}
            </span>
          </p>
        ) : null}

        {product.description ? (
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        ) : null}

        <div className="mt-10">
          <AddToCart variants={variants} />
        </div>

        <p className="mt-6 eyebrow">Made to order · ships in 5-7 days</p>

        {reviews.reviews.length ? (
          <section className="mt-12 border-t pt-8">
            <h2 className="text-base font-medium">Reviews</h2>
            <ul className="mt-5 space-y-6">
              {reviews.reviews.map((review) => (
                <li key={review.id}>
                  <Stars rating={review.rating} />
                  {review.body ? <p className="mt-2 text-sm leading-relaxed">{review.body}</p> : null}
                  <p className="mt-1.5 text-xs text-muted-foreground">{review.user.name}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
      </article>
    </>
  );
}
