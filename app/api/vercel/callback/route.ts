import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

type VercelTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  scope?: string;
  error?: string;
  error_description?: string;
};

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.json({ ok: false, error }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json(
      { ok: false, error: "Missing authorization code" },
      { status: 400 }
    );
  }

  const clientId = process.env.KORAX_VERCEL_CLIENT_ID;
  const clientSecret = process.env.KORAX_VERCEL_CLIENT_SECRET;
  const redirectUri = process.env.KORAX_VERCEL_OAUTH_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Missing KORAX_VERCEL_CLIENT_ID, KORAX_VERCEL_CLIENT_SECRET, or KORAX_VERCEL_OAUTH_REDIRECT_URI",
        hasClientId: Boolean(clientId),
        hasClientSecret: Boolean(clientSecret),
        hasRedirectUri: Boolean(redirectUri),
        availableKoraxKeys: Object.keys(process.env)
          .filter((key) => key.includes("KORAX"))
          .sort(),
      },
      { status: 500 }
    );
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    client_secret: clientSecret,
    code,
    redirect_uri: redirectUri,
  });

  const tokenResponse = await fetch("https://api.vercel.com/login/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  const tokenData = (await tokenResponse.json()) as VercelTokenResponse;

  if (!tokenResponse.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to exchange authorization code for token",
        details: tokenData,
      },
      { status: tokenResponse.status }
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Vercel OAuth connected successfully.",
    token_type: tokenData.token_type,
    expires_in: tokenData.expires_in,
    scope: tokenData.scope,
    has_access_token: Boolean(tokenData.access_token),
    has_refresh_token: Boolean(tokenData.refresh_token),
  });
}