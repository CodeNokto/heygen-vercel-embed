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

  let products: ShopifyProduct[] = [];
  let cursor: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const query: string = `
      {
        products(first: 50, after: ${cursor ? `"${cursor}"` : null}) {
          edges {
            node {
              id
              title
              descriptionHtml
              handle
              images(first: 1) {
                edges { node { url altText } }
              }
              variants(first: 1) {
                edges { node { price { amount currencyCode } } }
              }
            }
            cursor
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    `;

    const res = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query }),
      cache: "no-store",
    });

    if (!res.ok) throw new Error((await res.text()) || `Shopify-respons: ${res.status}`);
    const data = await res.json();

    const edges = data?.data?.products?.edges ?? [];
    products.push(...edges.map((e: any) => e.node as ShopifyProduct));

    hasNextPage = data?.data?.products?.pageInfo?.hasNextPage ?? false;
    cursor = edges.length > 0 ? edges[edges.length - 1].cursor : null;
  }

  return products;
}
