const PROPS = [
  {
    title: 'Made to order',
    body: 'Nothing is printed until you buy it. No warehouse, no leftover stock, no end-of-season landfill.',
  },
  {
    title: 'Shipped from India',
    body: 'Printed and dispatched domestically, so delivery is 5-7 days — not four weeks and a customs bill.',
  },
  {
    title: 'Four pieces, done right',
    body: 'We would rather cut four things properly than list forty. Every fit is sampled before it goes up.',
  },
];

export function ValueProps() {
  return (
    <section className="border-t">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:grid-cols-3 sm:gap-8 sm:py-20">
        {PROPS.map((prop, index) => (
          <div key={prop.title}>
            <span className="eyebrow tabular-nums">0{index + 1}</span>
            <h3 className="mt-4 text-lg">{prop.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{prop.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
