import type { Metadata } from 'next';
import { ProductForm } from '@/features/admin/components/product-form';

export const metadata: Metadata = {
  title: 'New product · Admin',
  robots: { index: false, follow: false },
};

export default function NewProductPage() {
  return (
    <>
      <h1 className="text-2xl">New product</h1>
      <ProductForm />
    </>
  );
}
