import type { Metadata } from 'next';
import { AdminProducts } from '@/features/admin/components/admin-products';

export const metadata: Metadata = {
  title: 'Products · Admin',
  robots: { index: false, follow: false },
};

export default function AdminProductsPage() {
  return <AdminProducts />;
}
