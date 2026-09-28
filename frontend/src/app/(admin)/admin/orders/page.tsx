import type { Metadata } from 'next';
import { AdminOrders } from '@/features/admin/components/admin-orders';

export const metadata: Metadata = {
  title: 'Orders · Admin',
  robots: { index: false, follow: false },
};

export default function AdminOrdersPage() {
  return <AdminOrders />;
}
