'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { useCart } from '@/features/cart/cart-context';
import { useSession } from '@/features/auth/session-context';

export function SiteHeader() {
  const { itemCount } = useCart();
  const { user, isLoading } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 px-4">
        <Link href="/" className="text-base font-medium tracking-[0.18em] uppercase">
          uwillove
        </Link>

        <nav className="hidden gap-6 text-sm sm:flex">
          <Link href="/products" className="hover:opacity-60">
            Shop
          </Link>
          <Link href="/products?sort=newest" className="hover:opacity-60">
            New
          </Link>
        </nav>

        <div className="flex items-center gap-5 text-sm">
          {!isLoading && (
            <Link href={user ? '/account' : '/login'} className="hover:opacity-60">
              {user ? user.name.split(' ')[0] : 'Login'}
            </Link>
          )}

          <Link href="/cart" className="hover:opacity-60">
            Cart{itemCount > 0 ? ` (${itemCount})` : ''}
          </Link>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
