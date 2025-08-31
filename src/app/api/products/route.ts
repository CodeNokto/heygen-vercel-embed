// src/app/api/products/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const shop = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_API_TOKEN;

  const url = `https://${shop}/admin/api/2024-01/products.json`;

  const res = await fetch(url, {
    headers: {
      "X-Shopify-Access-Token": token!,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Shopify API request failed" }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
