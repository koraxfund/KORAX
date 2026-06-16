export type WebsiteFile = {
  path: string;
  content: string;
};

export type WebsiteBuilderInput = {
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

type GeneratedWebsiteResult = {
  websiteName: string;
  summary: string;
  brandDirection: {
    positioning: string;
    tone: string;
    visualIdentity: string;
    trustAngle: string;
  };
  styleGuide: {
    theme: string;
    primaryColor: string;
    secondaryColor: string;
    background: string;
    cardStyle: string;
    fontMood: string;
    buttonStyle: string;
  };
  sections: Array<{
    name: string;
    purpose: string;
    headline: string;
    description: string;
  }>;
  files: WebsiteFile[];
  deploymentNotes: string[];
  koraxPublishingNote: string;
  meta: {
    generationMode: string;
    filesGenerated: number;
    generatedLines: number;
    quality: string;
  };
};

function cleanText(value: unknown, fallback = "") {
  if (typeof value !== "string") return fallback;
  return value.trim();
}

export function getKoraxWalletConnectProjectId() {
  return cleanText(
    process.env.NEXT_PUBLIC_KORAX_WALLETCONNECT_PROJECT_ID ||
      process.env.KORAX_WALLETCONNECT_PROJECT_ID ||
      ""
  );
}

export function buildWebsiteBuilderInput(body: any): WebsiteBuilderInput {
  return {
    projectName: cleanText(body?.projectName),
    symbol: cleanText(body?.symbol),
    category: cleanText(body?.category, "Web3 Ecosystem"),
    shortDescription: cleanText(body?.shortDescription),
    targetAudience: cleanText(
      body?.targetAudience,
      "Web3 users, founders, holders, traders, builders, and early community members"
    ),
    websiteStyle: cleanText(
      body?.websiteStyle,
      "KORAX Beast v4 / 10000+ generated lines / cinematic million-dollar Web3 interface"
    ),
    primaryColor: cleanText(body?.primaryColor, "#135CFF"),
    secondaryColor: cleanText(body?.secondaryColor, "#67FF8D"),
    backgroundStyle: cleanText(
      body?.backgroundStyle,
      "Deep cinematic black-blue interface with aurora gradients, command panels, holographic cards, premium launch dashboards, investor-grade density, and security-first structure"
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
      "Hero, Command Center, Ecosystem Radar, Token Universe, Launch Console, Contract Console, Security Core, 50 Million-Dollar modules, 40 premium pages, Roadmap, Community, Docs"
    ),
    specialInstructions: cleanText(
      body?.specialInstructions,
      "Generate a design-first premium Web3 website that looks like a funded crypto infrastructure product, not a cheap token landing page."
    ),
  };
}

function json(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function safeSymbol(value: string) {
  return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase() || "TOKEN";
}

function cleanPackageName(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "korax-beast-v4-site"
  );
}

function provided(value: string) {
  return value.trim().length > 0;
}

function file(path: string, content: string): WebsiteFile {
  return {
    path,
    content: content.trim() + "\n",
  };
}

function countGeneratedLines(files: WebsiteFile[]) {
  return files.reduce((total, item) => {
    return total + item.content.split("\n").length;
  }, 0);
}

function buildDataModel(input: WebsiteBuilderInput) {
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
      type: "Core",
      status: provided(input.tokenAddress) ? "Provided" : "Pending",
      description:
        "Primary token contract reference. This website never invents fake contract addresses.",
    },
    {
      label: "Staking Contract",
      value: input.stakingAddress || "",
      type: "Utility",
      status: provided(input.stakingAddress) ? "Provided" : "Pending",
      description:
        "Staking contract reference for lock logic, access utility, or holder participation.",
    },
    {
      label: "Vault Contract",
      value: input.vaultAddress || "",
      type: "Treasury",
      status: provided(input.vaultAddress) ? "Provided" : "Pending",
      description:
        "Vault reference for reserves, controlled distribution, claims, or treasury structure.",
    },
    {
      label: "Launchpad Reference",
      value: input.launchpadAddress || "",
      type: "Launch",
      status: provided(input.launchpadAddress) ? "Provided" : "Pending",
      description:
        "Launchpad reference. This is not presented as a live sale unless officially confirmed.",
    },
  ];

  return {
    siteConfig: {
      name,
      symbol,
      category: input.category,
      description: input.shortDescription,
      longDescription:
        input.shortDescription +
        " The interface is structured as a premium Web3 command center with wallet connection, contract transparency, launch readiness, ecosystem mapping, risk language, documentation, internal pages, security-first sections, investor-style density, and deployment-ready architecture.",
      targetAudience: input.targetAudience,
      network: input.network,
      primaryColor: input.primaryColor,
      secondaryColor: input.secondaryColor,
      backgroundStyle: input.backgroundStyle,
      websiteStyle: input.websiteStyle,
      ctaPrimary: "Enter Command Center",
      ctaSecondary: "Verify Contracts",
      ctaTertiary: "Read Docs",
    },

    nav: [
      { label: "Command", href: "#command" },
      { label: "Radar", href: "#radar" },
      { label: "Token", href: "#token" },
      { label: "Launch", href: "#launch" },
      { label: "Security", href: "#security" },
      { label: "Roadmap", href: "#roadmap" },
    ],

    socials,

    heroBadges: [
      "Wallet-ready",
      "Launch-ready",
      "Contract-aware",
      "Vercel-ready",
      "GitHub-ready",
      "Security-first",
      "Investor-style",
      "10000+ generated lines",
    ],

    heroMetrics: [
      {
        label: "Project",
        value: name,
        hint: "Generated premium identity",
      },
      {
        label: "Symbol",
        value: symbol,
        hint: "Public ticker layer",
      },
      {
        label: "Network",
        value: input.network,
        hint: "Primary chain experience",
      },
      {
        label: "Mode",
        value: "Beast v4",
        hint: "10000+ lines generation",
      },
    ],

    commandCards: [
      {
        title: "Launch Command",
        value: "Prepared",
        description:
          "Public launch story, user safety, official links, and verification paths are separated from fake hype.",
      },
      {
        title: "Wallet Layer",
        value: "RainbowKit",
        description:
          "The generated site includes a real wallet connection flow through RainbowKit and Wagmi.",
      },
      {
        title: "Contract Console",
        value: "Transparent",
        description:
          "Official contract fields are shown clearly. Missing addresses remain pending instead of being invented.",
      },
      {
        title: "Deployment Layer",
        value: "GitHub + Vercel",
        description:
          "The package is structured for repository publishing and Vercel import.",
      },
    ],

    radarNodes: [
      {
        title: "Token Core",
        description: "The public identity and token reference layer.",
        level: provided(input.tokenAddress) ? "Live reference" : "Pending",
      },
      {
        title: "Staking Path",
        description: "Holder utility, lock logic, and participation path.",
        level: provided(input.stakingAddress) ? "Configured" : "Prepared",
      },
      {
        title: "Vault Layer",
        description: "Treasury, claims, reserves, or controlled distribution.",
        level: provided(input.vaultAddress) ? "Configured" : "Pending",
      },
      {
        title: "Launchpad Path",
        description: "Launch readiness and KORAX launch flow preparation.",
        level: provided(input.launchpadAddress) ? "Linked" : "Prepared",
      },
      {
        title: "Community",
        description: "Official channels, announcements, and anti-scam discipline.",
        level: "Open",
      },
      {
        title: "Docs",
        description: "Documentation, terms, privacy, and security pages.",
        level: "Included",
      },
    ],

    tokenUniverse: [
      {
        title: "Access Utility",
        value: "Core",
        percentage: 86,
        description:
          "Token utility can support access, tools, participation, launch features, or ecosystem functions.",
      },
      {
        title: "Community Energy",
        value: "Growth",
        percentage: 74,
        description:
          "Community growth should come from visible progress, official updates, and product direction.",
      },
      {
        title: "Liquidity Readiness",
        value: "Planned",
        percentage: 58,
        description:
          "Liquidity, listing, and launch preparation must be documented before public action.",
      },
      {
        title: "Security Discipline",
        value: "Trust",
        percentage: 91,
        description:
          "Risk warnings, contract verification, wallet safety, and official links are built into the flow.",
      },
      {
        title: "Staking Structure",
        value: provided(input.stakingAddress) ? "Reference" : "Pending",
        percentage: provided(input.stakingAddress) ? 79 : 42,
        description:
          "Staking should be shown only with clear rules, contract references, and user responsibility notes.",
      },
      {
        title: "Expansion Engine",
        value: "Future",
        percentage: 67,
        description:
          "The system is prepared for dashboards, docs, multi-page growth, and future KORAX integrations.",
      },
    ],

    launchConsole: [
      {
        step: "01",
        title: "Identity Lock",
        description:
          "Finalize public identity, brand message, official links, and website presentation.",
      },
      {
        step: "02",
        title: "Contract Verification",
        description:
          "Add verified contract addresses only after official deployment and explorer confirmation.",
      },
      {
        step: "03",
        title: "Community Activation",
        description:
          "Publish official channels, safety notes, anti-scam reminders, and launch education.",
      },
      {
        step: "04",
        title: "Launch Readiness",
        description:
          "Move to public launch flow only after verified details are ready.",
      },
    ],

    contracts,

    securityCore: [
      {
        title: "No Fake Addresses",
        description:
          "The website never invents contract addresses. Missing references are displayed as pending.",
      },
      {
        title: "No Profit Guarantees",
        description:
          "The copy avoids guaranteed returns, fake scarcity, and manipulative investment claims.",
      },
      {
        title: "Wallet Safety",
        description:
          "Users are reminded to verify wallet prompts and never share seed phrases.",
      },
      {
        title: "Official Channels",
        description:
          "Only provided social links are displayed. Missing links are marked as coming soon.",
      },
      {
        title: "Risk Visibility",
        description:
          "Security, risk, terms, privacy, and docs pages are included in the generated website.",
      },
      {
        title: "Launch Discipline",
        description:
          "Launch readiness is not described as a live sale unless officially confirmed.",
      },
    ],

    roadmap: [
      {
        phase: "Phase 01",
        title: "Foundation",
        status: "Current",
        items: [
          "Premium website and public identity",
          "Wallet-ready frontend",
          "Docs, legal pages, and security center",
        ],
      },
      {
        phase: "Phase 02",
        title: "Contract Layer",
        status: "Next",
        items: [
          "Deploy and verify token contracts",
          "Add official addresses",
          "Prepare staking and vault references",
        ],
      },
      {
        phase: "Phase 03",
        title: "Launch Layer",
        status: "Planned",
        items: [
          "Official launch announcement",
          "Community education",
          "KORAX launch path preparation",
        ],
      },
      {
        phase: "Phase 04",
        title: "Expansion Layer",
        status: "Future",
        items: [
          "Dashboard growth",
          "Builder integrations",
          "Deeper ecosystem pages",
        ],
      },
    ],

    faq: [
      {
        question: "What is " + name + "?",
        answer: input.shortDescription,
      },
      {
        question: "Is this a live presale?",
        answer:
          "This generated website is launch-ready, but it should not be treated as a live presale unless the project officially confirms a verified sale.",
      },
      {
        question: "Which network is configured?",
        answer:
          "The generated website is configured around " +
          input.network +
          ". Advanced teams can edit the provider and chain settings later.",
      },
      {
        question: "Are the contract addresses final?",
        answer:
          "Only provided official addresses are displayed. Missing addresses are marked as pending.",
      },
      {
        question: "Does the website promise profit?",
        answer:
          "No. The generated website avoids guaranteed profit claims and does not provide financial advice.",
      },
    ],

    disclaimer: [
      "This website is informational and does not provide financial advice.",
      "Crypto assets and Web3 participation involve risk.",
      "Users must verify official links, contract addresses, and wallet prompts.",
      "No profit, listing, launch, or staking outcome is guaranteed.",
      "Never share private keys or recovery phrases.",
    ],
  };
}

