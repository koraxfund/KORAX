import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

type WebsiteFile = {
  path: string;
  content: string;
};

type WebsiteBuilderInput = {
  projectName: string;
  symbol: string;
  category: string;
  shortDescription: string;
  targetAudience: string;
  websiteStyle: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundStyle: string;
  network: string;
  tokenAddress: string;
  stakingAddress: string;
  vaultAddress: string;
  launchpadAddress: string;
  xLink: string;
  telegramLink: string;
  youtubeLink: string;
  tiktokLink: string;
  instagramLink: string;
  facebookLink: string;
  discordLink: string;
  websiteSections: string;
  specialInstructions: string;
};

const REQUIRED_WEBSITE_FILES = [
  "package.json",
  "app/layout.tsx",
  "app/providers.tsx",
  "app/page.tsx",
  "app/globals.css",

  "app/docs/page.tsx",
  "app/terms/page.tsx",
  "app/privacy/page.tsx",

  "components/Navbar.tsx",
  "components/Hero.tsx",
  "components/Stats.tsx",
  "components/About.tsx",
  "components/Tokenomics.tsx",
  "components/Staking.tsx",
  "components/LaunchSection.tsx",
  "components/Roadmap.tsx",
  "components/Contracts.tsx",
  "components/Security.tsx",
  "components/HowToBuy.tsx",
  "components/Community.tsx",
  "components/Partners.tsx",
  "components/FAQ.tsx",
  "components/Disclaimer.tsx",
  "components/Footer.tsx",

  "lib/site-data.ts",
  "lib/format.ts",

  "public/logo.svg",
  "public/hero-bg.svg",

  "README.md",
  ".env.example",
  "vercel.json",
];

const EXTRA_PROJECT_FILES = [
  "tailwind.config.ts",
  "postcss.config.mjs",
  "tsconfig.json",
  "next.config.mjs",
  ".gitignore",
];

function cleanText(value: unknown, fallback = "") {
  if (typeof value !== "string") return fallback;
  return value.trim();
}

function getKoraxWalletConnectProjectId() {
  return cleanText(
    process.env.NEXT_PUBLIC_KORAX_WALLETCONNECT_PROJECT_ID ||
      process.env.KORAX_WALLETCONNECT_PROJECT_ID ||
      ""
  );
}

function cleanPackageName(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "korax-generated-website"
  );
}

