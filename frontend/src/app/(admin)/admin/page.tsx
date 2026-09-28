import type { Metadata } from 'next';
import { AdminOverview } from '@/features/admin/components/admin-overview';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminOverview />;
}
