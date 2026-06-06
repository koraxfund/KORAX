import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("github_access_token")?.value;

  return NextResponse.json(
    {
      ok: true,
      connected: Boolean(token),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}