import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage } from '@/components/layout/legal-page';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'The terms that apply when you buy from uwillove.',
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" updated="26 September 2026">
      <section>
        <h2>Orders</h2>
        <p>
          Placing an order is an offer to buy. It is accepted once payment is confirmed and the
          order enters production. We may decline an order if an item is unavailable or the price
          was listed incorrectly, in which case you are refunded in full.
        </p>
      </section>

      <section>
        <h2>Pricing</h2>
        <p>
          Prices are in Indian Rupees and include applicable taxes unless stated otherwise at
          checkout. We may change prices at any time, but never after your order is confirmed.
        </p>
      </section>

      <section>
        <h2>Product appearance</h2>
        <p>
          Colours can vary slightly between screens and between print runs. Fit is described on
          each product page — please check the size guide, since made-to-order pieces cannot be
          returned for size preference.
        </p>
      </section>

      <section>
        <h2>Shipping and returns</h2>
        <p>
          See the <Link href="/shipping" className="underline underline-offset-2">Shipping Policy</Link>{' '}
          and{' '}
          <Link href="/returns" className="underline underline-offset-2">
            Returns &amp; Refunds
          </Link>
          , which form part of these terms.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Questions about these terms:{' '}
          <a href={`mailto:${site.email}`} className="underline underline-offset-2">
            {site.email}
          </a>
          .
        </p>
      </section>
    </LegalPage>
  );
}
