export default function RoadmapPage() {
  const phases = [
    {
      phase: "Phase 1",
      title: "Core Infrastructure & Presale",
      status: "Live / Built",
      points: [
        "KORAX presale infrastructure deployed on BNB Smart Chain.",
        "Users can purchase KRX through supported payment flows including BNB, USDT, and USDC where available.",
        "Core contracts are verified on BscScan for transparency and public review.",
        "Presale, claim, vault, and staking architecture designed around transparent on-chain execution.",
      ],
    },
    {
      phase: "Phase 2",
      title: "Claim & Staking System",
      status: "Built",
      points: [
        "Claim system prepared to release purchased KRX after presale completion.",
        "Vault-based token delivery designed to keep claim distribution transparent.",
        "Fixed staking plans designed from short-term locks up to the 12-month plan.",
        "12-month staking is used as the highest commitment level for future ecosystem access.",
      ],
    },
    {
      phase: "Phase 3",
      title: "Flexible Access Infrastructure",
      status: "Upgraded",
      points: [
        "KORAX Access Manager upgraded to support flexible project access requirements.",
        "Project creation access is no longer locked to a permanently fixed hardcoded requirement.",
        "The system can adapt if KRX value increases, helping keep builder access fair and affordable.",
        "Access logic connects staking commitment with project creation slots across the KORAX ecosystem.",
      ],
    },
    {
      phase: "Phase 4",
      title: "Token Builder AI",
      status: "Live",
      points: [
        "KORAX AI can help users shape project ideas, strategy, tokenomics, roadmap, risks, and improvement actions.",
        "AI project visual generation is available for branding direction and early marketing visuals.",
        "Users with eligible KRX staking access can deploy AI-created projects on-chain.",
        "AI deployment creates project token, vault, optional staking contract, and registry entry.",
      ],
    },
    {
      phase: "Phase 5",
      title: "Launch Your Project",
      status: "Live",
      points: [
        "KORAX Launchpad infrastructure is active for project sale creation and participation.",
        "Approved creators can create launch sales using BNB or supported payment tokens.",
        "Participation can be gated through KRX staking access levels.",
        "The launch system supports fairer allocation logic through flexible access and contribution controls.",
      ],
    },
    {
      phase: "Phase 6",
      title: "Website Builder AI",
      status: "Under Development",
      points: [
        "Website Builder AI is currently under development.",
        "The goal is to help users generate Web3 project websites from their project idea and token structure.",
        "Planned outputs include landing page sections, token sections, roadmap, staking areas, and launch information.",
        "Future development may include code generation, preview, export, and GitHub publishing support.",
      ],
    },
    {
      phase: "Phase 7",
      title: "Project Ecosystem Expansion",
      status: "Planned",
      points: [
        "Projects created through KORAX AI and Launchpad can be displayed inside the KORAX ecosystem.",
        "Future project profiles may show token address, vault, staking, launch status, and project metadata.",
        "KORAX aims to become a builder-focused launch ecosystem, not only a single-token presale.",
        "Additional creator tools may be added based on ecosystem demand and technical priorities.",
      ],
    },
    {
      phase: "Phase 8",
      title: "Market Growth & Listings",
      status: "Future Phase",
      points: [
        "Exchange listing and market expansion remain part of the long-term roadmap.",
        "Liquidity planning and public trading will be approached after core ecosystem readiness.",
        "Growth strategy will focus on transparency, verified contracts, real tools, and active builder adoption.",
        "KORAX will continue improving infrastructure based on market conditions, security, and community feedback.",
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-white/10 bg-black/30 p-8 backdrop-blur-md">
        <p className="text-xs uppercase tracking-[0.28em] text-white/45">
          KORAX Roadmap
        </p>

        <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
          Building a Flexible AI & Launch Ecosystem
        </h1>

        <p className="mt-4 max-w-4xl leading-relaxed text-white/70">
          KORAX is evolving from a presale and staking project into a broader
          Web3 creation ecosystem. The current roadmap reflects the latest
          progress: verified contracts, flexible access infrastructure, Token
          Builder AI, Launch Your Project, and the Website Builder AI currently
          under development.
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-4">
          <div className="rounded-2xl border border-[#7CFF6A]/20 bg-[#7CFF6A]/10 p-4">
            <div className="text-xs text-white/45">Core Contracts</div>
            <div className="mt-1 font-semibold text-[#c4ffbc]">Verified</div>
          </div>

          <div className="rounded-2xl border border-[#7CFF6A]/20 bg-[#7CFF6A]/10 p-4">
            <div className="text-xs text-white/45">Token Builder AI</div>
            <div className="mt-1 font-semibold text-[#c4ffbc]">Live</div>
          </div>

          <div className="rounded-2xl border border-[#7CFF6A]/20 bg-[#7CFF6A]/10 p-4">
            <div className="text-xs text-white/45">Launchpad</div>
            <div className="mt-1 font-semibold text-[#c4ffbc]">Live</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="text-xs text-white/45">Website Builder AI</div>
            <div className="mt-1 font-semibold text-white">Under Development</div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-md">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              Development Timeline
            </h2>
            <p className="mt-1 text-sm text-white/60">
              A transparent overview of what has been built, what is live, and
              what is currently under development.
            </p>
          </div>

          <div className="text-xs text-white/45">
            Roadmap may evolve based on security, market conditions, and
            technical priorities.
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {phases.map((item, index) => {
            const active =
              item.status === "Live" ||
              item.status === "Built" ||
              item.status === "Live / Built" ||
              item.status === "Upgraded";

            const developing = item.status === "Under Development";

            return (
              <div
                key={item.phase}
                className={[
                  "relative rounded-2xl border p-6 backdrop-blur-md",
                  active
                    ? "border-[#7CFF6A]/20 bg-[#7CFF6A]/10"
                    : developing
                    ? "border-white/10 bg-white/5"
                    : "border-white/10 bg-black/25",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={[
                        "inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold",
                        active
                          ? "border-[#7CFF6A]/30 bg-[#7CFF6A]/10 text-[#c4ffbc]"
                          : "border-white/10 bg-white/5 text-white/80",
                      ].join(" ")}
                    >
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

                  <span
                    className={[
                      "rounded-full border px-2 py-1 text-[11px]",
                      active
                        ? "border-[#7CFF6A]/20 bg-[#7CFF6A]/10 text-[#c4ffbc]"
                        : developing
                        ? "border-white/10 bg-white/5 text-white/80"
                        : "border-white/10 bg-white/5 text-white/60",
                    ].join(" ")}
                  >
                    {item.status}
                  </span>
                </div>

                <ul className="mt-5 space-y-3 text-sm text-white/70">
                  {item.points.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span
                        className={[
                          "mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full",
                          active ? "bg-[#7CFF6A]/70" : "bg-white/40",
                        ].join(" ")}
                      />
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,.05),0_18px_50px_rgba(0,0,0,.35)]" />
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-[#7CFF6A]/20 bg-[#7CFF6A]/10 p-6 backdrop-blur-md">
        <h2 className="text-xl font-bold text-[#c4ffbc]">
          Why the Infrastructure Was Upgraded
        </h2>

        <p className="mt-3 max-w-4xl text-sm leading-relaxed text-white/75">
          KORAX upgraded its AI and Launch infrastructure to support long-term
          flexibility. Instead of locking builder access into permanently fixed
          requirements, the system is designed to adapt if KRX value changes.
          This helps keep project creation fair, scalable, and accessible for
          real builders while maintaining transparent on-chain logic.
        </p>
      </section>
    </div>
  );
}