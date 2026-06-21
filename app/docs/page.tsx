"use client";

import type { ReactNode } from "react";

const statusCards = [
  {
    icon: "🟢",
    label: "Presale",
    value: "Live",
    desc: "Structured KRX presale with staged pricing and on-chain participation.",
  },
  {
    icon: "🎁",
    label: "Claim",
    value: "Prepared",
    desc: "Claim system is prepared for release after presale completion.",
  },
  {
    icon: "🔒",
    label: "Staking",
    value: "Prepared",
    desc: "Staking infrastructure is prepared for post-claim ecosystem access.",
  },
  {
    icon: "🤖",
    label: "Token Builder AI",
    value: "Live",
    desc: "AI-assisted project and token creation workflow.",
  },
  {
    icon: "🌐",
    label: "Website Builder AI",
    value: "Live",
    desc: "Premium Web3 website generation and project website workflow.",
  },
  {
    icon: "🚀",
    label: "Launch",
    value: "Live",
    desc: "Launch infrastructure connected with public project visibility.",
  },
];

const presaleStages = [
  { stage: "Stage 1", amount: "10,000,000 KRX", price: "$0.05" },
  { stage: "Stage 2", amount: "10,000,000 KRX", price: "$0.07" },
  { stage: "Stage 3", amount: "10,000,000 KRX", price: "$0.09" },
  { stage: "Stage 4", amount: "10,000,000 KRX", price: "$0.11" },
  { stage: "Stage 5", amount: "10,000,000 KRX", price: "$0.13" },
];

const tokenomics = [
  {
    icon: "💰",
    title: "Total Supply",
    value: "100,000,000 KRX",
    desc: "Fixed supply model with no inflationary reward minting.",
  },
  {
    icon: "🔥",
    title: "Presale Allocation",
    value: "50,000,000 KRX",
    desc: "Allocated for structured presale participation across five stages.",
  },
  {
    icon: "💎",
    title: "Staking & Ecosystem",
    value: "50,000,000 KRX",
    desc: "Allocated for staking rewards, ecosystem access, and platform support.",
  },
];

const stakingPlans = [
  "1 Day",
  "14 Days",
  "1 Month",
  "3 Months",
  "6 Months",
  "9 Months",
  "12 Months",
];

const builderTools = [
  {
    icon: "🤖",
    title: "Token Builder AI",
    desc: "Helps users transform project ideas into structured token concepts, tokenomics, roadmap direction, utility planning, risk notes, and deploy-ready project logic.",
  },
  {
    icon: "🌐",
    title: "Website Builder AI",
    desc: "Generates premium Web3 website structures with sections, branding direction, content layout, project presentation, GitHub-ready files, and deployment workflow support.",
  },
  {
    icon: "🧬",
    title: "AI Deployment Flow",
    desc: "Designed to support project token deployment, vault setup, optional staking contracts, and registry entries through the KORAX builder system.",
  },
  {
    icon: "🚀",
    title: "Launch Infrastructure",
    desc: "Supports project sale logic, access-based participation, staged pricing, payment token support, claim phases, and public project visibility.",
  },
];

const securityItems = [
  {
    icon: "🔍",
    title: "Verified Contracts",
    desc: "KORAX is structured around transparent contracts and visible on-chain activity.",
  },
  {
    icon: "🛡️",
    title: "Controlled Claim",
    desc: "Claim activation is controlled to prevent premature release and keep distribution organized.",
  },
  {
    icon: "📦",
    title: "Fixed Supply",
    desc: "KRX uses a fixed supply design, helping preserve clarity around long-term token distribution.",
  },
  {
    icon: "🔗",
    title: "Public Registry",
    desc: "Projects can be registered on-chain and displayed publicly through KORAX ecosystem tools.",
  },
];

const highlights = [
  "BNB Chain ecosystem",
  "AI-powered builder tools",
  "Presale, claim, staking and launch infrastructure",
  "Project registry and Web3 website generation",
];

