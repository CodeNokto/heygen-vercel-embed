const API_VERSION = "2023-07";

type ShopifyPrice = { amount: string; currencyCode: string };
type ShopifyImage = { url: string; altText: string | null };
type ShopifyVariant = { price: ShopifyPrice };
export type ShopifyProduct = {
  id: string;
  title: string;
  descriptionHtml: string;
  handle: string;
  images: { edges: { node: ShopifyImage }[] };
  variants: { edges: { node: ShopifyVariant }[] };
};

export async function fetchProducts(): Promise<ShopifyProduct[]> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_API_TOKEN;
  if (!domain || !token) throw new Error("Mangler SHOPIFY_STORE_DOMAIN eller SHOPIFY_API_TOKEN");

  const query = `
    {
      products(first: 10) {
        edges {
          node {
            id
            title
            descriptionHtml
            handle
            images(first: 1) { edges { node { url altText } } }
            variants(first: 1) { edges { node { price { amount currencyCode } } } }
          }
        }
      }
    }
  `;

  const res = await fetch(\`https://${domain}/api/${API_VERSION}/graphql.json\`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query }),
    cache: "no-store",
  });

  if (!res.ok) throw new Error((await res.text()) || \`Shopify-respons: \${res.status}\`);
  const data = await res.json();
  const edges = data?.data?.products?.edges ?? [];
  return edges.map((e: any) => e.node as ShopifyProduct);
}
'@ | Out-File -Encoding utf8 -Force src\lib\shopify.ts
