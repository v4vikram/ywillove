import type { Metadata } from 'next';
import { LegalPage } from '@/components/layout/legal-page';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'What data uwillove collects, why, and how you can have it removed.',
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="26 September 2026">
      <section>
        <h2>What we collect</h2>
        <ul>
          <li>Account details: name, email, phone</li>
          <li>Order details: shipping address, items, order history</li>
          <li>Email address, if you subscribe to drop alerts</li>
        </ul>
        <p>
          We do not store card numbers. Payments are handled on Razorpay&apos;s hosted page, and we
          only ever see the payment status.
        </p>
      </section>

      <section>
        <h2>Why we collect it</h2>
        <p>
          To process and deliver your order, to let you see your order history, and to send drop
          alerts if you asked for them. We do not sell your data.
        </p>
      </section>

      <section>
        <h2>Who we share it with</h2>
        <ul>
          <li>Our print and fulfilment partner, to produce and ship your order</li>
          <li>Razorpay, to process payment</li>
          <li>Courier partners, to deliver</li>
        </ul>
      </section>

      <section>
        <h2>Your choices</h2>
        <p>
          Every drop alert email has an unsubscribe link. To see, correct or delete the data we
          hold about you, email{' '}
          <a href={`mailto:${site.email}`} className="underline underline-offset-2">
            {site.email}
          </a>
          . We will action it within 30 days. Order records may be retained where we are required
          to keep them for tax and accounting purposes.
        </p>
      </section>

      <section>
        <h2>Cookies</h2>
        <p>
          We use cookies for login sessions and to keep your cart if you are browsing logged out.
          These are required for the site to work.
        </p>
      </section>
    </LegalPage>
  );
}
