import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const tokenRes = await fetch("https://api.heygen.com/v1/streaming.create_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.HEYGEN_API_KEY || "",
    },
    body: JSON.stringify({}),
  });

  if (!tokenRes.ok) {
    return NextResponse.json(
      { error: "Kunne ikke hente HeyGen-token" },
      { status: 500 }
    );
  }

  const data = await tokenRes.json();
  return NextResponse.json(data);
}
