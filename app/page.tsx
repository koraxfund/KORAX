import Link from "next/link";

const ecosystemModules = [
  {
    number: "01",
    icon: "◈",
    title: "KRX Presale",
    description:
      "A five-stage on-chain presale with transparent pricing, wallet-based participation, and fixed token allocation.",
    badge: "Live",
    href: "/presale",
    cta: "Enter Presale",
    tone: "blue",
  },
  {
    number: "02",
    icon: "◇",
    title: "Claim Portal",
    description:
      "A dedicated claim system prepared for activation after the KORAX presale has officially concluded.",
    badge: "Prepared",
    href: "/claim",
    cta: "View Claim",
    tone: "slate",
  },
  {
    number: "03",
    icon: "⬡",
    title: "KRX Staking",
    description:
      "Fixed-duration staking architecture designed to support KRX utility, ecosystem access, and long-term participation.",
    badge: "After Claim",
    href: "/staking",
    cta: "Explore Staking",
    tone: "slate",
  },
  {
    number: "04",
    icon: "AI",
    title: "Token Builder AI",
    description:
      "Turn an early idea into structured tokenomics, utility logic, launch direction, risks, visuals, and an on-chain project.",
    badge: "Live",
    href: "/ai",
    cta: "Open Token Builder",
    tone: "blue",
  },
  {
    number: "05",
    icon: "WEB",
    title: "Website Builder AI",
    description:
      "Generate premium Web3 website structures and deployment-ready project output through the KORAX builder workflow.",
    badge: "Live",
    href: "/website-builder-ai",
    cta: "Open Website Builder",
    tone: "cyan",
  },
  {
    number: "06",
    icon: "↗",
    title: "Launch Ecosystem",
    description:
      "Create and publish projects through KORAX launch infrastructure, public registry visibility, and connected builder tools.",
    badge: "Live",
    href: "/launch",
    cta: "Launch a Project",
    tone: "cyan",
  },
];

const valuePillars = [
  {
    number: "01",
    title: "From idea to infrastructure",
    description:
      "KORAX connects project strategy, token creation, website generation, registry visibility, and launch preparation.",
  },
  {
    number: "02",
    title: "Utility beyond the token",
    description:
      "KRX is designed around access to tools, staking systems, launch infrastructure, and the wider KORAX ecosystem.",
  },
  {
    number: "03",
    title: "Transparent architecture",
    description:
      "Core stages, token allocation, claim timing, and ecosystem modules are publicly explained across the website and documentation.",
  },
  {
    number: "04",
    title: "Built for real builders",
    description:
      "The platform is designed for founders and communities that want to move beyond a basic token launch.",
  },
];

const tokenomics = [
  {
    label: "Total Supply",
    value: "100,000,000 KRX",
    note: "Fixed maximum supply",
  },
  {
    label: "Presale Allocation",
    value: "50,000,000 KRX",
    note: "10M KRX in each stage",
  },
  {
    label: "Staking & Ecosystem",
    value: "50,000,000 KRX",
    note: "Reserved from fixed supply",
  },
  {
    label: "Future Inflation",
    value: "0%",
    note: "No expansion beyond maximum supply",
  },
];

const presaleStages = [
  {
    stage: "Stage 1",
    price: "$0.05",
    allocation: "10M KRX",
    status: "Live",
  },
  {
    stage: "Stage 2",
    price: "$0.07",
    allocation: "10M KRX",
    status: "Next",
  },
  {
    stage: "Stage 3",
    price: "$0.09",
    allocation: "10M KRX",
    status: "Upcoming",
  },
  {
    stage: "Stage 4",
    price: "$0.11",
    allocation: "10M KRX",
    status: "Upcoming",
  },
  {
    stage: "Stage 5",
    price: "$0.13",
    allocation: "10M KRX",
    status: "Final",
  },
];

const roadmap = [
  {
    phase: "Phase 01",
    status: "Active",
    title: "Presale & Foundation",
    description:
      "Five-stage KRX presale, public documentation, wallet connectivity, token infrastructure, and ecosystem positioning.",
    items: [
      "KRX presale infrastructure",
      "Website and official channels",
      "Token information and transparency",
    ],
  },
  {
    phase: "Phase 02",
    status: "Prepared",
    title: "Claim & Staking Activation",
    description:
      "Claim activation after presale completion, followed by the prepared KRX staking environment.",
    items: [
      "KRX claim portal",
      "Fixed staking plans",
      "Ecosystem access logic",
    ],
  },
  {
    phase: "Phase 03",
    status: "Building",
    title: "AI Builder Expansion",
    description:
      "Expansion of Token Builder AI and Website Builder AI into a connected project creation workflow.",
    items: [
      "Project intelligence generation",
      "On-chain deployment tools",
      "Website generation workflow",
    ],
  },
  {
    phase: "Phase 04",
    status: "Expansion",
    title: "Launch Ecosystem",
    description:
      "Public project discovery, launch infrastructure, ecosystem integrations, and long-term KORAX growth.",
    items: [
      "Project registry growth",
      "Launchpad expansion",
      "Additional network support",
    ],
  },
];

