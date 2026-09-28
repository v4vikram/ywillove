export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type FulfillmentStatus =
  | 'unfulfilled'
  | 'sent_to_supplier'
  | 'in_production'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type OrderItem = {
  id: string;
  variantId: string;
  productName: string;
  variantLabel: string;
  supplierSku: string;
  unitPrice: string;
  quantity: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  email: string;
  totalAmount: string;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  shippingAddress: Record<string, string>;
  createdAt: string;
  items: OrderItem[];
};

export const PAYMENT_LABELS: Record<PaymentStatus, string> = {
  pending: 'Awaiting payment',
  paid: 'Paid',
  failed: 'Payment failed',
  refunded: 'Refunded',
};

export const FULFILLMENT_LABELS: Record<FulfillmentStatus, string> = {
  unfulfilled: 'Not started',
  sent_to_supplier: 'Sent to print',
  in_production: 'In production',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};
