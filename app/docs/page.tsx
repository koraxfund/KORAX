import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "KORAX Documentation & Whitepaper",
  description:
    "Explore the official KORAX documentation covering KRX tokenomics, presale, claim, staking, 1,500 KRX builder access, Token Builder AI, Website Builder AI, project registry, and launch infrastructure.",
  alternates: {
    canonical: "/docs",
  },
  openGraph: {
    title: "KORAX Documentation & Whitepaper",
    description:
      "Official documentation for the KORAX BNB Chain builder ecosystem and KRX utility infrastructure.",
    url: "https://www.korax.fund/docs",
    images: [
      {
        url: "/Korax-logo.png",
        width: 1200,
        height: 630,
        alt: "KORAX Documentation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KORAX Documentation & Whitepaper",
    description:
      "KRX tokenomics, presale, staking, AI builder tools, registry, and launch infrastructure.",
    images: ["/Korax-logo.png"],
  },
};

type Tone = "blue" | "cyan" | "slate" | "amber";

type StatusCard = {
  number: string;
  label: string;
  value: string;
  description: string;
  href: string;
  tone: Tone;
};

type DocumentationSection = {
  id: string;
  number: string;
  label: string;
};

const documentationSections: DocumentationSection[] = [
  { id: "overview", number: "01", label: "Ecosystem Overview" },
  { id: "architecture", number: "02", label: "System Architecture" },
  { id: "status", number: "03", label: "Current Status" },
  { id: "tokenomics", number: "04", label: "KRX Tokenomics" },
  { id: "presale", number: "05", label: "Presale Model" },
  { id: "claim", number: "06", label: "Claim & Vesting" },
  { id: "staking", number: "07", label: "Staking & Access" },
  { id: "builders", number: "08", label: "AI Builder Tools" },
  { id: "launch", number: "09", label: "Launch & Registry" },
  { id: "security", number: "10", label: "Security Model" },
  { id: "risks", number: "11", label: "Risks & Responsibility" },
];

const heroHighlights = [
  "BNB Chain infrastructure",
  "Fixed 100M KRX supply",
  "AI-assisted Web3 builders",
  "Project registry and launch systems",
];

const ecosystemStatus: StatusCard[] = [
  {
    number: "01",
    label: "KRX Presale",
    value: "Live",
    description:
      "A five-stage KRX presale with progressive pricing and supported on-chain participation.",
    href: "/presale",
    tone: "cyan",
  },
  {
    number: "02",
    label: "Claim Portal",
    value: "Prepared",
    description:
      "Purchased balances are recorded for release after presale completion and claim activation.",
    href: "/claim",
    tone: "slate",
  },
  {
    number: "03",
    label: "KRX Staking",
    value: "Prepared",
    description:
      "Fixed-duration staking plans support rewards and qualifying ecosystem access.",
    href: "/staking",
    tone: "slate",
  },
  {
    number: "04",
    label: "Token Builder AI",
    value: "Live",
    description:
      "AI-assisted strategy, token configuration, staking preparation, and project deployment.",
    href: "/ai",
    tone: "blue",
  },
  {
    number: "05",
    label: "Website Builder AI",
    value: "Live",
    description:
      "Generates structured Web3 websites and deployment-ready project output.",
    href: "/website-builder-ai",
    tone: "blue",
  },
  {
    number: "06",
    label: "Launch Infrastructure",
    value: "Live",
    description:
      "Project creation, public registry visibility, sale preparation, and launch workflows.",
    href: "/launch",
    tone: "blue",
  },
];

const presaleStages = [
  {
    stage: "Stage 1",
    allocation: "10,000,000 KRX",
    price: "$0.05",
    status: "Current",
  },
  {
    stage: "Stage 2",
    allocation: "10,000,000 KRX",
    price: "$0.07",
    status: "Upcoming",
  },
  {
    stage: "Stage 3",
    allocation: "10,000,000 KRX",
    price: "$0.09",
    status: "Upcoming",
  },
  {
    stage: "Stage 4",
    allocation: "10,000,000 KRX",
    price: "$0.11",
    status: "Upcoming",
  },
  {
    stage: "Stage 5",
    allocation: "10,000,000 KRX",
    price: "$0.13",
    status: "Upcoming",
  },
];

const tokenomics = [
  {
    number: "01",
    title: "Maximum Supply",
    value: "100,000,000 KRX",
    percentage: "100%",
    description:
      "The complete maximum KRX supply. The ecosystem is designed without future inflationary reward minting.",
  },
  {
    number: "02",
    title: "Presale Allocation",
    value: "50,000,000 KRX",
    percentage: "50%",
    description:
      "Distributed through five presale stages containing 10,000,000 KRX each.",
  },
  {
    number: "03",
    title: "Staking & Ecosystem",
    value: "50,000,000 KRX",
    percentage: "50%",
    description:
      "Reserved from the fixed supply for staking rewards, utility, access, and ecosystem support.",
  },
];

const claimReleases = [
  {
    number: "01",
    percentage: "25%",
    title: "Initial Release",
    timing: "At claim activation",
    description:
      "The first portion becomes available when the presale has ended and claim is officially enabled.",
  },
  {
    number: "02",
    percentage: "25%",
    title: "Second Release",
    timing: "30 days later",
    description:
      "The second scheduled portion becomes claimable after the next release interval.",
  },
  {
    number: "03",
    percentage: "25%",
    title: "Third Release",
    timing: "60 days after activation",
    description:
      "The cumulative unlocked allocation reaches 75% after the third release.",
  },
  {
    number: "04",
    percentage: "25%",
    title: "Final Release",
    timing: "90 days after activation",
    description:
      "The final scheduled release completes the purchased KRX allocation.",
  },
];

const stakingPlans = [
  {
    duration: "1 Day",
    reward: "0.15%",
    type: "Flexible entry",
    access: false,
  },
  {
    duration: "14 Days",
    reward: "3.5%",
    type: "Short duration",
    access: false,
  },
  {
    duration: "1 Month",
    reward: "7.5%",
    type: "Monthly plan",
    access: false,
  },
  {
    duration: "3 Months",
    reward: "22.5%",
    type: "Quarter plan",
    access: false,
  },
  {
    duration: "6 Months",
    reward: "45%",
    type: "Medium term",
    access: false,
  },
  {
    duration: "9 Months",
    reward: "67.5%",
    type: "Long term",
    access: false,
  },
  {
    duration: "12 Months",
    reward: "90%",
    type: "Builder access plan",
    access: true,
  },
];

const builderTools = [
  {
    number: "01",
    code: "AI",
    title: "Token Builder AI",
    description:
      "Transforms a project idea into structured positioning, utility direction, tokenomics, roadmap, risk analysis, staking configuration, and deployment preparation.",
    href: "/ai",
    status: "Live",
  },
  {
    number: "02",
    code: "WEB",
    title: "Website Builder AI",
    description:
      "Generates branded Web3 website sections, structured project content, deployment-ready files, and connected project presentation.",
    href: "/website-builder-ai",
    status: "Live",
  },
  {
    number: "03",
    code: "REG",
    title: "Project Registry",
    description:
      "Connects created projects with on-chain registration and public visibility through KORAX ecosystem pages.",
    href: "/launch",
    status: "Live",
  },
  {
    number: "04",
    code: "LCH",
    title: "Launch Infrastructure",
    description:
      "Supports project launch preparation, contribution logic, supported payment assets, public presentation, and claim workflows.",
    href: "/launch",
    status: "Live",
  },
];

const architectureSteps = [
  {
    number: "01",
    title: "Project Intelligence",
    description:
      "The builder defines the problem, audience, utility, market position, risks, revenue logic, and growth direction.",
  },
  {
    number: "02",
    title: "Token Infrastructure",
    description:
      "The project configures supply, token permissions, staking allocation, custom plans, and metadata.",
  },
  {
    number: "03",
    title: "Website & Identity",
    description:
      "Website Builder AI prepares the project structure, branding direction, content, and public presentation.",
  },
  {
    number: "04",
    title: "Registry & Launch",
    description:
      "The project can connect with public registry visibility and KORAX launch infrastructure.",
  },
];

const securityItems = [
  {
    number: "01",
    title: "User-Controlled Wallets",
    description:
      "Users approve blockchain transactions through their own connected wallets. KORAX does not require access to private keys or seed phrases.",
  },
  {
    number: "02",
    title: "Separated Contract Systems",
    description:
      "Presale, claim, staking, access, AI deployment, vault, registry, and launch responsibilities are divided across dedicated infrastructure.",
  },
  {
    number: "03",
    title: "Fixed-Supply Logic",
    description:
      "Staking and ecosystem rewards are allocated from the existing KRX supply rather than created through unlimited reward minting.",
  },
  {
    number: "04",
    title: "Public On-Chain Activity",
    description:
      "Contract interactions and project deployment transactions can be inspected through BNB Chain blockchain explorers.",
  },
  {
    number: "05",
    title: "Access Through Commitment",
    description:
      "Qualifying project slots are connected with eligible long-term KRX staking rather than unrestricted anonymous deployment.",
  },
  {
    number: "06",
    title: "Project Owner Responsibility",
    description:
      "Created projects remain responsible for security testing, contract reviews, disclosures, legal obligations, and public claims.",
  },
];

const risks = [
  "Crypto assets can lose part or all of their value.",
  "Smart contracts can contain unknown bugs or technical vulnerabilities.",
  "Blockchain transactions are generally irreversible after confirmation.",
  "Gas costs, market liquidity, regulation, and network conditions can change.",
  "AI-generated strategy, text, tokenomics, and visuals can contain errors.",
  "KORAX does not guarantee profit, adoption, liquidity, or exchange listings.",
];

function Badge({
  children,
  tone = "blue",
}: {
  children: ReactNode;
  tone?: Tone;
}) {
  const styles: Record<Tone, string> = {
    blue:
      "border-blue-400/25 bg-blue-500/10 text-blue-100 shadow-[0_0_22px_rgba(59,130,246,0.12)]",
    cyan:
      "border-cyan-300/25 bg-cyan-400/10 text-cyan-100 shadow-[0_0_22px_rgba(34,211,238,0.10)]",
    slate: "border-white/10 bg-white/[0.045] text-white/55",
    amber:
      "border-amber-300/20 bg-amber-300/[0.06] text-amber-100/80",
  };

  return (
    <span
      className={[
        "inline-flex rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.17em]",
        styles[tone],
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function SectionHeading({
  number,
  eyebrow,
  title,
  description,
  action,
}: {
  number: string;
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
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-[10px] font-black text-blue-100">
            {number}
          </span>

          <span className="text-[10px] font-black uppercase tracking-[0.28em] text-blue-100">
            {eyebrow}
          </span>
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

      {action ? (
        <Link
          href={action.href}
          className="inline-flex w-fit shrink-0 items-center justify-center rounded-2xl border border-blue-400/25 bg-blue-500/10 px-5 py-3 text-sm font-black text-blue-100 transition duration-300 hover:-translate-y-0.5 hover:border-blue-300/40 hover:bg-blue-500/20 hover:text-white"
        >
          {action.label}
          <span className="ml-2">↗</span>
        </Link>
      ) : null}
    </div>
  );
}

function DocumentationCard({
  number,
  title,
  value,
  description,
  tone = "blue",
}: {
  number: string;
  title: string;
  value?: string;
  description: string;
  tone?: Tone;
}) {
  return (
    <article className="docs-card relative overflow-hidden rounded-[28px] border border-white/10 bg-[#040813]/72 p-5 shadow-[0_20px_65px_rgba(0,0,0,0.28)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.11),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.06),transparent_38%)]" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/25">
          Module {number}
        </div>

        <Badge tone={tone}>{title}</Badge>
      </div>

      {value ? (
        <div className="relative mt-5 text-xl font-black text-white sm:text-2xl">
          {value}
        </div>
      ) : (
        <h3 className="relative mt-5 text-xl font-black text-white">
          {title}
        </h3>
      )}

      <p className="relative mt-3 text-sm leading-7 text-white/54">
        {description}
      </p>
    </article>
  );
}

function DocsBrandVisual() {
  return (
    <div className="docs-command-core relative min-h-[520px] overflow-hidden rounded-[36px] border border-white/10 bg-[#020611] shadow-[0_35px_120px_rgba(0,0,0,0.62)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.28),transparent_32%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.13),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.10),transparent_36%)]" />

      <div className="docs-core-grid pointer-events-none absolute inset-0 opacity-[0.075] [background-image:linear-gradient(rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="docs-orbit docs-orbit-one pointer-events-none absolute left-1/2 top-[43%] h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/15" />

      <div className="docs-orbit docs-orbit-two pointer-events-none absolute left-1/2 top-[43%] h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />

      <div className="docs-orbit docs-orbit-three pointer-events-none absolute left-1/2 top-[43%] h-[212px] w-[212px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />

      <div className="docs-logo-glow pointer-events-none absolute left-1/2 top-[43%] h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/25 blur-3xl" />

      <div className="absolute left-1/2 top-[43%] z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <Image
          src="/Korax-logo.png"
          alt="KORAX official logo"
          width={420}
          height={420}
          priority
          draggable={false}
          className="docs-logo-spin h-44 w-44 bg-transparent object-contain drop-shadow-[0_0_44px_rgba(59,130,246,0.95)] sm:h-52 sm:w-52"
        />

        <Image
          src="/korax-wordmark.png"
          alt="KORAX"
          width={520}
          height={150}
          priority
          draggable={false}
          className="docs-wordmark-float mt-3 h-10 w-auto max-w-[230px] bg-transparent object-contain drop-shadow-[0_0_24px_rgba(59,130,246,0.85)] sm:h-12 sm:max-w-[285px]"
        />
      </div>

      <div className="docs-data-chip absolute left-5 top-5 hidden min-w-[145px] rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur-xl sm:block">
        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
          Document
        </div>

        <div className="mt-2 font-black text-white">Whitepaper</div>

        <div className="mt-1 text-xs text-blue-100/65">
          Ecosystem overview
        </div>
      </div>

      <div className="docs-data-chip docs-data-delay absolute right-5 top-5 hidden min-w-[145px] rounded-2xl border border-white/10 bg-black/50 p-4 text-right backdrop-blur-xl sm:block">
        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
          Network
        </div>

        <div className="mt-2 font-black text-blue-100">BNB Chain</div>

        <div className="mt-1 text-xs text-white/42">
          EVM infrastructure
        </div>
      </div>

      <div className="docs-data-chip docs-data-two absolute bottom-28 left-5 hidden min-w-[145px] rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur-xl sm:block">
        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
          Native Utility
        </div>

        <div className="mt-2 font-black text-white">KRX</div>

        <div className="mt-1 text-xs text-white/42">Fixed supply</div>
      </div>

      <div className="docs-data-chip docs-data-three absolute bottom-28 right-5 hidden min-w-[145px] rounded-2xl border border-white/10 bg-black/50 p-4 text-right backdrop-blur-xl sm:block">
        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
          Builder Access
        </div>

        <div className="mt-2 font-black text-cyan-100">1,500 KRX</div>

        <div className="mt-1 text-xs text-white/42">
          12-month plan
        </div>
      </div>

      <div className="absolute bottom-5 left-5 right-5 z-20 overflow-hidden rounded-[24px] border border-blue-400/20 bg-blue-500/10 p-4 backdrop-blur-xl">
        <div className="docs-panel-scan pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-blue-300/10 to-transparent" />

        <div className="relative flex items-center justify-between gap-4">
          <div>
            <div className="text-[9px] font-black uppercase tracking-[0.24em] text-white/38">
              KORAX Documentation
            </div>

            <div className="mt-1 text-lg font-black text-white">
              Build • Register • Launch
            </div>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-400/10">
            <span className="docs-live-dot h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.95)]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TableOfContents() {
  return (
    <aside className="xl:sticky xl:top-28 xl:self-start">
      <div className="rounded-[30px] border border-white/10 bg-[#030711]/82 p-4 shadow-[0_24px_90px_rgba(0,0,0,0.4)] backdrop-blur-xl">
        <div className="border-b border-white/10 px-2 pb-4">
          <div className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-100">
            Documentation Index
          </div>

          <div className="mt-2 text-sm leading-6 text-white/45">
            Navigate through the official KORAX ecosystem documentation.
          </div>
        </div>

        <nav className="mt-3 grid gap-1">
          {documentationSections.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-white/58 transition hover:bg-blue-500/10 hover:text-white"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/25 text-[9px] font-black text-blue-100/65 transition group-hover:border-blue-400/25">
                {item.number}
              </span>

              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="mt-4 border-t border-white/10 pt-4">
          <Link
            href="/presale"
            className="flex w-full items-center justify-center rounded-2xl bg-blue-500 px-4 py-3 text-sm font-black text-white shadow-[0_0_28px_rgba(59,130,246,0.25)] transition hover:bg-blue-400"
          >
            Enter KRX Presale
          </Link>

          <Link
            href="/roadmap"
            className="mt-2 flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm font-bold text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            Development Roadmap
          </Link>
        </div>
      </div>
    </aside>
  );
}

function DocumentationSectionCard({
  id,
  children,
  accent = false,
}: {
  id: string;
  children: ReactNode;
  accent?: boolean;
}) {
  return (
    <section
      id={id}
      className={[
        "scroll-mt-32 rounded-[38px] border p-5 shadow-[0_28px_100px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-7 lg:p-8",
        accent
          ? "border-blue-400/20 bg-blue-500/[0.065]"
          : "border-white/10 bg-[#030711]/76",
      ].join(" ")}
    >
      {children}
    </section>
  );
}

export default function DocsPage() {
  return (
    <div className="space-y-8 overflow-hidden">
      <style>{`
        @keyframes docsLogoSpin {
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

        @keyframes docsWordmarkFloat {
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

        @keyframes docsOrbit {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }

          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes docsOrbitReverse {
          from {
            transform: translate(-50%, -50%) rotate(360deg);
          }

          to {
            transform: translate(-50%, -50%) rotate(0deg);
          }
        }

        @keyframes docsGlow {
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

        @keyframes docsGrid {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(-16px, -16px, 0);
          }
        }

        @keyframes docsScan {
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

        @keyframes docsDataFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-7px);
          }
        }

        @keyframes docsPulse {
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

        .docs-card {
          position: relative;
          transform-style: preserve-3d;
          transition:
            transform 230ms ease,
            border-color 230ms ease,
            background-color 230ms ease,
            box-shadow 230ms ease;
        }

        .docs-card::before {
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

        .docs-card:hover {
          transform: translateY(-6px);
          border-color: rgba(96, 165, 250, 0.35);
          box-shadow: 0 30px 90px rgba(37, 99, 235, 0.13);
        }

        .docs-card:hover::before {
          opacity: 1;
        }

        .docs-logo-spin {
          transform-style: preserve-3d;
          animation: docsLogoSpin 9s linear infinite;
          will-change: transform;
          backface-visibility: visible;
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .docs-wordmark-float {
          animation: docsWordmarkFloat 4.5s ease-in-out infinite;
          will-change: transform;
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .docs-orbit-one {
          animation: docsOrbit 20s linear infinite;
        }

        .docs-orbit-two {
          animation: docsOrbitReverse 16s linear infinite;
        }

        .docs-orbit-three {
          animation: docsOrbit 12s linear infinite;
        }

        .docs-orbit::before,
        .docs-orbit::after {
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

        .docs-orbit::before {
          left: 50%;
          top: -4px;
          transform: translateX(-50%);
        }

        .docs-orbit::after {
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
        }

        .docs-logo-glow {
          animation: docsGlow 3.8s ease-in-out infinite;
        }

        .docs-core-grid {
          animation: docsGrid 10s ease-in-out infinite;
        }

        .docs-data-chip {
          animation: docsDataFloat 5s ease-in-out infinite;
        }

        .docs-data-delay {
          animation-delay: 0.7s;
        }

        .docs-data-two {
          animation-delay: 1.4s;
        }

        .docs-data-three {
          animation-delay: 2s;
        }

        .docs-panel-scan,
        .docs-hero-scan {
          animation: docsScan 4.8s ease-in-out infinite;
        }

        .docs-live-dot {
          animation: docsPulse 1.7s ease-in-out infinite;
        }

        @media (max-width: 640px) {
          .docs-command-core {
            min-height: 450px;
          }

          .docs-orbit-one {
            height: 280px;
            width: 280px;
          }

          .docs-orbit-two {
            height: 220px;
            width: 220px;
          }

          .docs-orbit-three {
            height: 168px;
            width: 168px;
          }
        }

        @media (hover: none) {
          .docs-card:hover {
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .docs-logo-spin,
          .docs-wordmark-float,
          .docs-orbit-one,
          .docs-orbit-two,
          .docs-orbit-three,
          .docs-logo-glow,
          .docs-core-grid,
          .docs-data-chip,
          .docs-panel-scan,
          .docs-hero-scan,
          .docs-live-dot {
            animation: none;
          }

          .docs-card:hover {
            transform: none;
          }
        }
      `}</style>

      <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[#030711]/88 p-5 shadow-[0_40px_150px_rgba(0,0,0,0.68)] backdrop-blur-2xl sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.25),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.12),transparent_35%)]" />

        <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:52px_52px]" />

        <div className="docs-hero-scan pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent" />

        <div className="relative grid gap-10 xl:grid-cols-[1.04fr_.96fr] xl:items-center">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-blue-100 shadow-[0_0_30px_rgba(59,130,246,0.16)]">
              <span className="docs-live-dot h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.95)]" />
              Official KORAX Documentation
            </div>

            <h1 className="mt-7 text-4xl font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              KORAX ecosystem
              <span className="block bg-gradient-to-r from-blue-100 via-white to-cyan-200 bg-clip-text text-transparent drop-shadow-[0_0_22px_rgba(59,130,246,0.48)]">
                documentation and whitepaper.
              </span>
            </h1>

            <p className="mt-6 max-w-4xl text-base leading-8 text-white/62 sm:text-lg">
              KORAX is a BNB Chain builder ecosystem combining KRX, presale,
              claim, staking, Token Builder AI, Website Builder AI, project
              registry, and launch infrastructure through one connected Web3
              workflow.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {heroHighlights.map((item) => (
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
                href="#overview"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-blue-500 px-6 py-3 text-sm font-black text-white shadow-[0_0_40px_rgba(59,130,246,0.34)] transition duration-300 hover:-translate-y-0.5 hover:bg-blue-400"
              >
                Read Documentation
                <span className="ml-2">↓</span>
              </a>

              <Link
                href="/roadmap"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-blue-400/25 bg-blue-500/10 px-6 py-3 text-sm font-black text-blue-100 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-500/20 hover:text-white"
              >
                View Development Roadmap
              </Link>

              <Link
                href="/presale"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-black/30 px-6 py-3 text-sm font-bold text-white/75 transition duration-300 hover:-translate-y-0.5 hover:bg-white/[0.07] hover:text-white"
              >
                Open KRX Presale
              </Link>
            </div>
          </div>

          <DocsBrandVisual />
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[28px] border border-blue-400/20 bg-blue-500/[0.07] px-5 py-4 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(59,130,246,0.08),transparent,rgba(34,211,238,0.07))]" />

        <div className="relative grid gap-4 text-center sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Maximum Supply",
              value: "100M KRX",
            },
            {
              label: "Presale Allocation",
              value: "50M KRX",
            },
            {
              label: "Builder Access",
              value: "1,500 KRX",
            },
            {
              label: "Primary Network",
              value: "BNB Chain",
            },
          ].map((item, index) => (
            <div
              key={item.label}
              className={[
                "px-4 py-2",
                index > 0 ? "lg:border-l lg:border-white/10" : "",
              ].join(" ")}
            >
              <div className="text-[9px] font-black uppercase tracking-[0.22em] text-white/35">
                {item.label}
              </div>

              <div className="mt-1 text-sm font-black text-blue-100">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-7 xl:grid-cols-[285px_minmax(0,1fr)]">
        <TableOfContents />

        <main className="min-w-0 space-y-7">
          <DocumentationSectionCard id="overview">
            <SectionHeading
              number="01"
              eyebrow="Ecosystem Overview"
              title="A connected Web3 builder infrastructure."
              description="KORAX is designed to reduce the fragmentation normally experienced when creating a blockchain project. Instead of relying on disconnected services for token planning, websites, staking, registration, and launch preparation, KORAX connects those stages through one expanding ecosystem."
              action={{
                href: "/about",
                label: "About KORAX",
              }}
            />

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <DocumentationCard
                number="01"
                title="Native Utility"
                value="KRX"
                description="KRX connects presale participation, staking, builder access, project creation, and wider ecosystem utility."
                tone="blue"
              />

              <DocumentationCard
                number="02"
                title="Primary Network"
                value="BNB Chain"
                description="KORAX currently uses BNB Chain-compatible wallet, contract, token, deployment, and launch infrastructure."
                tone="cyan"
              />

              <DocumentationCard
                number="03"
                title="Builder Direction"
                value="AI + On-chain"
                description="AI-assisted project intelligence is connected with practical token, website, registry, and deployment workflows."
                tone="blue"
              />

              <DocumentationCard
                number="04"
                title="Ecosystem Goal"
                value="Build & Launch"
                description="The ecosystem direction is to help creators move from a raw idea toward a more complete public Web3 project."
                tone="cyan"
              />
            </div>
          </DocumentationSectionCard>

          <DocumentationSectionCard id="architecture" accent>
            <SectionHeading
              number="02"
              eyebrow="System Architecture"
              title="From project intelligence to public launch."
              description="The KORAX architecture is structured as a progressive builder workflow. Each module supports a different development stage while sharing data and direction with the wider ecosystem."
            />

            <div className="relative mt-8 grid gap-4 lg:grid-cols-4">
              <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-gradient-to-r from-blue-400/70 via-blue-400/20 to-cyan-300/20 lg:block" />

              {architectureSteps.map((item, index) => (
                <article
                  key={item.number}
                  className="docs-card relative rounded-[28px] border border-white/10 bg-black/25 p-5"
                >
                  <div
                    className={[
                      "relative z-10 flex h-14 w-14 items-center justify-center rounded-full border text-sm font-black",
                      index === 0
                        ? "border-blue-300/35 bg-blue-500 text-white shadow-[0_0_26px_rgba(59,130,246,0.22)]"
                        : "border-blue-400/20 bg-[#061126] text-blue-100",
                    ].join(" ")}
                  >
                    {item.number}
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
          </DocumentationSectionCard>

          <DocumentationSectionCard id="status">
            <SectionHeading
              number="03"
              eyebrow="Current Ecosystem Status"
              title="KORAX modules and availability."
              description="The following statuses describe the current public direction of each KORAX module. Claim and staking activate according to the KRX lifecycle rather than being available during the active presale."
            />

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {ecosystemStatus.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="docs-card group rounded-[28px] border border-white/10 bg-black/25 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-xs font-black text-blue-100">
                      {item.number}
                    </span>

                    <Badge tone={item.tone}>{item.value}</Badge>
                  </div>

                  <h3 className="mt-5 text-lg font-black text-white">
                    {item.label}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-white/52">
                    {item.description}
                  </p>

                  <div className="mt-5 text-sm font-black text-blue-100 transition group-hover:text-white">
                    Open Module
                    <span className="ml-2 transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </DocumentationSectionCard>

          <DocumentationSectionCard id="tokenomics">
            <SectionHeading
              number="04"
              eyebrow="KRX Tokenomics"
              title="Fixed supply with clear allocation."
              description="KRX has a maximum supply of 100,000,000 tokens. Presale, staking rewards, and ecosystem utility are structured from this fixed supply rather than unlimited future reward minting."
            />

            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {tokenomics.map((item) => (
                <article
                  key={item.number}
                  className="docs-card rounded-[28px] border border-white/10 bg-black/25 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-xs font-black text-blue-100">
                      {item.number}
                    </span>

                    <Badge tone="blue">{item.percentage}</Badge>
                  </div>

                  <h3 className="mt-5 text-sm font-black uppercase tracking-[0.15em] text-white/45">
                    {item.title}
                  </h3>

                  <div className="mt-3 text-2xl font-black text-white">
                    {item.value}
                  </div>

                  <p className="mt-3 text-sm leading-7 text-white/52">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-6 overflow-hidden rounded-[26px] border border-white/10 bg-black/30 p-4">
              <div className="flex h-12 overflow-hidden rounded-2xl">
                <div className="flex w-1/2 items-center justify-center bg-blue-500 text-xs font-black text-white sm:text-sm">
                  Presale — 50%
                </div>

                <div className="flex w-1/2 items-center justify-center bg-cyan-400/20 text-xs font-black text-cyan-100 sm:text-sm">
                  Staking & Ecosystem — 50%
                </div>
              </div>

              <p className="mt-4 text-xs leading-6 text-white/42">
                Token allocation categories describe the maximum KRX supply
                structure. Actual distribution follows the deployed contract
                logic and official ecosystem processes.
              </p>
            </div>
          </DocumentationSectionCard>

          <DocumentationSectionCard id="presale" accent>
            <SectionHeading
              number="05"
              eyebrow="Presale Model"
              title="Five stages with progressive KRX pricing."
              description="The KRX presale contains 50,000,000 KRX divided equally across five stages. Each stage contains 10,000,000 KRX and uses a progressively higher token price."
              action={{
                href: "/presale",
                label: "Open Presale",
              }}
            />

            <div className="mt-8 grid gap-4 md:grid-cols-5">
              {presaleStages.map((item, index) => (
                <article
                  key={item.stage}
                  className={[
                    "docs-card rounded-[26px] border p-4",
                    index === 0
                      ? "border-blue-400/30 bg-blue-500/10"
                      : "border-white/10 bg-black/25",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-black uppercase tracking-[0.14em] text-blue-100">
                      {item.stage}
                    </div>

                    <span
                      className={[
                        "h-2 w-2 rounded-full",
                        index === 0
                          ? "bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.9)]"
                          : "bg-white/25",
                      ].join(" ")}
                    />
                  </div>

                  <div className="mt-5 text-2xl font-black text-white">
                    {item.price}
                  </div>

                  <div className="mt-3 text-xs leading-6 text-white/45">
                    {item.allocation}
                  </div>

                  <div className="mt-4 border-t border-white/10 pt-3 text-[9px] font-black uppercase tracking-[0.18em] text-white/30">
                    {item.status}
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Supported Assets",
                  value: "BNB • USDT • USDC",
                  description:
                    "Participation routes depend on the configured presale contract and supported payment infrastructure.",
                },
                {
                  title: "Planned Listing Price",
                  value: "$0.15",
                  description:
                    "The planned listing target is not a guaranteed future market price or exchange listing.",
                },
                {
                  title: "Purchased Balances",
                  value: "Recorded On-chain",
                  description:
                    "Purchased KRX is recorded for the participating wallet and later released through the claim system.",
                },
              ].map((item) => (
                <DocumentationCard
                  key={item.title}
                  number="—"
                  title={item.title}
                  value={item.value}
                  description={item.description}
                />
              ))}
            </div>
          </DocumentationSectionCard>

          <DocumentationSectionCard id="claim">
            <SectionHeading
              number="06"
              eyebrow="Claim & Vesting"
              title="Four scheduled 25% KRX releases."
              description="Presale purchases are not distributed immediately during the active sale. After the presale has ended and claim is officially enabled, purchased KRX becomes available according to the configured vesting schedule."
              action={{
                href: "/claim",
                label: "Open Claim Portal",
              }}
            />

            <div className="relative mt-8 grid gap-4 lg:grid-cols-4">
              <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-gradient-to-r from-blue-400/70 via-blue-400/20 to-cyan-300/20 lg:block" />

              {claimReleases.map((item, index) => (
                <article
                  key={item.number}
                  className="docs-card relative rounded-[27px] border border-white/10 bg-black/25 p-5"
                >
                  <div
                    className={[
                      "relative z-10 flex h-14 w-14 items-center justify-center rounded-full border text-sm font-black",
                      index === 0
                        ? "border-blue-300/35 bg-blue-500 text-white"
                        : "border-blue-400/20 bg-[#061126] text-blue-100",
                    ].join(" ")}
                  >
                    {item.percentage}
                  </div>

                  <div className="mt-5 text-[9px] font-black uppercase tracking-[0.2em] text-white/30">
                    Release {item.number}
                  </div>

                  <h3 className="mt-2 font-black text-white">
                    {item.title}
                  </h3>

                  <div className="mt-3 text-xs font-bold text-blue-100/70">
                    {item.timing}
                  </div>

                  <p className="mt-3 text-sm leading-7 text-white/50">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-6 rounded-[26px] border border-blue-400/20 bg-blue-500/[0.07] p-5 text-sm leading-8 text-white/62">
              The Claim Portal reads purchased, claimed, claimable, and vested
              balances from the configured presale contract. The connected
              wallet approves the claim transaction and pays the required BNB
              Chain gas fee.
            </div>
          </DocumentationSectionCard>

          <DocumentationSectionCard id="staking" accent>
            <SectionHeading
              number="07"
              eyebrow="Staking & Builder Access"
              title="Fixed-duration rewards with a 1,500 KRX access requirement."
              description="KRX staking includes seven predefined lock plans. The 12-month plan also connects long-term staking commitment with KORAX builder access and project creation slots."
              action={{
                href: "/staking",
                label: "View Staking",
              }}
            />

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {stakingPlans.map((plan) => (
                <article
                  key={plan.duration}
                  className={[
                    "docs-card rounded-[26px] border p-5",
                    plan.access
                      ? "border-cyan-300/25 bg-cyan-400/[0.07]"
                      : "border-white/10 bg-black/25",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-xs font-black text-blue-100">
                      {plan.duration === "12 Months" ? "12M" : "KRX"}
                    </span>

                    {plan.access ? (
                      <Badge tone="cyan">Builder Access</Badge>
                    ) : (
                      <Badge tone="slate">Staking</Badge>
                    )}
                  </div>

                  <h3 className="mt-5 text-lg font-black text-white">
                    {plan.duration}
                  </h3>

                  <div className="mt-2 text-2xl font-black text-blue-100">
                    {plan.reward}
                  </div>

                  <p className="mt-3 text-sm text-white/45">{plan.type}</p>
                </article>
              ))}
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_.8fr]">
              <div className="rounded-[28px] border border-blue-400/25 bg-blue-500/10 p-6">
                <div className="text-[10px] font-black uppercase tracking-[0.24em] text-blue-100">
                  Project Slot Requirement
                </div>

                <div className="mt-3 text-4xl font-black text-white">
                  1,500 KRX
                </div>

                <p className="mt-4 text-sm leading-8 text-white/62">
                  An eligible 1,500 KRX stake in the qualifying 12-month plan
                  provides one KORAX project slot, subject to the deployed
                  Access Manager and project-slot contract logic.
                </p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-black/25 p-6">
                <div className="text-[10px] font-black uppercase tracking-[0.24em] text-white/35">
                  One Slot Can Connect
                </div>

                <div className="mt-4 space-y-3">
                  {[
                    "Token Builder AI project deployment",
                    "Website Builder AI project workflow",
                    "Launch creation infrastructure",
                    "Public project registry visibility",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 text-sm leading-7 text-white/57"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-300" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DocumentationSectionCard>

          <DocumentationSectionCard id="builders">
            <SectionHeading
              number="08"
              eyebrow="AI Builder Tools"
              title="Project intelligence connected with real infrastructure."
              description="KORAX builder tools are designed to help creators move from project concept to strategy, token setup, website generation, on-chain registration, and launch preparation."
            />

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {builderTools.map((item) => (
                <Link
                  key={item.number}
                  href={item.href}
                  className="docs-card group rounded-[28px] border border-white/10 bg-black/25 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-12 min-w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 px-2 text-[10px] font-black text-blue-100">
                        {item.code}
                      </span>

                      <span className="text-xs font-black tracking-[0.18em] text-white/25">
                        {item.number}
                      </span>
                    </div>

                    <Badge tone="blue">{item.status}</Badge>
                  </div>

                  <h3 className="mt-6 text-xl font-black text-white">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-white/52">
                    {item.description}
                  </p>

                  <div className="mt-5 text-sm font-black text-blue-100 transition group-hover:text-white">
                    Explore System
                    <span className="ml-2 transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-6 rounded-[26px] border border-amber-300/15 bg-amber-300/[0.045] p-5 text-sm leading-8 text-white/55">
              AI-generated project strategy, tokenomics, roadmaps, website
              content, and visuals should be reviewed before deployment or
              publication. AI output does not replace professional legal,
              security, financial, or smart-contract review.
            </div>
          </DocumentationSectionCard>

          <DocumentationSectionCard id="launch" accent>
            <SectionHeading
              number="09"
              eyebrow="Launch & Registry"
              title="Public project infrastructure inside KORAX."
              description="KORAX launch infrastructure is designed to connect eligible project creators with project registration, public presentation, contribution systems, supported payment assets, and future claim workflows."
              action={{
                href: "/launch",
                label: "Open Launch",
              }}
            />

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  number: "01",
                  title: "Project Creation",
                  description:
                    "Eligible builders prepare project configuration, token information, launch data, and public project details.",
                },
                {
                  number: "02",
                  title: "On-chain Registry",
                  description:
                    "Project information can be associated with public registry infrastructure and ecosystem visibility.",
                },
                {
                  number: "03",
                  title: "Sale Infrastructure",
                  description:
                    "Launch preparation can include contribution logic, supported payment assets, caps, stages, and timing.",
                },
                {
                  number: "04",
                  title: "Public Discovery",
                  description:
                    "Registered projects can be presented through KORAX launch and ecosystem discovery pages.",
                },
              ].map((item) => (
                <DocumentationCard
                  key={item.number}
                  number={item.number}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
          </DocumentationSectionCard>

          <DocumentationSectionCard id="security">
            <SectionHeading
              number="10"
              eyebrow="Security & Transparency"
              title="Clear separation of systems and user responsibility."
              description="KORAX is structured around public blockchain infrastructure, user-controlled wallets, fixed-supply token logic, and separation between major ecosystem responsibilities."
            />

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {securityItems.map((item) => (
                <DocumentationCard
                  key={item.number}
                  number={item.number}
                  title={item.title}
                  description={item.description}
                  tone="blue"
                />
              ))}
            </div>

            <div className="mt-6 rounded-[28px] border border-white/10 bg-black/25 p-6">
              <h3 className="text-lg font-black text-white">
                Smart-contract review
              </h3>

              <p className="mt-3 text-sm leading-8 text-white/55">
                Public blockchain code and transactions improve transparency,
                but public visibility does not automatically mean that a
                contract is free from vulnerabilities. Independent contract
                testing and professional security review remain important,
                especially before large-scale public usage.
              </p>
            </div>
          </DocumentationSectionCard>

          <DocumentationSectionCard id="risks">
            <SectionHeading
              number="11"
              eyebrow="Risks & Responsibility"
              title="Blockchain participation can result in financial loss."
              description="KORAX provides technology and ecosystem infrastructure. It does not provide guaranteed investment outcomes, guaranteed project success, or guaranteed future KRX performance."
            />

            <div className="mt-8 grid gap-3 md:grid-cols-2">
              {risks.map((risk, index) => (
                <div
                  key={risk}
                  className="flex items-start gap-4 rounded-[24px] border border-amber-300/15 bg-amber-300/[0.04] p-4"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-300/[0.07] text-[10px] font-black text-amber-100/80">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <p className="text-sm leading-7 text-white/55">{risk}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/terms"
                className="rounded-xl border border-white/10 bg-white/[0.045] px-4 py-2.5 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white"
              >
                Terms of Service
              </Link>

              <Link
                href="/privacy"
                className="rounded-xl border border-white/10 bg-white/[0.045] px-4 py-2.5 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white"
              >
                Privacy Policy
              </Link>

              <Link
                href="/roadmap"
                className="rounded-xl border border-white/10 bg-white/[0.045] px-4 py-2.5 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white"
              >
                Development Roadmap
              </Link>
            </div>
          </DocumentationSectionCard>
        </main>
      </div>

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
              Explore the presale, review the roadmap, test the builder tools,
              and follow the development of the KRX-powered KORAX ecosystem.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              href="/presale"
              className="inline-flex min-w-[210px] items-center justify-center rounded-2xl bg-blue-500 px-6 py-3.5 text-sm font-black text-white shadow-[0_0_40px_rgba(59,130,246,0.32)] transition duration-300 hover:-translate-y-0.5 hover:bg-blue-400"
            >
              Enter KRX Presale
              <span className="ml-2">↗</span>
            </Link>

            <Link
              href="/ai"
              className="inline-flex min-w-[210px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] px-6 py-3.5 text-sm font-black text-white transition duration-300 hover:-translate-y-0.5 hover:border-blue-400/25 hover:bg-blue-500/10"
            >
              Open Token Builder AI
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-amber-300/15 bg-amber-300/[0.045] px-5 py-4 text-xs leading-6 text-white/45">
        <span className="font-black text-amber-100/78">
          Documentation notice:
        </span>{" "}
        KORAX is an early-stage Web3 ecosystem, and KRX is a crypto asset.
        Documentation may be updated as contracts, modules, access conditions,
        policies, and ecosystem functionality develop. Users should always
        confirm current information through the official KORAX website and
        inspect wallet transactions before approval.
      </section>
    </div>
  );
}