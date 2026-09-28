export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto max-w-2xl px-4 py-16 sm:py-20">
      <h1 className="text-3xl">{title}</h1>
      <p className="mt-2 eyebrow">Last updated {updated}</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed [&_h2]:text-base [&_h2]:font-medium [&_li]:mt-1.5 [&_p]:text-muted-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-muted-foreground">
        {children}
      </div>
    </article>
  );
}
