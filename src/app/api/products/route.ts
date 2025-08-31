import { NextResponse } from "next/server";

export async function GET() {
  const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const shopifyToken = process.env.SHOPIFY_API_TOKEN;

  if (!shopifyDomain || !shopifyToken) {
    return NextResponse.json(
      { error: "Mangler SHOPIFY_STORE_DOMAIN eller SHOPIFY_API_TOKEN" },
      { status: 500 }
    );
  }

  const query = `
    {
      products(first: 10) {
        edges {
          node {
            id
            title
            descriptionHtml
            handle
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(
      `https://${shopifyDomain}/api/2023-07/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": shopifyToken,
        },
        body: JSON.stringify({ query }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: err }, { status: response.status });
    }

    const result = await response.json();
    // return kun produktlisten
    return NextResponse.json(result.data.products.edges.map((e: any) => e.node));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
