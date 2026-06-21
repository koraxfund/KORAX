const phases = [
  {
    phase: "Phase 1",
    title: "Core Infrastructure & Presale",
    status: "Live / Built",
    icon: "💰",
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
    icon: "🎁",
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
    icon: "🔐",
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
    icon: "🤖",
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
    icon: "🚀",
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
    icon: "🌐",
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
    icon: "🧩",
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
    icon: "📈",
    points: [
      "Exchange listing and market expansion remain part of the long-term roadmap.",
      "Liquidity planning and public trading will be approached after core ecosystem readiness.",
      "Growth strategy will focus on transparency, verified contracts, real tools, and active builder adoption.",
      "KORAX will continue improving infrastructure based on market conditions, security, and community feedback.",
    ],
  },
];

const overview = [
  {
    label: "Core Contracts",
    value: "Verified",
    icon: "🛡️",
    tone: "blue",
  },
  {
    label: "Token Builder AI",
    value: "Live",
    icon: "🤖",
    tone: "blue",
  },
  {
    label: "Launchpad",
    value: "Live",
    icon: "🚀",
    tone: "blue",
  },
  {
    label: "Website Builder AI",
    value: "Under Development",
    icon: "🌐",
    tone: "cyan",
  },
];

function RoadmapKoraxLogo() {
  return (
    <div className="roadmap-logo-zone relative flex min-h-[330px] flex-col items-center justify-center overflow-visible bg-transparent">
      <div className="roadmap-logo-glow absolute h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute h-44 w-44 rounded-full bg-cyan-400/10 blur-2xl" />
      <div className="absolute h-28 w-28 rounded-full bg-white/5 blur-2xl" />

      <img
        src="/Korax-logo.png"
        alt="KORAX official logo"
        className="roadmap-logo-spin relative h-48 w-48 bg-transparent object-contain drop-shadow-[0_0_36px_rgba(59,130,246,0.95)] sm:h-56 sm:w-56 lg:h-60 lg:w-60"
      />

      <img
        src="/korax-wordmark.png"
        alt="KORAX wordmark"
        className="roadmap-wordmark-float relative mt-4 h-14 w-auto max-w-[280px] bg-transparent object-contain drop-shadow-[0_0_24px_rgba(59,130,246,0.95)] sm:h-16 sm:max-w-[360px]"
      />

      <div className="roadmap-energy-ring pointer-events-none absolute h-72 w-72 rounded-full border border-blue-400/10" />
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const live =
    status === "Live" ||
    status === "Built" ||
    status === "Live / Built" ||
    status === "Upgraded";

  const development = status === "Under Development";

  return (
    <span
      className={[
        "rounded-full border px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em]",
        live
          ? "border-blue-400/30 bg-blue-500/10 text-blue-100 shadow-[0_0_22px_rgba(59,130,246,0.16)]"
          : development
            ? "border-cyan-300/25 bg-cyan-400/10 text-cyan-100"
            : "border-white/10 bg-white/5 text-white/60",
      ].join(" ")}
    >
      {status}
    </span>
  );
}

export default function RoadmapPage() {
  return (
    <div className="space-y-8">
      <style>{`
        @keyframes roadmapFloat {
          0%, 100% {
            transform: translateY(0) rotateX(0deg) rotateY(0deg);
          }
          50% {
            transform: translateY(-12px) rotateX(3deg) rotateY(-3deg);
          }
        }

        @keyframes roadmapLogoSpin {
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

        @keyframes roadmapWordmarkFloat {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.94;
          }
          50% {
            transform: translateY(-7px) scale(1.02);
            opacity: 1;
          }
        }

        @keyframes roadmapLogoGlow {
          0%, 100% {
            opacity: 0.34;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.16);
          }
        }

        @keyframes roadmapRing {
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

        @keyframes roadmapScan {
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

        @keyframes roadmapShimmer {
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

        .roadmap-hero-3d {
          transform-style: preserve-3d;
          perspective: 1200px;
        }

        .roadmap-float {
          animation: roadmapFloat 6.8s ease-in-out infinite;
          will-change: transform;
          transform-style: preserve-3d;
        }

        .roadmap-logo-zone,
        .roadmap-logo-zone img,
        .roadmap-wordmark-float {
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .roadmap-logo-spin {
          transform-style: preserve-3d;
          animation: roadmapLogoSpin 9s linear infinite;
          will-change: transform;
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .roadmap-wordmark-float {
          animation: roadmapWordmarkFloat 4s ease-in-out infinite;
          will-change: transform;
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .roadmap-logo-glow {
          animation: roadmapLogoGlow 3.6s ease-in-out infinite;
        }

        .roadmap-energy-ring {
          animation: roadmapRing 12s linear infinite;
        }

        .roadmap-scan-line {
          animation: roadmapScan 4s ease-in-out infinite;
        }

        .roadmap-shimmer {
          animation: roadmapShimmer 5s ease-in-out infinite;
        }

        .roadmap-card-3d {
          position: relative;
          transform-style: preserve-3d;
          transition:
            transform 220ms ease,
            border-color 220ms ease,
            background 220ms ease,
            box-shadow 220ms ease;
        }

        .roadmap-card-3d::after {
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

        .roadmap-card-3d:hover {
          transform: translateY(-6px) rotateX(2deg) rotateY(-2deg);
          border-color: rgba(59, 130, 246, 0.42);
          background: rgba(37, 99, 235, 0.075);
          box-shadow: 0 34px 100px rgba(59, 130, 246, 0.16);
        }

        .roadmap-card-3d:hover::after {
          opacity: 1;
        }

        @media (prefers-reduced-motion: reduce) {
          .roadmap-float,
          .roadmap-logo-spin,
          .roadmap-wordmark-float,
          .roadmap-logo-glow,
          .roadmap-energy-ring,
          .roadmap-scan-line,
          .roadmap-shimmer {
            animation: none;
          }

          .roadmap-card-3d:hover {
            transform: none;
          }
        }
      `}</style>

      <section className="roadmap-hero-3d relative overflow-hidden rounded-[38px] border border-white/10 bg-black/35 p-6 shadow-[0_35px_130px_rgba(0,0,0,0.62)] backdrop-blur-md sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.13),transparent_32%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.075] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="roadmap-scan-line pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent" />
        <div className="roadmap-shimmer pointer-events-none absolute left-0 top-0 h-full w-1/4 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

        <div className="relative grid gap-10 lg:grid-cols-[1.06fr_.94fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-blue-100 shadow-[0_0_30px_rgba(59,130,246,0.16)]">
              KORAX Roadmap 🧭
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              Building a flexible
              <span className="block bg-gradient-to-r from-blue-100 via-white to-blue-200 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(59,130,246,0.55)]">
                AI & launch ecosystem.
              </span>
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/68 sm:text-lg">
              KORAX is evolving from a presale and staking project into a broader
              Web3 creation ecosystem. The roadmap reflects verified contracts,
              flexible access infrastructure, Token Builder AI, Launch Your
              Project, and Website Builder AI currently under development.
            </p>

            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {[
                "Verified on-chain infrastructure",
                "AI-powered builder tools",
                "Launchpad and project registry direction",
                "Long-term ecosystem expansion",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-semibold text-white/72 shadow-[0_14px_50px_rgba(0,0,0,0.25)]"
                >
                  <span className="text-blue-100">✦</span> {item}
                </div>
              ))}
            </div>
          </div>

          <div className="roadmap-float relative rounded-[38px] border border-white/10 bg-black/30 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.52)]">
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-blue-500/15 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

            <RoadmapKoraxLogo />

            <div className="mt-4 grid grid-cols-2 gap-3">
              {overview.map((item) => (
                <div
                  key={item.label}
                  className="roadmap-card-3d rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs text-white/45">{item.label}</div>
                    <div className="text-lg">{item.icon}</div>
                  </div>

                  <div
                    className={[
                      "mt-2 text-lg font-extrabold",
                      item.tone === "cyan" ? "text-cyan-100" : "text-blue-100",
                    ].join(" ")}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[34px] border border-white/10 bg-black/20 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.36)] backdrop-blur-md">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-blue-100">
              Development Timeline ⚡
            </p>

            <h2 className="mt-2 text-2xl font-extrabold text-white">
              Built, live, and planned phases.
            </h2>
          </div>

          <div className="max-w-md text-sm text-white/55">
            Roadmap may evolve based on security, market conditions, ecosystem
            priorities, and technical upgrades.
          </div>
        </div>

        <div className="mt-7 grid gap-6 md:grid-cols-2">
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
                  "roadmap-card-3d relative overflow-hidden rounded-[28px] border p-6 backdrop-blur-md",
                  active
                    ? "border-blue-400/25 bg-blue-500/10"
                    : developing
                      ? "border-cyan-300/20 bg-cyan-400/10"
                      : "border-white/10 bg-black/25",
                ].join(" ")}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.08),transparent_34%)]" />

                <div className="relative flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={[
                        "inline-flex h-11 w-11 items-center justify-center rounded-2xl border text-sm font-black shadow-[0_0_24px_rgba(59,130,246,0.12)]",
                        active
                          ? "border-blue-400/30 bg-blue-500/10 text-blue-100"
                          : developing
                            ? "border-cyan-300/25 bg-cyan-400/10 text-cyan-100"
                            : "border-white/10 bg-white/5 text-white/80",
                      ].join(" ")}
                    >
                      {index + 1}
                    </div>

                    <div>
                      <div className="text-xs uppercase tracking-[0.22em] text-white/50">
                        {item.phase}
                      </div>

                      <h3 className="mt-1 text-lg font-bold text-white">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <div className="text-2xl">{item.icon}</div>
                </div>

                <div className="relative mt-4">
                  <StatusPill status={item.status} />
                </div>

                <ul className="relative mt-5 space-y-3 text-sm text-white/70">
                  {item.points.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span
                        className={[
                          "mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full",
                          active
                            ? "bg-blue-300"
                            : developing
                              ? "bg-cyan-200"
                              : "bg-white/40",
                        ].join(" ")}
                      />

                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="pointer-events-none absolute inset-0 rounded-[28px] shadow-[0_0_0_1px_rgba(255,255,255,.05),0_18px_50px_rgba(0,0,0,.35)]" />
              </div>
            );
          })}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[34px] border border-blue-400/20 bg-blue-500/10 p-6 shadow-[0_25px_80px_rgba(0,0,0,.45)] backdrop-blur-md">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.08),transparent_32%)]" />

        <div className="relative">
          <p className="text-xs uppercase tracking-[0.28em] text-blue-100">
            Infrastructure Upgrade 🛡️
          </p>

          <h2 className="mt-2 text-2xl font-extrabold text-white">
            Why the infrastructure was upgraded
          </h2>

          <p className="mt-4 max-w-4xl text-sm leading-relaxed text-white/75">
            KORAX upgraded its AI and Launch infrastructure to support long-term
            flexibility. Instead of locking builder access into permanently
            fixed requirements, the system is designed to adapt if KRX value
            changes. This helps keep project creation fair, scalable, and
            accessible for real builders while maintaining transparent on-chain
            logic.
          </p>
        </div>
      </section>
    </div>
  );
}