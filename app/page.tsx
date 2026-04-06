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

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* HERO */}
      <section className="rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-md shadow-[0_0_0_1px_rgba(255,255,255,.06),0_20px_60px_rgba(0,0,0,.45)]">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-white/60">
              Discover
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
              Your Path To Become A Millionaire.
            </h1>

            <p className="mt-3 text-white/70 leading-relaxed">
              Build, launch, and grow through KORAX. The ecosystem starts with a
              transparent 5-stage presale, vault-based claiming, and fixed-reward
              staking designed for committed long-term holders.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/presale"
                className="inline-flex items-center justify-center rounded-xl bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15 border border-white/10"
              >
                Enter Presale
              </Link>

              <Link
                href="/docs"
                className="inline-flex items-center justify-center rounded-xl bg-white/5 px-4 py-2 text-sm text-white/90 hover:bg-white/10 border border-white/10"
              >
                View Docs
              </Link>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-md"
              >
                <div className="text-xs text-white/55">{s.label}</div>
                <div className="mt-1 text-lg font-semibold text-white">
                  {s.value}
                </div>
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
            <div className="text-white font-semibold">Total Supply</div>
            <div className="mt-2 text-2xl text-white">100,000,000</div>
            <p className="text-white/60 text-sm mt-2">KORAX tokens</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/25 p-5">
            <div className="text-white font-semibold">Presale Allocation</div>
            <div className="mt-2 text-2xl text-white">50,000,000</div>
            <p className="text-white/60 text-sm mt-2">Sold across 5 stages</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/25 p-5">
            <div className="text-white font-semibold">Staking Rewards</div>
            <div className="mt-2 text-2xl text-white">50,000,000</div>
            <p className="text-white/60 text-sm mt-2">Distributed from supply</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/25 p-5">
            <div className="text-white font-semibold">Inflation</div>
            <div className="mt-2 text-2xl text-white">0%</div>
            <p className="text-white/60 text-sm mt-2">Fixed-supply model</p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-white font-semibold mb-4">Presale Stages</h3>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <div className="rounded-xl border border-white/10 bg-black/25 p-5">
              <div className="text-white font-semibold">Stage 1</div>
              <p className="text-white/60 text-sm mt-2">10,000,000 tokens</p>
              <p className="text-white mt-1">$0.05</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/25 p-5">
              <div className="text-white font-semibold">Stage 2</div>
              <p className="text-white/60 text-sm mt-2">10,000,000 tokens</p>
              <p className="text-white mt-1">$0.07</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/25 p-5">
              <div className="text-white font-semibold">Stage 3</div>
              <p className="text-white/60 text-sm mt-2">10,000,000 tokens</p>
              <p className="text-white mt-1">$0.09</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/25 p-5">
              <div className="text-white font-semibold">Stage 4</div>
              <p className="text-white/60 text-sm mt-2">10,000,000 tokens</p>
              <p className="text-white mt-1">$0.11</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/25 p-5">
              <div className="text-white font-semibold">Stage 5</div>
              <p className="text-white/60 text-sm mt-2">10,000,000 tokens</p>
              <p className="text-white mt-1">$0.13</p>
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
            <div className="text-white font-semibold">Phase 1 — 5-Stage Presale</div>
            <p className="text-white/60 text-sm mt-3">
              KORAX launches through a 5-stage presale with fixed stage allocations,
              progressive pricing, and transparent on-chain progress.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/25 p-5">
            <div className="text-white font-semibold">Phase 2 — Claim & Staking</div>
            <p className="text-white/60 text-sm mt-3">
              After the presale closes, claim becomes active and staking opens with
              fixed reward plans from short-term to long-term lock periods.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/25 p-5">
            <div className="text-white font-semibold">Phase 3 — Exchange Listing</div>
            <p className="text-white/60 text-sm mt-3">
              KORAX moves into open market trading through exchange listing, with a
              planned listing target of $0.15.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/25 p-5">
            <div className="text-white font-semibold">Phase 4 — Platform Expansion</div>
            <p className="text-white/60 text-sm mt-3">
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
              <div className="text-white font-semibold">{f.title}</div>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/70">
                {f.badge}
              </span>
            </div>

            <p className="mt-2 text-sm text-white/65 leading-relaxed">{f.desc}</p>

            <div className="mt-4">
              <Link
                href={f.cta.href}
                className="inline-flex items-center justify-center rounded-xl bg-white/8 px-3 py-2 text-sm text-white hover:bg-white/12 border border-white/10"
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
              <div className="text-white font-semibold">{x.t}</div>
              <p className="mt-2 text-sm text-white/65 leading-relaxed">{x.d}</p>
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
              <div className="text-white font-semibold">{x.t}</div>
              <p className="mt-2 text-sm text-white/65 leading-relaxed">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-md">
        <h2 className="text-xl font-bold text-white">FAQ</h2>
        <div className="mt-4 grid gap-3">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-2xl border border-white/10 bg-black/25 p-5">
              <div className="text-white font-semibold">{f.q}</div>
              <p className="mt-2 text-sm text-white/65 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}