function buildSiteData(input: WebsiteBuilderInput) {
  const data = buildDataModel(input);

  return `
export const siteConfig = ${json(data.siteConfig)} as const;
export const nav = ${json(data.nav)} as const;
export const socials = ${json(data.socials)} as const;
export const heroBadges = ${json(data.heroBadges)} as const;
export const heroMetrics = ${json(data.heroMetrics)} as const;
export const commandCards = ${json(data.commandCards)} as const;
export const radarNodes = ${json(data.radarNodes)} as const;
export const tokenUniverse = ${json(data.tokenUniverse)} as const;
export const launchConsole = ${json(data.launchConsole)} as const;
export const contracts = ${json(data.contracts)} as const;
export const securityCore = ${json(data.securityCore)} as const;
export const roadmap = ${json(data.roadmap)} as const;
export const faq = ${json(data.faq)} as const;
export const disclaimer = ${json(data.disclaimer)} as const;
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
    default: siteConfig.name + " (" + siteConfig.symbol + ") | Beast Web3 Command Center",
    template: "%s | " + siteConfig.name,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name + " (" + siteConfig.symbol + ")",
    description: siteConfig.description,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="noise-layer" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
`;
}

function buildProviders(walletConnectProjectId: string) {
  return `
"use client";

import "@rainbow-me/rainbowkit/styles.css";

import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { bsc } from "wagmi/chains";
import { siteConfig } from "@/lib/site-data";

const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
  "${walletConnectProjectId}";

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
import StatsRibbon from "@/components/StatsRibbon";
import CommandCenter from "@/components/CommandCenter";
import EcosystemRadar from "@/components/EcosystemRadar";
import TokenUniverse from "@/components/TokenUniverse";
import LaunchCommandCenter from "@/components/LaunchCommandCenter";
import ContractConsole from "@/components/ContractConsole";
import SecurityCore from "@/components/SecurityCore";
import MillionDollarIndex from "@/components/MillionDollarIndex";
import Roadmap from "@/components/Roadmap";
import Community from "@/components/Community";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Navbar />
      <Hero />
      <StatsRibbon />
      <CommandCenter />
      <EcosystemRadar />
      <TokenUniverse />
      <LaunchCommandCenter />
      <ContractConsole />
      <SecurityCore />
      <MillionDollarIndex />
      <Roadmap />
      <Community />
      <FAQ />
      <FinalCTA />
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
  --bg: #02040b;
  --panel: rgba(255, 255, 255, 0.055);
  --panel-strong: rgba(255, 255, 255, 0.085);
  --border: rgba(255, 255, 255, 0.11);
  --muted: rgba(255, 255, 255, 0.62);
  --soft: rgba(255, 255, 255, 0.42);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  background: #02040b;
}

body {
  min-height: 100vh;
  margin: 0;
  background:
    radial-gradient(circle at 18% 8%, rgba(19, 92, 255, 0.35), transparent 31%),
    radial-gradient(circle at 82% 14%, rgba(103, 255, 141, 0.17), transparent 28%),
    radial-gradient(circle at 50% 40%, rgba(255, 255, 255, 0.055), transparent 38%),
    linear-gradient(180deg, #02040b 0%, #040816 45%, #000000 100%);
  color: #f8fafc;
  font-family: Arial, Helvetica, sans-serif;
}

body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: linear-gradient(to bottom, black, transparent 82%);
  z-index: 0;
}

body::after {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  background-image:
    radial-gradient(circle at 30% 20%, rgba(255,255,255,0.045) 0 1px, transparent 1px),
    radial-gradient(circle at 70% 40%, rgba(255,255,255,0.035) 0 1px, transparent 1px);
  background-size: 90px 90px, 130px 130px;
  opacity: 0.45;
  z-index: 0;
}

a {
  text-decoration: none;
}

button,
a {
  -webkit-tap-highlight-color: transparent;
}

::selection {
  background: rgba(103, 255, 141, 0.32);
  color: white;
}

.noise-layer {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.05;
  background:
    linear-gradient(90deg, white 1px, transparent 1px),
    linear-gradient(white 1px, transparent 1px);
  background-size: 3px 3px;
  mix-blend-mode: overlay;
}

.section-shell {
  position: relative;
  z-index: 2;
  width: min(1180px, calc(100% - 32px));
  margin-left: auto;
  margin-right: auto;
  padding-top: 110px;
  padding-bottom: 110px;
}

.beast-card {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border);
  background:
    linear-gradient(135deg, rgba(255,255,255,0.085), rgba(255,255,255,0.035)),
    rgba(0,0,0,0.22);
  box-shadow:
    0 32px 120px rgba(0, 0, 0, 0.52),
    inset 0 1px 0 rgba(255,255,255,0.08);
  backdrop-filter: blur(18px);
}

.beast-card::before {
  content: "";
  position: absolute;
  inset: -1px;
  background:
    radial-gradient(circle at 18% 0%, rgba(255,255,255,0.18), transparent 28%),
    radial-gradient(circle at 90% 0%, rgba(103,255,141,0.14), transparent 32%);
  opacity: 0;
  transition: opacity 220ms ease;
  pointer-events: none;
}

.beast-card:hover::before {
  opacity: 1;
}

.beast-card > * {
  position: relative;
  z-index: 2;
}

.command-grid {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px);
  background-size: 44px 44px;
}

.aurora {
  position: absolute;
  pointer-events: none;
  border-radius: 999px;
  filter: blur(110px);
  opacity: 0.32;
}

.scanline {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    repeating-linear-gradient(
      to bottom,
      rgba(255,255,255,0.035),
      rgba(255,255,255,0.035) 1px,
      transparent 1px,
      transparent 7px
    );
  opacity: 0.22;
  mix-blend-mode: screen;
}

@media (max-width: 768px) {
  .section-shell {
    width: min(100% - 24px, 1180px);
    padding-top: 72px;
    padding-bottom: 72px;
  }
}
`;
}

