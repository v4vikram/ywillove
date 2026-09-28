import Link from 'next/link';
import { Suspense } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { RequireAuth } from '@/features/auth/components/require-auth';

// Admin reads live data on every request — a cached order list is a wrong order list.
export const dynamic = 'force-dynamic';

const NAV = [
  { label: 'Overview', href: '/admin' },
  { label: 'Products', href: '/admin/products' },
  { label: 'Orders', href: '/admin/orders' },
  { label: 'Reviews', href: '/admin/reviews' },
];

export default function AdminLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 px-4">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="text-sm font-medium uppercase tracking-[0.18em]">
              uwillove <span className="text-muted-foreground">admin</span>
            </Link>

            <nav className="hidden gap-5 text-sm sm:flex">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href} className="hover:opacity-60">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-5 text-sm">
            <Link href="/" className="hover:opacity-60">
              View store
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Suspense>
          <RequireAuth role="admin">
            <div className="mx-auto max-w-6xl px-4 py-10">{children}</div>
          </RequireAuth>
        </Suspense>
      </main>
    </>
  );
}
