import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthForm } from '@/features/auth/components/auth-form';

export const metadata: Metadata = {
  title: 'Log in',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <Suspense>
      <AuthForm mode="login" />
    </Suspense>
  );
}
