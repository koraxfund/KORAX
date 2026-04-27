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
    "KORAX (KRX) is a BNB Chain ecosystem focused on presale, claim, staking, AI project creation, Launchpad access, and future website builder tools.",
  keywords: [
    "KORAX",
    "KRX",
    "KORAX token",
    "KORAX presale",
    "KORAX staking",
    "BNB Chain presale",
    "BNB Chain staking",
    "crypto presale",
    "KORAX AI",
    "Token Builder AI",
    "Launch Your Project",
    "Website Builder AI",
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
      "Explore KORAX (KRX), a BNB Chain ecosystem built around presale, claim, staking, AI project creation, Launchpad access, and future launch infrastructure.",
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
      "A growing BNB Chain ecosystem with presale, claim, staking, AI project tools, and launch infrastructure.",
    images: ["/raven-logo.png"],
    creator: "@koraxfund",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

function SocialIcons() {
  return (
    <div className="mx-auto flex w-full max-w-[1500px] justify-center px-6 pb-10 pt-2">
      <div className="flex items-center gap-4">
        <a
          href="https://x.com/koraxfund"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="KORAX on X"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/75 backdrop-blur-md transition hover:border-[#7CFF6A]/40 hover:bg-[#7CFF6A]/10 hover:text-[#c4ffbc]"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M18.244 2H21.5l-7.11 8.13L22.75 22h-6.55l-5.13-6.7L5.2 22H1.94l7.61-8.7L1.5 2h6.72l4.64 6.13L18.244 2Zm-1.14 17.9h1.8L7.24 4H5.31l11.79 15.9Z" />
          </svg>
        </a>

        <a
          href="https://www.facebook.com/share/186CHPa3cN/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="KORAX on Facebook"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/75 backdrop-blur-md transition hover:border-[#7CFF6A]/40 hover:bg-[#7CFF6A]/10 hover:text-[#c4ffbc]"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M14 8.5h2.2V5.2c-.38-.05-1.7-.16-3.22-.16-3.18 0-5.36 1.94-5.36 5.5v3.1H4v3.7h3.62V24h4.42v-6.66h3.46l.55-3.7h-4.01v-2.74c0-1.07.3-2.4 1.96-2.4Z" />
          </svg>
        </a>

        <a
          href="https://www.instagram.com/koraxfund?igsh=MWw2NnE4NTB1aW90cA=="
          target="_blank"
          rel="noopener noreferrer"
          aria-label="KORAX on Instagram"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/75 backdrop-blur-md transition hover:border-[#7CFF6A]/40 hover:bg-[#7CFF6A]/10 hover:text-[#c4ffbc]"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
          </svg>
        </a>

        <div className="group relative">
          <button
            type="button"
            aria-label="KORAX Telegram links"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/75 backdrop-blur-md transition hover:border-[#7CFF6A]/40 hover:bg-[#7CFF6A]/10 hover:text-[#c4ffbc]"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M21.94 4.16a1.4 1.4 0 0 0-1.44-.22L3.4 10.55c-.94.37-.92 1.7.04 2.03l4.28 1.45 1.65 5.14c.28.87 1.38 1.12 2 .45l2.4-2.37 4.2 3.08c.78.57 1.89.13 2.07-.81l2.87-13.92a1.4 1.4 0 0 0-.97-1.44ZM18.9 7.32l-8.67 7.72-.35 3.04-1.1-3.43 10.12-7.33Z" />
            </svg>
          </button>

          <div className="pointer-events-none absolute bottom-14 left-1/2 z-50 w-44 -translate-x-1/2 rounded-2xl border border-white/10 bg-black/90 p-2 opacity-0 shadow-2xl backdrop-blur-xl transition group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
            <a
              href="https://t.me/koraxgroub"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl px-3 py-2 text-sm text-white/70 transition hover:bg-[#7CFF6A]/10 hover:text-[#c4ffbc]"
            >
              KORAX Group
            </a>

            <a
              href="https://t.me/koraxfund"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl px-3 py-2 text-sm text-white/70 transition hover:bg-[#7CFF6A]/10 hover:text-[#c4ffbc]"
            >
              KORAX Channel
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      "https://t.me/koraxgroub",
      "https://www.facebook.com/share/186CHPa3cN/",
      "https://www.instagram.com/koraxfund/",
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

          <SocialIcons />

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