import type { ProductVariant } from '@/features/product/types';

export type CartVariant = ProductVariant & {
  product: { id: string; title: string; slug: string; images: string[] };
};

export type CartLine = {
  variantId: string;
  quantity: number;
  unitPrice: string;
  lineTotal: number;
  variant: CartVariant;
};

export type Cart = {
  cartId: string;
  items: CartLine[];
  subtotal: number;
};
