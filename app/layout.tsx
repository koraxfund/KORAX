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

function EmailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-[#7CFF6A]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-white"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2H21.5l-7.11 8.13L22.75 22h-6.55l-5.13-6.7L5.2 22H1.94l7.61-8.7L1.5 2h6.72l4.64 6.13L18.244 2Zm-1.14 17.9h1.8L7.24 4H5.31l11.79 15.9Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-[#1877F2]"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M14 8.5h2.2V5.2c-.38-.05-1.7-.16-3.22-.16-3.18 0-5.36 1.94-5.36 5.5v3.1H4v3.7h3.62V24h4.42v-6.66h3.46l.55-3.7h-4.01v-2.74c0-1.07.3-2.4 1.96-2.4Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-[#E4405F]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-[#FF0000]"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12l-6.2 3.6Z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-white"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.7 2c.3 2.3 1.6 3.8 4 4v4.1a8.5 8.5 0 0 1-4-1.1v6.5c0 4.2-2.8 6.5-6.4 6.5-3.2 0-6-2.2-6-5.6 0-3.8 3-5.9 6.7-5.6v4.2c-1.6-.4-2.8.3-2.8 1.5 0 1.1.9 1.8 2 1.8 1.3 0 2.1-.7 2.1-2.5V2h4.4Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-[#0A66C2]"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.3 8h4.4v14H.3V8Zm7.2 0h4.2v1.9h.1c.6-1.1 2-2.3 4.1-2.3 4.4 0 5.2 2.9 5.2 6.6V22h-4.4v-6.9c0-1.6 0-3.8-2.3-3.8s-2.7 1.8-2.7 3.7v7H7.5V8Z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-[#26A5E4]"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M21.94 4.16a1.4 1.4 0 0 0-1.44-.22L3.4 10.55c-.94.37-.92 1.7.04 2.03l4.28 1.45 1.65 5.14c.28.87 1.38 1.12 2 .45l2.4-2.37 4.2 3.08c.78.57 1.89.13 2.07-.81l2.87-13.92a1.4 1.4 0 0 0-.97-1.44ZM18.9 7.32l-8.67 7.72-.35 3.04-1.1-3.43 10.12-7.33Z" />
    </svg>
  );
}

const socialButtonClass =
  "flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/75 backdrop-blur-md transition hover:bg-white/15";

function SocialIcons() {
  return (
    <div className="mx-auto flex w-full max-w-[1500px] justify-center px-6 pb-10 pt-2">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <a
          href="mailto:contact@korax.fund"
          aria-label="Email KORAX"
          title="contact@korax.fund"
          className={`${socialButtonClass} hover:border-[#7CFF6A]/50`}
        >
          <EmailIcon />
        </a>

        <a
          href="https://x.com/koraxfund"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="KORAX on X"
          className={`${socialButtonClass} hover:border-white/50`}
        >
          <XIcon />
        </a>

        <a
          href="https://www.facebook.com/share/186CHPa3cN/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="KORAX on Facebook"
          className={`${socialButtonClass} hover:border-[#1877F2]/60 hover:bg-[#1877F2]/10`}
        >
          <FacebookIcon />
        </a>

        <a
          href="https://www.instagram.com/koraxfund?igsh=MWw2NnE4NTB1aW90cA=="
          target="_blank"
          rel="noopener noreferrer"
          aria-label="KORAX on Instagram"
          className={`${socialButtonClass} hover:border-[#E4405F]/60 hover:bg-[#E4405F]/10`}
        >
          <InstagramIcon />
        </a>

        <a
          href="https://youtube.com/@koraxfund?si=L6HOiSGjPoYP--MT"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="KORAX on YouTube"
          className={`${socialButtonClass} hover:border-[#FF0000]/60 hover:bg-[#FF0000]/10`}
        >
          <YouTubeIcon />
        </a>

        <a
          href="https://www.tiktok.com/@koraxfund?_r=1&_t=ZG-96ZaUHbiLMf"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="KORAX on TikTok"
          className={`${socialButtonClass} hover:border-white/50 hover:bg-white/10`}
        >
          <TikTokIcon />
        </a>

        <a
          href="https://www.linkedin.com/in/korax-fund-8a3b8b402?utm_source=share_via&utm_content=profile&utm_medium=member_android"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="KORAX on LinkedIn"
          className={`${socialButtonClass} hover:border-[#0A66C2]/60 hover:bg-[#0A66C2]/10`}
        >
          <LinkedInIcon />
        </a>

        <div className="group relative">
          <button
            type="button"
            aria-label="KORAX Telegram links"
            className={`${socialButtonClass} hover:border-[#26A5E4]/60 hover:bg-[#26A5E4]/10`}
          >
            <TelegramIcon />
          </button>

          <div className="pointer-events-none absolute bottom-14 left-1/2 z-50 w-44 -translate-x-1/2 rounded-2xl border border-white/10 bg-black/90 p-2 opacity-0 shadow-2xl backdrop-blur-xl transition group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
            <a
              href="https://t.me/koraxgroub"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl px-3 py-2 text-sm text-white/70 transition hover:bg-[#26A5E4]/10 hover:text-[#9be1ff]"
            >
              KORAX Group
            </a>

            <a
              href="https://t.me/koraxfund"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl px-3 py-2 text-sm text-white/70 transition hover:bg-[#26A5E4]/10 hover:text-[#9be1ff]"
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
      "https://youtube.com/@koraxfund",
      "https://www.tiktok.com/@koraxfund",
      "https://www.linkedin.com/in/korax-fund-8a3b8b402",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: "contact@korax.fund",
        contactType: "customer support",
      },
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