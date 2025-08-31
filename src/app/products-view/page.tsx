export default async function ProductsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, {
    cache: "no-store",
  });
  const data = await res.json();

  if (!data.products) {
    return <main><p>Ingen produkter funnet.</p></main>;
  }

  return (
    <main style={{ padding: "2rem", fontSize: "1.2rem", lineHeight: "1.6" }}>
      <h1>Produktoversikt</h1>
      <ul>
        {data.products.map((p: any) => (
          <li key={p.id}>
            <strong>{p.title}</strong>
            <div dangerouslySetInnerHTML={{ __html: p.body_html }} />
          </li>
        ))}
      </ul>
    </main>
  );
}
