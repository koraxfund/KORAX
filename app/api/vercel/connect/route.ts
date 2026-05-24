import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.OAUTH_CLIENT_ID;
  const redirectUri = process.env.OAUTH_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing simple OAuth env vars",
        hasClientId: Boolean(clientId),
        hasRedirectUri: Boolean(redirectUri),
        hasTestEnv: Boolean(process.env.TEST_ENV),
        testEnvValue: process.env.TEST_ENV || null,
        availableOAuthKeys: Object.keys(process.env)
          .filter((key) => key.includes("OAUTH") || key.includes("TEST"))
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