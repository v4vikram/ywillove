const ITEMS = [
  'Made to order',
  'No overproduction',
  'Shipped from India',
  'Delivered in 5-7 days',
  'Cash on delivery',
];

export function Marquee() {
  return (
    <div className="overflow-hidden border-b bg-foreground py-3 text-background">
      {/* Duplicated once so translating -50% loops seamlessly. aria-hidden on the
          copy keeps a screen reader from reading the list twice. */}
      <div className="flex w-max animate-marquee">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1}
            className="flex shrink-0 items-center gap-10 pr-10 text-xs uppercase tracking-[0.2em]"
          >
            {ITEMS.map((item) => (
              <li key={item} className="flex items-center gap-10">
                {item}
                <span aria-hidden className="opacity-40">
                  /
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
