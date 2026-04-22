"use client";

import Link from "next/link";

const stats = [
  { label: "Total Raised", value: "Live" },
  { label: "Participants", value: "Open" },
  { label: "Stage", value: "1 / 5" },
  { label: "Network", value: "BSC" },
];

const featured = [
  {
    title: "Presale Live",
    desc: "Buy KORAX through the live 5-stage presale with transparent pricing, vault-based claim delivery, and on-chain progress tracking.",
    badge: "Live",
    cta: { label: "Enter Presale", href: "/presale" },
  },
  {
    title: "Staking",
    desc: "Staking becomes available after the presale closes. Review the live fixed-reward staking structure and prepare your lock strategy in advance.",
    badge: "After Presale",
    cta: { label: "Open Staking", href: "/staking" },
  },
  {
    title: "Launch your Project",
    desc: "Launch your token through the future KORAX launch infrastructure with creator-focused expansion planned after platform stabilization.",
    badge: "Coming soon",
    cta: { label: "View Roadmap", href: "/roadmap" },
  },
  {
    title: "Token Builder AI",
    desc: "AI-assisted token creation tools and project setup infrastructure are planned as part of the long-term KORAX ecosystem expansion.",
    badge: "Coming soon",
    cta: { label: "See Plan", href: "/roadmap" },
  },
];

const faqs = [
  {
    q: "What is KORAX?",
    a: "KORAX is a launchpad-focused ecosystem built around transparent presale funding, vault-based token claiming, and fixed-plan staking for long-term participation.",
  },
  {
    q: "Is the presale live now?",
    a: "Yes. The KORAX presale is live and runs through 5 stages with fixed token allocations and price increases across stages.",
  },
  {
    q: "Which network does KORAX use?",
    a: "KORAX is currently deployed on BNB Smart Chain (BSC). Future multi-chain expansion may be considered later.",
  },
  {
    q: "When can I claim my purchased tokens?",
    a: "Claim becomes available only after the presale is closed. Once enabled, purchased tokens are released through the claim system.",
  },
  {
    q: "When does staking become available?",
    a: "Staking becomes available after the presale has ended. Users can then lock claimed KORAX tokens into one of the supported fixed-reward plans.",
  },
  {
    q: "Will KORAX support launching other projects?",
    a: "Yes. Platform expansion includes Launch your Project and Token Builder AI after the core presale, claim, staking, and listing phases are completed.",
  },
];

