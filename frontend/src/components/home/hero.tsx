import Link from 'next/link';

export function Hero() {
  return (
    <section className="border-b">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28 lg:py-36">
        <p className="eyebrow">Drop 01 — made to order</p>

        <h1 className="mt-7 max-w-4xl text-5xl leading-[0.92] sm:text-7xl lg:text-8xl">
          Korean fit.
          <br />
          <span className="text-muted-foreground">Nothing extra.</span>
        </h1>

        <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Baggy pants, oversized shirts and heavyweight tees. Four pieces, cut properly,
            printed and shipped from India.
          </p>

          <div className="flex gap-3">
            <Link
              href="/products"
              className="border border-foreground bg-foreground px-8 py-3.5 text-sm text-background transition-opacity hover:opacity-85"
            >
              Shop the drop
            </Link>
            <Link
              href="/products?sort=newest"
              className="border border-border px-8 py-3.5 text-sm transition-colors hover:border-foreground"
            >
              What&apos;s new
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
