import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About KORAX",
  description:
    "Discover KORAX, a BNB Chain Web3 builder ecosystem combining KRX, AI project tools, website generation, staking, project registry, and launch infrastructure.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About KORAX | Web3 Builder Ecosystem",
    description:
      "Learn how KORAX connects KRX, Token Builder AI, Website Builder AI, staking, project registry, and Web3 launch infrastructure.",
    url: "https://korax.fund/about",
    images: [
      {
        url: "/Korax-logo.png",
        width: 1200,
        height: 630,
        alt: "KORAX Web3 Builder Ecosystem",
      },
    ],
  },
};

type Tone = "blue" | "cyan" | "slate";

const heroTags = [
  "KRX Utility",
  "BNB Chain",
  "Token Builder AI",
  "Website Builder AI",
  "Staking",
  "Project Registry",
  "Launch Infrastructure",
];

const ecosystemStats = [
  {
    label: "Network",
    value: "BNB Chain",
    note: "EVM ecosystem",
  },
  {
    label: "Native Utility",
    value: "KRX",
    note: "Fixed maximum supply",
  },
  {
    label: "Builder Systems",
    value: "AI + Web3",
    note: "Connected workflow",
  },
  {
    label: "Project Direction",
    value: "Build & Launch",
    note: "Infrastructure focused",
  },
];

const corePrinciples = [
  {
    number: "01",
    title: "Transparency",
    description:
      "KORAX is structured around visible presale stages, clear token allocation, public documentation, understandable claim timing, and on-chain project infrastructure.",
    tone: "blue" as Tone,
  },
  {
    number: "02",
    title: "Simplicity",
    description:
      "The ecosystem is designed to reduce unnecessary technical friction and guide builders from an early idea toward a structured Web3 project.",
    tone: "cyan" as Tone,
  },
  {
    number: "03",
    title: "Utility",
    description:
      "KRX is designed around ecosystem access, staking, builder systems, project creation, registry visibility, and launch infrastructure.",
    tone: "blue" as Tone,
  },
  {
    number: "04",
    title: "Responsibility",
    description:
      "KORAX avoids guaranteed-return claims and clearly communicates that crypto participation involves technical, financial, and market risk.",
    tone: "slate" as Tone,
  },
];

const buildItems = [
  {
    number: "01",
    icon: "AI",
    title: "Token Builder AI",
    description:
      "A guided system for developing project concepts, utility direction, token settings, tokenomics structure, roadmap planning, risk awareness, and deployment preparation.",
    status: "Live",
    href: "/ai",
    tone: "blue" as Tone,
  },
  {
    number: "02",
    icon: "WEB",
    title: "Website Builder AI",
    description:
      "A Web3 website creation workflow that produces branded sections, structured content, project presentation, and deployment-ready output.",
    status: "Live",
    href: "/website-builder-ai",
    tone: "cyan" as Tone,
  },
  {
    number: "03",
    icon: "KRX",
    title: "KRX Ecosystem",
    description:
      "The native KORAX utility layer connects presale participation, claim, staking, builder access, and future ecosystem functionality.",
    status: "Active",
    href: "/presale",
    tone: "blue" as Tone,
  },
  {
    number: "04",
    icon: "REG",
    title: "Project Registry",
    description:
      "A public project layer designed to connect created projects with transparent ecosystem visibility and launch-related tools.",
    status: "Live",
    href: "/launch",
    tone: "cyan" as Tone,
  },
  {
    number: "05",
    icon: "STAKE",
    title: "Staking Infrastructure",
    description:
      "Prepared fixed-duration KRX staking systems designed to support participation, utility, and access within the wider ecosystem.",
    status: "Prepared",
    href: "/staking",
    tone: "slate" as Tone,
  },
  {
    number: "06",
    icon: "↗",
    title: "Launch Infrastructure",
    description:
      "Connected project launch systems covering project presentation, registry visibility, supported participation assets, and claim preparation.",
    status: "Live",
    href: "/launch",
    tone: "blue" as Tone,
  },
];

const workflow = [
  {
    number: "01",
    label: "Define",
    title: "Turn an idea into a structured concept",
    description:
      "Develop the project purpose, utility direction, audience, token model, risks, roadmap, and identity.",
  },
  {
    number: "02",
    label: "Build",
    title: "Create the technical and visual foundation",
    description:
      "Use KORAX builder systems to prepare the token structure, website, branding, content, and deployment workflow.",
  },
  {
    number: "03",
    label: "Register",
    title: "Connect the project to the ecosystem",
    description:
      "Publish relevant project information through KORAX registry and launch infrastructure.",
  },
  {
    number: "04",
    label: "Launch",
    title: "Present the project publicly",
    description:
      "Move from private project preparation toward transparent public presentation and launch participation.",
  },
];

