"use client";

import Link from "next/link";

const stats = [
  { label: "Presale", value: "Live" },
  { label: "Stage", value: "1 / 5" },
  { label: "Network", value: "BNB Chain" },
  { label: "Supply", value: "100M KRX" },
];

const tools = [
  {
    title: "Presale",
    desc: "Join the live 5-stage KORAX presale through verified on-chain infrastructure.",
    badge: "Live",
    href: "/presale",
    cta: "Enter Presale",
  },
  {
    title: "Claim",
    desc: "Claim purchased KRX after presale completion and claim activation.",
    badge: "After Presale",
    href: "/claim",
    cta: "Open Claim",
  },
  {
    title: "Staking",
    desc: "Lock KRX in fixed reward plans after claim becomes available.",
    badge: "Prepared",
    href: "/staking",
    cta: "View Staking",
  },
  {
    title: "Token Builder AI",
    desc: "Generate project drafts, tokenomics direction, roadmap, visuals, and builder strategy.",
    badge: "Ready",
    href: "/ai",
    cta: "Open AI",
  },
  {
    title: "Launch Your Project",
    desc: "Launchpad infrastructure for future project sales and builder access.",
    badge: "Ready",
    href: "/launch",
    cta: "Open Launch",
  },
  {
    title: "Website Builder AI",
    desc: "AI-powered Web3 website generation for future project creators.",
    badge: "Under Development",
    href: "/website-builder-ai",
    cta: "View Builder",
  },
];

