import { api } from '@/lib/api/client';
import type { Category, Product, ProductListResponse } from '@/features/product/types';
import type { RecentReview } from '@/features/review/types';

export type VariantInput = {
  size: string;
  color: string;
  price: string;
  supplierSku: string;
};

export type ProductInput = {
  title: string;
  slug: string;
  description?: string;
  basePrice: string;
  categoryId: number;
  images: string[];
  variants?: VariantInput[];
};

export const listProducts = () => api.get<ProductListResponse>('/products');

export const getProduct = (slug: string) =>
  api.get<{ product: Product }>(`/products/${slug}`).then((r) => r.product);

export const listCategories = () =>
  api.get<{ categories: Category[] }>('/categories').then((r) => r.categories);

export const createProduct = (input: ProductInput) =>
  api.post<{ product: Product }>('/products', input).then((r) => r.product);

export const updateProduct = (id: string, input: Partial<ProductInput>) =>
  api.patch<{ product: Product }>(`/products/${id}`, input).then((r) => r.product);

export const deactivateProduct = (id: string) => api.delete<void>(`/products/${id}`);

export const listPendingReviews = () =>
  api.get<{ reviews: RecentReview[] }>('/reviews/pending').then((r) => r.reviews);

export const approveReview = (id: string) => api.patch<void>(`/reviews/${id}/approve`);

export const dispatchOrder = (orderId: string) =>
  api.post<void>(`/fulfillment/orders/${orderId}/dispatch`);

export const retryFulfillment = () => api.post<{ retried: number }>('/fulfillment/retry');
