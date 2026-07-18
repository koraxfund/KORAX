import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "KORAX Roadmap | Development & Ecosystem Progress",
  description:
    "Explore the official KORAX roadmap covering the KRX presale, claim, staking, 1,500 KRX builder access, Token Builder AI, Website Builder AI, project registry, launch infrastructure, and future ecosystem expansion.",
  alternates: {
    canonical: "/roadmap",
  },
  openGraph: {
    title: "KORAX Development Roadmap",
    description:
      "Track the progress of the KORAX BNB Chain builder ecosystem, from the KRX presale to AI-powered Web3 project creation and launch infrastructure.",
    url: "https://www.korax.fund/roadmap",
    images: [
      {
        url: "/Korax-logo.png",
        width: 1200,
        height: 630,
        alt: "KORAX Roadmap",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KORAX Development Roadmap",
    description:
      "KRX presale, staking, builder access, Token Builder AI, Website Builder AI, launch infrastructure, and ecosystem expansion.",
    images: ["/Korax-logo.png"],
  },
};

type PhaseStatus =
  | "Live"
  | "Prepared"
  | "Upgraded"
  | "Expanding"
  | "Planned";

type PhaseTone = "blue" | "cyan" | "slate" | "amber";

type PhaseItem = {
  phase: string;
  number: string;
  title: string;
  shortTitle: string;
  status: PhaseStatus;
  tone: PhaseTone;
  summary: string;
  points: string[];
  href?: string;
  cta?: string;
};

const phases: PhaseItem[] = [
  {
    phase: "Phase 1",
    number: "01",
    title: "Core Infrastructure & KRX Presale",
    shortTitle: "Presale",
    status: "Live",
    tone: "cyan",
    summary:
      "The foundational KORAX token and presale infrastructure is active on BNB Chain.",
    points: [
      "KRX presale infrastructure deployed for BNB Smart Chain participation.",
      "Five presale stages with progressive pricing from $0.05 to $0.13.",
      "Support for BNB, USDT, and USDC participation where configured.",
      "Presale purchases are recorded on-chain for the participating wallet.",
      "Core infrastructure is separated across token, presale, vault, claim, and staking systems.",
    ],
    href: "/presale",
    cta: "Open Presale",
  },
  {
    phase: "Phase 2",
    number: "02",
    title: "Claim & Staking Infrastructure",
    shortTitle: "Claim & Staking",
    status: "Prepared",
    tone: "blue",
    summary:
      "Claim and staking systems are prepared for activation after the KRX presale lifecycle reaches the required stage.",
    points: [
      "Purchased KRX is prepared for release after presale completion and claim activation.",
      "Claim infrastructure reads purchased, claimed, claimable, and vested balances on-chain.",
      "The vesting structure supports four scheduled 25% releases.",
      "Seven fixed-duration KRX staking plans are prepared.",
      "Staking rewards are distributed from the fixed ecosystem allocation rather than unlimited inflationary minting.",
    ],
    href: "/claim",
    cta: "View Claim Portal",
  },
  {
    phase: "Phase 3",
    number: "03",
    title: "Flexible Access Manager",
    shortTitle: "Access Manager",
    status: "Upgraded",
    tone: "cyan",
    summary:
      "KORAX builder access is controlled through flexible on-chain requirements connected with eligible long-term staking.",
    points: [
      "The Access Manager supports adjustable project-slot requirements.",
      "Builder access is not permanently locked to an unchangeable hardcoded token amount.",
      "The current project-slot requirement is 1,500 KRX.",
      "The qualifying staking commitment uses the 12-month plan.",
      "One eligible 1,500 KRX stake provides one project slot according to deployed contract logic.",
    ],
    href: "/staking",
    cta: "View Access Requirements",
  },
  {
    phase: "Phase 4",
    number: "04",
    title: "Token Builder AI",
    shortTitle: "Token Builder AI",
    status: "Live",
    tone: "blue",
    summary:
      "The KORAX AI builder transforms project ideas into structured Web3 project and token foundations.",
    points: [
      "AI-assisted project positioning, market analysis, utility direction, and project verdict.",
      "Tokenomics suggestions, staking direction, launch logic, roadmap, and risk analysis.",
      "AI project visual generation for branding and marketing direction.",
      "Flexible token configuration including supply, mintability, burnability, and staking settings.",
      "Eligible builders can deploy project token, vault, optional staking contract, and project records on-chain.",
    ],
    href: "/ai",
    cta: "Open Token Builder AI",
  },
  {
    phase: "Phase 5",
    number: "05",
    title: "Launch Your Project",
    shortTitle: "Launch",
    status: "Live",
    tone: "blue",
    summary:
      "KORAX launch infrastructure supports project creation, launch preparation, participation logic, and public project presentation.",
    points: [
      "Eligible creators can prepare projects through KORAX launch infrastructure.",
      "Launch configuration can include supported payment assets and contribution controls.",
      "Project participation can connect with KRX access requirements.",
      "Public project information can be linked with KORAX registry infrastructure.",
      "Launch workflows are designed to connect project creation with later claim and ecosystem visibility.",
    ],
    href: "/launch",
    cta: "Open Launch",
  },
  {
    phase: "Phase 6",
    number: "06",
    title: "Website Builder AI",
    shortTitle: "Website Builder AI",
    status: "Live",
    tone: "blue",
    summary:
      "Website Builder AI creates structured Web3 project websites from token, roadmap, staking, launch, and branding data.",
    points: [
      "Web3 website generation is available through the KORAX builder ecosystem.",
      "Projects can generate hero sections, tokenomics, roadmap, utility, staking, and launch content.",
      "Generated output can include deployment-ready project files.",
      "Website data can connect with projects created through Token Builder AI.",
      "GitHub publishing and project export workflows support faster deployment preparation.",
    ],
    href: "/website-builder-ai",
    cta: "Open Website Builder AI",
  },
  {
    phase: "Phase 7",
    number: "07",
    title: "Project Registry & Ecosystem Expansion",
    shortTitle: "Registry Expansion",
    status: "Expanding",
    tone: "cyan",
    summary:
      "KORAX is expanding from individual builder tools into a connected public ecosystem for created and launched projects.",
    points: [
      "Projects created through KORAX can connect with public registry infrastructure.",
      "Project profiles can present token, vault, staking, owner, launch, and metadata information.",
      "Registry visibility helps users discover projects created through the KORAX ecosystem.",
      "Token Builder AI, Website Builder AI, Launch, and Registry data are being connected into one workflow.",
      "Additional builder and discovery modules can be introduced as ecosystem usage grows.",
    ],
    href: "/launch",
    cta: "Explore Projects",
  },
  {
    phase: "Phase 8",
    number: "08",
    title: "Market Growth, Liquidity & Listings",
    shortTitle: "Market Expansion",
    status: "Planned",
    tone: "slate",
    summary:
      "Long-term market growth will follow infrastructure readiness, security, ecosystem adoption, and responsible liquidity preparation.",
    points: [
      "Liquidity and public trading preparation remain part of the long-term roadmap.",
      "Exchange listings are future objectives and are not guaranteed.",
      "Growth will focus on real ecosystem tools and builder adoption rather than only token promotion.",
      "Market expansion will consider security, regulation, liquidity, and community development.",
      "Infrastructure will continue to evolve according to technical priorities and ecosystem demand.",
    ],
  },
];

const overviewItems = [
  {
    label: "Presale",
    value: "Live",
    tone: "cyan" as PhaseTone,
  },
  {
    label: "Token Builder AI",
    value: "Live",
    tone: "blue" as PhaseTone,
  },
  {
    label: "Website Builder AI",
    value: "Live",
    tone: "blue" as PhaseTone,
  },
  {
    label: "Launch Infrastructure",
    value: "Live",
    tone: "blue" as PhaseTone,
  },
  {
    label: "Access Requirement",
    value: "1,500 KRX",
    tone: "cyan" as PhaseTone,
  },
  {
    label: "Primary Network",
    value: "BNB Chain",
    tone: "blue" as PhaseTone,
  },
];

const milestones = [
  {
    number: "01",
    title: "Foundation",
    description:
      "Token, presale, claim, staking, vault, and access infrastructure.",
    status: "Established",
  },
  {
    number: "02",
    title: "Creation",
    description:
      "AI project strategy, token deployment, visuals, and website generation.",
    status: "Live",
  },
  {
    number: "03",
    title: "Launch",
    description:
      "Project registry, public presentation, contribution, and launch systems.",
    status: "Live",
  },
  {
    number: "04",
    title: "Expansion",
    description:
      "Project discovery, ecosystem adoption, liquidity, and market growth.",
    status: "In Progress",
  },
];

const currentAchievements = [
  "Five-stage KRX presale infrastructure",
  "Verified and separated contract architecture",
  "Flexible Access Manager implementation",
  "1,500 KRX project-slot requirement",
  "Token Builder AI project workflow",
  "AI visual generation",
  "On-chain AI project deployment",
  "Website Builder AI",
  "GitHub-ready website export",
  "Launch and registry infrastructure",
];

const nextPriorities = [
  {
    number: "01",
    title: "Complete ecosystem connection",
    description:
      "Connect builder, website, registry, launch, and public project data through a more unified user workflow.",
  },
  {
    number: "02",
    title: "Improve mobile performance",
    description:
      "Reduce heavy animations and processing overhead for builder tools on mobile devices.",
  },
  {
    number: "03",
    title: "Expand project discovery",
    description:
      "Strengthen public project profiles, launch discovery, and registry visibility.",
  },
  {
    number: "04",
    title: "Security preparation",
    description:
      "Continue contract testing, production reviews, deployment verification, and public transparency.",
  },
  {
    number: "05",
    title: "Presale completion workflow",
    description:
      "Prepare final claim activation, staking availability, and ecosystem access after presale completion.",
  },
  {
    number: "06",
    title: "Market development",
    description:
      "Approach liquidity, listings, partnerships, and market expansion after core ecosystem readiness.",
  },
];

function StatusPill({
  status,
  tone,
}: {
  status: string;
  tone: PhaseTone;
}) {
  const styles: Record<PhaseTone, string> = {
    blue:
      "border-blue-400/25 bg-blue-500/10 text-blue-100 shadow-[0_0_22px_rgba(59,130,246,0.12)]",
    cyan:
      "border-cyan-300/25 bg-cyan-400/10 text-cyan-100 shadow-[0_0_22px_rgba(34,211,238,0.10)]",
    slate: "border-white/10 bg-white/[0.045] text-white/50",
    amber:
      "border-amber-300/20 bg-amber-300/[0.06] text-amber-100/80",
  };

  return (
    <span
      className={[
        "inline-flex rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em]",
        styles[tone],
      ].join(" ")}
    >
      {status}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  right,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-4xl">
        <div className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.29em] text-blue-100">
          <span className="h-px w-9 bg-blue-400/70" />
          {eyebrow}
        </div>

        <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.025em] text-white sm:text-4xl">
          {title}
        </h2>

        {description ? (
          <p className="mt-4 max-w-3xl text-sm leading-8 text-white/57 sm:text-base">
            {description}
          </p>
        ) : null}
      </div>

      {right}
    </div>
  );
}