const visionPhases = [
  {
    phase: "Foundation",
    status: "Active",
    title: "KRX and core infrastructure",
    description:
      "Establish the KRX token lifecycle, five-stage presale, claim architecture, staking preparation, documentation, and official ecosystem identity.",
    items: [
      "KRX presale infrastructure",
      "Claim and staking preparation",
      "Official documentation",
      "Wallet connectivity",
    ],
  },
  {
    phase: "Builder Layer",
    status: "Live",
    title: "AI-assisted project creation",
    description:
      "Connect token strategy and website generation through tools that help builders prepare stronger project foundations.",
    items: [
      "Token Builder AI",
      "Website Builder AI",
      "Project strategy generation",
      "Deployment-ready output",
    ],
  },
  {
    phase: "Launch Layer",
    status: "Growing",
    title: "Project registry and launch systems",
    description:
      "Expand the public project layer through registry visibility, launch workflows, and connected participation infrastructure.",
    items: [
      "Public project visibility",
      "Launch infrastructure",
      "Project discovery",
      "Ecosystem participation",
    ],
  },
  {
    phase: "Expansion",
    status: "Planned",
    title: "A broader Web3 builder economy",
    description:
      "Grow KORAX into a larger ecosystem for project creation, infrastructure access, integrations, and multi-network development.",
    items: [
      "Additional integrations",
      "Builder ecosystem growth",
      "More automation systems",
      "Potential network expansion",
    ],
  },
];

const trustItems = [
  {
    title: "User-controlled wallets",
    description:
      "Users remain responsible for approving transactions and paying the required BNB Chain network fees through their connected wallets.",
  },
  {
    title: "Public project information",
    description:
      "KORAX presents token allocation, presale stages, claim timing, ecosystem tools, policies, and risk information through public pages.",
  },
  {
    title: "No guaranteed returns",
    description:
      "KORAX does not guarantee profit, liquidity, exchange listings, adoption, or future KRX market performance.",
  },
];

const faqs = [
  {
    question: "Is KORAX only a crypto token?",
    answer:
      "No. KRX is the native utility asset, while KORAX is being developed as a wider builder ecosystem containing presale, claim, staking, Token Builder AI, Website Builder AI, project registry, and launch infrastructure.",
  },
  {
    question: "Who is KORAX designed for?",
    answer:
      "KORAX is designed for Web3 founders, early-stage builders, communities, token creators, and users interested in structured project creation and ecosystem participation.",
  },
  {
    question: "What role does KRX have?",
    answer:
      "KRX is intended to support ecosystem participation, staking, builder access, launch infrastructure, and connected KORAX utility systems.",
  },
  {
    question: "Does KORAX deploy projects automatically?",
    answer:
      "Some builder workflows can prepare or submit blockchain actions, but users remain responsible for connected-wallet approvals, network fees, legal obligations, security review, and the final project decisions.",
  },
];

function Badge({
  children,
  tone = "blue",
}: {
  children: string;
  tone?: Tone;
}) {
  const toneClasses: Record<Tone, string> = {
    blue:
      "border-blue-400/25 bg-blue-500/10 text-blue-100 shadow-[0_0_22px_rgba(59,130,246,0.12)]",
    cyan:
      "border-cyan-300/20 bg-cyan-400/10 text-cyan-100 shadow-[0_0_22px_rgba(34,211,238,0.10)]",
    slate: "border-white/10 bg-white/[0.045] text-white/[0.55]",
  };

  return (
    <span
      className={[
        "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em]",
        toneClasses[tone],
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: {
    href: string;
    label: string;
  };
}) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-4xl">
        <div className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-blue-100">
          <span className="h-px w-9 bg-blue-400/70" />
          {eyebrow}
        </div>

        <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.025em] text-white sm:text-4xl lg:text-5xl">
          {title}
        </h2>

        {description ? (
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/[0.58] sm:text-base sm:leading-8">
            {description}
          </p>
        ) : null}
      </div>

      {action ? (
        <Link
          href={action.href}
          className="inline-flex w-fit items-center justify-center rounded-2xl border border-blue-400/25 bg-blue-500/10 px-5 py-3 text-sm font-black text-blue-100 transition duration-300 hover:-translate-y-0.5 hover:border-blue-300/40 hover:bg-blue-500/20 hover:text-white"
        >
          {action.label}
          <span className="ml-2">↗</span>
        </Link>
      ) : null}
    </div>
  );
}

