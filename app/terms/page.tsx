const terms = [
  {
    title: "1. Use of Platform",
    body: "KORAX provides blockchain-related infrastructure, informational pages, presale interfaces, claim tools, staking pages, AI builder tools, and future launchpad infrastructure. Access to the platform is subject to local laws and user responsibility.",
    icon: "🌐",
  },
  {
    title: "2. No Financial Advice",
    body: "Nothing on the KORAX platform should be interpreted as financial, investment, trading, tax, or legal advice. All information is provided for general informational and platform-use purposes only.",
    icon: "⚠️",
  },
  {
    title: "3. Risk Acknowledgment",
    body: "Participation in token presales, staking, blockchain tools, or Web3-related activities involves risk and may result in partial or total loss of funds. Users participate at their own risk.",
    icon: "🛡️",
  },
  {
    title: "4. User Responsibility",
    body: "Users are responsible for their wallets, private keys, seed phrases, connected devices, transaction approvals, and all actions performed through their wallet connections.",
    icon: "👛",
  },
  {
    title: "5. Creator Tools",
    body: "KORAX may provide creator tools such as Launch Your Project, Token Builder AI, Website Builder AI, registry tools, and project creation workflows. Project owners remain fully responsible for projects they build, publish, deploy, or launch using such tools.",
    icon: "🤖",
  },
  {
    title: "6. Service Changes",
    body: "KORAX may modify, expand, suspend, limit, upgrade, or remove platform features, documentation, smart-contract interfaces, builder tools, or ecosystem infrastructure at any time.",
    icon: "⚙️",
  },
  {
    title: "7. Legal Compliance",
    body: "Users must ensure that their use of KORAX is lawful in their jurisdiction. KORAX does not guarantee regulatory suitability, availability, or compliance in every country or region.",
    icon: "📜",
  },
];

const highlights = [
  "Use the platform responsibly",
  "Review wallet transactions carefully",
  "Understand Web3 and smart-contract risks",
  "Follow your local laws and regulations",
];

function TermsKoraxLogo() {
  return (
    <div className="terms-logo-zone relative flex min-h-[330px] flex-col items-center justify-center overflow-visible bg-transparent">
      <div className="terms-logo-glow absolute h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute h-44 w-44 rounded-full bg-cyan-400/10 blur-2xl" />
      <div className="absolute h-28 w-28 rounded-full bg-white/5 blur-2xl" />

      <img
        src="/Korax-logo.png"
        alt="KORAX official logo"
        className="terms-logo-spin relative h-48 w-48 bg-transparent object-contain drop-shadow-[0_0_36px_rgba(59,130,246,0.95)] sm:h-56 sm:w-56 lg:h-60 lg:w-60"
      />

      <img
        src="/korax-wordmark.png"
        alt="KORAX wordmark"
        className="terms-wordmark-float relative mt-4 h-14 w-auto max-w-[280px] bg-transparent object-contain drop-shadow-[0_0_24px_rgba(59,130,246,0.95)] sm:h-16 sm:max-w-[360px]"
      />

      <div className="terms-energy-ring pointer-events-none absolute h-72 w-72 rounded-full border border-blue-400/10" />
    </div>
  );
}

