import type { Metadata } from 'next';
import { NewsletterForm } from '@/features/newsletter/components/newsletter-form';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with uwillove about an order, a return or anything else.',
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:py-20">
      <h1 className="text-3xl">Contact</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Order issue, return request, or a question about fit — we usually reply within one working
        day.
      </p>

      <dl className="mt-10 space-y-6 text-sm">
        <div>
          <dt className="eyebrow">Email</dt>
          <dd className="mt-1">
            <a href={`mailto:${site.email}`} className="underline underline-offset-2">
              {site.email}
            </a>
          </dd>
        </div>

        <div>
          <dt className="eyebrow">Instagram</dt>
          <dd className="mt-1">
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer noopener"
              className="underline underline-offset-2"
            >
              @uwillove
            </a>
          </dd>
        </div>

        <div>
          <dt className="eyebrow">Returns</dt>
          <dd className="mt-1 text-muted-foreground">
            Include your order number and photos of the item and packaging.
          </dd>
        </div>
      </dl>

      <div className="mt-14 border-t pt-10">
        <p className="eyebrow">Drop alerts</p>
        <div className="mt-4">
          <NewsletterForm source="contact" />
        </div>
      </div>
    </section>
  );
}