function RoadmapLogoVisual() {
  return (
    <div className="roadmap-command-core relative min-h-[520px] overflow-hidden rounded-[36px] border border-white/10 bg-[#020611] shadow-[0_35px_120px_rgba(0,0,0,0.62)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.28),transparent_32%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.13),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.10),transparent_36%)]" />

      <div className="roadmap-core-grid pointer-events-none absolute inset-0 opacity-[0.075] [background-image:linear-gradient(rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="roadmap-orbit roadmap-orbit-one pointer-events-none absolute left-1/2 top-[43%] h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/15" />

      <div className="roadmap-orbit roadmap-orbit-two pointer-events-none absolute left-1/2 top-[43%] h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />

      <div className="roadmap-orbit roadmap-orbit-three pointer-events-none absolute left-1/2 top-[43%] h-[212px] w-[212px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />

      <div className="roadmap-logo-glow pointer-events-none absolute left-1/2 top-[43%] h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/25 blur-3xl" />

      <div className="absolute left-1/2 top-[43%] z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <Image
          src="/Korax-logo.png"
          alt="KORAX official logo"
          width={420}
          height={420}
          priority
          draggable={false}
          className="roadmap-logo-spin h-44 w-44 bg-transparent object-contain drop-shadow-[0_0_44px_rgba(59,130,246,0.95)] sm:h-52 sm:w-52"
        />

        <Image
          src="/korax-wordmark.png"
          alt="KORAX"
          width={520}
          height={150}
          priority
          draggable={false}
          className="roadmap-wordmark-float mt-3 h-10 w-auto max-w-[230px] bg-transparent object-contain drop-shadow-[0_0_24px_rgba(59,130,246,0.85)] sm:h-12 sm:max-w-[285px]"
        />
      </div>

      <div className="roadmap-data-card absolute left-5 top-5 hidden min-w-[145px] rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur-xl sm:block">
        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
          Completed Core
        </div>

        <div className="mt-2 font-black text-blue-100">6 Modules</div>

        <div className="mt-1 text-xs text-white/42">
          Built or live
        </div>
      </div>

      <div className="roadmap-data-card roadmap-data-delay absolute right-5 top-5 hidden min-w-[145px] rounded-2xl border border-white/10 bg-black/50 p-4 text-right backdrop-blur-xl sm:block">
        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
          Current Network
        </div>

        <div className="mt-2 font-black text-blue-100">BNB Chain</div>

        <div className="mt-1 text-xs text-white/42">
          Main ecosystem
        </div>
      </div>

      <div className="roadmap-data-card roadmap-data-two absolute bottom-28 left-5 hidden min-w-[145px] rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur-xl sm:block">
        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
          Builder Access
        </div>

        <div className="mt-2 font-black text-cyan-100">1,500 KRX</div>

        <div className="mt-1 text-xs text-white/42">
          12-month stake
        </div>
      </div>

      <div className="roadmap-data-card roadmap-data-three absolute bottom-28 right-5 hidden min-w-[145px] rounded-2xl border border-white/10 bg-black/50 p-4 text-right backdrop-blur-xl sm:block">
        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
          Roadmap
        </div>

        <div className="mt-2 font-black text-white">8 Phases</div>

        <div className="mt-1 text-xs text-white/42">
          Continued expansion
        </div>
      </div>

      <div className="absolute bottom-5 left-5 right-5 z-20 overflow-hidden rounded-[24px] border border-blue-400/20 bg-blue-500/10 p-4 backdrop-blur-xl">
        <div className="roadmap-panel-scan pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-blue-300/10 to-transparent" />

        <div className="relative flex items-center justify-between gap-4">
          <div>
            <div className="text-[9px] font-black uppercase tracking-[0.24em] text-white/38">
              KORAX Development System
            </div>

            <div className="mt-1 text-lg font-black text-white">
              Build • Connect • Expand
            </div>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-400/10">
            <span className="roadmap-live-dot h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.95)]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function PhaseCard({
  item,
  index,
}: {
  item: PhaseItem;
  index: number;
}) {
  const completed =
    item.status === "Live" ||
    item.status === "Prepared" ||
    item.status === "Upgraded";

  const active = item.status === "Expanding";

  return (
    <article
      id={`phase-${index + 1}`}
      className={[
        "roadmap-phase-card relative scroll-mt-32 overflow-hidden rounded-[32px] border p-5 shadow-[0_24px_90px_rgba(0,0,0,0.37)] backdrop-blur-xl sm:p-6",
        completed
          ? "border-blue-400/22 bg-blue-500/[0.065]"
          : active
            ? "border-cyan-300/22 bg-cyan-400/[0.055]"
            : "border-white/10 bg-[#030711]/75",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.07),transparent_38%)]" />

      <div className="relative">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div
              className={[
                "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border text-sm font-black shadow-[0_0_25px_rgba(59,130,246,0.12)]",
                completed
                  ? "border-blue-400/30 bg-blue-500 text-white"
                  : active
                    ? "border-cyan-300/30 bg-cyan-400/15 text-cyan-100"
                    : "border-white/10 bg-white/[0.045] text-white/50",
              ].join(" ")}
            >
              {item.number}
            </div>

            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.24em] text-white/32">
                {item.phase}
              </div>

              <h3 className="mt-2 text-xl font-black leading-tight text-white sm:text-2xl">
                {item.title}
              </h3>
            </div>
          </div>

          <StatusPill status={item.status} tone={item.tone} />
        </div>

        <p className="mt-5 text-sm leading-7 text-white/60">
          {item.summary}
        </p>

        <div className="mt-5 grid gap-3">
          {item.points.map((point, pointIndex) => (
            <div
              key={point}
              className="flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-black/20 px-4 py-3"
            >
              <span
                className={[
                  "mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[8px] font-black",
                  completed
                    ? "border-blue-400/20 bg-blue-500/10 text-blue-100"
                    : active
                      ? "border-cyan-300/20 bg-cyan-400/10 text-cyan-100"
                      : "border-white/10 bg-white/[0.04] text-white/40",
                ].join(" ")}
              >
                {String(pointIndex + 1).padStart(2, "0")}
              </span>

              <p className="text-sm leading-6 text-white/55">{point}</p>
            </div>
          ))}
        </div>

        {item.href && item.cta ? (
          <div className="mt-5">
            <Link
              href={item.href}
              className="inline-flex items-center rounded-2xl border border-blue-400/25 bg-blue-500/10 px-5 py-3 text-sm font-black text-blue-100 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-500/20 hover:text-white"
            >
              {item.cta}
              <span className="ml-2">↗</span>
            </Link>
          </div>
        ) : (
          <div className="mt-5 inline-flex rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-3 text-sm font-bold text-white/40">
            Future ecosystem phase
          </div>
        )}
      </div>
    </article>
  );
}