function AboutLogoCore() {
  return (
    <div className="about-logo-core relative min-h-[520px] overflow-hidden rounded-[34px] border border-white/10 bg-[#020611]/85 shadow-[0_35px_120px_rgba(0,0,0,0.58)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.28),transparent_33%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.13),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.10),transparent_35%)]" />

      <div className="about-grid pointer-events-none absolute inset-0 opacity-[0.075] [background-image:linear-gradient(rgba(255,255,255,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.11)_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="about-orbit about-orbit-one pointer-events-none absolute left-1/2 top-[43%] h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/15" />

      <div className="about-orbit about-orbit-two pointer-events-none absolute left-1/2 top-[43%] h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />

      <div className="about-orbit about-orbit-three pointer-events-none absolute left-1/2 top-[43%] h-[212px] w-[212px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />

      <div className="about-logo-glow pointer-events-none absolute left-1/2 top-[43%] h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/25 blur-3xl" />

      <div className="absolute left-1/2 top-[43%] z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <Image
          src="/Korax-logo.png"
          alt="KORAX official logo"
          width={420}
          height={420}
          priority
          draggable={false}
          className="about-logo-spin h-44 w-44 bg-transparent object-contain drop-shadow-[0_0_44px_rgba(59,130,246,0.95)] sm:h-52 sm:w-52"
        />

        <Image
          src="/korax-wordmark.png"
          alt="KORAX"
          width={520}
          height={150}
          priority
          draggable={false}
          className="about-wordmark-float mt-3 h-10 w-auto max-w-[230px] bg-transparent object-contain drop-shadow-[0_0_24px_rgba(59,130,246,0.85)] sm:h-12 sm:max-w-[285px]"
        />
      </div>

      <div className="about-data-chip absolute left-5 top-5 hidden min-w-[150px] rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur-xl sm:block">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/[0.35]">
          Ecosystem
        </div>

        <div className="mt-2 font-black text-white">Web3 Builder</div>

        <div className="mt-1 text-xs text-blue-100/[0.7]">
          Connected systems
        </div>
      </div>

      <div className="about-data-chip about-data-delay absolute right-5 top-5 hidden min-w-[150px] rounded-2xl border border-white/10 bg-black/50 p-4 text-right backdrop-blur-xl sm:block">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/[0.35]">
          Network
        </div>

        <div className="mt-2 font-black text-blue-100">BNB Chain</div>

        <div className="mt-1 text-xs text-white/[0.45]">
          EVM infrastructure
        </div>
      </div>

      <div className="about-data-chip about-data-two absolute bottom-28 left-5 hidden min-w-[150px] rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur-xl sm:block">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/[0.35]">
          Native Utility
        </div>

        <div className="mt-2 font-black text-white">KRX</div>

        <div className="mt-1 text-xs text-white/[0.45]">
          Ecosystem access
        </div>
      </div>

      <div className="about-data-chip about-data-three absolute bottom-28 right-5 hidden min-w-[150px] rounded-2xl border border-white/10 bg-black/50 p-4 text-right backdrop-blur-xl sm:block">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/[0.35]">
          Direction
        </div>

        <div className="mt-2 font-black text-cyan-100">
          Build & Launch
        </div>

        <div className="mt-1 text-xs text-white/[0.45]">
          Unified workflow
        </div>
      </div>

      <div className="absolute bottom-5 left-5 right-5 z-20 overflow-hidden rounded-[24px] border border-blue-400/20 bg-blue-500/10 p-4 shadow-[0_0_38px_rgba(59,130,246,0.12)] backdrop-blur-xl">
        <div className="about-panel-scan pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-blue-300/10 to-transparent" />

        <div className="relative text-center">
          <div className="text-[10px] font-black uppercase tracking-[0.24em] text-white/[0.4]">
            KORAX Ecosystem Identity
          </div>

          <div className="mt-2 text-lg font-black text-white sm:text-xl">
            KRX
            <span className="mx-2 text-blue-300">•</span>
            AI Builders
            <span className="mx-2 text-cyan-300">•</span>
            Launch
          </div>
        </div>
      </div>
    </div>
  );
}

