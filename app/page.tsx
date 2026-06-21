"use client";

import Link from "next/link";

const stats = [
  { label: "Presale", value: "Live", icon: "🟢" },
  { label: "Stage", value: "1 / 5", icon: "🔥" },
  { label: "Network", value: "BNB Chain", icon: "⚡" },
  { label: "Supply", value: "100M KRX", icon: "💎" },
];

const tools = [
  {
    icon: "💰",
    title: "Presale",
    desc: "Join the live 5-stage KORAX presale through verified on-chain infrastructure.",
    badge: "Live",
    href: "/presale",
    cta: "Enter Presale",
  },
  {
    icon: "🎁",
    title: "Claim",
    desc: "Claim purchased KRX after presale completion and official claim activation.",
    badge: "After Presale",
    href: "/claim",
    cta: "Open Claim",
  },
  {
    icon: "🔒",
    title: "Staking",
    desc: "Lock KRX in fixed reward plans after claim becomes available.",
    badge: "Prepared",
    href: "/staking",
    cta: "View Staking",
  },
  {
    icon: "🤖",
    title: "Token Builder AI",
    desc: "Generate project drafts, tokenomics direction, roadmap, visuals, and builder strategy.",
    badge: "Live",
    href: "/ai",
    cta: "Open AI",
  },
  {
    icon: "🚀",
    title: "Launch Your Project",
    desc: "Launchpad infrastructure for project sales, public registry visibility, and builder access.",
    badge: "Live",
    href: "/launch",
    cta: "Open Launch",
  },
  {
    icon: "🌐",
    title: "Website Builder AI",
    desc: "AI-powered Web3 website generation with premium project structure and deployment-ready output.",
    badge: "Live",
    href: "/website-builder-ai",
    cta: "Open Builder",
  },
];

const tokenomics = [
  {
    label: "Total Supply",
    value: "100,000,000",
    note: "Fixed KRX supply",
    icon: "💎",
  },
  {
    label: "Presale",
    value: "50,000,000",
    note: "Across 5 stages",
    icon: "🔥",
  },
  {
    label: "Staking & Ecosystem",
    value: "50,000,000",
    note: "From fixed supply",
    icon: "🔒",
  },
  {
    label: "Inflation",
    value: "0%",
    note: "No future mint inflation",
    icon: "🛡️",
  },
];

const stages = [
  { stage: "Stage 1", price: "$0.05" },
  { stage: "Stage 2", price: "$0.07" },
  { stage: "Stage 3", price: "$0.09" },
  { stage: "Stage 4", price: "$0.11" },
  { stage: "Stage 5", price: "$0.13" },
];

const roadmap = [
  {
    icon: "💰",
    title: "Presale",
    desc: "Live 5-stage presale with transparent stage pricing and on-chain tracking.",
  },
  {
    icon: "🎁",
    title: "Claim & Staking",
    desc: "Claim opens after presale, followed by fixed-duration KRX staking plans.",
  },
  {
    icon: "🤖",
    title: "AI Builder Tools",
    desc: "Token Builder AI, Website Builder AI, project visuals, and launch preparation tools.",
  },
  {
    icon: "🚀",
    title: "Launch Ecosystem",
    desc: "Launchpad access, project creation, registry visibility, and ecosystem growth.",
  },
];

const partners = [
  { name: "MetaMask", logo: "/partners/metamask_wallet.png" },
  { name: "Trust Wallet", logo: "/partners/trust-wallet.png" },
  { name: "BNB Chain", logo: "/partners/bnb-chain.png" },
  { name: "Binance Wallet", logo: "/partners/binance-wallet.png" },
  { name: "OKX Wallet", logo: "/partners/okx-wallet.png" },
  { name: "Bitget Wallet", logo: "/partners/bitget-wallet.png" },
  { name: "Ledger Live", logo: "/partners/ledger-live.png" },
  { name: "Crypto.com Wallet", logo: "/partners/crypto-com-wallet.png" },
  { name: "Bybit Wallet", logo: "/partners/bybit-wallet.png" },
  { name: "KuCoin Web3 Wallet", logo: "/partners/kucoin-web3-wallet.png" },
  { name: "Gate Wallet", logo: "/partners/gate-wallet.png" },
  { name: "Ronin Wallet", logo: "/partners/ronin-wallet.png" },
];

const faqs = [
  {
    q: "What is KORAX?",
    a: "KORAX is a BNB Chain ecosystem built around presale, claim, staking, AI project creation, Website Builder AI, Token Builder AI, and launch infrastructure.",
  },
  {
    q: "Is the presale live?",
    a: "Yes. KORAX uses a 5-stage presale model with progressive pricing from $0.05 to $0.13.",
  },
  {
    q: "When can users claim KRX?",
    a: "Claim becomes available after the presale is completed and claim is officially enabled.",
  },
  {
    q: "What is Token Builder AI?",
    a: "It helps users generate project drafts, tokenomics direction, roadmap, risks, visuals, and builder strategy.",
  },
];