const partners = [
  { name: "MetaMask", logo: "/partners/metamask_wallet.png" },
  { name: "Trust Wallet", logo: "/partners/trust-wallet.png" },
  { name: "BNB Chain", logo: "/partners/bnb-chain.png" },
  { name: "OKX Wallet", logo: "/partners/okx-wallet.png" },
  { name: "Bitget Wallet", logo: "/partners/bitget-wallet.png" },
  { name: "Ledger Live", logo: "/partners/ledger-live.png" },
  { name: "Crypto.com Wallet", logo: "/partners/crypto-com-wallet.png" },
  { name: "Bybit Wallet", logo: "/partners/bybit-wallet.png" },
  { name: "Binance Wallet", logo: "/partners/binance-wallet.png" },
  { name: "KuCoin Web3 Wallet", logo: "/partners/kucoin-web3-wallet.png" },
  { name: "Gate Wallet", logo: "/partners/gate-wallet.png" },
  { name: "Ronin Wallet", logo: "/partners/ronin-wallet.png" },
  { name: "Thor Wallet", logo: "/partners/thor-wallet.png" },
];

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.847h-7.406l-5.8-7.584-6.64 7.584H.47l8.6-9.83L0 1.154h7.594l5.243 6.932L18.9 1.153Zm-1.29 19.494h2.04L6.486 3.248H4.298l13.313 17.399Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.6 1.7-1.6h1.6V4.8c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4.1V11H8v3h2.7v8h2.8Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5Zm8.95 1.35a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 6.85A5.15 5.15 0 1 1 6.85 12 5.16 5.16 0 0 1 12 6.85Zm0 1.8A3.35 3.35 0 1 0 15.35 12 3.35 3.35 0 0 0 12 8.65Z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M21.94 4.66c.28-1.04-.38-1.45-1.27-1.12L2.88 10.48c-1.02.4-1 .97-.18 1.22l4.56 1.42 1.76 5.4c.23.7.12.98.86.98.58 0 .84-.26 1.16-.58l2.22-2.16 4.62 3.41c.85.47 1.46.23 1.67-.79l2.39-14.72ZM8.47 12.8l9.88-6.24c.49-.3.94-.14.57.19l-8.46 7.64-.33 3.61-1.66-5.2Z" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* HERO */}
      <section className="rounded-2xl border border-white/10 bg-black/30 p-6 shadow-[0_0_0_1px_rgba(255,255,255,.06),0_20px_60px_rgba(0,0,0,.45)] backdrop-blur-md">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-white/60">Discover</p>

            <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
              Your Path To Become A Millionaire.
            </h1>

            <p className="mt-3 leading-relaxed text-white/70">
              Build, launch, and grow through KORAX. The ecosystem starts with a
              transparent 5-stage presale, vault-based claiming, and fixed-reward
              staking designed for committed long-term holders.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/presale"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15"
              >
                Enter Presale
              </Link>

              <Link
                href="/docs"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
              >
                View Docs
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-md"
              >
                <div className="text-xs text-white/55">{s.label}</div>
                <div className="mt-1 text-lg font-semibold text-white">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOKENOMICS */}
      <section className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-md">
        <h2 className="text-xl font-bold text-white">Tokenomics</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-black/25 p-5">
            <div className="font-semibold text-white">Total Supply</div>
            <div className="mt-2 text-2xl text-white">100,000,000</div>
            <p className="mt-2 text-sm text-white/60">KORAX tokens</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/25 p-5">
            <div className="font-semibold text-white">Presale Allocation</div>
            <div className="mt-2 text-2xl text-white">50,000,000</div>
            <p className="mt-2 text-sm text-white/60">Sold across 5 stages</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/25 p-5">
            <div className="font-semibold text-white">Staking Rewards</div>
            <div className="mt-2 text-2xl text-white">50,000,000</div>
            <p className="mt-2 text-sm text-white/60">Distributed from supply</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/25 p-5">
            <div className="font-semibold text-white">Inflation</div>
            <div className="mt-2 text-2xl text-white">0%</div>
            <p className="mt-2 text-sm text-white/60">Fixed-supply model</p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="mb-4 font-semibold text-white">Presale Stages</h3>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <div className="rounded-xl border border-white/10 bg-black/25 p-5">
              <div className="font-semibold text-white">Stage 1</div>
              <p className="mt-2 text-sm text-white/60">10,000,000 tokens</p>
              <p className="mt-1 text-white">$0.05</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/25 p-5">
              <div className="font-semibold text-white">Stage 2</div>
              <p className="mt-2 text-sm text-white/60">10,000,000 tokens</p>
              <p className="mt-1 text-white">$0.07</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/25 p-5">
              <div className="font-semibold text-white">Stage 3</div>
              <p className="mt-2 text-sm text-white/60">10,000,000 tokens</p>
              <p className="mt-1 text-white">$0.09</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/25 p-5">
              <div className="font-semibold text-white">Stage 4</div>
              <p className="mt-2 text-sm text-white/60">10,000,000 tokens</p>
              <p className="mt-1 text-white">$0.11</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/25 p-5">
              <div className="font-semibold text-white">Stage 5</div>
              <p className="mt-2 text-sm text-white/60">10,000,000 tokens</p>
              <p className="mt-1 text-white">$0.13</p>
            </div>
          </div>

          <p className="mt-5 text-sm text-white/60">
            Planned listing price: <span className="text-white">$0.15</span>
          </p>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-md">
        <h2 className="text-xl font-bold text-white">Roadmap</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-black/25 p-5">
            <div className="font-semibold text-white">Phase 1 — 5-Stage Presale</div>
            <p className="mt-3 text-sm text-white/60">
              KORAX launches through a 5-stage presale with fixed stage allocations,
              progressive pricing, and transparent on-chain progress.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/25 p-5">
            <div className="font-semibold text-white">Phase 2 — Claim & Staking</div>
            <p className="mt-3 text-sm text-white/60">
              After the presale closes, claim becomes active and staking opens with
              fixed reward plans from short-term to long-term lock periods.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/25 p-5">
            <div className="font-semibold text-white">Phase 3 — Exchange Listing</div>
            <p className="mt-3 text-sm text-white/60">
              KORAX moves into open market trading through exchange listing, with a
              planned listing target of $0.15.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/25 p-5">
            <div className="font-semibold text-white">Phase 4 — Platform Expansion</div>
            <p className="mt-3 text-sm text-white/60">
              Launch your Project and Token Builder AI are introduced after the
              platform is stabilized, tested, and expanded.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED CARDS */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {featured.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-white/10 bg-black/25 p-5 backdrop-blur-md"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="font-semibold text-white">{f.title}</div>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/70">
                {f.badge}
              </span>
            </div>

            <p className="mt-2 text-sm leading-relaxed text-white/65">{f.desc}</p>

            <div className="mt-4">
              <Link
                href={f.cta.href}
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/8 px-3 py-2 text-sm text-white hover:bg-white/12"
              >
                {f.cta.label}
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* PROJECTS */}
      <section className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-md">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">Projects</h2>
          <p className="mt-2 text-sm text-white/60">
            Projects launched through the KORAX ecosystem will appear here.
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/25 p-10 text-center backdrop-blur-md">
            <p className="text-white/60">No projects listed yet.</p>
            <p className="mt-2 text-sm text-white/40">
              Future projects launched through KORAX will appear in this section.
            </p>
          </div>
        </div>
      </section>

      {/* STAKING PLANS */}
      <section className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-md">
        <h2 className="text-xl font-bold text-white">Staking Plans</h2>
        <p className="mt-2 text-sm text-white/60">
          Staking starts after the presale closes and claim becomes available. Supported plans:
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { t: "1 Day", d: "Ultra-short lock with 0.15% fixed reward." },
            { t: "14 Days", d: "Short-term lock with 3.5% reward." },
            { t: "1 Month", d: "Entry fixed plan with 7.5% reward." },
            { t: "3 Months", d: "Balanced plan with 22.5% reward." },
            { t: "6 Months", d: "Longer lock with 45% reward." },
            { t: "9 Months", d: "Premium mid-long plan with 67.5% reward." },
            { t: "12 Months", d: "Maximum lock with 90% reward." },
          ].map((x) => (
            <div key={x.t} className="rounded-2xl border border-white/10 bg-black/25 p-5">
              <div className="font-semibold text-white">{x.t}</div>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-md">
        <h2 className="text-xl font-bold text-white">How it works</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            {
              t: "1) Connect",
              d: "Connect your wallet to access presale, claim, and staking features.",
            },
            {
              t: "2) Buy",
              d: "Buy KORAX during the live presale with BNB, USDT, or USDC.",
            },
            {
              t: "3) Claim / Stake",
              d: "Claim purchased tokens after presale ends, then stake them in a fixed reward plan.",
            },
          ].map((x) => (
            <div key={x.t} className="rounded-2xl border border-white/10 bg-black/25 p-5">
              <div className="font-semibold text-white">{x.t}</div>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PARTNERS */}
      <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(0,0,0,0.32))] p-6 shadow-[0_0_0_1px_rgba(255,255,255,.04),0_25px_80px_rgba(0,0,0,.45)] backdrop-blur-md">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_32%),radial-gradient(circle_at_bottom,rgba(255,255,255,0.04),transparent_28%)]" />

        <div className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">
              Ecosystem Support
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
              Partners
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base">
              KORAX is being built for accessibility across widely recognized wallets,
              infrastructure tools, and ecosystem touchpoints used by crypto communities worldwide.
            </p>
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
      <section className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-md">
        <h2 className="text-xl font-bold text-white">FAQ</h2>
        <div className="mt-4 grid gap-3">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-2xl border border-white/10 bg-black/25 p-5">
              <div className="font-semibold text-white">{f.q}</div>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SOCIAL ICONS ONLY */}
      <section className="py-2">
        <div className="flex items-center justify-center gap-3">
          <a
            href="https://x.com/koraxfund"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="KORAX on X"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <XIcon />
          </a>

          <a
            href="https://www.facebook.com/share/1AwcE12yu9/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="KORAX on Facebook"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <FacebookIcon />
          </a>

          <a
            href="https://www.instagram.com/korax.fund?igsh=MWw2NnE4NTB1aW90cA=="
            target="_blank"
            rel="noopener noreferrer"
            aria-label="KORAX on Instagram"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <InstagramIcon />
          </a>

          <details className="group relative">
            <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:border-white/20 hover:bg-white/10 hover:text-white">
              <TelegramIcon />
            </summary>

            <div className="absolute left-1/2 top-14 z-20 w-44 -translate-x-1/2 rounded-2xl border border-white/10 bg-black/95 p-2 shadow-2xl">
              <a
                href="https://t.me/koraxfund"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                Telegram Channel
              </a>
              <a
                href="https://t.me/koraxgroub"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block rounded-xl px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                Telegram Group
              </a>
            </div>
          </details>
        </div>
      </section>
    </div>
  );
}