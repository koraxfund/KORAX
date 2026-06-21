const corePrinciples = [
  {
    icon: "🔍",
    title: "Transparency",
    desc: "KORAX is designed around visible presale mechanics, clear claiming flows, on-chain project registration, and easy-to-understand launch infrastructure.",
  },
  {
    icon: "⚡",
    title: "Simplicity",
    desc: "The goal is to reduce unnecessary complexity and help builders move from idea to token, website, and launch flow with a guided Web3 system.",
  },
  {
    icon: "🛡️",
    title: "Sustainability",
    desc: "KRX follows a fixed-supply model, while staking rewards and builder access are structured through transparent allocation logic.",
  },
];

const buildItems = [
  {
    icon: "🤖",
    title: "Token Builder AI",
    desc: "Create AI-assisted token concepts, token settings, staking plans, project strategy, and deploy-ready Web3 project structures.",
  },
  {
    icon: "🌐",
    title: "Website Builder AI",
    desc: "Generate premium Web3 websites for launched projects, including branding, sections, content structure, and deployment-ready files.",
  },
  {
    icon: "🚀",
    title: "Launch Infrastructure",
    desc: "Connect projects with Launchpad access, staged sale logic, public project registry visibility, USDT / USDC participation, and claim flows.",
  },
  {
    icon: "🔗",
    title: "On-chain Project Registry",
    desc: "Projects can be registered on-chain so they can appear publicly through KORAX launch pages and ecosystem tools.",
  },
];

const visionSteps = [
  "Start with KRX presale, claim, staking, and access logic.",
  "Expand into AI-assisted project creation and website generation.",
  "Connect project builders with public launch infrastructure.",
  "Build a stronger Web3 ecosystem where creators can launch with more clarity.",
];

const ecosystemCards = [
  {
    title: "KRX Access",
    desc: "KRX staking and access levels are designed to support builder tools, launch participation, and ecosystem utility.",
  },
  {
    title: "Builder Workflow",
    desc: "Token Builder AI and Website Builder AI help creators prepare their project foundation faster and with stronger structure.",
  },
  {
    title: "Launch Visibility",
    desc: "Registered projects can appear through KORAX public launch pages, giving builders a clear place to present their project.",
  },
];

const heroTags = [
  "KRX Token",
  "AI Builders",
  "Website Builder AI",
  "Token Builder AI",
  "Launchpad",
  "Staking",
  "Project Registry",
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
      <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-100">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
        {title}
      </h2>

      {desc ? <p className="mt-3 leading-8 text-white/65">{desc}</p> : null}
    </div>
  );
}

function AboutCard({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="about-card-3d rounded-[28px] border border-white/10 bg-black/25 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.32)] backdrop-blur-md">
      <div className="about-icon-3d flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-blue-500/10 text-2xl shadow-[0_0_35px_rgba(59,130,246,0.14)]">
        {icon}
      </div>

      <h3 className="mt-4 text-lg font-black text-white">{title}</h3>

      <p className="mt-3 text-sm leading-7 text-white/64">{desc}</p>
    </div>
  );
}

