import Link from 'next/link';
import { Hero } from '@/components/home/hero';
import { InstagramCta } from '@/components/home/instagram-cta';
import { Marquee } from '@/components/home/marquee';
import { ValueProps } from '@/components/home/value-props';
import { JsonLd } from '@/components/seo/json-ld';
import { organizationSchema, websiteSchema } from '@/components/seo/schemas';
import { getCategories, getProducts } from '@/features/product/api';
import { ProductCard } from '@/features/product/components/product-card';
import { getRecentReviews } from '@/features/review/api';
import { ReviewWall } from '@/features/review/components/review-wall';

export default async function HomePage() {
  const [{ products }, categories, reviews] = await Promise.all([
    getProducts({ sort: 'newest' }),
    getCategories(),
    getRecentReviews(3),
  ]);

  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema()} />

      <Hero />
      <Marquee />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="text-xl sm:text-2xl">Latest drop</h2>
          <Link href="/products" className="text-sm hover:opacity-60">
            View all
          </Link>
        </div>

        {products.length ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Drop 01 lands soon.</p>
        )}
      </section>

      {categories.length ? (
        <section className="border-t">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
            <h2 className="mb-8 text-xl sm:text-2xl">Shop by fit</h2>

            <div className="grid gap-px border bg-border sm:grid-cols-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className="group flex items-center justify-between bg-background p-8 transition-colors hover:bg-muted/60"
                >
                  <span className="text-lg">{category.name}</span>
                  <span
                    aria-hidden
                    className="text-lg transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <ReviewWall reviews={reviews} />
      <ValueProps />
      <InstagramCta />
    </>
  );
}
