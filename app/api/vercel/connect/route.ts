import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.KORAX_VERCEL_CLIENT_ID;
  const redirectUri = process.env.KORAX_VERCEL_OAUTH_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      {
        ok: false,
        error:
           "Missing KORAX env vars - build test 2",
        hasClientId: Boolean(clientId),
        hasRedirectUri: Boolean(redirectUri),
        availableKoraxKeys: Object.keys(process.env)
          .filter((key) => key.includes("KORAX"))
          .sort(),
      },
      { status: 500 }
    );
  }

  const authUrl = new URL("https://vercel.com/oauth/authorize");

  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");

  return NextResponse.redirect(authUrl.toString());
}