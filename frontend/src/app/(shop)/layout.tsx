import Link from 'next/link';
import { SiteHeader } from '@/components/layout/site-header';
import { NewsletterForm } from '@/features/newsletter/components/newsletter-form';
import { site } from '@/lib/site';

const FOOTER_LINKS = {
  Shop: [
    { label: 'All products', href: '/products' },
    { label: 'New in', href: '/products?sort=newest' },
    { label: 'Your orders', href: '/orders' },
  ],
  Help: [
    { label: 'Contact', href: '/contact' },
    { label: 'Shipping', href: '/shipping' },
    { label: 'Returns & refunds', href: '/returns' },
  ],
  Legal: [
    { label: 'Privacy policy', href: '/privacy' },
    { label: 'Terms & conditions', href: '/terms' },
  ],
};

export default function ShopLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="grid gap-12 lg:grid-cols-[1.5fr_2fr]">
            <div>
              <p className="text-base font-medium uppercase tracking-[0.18em]">uwillove</p>
              <p className="mt-3 max-w-xs text-sm text-muted-foreground">
                Made to order in India. Drop alerts, no spam.
              </p>
              <div className="mt-6">
                <NewsletterForm source="footer" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
                <nav key={heading}>
                  <h2 className="eyebrow">{heading}</h2>
                  <ul className="mt-4 space-y-2.5 text-sm">
                    {links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="hover:opacity-60">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} uwillove</p>
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer noopener"
              className="hover:opacity-60"
            >
              Instagram
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