const highlights = [
  "AI-powered builder ecosystem",
  "On-chain project registry",
  "Presale, claim, staking and launch tools",
  "Built for serious Web3 project creation",
];

function Badge({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-blue-400/25 bg-blue-500/10 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-blue-100 shadow-[0_0_20px_rgba(59,130,246,0.16)]">
      {children}
    </span>
  );
}

function HeroKoraxLogo() {
  return (
    <div className="home-logo-zone relative flex min-h-[330px] flex-col items-center justify-center overflow-visible bg-transparent">
      <div className="home-logo-glow absolute h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute h-44 w-44 rounded-full bg-cyan-400/10 blur-2xl" />
      <div className="absolute h-28 w-28 rounded-full bg-white/5 blur-2xl" />

      <img
        src="/Korax-logo.png"
        alt="KORAX official logo"
        className="home-logo-spin relative h-48 w-48 bg-transparent object-contain drop-shadow-[0_0_36px_rgba(59,130,246,0.95)] sm:h-56 sm:w-56 lg:h-60 lg:w-60"
      />

      <img
        src="/korax-wordmark.png"
        alt="KORAX wordmark"
        className="home-wordmark-float relative mt-4 h-14 w-auto max-w-[280px] bg-transparent object-contain drop-shadow-[0_0_24px_rgba(59,130,246,0.95)] sm:h-16 sm:max-w-[360px]"
      />

      <div className="home-energy-ring pointer-events-none absolute h-72 w-72 rounded-full border border-blue-400/10" />
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-8">
      <style>{`
        @keyframes homeFloat {
          0%, 100% {
            transform: translateY(0) rotateX(0deg) rotateY(0deg);
          }
          50% {
            transform: translateY(-12px) rotateX(3deg) rotateY(-3deg);
          }
        }

        @keyframes homeLogoSpin {
          0% {
            transform: rotateY(0deg) rotateX(0deg) translateY(0) scale(1);
          }
          50% {
            transform: rotateY(180deg) rotateX(7deg) translateY(-5px) scale(1.045);
          }
          100% {
            transform: rotateY(360deg) rotateX(0deg) translateY(0) scale(1);
          }
        }

        @keyframes homeWordmarkFloat {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.94;
          }
          50% {
            transform: translateY(-7px) scale(1.02);
            opacity: 1;
          }
        }

        @keyframes homeLogoGlow {
          0%, 100% {
            opacity: 0.34;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.16);
          }
        }

        @keyframes homeRing {
          0% {
            transform: rotate(0deg) scale(1);
            opacity: 0.22;
          }
          50% {
            transform: rotate(180deg) scale(1.04);
            opacity: 0.48;
          }
          100% {
            transform: rotate(360deg) scale(1);
            opacity: 0.22;
          }
        }

        @keyframes homeScan {
          0% {
            transform: translateX(-120%);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateX(120%);
            opacity: 0;
          }
        }

        @keyframes homeMarquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes homeShimmer {
          0% {
            transform: translateX(-120%);
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translateX(120%);
            opacity: 0;
          }
        }

        .home-hero-3d {
          transform-style: preserve-3d;
          perspective: 1200px;
        }

        .home-card-3d {
          position: relative;
          transform-style: preserve-3d;
          transition:
            transform 220ms ease,
            border-color 220ms ease,
            background 220ms ease,
            box-shadow 220ms ease;
        }

        .home-card-3d::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: inherit;
          background: linear-gradient(
            120deg,
            transparent,
            rgba(59, 130, 246, 0.08),
            transparent
          );
          opacity: 0;
          transition: opacity 220ms ease;
        }

        .home-card-3d:hover {
          transform: translateY(-7px) rotateX(2deg) rotateY(-2deg);
          border-color: rgba(59, 130, 246, 0.42);
          background: rgba(37, 99, 235, 0.075);
          box-shadow: 0 34px 100px rgba(59, 130, 246, 0.16);
        }

        .home-card-3d:hover::after {
          opacity: 1;
        }

        .home-float {
          animation: homeFloat 6.8s ease-in-out infinite;
          will-change: transform;
        }

        .home-logo-zone,
        .home-logo-zone img,
        .home-wordmark-float {
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .home-logo-spin {
          transform-style: preserve-3d;
          animation: homeLogoSpin 9s linear infinite;
          will-change: transform;
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .home-wordmark-float {
          animation: homeWordmarkFloat 4s ease-in-out infinite;
          will-change: transform;
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .home-logo-glow {
          animation: homeLogoGlow 3.6s ease-in-out infinite;
        }

        .home-energy-ring {
          animation: homeRing 12s linear infinite;
        }

        .home-scan-line {
          animation: homeScan 4s ease-in-out infinite;
        }

        .home-shimmer {
          animation: homeShimmer 5s ease-in-out infinite;
        }

        .home-marquee {
          overflow: hidden;
        }

        .home-track {
          display: flex;
          width: max-content;
          animation: homeMarquee 34s linear infinite;
        }

        .home-marquee:hover .home-track {
          animation-play-state: paused;
        }

        .home-partner-item {
          display: flex;
          min-width: max-content;
          align-items: center;
          gap: 12px;
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          padding: 18px 28px;
        }

        @media (prefers-reduced-motion: reduce) {
          .home-float,
          .home-logo-spin,
          .home-wordmark-float,
          .home-logo-glow,
          .home-energy-ring,
          .home-scan-line,
          .home-shimmer,
          .home-track {
            animation: none;
          }

          .home-card-3d:hover {
            transform: none;
          }
        }
      `}</style>

      <section className="home-hero-3d relative overflow-hidden rounded-[38px] border border-white/10 bg-black/35 p-6 shadow-[0_35px_130px_rgba(0,0,0,0.62)] backdrop-blur-md sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.13),transparent_32%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.075] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="home-scan-line pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent" />
        <div className="home-shimmer pointer-events-none absolute left-0 top-0 h-full w-1/4 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

        <div className="relative grid gap-10 lg:grid-cols-[1.06fr_.94fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-blue-100 shadow-[0_0_30px_rgba(59,130,246,0.16)]">
              KORAX Ecosystem ⚡
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              Your path to the top
              <span className="block bg-gradient-to-r from-blue-100 via-white to-blue-200 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(59,130,246,0.55)]">
                begins with KORAX.
              </span>
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/68 sm:text-lg">
              KORAX is a BNB Chain ecosystem combining presale, claim, staking,
              Token Builder AI, Website Builder AI, public project registry, and
              launch infrastructure for the next generation of Web3 builders.
            </p>

            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-semibold text-white/72 shadow-[0_14px_50px_rgba(0,0,0,0.25)]"
                >
                  <span className="text-blue-100">✦</span> {item}
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/presale"
                className="inline-flex items-center justify-center rounded-2xl bg-blue-500 px-6 py-3 text-sm font-black text-white shadow-[0_0_38px_rgba(59,130,246,0.35)] transition hover:scale-[1.02] hover:bg-blue-400"
              >
                Enter Presale 💰
              </Link>

              <Link
                href="/ai"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-blue-400/35 hover:bg-blue-500/10"
              >
                Open Token Builder AI 🤖
              </Link>

              <Link
                href="/docs"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-black/25 px-6 py-3 text-sm font-semibold text-white/85 transition hover:border-blue-400/35 hover:bg-white/10 hover:text-white"
              >
                Read Docs 📘
              </Link>
            </div>
          </div>

          <div className="home-float relative rounded-[38px] border border-white/10 bg-black/30 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.52)]">
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-blue-500/15 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

            <HeroKoraxLogo />

            <div className="mt-4 grid grid-cols-2 gap-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="home-card-3d rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs text-white/45">{s.label}</div>
                    <div className="text-lg">{s.icon}</div>
                  </div>

                  <div className="mt-2 text-lg font-extrabold text-white">
                    {s.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4 shadow-[0_0_38px_rgba(59,130,246,0.10)]">
              <div className="text-xs uppercase tracking-[0.22em] text-white/45">
                Current Presale
              </div>

              <div className="mt-2 text-2xl font-black text-blue-100">
                Stage 1 • $0.05 🔥
              </div>

              <p className="mt-2 text-sm leading-relaxed text-white/65">
                5 stages ending at $0.13 with planned listing price at $0.15.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <div
            key={tool.title}
            className="home-card-3d group rounded-[28px] border border-white/10 bg-black/25 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.32)] backdrop-blur-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-3xl">{tool.icon}</div>
                <h3 className="mt-3 text-lg font-bold text-white">
                  {tool.title}
                </h3>
              </div>

              <Badge>{tool.badge}</Badge>
            </div>

            <p className="mt-3 min-h-[72px] text-sm leading-relaxed text-white/62">
              {tool.desc}
            </p>

            <Link
              href={tool.href}
              className="mt-4 inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-blue-400/35 hover:bg-blue-500 hover:text-white"
            >
              {tool.cta} →
            </Link>
          </div>
        ))}
      </section>

      <section className="rounded-[34px] border border-white/10 bg-black/20 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.36)] backdrop-blur-md">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-blue-100">
              Tokenomics 💎
            </p>

            <h2 className="mt-2 text-2xl font-extrabold text-white">
              Fixed supply. Clear allocation.
            </h2>
          </div>

          <div className="text-sm text-white/55">
            Planned listing price:{" "}
            <span className="font-semibold text-white">$0.15</span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {tokenomics.map((item) => (
            <div
              key={item.label}
              className="home-card-3d rounded-2xl border border-white/10 bg-black/25 p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm text-white/50">{item.label}</div>
                <div className="text-2xl">{item.icon}</div>
              </div>

              <div className="mt-2 text-2xl font-extrabold text-white">
                {item.value}
              </div>

              <p className="mt-2 text-sm text-white/55">{item.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-5">
          {stages.map((item, index) => (
            <div
              key={item.stage}
              className={[
                "home-card-3d rounded-2xl border p-4",
                index === 0
                  ? "border-blue-400/30 bg-blue-500/10"
                  : "border-white/10 bg-black/25",
              ].join(" ")}
            >
              <div className="text-sm text-white/50">{item.stage}</div>

              <div
                className={[
                  "mt-2 text-xl font-extrabold",
                  index === 0 ? "text-blue-100" : "text-white",
                ].join(" ")}
              >
                {item.price}
              </div>

              <div className="mt-1 text-xs text-white/45">10M KRX</div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[34px] border border-white/10 bg-black/20 p-6 backdrop-blur-md">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-blue-100">
              Roadmap 🚀
            </p>

            <h2 className="mt-2 text-2xl font-extrabold text-white">
              From presale to builder ecosystem.
            </h2>
          </div>

          <Link
            href="/roadmap"
            className="text-sm font-semibold text-blue-100 hover:text-white"
          >
            View full roadmap →
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {roadmap.map((item, index) => (
            <div
              key={item.title}
              className="home-card-3d rounded-2xl border border-white/10 bg-black/25 p-5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-blue-400/25 bg-blue-500/10 text-xl font-bold text-blue-100">
                {item.icon}
              </div>

              <div className="mt-4 text-xs uppercase tracking-[0.22em] text-white/40">
                Step {index + 1}
              </div>

              <h3 className="mt-2 font-bold text-white">{item.title}</h3>

              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            t: "1. Buy 💰",
            d: "Participate in the KRX presale using BNB, USDT, or USDC.",
          },
          {
            t: "2. Claim & Stake 🔒",
            d: "Claim tokens after presale completion, then use fixed staking plans.",
          },
          {
            t: "3. Build 🚀",
            d: "Use KORAX AI, Website Builder AI, registry tools, and launch infrastructure.",
          },
        ].map((item) => (
          <div
            key={item.t}
            className="home-card-3d rounded-[28px] border border-white/10 bg-black/25 p-6 backdrop-blur-md"
          >
            <h3 className="text-lg font-bold text-white">{item.t}</h3>

            <p className="mt-3 text-sm leading-relaxed text-white/60">
              {item.d}
            </p>
          </div>
        ))}
      </section>

      <section className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(0,0,0,0.32))] p-6 shadow-[0_25px_80px_rgba(0,0,0,.45)] backdrop-blur-md">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.10),transparent_32%),radial-gradient(circle_at_bottom,rgba(14,165,233,0.06),transparent_28%)]" />

        <div className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-blue-100">
              Ecosystem Access 🔗
            </p>

            <h2 className="mt-2 text-2xl font-extrabold text-white">
              Built for major wallets and BNB Chain users
            </h2>
          </div>

          <div className="home-marquee mt-8 rounded-2xl border border-white/10 bg-black/20">
            <div className="home-track">
              {[...partners, ...partners].map((partner, index) => (
                <div
                  key={`${partner.name}-${index}`}
                  className="home-partner-item"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-10 w-auto object-contain opacity-95"
                  />

                  <span className="whitespace-nowrap text-sm font-medium text-white/85">
                    {partner.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[34px] border border-white/10 bg-black/20 p-6 backdrop-blur-md">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-blue-100">
              FAQ ❓
            </p>

            <h2 className="mt-2 text-2xl font-extrabold text-white">
              Key questions
            </h2>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {faqs.map((f) => (
            <div
              key={f.q}
              className="home-card-3d rounded-2xl border border-white/10 bg-black/25 p-5"
            >
              <h3 className="font-bold text-white">{f.q}</h3>

              <p className="mt-2 text-sm leading-relaxed text-white/62">
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}