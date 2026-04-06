export default function RoadmapPage() {
  const phases = [
    {
      phase: "Phase 1",
      title: "Presale Launch",
      points: [
        "Launch of KORAX presale on BNB Smart Chain.",
        "Users can purchase tokens using USDT, USDC, or BNB.",
        "Secure contract deployment and verification on BscScan.",
        "Anti-bot protection enabled to prevent unfair buying behavior.",
      ],
    },
    {
      phase: "Phase 2",
      title: "Presale Completion",
      points: [
        "Presale continues until full allocation is sold.",
        "Real-time tracking of sold tokens and remaining supply.",
        "Whales are allowed to participate without restrictions.",
        "Final stage ends automatically when hard cap is reached.",
      ],
    },
    {
      phase: "Phase 3",
      title: "Claim Activation",
      points: [
        "Claim becomes available only after presale ends.",
        "Users can claim their purchased tokens directly from the contract.",
        "Claim is protected against double execution.",
        "All claim logic is fully on-chain and transparent.",
      ],
    },
    {
      phase: "Phase 4",
      title: "Staking Launch",
      points: [
        "Staking becomes available immediately after claim activation.",
        "Multiple staking plans (1 day to 12 months).",
        "Fixed reward system with no hidden fees.",
        "Users can withdraw tokens after lock period ends.",
      ],
    },
    {
      phase: "Phase 5",
      title: "Exchange Listing",
      points: [
        "KORAX token will be listed on exchanges.",
        "Liquidity will be added for open market trading.",
        "Price discovery begins in the public market.",
        "Initial target listing price above presale levels.",
      ],
    },
    {
      phase: "Phase 6",
      title: "Platform Expansion",
      points: [
        "Launch Your Project feature goes live.",
        "Token Builder AI becomes available.",
        "KORAX evolves into a full launchpad ecosystem.",
        "Support for new projects and creators.",
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-white/10 bg-black/30 p-8 backdrop-blur-md">
        <h1 className="text-3xl font-extrabold text-white">Roadmap</h1>
        <p className="mt-2 max-w-3xl text-white/70">
          KORAX is built in clear phases: presale launch, claim activation,
          staking system, exchange listing, and expansion into a full launchpad ecosystem.
        </p>
      </section>

      <section className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-md">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Development Timeline</h2>
            <p className="mt-1 text-sm text-white/60">
              Clear phases with transparent milestones for the KORAX ecosystem.
            </p>
          </div>

          <div className="text-xs text-white/45">
            Timeline may evolve based on market conditions and technical priorities.
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {phases.map((item, index) => (
            <div
              key={item.phase}
              className="relative rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-white/80">
                    {index + 1}
                  </div>

                  <div>
                    <div className="text-xs uppercase tracking-[0.22em] text-white/50">
                      {item.phase}
                    </div>
                    <h3 className="mt-1 text-lg font-semibold text-white">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/70">
                  Planned
                </span>
              </div>

              <ul className="mt-5 space-y-3 text-sm text-white/70">
                {item.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/40" />
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>

              <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,.05),0_18px_50px_rgba(0,0,0,.35)]" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}