function SectionTitle({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="max-w-4xl">
      <p className="text-xs font-black uppercase tracking-[0.26em] text-blue-100">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
        {title}
      </h2>

      {desc ? <p className="mt-3 leading-8 text-white/65">{desc}</p> : null}
    </div>
  );
}

function InfoCard({
  icon,
  title,
  value,
  desc,
  highlight,
}: {
  icon: string;
  title: string;
  value?: string;
  desc: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "docs-card-3d relative overflow-hidden rounded-[28px] border p-5 shadow-[0_18px_60px_rgba(0,0,0,0.32)] backdrop-blur-md",
        highlight
          ? "border-blue-400/25 bg-blue-500/10"
          : "border-white/10 bg-black/25",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.11),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.07),transparent_34%)]" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-black text-white">{title}</h3>

          {value ? (
            <div className="mt-2 text-xl font-black text-blue-100">
              {value}
            </div>
          ) : null}
        </div>

        <div className="docs-icon-3d flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/35 text-2xl shadow-[0_0_35px_rgba(59,130,246,0.14)]">
          {icon}
        </div>
      </div>

      <p className="relative mt-4 text-sm leading-7 text-white/65">{desc}</p>
    </div>
  );
}

function DocsKoraxLogo() {
  return (
    <div className="docs-logo-zone relative flex min-h-[330px] flex-col items-center justify-center overflow-visible bg-transparent">
      <div className="docs-logo-glow absolute h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute h-44 w-44 rounded-full bg-cyan-400/10 blur-2xl" />
      <div className="absolute h-28 w-28 rounded-full bg-white/5 blur-2xl" />

      <img
        src="/Korax-logo.png"
        alt="KORAX official logo"
        className="docs-logo-spin relative h-48 w-48 bg-transparent object-contain drop-shadow-[0_0_36px_rgba(59,130,246,0.95)] sm:h-56 sm:w-56 lg:h-60 lg:w-60"
      />

      <img
        src="/korax-wordmark.png"
        alt="KORAX wordmark"
        className="docs-wordmark-float relative mt-4 h-14 w-auto max-w-[280px] bg-transparent object-contain drop-shadow-[0_0_24px_rgba(59,130,246,0.95)] sm:h-16 sm:max-w-[360px]"
      />

      <div className="docs-energy-ring pointer-events-none absolute h-72 w-72 rounded-full border border-blue-400/10" />
    </div>
  );
}

function KoraxRotatingLogo() {
  return (
    <div className="docs-float relative rounded-[38px] border border-white/10 bg-black/30 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.52)]">
      <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-blue-500/15 blur-3xl" />
      <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

      <DocsKoraxLogo />

      <div className="mt-4 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4 shadow-[0_0_38px_rgba(59,130,246,0.10)]">
        <div className="text-xs uppercase tracking-[0.22em] text-white/45">
          Ecosystem Mode
        </div>

        <div className="mt-2 text-2xl font-black text-blue-100">
          Builder Ready ⚡
        </div>

        <p className="mt-2 text-sm leading-relaxed text-white/65">
          Presale, claim, staking, AI builders, registry, and launch
          infrastructure are connected into one Web3 direction.
        </p>
      </div>
    </div>
  );
}

