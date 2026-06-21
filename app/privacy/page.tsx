const privacyItems = [
  {
    title: "1. General Approach",
    body: "KORAX is designed to minimize personal data collection wherever possible. The platform is focused on blockchain infrastructure, wallet-based interaction, AI builder tools, and Web3 project workflows rather than traditional account-based user storage.",
    icon: "🛡️",
  },
  {
    title: "2. Wallet Connections",
    body: "When users connect a wallet, the connection is handled through third-party wallet providers. KORAX does not store private keys, seed phrases, recovery phrases, or wallet passwords.",
    icon: "👛",
  },
  {
    title: "3. Blockchain Visibility",
    body: "Blockchain transactions are public by design. Users should understand that wallet activity, token transfers, presale participation, staking actions, claims, and smart-contract interactions may be visible through blockchain explorers.",
    icon: "🔗",
  },
  {
    title: "4. Personal Information",
    body: "KORAX does not intentionally collect personal information unless explicitly provided through contact forms, applications, support requests, creator submissions, or future project launch tools.",
    icon: "📦",
  },
  {
    title: "5. Third-Party Services",
    body: "Some platform features may interact with third-party providers such as wallet software, hosting infrastructure, analytics services, deployment services, RPC providers, or blockchain explorers. Those providers may apply their own privacy practices.",
    icon: "🌐",
  },
  {
    title: "6. Security",
    body: "Reasonable technical measures may be used to protect platform integrity, but no online system, website, smart contract, wallet provider, or blockchain interface can guarantee absolute security.",
    icon: "🔐",
  },
  {
    title: "7. Policy Updates",
    body: "This privacy policy may be updated over time as the KORAX platform evolves, especially as new features such as builder tools, launch infrastructure, project registry, and creator workflows are expanded.",
    icon: "⚙️",
  },
];

const highlights = [
  "KORAX does not store seed phrases",
  "Wallet activity can be public on-chain",
  "Third-party wallets have their own policies",
  "Users control their own wallet security",
];

