import type { Metadata } from 'next';
import { EditProduct } from '@/features/admin/components/edit-product';

export const metadata: Metadata = {
  title: 'Edit product · Admin',
  robots: { index: false, follow: false },
};

export default async function EditProductPage(props: PageProps<'/admin/products/[slug]'>) {
  const { slug } = await props.params;
  return <EditProduct slug={slug} />;
}
