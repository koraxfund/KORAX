import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.VERCEL_CLIENT_ID;
  const redirectUri = process.env.VERCEL_OAUTH_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing VERCEL_CLIENT_ID or VERCEL_OAUTH_REDIRECT_URI",
        hasClientId: Boolean(clientId),
        hasRedirectUri: Boolean(redirectUri),
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