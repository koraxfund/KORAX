import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("github_access_token")?.value;

  if (!token) {
    return NextResponse.json(
      {
        ok: true,
        connected: false,
        login: null,
        profileUrl: null,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "KORAX-Website-Builder",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: true,
          connected: false,
          login: null,
          profileUrl: null,
          error: "GitHub token invalid or expired.",
        },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    const user = await response.json();

    return NextResponse.json(
      {
        ok: true,
        connected: true,
        login: user?.login || null,
        profileUrl: user?.html_url || null,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      {
        ok: true,
        connected: false,
        login: null,
        profileUrl: null,
        error: "Could not check GitHub connection.",
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}