const tokenomics = [
  { label: "Total Supply", value: "100,000,000", note: "Fixed KRX supply" },
  { label: "Presale", value: "50,000,000", note: "Across 5 stages" },
  {
    label: "Staking & Ecosystem",
    value: "50,000,000",
    note: "From fixed supply",
  },
  { label: "Inflation", value: "0%", note: "No future mint inflation" },
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
    title: "Presale",
    desc: "Live 5-stage presale with transparent stage pricing and on-chain tracking.",
  },
  {
    title: "Claim & Staking",
    desc: "Claim opens after presale, followed by fixed-duration KRX staking plans.",
  },
  {
    title: "AI Builder Tools",
    desc: "Token Builder AI, project visuals, and launch preparation tools.",
  },
  {
    title: "Launch Ecosystem",
    desc: "Launchpad access, project creation, Website Builder AI, and ecosystem growth.",
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
    a: "KORAX is a BNB Chain ecosystem built around presale, claim, staking, AI project creation, and launch infrastructure.",
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

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[34px] border border-white/10 bg-black/30 p-6 shadow-[0_30px_110px_rgba(0,0,0,0.55)] backdrop-blur-md sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,255,106,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_30%)]" />

        <div className="relative grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-full border border-[#7CFF6A]/20 bg-[#7CFF6A]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#c4ffbc]">
              KORAX Ecosystem
            </div>

            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              Your path to the top
              <span className="block text-[#7CFF6A]">
                begins with KORAX.
              </span>
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/68 sm:text-lg">
              KORAX is a BNB Chain ecosystem combining presale, claim, staking,
              AI-powered project creation, and launch infrastructure for the next
              generation of Web3 builders.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/presale"
                className="inline-flex items-center justify-center rounded-2xl bg-[#7CFF6A] px-6 py-3 text-sm font-bold text-black shadow-[0_0_38px_rgba(124,255,106,0.22)] transition hover:scale-[1.02] hover:opacity-90"
              >
                Enter Presale
              </Link>

              <Link
                href="/ai"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Open Token Builder AI
              </Link>

              <Link
                href="/docs"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-black/25 px-6 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10 hover:text-white"
              >
                Read Docs
              </Link>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-black/35 p-5 shadow-[0_22px_75px_rgba(0,0,0,0.35)]">
            <div className="grid grid-cols-2 gap-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="text-xs text-white/45">{s.label}</div>
                  <div className="mt-2 text-lg font-extrabold text-white">
                    {s.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-[#7CFF6A]/20 bg-[#7CFF6A]/10 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-white/45">
                Current Presale
              </div>
              <div className="mt-2 text-2xl font-black text-[#c4ffbc]">
                Stage 1 • $0.05
              </div>
              <p className="mt-2 text-sm leading-relaxed text-white/65">
                5 stages ending at $0.13 with planned listing price at $0.15.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <div
            key={tool.title}
            className="group rounded-[26px] border border-white/10 bg-black/25 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.32)] backdrop-blur-md transition hover:-translate-y-1 hover:border-[#7CFF6A]/25 hover:bg-black/35"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-bold text-white">{tool.title}</h3>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-white/70">
                {tool.badge}
              </span>
            </div>

            <p className="mt-3 min-h-[72px] text-sm leading-relaxed text-white/62">
              {tool.desc}
            </p>

            <Link
              href={tool.href}
              className="mt-4 inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#7CFF6A] hover:text-black"
            >
              {tool.cta}
            </Link>
          </div>
        ))}
      </section>

      {/* TOKENOMICS + STAGES */}
      <section className="rounded-[30px] border border-white/10 bg-black/20 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.36)] backdrop-blur-md">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">
              Tokenomics
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
              className="rounded-2xl border border-white/10 bg-black/25 p-5"
            >
              <div className="text-sm text-white/50">{item.label}</div>
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
                "rounded-2xl border p-4",
                index === 0
                  ? "border-[#7CFF6A]/30 bg-[#7CFF6A]/10"
                  : "border-white/10 bg-black/25",
              ].join(" ")}
            >
              <div className="text-sm text-white/50">{item.stage}</div>
              <div
                className={[
                  "mt-2 text-xl font-extrabold",
                  index === 0 ? "text-[#c4ffbc]" : "text-white",
                ].join(" ")}
              >
                {item.price}
              </div>
              <div className="mt-1 text-xs text-white/45">10M KRX</div>
            </div>
          ))}
        </div>
      </section>

      {/* ROADMAP */}
      <section className="rounded-[30px] border border-white/10 bg-black/20 p-6 backdrop-blur-md">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">
              Roadmap
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-white">
              From presale to builder ecosystem.
            </h2>
          </div>

          <Link
            href="/roadmap"
            className="text-sm font-semibold text-[#c4ffbc] hover:text-white"
          >
            View full roadmap →
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {roadmap.map((item, index) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-black/25 p-5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#7CFF6A]/25 bg-[#7CFF6A]/10 text-sm font-bold text-[#c4ffbc]">
                {index + 1}
              </div>
              <h3 className="mt-4 font-bold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            t: "1. Buy",
            d: "Participate in the KRX presale using BNB, USDT, or USDC.",
          },
          {
            t: "2. Claim & Stake",
            d: "Claim tokens after presale completion, then use fixed staking plans.",
          },
          {
            t: "3. Build",
            d: "Use KORAX AI and launch tools as the ecosystem rollout expands.",
          },
        ].map((item) => (
          <div
            key={item.t}
            className="rounded-[26px] border border-white/10 bg-black/25 p-6 backdrop-blur-md"
          >
            <h3 className="text-lg font-bold text-white">{item.t}</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              {item.d}
            </p>
          </div>
        ))}
      </section>

      {/* PARTNERS */}
      <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(0,0,0,0.32))] p-6 shadow-[0_25px_80px_rgba(0,0,0,.45)] backdrop-blur-md">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_32%),radial-gradient(circle_at_bottom,rgba(124,255,106,0.05),transparent_28%)]" />

        <div className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">
              Ecosystem Access
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-white">
              Built for major wallets and BNB Chain users
            </h2>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
            <div className="partners-marquee">
              <div className="partners-track">
                {[...partners, ...partners].map((partner, index) => (
                  <div
                    key={`${partner.name}-${index}`}
                    className="partners-item"
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
        </div>
      </section>

      {/* FAQ */}
      <section className="rounded-[30px] border border-white/10 bg-black/20 p-6 backdrop-blur-md">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">
              FAQ
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
              className="rounded-2xl border border-white/10 bg-black/25 p-5"
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