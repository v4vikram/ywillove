'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from '../session-context';

/**
 * Client-side gate. This is UX only — the real check is the backend's auth
 * middleware, which never trusts anything the browser says.
 */
export function RequireAuth({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: 'admin';
}) {
  const { user, isLoading } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const allowed = Boolean(user) && (!role || user?.role === role);
  const wrongRole = Boolean(user) && !allowed;

  useEffect(() => {
    // Only bounce anonymous visitors. Someone who IS logged in but lacks the role
    // gets told why — silently redirecting them looks like a broken link.
    if (isLoading || user) return;

    router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [isLoading, user, router, pathname]);

  if (isLoading) return <p className="py-20 text-sm text-muted-foreground">Loading…</p>;

  if (wrongRole) {
    return (
      <div className="py-20">
        <h1 className="text-2xl">No access</h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          You&apos;re signed in as <strong className="text-foreground">{user?.email}</strong>, which
          is a {user?.role} account. This area needs an {role} account.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/login?next=${encodeURIComponent(pathname)}`}
            className="border border-foreground bg-foreground px-7 py-3 text-sm text-background transition-opacity hover:opacity-85"
          >
            Sign in as {role}
          </Link>
          <Link href="/" className="border border-border px-7 py-3 text-sm hover:border-foreground">
            Back to store
          </Link>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
