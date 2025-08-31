import React from "react";

export default async function ProductsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, {
    cache: "no-store",
  });
  const products = await res.json();

  if (!products || products.length === 0) {
    return <div>Ingen produkter funnet.</div>;
  }

  return (
    <div>
      <h1>Produkter</h1>
      <ul>
        {products.map((p: any) => (
          <li key={p.id}>
            <h2>{p.title}</h2>
            {p.images?.edges?.[0]?.node?.url && (
              <img
                src={p.images.edges[0].node.url}
                alt={p.images.edges[0].node.altText || p.title}
                width={200}
              />
            )}
            <div
              dangerouslySetInnerHTML={{ __html: p.descriptionHtml }}
            />
            {p.variants?.edges?.[0]?.node?.price && (
              <p>
                Pris: {p.variants.edges[0].node.price.amount}{" "}
                {p.variants.edges[0].node.price.currencyCode}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