function buildNavbar() {
  return `
"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { nav, siteConfig } from "@/lib/site-data";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/45 backdrop-blur-2xl">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 shadow-[0_0_42px_rgba(103,255,141,0.18)]"
            style={{
              background:
                "linear-gradient(135deg, " +
                siteConfig.primaryColor +
                ", " +
                siteConfig.secondaryColor +
                ")",
            }}
          >
            <span className="text-sm font-black text-black">
              {siteConfig.symbol.slice(0, 2)}
            </span>
          </div>

          <div>
            <div className="text-sm font-black uppercase tracking-[0.22em] text-white">
              {siteConfig.name}
            </div>
            <div className="text-xs text-white/45">
              Beast v4 / {siteConfig.network}
            </div>
          </div>
        </Link>

        <div className="hidden items-center gap-6 xl:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-white/58 transition hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="hidden rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-white/70 transition hover:bg-white/10 hover:text-white lg:inline-flex"
          >
            Dashboard
          </Link>
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
import { heroBadges, heroMetrics, siteConfig } from "@/lib/site-data";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="aurora left-[-120px] top-[-120px] h-[420px] w-[420px]" style={{ background: siteConfig.primaryColor }} />
      <div className="aurora right-[-160px] top-[80px] h-[360px] w-[360px]" style={{ background: siteConfig.secondaryColor }} />
      <div className="absolute inset-0 command-grid opacity-35" />

      <div className="section-shell relative grid min-h-[760px] items-center gap-12 pt-16 lg:grid-cols-[1.04fr_0.96fr] lg:pt-24">
        <div>
          <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-white/72">
            {siteConfig.category} / {siteConfig.network} / Command Center
          </div>

          <h1 className="mt-7 max-w-5xl text-5xl font-black leading-[0.9] tracking-tight text-white md:text-7xl xl:text-8xl">
            {siteConfig.name}
            <span className="block" style={{ color: siteConfig.secondaryColor }}>
              is not a landing page.
            </span>
            <span className="block text-white/85">It is a Web3 machine.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/66 md:text-xl">
            {siteConfig.longDescription}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#command"
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

          <div className="mt-8 flex flex-wrap gap-3">
            {heroBadges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm font-semibold text-white/58"
              >
                ✦ {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="beast-card relative rounded-[2rem] p-5 md:p-6">
          <div className="scanline" />

          <div className="rounded-[1.5rem] border border-white/10 bg-black/50 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.24em] text-white/35">
                  Live Interface Preview
                </div>
                <div className="mt-2 text-2xl font-black text-white">
                  Launch OS
                </div>
              </div>

              <div
                className="h-14 w-14 rounded-2xl border border-white/10"
                style={{
                  background:
                    "linear-gradient(135deg, " +
                    siteConfig.primaryColor +
                    ", " +
                    siteConfig.secondaryColor +
                    ")",
                }}
              />
            </div>

            <div className="mt-6 grid gap-3">
              {heroMetrics.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.045] p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-white/42">{item.label}</span>
                    <span className="font-black text-white">{item.value}</span>
                  </div>
                  <p className="mt-2 text-xs text-white/38">{item.hint}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="text-xs font-black uppercase tracking-[0.22em] text-white/35">
                Trust Signal
              </div>
              <p className="mt-3 text-sm leading-6 text-white/62">
                This generated interface separates what is live, what is pending, and what users must verify before interacting.
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

function buildStatsRibbon() {
  return `
import { heroMetrics } from "@/lib/site-data";

export default function StatsRibbon() {
  return (
    <section className="relative z-10 border-y border-white/10 bg-white/[0.035] backdrop-blur-xl">
      <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-7 md:grid-cols-4 md:px-6">
        {heroMetrics.map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="text-xs font-black uppercase tracking-[0.22em] text-white/32">
              {item.label}
            </div>
            <div className="mt-2 text-2xl font-black text-white">{item.value}</div>
            <div className="mt-1 text-xs text-white/42">{item.hint}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
`;
}

function buildSectionHeader() {
  return `
export default function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-10 max-w-3xl">
      <p className="text-sm font-black uppercase tracking-[0.28em] text-white/38">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-4xl font-black leading-tight text-white md:text-6xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-base leading-8 text-white/60 md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
`;
}

function buildCommandCenter() {
  return `
import { commandCards, siteConfig } from "@/lib/site-data";
import SectionHeader from "@/components/ui/SectionHeader";

export default function CommandCenter() {
  return (
    <section id="command" className="section-shell">
      <SectionHeader
        eyebrow="Command Center"
        title="A premium project cockpit, not a flat homepage."
        description="This section makes the project feel like a funded Web3 infrastructure product with launch control, wallet readiness, deployment structure, and transparent contracts."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {commandCards.map((item) => (
          <div key={item.title} className="beast-card rounded-[1.6rem] p-6">
            <div className="text-xs font-black uppercase tracking-[0.22em] text-white/35">
              {item.title}
            </div>
            <div className="mt-5 text-3xl font-black text-white">{item.value}</div>
            <p className="mt-4 text-sm leading-6 text-white/60">{item.description}</p>
            <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full w-3/4 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, " +
                    siteConfig.primaryColor +
                    ", " +
                    siteConfig.secondaryColor +
                    ")",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
`;
}

function buildEcosystemRadar() {
  return `
import { radarNodes, siteConfig } from "@/lib/site-data";
import SectionHeader from "@/components/ui/SectionHeader";

export default function EcosystemRadar() {
  return (
    <section id="radar" className="section-shell">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <SectionHeader
          eyebrow="Ecosystem Radar"
          title="The project looks connected before it asks for trust."
          description="The radar visual shows how token, staking, vault, launchpad, community, and documentation layers connect into one ecosystem."
        />

        <div className="beast-card relative min-h-[520px] overflow-hidden rounded-[2rem] p-6">
          <div className="absolute inset-6 rounded-full border border-white/10" />
          <div className="absolute inset-16 rounded-full border border-white/10" />
          <div className="absolute inset-28 rounded-full border border-white/10" />

          <div
            className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-[2rem] border border-white/10"
            style={{
              background:
                "linear-gradient(135deg, " +
                siteConfig.primaryColor +
                ", " +
                siteConfig.secondaryColor +
                ")",
            }}
          >
            <div className="flex h-full items-center justify-center text-sm font-black text-black">
              {siteConfig.symbol}
            </div>
          </div>

          <div className="relative grid h-full grid-cols-1 gap-4 md:grid-cols-2">
            {radarNodes.map((node) => (
              <div
                key={node.title}
                className="rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-black text-white">{node.title}</h3>
                  <span className="rounded-full border border-white/10 bg-white/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white/58">
                    {node.level}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-white/58">{node.description}</p>
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

function buildTokenUniverse() {
  return `
import { siteConfig, tokenUniverse } from "@/lib/site-data";
import SectionHeader from "@/components/ui/SectionHeader";

export default function TokenUniverse() {
  return (
    <section id="token" className="section-shell">
      <SectionHeader
        eyebrow="Token Universe"
        title="A visual token story with utility, safety, and expansion."
        description="Instead of a cheap tokenomics box, this section presents the token as a universe of utility, growth, security, and future architecture."
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {tokenUniverse.map((item) => (
          <div key={item.title} className="beast-card rounded-[1.8rem] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.22em] text-white/35">
                  {item.value}
                </div>
                <h3 className="mt-3 text-2xl font-black text-white">{item.title}</h3>
              </div>
              <div className="text-3xl font-black text-white/20">{item.percentage}</div>
            </div>

            <p className="mt-4 text-sm leading-6 text-white/60">{item.description}</p>

            <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full"
                style={{
                  width: item.percentage + "%",
                  background:
                    "linear-gradient(90deg, " +
                    siteConfig.primaryColor +
                    ", " +
                    siteConfig.secondaryColor +
                    ")",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
`;
}

function buildLaunchCommandCenter() {
  return `
import { launchConsole, siteConfig } from "@/lib/site-data";
import SectionHeader from "@/components/ui/SectionHeader";

export default function LaunchCommandCenter() {
  return (
    <section id="launch" className="section-shell">
      <div className="beast-card rounded-[2rem] p-6 md:p-10">
        <SectionHeader
          eyebrow="Launch Command"
          title="Launch readiness with discipline, not fake urgency."
          description="The generated website prepares a serious public launch path while avoiding unsupported sale claims."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {launchConsole.map((item) => (
            <div key={item.step} className="rounded-[1.5rem] border border-white/10 bg-black/32 p-5">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-black text-black"
                style={{ background: siteConfig.secondaryColor }}
              >
                {item.step}
              </div>
              <h3 className="mt-5 text-xl font-black text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/58">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`;
}
function buildContractConsole() {
  return `
import { contracts } from "@/lib/site-data";
import { formatMaybeAddress } from "@/lib/format";
import CopyAddress from "@/components/ui/CopyAddress";
import SectionHeader from "@/components/ui/SectionHeader";

export default function ContractConsole() {
  return (
    <section id="contracts" className="section-shell">
      <SectionHeader
        eyebrow="Contract Console"
        title="No fake addresses. No hidden contract confusion."
        description="The generated website treats contracts like a verification console. Missing addresses are pending, not invented."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {contracts.map((item) => (
          <div key={item.label} className="beast-card rounded-[1.8rem] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.22em] text-white/35">
                  {item.type}
                </div>
                <h3 className="mt-3 text-2xl font-black text-white">{item.label}</h3>
              </div>
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-white/58">
                {item.status}
              </span>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/45 p-4">
              <div className="break-all font-mono text-sm text-white">
                {formatMaybeAddress(item.value)}
              </div>
              {item.value ? <CopyAddress value={item.value} /> : null}
            </div>

            <p className="mt-4 text-sm leading-6 text-white/58">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
`;
}

function buildSecurityCore() {
  return `
import { securityCore } from "@/lib/site-data";
import SectionHeader from "@/components/ui/SectionHeader";

export default function SecurityCore() {
  return (
    <section id="security" className="section-shell">
      <SectionHeader
        eyebrow="Security Core"
        title="A premium Web3 site must show risk before users click."
        description="Security is not decoration. It is part of the page structure: official addresses, wallet awareness, risk language, and launch discipline."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {securityCore.map((item) => (
          <div key={item.title} className="beast-card rounded-[1.6rem] p-6">
            <h3 className="text-xl font-black text-white">{item.title}</h3>
            <p className="mt-4 text-sm leading-6 text-white/60">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
`;
}

function buildRoadmap() {
  return `
import { roadmap } from "@/lib/site-data";
import SectionHeader from "@/components/ui/SectionHeader";

export default function Roadmap() {
  return (
    <section id="roadmap" className="section-shell">
      <SectionHeader
        eyebrow="Roadmap"
        title="A roadmap that looks like execution, not decoration."
        description="The roadmap communicates clear public development stages and avoids fake certainty."
      />

      <div className="grid gap-5">
        {roadmap.map((phase) => (
          <div key={phase.phase} className="beast-card rounded-[1.8rem] p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.22em] text-white/35">
                  {phase.phase}
                </div>
                <h3 className="mt-3 text-3xl font-black text-white">{phase.title}</h3>
              </div>

              <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-black text-white/62">
                {phase.status}
              </span>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {phase.items.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-black/32 p-4 text-sm leading-6 text-white/62">
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

function buildCommunity() {
  return `
import { socials } from "@/lib/site-data";
import SectionHeader from "@/components/ui/SectionHeader";

export default function Community() {
  return (
    <section className="section-shell">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionHeader
          eyebrow="Community"
          title="Official channels only. No fake links."
          description="The website displays provided social channels and marks missing channels as coming soon. This protects the project from fake community links."
        />

        <div className="grid gap-3 md:grid-cols-2">
          {socials.map((link) =>
            link.href ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="beast-card rounded-2xl p-5 font-black text-white transition hover:scale-[1.01]"
              >
                {link.label}
                <div className="mt-2 text-xs font-normal text-white/40">Official link</div>
              </a>
            ) : (
              <div key={link.label} className="rounded-2xl border border-white/10 bg-black/28 p-5 text-white/35">
                <div className="font-black">{link.label}</div>
                <div className="mt-2 text-xs">Coming soon</div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
`;
}

function buildFAQ() {
  return `
import { faq } from "@/lib/site-data";
import SectionHeader from "@/components/ui/SectionHeader";

export default function FAQ() {
  return (
    <section id="faq" className="section-shell">
      <SectionHeader
        eyebrow="FAQ"
        title="Clear answers before users interact."
        description="The FAQ keeps launch status, contract state, risk, and network details clear."
      />

      <div className="grid gap-4">
        {faq.map((item) => (
          <div key={item.question} className="beast-card rounded-[1.5rem] p-6">
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

function buildFinalCTA() {
  return `
import { siteConfig } from "@/lib/site-data";

export default function FinalCTA() {
  return (
    <section className="section-shell">
      <div className="beast-card rounded-[2rem] p-8 text-center md:p-14">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-white/35">
          Final Signal
        </p>
        <h2 className="mx-auto mt-4 max-w-5xl text-4xl font-black leading-tight text-white md:text-6xl">
          {siteConfig.name} is ready to look like a serious Web3 project.
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/60">
          Verify official links, publish real contract addresses only after deployment, and use this interface as a professional launch base.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href="/docs"
            className="rounded-2xl px-6 py-4 text-center font-black text-black"
            style={{ background: siteConfig.secondaryColor }}
          >
            Read Docs
          </a>
          <a
            href="#contracts"
            className="rounded-2xl border border-white/10 bg-white/10 px-6 py-4 text-center font-black text-white"
          >
            Review Contracts
          </a>
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
import { nav, siteConfig, socials } from "@/lib/site-data";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-white/10 bg-black/45">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.1fr_0.8fr_0.8fr] md:px-6">
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
            {nav.map((item) => (
              <a key={item.href} href={item.href} className="text-white/55 hover:text-white">
                {item.label}
              </a>
            ))}
            <Link href="/docs" className="text-white/55 hover:text-white">Docs</Link>
            <Link href="/dashboard" className="text-white/55 hover:text-white">Dashboard</Link>
            <Link href="/security" className="text-white/55 hover:text-white">Security</Link>
            <Link href="/terms" className="text-white/55 hover:text-white">Terms</Link>
            <Link href="/privacy" className="text-white/55 hover:text-white">Privacy</Link>
          </div>
        </div>

        <div>
          <div className="font-black text-white">Social</div>
          <div className="mt-4 grid gap-3">
            {socials.map((link) =>
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

function buildCopyAddress() {
  return `
"use client";

import { useState } from "react";

export default function CopyAddress({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-black text-white/70 transition hover:bg-white/15"
    >
      {copied ? "Copied" : "Copy"}
    </button>
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
`;
}

function buildDocsPage() {
  return `
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { contracts, disclaimer, launchConsole, siteConfig } from "@/lib/site-data";
import { formatMaybeAddress } from "@/lib/format";

export default function DocsPage() {
  return (
    <main>
      <Navbar />
      <section className="section-shell">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-white/38">Docs</p>
        <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight text-white md:text-7xl">
          {siteConfig.name} documentation center.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/60">
          This page explains the project overview, contract references, launch readiness, and user safety reminders.
        </p>

        <div className="mt-10 grid gap-5">
          <div className="beast-card rounded-[1.8rem] p-6">
            <h2 className="text-2xl font-black text-white">Project Overview</h2>
            <p className="mt-3 leading-7 text-white/60">{siteConfig.longDescription}</p>
          </div>

          <div className="beast-card rounded-[1.8rem] p-6">
            <h2 className="text-2xl font-black text-white">Contract References</h2>
            <div className="mt-5 grid gap-3">
              {contracts.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-black/35 p-4">
                  <div className="font-black text-white">{item.label}</div>
                  <div className="mt-2 break-all font-mono text-sm text-white/65">
                    {formatMaybeAddress(item.value)}
                  </div>
                  <p className="mt-2 text-sm text-white/45">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="beast-card rounded-[1.8rem] p-6">
            <h2 className="text-2xl font-black text-white">Launch Steps</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {launchConsole.map((item) => (
                <div key={item.step} className="rounded-2xl border border-white/10 bg-black/35 p-4">
                  <div className="text-white/35">{item.step}</div>
                  <div className="mt-2 font-black text-white">{item.title}</div>
                  <p className="mt-2 text-sm leading-6 text-white/55">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-yellow-300/20 bg-yellow-300/10 p-6">
            <h2 className="text-2xl font-black text-yellow-100">Risk Notes</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {disclaimer.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm leading-6 text-white/70">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
`;
}

function buildSimpleLegalPage(title: string, intro: string, items: string[]) {
  return `
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/site-data";

const items = ${json(items)};

export default function LegalPage() {
  return (
    <main>
      <Navbar />
      <section className="section-shell">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-white/38">{siteConfig.name}</p>
        <h1 className="mt-4 text-5xl font-black text-white md:text-7xl">${title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/60">${intro}</p>

        <div className="mt-10 grid gap-4">
          {items.map((item, index) => (
            <div key={item} className="beast-card rounded-[1.6rem] p-6">
              <div className="text-sm font-black text-white/28">0{index + 1}</div>
              <p className="mt-2 leading-7 text-white/62">{item}</p>
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

function buildDashboardPage() {
  return `
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { commandCards, heroMetrics, siteConfig } from "@/lib/site-data";

export default function DashboardPage() {
  return (
    <main>
      <Navbar />
      <section className="section-shell">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-white/38">Dashboard</p>
        <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight text-white md:text-7xl">
          {siteConfig.name} public command dashboard.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/60">
          A lightweight public dashboard showing project identity, network readiness, wallet layer, and deployment status.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {heroMetrics.map((item) => (
            <div key={item.label} className="beast-card rounded-[1.6rem] p-6">
              <div className="text-xs font-black uppercase tracking-[0.22em] text-white/35">{item.label}</div>
              <div className="mt-3 text-3xl font-black text-white">{item.value}</div>
              <p className="mt-3 text-sm text-white/50">{item.hint}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {commandCards.map((item) => (
            <div key={item.title} className="beast-card rounded-[1.8rem] p-6">
              <h2 className="text-2xl font-black text-white">{item.title}</h2>
              <div className="mt-2 text-white/40">{item.value}</div>
              <p className="mt-4 leading-7 text-white/60">{item.description}</p>
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

function buildSecurityPage() {
  return `
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { disclaimer, securityCore, siteConfig } from "@/lib/site-data";

export default function SecurityPage() {
  return (
    <main>
      <Navbar />
      <section className="section-shell">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-white/38">Security Center</p>
        <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight text-white md:text-7xl">
          {siteConfig.name} security core.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/60">
          A dedicated safety page for wallet awareness, official links, contract verification, and user risk.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {securityCore.map((item) => (
            <div key={item.title} className="beast-card rounded-[1.6rem] p-6">
              <h2 className="text-xl font-black text-white">{item.title}</h2>
              <p className="mt-4 text-sm leading-6 text-white/60">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[1.8rem] border border-yellow-300/20 bg-yellow-300/10 p-6">
          <h2 className="text-2xl font-black text-yellow-100">Important Risk Notes</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {disclaimer.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm leading-6 text-white/70">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
`;
}

function buildLogoSvg(input: WebsiteBuilderInput) {
  const symbol = safeSymbol(input.symbol).slice(0, 3);

  return `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="112" fill="#02040B"/>
  <circle cx="256" cy="256" r="190" fill="${input.primaryColor}" fill-opacity="0.25"/>
  <circle cx="256" cy="256" r="120" fill="${input.secondaryColor}" fill-opacity="0.16"/>
  <path d="M130 320L214 150H302L382 320H304L286 278H224L206 320H130Z" fill="white"/>
  <path d="M244 226L256 198L268 226H244Z" fill="#02040B"/>
  <text x="256" y="394" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="46" font-weight="900" fill="white">${symbol}</text>
</svg>
`;
}

function buildHeroBgSvg(input: WebsiteBuilderInput) {
  return `
<svg width="1600" height="1000" viewBox="0 0 1600 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1600" height="1000" fill="#02040B"/>
  <circle cx="260" cy="180" r="330" fill="${input.primaryColor}" fill-opacity="0.28"/>
  <circle cx="1250" cy="220" r="310" fill="${input.secondaryColor}" fill-opacity="0.16"/>
  <circle cx="770" cy="770" r="430" fill="${input.primaryColor}" fill-opacity="0.10"/>
  <path d="M120 720L530 210L880 790L1290 260" stroke="white" stroke-opacity="0.20" stroke-width="3"/>
  <path d="M200 680L520 360L760 620L1120 310L1420 560" stroke="${input.secondaryColor}" stroke-opacity="0.28" stroke-width="2"/>
</svg>
`;
}

function buildReadme(input: WebsiteBuilderInput) {
  return `
# ${input.projectName} (${safeSymbol(input.symbol)})

Generated by KORAX Website Builder AI — Beast v4 10000+ Lines Mode.

## What this is

A premium Next.js Web3 command-center website package with:

- Cinematic hero
- Wallet connection through RainbowKit
- BNB Chain default configuration
- Command center sections
- Ecosystem radar
- Token universe visual layer
- Launch command center
- Contract console
- Security core
- 50 million-dollar homepage modules
- 40 premium internal pages
- Docs / Terms / Privacy / Dashboard / Security pages
- GitHub and Vercel ready structure

## Setup

npm install

npm run dev

## Wallet

This generated project includes a KORAX default WalletConnect/Reown Project ID baked into app/providers.tsx.

Advanced users can override it with:

NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

## Build

npm run build

## Deploy

Push to GitHub and import into Vercel.

## Safety

Do not publish fake contract addresses.
Do not promise guaranteed returns.
Do not call launch readiness a live presale unless officially confirmed.
Never ask users for seed phrases.
`;
}

function buildEnvExample(input: WebsiteBuilderInput) {
  return `
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=

NEXT_PUBLIC_TOKEN_ADDRESS=${input.tokenAddress}
NEXT_PUBLIC_STAKING_ADDRESS=${input.stakingAddress}
NEXT_PUBLIC_VAULT_ADDRESS=${input.vaultAddress}
NEXT_PUBLIC_LAUNCHPAD_ADDRESS=${input.launchpadAddress}
NEXT_PUBLIC_CHAIN_ID=56
`;
}

function buildConfigFiles(): WebsiteFile[] {
  return [
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
}

const MILLION_DOLLAR_COMPONENTS = [
  "InvestorDeck",
  "LiquidityMatrix",
  "TreasuryVaultPanel",
  "ClaimPortalPreview",
  "AuditControlRoom",
  "LaunchpadGateway",
  "CommunityWarRoom",
  "PartnerConstellation",
  "FounderConsole",
  "MarketSignalDeck",
  "RiskRadar",
  "TokenFlowEngine",
  "ChainOperationsMap",
  "VerificationTerminal",
  "HolderExperienceLab",
  "RevenueModelPreview",
  "EcosystemOrbit",
  "BrandDominanceLayer",
  "MobileExperienceWall",
  "SocialProofEngine",
  "ScarcityControlLayer",
  "LiquidityCommandRoom",
  "SecuritySimulation",
  "GovernanceBridge",
  "DataRoomIndex",
  "PressMediaKit",
  "ConversionEngine",
  "AirdropSafetyLayer",
  "ExchangeReadinessBoard",
  "GrowthMissionBoard",
  "ComplianceSurface",
  "TechnicalArchitecture",
  "FinalWarRoom",
  "PremiumAnalyticsLayer",
  "TokenControlTower",
  "WhaleTrackingPreview",
  "FounderRoadshow",
  "MediaNarrativeGrid",
  "CommunityQuestSystem",
  "EcosystemGrantLayer",
  "PartnerOnboardingHub",
  "ProtocolHealthMonitor",
  "LaunchRiskScanner",
  "SmartContractMap",
  "DocumentationVault",
  "TrustScoreConsole",
  "InvestorStoryline",
  "CyberBrandPortal",
  "TokenUtilityLab",
  "MarketExpansionMap",
] as const;

const MILLION_DOLLAR_PAGES = [
  "investors",
  "liquidity",
  "treasury",
  "claim",
  "audit",
  "launchpad",
  "war-room",
  "partners",
  "founder",
  "market",
  "risk",
  "token-flow",
  "chains",
  "verify",
  "holders",
  "revenue",
  "ecosystem",
  "brand",
  "mobile",
  "social-proof",
  "scarcity",
  "security-simulation",
  "governance",
  "data-room",
  "press",
  "conversion",
  "airdrop-safety",
  "exchange",
  "growth",
  "compliance",
  "architecture",
  "analytics",
  "control-tower",
  "whales",
  "roadshow",
  "media",
  "quests",
  "grants",
  "partner-onboarding",
  "protocol-health",
] as const;

function niceTitleFromKey(value: string) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildMegaPanelData(title: string, index: number) {
  return Array.from({ length: 8 }).map((_, itemIndex) => ({
    label: `${title} Signal ${itemIndex + 1}`,
    value:
      itemIndex % 4 === 0
        ? "Active"
        : itemIndex % 4 === 1
        ? "Prepared"
        : itemIndex % 4 === 2
        ? "Protected"
        : "Expandable",
    description:
      "Premium Web3 projects need visible systems, not empty sections. This block creates a serious interface layer for verification, narrative, trust, growth, and launch execution.",
    metric: 54 + ((index * 7 + itemIndex * 9) % 42),
  }));
}

function buildMegaTimelineData(title: string) {
  return [
    {
      phase: "01",
      title: `${title} Foundation`,
      description:
        "Define the base message, official data, verification path, and public-facing structure before any user interaction.",
    },
    {
      phase: "02",
      title: `${title} Verification`,
      description:
        "Connect official addresses, docs, wallet logic, social channels, and public references without fake claims.",
    },
    {
      phase: "03",
      title: `${title} Activation`,
      description:
        "Prepare community, launch communication, product narrative, risk language, and growth paths.",
    },
    {
      phase: "04",
      title: `${title} Expansion`,
      description:
        "Scale the interface with dashboards, partner layers, investor materials, and ecosystem pages.",
    },
  ];
}

function buildMillionDollarComponent(componentName: string, index: number) {
  const title = niceTitleFromKey(componentName);
  const panels = buildMegaPanelData(title, index);
  const timeline = buildMegaTimelineData(title);

  return `
import { siteConfig } from "@/lib/site-data";

const panels = ${json(panels)} as const;

const timeline = ${json(timeline)} as const;

export default function ${componentName}() {
  return (
    <section className="section-shell">
      <div className="beast-card rounded-[2rem] p-6 md:p-10">
        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-white/35">
              Million Dollar Module ${index + 1}
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight text-white md:text-6xl">
              ${title}
            </h2>

            <p className="mt-5 text-lg leading-8 text-white/60">
              This module makes {siteConfig.name} feel like a funded Web3 infrastructure product. It adds depth, trust, visual weight, execution logic, and a serious command-center experience.
            </p>

            <div className="mt-7 rounded-[1.5rem] border border-white/10 bg-black/35 p-5">
              <div className="text-xs font-black uppercase tracking-[0.22em] text-white/35">
                Strategic Purpose
              </div>
              <p className="mt-3 text-sm leading-7 text-white/60">
                A high-value Web3 website needs more than a hero section. It needs a full operating narrative: investor confidence, contract discipline, launch readiness, community safety, and visible execution systems.
              </p>
            </div>

            <div className="mt-5 grid gap-3">
              {timeline.map((item) => (
                <div
                  key={item.phase}
                  className="rounded-2xl border border-white/10 bg-white/[0.045] p-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black text-black"
                      style={{ background: siteConfig.secondaryColor }}
                    >
                      {item.phase}
                    </div>
                    <div className="font-black text-white">{item.title}</div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/55">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {panels.map((item) => (
              <div
                key={item.label}
                className="rounded-[1.5rem] border border-white/10 bg-black/32 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.2em] text-white/32">
                      {item.label}
                    </div>
                    <div className="mt-3 text-2xl font-black text-white">
                      {item.value}
                    </div>
                  </div>

                  <div className="text-3xl font-black text-white/18">
                    {item.metric}
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-white/55">
                  {item.description}
                </p>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: item.metric + "%",
                      background:
                        "linear-gradient(90deg, " +
                        siteConfig.primaryColor +
                        ", " +
                        siteConfig.secondaryColor +
                        ")",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.045] p-5">
            <div className="text-xs font-black uppercase tracking-[0.22em] text-white/35">
              Trust Impact
            </div>
            <p className="mt-3 text-sm leading-6 text-white/58">
              Shows users that the project is structured, not random.
            </p>
          </div>

          <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.045] p-5">
            <div className="text-xs font-black uppercase tracking-[0.22em] text-white/35">
              Visual Impact
            </div>
            <p className="mt-3 text-sm leading-6 text-white/58">
              Adds premium interface density and command-center depth.
            </p>
          </div>

          <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.045] p-5">
            <div className="text-xs font-black uppercase tracking-[0.22em] text-white/35">
              Business Impact
            </div>
            <p className="mt-3 text-sm leading-6 text-white/58">
              Makes the generated website feel closer to a serious funded product.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
`;
}

function buildMillionDollarIndex() {
  const imports = MILLION_DOLLAR_COMPONENTS.map((name) => {
    return `import ${name} from "@/components/million-dollar/${name}";`;
  }).join("\n");

  const rendered = MILLION_DOLLAR_COMPONENTS.map((name) => {
    return `      <${name} />`;
  }).join("\n");

  return `
${imports}

export default function MillionDollarIndex() {
  return (
    <>
${rendered}
    </>
  );
}
`;
}

function buildMillionDollarPage(route: string, index: number) {
  const title = niceTitleFromKey(route);
  const panels = buildMegaPanelData(title, index);
  const timeline = buildMegaTimelineData(title);

  return `
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/site-data";

const panels = ${json(panels)} as const;

const timeline = ${json(timeline)} as const;

export default function MillionDollarPage() {
  return (
    <main>
      <Navbar />

      <section className="section-shell">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-white/35">
          Premium Page ${index + 1}
        </p>

        <h1 className="mt-4 max-w-5xl text-5xl font-black leading-tight text-white md:text-7xl">
          ${title} command layer.
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/60">
          A dedicated million-dollar style page for {siteConfig.name}. This page expands the project into a serious Web3 product system with premium data panels, launch logic, verification thinking, and investor-grade structure.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {panels.slice(0, 4).map((item) => (
            <div key={item.label} className="beast-card rounded-[1.5rem] p-5">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-white/32">
                {item.label}
              </div>
              <div className="mt-3 text-3xl font-black text-white">
                {item.value}
              </div>
              <p className="mt-3 text-sm leading-6 text-white/55">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {timeline.map((item) => (
            <div key={item.phase} className="rounded-[1.6rem] border border-white/10 bg-white/[0.045] p-6">
              <div className="text-sm font-black text-white/32">{item.phase}</div>
              <h2 className="mt-2 text-2xl font-black text-white">{item.title}</h2>
              <p className="mt-3 leading-7 text-white/58">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 beast-card rounded-[2rem] p-6 md:p-10">
          <h2 className="text-3xl font-black text-white md:text-5xl">
            Why this page exists
          </h2>

          <p className="mt-5 max-w-4xl text-lg leading-8 text-white/60">
            A cheap token website has only a hero, tokenomics, and social links. A serious Web3 project has deep pages that explain the system, safety, positioning, verification, community, launch path, and product direction. This generated page adds that depth.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
`;
}

function buildMillionDollarExpansion(): WebsiteFile[] {
  const componentFiles = MILLION_DOLLAR_COMPONENTS.map((name, index) => {
    return file(
      `components/million-dollar/${name}.tsx`,
      buildMillionDollarComponent(name, index)
    );
  });

  const pageFiles = MILLION_DOLLAR_PAGES.map((route, index) => {
    return file(`app/${route}/page.tsx`, buildMillionDollarPage(route, index));
  });

  return [
    file("components/MillionDollarIndex.tsx", buildMillionDollarIndex()),
    ...componentFiles,
    ...pageFiles,
  ];
}

export function generatePremiumWeb3Website(
  input: WebsiteBuilderInput,
  walletConnectProjectId: string
): GeneratedWebsiteResult {
  const files: WebsiteFile[] = [
    file("package.json", buildPackageJson(input)),
    file("app/layout.tsx", buildLayout()),
    file("app/providers.tsx", buildProviders(walletConnectProjectId)),
    file("app/page.tsx", buildPage()),
    file("app/globals.css", buildGlobalsCss()),

    file("app/docs/page.tsx", buildDocsPage()),
    file(
      "app/terms/page.tsx",
      buildSimpleLegalPage("Terms of Use", "Basic terms for the informational Web3 website.", [
        "This website is provided for informational purposes only.",
        "Users are responsible for verifying contract addresses, official links, and wallet prompts.",
        "No content on this website should be treated as financial, legal, or investment advice.",
        "Third-party wallets, chains, explorers, GitHub, and Vercel are governed by their own terms.",
        "The project may update content, roadmap items, and references as development continues.",
      ])
    ),
    file(
      "app/privacy/page.tsx",
      buildSimpleLegalPage("Privacy Policy", "Basic privacy notes for wallet-aware Web3 websites.", [
        "The website may display public wallet information when a user connects a wallet.",
        "Private keys and seed phrases are never requested by this website.",
        "Wallet providers and infrastructure services may process data under their own policies.",
        "Users should always verify domain names, official links, and wallet prompts.",
      ])
    ),
    file("app/dashboard/page.tsx", buildDashboardPage()),
    file("app/security/page.tsx", buildSecurityPage()),

    file("components/Navbar.tsx", buildNavbar()),
    file("components/Hero.tsx", buildHero()),
    file("components/StatsRibbon.tsx", buildStatsRibbon()),
    file("components/CommandCenter.tsx", buildCommandCenter()),
    file("components/EcosystemRadar.tsx", buildEcosystemRadar()),
    file("components/TokenUniverse.tsx", buildTokenUniverse()),
    file("components/LaunchCommandCenter.tsx", buildLaunchCommandCenter()),
    file("components/ContractConsole.tsx", buildContractConsole()),
    file("components/SecurityCore.tsx", buildSecurityCore()),
    file("components/Roadmap.tsx", buildRoadmap()),
    file("components/Community.tsx", buildCommunity()),
    file("components/FAQ.tsx", buildFAQ()),
    file("components/FinalCTA.tsx", buildFinalCTA()),
    file("components/Footer.tsx", buildFooter()),

    ...buildMillionDollarExpansion(),

    file("components/ui/SectionHeader.tsx", buildSectionHeader()),
    file("components/ui/CopyAddress.tsx", buildCopyAddress()),

    file("lib/site-data.ts", buildSiteData(input)),
    file("lib/format.ts", buildFormat()),

    file("public/logo.svg", buildLogoSvg(input)),
    file("public/hero-bg.svg", buildHeroBgSvg(input)),

    file("README.md", buildReadme(input)),
    file(".env.example", buildEnvExample(input)),
    file("vercel.json", json({ framework: "nextjs" })),
    ...buildConfigFiles(),
  ];

  return {
    websiteName: `${input.projectName} Beast v4 10000+ Lines Website`,
    summary: `A design-first million-dollar style Web3 command center for ${input.projectName}. It includes cinematic hero, command center, ecosystem radar, token universe, launch console, contract console, security core, docs, legal pages, dashboard, wallet connection, 50 premium homepage modules, 40 internal pages, and Vercel-ready files.`,
    brandDirection: {
      positioning: `${input.projectName} is positioned as a serious ${input.category} ecosystem with transparent launch readiness and investor-style presentation.`,
      tone: "Premium, direct, cinematic, technical, safety-aware, investor-style, and product-focused.",
      visualIdentity:
        "Deep black-blue command-center interface with aurora gradients, glass panels, holographic cards, high-density premium modules, and strong launch dashboard energy.",
      trustAngle:
        "The website avoids unrealistic claims and focuses on verified links, contract transparency, wallet safety, documentation, internal pages, and launch discipline.",
    },
    styleGuide: {
      theme: input.websiteStyle,
      primaryColor: input.primaryColor,
      secondaryColor: input.secondaryColor,
      background: input.backgroundStyle,
      cardStyle:
        "Glass command panels, neon gradient indicators, dark cockpit sections, high-density premium modules, and strong visual hierarchy.",
      fontMood: "Heavy, premium, direct, and cinematic.",
      buttonStyle:
        "Large rounded CTAs with high contrast, glow energy, and clear verification actions.",
    },
    sections: [
      {
        name: "Hero",
        purpose: "Create a cinematic first impression.",
        headline: `${input.projectName} is not a landing page. It is a Web3 machine.`,
        description: input.shortDescription,
      },
      {
        name: "Command Center",
        purpose: "Make the project feel like infrastructure.",
        headline: "A premium project cockpit, not a flat homepage.",
        description:
          "Shows launch, wallet, contract, and deployment readiness.",
      },
      {
        name: "Million-Dollar Modules",
        purpose: "Generate depth and high-value website density.",
        headline: "50 premium homepage modules and 40 internal pages.",
        description:
          "Adds investor, liquidity, treasury, audit, launchpad, growth, security, analytics, and ecosystem sections.",
      },
      {
        name: "Contract Console",
        purpose: "Make contract verification obvious.",
        headline: "No fake addresses. No hidden contract confusion.",
        description:
          "Shows official provided addresses and marks missing references as pending.",
      },
    ],
    files,
    deploymentNotes: [
      "Install dependencies with npm install.",
      "Run npm run build before publishing.",
      "Connect Wallet is configured with the KORAX default WalletConnect/Reown Project ID.",
      "Advanced users can override the wallet ID with NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID.",
      "Push to GitHub and import the repository into Vercel.",
      "Verify contract addresses before publishing publicly.",
      "Generated output is intentionally large: 50 premium modules plus 40 internal pages.",
    ],
    koraxPublishingNote:
      "Generated with KORAX Beast v4 10000+ Lines Mode. This template is built for premium Web3 presentation, wallet readiness, GitHub publishing, and Vercel deployment.",
    meta: {
      generationMode: "korax-beast-v4-10000-plus-lines",
      filesGenerated: files.length,
      generatedLines: countGeneratedLines(files),
      quality: "10000-plus-lines-million-dollar-style",
    },
  };
}