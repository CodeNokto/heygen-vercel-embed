// app/api/products/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_API_TOKEN = process.env.SHOPIFY_API_TOKEN;

const query = `
  {
    products(first: 10) {
      edges {
        node {
          id
          title
          description
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

export async function GET() {
  if (!SHOPIFY_DOMAIN || !SHOPIFY_API_TOKEN) {
    return NextResponse.json(
      { error: "Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_API_TOKEN" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/2023-07/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_API_TOKEN,
      },
      body: JSON.stringify({ query }),
      cache: "no-store",
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ error: text }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
