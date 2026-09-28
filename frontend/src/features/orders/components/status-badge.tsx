import {
  FULFILLMENT_LABELS,
  PAYMENT_LABELS,
  type FulfillmentStatus,
  type PaymentStatus,
} from '../types';

const TONE = {
  neutral: 'border-border text-muted-foreground',
  active: 'border-foreground text-foreground',
  bad: 'border-destructive text-destructive',
} as const;

const PAYMENT_TONE: Record<PaymentStatus, keyof typeof TONE> = {
  pending: 'neutral',
  paid: 'active',
  failed: 'bad',
  refunded: 'neutral',
};

const FULFILLMENT_TONE: Record<FulfillmentStatus, keyof typeof TONE> = {
  unfulfilled: 'neutral',
  sent_to_supplier: 'active',
  in_production: 'active',
  shipped: 'active',
  delivered: 'active',
  cancelled: 'bad',
};

export function StatusBadge({
  kind,
  status,
}:
  | { kind: 'payment'; status: PaymentStatus }
  | { kind: 'fulfillment'; status: FulfillmentStatus }) {
  const isPayment = kind === 'payment';
  const label = isPayment
    ? PAYMENT_LABELS[status as PaymentStatus]
    : FULFILLMENT_LABELS[status as FulfillmentStatus];
  const tone = isPayment
    ? PAYMENT_TONE[status as PaymentStatus]
    : FULFILLMENT_TONE[status as FulfillmentStatus];

  return (
    <span
      className={`inline-block border px-2.5 py-1 text-xs uppercase tracking-[0.12em] ${TONE[tone]}`}
    >
      {label}
    </span>
  );
}
