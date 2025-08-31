import { fetchProducts } from "@/lib/shopify";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function ProductsPage() {
  const products = await fetchProducts();
  if (!products?.length) return <div>Ingen produkter funnet.</div>;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>Produkter</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {products.map((p) => {
          const img = p.images?.edges?.[0]?.node;
          const price = p.variants?.edges?.[0]?.node?.price;
          return (
            <li key={p.id} style={{ borderBottom: "1px solid #ddd", padding: "16px 0" }}>
              <h2 style={{ margin: "0 0 8px" }}>{p.title}</h2>
              {img?.url && <img src={img.url} alt={img.altText || p.title} width={240} height={240} style={{ objectFit: "cover", borderRadius: 8 }} />}
              <div style={{ marginTop: 12 }} dangerouslySetInnerHTML={{ __html: p.descriptionHtml }} />
              {price && <p style={{ marginTop: 8 }}>Pris: {price.amount} {price.currencyCode}</p>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
