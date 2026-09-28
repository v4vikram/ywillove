'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useSession } from '../session-context';

export function AccountView() {
  const { user, logout } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (!user) return null;

  return (
    <div className="mt-8">
      <dl className="space-y-5 border-y py-6 text-sm">
        <div>
          <dt className="eyebrow">Name</dt>
          <dd className="mt-1">{user.name}</dd>
        </div>
        <div>
          <dt className="eyebrow">Email</dt>
          <dd className="mt-1">{user.email}</dd>
        </div>
        {user.phone ? (
          <div>
            <dt className="eyebrow">Phone</dt>
            <dd className="mt-1">{user.phone}</dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/orders"
          className="border border-foreground px-7 py-3 text-sm transition-colors hover:bg-foreground hover:text-background"
        >
          Your orders
        </Link>

        {user.role === 'admin' ? (
          <Link href="/admin" className="border border-border px-7 py-3 text-sm hover:border-foreground">
            Admin
          </Link>
        ) : null}

        <button
          type="button"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await logout();
              router.push('/');
            })
          }
          className="border border-border px-7 py-3 text-sm hover:border-foreground disabled:opacity-50"
        >
          {isPending ? 'Logging out…' : 'Log out'}
        </button>
      </div>
    </div>
  );
}
