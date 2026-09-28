import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage } from '@/components/layout/legal-page';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Returns & Refunds',
  description: 'Return window, refund timelines and cancellation rules for uwillove orders.',
};

export default function ReturnsPage() {
  return (
    <LegalPage title="Returns, Refunds & Cancellations" updated="26 September 2026">
      <section>
        <h2>Cancellations</h2>
        <p>
          You can cancel free of charge until the order goes into production, which is usually
          within 12 hours of placing it. After printing starts we cannot cancel, because the piece
          was made for you specifically.
        </p>
      </section>

      <section>
        <h2>Returns</h2>
        <p>Because every item is made to order, we accept returns only when:</p>
        <ul>
          <li>the item arrived damaged or with a print defect</li>
          <li>you received the wrong size, colour or product</li>
        </ul>
        <p>
          Raise it within 7 days of delivery with photos of the item and the packaging. We do not
          accept returns for a change of mind or an incorrect size chosen at checkout — check the
          size guide on the product page before ordering.
        </p>
      </section>

      <section>
        <h2>Refunds</h2>
        <p>
          Approved refunds are issued to the original payment method within 5-7 working days of
          the returned item reaching us, or immediately on approval if no return pickup is needed.
          Your bank may take a further 2-3 days to show it.
        </p>
      </section>

      <section>
        <h2>How to raise a request</h2>
        <p>
          Email <a href={`mailto:${site.email}`} className="underline underline-offset-2">{site.email}</a>{' '}
          with your order number, or message us on{' '}
          <Link href={site.instagram} className="underline underline-offset-2">
            Instagram
          </Link>
          .
        </p>
      </section>
    </LegalPage>
  );
}
