import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const redirectUri = process.env.GITHUB_OAUTH_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json(
      {
        error: "GitHub OAuth env variables are missing.",
        hasClientId: Boolean(clientId),
        hasClientSecret: Boolean(clientSecret),
        hasRedirectUri: Boolean(redirectUri),
      },
      { status: 500 }
    );
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const savedState = req.cookies.get("github_oauth_state")?.value;

  if (!code || !state || !savedState || state !== savedState) {
    const failedUrl = new URL(
      "/website-builder-ai?github=failed_state#github-publish",
      req.url
    );
    return NextResponse.redirect(failedUrl);
  }

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
    cache: "no-store",
  });

  const data = await tokenResponse.json();

  if (!tokenResponse.ok || !data?.access_token) {
    const failedUrl = new URL(
      "/website-builder-ai?github=failed_token#github-publish",
      req.url
    );
    return NextResponse.redirect(failedUrl);
  }

  const successUrl = new URL(
    "/website-builder-ai?github=connected#github-publish",
    req.url
  );

  const res = NextResponse.redirect(successUrl);

  res.cookies.set("github_access_token", data.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  res.cookies.set("github_oauth_state", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 0,
  });

  return res;
}