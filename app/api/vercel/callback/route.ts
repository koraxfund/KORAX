import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

type VercelTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  id_token?: string;
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
  const state = url.searchParams.get("state");

  if (error) {
    return NextResponse.json({ ok: false, error }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json(
      { ok: false, error: "Missing authorization code" },
      { status: 400 }
    );
  }

  const savedState = req.cookies.get("vercel_oauth_state")?.value;
  const codeVerifier = req.cookies.get("vercel_oauth_code_verifier")?.value;

  if (!savedState || !state || savedState !== state) {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid or missing OAuth state",
        hasSavedState: Boolean(savedState),
        hasReturnedState: Boolean(state),
      },
      { status: 400 }
    );
  }

  if (!codeVerifier) {
    return NextResponse.json(
      { ok: false, error: "Missing OAuth code verifier cookie" },
      { status: 400 }
    );
  }

  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;
  const redirectUri = process.env.OAUTH_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing OAuth callback env vars",
        hasClientId: Boolean(clientId),
        hasClientSecret: Boolean(clientSecret),
        hasRedirectUri: Boolean(redirectUri),
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
    code_verifier: codeVerifier,
  });

  const tokenResponse = await fetch("https://api.vercel.com/login/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  const tokenData = (await tokenResponse.json()) as VercelTokenResponse;

  const response = NextResponse.json(
    tokenResponse.ok
      ? {
          ok: true,
          message: "Vercel OAuth connected successfully.",
          token_type: tokenData.token_type,
          expires_in: tokenData.expires_in,
          scope: tokenData.scope,
          has_access_token: Boolean(tokenData.access_token),
          has_refresh_token: Boolean(tokenData.refresh_token),
          has_id_token: Boolean(tokenData.id_token),
          saved_cookie: Boolean(tokenData.access_token),
        }
      : {
          ok: false,
          error: "Failed to exchange authorization code for token",
          details: tokenData,
        },
    { status: tokenResponse.ok ? 200 : tokenResponse.status }
  );

  response.cookies.delete("vercel_oauth_code_verifier");
  response.cookies.delete("vercel_oauth_state");
  response.cookies.delete("vercel_oauth_nonce");

  if (tokenResponse.ok && tokenData.access_token) {
    response.cookies.set("vercel_access_token", tokenData.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: tokenData.expires_in || 3600,
    });
  }

  return response;
}