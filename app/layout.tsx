import "./globals.css";
import Topbar from "./ui/Topbar";
import Providers from "./providers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://korax.fund"),
  title: {
    default: "KORAX (KRX) | Presale, Claim, Staking & Future Launch Tools",
    template: "%s | KORAX",
  },
  description:
    "KORAX (KRX) is a BNB Chain ecosystem focused on presale, claim, staking, and future launch tools including Launch Your Project and Token Builder AI.",
  keywords: [
    "KORAX",
    "KRX",
    "KORAX token",
    "KORAX presale",
    "KORAX staking",
    "BNB Chain presale",
    "BNB Chain staking",
    "crypto presale",
    "Token Builder AI",
    "Launch Your Project",
  ],
  applicationName: "KORAX",
  authors: [{ name: "KORAX" }],
  creator: "KORAX",
  publisher: "KORAX",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://korax.fund",
    siteName: "KORAX",
    title: "KORAX (KRX) | Presale, Claim, Staking & Future Launch Tools",
    description:
      "Explore KORAX (KRX), a BNB Chain ecosystem built around presale, claim, staking, and future launch infrastructure.",
    images: [
      {
        url: "/raven-logo.png",
        width: 1200,
        height: 630,
        alt: "KORAX",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KORAX (KRX) | Presale, Claim, Staking & Future Launch Tools",
    description:
      "A growing BNB Chain ecosystem with presale, claim, staking, and future launch tools.",
    images: ["/raven-logo.png"],
    creator: "@koraxfund",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "KORAX",
    alternateName: "KRX",
    url: "https://korax.fund",
    logo: "https://korax.fund/raven-logo.png",
    sameAs: [
      "https://x.com/koraxfund",
      "https://t.me/koraxfund",
    ],
  };

  return (
    <html lang="en">
      <body className="min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />

        <Providers>
          <Topbar />

          <main className="mx-auto w-full max-w-[1500px] px-6 pt-24 pb-10">
            {children}
          </main>

          <footer className="mx-auto w-full max-w-6xl px-6 pb-10 pt-6 text-xs text-white/45">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>© {new Date().getFullYear()} KORAX • All rights reserved</div>

              <div className="flex flex-wrap gap-4">
                <a className="hover:text-white" href="/about">
                  About
                </a>
                <a className="hover:text-white" href="/terms">
                  Terms of service
                </a>
                <a className="hover:text-white" href="/privacy">
                  Privacy Policy
                </a>
                <a className="hover:text-white" href="/docs">
                  Docs
                </a>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}