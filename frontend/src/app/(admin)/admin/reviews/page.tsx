import type { Metadata } from 'next';
import { AdminReviews } from '@/features/admin/components/admin-reviews';

export const metadata: Metadata = {
  title: 'Reviews · Admin',
  robots: { index: false, follow: false },
};

export default function AdminReviewsPage() {
  return <AdminReviews />;
}
