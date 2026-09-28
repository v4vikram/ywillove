type JsonLdProps = { data: Record<string, unknown> };

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // Escaping `<` prevents a value like "</script>" from closing the tag early.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