export default function RoadmapPage() {
  const builtCount = phases.filter((item) =>
    ["Live", "Prepared", "Upgraded"].includes(item.status)
  ).length;

  return (
    <div className="space-y-8 overflow-hidden">
      <style>{`
        @keyframes roadmapLogoSpin {
          0% {
            transform: rotateY(0deg) rotateX(0deg) translateY(0) scale(1);
          }

          25% {
            transform: rotateY(90deg) rotateX(4deg) translateY(-5px)
              scale(1.025);
          }

          50% {
            transform: rotateY(180deg) rotateX(7deg) translateY(-9px)
              scale(1.045);
          }

          75% {
            transform: rotateY(270deg) rotateX(4deg) translateY(-5px)
              scale(1.025);
          }

          100% {
            transform: rotateY(360deg) rotateX(0deg) translateY(0) scale(1);
          }
        }

        @keyframes roadmapWordmarkFloat {
          0%,
          100% {
            transform: translateY(0) scale(1);
            opacity: 0.9;
          }

          50% {
            transform: translateY(-6px) scale(1.025);
            opacity: 1;
          }
        }

        @keyframes roadmapOrbit {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }

          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes roadmapOrbitReverse {
          from {
            transform: translate(-50%, -50%) rotate(360deg);
          }

          to {
            transform: translate(-50%, -50%) rotate(0deg);
          }
        }

        @keyframes roadmapGlow {
          0%,
          100% {
            opacity: 0.35;
            transform: translate(-50%, -50%) scale(0.94);
          }

          50% {
            opacity: 0.92;
            transform: translate(-50%, -50%) scale(1.14);
          }
        }

        @keyframes roadmapGrid {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(-16px, -16px, 0);
          }
        }

        @keyframes roadmapScan {
          0% {
            transform: translateX(-135%);
            opacity: 0;
          }

          20% {
            opacity: 1;
          }

          80% {
            opacity: 1;
          }

          100% {
            transform: translateX(135%);
            opacity: 0;
          }
        }

        @keyframes roadmapDataFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-7px);
          }
        }

        @keyframes roadmapPulse {
          0%,
          100% {
            opacity: 0.45;
            transform: scale(0.82);
          }

          50% {
            opacity: 1;
            transform: scale(1.18);
          }
        }

        @keyframes roadmapProgressGlow {
          0%,
          100% {
            filter: brightness(1);
          }

          50% {
            filter: brightness(1.18);
          }
        }

        .roadmap-phase-card,
        .roadmap-small-card {
          position: relative;
          transform-style: preserve-3d;
          transition:
            transform 230ms ease,
            border-color 230ms ease,
            background-color 230ms ease,
            box-shadow 230ms ease;
        }

        .roadmap-phase-card::before,
        .roadmap-small-card::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: inherit;
          background: linear-gradient(
            125deg,
            transparent,
            rgba(96, 165, 250, 0.07),
            transparent
          );
          opacity: 0;
          transition: opacity 230ms ease;
        }

        .roadmap-phase-card:hover,
        .roadmap-small-card:hover {
          transform: translateY(-6px);
          border-color: rgba(96, 165, 250, 0.35);
          box-shadow: 0 30px 90px rgba(37, 99, 235, 0.13);
        }

        .roadmap-phase-card:hover::before,
        .roadmap-small-card:hover::before {
          opacity: 1;
        }

        .roadmap-logo-spin {
          transform-style: preserve-3d;
          animation: roadmapLogoSpin 9s linear infinite;
          will-change: transform;
          backface-visibility: visible;
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .roadmap-wordmark-float {
          animation: roadmapWordmarkFloat 4.5s ease-in-out infinite;
          will-change: transform;
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .roadmap-orbit-one {
          animation: roadmapOrbit 20s linear infinite;
        }

        .roadmap-orbit-two {
          animation: roadmapOrbitReverse 16s linear infinite;
        }

        .roadmap-orbit-three {
          animation: roadmapOrbit 12s linear infinite;
        }

        .roadmap-orbit::before,
        .roadmap-orbit::after {
          content: "";
          position: absolute;
          height: 8px;
          width: 8px;
          border-radius: 999px;
          background: #60a5fa;
          box-shadow:
            0 0 14px rgba(96, 165, 250, 0.95),
            0 0 28px rgba(34, 211, 238, 0.45);
        }

        .roadmap-orbit::before {
          left: 50%;
          top: -4px;
          transform: translateX(-50%);
        }

        .roadmap-orbit::after {
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
        }

        .roadmap-logo-glow {
          animation: roadmapGlow 3.8s ease-in-out infinite;
        }

        .roadmap-core-grid {
          animation: roadmapGrid 10s ease-in-out infinite;
        }

        .roadmap-data-card {
          animation: roadmapDataFloat 5s ease-in-out infinite;
        }

        .roadmap-data-delay {
          animation-delay: 0.7s;
        }

        .roadmap-data-two {
          animation-delay: 1.4s;
        }

        .roadmap-data-three {
          animation-delay: 2s;
        }

        .roadmap-panel-scan,
        .roadmap-hero-scan {
          animation: roadmapScan 4.8s ease-in-out infinite;
        }

        .roadmap-live-dot {
          animation: roadmapPulse 1.7s ease-in-out infinite;
        }

        .roadmap-progress-bar {
          animation: roadmapProgressGlow 3s ease-in-out infinite;
        }

        @media (max-width: 640px) {
          .roadmap-command-core {
            min-height: 450px;
          }

          .roadmap-orbit-one {
            height: 280px;
            width: 280px;
          }

          .roadmap-orbit-two {
            height: 220px;
            width: 220px;
          }

          .roadmap-orbit-three {
            height: 168px;
            width: 168px;
          }
        }

        @media (hover: none) {
          .roadmap-phase-card:hover,
          .roadmap-small-card:hover {
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .roadmap-logo-spin,
          .roadmap-wordmark-float,
          .roadmap-orbit-one,
          .roadmap-orbit-two,
          .roadmap-orbit-three,
          .roadmap-logo-glow,
          .roadmap-core-grid,
          .roadmap-data-card,
          .roadmap-panel-scan,
          .roadmap-hero-scan,
          .roadmap-live-dot,
          .roadmap-progress-bar {
            animation: none;
          }

          .roadmap-phase-card:hover,
          .roadmap-small-card:hover {
            transform: none;
          }
        }
      `}</style>

      <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[#030711]/88 p-5 shadow-[0_40px_150px_rgba(0,0,0,0.68)] backdrop-blur-2xl sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.25),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.12),transparent_35%)]" />

        <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:52px_52px]" />

        <div className="roadmap-hero-scan pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent" />

        <div className="relative grid gap-10 xl:grid-cols-[1.04fr_.96fr] xl:items-center">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-blue-100 shadow-[0_0_30px_rgba(59,130,246,0.16)]">
              <span className="roadmap-live-dot h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.95)]" />
              Official KORAX Roadmap
            </div>

            <h1 className="mt-7 text-4xl font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              From KRX infrastructure
              <span className="block bg-gradient-to-r from-blue-100 via-white to-cyan-200 bg-clip-text text-transparent drop-shadow-[0_0_22px_rgba(59,130,246,0.48)]">
                to a complete Web3 builder ecosystem.
              </span>
            </h1>

            <p className="mt-6 max-w-4xl text-base leading-8 text-white/62 sm:text-lg">
              The KORAX roadmap tracks the development of the KRX presale,
              claim, staking, flexible builder access, Token Builder AI, Website
              Builder AI, project registry, launch infrastructure, and future
              ecosystem expansion.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                "Real on-chain infrastructure",
                "1,500 KRX builder access",
                "Live AI creation tools",
                "Connected registry and launch direction",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-semibold text-white/68"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-blue-400/20 bg-blue-500/10 text-xs text-blue-100">
                    ✦
                  </span>

                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="#development-timeline"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-blue-500 px-6 py-3 text-sm font-black text-white shadow-[0_0_40px_rgba(59,130,246,0.34)] transition duration-300 hover:-translate-y-0.5 hover:bg-blue-400"
              >
                Explore Roadmap
                <span className="ml-2">↓</span>
              </a>

              <Link
                href="/docs"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-blue-400/25 bg-blue-500/10 px-6 py-3 text-sm font-black text-blue-100 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-500/20 hover:text-white"
              >
                Read Documentation
              </Link>

              <Link
                href="/presale"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-black/30 px-6 py-3 text-sm font-bold text-white/75 transition duration-300 hover:-translate-y-0.5 hover:bg-white/[0.07] hover:text-white"
              >
                Enter KRX Presale
              </Link>
            </div>
          </div>

          <RoadmapLogoVisual />
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[28px] border border-blue-400/20 bg-blue-500/[0.07] px-5 py-4 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(59,130,246,0.08),transparent,rgba(34,211,238,0.07))]" />

        <div className="relative grid gap-4 text-center sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {overviewItems.map((item, index) => (
            <div
              key={item.label}
              className={[
                "px-4 py-2",
                index > 0 ? "xl:border-l xl:border-white/10" : "",
              ].join(" ")}
            >
              <div className="text-[9px] font-black uppercase tracking-[0.22em] text-white/35">
                {item.label}
              </div>

              <div
                className={[
                  "mt-1 text-sm font-black",
                  item.tone === "cyan"
                    ? "text-cyan-100"
                    : "text-blue-100",
                ].join(" ")}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[38px] border border-white/10 bg-[#030711]/76 p-5 shadow-[0_28px_100px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-7 lg:p-8">
        <SectionHeading
          eyebrow="Roadmap Progress"
          title="Core infrastructure is already established."
          description="KORAX has progressed beyond the concept stage. Presale infrastructure, flexible access, AI creation, Website Builder AI, and launch systems have already been built or prepared."
          right={
            <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 px-5 py-3 text-right">
              <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
                Built or Prepared
              </div>

              <div className="mt-1 text-2xl font-black text-blue-100">
                {builtCount} / {phases.length}
              </div>
            </div>
          }
        />

        <div className="mt-8">
          <div className="relative overflow-hidden rounded-full border border-white/10 bg-black/40 p-1">
            <div
              className="roadmap-progress-bar h-5 rounded-full bg-gradient-to-r from-blue-600 via-blue-300 to-cyan-200 shadow-[0_0_28px_rgba(59,130,246,0.38)]"
              style={{
                width: `${(builtCount / phases.length) * 100}%`,
              }}
            />
          </div>

          <div className="mt-3 flex justify-between text-[10px] font-black uppercase tracking-[0.14em] text-white/30">
            <span>Foundation</span>
            <span>Builder Tools</span>
            <span>Launch</span>
            <span>Expansion</span>
          </div>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {milestones.map((item, index) => (
            <article
              key={item.number}
              className="roadmap-small-card rounded-[27px] border border-white/10 bg-black/25 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <span
                  className={[
                    "flex h-11 w-11 items-center justify-center rounded-2xl border text-xs font-black",
                    index < 3
                      ? "border-blue-400/25 bg-blue-500/10 text-blue-100"
                      : "border-cyan-300/20 bg-cyan-400/10 text-cyan-100",
                  ].join(" ")}
                >
                  {item.number}
                </span>

                <StatusPill
                  status={item.status}
                  tone={index < 3 ? "blue" : "cyan"}
                />
              </div>

              <h3 className="mt-5 text-lg font-black text-white">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-white/52">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="development-timeline"
        className="scroll-mt-28 rounded-[38px] border border-white/10 bg-black/20 p-5 backdrop-blur-xl sm:p-7 lg:p-8"
      >
        <SectionHeading
          eyebrow="Development Timeline"
          title="Eight phases of KORAX development."
          description="Statuses describe current technical progress. They do not guarantee future market performance, adoption, exchange listings, or delivery dates."
        />

        <div className="relative mt-8">
          <div className="pointer-events-none absolute bottom-6 left-[27px] top-6 hidden w-px bg-gradient-to-b from-blue-400/70 via-blue-400/15 to-white/5 xl:block" />

          <div className="grid gap-6 xl:pl-20">
            {phases.map((item, index) => (
              <div key={item.number} className="relative">
                <div
                  className={[
                    "absolute -left-[80px] top-8 z-10 hidden h-14 w-14 items-center justify-center rounded-full border text-xs font-black xl:flex",
                    item.status === "Live" ||
                    item.status === "Prepared" ||
                    item.status === "Upgraded"
                      ? "border-blue-400/30 bg-blue-500 text-white shadow-[0_0_28px_rgba(59,130,246,0.25)]"
                      : item.status === "Expanding"
                        ? "border-cyan-300/30 bg-cyan-400/15 text-cyan-100"
                        : "border-white/10 bg-[#07101f] text-white/40",
                  ].join(" ")}
                >
                  {item.number}
                </div>

                <PhaseCard item={item} index={index} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[38px] border border-blue-400/20 bg-blue-500/[0.065] p-5 shadow-[0_28px_100px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:p-7 lg:p-8">
        <SectionHeading
          eyebrow="Current Achievements"
          title="What KORAX has already built."
          description="These modules represent the current ecosystem foundation and builder functionality."
        />

        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {currentAchievements.map((item, index) => (
            <div
              key={item}
              className="flex items-center gap-4 rounded-[22px] border border-white/10 bg-black/25 px-4 py-4"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-[10px] font-black text-blue-100">
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="text-sm font-semibold text-white/67">
                {item}
              </span>

              <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.85)]" />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[38px] border border-white/10 bg-[#030711]/76 p-5 shadow-[0_28px_100px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-7 lg:p-8">
        <SectionHeading
          eyebrow="Next Priorities"
          title="Where development continues next."
          description="KORAX development will continue around ecosystem connection, performance, security, project discovery, post-presale activation, and responsible market expansion."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {nextPriorities.map((item) => (
            <article
              key={item.number}
              className="roadmap-small-card rounded-[28px] border border-white/10 bg-black/25 p-5"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-xs font-black text-blue-100">
                {item.number}
              </span>

              <h3 className="mt-5 text-lg font-black text-white">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-white/52">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[38px] border border-cyan-300/20 bg-cyan-400/[0.055] p-5 shadow-[0_28px_100px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:p-7 lg:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.08),transparent_36%)]" />

        <div className="relative grid gap-8 lg:grid-cols-[1fr_.75fr] lg:items-center">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100">
              Flexible Infrastructure
            </div>

            <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl">
              Builder access can evolve with the KRX ecosystem.
            </h2>

            <p className="mt-5 max-w-3xl text-sm leading-8 text-white/62 sm:text-base">
              The Access Manager was designed so project requirements can remain
              adaptable instead of being permanently locked to a rigid amount.
              The current on-chain requirement is 1,500 KRX in the qualifying
              12-month staking plan for one project slot.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[26px] border border-cyan-300/20 bg-black/25 p-5">
              <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
                Current Requirement
              </div>

              <div className="mt-3 text-3xl font-black text-cyan-100">
                1,500 KRX
              </div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-black/25 p-5">
              <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
                Qualifying Plan
              </div>

              <div className="mt-3 text-3xl font-black text-white">
                12 Months
              </div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-black/25 p-5 sm:col-span-2">
              <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
                Current Access Result
              </div>

              <div className="mt-3 text-xl font-black text-blue-100">
                One eligible stake → One project slot
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[42px] border border-blue-400/25 bg-[#050a18] p-6 shadow-[0_35px_130px_rgba(0,0,0,0.55)] sm:p-9 lg:p-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(37,99,235,0.22),transparent_38%),radial-gradient(circle_at_right,rgba(34,211,238,0.11),transparent_34%)]" />

        <div className="pointer-events-none absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:46px_46px]" />

        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-3xl">
            <div className="text-xs font-black uppercase tracking-[0.3em] text-blue-100">
              KORAX Builder Ecosystem
            </div>

            <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.025em] text-white sm:text-5xl">
              Your path to the top begins with KORAX.
            </h2>

            <p className="mt-5 text-sm leading-8 text-white/60 sm:text-base">
              Follow the development roadmap, explore the working builder
              modules, and review the complete KORAX ecosystem documentation.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              href="/ai"
              className="inline-flex min-w-[220px] items-center justify-center rounded-2xl bg-blue-500 px-6 py-3.5 text-sm font-black text-white shadow-[0_0_40px_rgba(59,130,246,0.32)] transition duration-300 hover:-translate-y-0.5 hover:bg-blue-400"
            >
              Open Token Builder AI
              <span className="ml-2">↗</span>
            </Link>

            <Link
              href="/website-builder-ai"
              className="inline-flex min-w-[220px] items-center justify-center rounded-2xl border border-blue-400/25 bg-blue-500/10 px-6 py-3.5 text-sm font-black text-blue-100 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-500/20 hover:text-white"
            >
              Open Website Builder AI
            </Link>

            <Link
              href="/docs"
              className="inline-flex min-w-[220px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] px-6 py-3.5 text-sm font-black text-white/75 transition duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
            >
              Read Documentation
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-amber-300/15 bg-amber-300/[0.045] px-5 py-4 text-xs leading-6 text-white/45">
        <span className="font-black text-amber-100/78">
          Roadmap notice:
        </span>{" "}
        The KORAX roadmap describes current development direction and planned
        ecosystem priorities. Future features, timelines, exchange listings,
        liquidity events, integrations, and market objectives may change based
        on technical development, security reviews, regulation, market
        conditions, and ecosystem requirements.
      </section>
    </div>
  );
}