function SystemMap() {
  const nodes = [
    {
      position: "left-1/2 top-2 -translate-x-1/2",
      label: "Strategy",
      note: "Project direction",
    },
    {
      position: "right-0 top-1/2 -translate-y-1/2",
      label: "Website",
      note: "Brand and presence",
    },
    {
      position: "bottom-2 left-1/2 -translate-x-1/2",
      label: "Launch",
      note: "Registry and access",
    },
    {
      position: "left-0 top-1/2 -translate-y-1/2",
      label: "Token",
      note: "Utility and logic",
    },
  ];

  return (
    <div className="relative mx-auto h-[390px] w-full max-w-[470px]">
      <div className="about-map-orbit absolute left-1/2 top-1/2 h-[290px] w-[290px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/15 sm:h-[330px] sm:w-[330px]" />

      <div className="about-map-orbit-reverse absolute left-1/2 top-1/2 h-[215px] w-[215px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10 sm:h-[245px] sm:w-[245px]" />

      <div className="absolute left-1/2 top-1/2 flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-blue-400/25 bg-[#061126] text-center shadow-[0_0_75px_rgba(59,130,246,0.28)]">
        <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/[0.4]">
          Core Layer
        </div>

        <div className="mt-2 text-2xl font-black text-white">KORAX</div>

        <div className="mt-1 text-xs font-semibold text-blue-100">
          Connected ecosystem
        </div>
      </div>

      {nodes.map((node) => (
        <div
          key={node.label}
          className={[
            "absolute z-10 min-w-[118px] rounded-2xl border border-white/10 bg-[#050b18]/95 px-3 py-3 text-center shadow-[0_16px_45px_rgba(0,0,0,0.42)] backdrop-blur-xl",
            node.position,
          ].join(" ")}
        >
          <div className="text-sm font-black text-white">{node.label}</div>

          <div className="mt-1 text-[10px] text-white/[0.42]">
            {node.note}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="space-y-8 overflow-hidden">
      <style>{`
        @keyframes aboutLogoSpin {
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

        @keyframes aboutWordmarkFloat {
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

        @keyframes aboutGlow {
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

        @keyframes aboutOrbit {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }

          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes aboutOrbitReverse {
          from {
            transform: translate(-50%, -50%) rotate(360deg);
          }

          to {
            transform: translate(-50%, -50%) rotate(0deg);
          }
        }

        @keyframes aboutScan {
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

        @keyframes aboutShimmer {
          0% {
            transform: translateX(-140%);
            opacity: 0;
          }

          30% {
            opacity: 1;
          }

          70% {
            opacity: 1;
          }

          100% {
            transform: translateX(140%);
            opacity: 0;
          }
        }

        @keyframes aboutGrid {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(-17px, -17px, 0);
          }
        }

        @keyframes aboutDataFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-7px);
          }
        }

        @keyframes aboutPulse {
          0%,
          100% {
            opacity: 0.45;
            transform: scale(0.85);
          }

          50% {
            opacity: 1;
            transform: scale(1.15);
          }
        }

        .about-hero {
          transform-style: preserve-3d;
          perspective: 1400px;
        }

        .about-card {
          position: relative;
          overflow: hidden;
          transform-style: preserve-3d;
          transition:
            transform 250ms ease,
            border-color 250ms ease,
            background-color 250ms ease,
            box-shadow 250ms ease;
        }

        .about-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          background: linear-gradient(
            125deg,
            transparent 10%,
            rgba(96, 165, 250, 0.08),
            transparent 58%
          );
          opacity: 0;
          transition: opacity 250ms ease;
        }

        .about-card:hover {
          transform: translateY(-7px);
          border-color: rgba(96, 165, 250, 0.38);
          background-color: rgba(37, 99, 235, 0.065);
          box-shadow: 0 32px 90px rgba(37, 99, 235, 0.14);
        }

        .about-card:hover::before {
          opacity: 1;
        }

        .about-logo-spin {
          transform-style: preserve-3d;
          animation: aboutLogoSpin 9s linear infinite;
          will-change: transform;
          backface-visibility: visible;
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .about-wordmark-float {
          animation: aboutWordmarkFloat 4.5s ease-in-out infinite;
          will-change: transform;
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .about-logo-glow {
          animation: aboutGlow 3.8s ease-in-out infinite;
        }

        .about-orbit-one {
          animation: aboutOrbit 20s linear infinite;
        }

        .about-orbit-two {
          animation: aboutOrbitReverse 16s linear infinite;
        }

        .about-orbit-three {
          animation: aboutOrbit 12s linear infinite;
        }

        .about-orbit::before,
        .about-orbit::after {
          content: "";
          position: absolute;
          height: 8px;
          width: 8px;
          border-radius: 999px;
          background: #60a5fa;
          box-shadow:
            0 0 14px rgba(96, 165, 250, 0.95),
            0 0 30px rgba(34, 211, 238, 0.45);
        }

        .about-orbit::before {
          left: 50%;
          top: -4px;
          transform: translateX(-50%);
        }

        .about-orbit::after {
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
        }

        .about-grid {
          animation: aboutGrid 10s ease-in-out infinite;
        }

        .about-hero-scan {
          animation: aboutScan 4.7s ease-in-out infinite;
        }

        .about-hero-shimmer {
          animation: aboutShimmer 5.9s ease-in-out infinite;
        }

        .about-panel-scan {
          animation: aboutScan 4.9s ease-in-out infinite;
        }

        .about-data-chip {
          animation: aboutDataFloat 5s ease-in-out infinite;
        }

        .about-data-delay {
          animation-delay: 0.8s;
        }

        .about-data-two {
          animation-delay: 1.4s;
        }

        .about-data-three {
          animation-delay: 2s;
        }

        .about-live-dot {
          animation: aboutPulse 1.8s ease-in-out infinite;
        }

        .about-map-orbit {
          animation: aboutOrbit 24s linear infinite;
        }

        .about-map-orbit-reverse {
          animation: aboutOrbitReverse 18s linear infinite;
        }

        details.about-faq[open] {
          border-color: rgba(96, 165, 250, 0.32);
          background: rgba(37, 99, 235, 0.07);
        }

        details.about-faq summary::-webkit-details-marker {
          display: none;
        }

        @media (max-width: 640px) {
          .about-logo-core {
            min-height: 470px;
          }

          .about-orbit-one {
            height: 280px;
            width: 280px;
          }

          .about-orbit-two {
            height: 220px;
            width: 220px;
          }

          .about-orbit-three {
            height: 168px;
            width: 168px;
          }
        }

        @media (hover: none) {
          .about-card:hover {
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .about-logo-spin,
          .about-wordmark-float,
          .about-logo-glow,
          .about-orbit-one,
          .about-orbit-two,
          .about-orbit-three,
          .about-grid,
          .about-hero-scan,
          .about-hero-shimmer,
          .about-panel-scan,
          .about-data-chip,
          .about-live-dot,
          .about-map-orbit,
          .about-map-orbit-reverse {
            animation: none;
          }

          .about-card:hover {
            transform: none;
          }
        }
      `}</style>

      <section className="about-hero relative overflow-hidden rounded-[40px] border border-white/10 bg-[#030711]/85 p-5 shadow-[0_40px_150px_rgba(0,0,0,0.68)] backdrop-blur-2xl sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.25),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.12),transparent_35%)]" />

        <div className="pointer-events-none absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:52px_52px]" />

        <div className="about-hero-scan pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent" />

        <div className="about-hero-shimmer pointer-events-none absolute left-0 top-0 h-full w-1/4 bg-gradient-to-r from-transparent via-white/[0.045] to-transparent" />

        <div className="relative grid gap-10 xl:grid-cols-[1.04fr_.96fr] xl:items-center">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-blue-100 shadow-[0_0_30px_rgba(59,130,246,0.16)]">
              <span className="about-live-dot h-2 w-2 rounded-full bg-blue-300 shadow-[0_0_14px_rgba(147,197,253,0.95)]" />
              About the KORAX Ecosystem
            </div>

            <h1 className="mt-7 text-4xl font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              Building the system
              <span className="block bg-gradient-to-r from-blue-100 via-white to-cyan-200 bg-clip-text text-transparent drop-shadow-[0_0_22px_rgba(59,130,246,0.48)]">
                behind the next Web3 project.
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-white/[0.64] sm:text-lg">
              KORAX is a BNB Chain builder ecosystem connecting KRX,
              artificial intelligence, website generation, project
              registration, staking systems, and launch infrastructure through
              one expanding workflow.
            </p>

            <div className="mt-7 flex flex-wrap gap-2.5">
              {heroTags.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs font-semibold text-white/[0.68] shadow-[0_12px_35px_rgba(0,0,0,0.20)]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-300 shadow-[0_0_8px_rgba(147,197,253,0.8)]" />
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/docs"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-blue-500 px-6 py-3 text-sm font-black text-white shadow-[0_0_40px_rgba(59,130,246,0.34)] transition duration-300 hover:-translate-y-0.5 hover:bg-blue-400 hover:shadow-[0_0_55px_rgba(59,130,246,0.45)]"
              >
                Explore KORAX Docs
                <span className="ml-2">↗</span>
              </Link>

              <Link
                href="/roadmap"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-blue-400/25 bg-blue-500/10 px-6 py-3 text-sm font-black text-blue-100 transition duration-300 hover:-translate-y-0.5 hover:border-blue-300/40 hover:bg-blue-500/20 hover:text-white"
              >
                View Development Roadmap
              </Link>

              <Link
                href="/presale"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-black/30 px-6 py-3 text-sm font-bold text-white/[0.78] transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
              >
                KRX Presale
              </Link>
            </div>
          </div>

          <AboutLogoCore />
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[28px] border border-blue-400/20 bg-blue-500/[0.07] px-5 py-4 shadow-[0_20px_70px_rgba(0,0,0,0.34)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(59,130,246,0.08),transparent,rgba(34,211,238,0.07))]" />

        <div className="relative grid gap-4 text-center sm:grid-cols-2 lg:grid-cols-4">
          {ecosystemStats.map((item, index) => (
            <div
              key={item.label}
              className={[
                "px-4 py-2",
                index > 0 ? "lg:border-l lg:border-white/10" : "",
              ].join(" ")}
            >
              <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/[0.35]">
                {item.label}
              </div>

              <div className="mt-1 text-sm font-black text-blue-100">
                {item.value}
              </div>

              <div className="mt-1 text-[10px] text-white/[0.38]">
                {item.note}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[38px] border border-white/10 bg-[#030712]/78 p-5 shadow-[0_30px_110px_rgba(0,0,0,0.46)] backdrop-blur-xl sm:p-7 lg:p-9">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(37,99,235,0.16),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.08),transparent_32%)]" />

        <div className="relative grid gap-10 xl:grid-cols-[0.95fr_1.05fr] xl:items-center">
          <div>
            <div className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-blue-100">
              <span className="h-px w-9 bg-blue-400/70" />
              Mission
            </div>

            <h2 className="mt-5 text-3xl font-black leading-tight tracking-[-0.025em] text-white sm:text-5xl">
              Make Web3 creation more structured, connected, and launch-ready.
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-8 text-white/[0.6] sm:text-base">
              Web3 builders often depend on disconnected tools for token
              structure, project strategy, websites, registration, and launch
              preparation. KORAX is being developed to bring those critical
              stages into one unified ecosystem.
            </p>

            <p className="mt-4 max-w-2xl text-sm leading-8 text-white/[0.52] sm:text-base">
              The ecosystem begins with KRX and its token lifecycle, then
              expands into systems that help creators move from an initial
              concept toward a more complete public project.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/ai"
                className="rounded-2xl bg-blue-500 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-400"
              >
                Open Token Builder AI
              </Link>

              <Link
                href="/website-builder-ai"
                className="rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-3 text-sm font-bold text-white transition hover:border-blue-400/25 hover:bg-blue-500/10"
              >
                Open Website Builder
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                number: "01",
                title: "One connected workflow",
                description:
                  "Move between strategy, token structure, website creation, registry, and launch systems.",
              },
              {
                number: "02",
                title: "Builder-first direction",
                description:
                  "Focus on the practical infrastructure required to develop and present a Web3 project.",
              },
              {
                number: "03",
                title: "KRX-powered utility",
                description:
                  "Connect KRX with ecosystem access, participation, staking, and builder infrastructure.",
              },
              {
                number: "04",
                title: "Public transparency",
                description:
                  "Explain project stages, systems, risks, timing, and token allocation through official pages.",
              },
            ].map((item) => (
              <article
                key={item.number}
                className="about-card rounded-[26px] border border-white/10 bg-black/30 p-5"
              >
                <div className="text-xs font-black tracking-[0.24em] text-blue-100/[0.62]">
                  {item.number}
                </div>

                <h3 className="relative mt-4 text-lg font-black text-white">
                  {item.title}
                </h3>

                <p className="relative mt-3 text-sm leading-7 text-white/[0.55]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[38px] border border-white/10 bg-black/20 p-5 shadow-[0_28px_100px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-7 lg:p-8">
        <SectionHeading
          eyebrow="KORAX Infrastructure"
          title="The systems being built inside the ecosystem."
          description="Each KORAX module is designed to support a different stage of the Web3 project journey while remaining connected to the wider platform."
          action={{
            href: "/docs",
            label: "Explore Documentation",
          }}
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {buildItems.map((item) => (
            <article
              key={item.title}
              className="about-card group flex min-h-[320px] flex-col rounded-[28px] border border-white/10 bg-[#050914]/72 p-5 shadow-[0_20px_65px_rgba(0,0,0,0.28)]"
            >
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 min-w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 px-2 text-[10px] font-black text-blue-100 shadow-[0_0_26px_rgba(59,130,246,0.12)]">
                    {item.icon}
                  </div>

                  <span className="text-xs font-black tracking-[0.2em] text-white/[0.25]">
                    {item.number}
                  </span>
                </div>

                <Badge tone={item.tone}>{item.status}</Badge>
              </div>

              <h3 className="relative mt-6 text-xl font-black text-white">
                {item.title}
              </h3>

              <p className="relative mt-3 flex-1 text-sm leading-7 text-white/[0.56]">
                {item.description}
              </p>

              <Link
                href={item.href}
                className="relative mt-6 inline-flex w-fit items-center text-sm font-black text-blue-100 transition group-hover:text-white"
              >
                Explore System
                <span className="ml-2 transition group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[38px] border border-white/10 bg-[#030712]/76 p-5 shadow-[0_30px_110px_rgba(0,0,0,0.44)] backdrop-blur-xl sm:p-7 lg:p-9">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(37,99,235,0.17),transparent_36%),radial-gradient(circle_at_left_bottom,rgba(34,211,238,0.07),transparent_30%)]" />

        <div className="relative grid gap-10 xl:grid-cols-[1fr_0.9fr] xl:items-center">
          <div>
            <SectionHeading
              eyebrow="Connected Architecture"
              title="Not separate tools. One progressive builder system."
              description="The purpose of the KORAX architecture is to let a builder move through the major project-development stages without losing structure between different tools and platforms."
            />

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                "Project intelligence and planning",
                "Token utility and configuration",
                "Website and brand presentation",
                "Registry and public launch visibility",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm font-semibold text-white/[0.65]"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-blue-400/20 bg-blue-500/10 text-xs text-blue-100">
                    ✦
                  </span>

                  {item}
                </div>
              ))}
            </div>
          </div>

          <SystemMap />
        </div>
      </section>

      <section className="rounded-[38px] border border-white/10 bg-black/20 p-5 shadow-[0_28px_100px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-7 lg:p-8">
        <SectionHeading
          eyebrow="Builder Workflow"
          title="From concept to public project."
          description="The KORAX workflow is designed as a progressive process rather than a single automated action."
        />

        <div className="relative mt-8 grid gap-4 lg:grid-cols-4">
          <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-gradient-to-r from-blue-400/70 via-blue-400/20 to-cyan-300/20 lg:block" />

          {workflow.map((item, index) => (
            <article
              key={item.number}
              className="about-card relative rounded-[28px] border border-white/10 bg-[#050914]/72 p-5"
            >
              <div
                className={[
                  "relative z-10 flex h-14 w-14 items-center justify-center rounded-full border text-sm font-black shadow-[0_0_28px_rgba(59,130,246,0.15)]",
                  index === 0
                    ? "border-blue-300/40 bg-blue-500 text-white"
                    : "border-blue-400/20 bg-[#071126] text-blue-100",
                ].join(" ")}
              >
                {item.number}
              </div>

              <div className="mt-5 text-[10px] font-black uppercase tracking-[0.22em] text-blue-100/[0.58]">
                {item.label}
              </div>

              <h3 className="mt-3 text-lg font-black text-white">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-white/[0.54]">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[38px] border border-white/10 bg-[#030712]/72 p-5 shadow-[0_30px_110px_rgba(0,0,0,0.44)] backdrop-blur-xl sm:p-7 lg:p-8">
        <SectionHeading
          eyebrow="Long-Term Vision"
          title="From the KRX foundation to a broader builder economy."
          description="KORAX development is structured around expanding the token lifecycle, builder systems, public project layer, and wider ecosystem integrations."
          action={{
            href: "/roadmap",
            label: "View Full Roadmap",
          }}
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {visionPhases.map((phase, index) => (
            <article
              key={phase.phase}
              className="about-card flex flex-col rounded-[28px] border border-white/10 bg-black/30 p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs font-black uppercase tracking-[0.2em] text-blue-100">
                  {phase.phase}
                </div>

                <Badge tone={index < 2 ? "blue" : "slate"}>
                  {phase.status}
                </Badge>
              </div>

              <h3 className="mt-5 text-xl font-black text-white">
                {phase.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-white/[0.54]">
                {phase.description}
              </p>

              <div className="mt-6 space-y-3 border-t border-white/10 pt-5">
                {phase.items.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 text-sm leading-6 text-white/[0.58]"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-300" />
                    {item}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[38px] border border-white/10 bg-black/20 p-5 backdrop-blur-xl sm:p-7 lg:p-8">
        <SectionHeading
          eyebrow="Core Principles"
          title="The standards guiding KORAX development."
          description="The ecosystem is being built around understandable systems, practical utility, public information, and responsible communication."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {corePrinciples.map((item) => (
            <article
              key={item.number}
              className="about-card rounded-[28px] border border-white/10 bg-[#050914]/70 p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-xs font-black text-blue-100">
                  {item.number}
                </div>

                <Badge tone={item.tone}>{item.title}</Badge>
              </div>

              <h3 className="relative mt-5 text-lg font-black text-white">
                {item.title}
              </h3>

              <p className="relative mt-3 text-sm leading-7 text-white/[0.55]">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[38px] border border-white/10 bg-[#030712]/76 p-5 shadow-[0_30px_110px_rgba(0,0,0,0.44)] backdrop-blur-xl sm:p-7 lg:p-8">
        <SectionHeading
          eyebrow="Trust & Responsibility"
          title="Clear expectations before ecosystem interaction."
          description="KORAX is an early-stage crypto and technology ecosystem. Users should understand the technical structure, timing, utility, and risks before participating."
          action={{
            href: "/terms",
            label: "Read Terms",
          }}
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {trustItems.map((item, index) => (
            <article
              key={item.title}
              className="about-card rounded-[28px] border border-white/10 bg-black/30 p-5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-xs font-black text-blue-100">
                {String(index + 1).padStart(2, "0")}
              </div>

              <h3 className="mt-5 text-lg font-black text-white">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-white/[0.55]">
                {item.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/terms"
            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white/[0.68] transition hover:bg-white/[0.08] hover:text-white"
          >
            Terms of Service
          </Link>

          <Link
            href="/privacy"
            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white/[0.68] transition hover:bg-white/[0.08] hover:text-white"
          >
            Privacy Policy
          </Link>

          <Link
            href="/docs"
            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white/[0.68] transition hover:bg-white/[0.08] hover:text-white"
          >
            Project Documentation
          </Link>
        </div>
      </section>

      <section className="rounded-[38px] border border-white/10 bg-black/20 p-5 backdrop-blur-xl sm:p-7 lg:p-8">
        <SectionHeading
          eyebrow="Frequently Asked Questions"
          title="Understanding the KORAX direction."
          description="Official KORAX information should always be confirmed through korax.fund and the official social channels linked on the website."
        />

        <div className="mt-8 grid gap-3 lg:grid-cols-2">
          {faqs.map((faq, index) => (
            <details
              key={faq.question}
              className="about-faq group rounded-[24px] border border-white/10 bg-[#050914]/70 p-5 transition duration-300"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-black text-white">
                <span className="flex items-center gap-3">
                  <span className="text-xs font-black text-blue-100/[0.55]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {faq.question}
                </span>

                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.045] text-blue-100 transition duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-7 text-white/[0.57]">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[42px] border border-blue-400/25 bg-[#050a18] p-6 shadow-[0_35px_130px_rgba(0,0,0,0.55)] sm:p-9 lg:p-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(37,99,235,0.22),transparent_38%),radial-gradient(circle_at_right,rgba(34,211,238,0.11),transparent_34%)]" />

        <div className="pointer-events-none absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:46px_46px]" />

        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-3xl">
            <div className="text-xs font-black uppercase tracking-[0.3em] text-blue-100">
              The KORAX Ecosystem
            </div>

            <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.025em] text-white sm:text-5xl">
              Your path to the top begins with KORAX.
            </h2>

            <p className="mt-5 text-sm leading-8 text-white/[0.6] sm:text-base">
              Explore the documentation, examine the development roadmap, test
              the builder tools, and follow the expansion of the KORAX
              ecosystem.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              href="/docs"
              className="inline-flex min-w-[210px] items-center justify-center rounded-2xl bg-blue-500 px-6 py-3.5 text-sm font-black text-white shadow-[0_0_40px_rgba(59,130,246,0.32)] transition duration-300 hover:-translate-y-0.5 hover:bg-blue-400"
            >
              Explore Documentation
              <span className="ml-2">↗</span>
            </Link>

            <Link
              href="/roadmap"
              className="inline-flex min-w-[210px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] px-6 py-3.5 text-sm font-black text-white transition duration-300 hover:-translate-y-0.5 hover:border-blue-400/25 hover:bg-blue-500/10"
            >
              View Roadmap
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-amber-300/15 bg-amber-300/[0.045] px-5 py-4 text-xs leading-6 text-white/[0.45]">
        <span className="font-black text-amber-100/[0.78]">
          Important information:
        </span>{" "}
        KORAX is an early-stage Web3 ecosystem, and KRX is a crypto asset.
        Crypto assets are volatile and can lose part or all of their value.
        KORAX does not guarantee profit, liquidity, adoption, exchange listing,
        or future market performance.
      </section>
    </div>
  );
}