export default function TermsPage() {
  return (
    <div className="space-y-8">
      <style>{`
        @keyframes termsFloat {
          0%, 100% {
            transform: translateY(0) rotateX(0deg) rotateY(0deg);
          }
          50% {
            transform: translateY(-12px) rotateX(3deg) rotateY(-3deg);
          }
        }

        @keyframes termsLogoSpin {
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

        @keyframes termsWordmarkFloat {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.94;
          }
          50% {
            transform: translateY(-7px) scale(1.02);
            opacity: 1;
          }
        }

        @keyframes termsLogoGlow {
          0%, 100% {
            opacity: 0.34;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.16);
          }
        }

        @keyframes termsRing {
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

        @keyframes termsScan {
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

        @keyframes termsShimmer {
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

        .terms-hero-3d {
          transform-style: preserve-3d;
          perspective: 1200px;
        }

        .terms-float {
          animation: termsFloat 6.8s ease-in-out infinite;
          will-change: transform;
          transform-style: preserve-3d;
        }

        .terms-logo-zone,
        .terms-logo-zone img,
        .terms-wordmark-float {
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .terms-logo-spin {
          transform-style: preserve-3d;
          animation: termsLogoSpin 9s linear infinite;
          will-change: transform;
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .terms-wordmark-float {
          animation: termsWordmarkFloat 4s ease-in-out infinite;
          will-change: transform;
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .terms-logo-glow {
          animation: termsLogoGlow 3.6s ease-in-out infinite;
        }

        .terms-energy-ring {
          animation: termsRing 12s linear infinite;
        }

        .terms-scan {
          animation: termsScan 4s ease-in-out infinite;
        }

        .terms-shimmer {
          animation: termsShimmer 5s ease-in-out infinite;
        }

        .terms-card-3d {
          transform-style: preserve-3d;
          transition:
            transform 220ms ease,
            border-color 220ms ease,
            background 220ms ease,
            box-shadow 220ms ease;
        }

        .terms-card-3d:hover {
          transform: translateY(-5px) rotateX(2deg) rotateY(-2deg);
          border-color: rgba(59, 130, 246, 0.38);
          background: rgba(37, 99, 235, 0.08);
          box-shadow: 0 28px 90px rgba(59, 130, 246, 0.14);
        }

        @media (prefers-reduced-motion: reduce) {
          .terms-float,
          .terms-logo-spin,
          .terms-wordmark-float,
          .terms-logo-glow,
          .terms-energy-ring,
          .terms-scan,
          .terms-shimmer {
            animation: none;
          }

          .terms-card-3d:hover {
            transform: none;
          }
        }
      `}</style>

      <section className="terms-hero-3d relative overflow-hidden rounded-[38px] border border-white/10 bg-black/35 p-6 shadow-[0_35px_130px_rgba(0,0,0,0.62)] backdrop-blur-md sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.13),transparent_32%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.075] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="terms-scan pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent" />
        <div className="terms-shimmer pointer-events-none absolute left-0 top-0 h-full w-1/4 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

        <div className="relative grid gap-10 lg:grid-cols-[1.06fr_.94fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-blue-100 shadow-[0_0_30px_rgba(59,130,246,0.16)]">
              KORAX Legal Framework 📜
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              Terms of
              <span className="block bg-gradient-to-r from-blue-100 via-white to-blue-200 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(59,130,246,0.55)]">
                Service.
              </span>
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/68 sm:text-lg">
              By accessing or using the KORAX platform, you agree to these
              terms. These terms apply to the KORAX website, presale pages,
              claim tools, staking interfaces, AI builder tools, launch
              infrastructure, and related ecosystem features.
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

          <div className="terms-float relative rounded-[38px] border border-white/10 bg-black/30 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.52)]">
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-blue-500/15 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

            <TermsKoraxLogo />

            <div className="mt-4 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4 shadow-[0_0_38px_rgba(59,130,246,0.10)]">
              <div className="text-xs uppercase tracking-[0.22em] text-white/45">
                Platform Terms
              </div>

              <div className="mt-2 text-2xl font-black text-blue-100">
                Read Carefully
              </div>

              <p className="mt-2 text-sm leading-relaxed text-white/65">
                Web3 participation requires user responsibility, wallet
                security, and understanding of blockchain risk.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {terms.map((item) => (
          <section
            key={item.title}
            className="terms-card-3d relative overflow-hidden rounded-[28px] border border-white/10 bg-black/25 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.32)] backdrop-blur-md"
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

      <section className="relative overflow-hidden rounded-[34px] border border-yellow-300/20 bg-yellow-300/10 p-6 shadow-[0_25px_80px_rgba(0,0,0,.38)] backdrop-blur-md">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_34%)]" />

        <div className="relative">
          <p className="text-xs font-black uppercase tracking-[0.26em] text-yellow-100">
            Important Notice ⚠️
          </p>

          <h2 className="mt-3 text-2xl font-black text-white">
            Blockchain participation carries risk
          </h2>

          <p className="mt-4 max-w-4xl text-sm leading-7 text-white/70">
            KORAX provides tools and interfaces for Web3 participation and
            project creation. Users must do their own research, understand the
            risks of blockchain transactions, review wallet confirmations
            carefully, and comply with the laws of their jurisdiction.
          </p>
        </div>
      </section>
    </div>
  );
}