function json(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function provided(value: string) {
  return value.trim().length > 0;
}

function safeSymbol(value: string) {
  return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase() || "TOKEN";
}

function file(path: string, content: string): WebsiteFile {
  return { path, content: content.trim() + "\n" };
}

function buildInput(body: any): WebsiteBuilderInput {
  return {
    projectName: cleanText(body?.projectName),
    symbol: cleanText(body?.symbol),
    category: cleanText(body?.category, "Web3"),
    shortDescription: cleanText(body?.shortDescription),
    targetAudience: cleanText(body?.targetAudience, "Web3 users"),
    websiteStyle: cleanText(body?.websiteStyle, "Premium Dark Web3"),
    primaryColor: cleanText(body?.primaryColor, "#0B5FFF"),
    secondaryColor: cleanText(body?.secondaryColor, "#7CFF6A"),
    backgroundStyle: cleanText(
      body?.backgroundStyle,
      "Dark blue-black futuristic gradient"
    ),
    network: cleanText(body?.network, "BNB Chain"),
    tokenAddress: cleanText(body?.tokenAddress),
    stakingAddress: cleanText(body?.stakingAddress),
    vaultAddress: cleanText(body?.vaultAddress),
    launchpadAddress: cleanText(body?.launchpadAddress),
    xLink: cleanText(body?.xLink),
    telegramLink: cleanText(body?.telegramLink),
    youtubeLink: cleanText(body?.youtubeLink),
    tiktokLink: cleanText(body?.tiktokLink),
    instagramLink: cleanText(body?.instagramLink),
    facebookLink: cleanText(body?.facebookLink),
    discordLink: cleanText(body?.discordLink),
    websiteSections: cleanText(
      body?.websiteSections,
      "Hero, About, Tokenomics, Roadmap, Staking, Launch on KORAX, Contracts, FAQ, Footer"
    ),
    specialInstructions: cleanText(
      body?.specialInstructions,
      "Create a premium dark Web3 website suitable for a serious crypto project."
    ),
  };
}

function buildSiteData(input: WebsiteBuilderInput) {
  const name = input.projectName;
  const symbol = safeSymbol(input.symbol);

  const socials = [
    { label: "X / Twitter", href: input.xLink || null },
    { label: "Telegram", href: input.telegramLink || null },
    { label: "YouTube", href: input.youtubeLink || null },
    { label: "TikTok", href: input.tiktokLink || null },
    { label: "Instagram", href: input.instagramLink || null },
    { label: "Facebook", href: input.facebookLink || null },
    { label: "Discord", href: input.discordLink || null },
  ];

  const contracts = [
    {
      label: "Token Contract",
      value: input.tokenAddress || "",
      description:
        "Main token contract address. Add the verified address after deployment.",
    },
    {
      label: "Staking Contract",
      value: input.stakingAddress || "",
      description:
        "Staking contract reference for long-term holder utilities and access flows.",
    },
    {
      label: "Vault Contract",
      value: input.vaultAddress || "",
      description:
        "Vault address for project reserves, claim logic, or controlled distribution flows.",
    },
    {
      label: "Launchpad Reference",
      value: input.launchpadAddress || "",
      description:
        "KORAX Launchpad readiness reference. Add live sale details only when confirmed.",
    },
  ];

  return `
export const siteConfig = ${json({
    name,
    symbol,
    category: input.category,
    description: input.shortDescription,
    targetAudience: input.targetAudience,
    network: input.network,
    primaryColor: input.primaryColor,
    secondaryColor: input.secondaryColor,
    backgroundStyle: input.backgroundStyle,
    websiteStyle: input.websiteStyle,
    tagline: `${name} is a ${input.category} project built for transparent Web3 growth, community trust, and launch readiness.`,
    longDescription: `${input.shortDescription} The website presents the project with a professional structure, clear contract areas, community links, roadmap, launch readiness, and transparent disclaimers.`,
    ctaPrimary: "Explore Project",
    ctaSecondary: "Review Contracts",
    docsPath: "/docs",
  })} as const;

export const navigationLinks = ${json([
    { label: "About", href: "#about" },
    { label: "Tokenomics", href: "#tokenomics" },
    { label: "Staking", href: "#staking" },
    { label: "Roadmap", href: "#roadmap" },
    { label: "Contracts", href: "#contracts" },
    { label: "FAQ", href: "#faq" },
  ])} as const;

export const socialLinks = ${json(socials)} as const;

export const heroHighlights = ${json([
    "Premium Web3 launch-ready presentation",
    "Wallet connection powered by RainbowKit",
    "Transparent contract and ecosystem sections",
    "Built for GitHub and Vercel deployment",
  ])} as const;

export const stats = ${json([
    {
      value: symbol,
      label: "Token Symbol",
      description:
        "The public ticker used across the website and project materials.",
    },
    {
      value: input.network,
      label: "Network",
      description:
        "Primary network configured for the project website and wallet flow.",
    },
    {
      value: provided(input.tokenAddress) ? "Address Added" : "After Deployment",
      label: "Token Contract",
      description: provided(input.tokenAddress)
        ? "Token contract is displayed in the transparency section."
        : "Contract address can be added when deployment is complete.",
    },
    {
      value: "Launch Ready",
      label: "Website Package",
      description:
        "Generated as a complete Next.js project ready for GitHub and Vercel.",
    },
  ])} as const;

export const tokenomics = ${json([
    {
      title: "Utility Layer",
      value: "Core",
      description:
        "The token can be positioned around access, ecosystem utilities, launch participation, and future platform functions.",
    },
    {
      title: "Community Growth",
      value: "Strategic",
      description:
        "Community growth should focus on transparent updates, useful product progress, and clear communication.",
    },
    {
      title: "Liquidity Readiness",
      value: "Planned",
      description:
        "Liquidity and launch preparation should be documented carefully before any public launch action.",
    },
    {
      title: "Staking Readiness",
      value: provided(input.stakingAddress) ? "Configured" : "Pending",
      description: provided(input.stakingAddress)
        ? "A staking contract reference is available and can be explained in the staking section."
        : "Staking can be added after contract deployment or after the rules are finalized.",
    },
    {
      title: "Treasury & Development",
      value: "Managed",
      description:
        "Development, treasury, and operational planning should remain transparent and regularly updated.",
    },
  ])} as const;

export const roadmap = ${json([
    {
      phase: "Phase 01",
      title: "Foundation",
      status: "Current",
      items: [
        "Define project identity and website structure",
        "Prepare wallet-ready frontend architecture",
        "Publish official project information and social links",
      ],
    },
    {
      phase: "Phase 02",
      title: "Contracts & Verification",
      status: "Next",
      items: [
        "Deploy and verify token-related contracts",
        "Add official contract addresses to the website",
        "Prepare transparent documentation for users",
      ],
    },
    {
      phase: "Phase 03",
      title: "Community & Launch Readiness",
      status: "Planned",
      items: [
        "Activate official community channels",
        "Prepare launch communication and safety notes",
        "Connect the project with the KORAX launch workflow when ready",
      ],
    },
    {
      phase: "Phase 04",
      title: "Expansion",
      status: "Future",
      items: [
        "Improve ecosystem utilities",
        "Add more documentation and partner updates",
        "Expand product integrations based on user demand",
      ],
    },
  ])} as const;

export const stakingInfo = ${json({
    enabled: provided(input.stakingAddress),
    address: input.stakingAddress || "",
    title: provided(input.stakingAddress)
      ? "Staking contract reference is available"
      : "Staking readiness area",
    description: provided(input.stakingAddress)
      ? "The website can present staking information while avoiding unsupported yield promises."
      : "Staking rules and contracts can be added when they are finalized.",
    bullets: [
      "Avoid unsupported yield promises",
      "Show contract references only when official",
      "Explain lock rules and reward logic clearly",
      "Keep risk and eligibility information visible",
    ],
  })} as const;

export const contractItems = ${json(contracts)} as const;

export const securityItems = ${json([
    {
      title: "Transparent Contracts",
      description:
        "Official contract references should be displayed clearly and updated only from verified project sources.",
    },
    {
      title: "Wallet Safety",
      description:
        "Users should verify the website URL, wallet prompts, and contract addresses before interacting.",
    },
    {
      title: "No Unrealistic Claims",
      description:
        "The website avoids guaranteed profit language and presents the project as a technology and community effort.",
    },
    {
      title: "Launch Readiness",
      description:
        "Launch information should be separated from active sale claims unless a sale is officially live.",
    },
  ])} as const;

export const howToBuySteps = ${json([
    {
      step: "01",
      title: "Check official links",
      description:
        "Use only the official website and verified community channels before taking any action.",
    },
    {
      step: "02",
      title: "Connect wallet safely",
      description:
        "Use the RainbowKit wallet button and verify network prompts carefully.",
    },
    {
      step: "03",
      title: "Review contracts",
      description:
        "Confirm token, staking, vault, or launchpad addresses before interacting.",
    },
    {
      step: "04",
      title: "Follow launch updates",
      description:
        "If a launch is planned, follow official announcements and avoid unofficial links.",
    },
  ])} as const;

export const partnerItems = ${json([
    {
      name: "BNB Chain",
      description:
        "Primary EVM ecosystem target for wallet and contract readiness.",
    },
    {
      name: "RainbowKit",
      description:
        "Wallet connection interface for a clean Web3 user experience.",
    },
    {
      name: "Wagmi / Viem",
      description:
        "Modern Web3 frontend tooling for Ethereum-compatible networks.",
    },
    {
      name: "KORAX Builder Flow",
      description:
        "Generated website package prepared for GitHub and Vercel publishing.",
    },
  ])} as const;

export const communityItems = ${json([
    {
      title: "Official Announcements",
      description:
        "Share project updates, roadmap progress, and contract changes from official channels only.",
    },
    {
      title: "Builder Community",
      description:
        "Grow around product progress, transparent communication, and real utility instead of hype.",
    },
    {
      title: "User Safety",
      description:
        "Remind users to verify links, avoid fake groups, and never share private keys.",
    },
  ])} as const;

export const faqItems = ${json([
    {
      question: `What is ${name}?`,
      answer: input.shortDescription,
    },
    {
      question: "Is this a live presale?",
      answer:
        "This website is prepared for launch readiness. It should not be treated as a live presale unless the project officially announces a verified sale.",
    },
    {
      question: "Which network is supported?",
      answer: `The website is configured around ${input.network}. If other networks are planned, they should be documented as future expansion only.`,
    },
    {
      question: "Are contract addresses final?",
      answer:
        "Only addresses displayed from official verified sources should be considered valid. Missing addresses should be added after deployment.",
    },
    {
      question: "Does this website promise profit?",
      answer:
        "No. The website avoids guaranteed return claims and should not be considered financial advice.",
    },
  ])} as const;

export const disclaimerPoints = ${json([
    "This website is informational and does not provide financial advice.",
    "Crypto assets and Web3 participation involve risk.",
    "Users must verify official links, contract addresses, and wallet prompts.",
    "No profit, listing, launch, or staking outcome is guaranteed.",
  ])} as const;
`;
}

function buildPackageJson(input: WebsiteBuilderInput) {
  return json({
    name: cleanPackageName(input.projectName),
    version: "1.0.0",
    private: true,
    scripts: {
      dev: "next dev",
      build: "next build",
      start: "next start",
      lint: "next lint",
    },
    dependencies: {
      "@rainbow-me/rainbowkit": "^2.2.8",
      "@tanstack/react-query": "^5.66.0",
      next: "14.2.16",
      react: "^18.3.1",
      "react-dom": "^18.3.1",
      viem: "^2.23.0",
      wagmi: "^2.14.16",
    },
    devDependencies: {
      "@types/node": "^20.17.19",
      "@types/react": "^18.3.18",
      "@types/react-dom": "^18.3.5",
      autoprefixer: "^10.4.20",
      eslint: "^8.57.1",
      "eslint-config-next": "14.2.16",
      postcss: "^8.5.1",
      tailwindcss: "^3.4.17",
      typescript: "^5.7.3",
    },
  });
}

function buildLayout() {
  return `
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Providers from "./providers";
import { siteConfig } from "@/lib/site-data";

export const metadata: Metadata = {
  title: {
    default: \`\${siteConfig.name} (\${siteConfig.symbol}) | Web3 Project\`,
    template: \`%s | \${siteConfig.name}\`,
  },
  description: siteConfig.description,
  keywords: [
    siteConfig.name,
    siteConfig.symbol,
    siteConfig.category,
    "Web3",
    "crypto",
    "blockchain",
    siteConfig.network,
  ],
  openGraph: {
    title: \`\${siteConfig.name} (\${siteConfig.symbol})\`,
    description: siteConfig.description,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
`;
}

function buildProviders(walletConnectProjectId: string) {
  const bakedProjectId = walletConnectProjectId || "missing-korax-project-id";

  return `
"use client";

import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultConfig, RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { bsc } from "wagmi/chains";
import { siteConfig } from "@/lib/site-data";

const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
  "${bakedProjectId}";

const config = getDefaultConfig({
  appName: siteConfig.name,
  projectId,
  chains: [bsc],
  ssr: true,
});

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: siteConfig.primaryColor,
            borderRadius: "large",
            overlayBlur: "small",
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
`;
}

function buildPage() {
  return `
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import About from "@/components/About";
import Tokenomics from "@/components/Tokenomics";
import Staking from "@/components/Staking";
import LaunchSection from "@/components/LaunchSection";
import Roadmap from "@/components/Roadmap";
import Contracts from "@/components/Contracts";
import Security from "@/components/Security";
import HowToBuy from "@/components/HowToBuy";
import Partners from "@/components/Partners";
import Community from "@/components/Community";
import FAQ from "@/components/FAQ";
import Disclaimer from "@/components/Disclaimer";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Navbar />
      <Hero />
      <Stats />
      <About />
      <Tokenomics />
      <Staking />
      <LaunchSection />
      <Roadmap />
      <Contracts />
      <Security />
      <HowToBuy />
      <Partners />
      <Community />
      <FAQ />
      <Disclaimer />
      <Footer />
    </main>
  );
}
`;
}

function buildGlobalsCss() {
  return `
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: dark;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  min-height: 100vh;
  margin: 0;
  background:
    radial-gradient(circle at top left, rgba(11, 95, 255, 0.18), transparent 34%),
    radial-gradient(circle at top right, rgba(124, 255, 106, 0.10), transparent 28%),
    linear-gradient(180deg, #020617 0%, #030712 48%, #000000 100%);
  color: #f8fafc;
  font-family: Arial, Helvetica, sans-serif;
}

::selection {
  background: rgba(124, 255, 106, 0.35);
  color: white;
}

a {
  text-decoration: none;
}

.glass-panel {
  border: 1px solid rgba(255, 255, 255, 0.10);
  background: rgba(255, 255, 255, 0.055);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(18px);
}

.glow-card {
  position: relative;
}

.glow-card::before {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(124, 255, 106, 0.18), rgba(11, 95, 255, 0.10), transparent);
  opacity: 0;
  transition: opacity 220ms ease;
  z-index: -1;
}

.glow-card:hover::before {
  opacity: 1;
}

.section-shell {
  width: min(1120px, calc(100% - 32px));
  margin-left: auto;
  margin-right: auto;
  padding-top: 96px;
  padding-bottom: 96px;
}

.premium-grid {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px);
  background-size: 48px 48px;
}

.text-balance {
  text-wrap: balance;
}

@keyframes floatGlow {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.70;
  }
  50% {
    transform: translateY(-10px) scale(1.02);
    opacity: 1;
  }
}

.float-glow {
  animation: floatGlow 5s ease-in-out infinite;
}

@media (max-width: 768px) {
  .section-shell {
    width: min(100% - 24px, 1120px);
    padding-top: 64px;
    padding-bottom: 64px;
  }
}
`;
}

function buildNavbar() {
  return `
"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { navigationLinks, siteConfig } from "@/lib/site-data";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/45 backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 shadow-[0_0_32px_rgba(124,255,106,0.12)]">
            <span className="text-lg font-black text-white">
              {siteConfig.symbol.slice(0, 2)}
            </span>
          </div>

          <div>
            <div className="text-sm font-black uppercase tracking-[0.22em] text-white">
              {siteConfig.name}
            </div>
            <div className="text-xs text-white/45">
              {siteConfig.category} / {siteConfig.network}
            </div>
          </div>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {navigationLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-white/60 transition hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/docs"
            className="hidden rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white sm:inline-flex"
          >
            Docs
          </a>

          <ConnectButton />
        </div>
      </nav>
    </header>
  );
}
`;
}

function buildHero() {
  return `
import { heroHighlights, siteConfig } from "@/lib/site-data";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 premium-grid opacity-30" />
      <div className="absolute left-1/2 top-20 h-[420px] w-[420px] -translate-x-1/2 rounded-full blur-[120px]"
        style={{ background: siteConfig.primaryColor, opacity: 0.22 }}
      />

      <div className="section-shell relative grid items-center gap-12 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:pt-24">
        <div>
          <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-white/70">
            {siteConfig.category} / {siteConfig.network}
          </div>

          <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.96] tracking-tight text-white md:text-7xl">
            {siteConfig.name}
            <span className="block" style={{ color: siteConfig.secondaryColor }}>
              launch-ready Web3 presence.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">
            {siteConfig.longDescription}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#about"
              className="rounded-2xl px-6 py-4 text-center font-black text-black transition hover:scale-[1.02]"
              style={{ background: siteConfig.secondaryColor }}
            >
              {siteConfig.ctaPrimary}
            </a>

            <a
              href="#contracts"
              className="rounded-2xl border border-white/10 bg-white/10 px-6 py-4 text-center font-black text-white transition hover:bg-white/15"
            >
              {siteConfig.ctaSecondary}
            </a>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {heroHighlights.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/70">
                <span className="mr-2 text-white">✦</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel relative overflow-hidden rounded-[2rem] p-6">
          <div className="absolute inset-0 bg-[url('/hero-bg.svg')] bg-cover bg-center opacity-70" />

          <div className="relative rounded-[1.5rem] border border-white/10 bg-black/50 p-6">
            <div className="text-sm uppercase tracking-[0.24em] text-white/45">
              Project Snapshot
            </div>

            <div className="mt-8 grid gap-4">
              {[
                ["Symbol", siteConfig.symbol],
                ["Network", siteConfig.network],
                ["Category", siteConfig.category],
                ["Status", "Launch readiness"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <span className="text-white/50">{label}</span>
                  <span className="font-black text-white">{value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-white/35">
                Trust Layer
              </div>
              <p className="mt-3 text-sm leading-6 text-white/65">
                Contract transparency, wallet safety, community links, and project documentation are presented clearly before users take action.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
`;
}

function buildStats() {
  return `
import { stats } from "@/lib/site-data";

export default function Stats() {
  return (
    <section className="section-shell">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="glow-card rounded-3xl border border-white/10 bg-white/[0.045] p-6">
            <div className="text-3xl font-black text-white">{item.value}</div>
            <div className="mt-2 font-bold text-white/80">{item.label}</div>
            <p className="mt-3 text-sm leading-6 text-white/55">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
`;
}

function buildAbout() {
  return `
import { siteConfig } from "@/lib/site-data";

const pillars = [
  {
    title: "Clear positioning",
    description: "The project is explained with a serious narrative instead of empty hype.",
  },
  {
    title: "Launch readiness",
    description: "The website prepares the project for community review, GitHub publishing, and Vercel deployment.",
  },
  {
    title: "Trust-first structure",
    description: "Users can review roadmap, contracts, wallet safety, and disclaimers before interacting.",
  },
];

export default function About() {
  return (
    <section id="about" className="section-shell">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-white/40">
            Project Overview
          </p>
          <h2 className="mt-4 text-4xl font-black leading-tight text-white md:text-5xl">
            A serious Web3 presentation for {siteConfig.name}.
          </h2>
          <p className="mt-5 text-lg leading-8 text-white/65">
            {siteConfig.description}
          </p>
          <p className="mt-4 text-base leading-7 text-white/55">
            Built for {siteConfig.targetAudience}, this website keeps the project message focused on transparency, utility, community growth, and careful launch preparation.
          </p>
        </div>

        <div className="grid gap-4">
          {pillars.map((pillar, index) => (
            <div key={pillar.title} className="rounded-3xl border border-white/10 bg-black/30 p-6">
              <div className="text-sm font-black" style={{ color: siteConfig.secondaryColor }}>
                0{index + 1}
              </div>
              <h3 className="mt-3 text-xl font-black text-white">{pillar.title}</h3>
              <p className="mt-2 leading-7 text-white/60">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`;
}

function buildTokenomics() {
  return `
import { siteConfig, tokenomics } from "@/lib/site-data";

export default function Tokenomics() {
  return (
    <section id="tokenomics" className="section-shell">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-white/40">
          Token Overview
        </p>
        <h2 className="mt-4 text-4xl font-black text-white md:text-5xl">
          Token structure without unrealistic promises.
        </h2>
        <p className="mt-5 leading-8 text-white/60">
          {siteConfig.symbol} is presented with a clean utility-first structure. Exact allocations, launch rules, and staking details should be finalized by the project before public launch.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tokenomics.map((item) => (
          <div key={item.title} className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-black text-white">{item.title}</h3>
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold text-white/70">
                {item.value}
              </span>
            </div>
            <p className="mt-4 leading-7 text-white/60">{item.description}</p>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-2/3 rounded-full" style={{ background: siteConfig.secondaryColor }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
`;
}

function buildStaking() {
  return `
import { siteConfig, stakingInfo } from "@/lib/site-data";
import { formatMaybeAddress } from "@/lib/format";

export default function Staking() {
  return (
    <section id="staking" className="section-shell">
      <div className="rounded-[2rem] border border-white/10 bg-black/35 p-6 md:p-10">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-white/40">
              Staking Readiness
            </p>
            <h2 className="mt-4 text-4xl font-black text-white">
              {stakingInfo.title}
            </h2>
            <p className="mt-5 leading-8 text-white/60">{stakingInfo.description}</p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-white/35">
                Staking Contract
              </div>
              <div className="mt-2 break-all font-mono text-sm text-white">
                {formatMaybeAddress(stakingInfo.address)}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {stakingInfo.bullets.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
                <div className="mb-3 h-2 w-10 rounded-full" style={{ background: siteConfig.secondaryColor }} />
                <p className="leading-7 text-white/65">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
`;
}

function buildLaunchSection() {
  return `
import { siteConfig } from "@/lib/site-data";

const launchItems = [
  "Finalize public project documentation",
  "Verify official contract addresses",
  "Prepare community and safety announcements",
  "Connect GitHub repository with Vercel deployment",
  "Move to KORAX Launchpad flow when ready",
];

export default function LaunchSection() {
  return (
    <section className="section-shell">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 md:p-10">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full blur-[90px]" style={{ background: siteConfig.primaryColor, opacity: 0.18 }} />

        <div className="relative">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-white/40">
            Launch on KORAX
          </p>
          <h2 className="mt-4 max-w-3xl text-4xl font-black text-white md:text-5xl">
            Launch readiness before public action.
          </h2>
          <p className="mt-5 max-w-3xl leading-8 text-white/60">
            This section prepares {siteConfig.name} for a transparent launch path. It does not claim a live sale unless the project officially announces verified launch details.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {launchItems.map((item, index) => (
              <div key={item} className="flex gap-4 rounded-2xl border border-white/10 bg-black/30 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black text-black" style={{ background: siteConfig.secondaryColor }}>
                  {index + 1}
                </div>
                <div className="font-semibold leading-7 text-white/75">{item}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
`;
}

function buildRoadmap() {
  return `
import { roadmap } from "@/lib/site-data";

export default function Roadmap() {
  return (
    <section id="roadmap" className="section-shell">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-white/40">
          Roadmap
        </p>
        <h2 className="mt-4 text-4xl font-black text-white md:text-5xl">
          A clear path from foundation to expansion.
        </h2>
      </div>

      <div className="grid gap-5">
        {roadmap.map((phase) => (
          <div key={phase.phase} className="rounded-3xl border border-white/10 bg-black/30 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="text-sm font-black text-white/40">{phase.phase}</div>
                <h3 className="mt-2 text-2xl font-black text-white">{phase.title}</h3>
              </div>

              <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-white/70">
                {phase.status}
              </span>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {phase.items.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-white/65">
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
`;
}

function buildContracts() {
  return `
import { contractItems } from "@/lib/site-data";
import { formatMaybeAddress } from "@/lib/format";

export default function Contracts() {
  return (
    <section id="contracts" className="section-shell">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-white/40">
          Contract Transparency
        </p>
        <h2 className="mt-4 text-4xl font-black text-white md:text-5xl">
          Verify before you interact.
        </h2>
        <p className="mt-5 leading-8 text-white/60">
          Official contract references should be checked carefully. Missing addresses are intentionally shown as pending instead of being invented.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {contractItems.map((item) => (
          <div key={item.label} className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
            <div className="text-sm font-bold uppercase tracking-[0.18em] text-white/40">
              {item.label}
            </div>
            <div className="mt-4 break-all rounded-2xl border border-white/10 bg-black/35 p-4 font-mono text-sm text-white">
              {formatMaybeAddress(item.value)}
            </div>
            <p className="mt-4 leading-7 text-white/60">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
`;
}

function buildSecurity() {
  return `
import { securityItems } from "@/lib/site-data";

export default function Security() {
  return (
    <section className="section-shell">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-white/40">
          Security & Transparency
        </p>
        <h2 className="mt-4 text-4xl font-black text-white">
          Designed for careful Web3 users.
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {securityItems.map((item) => (
          <div key={item.title} className="rounded-3xl border border-white/10 bg-black/30 p-6">
            <h3 className="text-xl font-black text-white">{item.title}</h3>
            <p className="mt-4 leading-7 text-white/60">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
`;
}

function buildHowToBuy() {
  return `
import { howToBuySteps } from "@/lib/site-data";

export default function HowToBuy() {
  return (
    <section className="section-shell">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-white/40">
          How to Participate
        </p>
        <h2 className="mt-4 text-4xl font-black text-white">
          Safe participation flow.
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {howToBuySteps.map((item) => (
          <div key={item.step} className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
            <div className="text-3xl font-black text-white/30">{item.step}</div>
            <h3 className="mt-4 text-xl font-black text-white">{item.title}</h3>
            <p className="mt-3 leading-7 text-white/60">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
`;
}

function buildPartners() {
  return `
import { partnerItems } from "@/lib/site-data";

export default function Partners() {
  return (
    <section className="section-shell">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-white/40">
          Ecosystem
        </p>
        <h2 className="mt-4 text-4xl font-black text-white">
          Compatible Web3 stack.
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {partnerItems.map((item) => (
          <div key={item.name} className="rounded-3xl border border-white/10 bg-black/30 p-6">
            <div className="text-xl font-black text-white">{item.name}</div>
            <p className="mt-3 text-sm leading-6 text-white/60">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
`;
}

function buildCommunity() {
  return `
import { communityItems, socialLinks } from "@/lib/site-data";

export default function Community() {
  return (
    <section className="section-shell">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-white/40">
            Community
          </p>
          <h2 className="mt-4 text-4xl font-black text-white">
            Build trust through official channels.
          </h2>

          <div className="mt-8 grid gap-3">
            {socialLinks.map((link) =>
              link.href ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </a>
              ) : (
                <div key={link.label} className="rounded-2xl border border-white/10 bg-black/25 p-4 text-white/40">
                  {link.label}: Coming soon
                </div>
              )
            )}
          </div>
        </div>

        <div className="grid gap-4">
          {communityItems.map((item) => (
            <div key={item.title} className="rounded-3xl border border-white/10 bg-black/30 p-6">
              <h3 className="text-xl font-black text-white">{item.title}</h3>
              <p className="mt-3 leading-7 text-white/60">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`;
}

function buildFAQ() {
  return `
import { faqItems } from "@/lib/site-data";

export default function FAQ() {
  return (
    <section id="faq" className="section-shell">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-white/40">
          FAQ
        </p>
        <h2 className="mt-4 text-4xl font-black text-white">
          Important questions before launch.
        </h2>
      </div>

      <div className="grid gap-4">
        {faqItems.map((item) => (
          <div key={item.question} className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
            <h3 className="text-xl font-black text-white">{item.question}</h3>
            <p className="mt-3 leading-7 text-white/60">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
`;
}

function buildDisclaimer() {
  return `
import { disclaimerPoints } from "@/lib/site-data";

export default function Disclaimer() {
  return (
    <section className="section-shell">
      <div className="rounded-[2rem] border border-yellow-300/20 bg-yellow-300/10 p-6 md:p-8">
        <h2 className="text-2xl font-black text-yellow-100">Professional Disclaimer</h2>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {disclaimerPoints.map((point) => (
            <div key={point} className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm leading-6 text-white/70">
              {point}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`;
}

function buildFooter() {
  return `
import Link from "next/link";
import { navigationLinks, siteConfig, socialLinks } from "@/lib/site-data";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-black/45">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:px-6">
        <div>
          <div className="text-xl font-black uppercase tracking-[0.18em] text-white">
            {siteConfig.name}
          </div>
          <p className="mt-4 max-w-md leading-7 text-white/55">
            {siteConfig.description}
          </p>
          <p className="mt-4 text-sm text-white/35">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
        </div>

        <div>
          <div className="font-black text-white">Navigation</div>
          <div className="mt-4 grid gap-3">
            {navigationLinks.map((item) => (
              <a key={item.href} href={item.href} className="text-white/55 hover:text-white">
                {item.label}
              </a>
            ))}
            <Link href="/docs" className="text-white/55 hover:text-white">Docs</Link>
            <Link href="/terms" className="text-white/55 hover:text-white">Terms</Link>
            <Link href="/privacy" className="text-white/55 hover:text-white">Privacy</Link>
          </div>
        </div>

        <div>
          <div className="font-black text-white">Social</div>
          <div className="mt-4 grid gap-3">
            {socialLinks.map((link) =>
              link.href ? (
                <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="text-white/55 hover:text-white">
                  {link.label}
                </a>
              ) : (
                <span key={link.label} className="text-white/25">
                  {link.label}: Coming soon
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
`;
}

function buildDocsPage() {
  return `
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { siteConfig, contractItems } from "@/lib/site-data";
import { formatMaybeAddress } from "@/lib/format";

export default function DocsPage() {
  return (
    <main>
      <Navbar />
      <section className="section-shell">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-white/40">Docs</p>
        <h1 className="mt-4 text-5xl font-black text-white">{siteConfig.name} Documentation</h1>
        <p className="mt-5 max-w-3xl leading-8 text-white/60">
          This page explains the project overview, wallet connection, contract references, customization notes, deployment flow, and safety reminders.
        </p>

        <div className="mt-10 grid gap-5">
          <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
            <h2 className="text-2xl font-black text-white">Project Overview</h2>
            <p className="mt-3 leading-7 text-white/60">{siteConfig.longDescription}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
            <h2 className="text-2xl font-black text-white">Contract References</h2>
            <div className="mt-5 grid gap-3">
              {contractItems.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <div className="font-bold text-white">{item.label}</div>
                  <div className="mt-2 break-all font-mono text-sm text-white/65">{formatMaybeAddress(item.value)}</div>
                  <p className="mt-2 text-sm text-white/45">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
            <h2 className="text-2xl font-black text-white">Deployment</h2>
            <p className="mt-3 leading-7 text-white/60">
              Install dependencies, add the WalletConnect project ID only if you want to override the KORAX default, push the repository to GitHub, then import it into Vercel for deployment.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
`;
}

function buildTermsPage() {
  return `
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/site-data";

const terms = [
  "This website is provided for informational purposes only.",
  "Users are responsible for verifying contract addresses, official links, and wallet prompts.",
  "No content on this website should be treated as financial, legal, or investment advice.",
  "Third-party tools such as wallets, GitHub, Vercel, and blockchain explorers are governed by their own terms.",
  "The project may update website content, roadmap items, and contract references as development continues.",
];

export default function TermsPage() {
  return (
    <main>
      <Navbar />
      <section className="section-shell">
        <h1 className="text-5xl font-black text-white">Terms of Use</h1>
        <p className="mt-5 max-w-3xl leading-8 text-white/60">
          These terms apply to the informational website for {siteConfig.name}.
        </p>

        <div className="mt-10 grid gap-4">
          {terms.map((item, index) => (
            <div key={item} className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
              <div className="text-sm font-black text-white/35">0{index + 1}</div>
              <p className="mt-2 leading-7 text-white/65">{item}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
`;
}

function buildPrivacyPage() {
  return `
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/site-data";

const privacyItems = [
  {
    title: "Wallet Data",
    description: "When users connect a wallet, the website may display public wallet information through wallet providers. Private keys are never requested by this website.",
  },
  {
    title: "Local Storage",
    description: "The website may use local browser storage for UI preferences or wallet connection state depending on the wallet tools used.",
  },
  {
    title: "Third-Party Services",
    description: "Wallet providers, GitHub, Vercel, and blockchain infrastructure may process data under their own privacy policies.",
  },
  {
    title: "User Safety",
    description: "Users should always verify the domain, official links, and wallet prompts before interacting with Web3 applications.",
  },
];

export default function PrivacyPage() {
  return (
    <main>
      <Navbar />
      <section className="section-shell">
        <h1 className="text-5xl font-black text-white">Privacy Policy</h1>
        <p className="mt-5 max-w-3xl leading-8 text-white/60">
          This privacy page explains the basic data considerations for the {siteConfig.name} website.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {privacyItems.map((item) => (
            <div key={item.title} className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
              <h2 className="text-2xl font-black text-white">{item.title}</h2>
              <p className="mt-3 leading-7 text-white/60">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
`;
}

function buildFormat() {
  return `
export function shortAddress(address: string) {
  if (!address || address.trim().length < 12) return "";
  return address.slice(0, 6) + "..." + address.slice(-4);
}

export function isProvided(value?: string | null) {
  return Boolean(value && value.trim().length > 0);
}

export function formatMaybeAddress(value?: string | null) {
  if (!isProvided(value)) return "Added after deployment";

  const clean = String(value);

  if (clean.startsWith("0x") && clean.length > 16) {
    return shortAddress(clean);
  }

  return clean;
}

export function cleanExternalUrl(value?: string | null) {
  if (!isProvided(value)) return null;

  const clean = String(value).trim();

  if (clean.startsWith("https://") || clean.startsWith("http://")) {
    return clean;
  }

  return "https://" + clean;
}
`;
}

function buildLogoSvg(input: WebsiteBuilderInput) {
  const initials = safeSymbol(input.symbol).slice(0, 3);

  return `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="120" fill="#020617"/>
  <circle cx="256" cy="256" r="180" fill="${input.primaryColor}" fill-opacity="0.18"/>
  <circle cx="256" cy="256" r="118" fill="${input.secondaryColor}" fill-opacity="0.14"/>
  <path d="M132 318L214 152H300L380 318H306L288 278H222L204 318H132Z" fill="white"/>
  <path d="M242 226L256 194L270 226H242Z" fill="#020617"/>
  <text x="256" y="390" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="48" font-weight="900" fill="white">${initials}</text>
</svg>
`;
}

function buildHeroBgSvg(input: WebsiteBuilderInput) {
  return `
<svg width="1400" height="900" viewBox="0 0 1400 900" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1400" height="900" fill="#020617"/>
  <circle cx="260" cy="180" r="280" fill="${input.primaryColor}" fill-opacity="0.18"/>
  <circle cx="1100" cy="220" r="260" fill="${input.secondaryColor}" fill-opacity="0.12"/>
  <circle cx="740" cy="690" r="360" fill="${input.primaryColor}" fill-opacity="0.10"/>
  <g opacity="0.20">
    <path d="M0 120H1400" stroke="white"/>
    <path d="M0 240H1400" stroke="white"/>
    <path d="M0 360H1400" stroke="white"/>
    <path d="M0 480H1400" stroke="white"/>
    <path d="M0 600H1400" stroke="white"/>
    <path d="M0 720H1400" stroke="white"/>
    <path d="M200 0V900" stroke="white"/>
    <path d="M400 0V900" stroke="white"/>
    <path d="M600 0V900" stroke="white"/>
    <path d="M800 0V900" stroke="white"/>
    <path d="M1000 0V900" stroke="white"/>
    <path d="M1200 0V900" stroke="white"/>
  </g>
</svg>
`;
}

function buildReadme(input: WebsiteBuilderInput) {
  return `
# ${input.projectName} (${safeSymbol(input.symbol)})

Generated by KORAX Website Builder AI.

This is a production-minded Next.js App Router website package for a Web3 project. It includes a premium homepage, RainbowKit wallet connection, project documentation, terms, privacy page, contract transparency section, staking readiness section, launch readiness section, community links, roadmap, FAQ, and deployment configuration.

## Features

- Next.js App Router
- TypeScript
- Tailwind CSS
- RainbowKit wallet connection
- Wagmi / Viem
- BNB Chain support
- Responsive premium Web3 design
- Data-driven content in lib/site-data.ts
- Docs, Terms, and Privacy pages
- GitHub and Vercel ready

## Setup

1. Install dependencies:

npm install

2. Start development:

npm run dev

## Wallet Connection

This generated project includes a default KORAX WalletConnect / Reown Project ID baked into app/providers.tsx at generation time.

Advanced users can override it by creating .env.local and adding:

NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

Normal users do not need to change anything.

## Environment Variables

Optional contract variables:

NEXT_PUBLIC_TOKEN_ADDRESS
NEXT_PUBLIC_STAKING_ADDRESS
NEXT_PUBLIC_VAULT_ADDRESS
NEXT_PUBLIC_LAUNCHPAD_ADDRESS
NEXT_PUBLIC_CHAIN_ID

## Customization

Most website copy and structured content is stored in:

lib/site-data.ts

Main design styles are in:

app/globals.css

Main sections are inside:

components/

## Deployment

Push this repository to GitHub, then import it into Vercel.

Recommended Vercel settings:

- Framework: Next.js
- Build command: npm run build
- Output: default

## Safety Notes

This website does not provide financial advice.
Do not promise guaranteed returns.
Always verify contract addresses.
Only publish official social links.
Never ask users for private keys or seed phrases.
`;
}

function buildEnvExample(input: WebsiteBuilderInput) {
  return `
# Optional:
# KORAX already includes a default WalletConnect / Reown Project ID inside app/providers.tsx.
# Advanced users can override it with their own ID if they want.
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=

NEXT_PUBLIC_TOKEN_ADDRESS=${input.tokenAddress}
NEXT_PUBLIC_STAKING_ADDRESS=${input.stakingAddress}
NEXT_PUBLIC_VAULT_ADDRESS=${input.vaultAddress}
NEXT_PUBLIC_LAUNCHPAD_ADDRESS=${input.launchpadAddress}
NEXT_PUBLIC_CHAIN_ID=56
`;
}

function buildProjectFiles(input: WebsiteBuilderInput): WebsiteFile[] {
  const walletConnectProjectId = getKoraxWalletConnectProjectId();

  const files: WebsiteFile[] = [
    file("package.json", buildPackageJson(input)),
    file("app/layout.tsx", buildLayout()),
    file("app/providers.tsx", buildProviders(walletConnectProjectId)),
    file("app/page.tsx", buildPage()),
    file("app/globals.css", buildGlobalsCss()),

    file("app/docs/page.tsx", buildDocsPage()),
    file("app/terms/page.tsx", buildTermsPage()),
    file("app/privacy/page.tsx", buildPrivacyPage()),

    file("components/Navbar.tsx", buildNavbar()),
    file("components/Hero.tsx", buildHero()),
    file("components/Stats.tsx", buildStats()),
    file("components/About.tsx", buildAbout()),
    file("components/Tokenomics.tsx", buildTokenomics()),
    file("components/Staking.tsx", buildStaking()),
    file("components/LaunchSection.tsx", buildLaunchSection()),
    file("components/Roadmap.tsx", buildRoadmap()),
    file("components/Contracts.tsx", buildContracts()),
    file("components/Security.tsx", buildSecurity()),
    file("components/HowToBuy.tsx", buildHowToBuy()),
    file("components/Community.tsx", buildCommunity()),
    file("components/Partners.tsx", buildPartners()),
    file("components/FAQ.tsx", buildFAQ()),
    file("components/Disclaimer.tsx", buildDisclaimer()),
    file("components/Footer.tsx", buildFooter()),

    file("lib/site-data.ts", buildSiteData(input)),
    file("lib/format.ts", buildFormat()),

    file("public/logo.svg", buildLogoSvg(input)),
    file("public/hero-bg.svg", buildHeroBgSvg(input)),

    file("README.md", buildReadme(input)),
    file(".env.example", buildEnvExample(input)),
    file("vercel.json", json({ framework: "nextjs" })),

    file(
      "tailwind.config.ts",
      `
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
`
    ),

    file(
      "postcss.config.mjs",
      `
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
`
    ),

    file(
      "tsconfig.json",
      json({
        compilerOptions: {
          target: "es5",
          lib: ["dom", "dom.iterable", "esnext"],
          allowJs: true,
          skipLibCheck: true,
          strict: true,
          noEmit: true,
          esModuleInterop: true,
          module: "esnext",
          moduleResolution: "bundler",
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: "preserve",
          incremental: true,
          plugins: [{ name: "next" }],
          paths: {
            "@/*": ["./*"],
          },
        },
        include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
        exclude: ["node_modules"],
      })
    ),

    file(
      "next.config.mjs",
      `
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
`
    ),

    file(
      ".gitignore",
      `
node_modules
.next
out
.env
.env.local
.env.production
.vercel
.DS_Store
`
    ),
  ];

  return files;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = buildInput(body);

    if (!input.projectName || !input.symbol || !input.shortDescription) {
      return NextResponse.json(
        { error: "Project name, symbol, and description are required." },
        { status: 400 }
      );
    }

    const walletConnectProjectId = getKoraxWalletConnectProjectId();

    if (!walletConnectProjectId) {
      return NextResponse.json(
        {
          error:
            "NEXT_PUBLIC_KORAX_WALLETCONNECT_PROJECT_ID is missing in Vercel env. Add it first so generated websites have Connect Wallet ready.",
        },
        { status: 500 }
      );
    }

    const files = buildProjectFiles(input);

    const requiredPaths = new Set([
      ...REQUIRED_WEBSITE_FILES,
      ...EXTRA_PROJECT_FILES,
    ]);

    const existingPaths = new Set(files.map((item) => item.path));

    const missing = [...requiredPaths].filter((path) => !existingPaths.has(path));

    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Template missing files: ${missing.join(", ")}` },
        { status: 500 }
      );
    }

    const websiteName = `${input.projectName} Website`;

    return NextResponse.json({
      result: {
        websiteName,
        summary: `A premium Web3 website package for ${input.projectName}, generated with a fixed KORAX professional template. It includes wallet connection, contract transparency, launch readiness, staking readiness, community sections, docs, terms, privacy, and Vercel-ready project files.`,
        brandDirection: {
          positioning: `${input.projectName} is positioned as a serious ${input.category} Web3 project with transparent launch readiness.`,
          tone: "Professional, direct, trustworthy, community-aware, and product-focused.",
          visualIdentity:
            "Premium dark Web3 interface with glass cards, deep gradients, clean typography, and strong section hierarchy.",
          trustAngle:
            "The website avoids unrealistic claims and focuses on verified links, contract transparency, roadmap clarity, and wallet safety.",
        },
        styleGuide: {
          theme: input.websiteStyle,
          primaryColor: input.primaryColor,
          secondaryColor: input.secondaryColor,
          background: input.backgroundStyle,
          cardStyle:
            "Glassmorphism cards, subtle borders, dark layered panels, and glow accents.",
          fontMood: "Modern, bold, readable, and launch-ready.",
          buttonStyle:
            "High-contrast rounded CTAs with clear hierarchy and hover states.",
        },
        sections: [
          {
            name: "Hero",
            purpose: "Introduce the project with strong positioning and CTAs.",
            headline: `${input.projectName} launch-ready Web3 presence.`,
            description: input.shortDescription,
          },
          {
            name: "Tokenomics",
            purpose: "Present the token structure responsibly.",
            headline: "Token structure without unrealistic promises.",
            description:
              "A utility-first token overview with clear disclaimers and editable planning blocks.",
          },
          {
            name: "Contracts",
            purpose:
              "Show official contract references or pending deployment state.",
            headline: "Verify before you interact.",
            description:
              "Contract addresses are displayed only when provided and never invented.",
          },
          {
            name: "Roadmap",
            purpose: "Explain development phases and future direction.",
            headline: "A clear path from foundation to expansion.",
            description:
              "A structured roadmap for project foundation, verification, launch readiness, and expansion.",
          },
        ],
        files,
        deploymentNotes: [
          "Install dependencies with npm install.",
          "Connect Wallet is already configured with the KORAX default WalletConnect / Reown Project ID.",
          "Advanced users can override the wallet ID with NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID.",
          "Push to GitHub and import the repository into Vercel.",
          "Verify contract addresses before publishing publicly.",
        ],
        koraxPublishingNote:
          "This website was generated with the KORAX professional fixed template engine. It is designed for stable GitHub publishing and Vercel deployment under the connected user's own accounts.",
      },
      meta: {
        generationMode: "fixed-premium-template",
        walletConnectReady: true,
        filesGenerated: files.length,
        requiredFiles: REQUIRED_WEBSITE_FILES,
        extraFiles: EXTRA_PROJECT_FILES,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Unexpected server error.",
      },
      { status: 500 }
    );
  }
}