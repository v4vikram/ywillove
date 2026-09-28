export function Stars({ rating, label }: { rating: number; label?: string }) {
  return (
    <span
      className="inline-flex gap-0.5 text-sm"
      role="img"
      aria-label={label ?? `${rating} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} aria-hidden className={star <= rating ? '' : 'opacity-25'}>
          ★
        </span>
      ))}
    </span>
  );
}