const workflow = [
  {
    number: "01",
    title: "Acquire KRX",
    description:
      "Participate in the KORAX presale through your own wallet using the supported assets.",
    link: "/presale",
    linkLabel: "Open Presale",
  },
  {
    number: "02",
    title: "Claim and participate",
    description:
      "Claim becomes available after the presale, followed by staking and ecosystem participation.",
    link: "/claim",
    linkLabel: "View Claim Portal",
  },
  {
    number: "03",
    title: "Build and launch",
    description:
      "Use KORAX AI tools, website generation, project registry, and launch infrastructure.",
    link: "/ai",
    linkLabel: "Start Building",
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
  {
    name: "Crypto.com Wallet",
    logo: "/partners/crypto-com-wallet.png",
  },
  { name: "Bybit Wallet", logo: "/partners/bybit-wallet.png" },
  {
    name: "KuCoin Web3 Wallet",
    logo: "/partners/kucoin-web3-wallet.png",
  },
  { name: "Gate Wallet", logo: "/partners/gate-wallet.png" },
  { name: "Ronin Wallet", logo: "/partners/ronin-wallet.png" },
];

const trustItems = [
  {
    icon: "01",
    title: "User-controlled wallet",
    description:
      "Wallet interactions and blockchain transactions remain under the control of the connected user.",
  },
  {
    icon: "02",
    title: "Utility-first ecosystem",
    description:
      "KRX is positioned around ecosystem access, builders, staking, project creation, and launch infrastructure.",
  },
  {
    icon: "03",
    title: "Clear risk disclosure",
    description:
      "Crypto assets carry substantial risk. KORAX does not guarantee profit, liquidity, listing, or price performance.",
  },
];

const faqs = [
  {
    question: "What is KORAX?",
    answer:
      "KORAX is a BNB Chain builder ecosystem combining KRX presale infrastructure, claim, staking, Token Builder AI, Website Builder AI, project registry, and launch tools.",
  },
  {
    question: "What is the purpose of KRX?",
    answer:
      "KRX is designed as the native utility asset of the KORAX ecosystem. Its intended utility includes ecosystem participation, staking, access logic, builder tools, and launch infrastructure.",
  },
  {
    question: "Is the KRX presale currently live?",
    answer:
      "Yes. Stage 1 is presented at $0.05 per KRX. The presale contains five stages, with each stage allocated 10 million KRX.",
  },
  {
    question: "When can KRX be claimed?",
    answer:
      "KRX claim activation is planned after the presale has officially ended. Users should rely only on announcements published through official KORAX channels.",
  },
  {
    question: "Who pays blockchain transaction fees?",
    answer:
      "The connected wallet that submits a BNB Chain transaction normally pays the required network gas fee in BNB.",
  },
  {
    question: "Does KORAX guarantee profit or token listing?",
    answer:
      "No. KORAX does not guarantee profit, future value, exchange listing, liquidity, or market performance. Participation in crypto assets involves substantial risk.",
  },
];

function Badge({
  children,
  tone = "blue",
}: {
  children: string;
  tone?: "blue" | "cyan" | "slate";
}) {
  const tones = {
    blue:
      "border-blue-400/25 bg-blue-500/10 text-blue-100 shadow-[0_0_22px_rgba(59,130,246,0.13)]",
    cyan:
      "border-cyan-300/20 bg-cyan-400/10 text-cyan-100 shadow-[0_0_22px_rgba(34,211,238,0.10)]",
    slate: "border-white/10 bg-white/[0.045] text-white/55",
  };

  return (
    <span
      className={[
        "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em]",
        tones[tone],
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
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-blue-100">
          <span className="h-px w-8 bg-blue-400/70" />
          {eyebrow}
        </div>

        <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h2>

        {description ? (
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/58 sm:text-base">
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

function HeroKoraxCore() {
  return (
    <div className="home-command-core relative min-h-[520px] overflow-hidden rounded-[34px] border border-white/10 bg-[#020611]/85 shadow-[0_35px_120px_rgba(0,0,0,0.58)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.28),transparent_32%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.11),transparent_35%)]" />

      <div className="home-grid pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="home-core-orbit home-core-orbit-one pointer-events-none absolute left-1/2 top-[43%] h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/15" />

      <div className="home-core-orbit home-core-orbit-two pointer-events-none absolute left-1/2 top-[43%] h-[270px] w-[270px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />

      <div className="home-core-orbit home-core-orbit-three pointer-events-none absolute left-1/2 top-[43%] h-[205px] w-[205px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />

      <div className="home-core-glow pointer-events-none absolute left-1/2 top-[43%] h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="absolute left-1/2 top-[43%] z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <img
          src="/Korax-logo.png"
          alt="KORAX official logo"
          draggable={false}
          fetchPriority="high"
          className="home-logo-motion h-40 w-40 bg-transparent object-contain drop-shadow-[0_0_42px_rgba(59,130,246,0.95)] sm:h-52 sm:w-52"
        />

        <img
          src="/korax-wordmark.png"
          alt="KORAX wordmark"
          draggable={false}
          fetchPriority="high"
          className="home-wordmark-motion mt-3 h-10 w-auto max-w-[220px] bg-transparent object-contain drop-shadow-[0_0_24px_rgba(59,130,246,0.8)] sm:h-12 sm:max-w-[280px]"
        />
      </div>

      <div className="home-data-chip absolute left-5 top-5 hidden min-w-[145px] rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur-xl sm:block">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
          Network
        </div>

        <div className="mt-2 font-black text-white">BNB Chain</div>

        <div className="mt-1 text-xs text-blue-100/70">
          Connected ecosystem
        </div>
      </div>

      <div className="home-data-chip home-data-chip-delay absolute right-5 top-5 hidden min-w-[145px] rounded-2xl border border-white/10 bg-black/50 p-4 text-right backdrop-blur-xl sm:block">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
          Presale
        </div>

        <div className="mt-2 font-black text-blue-100">Stage 1 Live</div>

        <div className="mt-1 text-xs text-white/45">$0.05 / KRX</div>
      </div>

      <div className="home-data-chip home-data-chip-two absolute bottom-28 left-5 hidden min-w-[145px] rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur-xl sm:block">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
          Supply
        </div>

        <div className="mt-2 font-black text-white">100M KRX</div>

        <div className="mt-1 text-xs text-white/45">Fixed maximum</div>
      </div>

      <div className="home-data-chip home-data-chip-three absolute bottom-28 right-5 hidden min-w-[145px] rounded-2xl border border-white/10 bg-black/50 p-4 text-right backdrop-blur-xl sm:block">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
          Builder Tools
        </div>

        <div className="mt-2 font-black text-cyan-100">
          AI Systems Live
        </div>

        <div className="mt-1 text-xs text-white/45">Token + Website</div>
      </div>

      <div className="absolute bottom-5 left-5 right-5 z-20 overflow-hidden rounded-[24px] border border-blue-400/20 bg-blue-500/10 p-4 shadow-[0_0_38px_rgba(59,130,246,0.12)] backdrop-blur-xl">
        <div className="home-panel-scan pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-blue-300/10 to-transparent" />

        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.24em] text-white/40">
              Current Presale
            </div>

            <div className="mt-1 text-xl font-black text-white">
              Stage 1
              <span className="ml-2 text-blue-100">$0.05</span>
            </div>
          </div>

          <Link
            href="/presale"
            className="inline-flex items-center justify-center rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-black text-white transition hover:bg-blue-400"
          >
            Enter Presale
            <span className="ml-2">↗</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function TokenomicsCore() {
  return (
    <div className="relative mx-auto flex h-[310px] w-[310px] items-center justify-center sm:h-[370px] sm:w-[370px]">
      <div className="home-token-orbit absolute inset-0 rounded-full border border-blue-400/15" />

      <div className="home-token-orbit-reverse absolute inset-[26px] rounded-full border border-cyan-300/10" />

      <div
        className="absolute inset-[48px] rounded-full p-[2px] shadow-[0_0_80px_rgba(59,130,246,0.22)]"
        style={{
          background:
            "conic-gradient(#3b82f6 0deg 180deg, #22d3ee 180deg 360deg)",
        }}
      >
        <div className="flex h-full w-full items-center justify-center rounded-full bg-[#030815]">
          <div className="text-center">
            <div className="text-xs font-black uppercase tracking-[0.3em] text-white/40">
              KRX Supply
            </div>

            <div className="mt-3 text-4xl font-black text-white sm:text-5xl">
              100M
            </div>

            <div className="mt-2 text-sm font-semibold text-blue-100">
              Fixed Maximum
            </div>
          </div>
        </div>
      </div>

      <div className="absolute left-0 top-1/2 -translate-y-1/2 rounded-2xl border border-blue-400/20 bg-[#050b18]/90 px-4 py-3 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
          Presale
        </div>

        <div className="mt-1 font-black text-blue-100">50%</div>
      </div>

      <div className="absolute right-0 top-1/2 -translate-y-1/2 rounded-2xl border border-cyan-300/20 bg-[#050b18]/90 px-4 py-3 text-right shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
          Ecosystem
        </div>

        <div className="mt-1 font-black text-cyan-100">50%</div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-8 overflow-hidden">
      <style>{`
        @keyframes homeLogoMotion {
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

        @keyframes homeWordmarkMotion {
          0%,
          100% {
            transform: translateY(0) scale(1);
            opacity: 0.9;
          }

          50% {
            transform: translateY(-5px) scale(1.025);
            opacity: 1;
          }
        }

        @keyframes homeCoreGlow {
          0%,
          100% {
            opacity: 0.38;
            transform: translate(-50%, -50%) scale(0.95);
          }

          50% {
            opacity: 0.92;
            transform: translate(-50%, -50%) scale(1.12);
          }
        }

        @keyframes homeOrbit {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }

          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes homeOrbitReverse {
          from {
            transform: translate(-50%, -50%) rotate(360deg);
          }

          to {
            transform: translate(-50%, -50%) rotate(0deg);
          }
        }

        @keyframes homeTokenOrbit {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes homeTokenOrbitReverse {
          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0deg);
          }
        }

        @keyframes homeScan {
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

        @keyframes homeShimmer {
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

        @keyframes homeMarquee {
          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes homeGridShift {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(-17px, -17px, 0);
          }
        }

        @keyframes homeDataChip {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-7px);
          }
        }

        @keyframes homePulseDot {
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

        .home-hero-shell {
          transform-style: preserve-3d;
          perspective: 1400px;
        }

        .home-card {
          position: relative;
          overflow: hidden;
          transform-style: preserve-3d;
          transition:
            transform 250ms ease,
            border-color 250ms ease,
            background 250ms ease,
            box-shadow 250ms ease;
        }

        .home-card::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: inherit;
          background: linear-gradient(
            125deg,
            transparent 10%,
            rgba(96, 165, 250, 0.08),
            transparent 58%
          );
          opacity: 0;
          transition: opacity 250ms ease;
        }

        .home-card:hover {
          transform: translateY(-7px);
          border-color: rgba(96, 165, 250, 0.38);
          background-color: rgba(37, 99, 235, 0.065);
          box-shadow: 0 32px 90px rgba(37, 99, 235, 0.14);
        }

        .home-card:hover::before {
          opacity: 1;
        }

        .home-logo-motion {
          transform-style: preserve-3d;
          animation: homeLogoMotion 9s linear infinite;
          will-change: transform;
          backface-visibility: visible;
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .home-wordmark-motion {
          animation: homeWordmarkMotion 4.6s ease-in-out infinite;
          will-change: transform;
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .home-core-glow {
          animation: homeCoreGlow 3.8s ease-in-out infinite;
        }

        .home-core-orbit-one {
          animation: homeOrbit 20s linear infinite;
        }

        .home-core-orbit-two {
          animation: homeOrbitReverse 16s linear infinite;
        }

        .home-core-orbit-three {
          animation: homeOrbit 12s linear infinite;
        }

        .home-core-orbit::before,
        .home-core-orbit::after {
          content: "";
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #60a5fa;
          box-shadow:
            0 0 14px rgba(96, 165, 250, 0.9),
            0 0 30px rgba(34, 211, 238, 0.45);
        }

        .home-core-orbit::before {
          left: 50%;
          top: -4px;
          transform: translateX(-50%);
        }

        .home-core-orbit::after {
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
        }

        .home-data-chip {
          animation: homeDataChip 5s ease-in-out infinite;
        }

        .home-data-chip-delay {
          animation-delay: 0.8s;
        }

        .home-data-chip-two {
          animation-delay: 1.4s;
        }

        .home-data-chip-three {
          animation-delay: 2s;
        }

        .home-grid {
          animation: homeGridShift 10s ease-in-out infinite;
        }

        .home-hero-scan {
          animation: homeScan 4.6s ease-in-out infinite;
        }

        .home-hero-shimmer {
          animation: homeShimmer 5.8s ease-in-out infinite;
        }

        .home-panel-scan {
          animation: homeScan 4.8s ease-in-out infinite;
        }

        .home-token-orbit {
          animation: homeTokenOrbit 18s linear infinite;
        }

        .home-token-orbit-reverse {
          animation: homeTokenOrbitReverse 14s linear infinite;
        }

        .home-live-dot {
          animation: homePulseDot 1.8s ease-in-out infinite;
        }

        .home-marquee {
          overflow: hidden;
        }

        .home-marquee-track {
          display: flex;
          width: max-content;
          animation: homeMarquee 38s linear infinite;
        }

        .home-marquee:hover .home-marquee-track {
          animation-play-state: paused;
        }

        .home-partner-item {
          display: flex;
          min-width: max-content;
          align-items: center;
          gap: 12px;
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          padding: 18px 28px;
        }

        .home-stage-line {
          position: absolute;
          left: 22px;
          right: 22px;
          top: 25px;
          height: 1px;
          background: linear-gradient(
            90deg,
            rgba(59, 130, 246, 0.8),
            rgba(59, 130, 246, 0.18),
            rgba(255, 255, 255, 0.08)
          );
        }

        details.home-faq[open] {
          border-color: rgba(96, 165, 250, 0.32);
          background: rgba(37, 99, 235, 0.07);
        }

        details.home-faq summary::-webkit-details-marker {
          display: none;
        }

        @media (max-width: 640px) {
          .home-command-core {
            min-height: 470px;
          }

          .home-core-orbit-one {
            width: 280px;
            height: 280px;
          }

          .home-core-orbit-two {
            width: 220px;
            height: 220px;
          }

          .home-core-orbit-three {
            width: 168px;
            height: 168px;
          }

          .home-stage-line {
            display: none;
          }
        }

        @media (hover: none) {
          .home-card:hover {
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .home-logo-motion,
          .home-wordmark-motion,
          .home-core-glow,
          .home-core-orbit-one,
          .home-core-orbit-two,
          .home-core-orbit-three,
          .home-data-chip,
          .home-grid,
          .home-hero-scan,
          .home-hero-shimmer,
          .home-panel-scan,
          .home-token-orbit,
          .home-token-orbit-reverse,
          .home-live-dot,
          .home-marquee-track {
            animation: none;
          }

          .home-card:hover {
            transform: none;
          }
        }
      `}</style>

      <section className="home-hero-shell relative overflow-hidden rounded-[40px] border border-white/10 bg-[#030711]/85 p-5 shadow-[0_40px_150px_rgba(0,0,0,0.68)] backdrop-blur-2xl sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.25),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.12),transparent_35%)]" />

        <div className="pointer-events-none absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:52px_52px]" />

        <div className="home-hero-scan pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent" />

        <div className="home-hero-shimmer pointer-events-none absolute left-0 top-0 h-full w-1/4 bg-gradient-to-r from-transparent via-white/[0.045] to-transparent" />

        <div className="relative grid gap-10 xl:grid-cols-[1.04fr_.96fr] xl:items-center">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-blue-100 shadow-[0_0_30px_rgba(59,130,246,0.16)]">
              <span className="home-live-dot h-2 w-2 rounded-full bg-blue-300 shadow-[0_0_14px_rgba(147,197,253,0.95)]" />
              KORAX Ecosystem Online
            </div>

            <h1 className="mt-7 max-w-4xl text-4xl font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              Your path to the top
              <span className="block bg-gradient-to-r from-blue-100 via-white to-cyan-200 bg-clip-text text-transparent drop-shadow-[0_0_22px_rgba(59,130,246,0.48)]">
                begins with KORAX.
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-white/64 sm:text-lg">
              KORAX connects KRX presale infrastructure, claim, staking,
              artificial intelligence, website creation, project registry, and
              launch tools inside one expanding BNB Chain builder ecosystem.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                "AI-powered project creation",
                "Connected Web3 builder workflow",
                "Public on-chain project registry",
                "Fixed KRX ecosystem supply",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-semibold text-white/72"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-blue-400/20 bg-blue-500/10 text-xs text-blue-100">
                    ✦
                  </span>

                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/presale"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-blue-500 px-6 py-3 text-sm font-black text-white shadow-[0_0_40px_rgba(59,130,246,0.35)] transition duration-300 hover:-translate-y-0.5 hover:bg-blue-400 hover:shadow-[0_0_55px_rgba(59,130,246,0.45)]"
              >
                Enter KRX Presale
                <span className="ml-2">↗</span>
              </Link>

              <Link
                href="/ai"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-blue-400/25 bg-blue-500/10 px-6 py-3 text-sm font-black text-blue-100 transition duration-300 hover:-translate-y-0.5 hover:border-blue-300/40 hover:bg-blue-500/20 hover:text-white"
              >
                Open Token Builder AI
                <span className="ml-2">AI</span>
              </Link>

              <Link
                href="/docs"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-black/30 px-6 py-3 text-sm font-bold text-white/78 transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
              >
                Read Documentation
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-white/42">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-300" />
                BNB Chain
              </span>

              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                100M Fixed Supply
              </span>

              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                Builder Infrastructure
              </span>
            </div>
          </div>

          <HeroKoraxCore />
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[28px] border border-blue-400/20 bg-blue-500/[0.07] px-5 py-4 shadow-[0_20px_70px_rgba(0,0,0,0.34)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(59,130,246,0.08),transparent,rgba(34,211,238,0.07))]" />

        <div className="relative grid gap-4 text-center sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Presale", "LIVE NOW"],
            ["Current Price", "$0.05"],
            ["Current Stage", "1 OF 5"],
            ["Planned Listing", "$0.15"],
          ].map(([label, value], index) => (
            <div
              key={label}
              className={[
                "px-4 py-2",
                index > 0 ? "lg:border-l lg:border-white/10" : "",
              ].join(" ")}
            >
              <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
                {label}
              </div>

              <div className="mt-1 text-sm font-black text-blue-100">
                {value}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[38px] border border-white/10 bg-black/20 p-5 shadow-[0_28px_100px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-7 lg:p-8">
        <SectionHeading
          eyebrow="KORAX Infrastructure"
          title="One connected ecosystem. Multiple builder systems."
          description="KORAX is structured as a connected workflow rather than a collection of isolated pages. Users can move from participation and strategy to project creation and launch."
          action={{
            href: "/docs",
            label: "Explore Documentation",
          }}
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ecosystemModules.map((module) => (
            <article
              key={module.title}
              className="home-card group flex min-h-[310px] flex-col rounded-[28px] border border-white/10 bg-[#050914]/72 p-5 shadow-[0_20px_65px_rgba(0,0,0,0.28)]"
            >
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-sm font-black text-blue-100 shadow-[0_0_26px_rgba(59,130,246,0.12)]">
                    {module.icon}
                  </div>

                  <span className="text-xs font-black tracking-[0.2em] text-white/25">
                    {module.number}
                  </span>
                </div>

                <Badge tone={module.tone as "blue" | "cyan" | "slate"}>
                  {module.badge}
                </Badge>
              </div>

              <h3 className="relative mt-6 text-xl font-black text-white">
                {module.title}
              </h3>

              <p className="relative mt-3 flex-1 text-sm leading-7 text-white/56">
                {module.description}
              </p>

              <Link
                href={module.href}
                className="relative mt-6 inline-flex w-fit items-center text-sm font-black text-blue-100 transition group-hover:text-white"
              >
                {module.cta}

                <span className="ml-2 transition group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[38px] border border-white/10 bg-[#030712]/78 p-5 shadow-[0_30px_110px_rgba(0,0,0,0.46)] backdrop-blur-xl sm:p-7 lg:p-9">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(37,99,235,0.15),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.08),transparent_32%)]" />

        <div className="relative grid gap-9 xl:grid-cols-[.9fr_1.1fr] xl:items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-blue-100">
              <span className="h-px w-8 bg-blue-400/70" />
              Why KORAX
            </div>

            <h2 className="mt-5 text-3xl font-black leading-tight text-white sm:text-5xl">
              The command layer for the next generation of Web3 builders.
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-8 text-white/60 sm:text-base">
              Many projects launch with disconnected tools, weak positioning,
              incomplete tokenomics, and no real product structure. KORAX is
              being built to connect those critical stages through one branded
              ecosystem.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/about"
                className="rounded-2xl bg-blue-500 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-400"
              >
                About KORAX
              </Link>

              <Link
                href="/roadmap"
                className="rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-3 text-sm font-bold text-white transition hover:border-blue-400/25 hover:bg-blue-500/10"
              >
                View Roadmap
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {valuePillars.map((pillar) => (
              <article
                key={pillar.number}
                className="home-card rounded-[26px] border border-white/10 bg-black/30 p-5"
              >
                <div className="text-xs font-black tracking-[0.24em] text-blue-100/60">
                  {pillar.number}
                </div>

                <h3 className="mt-4 text-lg font-black text-white">
                  {pillar.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-white/55">
                  {pillar.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[38px] border border-white/10 bg-black/20 p-5 shadow-[0_30px_110px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:p-7 lg:p-8">
        <SectionHeading
          eyebrow="KRX Tokenomics"
          title="Fixed supply. Visible stages. Defined allocation."
          description="KRX has a fixed maximum supply of 100 million tokens, divided between the five-stage presale and the staking and ecosystem allocation."
          action={{
            href: "/presale",
            label: "View Presale",
          }}
        />

        <div className="mt-9 grid gap-10 xl:grid-cols-[430px_1fr] xl:items-center">
          <TokenomicsCore />

          <div>
            <div className="grid gap-4 sm:grid-cols-2">
              {tokenomics.map((item) => (
                <article
                  key={item.label}
                  className="home-card rounded-[24px] border border-white/10 bg-[#050914]/72 p-5"
                >
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-white/35">
                    {item.label}
                  </div>

                  <div className="mt-3 text-2xl font-black text-white">
                    {item.value}
                  </div>

                  <p className="mt-2 text-sm text-white/48">{item.note}</p>
                </article>
              ))}
            </div>

            <div className="relative mt-6 grid gap-3 md:grid-cols-5">
              <div className="home-stage-line" />

              {presaleStages.map((item, index) => (
                <article
                  key={item.stage}
                  className={[
                    "home-card relative rounded-[22px] border p-4",
                    index === 0
                      ? "border-blue-400/30 bg-blue-500/10 shadow-[0_0_34px_rgba(59,130,246,0.12)]"
                      : "border-white/10 bg-black/30",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "relative z-10 flex h-5 w-5 items-center justify-center rounded-full border",
                      index === 0
                        ? "border-blue-300 bg-blue-400 shadow-[0_0_14px_rgba(96,165,250,0.7)]"
                        : "border-white/15 bg-[#07101f]",
                    ].join(" ")}
                  >
                    {index === 0 ? (
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    ) : null}
                  </div>

                  <div className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-white/38">
                    {item.stage}
                  </div>

                  <div
                    className={[
                      "mt-2 text-xl font-black",
                      index === 0 ? "text-blue-100" : "text-white",
                    ].join(" ")}
                  >
                    {item.price}
                  </div>

                  <div className="mt-1 text-xs text-white/42">
                    {item.allocation}
                  </div>

                  <div className="mt-3 text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
                    {item.status}
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-xs leading-6 text-white/44">
              Planned listing price:{" "}
              <span className="font-black text-white">$0.15</span>. A planned
              price does not guarantee future market value, exchange listing,
              or liquidity.
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[38px] border border-white/10 bg-[#030712]/72 p-5 shadow-[0_30px_110px_rgba(0,0,0,0.44)] backdrop-blur-xl sm:p-7 lg:p-8">
        <SectionHeading
          eyebrow="Development Roadmap"
          title="From presale foundation to a complete builder economy."
          description="The roadmap is structured around activating the token lifecycle, expanding the AI builder systems, and growing the KORAX launch ecosystem."
          action={{
            href: "/roadmap",
            label: "Full Roadmap",
          }}
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {roadmap.map((phase, index) => (
            <article
              key={phase.phase}
              className="home-card flex flex-col rounded-[28px] border border-white/10 bg-black/30 p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs font-black uppercase tracking-[0.2em] text-blue-100">
                  {phase.phase}
                </div>

                <Badge tone={index === 0 ? "blue" : "slate"}>
                  {phase.status}
                </Badge>
              </div>

              <h3 className="mt-5 text-xl font-black text-white">
                {phase.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-white/54">
                {phase.description}
              </p>

              <div className="mt-6 space-y-3 border-t border-white/10 pt-5">
                {phase.items.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 text-sm leading-6 text-white/58"
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
          eyebrow="KORAX Workflow"
          title="Participate. Claim. Build."
          description="The ecosystem is structured as a progressive user journey, from KRX participation to project creation and launch."
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {workflow.map((step) => (
            <article
              key={step.number}
              className="home-card group rounded-[28px] border border-white/10 bg-[#050914]/70 p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-sm font-black text-blue-100">
                {step.number}
              </div>

              <h3 className="mt-6 text-xl font-black text-white">
                {step.title}
              </h3>

              <p className="mt-3 min-h-[84px] text-sm leading-7 text-white/55">
                {step.description}
              </p>

              <Link
                href={step.link}
                className="mt-6 inline-flex items-center text-sm font-black text-blue-100 transition group-hover:text-white"
              >
                {step.linkLabel}

                <span className="ml-2 transition group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[38px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(0,0,0,0.32))] p-5 shadow-[0_28px_100px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:p-7 lg:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.11),transparent_34%),radial-gradient(circle_at_bottom,rgba(34,211,238,0.06),transparent_30%)]" />

        <div className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-blue-100">
              Ecosystem Connectivity
            </div>

            <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">
              Built for BNB Chain and major Web3 wallets.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/55">
              Wallet availability may depend on device, browser, region, wallet
              configuration, and supported connection methods.
            </p>
          </div>

          <div className="home-marquee mt-8 rounded-[24px] border border-white/10 bg-black/25">
            <div className="home-marquee-track">
              {[...partners, ...partners].map((partner, index) => (
                <div
                  key={`${partner.name}-${index}`}
                  className="home-partner-item"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    loading="lazy"
                    draggable={false}
                    className="h-10 w-auto max-w-[120px] object-contain opacity-90 transition hover:opacity-100"
                  />

                  <span className="whitespace-nowrap text-sm font-semibold text-white/75">
                    {partner.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[38px] border border-white/10 bg-[#030712]/76 p-5 shadow-[0_30px_110px_rgba(0,0,0,0.44)] backdrop-blur-xl sm:p-7 lg:p-8">
        <SectionHeading
          eyebrow="Trust & Transparency"
          title="Clear information before interaction."
          description="KORAX is an early-stage crypto ecosystem. Users should understand the utility, technical structure, timing, and risks before participating."
          action={{
            href: "/docs",
            label: "Read Project Docs",
          }}
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {trustItems.map((item) => (
            <article
              key={item.title}
              className="home-card rounded-[28px] border border-white/10 bg-black/30 p-5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-xs font-black text-blue-100">
                {item.icon}
              </div>

              <h3 className="mt-5 text-lg font-black text-white">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-white/55">
                {item.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/terms"
            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white/68 transition hover:bg-white/[0.08] hover:text-white"
          >
            Terms of Service
          </Link>

          <Link
            href="/privacy"
            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white/68 transition hover:bg-white/[0.08] hover:text-white"
          >
            Privacy Policy
          </Link>

          <Link
            href="/about"
            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white/68 transition hover:bg-white/[0.08] hover:text-white"
          >
            About KORAX
          </Link>
        </div>
      </section>

      <section className="rounded-[38px] border border-white/10 bg-black/20 p-5 backdrop-blur-xl sm:p-7 lg:p-8">
        <SectionHeading
          eyebrow="Frequently Asked Questions"
          title="Essential KORAX information."
          description="Use only the official website and official KORAX social channels when confirming project information."
        />

        <div className="mt-8 grid gap-3 lg:grid-cols-2">
          {faqs.map((faq, index) => (
            <details
              key={faq.question}
              className="home-faq group rounded-[24px] border border-white/10 bg-[#050914]/70 p-5 transition duration-300"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-black text-white">
                <span className="flex items-center gap-3">
                  <span className="text-xs font-black text-blue-100/55">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {faq.question}
                </span>

                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.045] text-blue-100 transition duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>

              <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-7 text-white/57">
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

            <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-5xl">
              Your path to the top begins with KORAX.
            </h2>

            <p className="mt-5 text-sm leading-8 text-white/60 sm:text-base">
              Explore the presale, understand the documentation, test the
              builder tools, and follow the development of the wider KORAX
              ecosystem.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              href="/presale"
              className="inline-flex min-w-[200px] items-center justify-center rounded-2xl bg-blue-500 px-6 py-3.5 text-sm font-black text-white shadow-[0_0_40px_rgba(59,130,246,0.32)] transition duration-300 hover:-translate-y-0.5 hover:bg-blue-400"
            >
              Enter Presale
              <span className="ml-2">↗</span>
            </Link>

            <Link
              href="/docs"
              className="inline-flex min-w-[200px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] px-6 py-3.5 text-sm font-black text-white transition duration-300 hover:-translate-y-0.5 hover:border-blue-400/25 hover:bg-blue-500/10"
            >
              Read Documentation
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-amber-300/15 bg-amber-300/[0.045] px-5 py-4 text-xs leading-6 text-white/45">
        <span className="font-black text-amber-100/75">
          Important risk notice:
        </span>{" "}
        KRX is a crypto asset. Crypto assets are volatile and may lose part or
        all of their value. KORAX does not guarantee profit, liquidity,
        exchange listing, adoption, or future price performance. Always verify
        official information and conduct your own research.
      </section>
    </div>
  );
}