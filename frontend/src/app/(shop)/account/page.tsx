import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AccountView } from '@/features/auth/components/account-view';
import { RequireAuth } from '@/features/auth/components/require-auth';

export const metadata: Metadata = {
  title: 'Account',
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl">Account</h1>
      <Suspense>
        <RequireAuth>
          <AccountView />
        </RequireAuth>
      </Suspense>
    </section>
  );
}
