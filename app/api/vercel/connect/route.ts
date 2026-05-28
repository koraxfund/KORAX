import { NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

function base64Url(input: Buffer) {
  return input
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function randomString(bytes = 32) {
  return base64Url(crypto.randomBytes(bytes));
}

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest();
}

export async function GET() {
  const clientId = process.env.OAUTH_CLIENT_ID;
  const redirectUri = process.env.OAUTH_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing OAUTH_CLIENT_ID or OAUTH_REDIRECT_URI",
        hasClientId: Boolean(clientId),
        hasRedirectUri: Boolean(redirectUri),
      },
      { status: 500 }
    );
  }

  const codeVerifier = randomString(64);
  const codeChallenge = base64Url(sha256(codeVerifier));
  const state = randomString(32);
  const nonce = randomString(32);

  const authUrl = new URL("https://vercel.com/oauth/authorize");

  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("nonce", nonce);
  authUrl.searchParams.set("code_challenge", codeChallenge);
  authUrl.searchParams.set("code_challenge_method", "S256");

  const response = NextResponse.redirect(authUrl.toString());

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 10 * 60,
  };

  response.cookies.set("vercel_oauth_code_verifier", codeVerifier, cookieOptions);
  response.cookies.set("vercel_oauth_state", state, cookieOptions);
  response.cookies.set("vercel_oauth_nonce", nonce, cookieOptions);

  return response;
}