function HeroKoraxBrand() {
  return (
    <div className="about-brand-float relative flex min-h-[330px] flex-col items-center justify-center overflow-visible bg-transparent">
      <div className="about-logo-glow absolute h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute h-44 w-44 rounded-full bg-cyan-400/10 blur-2xl" />
      <div className="absolute h-28 w-28 rounded-full bg-white/5 blur-2xl" />

      <img
        src="/Korax-logo.png"
        alt="KORAX official logo"
        className="about-logo-spin relative h-48 w-48 bg-transparent object-contain drop-shadow-[0_0_36px_rgba(59,130,246,0.95)] sm:h-56 sm:w-56 lg:h-60 lg:w-60"
      />

      <img
        src="/korax-wordmark.png"
        alt="KORAX wordmark"
        className="about-wordmark-float relative mt-4 h-14 w-auto max-w-[280px] bg-transparent object-contain drop-shadow-[0_0_24px_rgba(59,130,246,0.95)] sm:h-16 sm:max-w-[360px]"
      />

      <div className="about-energy-ring pointer-events-none absolute h-72 w-72 rounded-full border border-blue-400/10" />
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <style>{`
        @keyframes aboutFloat {
          0%, 100% {
            transform: translateY(0) rotateX(0deg) rotateY(0deg);
          }
          50% {
            transform: translateY(-12px) rotateX(3deg) rotateY(-3deg);
          }
        }

        @keyframes aboutLogoSpin {
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

        @keyframes aboutWordmarkFloat {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.94;
          }
          50% {
            transform: translateY(-7px) scale(1.02);
            opacity: 1;
          }
        }

        @keyframes aboutLogoGlow {
          0%, 100% {
            opacity: 0.34;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.16);
          }
        }

        @keyframes aboutRing {
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

        @keyframes aboutScan {
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

        @keyframes aboutShimmer {
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

        .about-hero-3d {
          transform-style: preserve-3d;
          perspective: 1200px;
        }

        .about-brand-float {
          transform-style: preserve-3d;
          animation: aboutFloat 6.8s ease-in-out infinite;
          will-change: transform;
        }

        .about-logo-spin {
          transform-style: preserve-3d;
          animation: aboutLogoSpin 9s linear infinite;
          will-change: transform;
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .about-wordmark-float {
          animation: aboutWordmarkFloat 4s ease-in-out infinite;
          will-change: transform;
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .about-logo-glow {
          animation: aboutLogoGlow 3.6s ease-in-out infinite;
        }

        .about-energy-ring {
          animation: aboutRing 12s linear infinite;
        }

        .about-scan-line {
          animation: aboutScan 4s ease-in-out infinite;
        }

        .about-shimmer {
          animation: aboutShimmer 5s ease-in-out infinite;
        }

        .about-card-3d {
          position: relative;
          transform-style: preserve-3d;
          transition:
            transform 220ms ease,
            border-color 220ms ease,
            background 220ms ease,
            box-shadow 220ms ease;
        }

        .about-card-3d::after {
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

        .about-card-3d:hover {
          transform: translateY(-7px) rotateX(2deg) rotateY(-2deg);
          border-color: rgba(59, 130, 246, 0.42);
          background: rgba(37, 99, 235, 0.075);
          box-shadow: 0 34px 100px rgba(59, 130, 246, 0.16);
        }

        .about-card-3d:hover::after {
          opacity: 1;
        }

        .about-icon-3d {
          transform: translateZ(24px);
        }

        .about-brand-float,
        .about-brand-float img {
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        @media (prefers-reduced-motion: reduce) {
          .about-brand-float,
          .about-logo-spin,
          .about-wordmark-float,
          .about-logo-glow,
          .about-energy-ring,
          .about-scan-line,
          .about-shimmer {
            animation: none;
          }

          .about-card-3d:hover {
            transform: none;
          }
        }
      `}</style>

      <section className="about-hero-3d relative overflow-hidden rounded-[38px] border border-white/10 bg-black/35 p-6 shadow-[0_35px_130px_rgba(0,0,0,0.62)] backdrop-blur-md md:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.13),transparent_32%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.075] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="about-scan-line pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent" />
        <div className="about-shimmer pointer-events-none absolute left-0 top-0 h-full w-1/4 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

        <div className="relative grid gap-10 lg:grid-cols-[1.06fr_.94fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-blue-100 shadow-[0_0_30px_rgba(59,130,246,0.16)]">
              About KORAX ⚡
            </div>

            <h1 className="mt-6 max-w-5xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              Building a serious
              <span className="block bg-gradient-to-r from-blue-100 via-white to-blue-200 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(59,130,246,0.55)]">
                Web3 builder ecosystem.
              </span>
            </h1>

            <p className="mt-5 max-w-4xl text-base leading-8 text-white/70 sm:text-lg">
              KORAX is a BNB Chain ecosystem focused on presale, claim, staking,
              AI-assisted project creation, Website Builder AI, Token Builder AI,
              public project registry tools, and launch infrastructure for Web3
              builders.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {heroTags.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/70 shadow-[0_14px_50px_rgba(0,0,0,0.18)]"
                >
                  <span className="text-blue-100">✦</span> {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative rounded-[38px] border border-white/10 bg-black/30 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.52)]">
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-blue-500/15 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

            <HeroKoraxBrand />

            <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4 text-center shadow-[0_0_38px_rgba(59,130,246,0.10)]">
              <div className="text-xs uppercase tracking-[0.22em] text-white/45">
                Ecosystem Identity
              </div>

              <div className="mt-2 text-2xl font-black text-blue-100">
                KRX • Builders • Launch
              </div>

              <p className="mt-2 text-sm leading-relaxed text-white/65">
                A connected platform direction for creators, holders, and Web3
                project launch participants.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div className="about-card-3d rounded-[34px] border border-white/10 bg-black/25 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-md">
          <SectionTitle
            eyebrow="Mission 🎯"
            title="Make Web3 creation easier, clearer, and more launch-ready."
            desc="The mission of KORAX is to simplify blockchain project creation and token launches while preserving transparency and fairness for both creators and participants."
          />

          <p className="mt-4 leading-8 text-white/68">
            KORAX starts with its own structured KRX ecosystem, then expands into
            a builder platform where projects can be created, registered,
            launched, and presented through connected tools.
          </p>
        </div>

        <div className="about-card-3d rounded-[34px] border border-blue-400/20 bg-blue-500/10 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-md">
          <SectionTitle
            eyebrow="What makes it different 🧠"
            title="KORAX is not only a token page."
            desc="It combines token access, staking logic, project registration, Website Builder AI, Token Builder AI, and Launchpad tools into one connected ecosystem."
          />

          <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm leading-7 text-white/70">
            Builders can move from idea → token → project page → launch setup →
            public visibility inside one KORAX workflow.
          </div>
        </div>
      </section>

      <section className="rounded-[34px] border border-white/10 bg-black/20 p-6 backdrop-blur-md">
        <SectionTitle
          eyebrow="What KORAX Builds 🛠️"
          title="Tools for creators, holders, and launch participants."
          desc="KORAX is designed to give Web3 builders the tools they need to shape ideas, deploy projects, create websites, and prepare launch flows with more structure."
        />

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {buildItems.map((item) => (
            <AboutCard
              key={item.title}
              icon={item.icon}
              title={item.title}
              desc={item.desc}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[34px] border border-white/10 bg-black/25 p-6 backdrop-blur-md">
          <SectionTitle
            eyebrow="Long-Term Vision 🚀"
            title="From KRX ecosystem to Web3 launch platform."
            desc="The long-term vision is to help more people build, launch, and grow blockchain projects through a platform that is easier to access and more transparent than traditional launch models."
          />

          <div className="mt-5 space-y-3">
            {visionSteps.map((step, index) => (
              <div
                key={step}
                className="about-card-3d flex gap-3 rounded-2xl border border-white/10 bg-black/25 p-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-black text-white shadow-[0_0_25px_rgba(59,130,246,0.28)]">
                  {index + 1}
                </div>

                <p className="text-sm leading-7 text-white/68">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[34px] border border-white/10 bg-black/25 p-6 backdrop-blur-md">
          <SectionTitle
            eyebrow="Ecosystem Direction 🌌"
            title="Built around access, utility, and public launch visibility."
          />

          <div className="mt-5 grid gap-4">
            {ecosystemCards.map((item) => (
              <div
                key={item.title}
                className="about-card-3d rounded-2xl border border-white/10 bg-black/25 p-4"
              >
                <div className="text-sm font-black text-white">
                  {item.title}
                </div>

                <p className="mt-2 text-sm leading-7 text-white/62">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[34px] border border-white/10 bg-black/20 p-6 backdrop-blur-md">
        <SectionTitle
          eyebrow="Core Principles 🧩"
          title="The foundation behind KORAX."
        />

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {corePrinciples.map((item) => (
            <AboutCard
              key={item.title}
              icon={item.icon}
              title={item.title}
              desc={item.desc}
            />
          ))}
        </div>
      </section>
    </div>
  );
}