function PrivacyKoraxLogo() {
  return (
    <div className="privacy-logo-zone relative flex min-h-[330px] flex-col items-center justify-center overflow-visible bg-transparent">
      <div className="privacy-logo-glow absolute h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute h-44 w-44 rounded-full bg-cyan-400/10 blur-2xl" />
      <div className="absolute h-28 w-28 rounded-full bg-white/5 blur-2xl" />

      <img
        src="/Korax-logo.png"
        alt="KORAX official logo"
        className="privacy-logo-spin relative h-48 w-48 bg-transparent object-contain drop-shadow-[0_0_36px_rgba(59,130,246,0.95)] sm:h-56 sm:w-56 lg:h-60 lg:w-60"
      />

      <img
        src="/korax-wordmark.png"
        alt="KORAX wordmark"
        className="privacy-wordmark-float relative mt-4 h-14 w-auto max-w-[280px] bg-transparent object-contain drop-shadow-[0_0_24px_rgba(59,130,246,0.95)] sm:h-16 sm:max-w-[360px]"
      />

      <div className="privacy-energy-ring pointer-events-none absolute h-72 w-72 rounded-full border border-blue-400/10" />
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <div className="space-y-8">
      <style>{`
        @keyframes privacyFloat {
          0%, 100% {
            transform: translateY(0) rotateX(0deg) rotateY(0deg);
          }
          50% {
            transform: translateY(-12px) rotateX(3deg) rotateY(-3deg);
          }
        }

        @keyframes privacyLogoSpin {
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

        @keyframes privacyWordmarkFloat {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.94;
          }
          50% {
            transform: translateY(-7px) scale(1.02);
            opacity: 1;
          }
        }

        @keyframes privacyLogoGlow {
          0%, 100% {
            opacity: 0.34;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.16);
          }
        }

        @keyframes privacyRing {
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

        @keyframes privacyScan {
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

        @keyframes privacyShimmer {
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

        .privacy-hero-3d {
          transform-style: preserve-3d;
          perspective: 1200px;
        }

        .privacy-float {
          animation: privacyFloat 6.8s ease-in-out infinite;
          will-change: transform;
          transform-style: preserve-3d;
        }

        .privacy-logo-zone,
        .privacy-logo-zone img,
        .privacy-wordmark-float {
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .privacy-logo-spin {
          transform-style: preserve-3d;
          animation: privacyLogoSpin 9s linear infinite;
          will-change: transform;
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .privacy-wordmark-float {
          animation: privacyWordmarkFloat 4s ease-in-out infinite;
          will-change: transform;
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .privacy-logo-glow {
          animation: privacyLogoGlow 3.6s ease-in-out infinite;
        }

        .privacy-energy-ring {
          animation: privacyRing 12s linear infinite;
        }

        .privacy-scan {
          animation: privacyScan 4s ease-in-out infinite;
        }

        .privacy-shimmer {
          animation: privacyShimmer 5s ease-in-out infinite;
        }

        .privacy-card-3d {
          transform-style: preserve-3d;
          transition:
            transform 220ms ease,
            border-color 220ms ease,
            background 220ms ease,
            box-shadow 220ms ease;
        }

        .privacy-card-3d:hover {
          transform: translateY(-5px) rotateX(2deg) rotateY(-2deg);
          border-color: rgba(59, 130, 246, 0.38);
          background: rgba(37, 99, 235, 0.08);
          box-shadow: 0 28px 90px rgba(59, 130, 246, 0.14);
        }

        @media (prefers-reduced-motion: reduce) {
          .privacy-float,
          .privacy-logo-spin,
          .privacy-wordmark-float,
          .privacy-logo-glow,
          .privacy-energy-ring,
          .privacy-scan,
          .privacy-shimmer {
            animation: none;
          }

          .privacy-card-3d:hover {
            transform: none;
          }
        }
      `}</style>

      <section className="privacy-hero-3d relative overflow-hidden rounded-[38px] border border-white/10 bg-black/35 p-6 shadow-[0_35px_130px_rgba(0,0,0,0.62)] backdrop-blur-md sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.13),transparent_32%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.075] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="privacy-scan pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent" />
        <div className="privacy-shimmer pointer-events-none absolute left-0 top-0 h-full w-1/4 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

        <div className="relative grid gap-10 lg:grid-cols-[1.06fr_.94fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-blue-100 shadow-[0_0_30px_rgba(59,130,246,0.16)]">
              KORAX Privacy Framework 🛡️
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              Privacy
              <span className="block bg-gradient-to-r from-blue-100 via-white to-blue-200 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(59,130,246,0.55)]">
                Policy.
              </span>
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/68 sm:text-lg">
              This page explains how KORAX approaches privacy, wallet
              interaction, public blockchain data, third-party services, and
              user responsibility across the KORAX ecosystem.
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
          </div>

          <div className="privacy-float relative rounded-[38px] border border-white/10 bg-black/30 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.52)]">
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-blue-500/15 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

            <PrivacyKoraxLogo />

            <div className="mt-4 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4 shadow-[0_0_38px_rgba(59,130,246,0.10)]">
              <div className="text-xs uppercase tracking-[0.22em] text-white/45">
                Privacy Mode
              </div>

              <div className="mt-2 text-2xl font-black text-blue-100">
                Wallet-first Access
              </div>

              <p className="mt-2 text-sm leading-relaxed text-white/65">
                KORAX does not store wallet seed phrases or private keys. Users
                remain responsible for wallet security and on-chain actions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {privacyItems.map((item) => (
          <section
            key={item.title}
            className="privacy-card-3d relative overflow-hidden rounded-[28px] border border-white/10 bg-black/25 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.32)] backdrop-blur-md"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.11),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.07),transparent_34%)]" />

            <div className="relative flex items-start justify-between gap-4">
              <h2 className="text-xl font-black text-white">{item.title}</h2>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/35 text-2xl shadow-[0_0_35px_rgba(59,130,246,0.14)]">
                {item.icon}
              </div>
            </div>

            <p className="relative mt-4 text-sm leading-7 text-white/65">
              {item.body}
            </p>
          </section>
        ))}
      </section>

      <section className="relative overflow-hidden rounded-[34px] border border-blue-400/20 bg-blue-500/10 p-6 shadow-[0_25px_80px_rgba(0,0,0,.38)] backdrop-blur-md">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.08),transparent_34%)]" />

        <div className="relative">
          <p className="text-xs font-black uppercase tracking-[0.26em] text-blue-100">
            User Control 👛
          </p>

          <h2 className="mt-3 text-2xl font-black text-white">
            Your wallet, your responsibility
          </h2>

          <p className="mt-4 max-w-4xl text-sm leading-7 text-white/70">
            KORAX cannot recover lost wallets, private keys, seed phrases, or
            incorrectly approved transactions. Always verify the website,
            contract addresses, wallet confirmations, network, and transaction
            details before signing any blockchain action.
          </p>
        </div>
      </section>
    </div>
  );
}