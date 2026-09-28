import type { Metadata } from 'next';
import { LegalPage } from '@/components/layout/legal-page';

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description: 'Dispatch timelines, delivery estimates and shipping charges for uwillove orders.',
};

export default function ShippingPage() {
  return (
    <LegalPage title="Shipping Policy" updated="26 September 2026">
      <section>
        <h2>Made to order</h2>
        <p>
          Every uwillove piece is printed after you place the order. Nothing sits in a warehouse,
          which means production adds a little time up front but nothing goes to waste.
        </p>
      </section>

      <section>
        <h2>Dispatch and delivery</h2>
        <ul>
          <li>Production: 2-3 working days after payment is confirmed</li>
          <li>Delivery: 3-5 working days after dispatch for most Indian pin codes</li>
          <li>Remote or non-serviceable pin codes may take longer</li>
        </ul>
        <p>
          You will receive a tracking link by email once the order leaves our print partner.
        </p>
      </section>

      <section>
        <h2>Shipping charges</h2>
        <p>
          Shipping charges, if any, are shown at checkout before payment. Cash on delivery may
          carry an additional handling fee, which is also shown before you confirm.
        </p>
      </section>

      <section>
        <h2>Delays</h2>
        <p>
          Courier delays, weather and regional restrictions are outside our control. If an order
          has not moved for more than 7 working days, write to us and we will chase it or reprint
          it at no cost to you.
        </p>
      </section>
    </LegalPage>
  );
}
