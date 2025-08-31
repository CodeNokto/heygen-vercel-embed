import { NextResponse } from "next/server";
import { fetchProducts } from "../../../lib/shopify";

export async function GET() {
  const products = await fetchProducts();
  return NextResponse.json(products);
}