export default function DocsPage() {
  return (
    <div className="space-y-8">
      <style>{`
        @keyframes docsFloat {
          0%, 100% {
            transform: translateY(0) rotateX(0deg) rotateY(0deg);
          }
          50% {
            transform: translateY(-12px) rotateX(3deg) rotateY(-3deg);
          }
        }

        @keyframes docsLogoSpin {
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

        @keyframes docsWordmarkFloat {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.94;
          }
          50% {
            transform: translateY(-7px) scale(1.02);
            opacity: 1;
          }
        }

        @keyframes docsLogoGlow {
          0%, 100% {
            opacity: 0.34;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.16);
          }
        }

        @keyframes docsRing {
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

        @keyframes docsScan {
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

        @keyframes docsShimmer {
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

        .docs-hero-3d {
          transform-style: preserve-3d;
          perspective: 1200px;
        }

        .docs-float {
          transform-style: preserve-3d;
          animation: docsFloat 6.8s ease-in-out infinite;
          will-change: transform;
        }

        .docs-logo-zone,
        .docs-logo-zone img,
        .docs-wordmark-float {
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .docs-logo-spin {
          transform-style: preserve-3d;
          animation: docsLogoSpin 9s linear infinite;
          will-change: transform;
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .docs-wordmark-float {
          animation: docsWordmarkFloat 4s ease-in-out infinite;
          will-change: transform;
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .docs-logo-glow {
          animation: docsLogoGlow 3.6s ease-in-out infinite;
        }

        .docs-energy-ring {
          animation: docsRing 12s linear infinite;
        }

        .docs-scan {
          animation: docsScan 4s ease-in-out infinite;
        }

        .docs-shimmer {
          animation: docsShimmer 5s ease-in-out infinite;
        }

        .docs-card-3d {
          transform-style: preserve-3d;
          transition:
            transform 220ms ease,
            border-color 220ms ease,
            background 220ms ease,
            box-shadow 220ms ease;
        }

        .docs-card-3d:hover {
          transform: translateY(-5px) rotateX(2deg) rotateY(-2deg);
          border-color: rgba(59, 130, 246, 0.38);
          background: rgba(37, 99, 235, 0.08);
          box-shadow: 0 28px 90px rgba(59, 130, 246, 0.14);
        }

        .docs-icon-3d {
          transform: translateZ(26px);
        }

        @media (prefers-reduced-motion: reduce) {
          .docs-float,
          .docs-logo-spin,
          .docs-wordmark-float,
          .docs-logo-glow,
          .docs-energy-ring,
          .docs-scan,
          .docs-shimmer {
            animation: none;
          }

          .docs-card-3d:hover {
            transform: none;
          }
        }
      `}</style>

      <section className="docs-hero-3d relative overflow-hidden rounded-[38px] border border-white/10 bg-black/35 p-6 shadow-[0_35px_130px_rgba(0,0,0,0.62)] backdrop-blur-md sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.13),transparent_32%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.075] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="docs-scan pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent" />
        <div className="docs-shimmer pointer-events-none absolute left-0 top-0 h-full w-1/4 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

        <div className="relative grid gap-10 lg:grid-cols-[1.06fr_.94fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-blue-100 shadow-[0_0_30px_rgba(59,130,246,0.16)]">
              KORAX Documentation 📘
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              KORAX
              <span className="block bg-gradient-to-r from-blue-100 via-white to-blue-200 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(59,130,246,0.55)]">
                Whitepaper.
              </span>
            </h1>

            <p className="mt-5 max-w-4xl text-base leading-relaxed text-white/68 sm:text-lg">
              KORAX is a BNB Chain ecosystem built around presale, claim,
              staking, Token Builder AI, Website Builder AI, Launchpad access,
              on-chain project registration, and Web3 builder tools. The
              platform is designed to reduce technical friction and help users
              create, prepare, register, and launch blockchain projects with
              more structure.
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
              {[
                "KRX Token",
                "BNB Chain",
                "AI Builders",
                "Launchpad",
                "Project Registry",
                "Staking Access",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/70"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <KoraxRotatingLogo />
        </div>
      </section>

      <section className="rounded-[30px] border border-white/10 bg-black/25 p-6 backdrop-blur-md">
        <SectionTitle
          eyebrow="Vision 🚀"
          title="A clearer path from idea to Web3 launch."
          desc="The long-term vision of KORAX is to simplify blockchain project creation and make Web3 launch infrastructure more accessible. Instead of forcing builders to start from scattered tools, expensive development processes, and complex contract systems, KORAX provides a more direct path from idea to structured project."
        />

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <InfoCard
            icon="🧠"
            title="Builder Intelligence"
            desc="KORAX uses AI-assisted workflows to help users prepare project concepts, token logic, branding direction, website structure, and launch planning faster."
          />

          <InfoCard
            icon="🔗"
            title="Connected Infrastructure"
            desc="KORAX connects token creation, website generation, staking access, project registry, launch tools, and public visibility into one ecosystem."
          />
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[30px] border border-blue-400/20 bg-blue-500/10 p-6 backdrop-blur-md">
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative">
          <SectionTitle
            eyebrow="Current Ecosystem Status 🟢"
            title="KORAX ecosystem modules"
            desc="The public KORAX ecosystem includes presale participation, claim preparation, staking infrastructure, AI builder tools, Website Builder AI, Token Builder AI, Launch tools, and public project registry visibility."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {statusCards.map((item) => (
              <InfoCard
                key={item.label}
                icon={item.icon}
                title={item.label}
                value={item.value}
                desc={item.desc}
                highlight={item.value === "Live"}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[30px] border border-white/10 bg-black/25 p-6 backdrop-blur-md">
        <SectionTitle
          eyebrow="Presale Model 💰"
          title="Five-stage structured KRX presale"
          desc="KORAX uses a structured five-stage presale model with a total presale allocation of 50,000,000 KRX tokens. The model is designed to provide clear stage-based pricing and transparent participation on BNB Smart Chain."
        />

        <div className="mt-6 grid gap-4 md:grid-cols-5">
          {presaleStages.map((item, index) => (
            <div
              key={item.stage}
              className={[
                "docs-card-3d rounded-[24px] border p-4 text-center",
                index === 0
                  ? "border-blue-400/30 bg-blue-500/10"
                  : "border-white/10 bg-black/30",
              ].join(" ")}
            >
              <div className="text-sm font-black text-blue-100">
                {item.stage}
              </div>

              <div className="mt-3 text-lg font-black text-white">
                {item.price}
              </div>

              <div className="mt-2 text-xs leading-6 text-white/55">
                {item.amount}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 leading-8 text-white/65">
          The presale supports participation through supported payment routes,
          including BNB, USDT, and USDC where available. Purchased tokens are
          recorded on-chain and become claimable only after the claim phase is
          activated.
        </p>
      </section>

      <section className="rounded-[30px] border border-white/10 bg-black/25 p-6 backdrop-blur-md">
        <SectionTitle
          eyebrow="Tokenomics 💎"
          title="Fixed-supply KRX structure"
          desc="KORAX has a fixed total supply of 100,000,000 KRX. The token model is designed as a non-inflationary structure, meaning the supply is not expanded through future reward minting."
        />

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {tokenomics.map((item) => (
            <InfoCard
              key={item.title}
              icon={item.icon}
              title={item.title}
              value={item.value}
              desc={item.desc}
            />
          ))}
        </div>

        <p className="mt-6 leading-8 text-white/65">
          Rewards and ecosystem allocations are designed to come from existing
          token supply rather than newly created tokens. This helps preserve
          clarity around supply and long-term distribution.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[30px] border border-white/10 bg-black/25 p-6 backdrop-blur-md">
          <SectionTitle
            eyebrow="Claim System 🎁"
            title="Controlled token release after presale"
            desc="KORAX purchased during the presale is not delivered instantly during the active sale period. Purchased balances are recorded and later released through the claim system after the presale has ended and claim has been enabled."
          />

          <p className="mt-5 leading-8 text-white/65">
            The claim logic is designed to protect against double execution and
            keep token release transparent. Once claim is activated, users can
            claim their purchased KRX according to the project release structure.
          </p>
        </div>

        <div className="rounded-[30px] border border-white/10 bg-black/25 p-6 backdrop-blur-md">
          <SectionTitle
            eyebrow="Staking Infrastructure 🔒"
            title="Fixed-duration staking access"
            desc="KORAX staking is designed around fixed-duration lock plans with predefined reward levels distributed from the staking allocation."
          />

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {stakingPlans.map((plan) => (
              <div
                key={plan}
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-center text-sm font-semibold text-white/75"
              >
                {plan}
              </div>
            ))}
          </div>

          <p className="mt-5 leading-8 text-white/65">
            The 12-month staking plan can be connected to builder access,
            project creation slots, and ecosystem-level participation.
          </p>
        </div>
      </section>

      <section className="rounded-[30px] border border-white/10 bg-black/25 p-6 backdrop-blur-md">
        <SectionTitle
          eyebrow="Flexible Access Manager ⚙️"
          title="Builder permissions without rigid hardcoding"
          desc="KORAX includes flexible access infrastructure designed to connect staking commitment with builder permissions. Instead of permanently locking project creation requirements into hardcoded numbers, the access system is designed to remain adaptable over time."
        />

        <p className="mt-5 leading-8 text-white/65">
          This is important because if the value of KRX increases significantly,
          project creation should remain fair and accessible for real builders.
          The access structure gives the ecosystem more flexibility while
          maintaining on-chain transparency.
        </p>
      </section>

      <section className="rounded-[30px] border border-white/10 bg-black/25 p-6 backdrop-blur-md">
        <SectionTitle
          eyebrow="Builder Tools 🛠️"
          title="AI-powered tools for project creation and launch"
          desc="KORAX builder tools are designed to help users move from raw idea to structured project foundation, branded website, deployment-ready files, registry entry, and public launch preparation."
        />

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {builderTools.map((item) => (
            <InfoCard
              key={item.title}
              icon={item.icon}
              title={item.title}
              desc={item.desc}
            />
          ))}
        </div>
      </section>

      <section className="rounded-[30px] border border-white/10 bg-black/25 p-6 backdrop-blur-md">
        <SectionTitle
          eyebrow="Launch Your Project 🚀"
          title="KORAX launch infrastructure"
          desc="KORAX Launchpad infrastructure is designed to support project sale creation and participation through transparent on-chain logic. The launch system can support token sales, contribution limits, payment token options, claim phases, and access-based participation."
        />

        <p className="mt-5 leading-8 text-white/65">
          The goal is to allow approved or eligible project creators to launch
          their own projects through KORAX infrastructure while giving committed
          KRX participants stronger access to ecosystem opportunities.
        </p>
      </section>

      <section className="rounded-[30px] border border-white/10 bg-black/25 p-6 backdrop-blur-md">
        <SectionTitle
          eyebrow="Website Builder AI 🌐"
          title="Premium Web3 website generation"
          desc="Website Builder AI helps project creators generate Web3 website structures based on their token, roadmap, utility, staking logic, launch plan, and brand direction."
        />

        <p className="mt-5 leading-8 text-white/65">
          The website builder flow can support website section generation, code
          output, project content, export options, GitHub publishing support, and
          deployment workflows. This allows users to move from project idea to a
          real blockchain project website with much less manual setup.
        </p>
      </section>

      <section className="rounded-[30px] border border-white/10 bg-black/25 p-6 backdrop-blur-md">
        <SectionTitle
          eyebrow="Security & Transparency 🛡️"
          title="Built around visible infrastructure"
          desc="Transparency and security are central principles of KORAX. The ecosystem is built around verifiable smart contracts, public on-chain records, fixed supply logic, and clear separation between presale, claim, staking, AI deployment, registry, and launch infrastructure."
        />

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {securityItems.map((item) => (
            <InfoCard
              key={item.title}
              icon={item.icon}
              title={item.title}
              desc={item.desc}
            />
          ))}
        </div>
      </section>

      <section className="rounded-[30px] border border-yellow-300/20 bg-yellow-300/10 p-6 backdrop-blur-md">
        <SectionTitle
          eyebrow="Important Notice ⚠️"
          title="Blockchain participation carries risk"
          desc="KORAX tools are designed to support project creation, launch planning, and ecosystem participation. Nothing in this documentation should be considered financial advice or a guarantee of profit."
        />

        <p className="mt-5 leading-8 text-white/65">
          Users should always do their own research, understand blockchain risks,
          check wallet interactions carefully, and review smart contract actions
          before participating in any Web3 ecosystem.
        </p>
      </section>
    </div>
  );
}
