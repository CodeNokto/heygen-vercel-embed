import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.HEYGEN_API_KEY;
  const res = await fetch("https://api.heygen.com/v1/streaming.createToken", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({}),
  });

  const data = await res.json();
  return NextResponse.json({ token: data.data?.token });
}
