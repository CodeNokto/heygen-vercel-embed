import { NextResponse } from "next/server";
import { fetchProducts } from "@/lib/shopify";

export const runtime = "nodejs";

export async function GET() {
  try {
    const products = await fetchProducts();
    return NextResponse.json(products);
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Ukjent feil" }, { status: 500 });
  }
}
