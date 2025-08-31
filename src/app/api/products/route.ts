// src/app/products-view/page.tsx
import React from "react";

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
      <pre style={{ whiteSpace: "pre-wrap" }}>
        {data.products.map((p: any, idx: number) => (
          `${idx + 1}. ${p.title}\n${p.body_html?.replace(/<[^>]*>?/gm, "")}\n\n`
        )).join("")}
      </pre>
    </main>
  );
}
