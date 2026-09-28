export function InstagramCta() {
  return (
    <section className="border-t bg-muted/40">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-16 sm:flex-row sm:items-center sm:justify-between sm:py-20">
        <div>
          <p className="eyebrow">Drops go live on Instagram first</p>
          <h2 className="mt-3 text-2xl sm:text-3xl">@uwillove</h2>
        </div>

        <a
          href="https://instagram.com/uwillove"
          target="_blank"
          rel="noreferrer noopener"
          className="border border-foreground px-8 py-3.5 text-sm transition-colors hover:bg-foreground hover:text-background"
        >
          Follow for drop 02
        </a>
      </div>
    </section>
  );
}
