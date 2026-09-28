export type ShippingAddress = {
  first_name: string;
  last_name?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
};

export type PlacedOrder = {
  orderId: string;
  orderNumber: string;
  amount: string;
  gatewayOrderId: string;
  gatewayKeyId: string;
};

export type RazorpaySuccess = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler: (response: RazorpaySuccess) => void;
  modal?: { ondismiss?: () => void };
};

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

export type { RazorpayOptions };
