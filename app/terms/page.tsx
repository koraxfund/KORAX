import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Terms of Service | KORAX",
  description:
    "Terms governing access to and use of the KORAX website, KRX interfaces, staking, AI builder tools, project registry, and launch infrastructure.",
  alternates: {
    canonical: "https://www.korax.fund/terms",
  },
  openGraph: {
    title: "KORAX Terms of Service",
    description:
      "Terms governing the KORAX website, blockchain interfaces, AI builders, registry, staking, presale, claim, and launch infrastructure.",
    url: "https://www.korax.fund/terms",
    type: "website",
    images: [
      {
        url: "https://www.korax.fund/Korax-logo.png",
        width: 1200,
        height: 630,
        alt: "KORAX Terms of Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KORAX Terms of Service",
    description:
      "Terms governing access to and use of the KORAX ecosystem.",
    images: ["https://www.korax.fund/Korax-logo.png"],
  },
};

type TermSection = {
  id: string;
  title: string;
  summary: string;
  icon: string;
  paragraphs?: string[];
  bullets?: string[];
  accent?: "blue" | "cyan" | "amber" | "red";
};

const LAST_UPDATED = "18 July 2026";
const CONTACT_EMAIL = "contact@korax.fund";

const quickPoints = [
  "You control and secure your own wallet.",
  "Blockchain transactions are generally irreversible.",
  "Crypto assets, staking, presales, and launches involve substantial risk.",
  "AI-generated output must be independently reviewed before use.",
];

const sections: TermSection[] = [
  {
    id: "acceptance",
    title: "1. Acceptance of these Terms",
    summary:
      "These Terms form the agreement governing your access to and use of KORAX.",
    icon: "✓",
    accent: "blue",
    paragraphs: [
      "By accessing, connecting a wallet to, or using any part of the KORAX website or ecosystem, you confirm that you have read, understood, and agreed to these Terms of Service.",
      "These Terms apply to public information pages and to KORAX interfaces for KRX, presale participation, claiming, staking, AI-assisted project creation, website generation, public project registry functions, and launch infrastructure.",
      "If you do not agree to these Terms, do not access or use the platform or connect a wallet.",
    ],
  },
  {
    id: "operator",
    title: "2. Platform Contact",
    summary:
      "Official platform and legal enquiries must use the published KORAX contact channel.",
    icon: "◎",
    paragraphs: [
      `General legal and platform enquiries may be sent to ${CONTACT_EMAIL}. Never send private keys, seed phrases, passwords, or wallet recovery information by email.`,
    ],
    bullets: [
      "Community moderators, social-media accounts, and third-party contributors are not automatically authorised to make binding legal commitments for KORAX.",
      "Only information published through official KORAX channels should be treated as official platform information.",
    ],
  },
  {
    id: "eligibility",
    title: "3. Eligibility and Legal Capacity",
    summary:
      "You may use KORAX only when you can lawfully enter into these Terms.",
    icon: "18+",
    paragraphs: [
      "You must be at least 18 years old, have legal capacity to enter into binding agreements, and be legally permitted to use the relevant platform functions in your jurisdiction.",
      "You may not use KORAX where your access or participation would violate applicable law, sanctions, court orders, regulatory restrictions, or contractual obligations.",
    ],
    bullets: [
      "Do not access restricted functions on behalf of an ineligible person.",
      "Do not use false identity, ownership, jurisdiction, or wallet information.",
      "Do not circumvent technical, geographic, access-level, or contract-based restrictions.",
    ],
  },
  {
    id: "platform",
    title: "4. Nature of the Platform",
    summary:
      "KORAX provides software interfaces and infrastructure; it does not control your wallet.",
    icon: "◇",
    accent: "cyan",
    paragraphs: [
      "KORAX provides informational pages and software interfaces that may interact with public blockchain networks, smart contracts, wallet providers, APIs, hosting services, code repositories, and other third-party systems.",
      "Unless expressly stated otherwise for a specific feature, KORAX is non-custodial and does not hold your private keys or have the technical ability to recover your wallet.",
      "Availability of an interface does not mean that every related smart contract, token, project, external service, or transaction has been audited, endorsed, guaranteed, or approved by KORAX.",
    ],
  },
  {
    id: "wallet",
    title: "5. Wallet Security and Transaction Approval",
    summary:
      "You are responsible for your wallet, device, approvals, and transaction decisions.",
    icon: "◈",
    bullets: [
      "Keep private keys, seed phrases, passwords, devices, and recovery methods secure.",
      "Verify the network, contract address, token, recipient, allowance, amount, gas fee, and transaction data before confirmation.",
      "Review token approvals and revoke permissions you no longer need through trusted tools.",
      "Use official KORAX channels to confirm contract addresses and platform notices.",
      "Do not approve transactions you do not understand.",
    ],
    paragraphs: [
      "Transactions signed through your wallet are treated as authorised by you. KORAX is not responsible for loss caused by compromised wallets, phishing, malicious extensions, copied addresses, user error, unsafe devices, or third-party wallet failures.",
    ],
  },
  {
    id: "blockchain",
    title: "6. Blockchain and Smart-Contract Risk",
    summary:
      "Public blockchain systems may fail, change, become congested, or behave unexpectedly.",
    icon: "⌁",
    accent: "amber",
    bullets: [
      "Transactions are generally irreversible after confirmation.",
      "Network congestion, reorganisation, outages, forks, validators, RPC failures, and gas-price changes may delay or prevent transactions.",
      "Smart contracts may contain defects, vulnerabilities, economic-design risks, permission risks, or unexpected behaviour.",
      "Displayed data may be delayed, incomplete, or inconsistent with the latest on-chain state.",
      "A transaction may fail while still consuming network gas.",
    ],
    paragraphs: [
      "You accept all risks arising from blockchain networks and smart-contract interaction. No interface can eliminate these risks.",
    ],
  },
  {
    id: "crypto",
    title: "7. Crypto-Asset and Market Risk",
    summary:
      "Crypto assets can lose some or all of their value.",
    icon: "⚠",
    accent: "red",
    paragraphs: [
      "KRX and any third-party project token may be highly volatile, illiquid, technically restricted, or become worthless. Participation does not guarantee profit, adoption, utility, liquidity, trading availability, exchange listing, or any future market value.",
      "Any planned price, listing target, roadmap objective, utility description, reward percentage, or development objective is not a promise of future performance.",
    ],
    bullets: [
      "Only participate with assets you can afford to lose.",
      "Conduct independent research before interacting with any token or project.",
      "Consider obtaining independent legal, tax, accounting, and financial advice.",
    ],
  },
  {
    id: "presale",
    title: "8. KRX Presale and Claim",
    summary:
      "Presale participation is governed by the deployed contract and its live state.",
    icon: "K",
    paragraphs: [
      "The presale interface may allow participation through supported payment assets and contract functions. The final result of any transaction is determined by the deployed smart contract and blockchain confirmation, not by a visual estimate shown in the interface.",
      "Purchased KRX may be subject to claim activation, vesting, staged releases, pauses, contract limits, and other on-chain conditions.",
    ],
    bullets: [
      "Preview calculations may change before transaction confirmation.",
      "Payment-token approval and purchase may require separate transactions.",
      "You are responsible for using the correct payment token and network.",
      "No listing, liquidity event, or market price is guaranteed after the presale.",
    ],
  },
  {
    id: "staking",
    title: "9. KRX Staking and Access",
    summary:
      "Staked assets remain subject to the selected plan and deployed contract logic.",
    icon: "⬡",
    paragraphs: [
      "KRX staking plans may lock tokens for a fixed period and calculate a predefined token reward. A displayed reward percentage describes the relevant plan and does not guarantee fiat profit, purchasing power, liquidity, or future KRX value.",
      "Builder or launch access may depend on eligible staking positions and Access Manager configuration. Requirements, project-slot calculations, and launch levels are determined by the deployed contracts and may be updated where the contract design permits.",
    ],
    bullets: [
      "Locked positions may not be withdrawable before their unlock time.",
      "Access shown by the interface can change when wallet or contract state changes.",
      "A project slot does not guarantee project success, approval, publication, participation, or market access.",
    ],
  },
  {
    id: "ai",
    title: "10. AI Builder Tools",
    summary:
      "AI output may be incomplete, inaccurate, insecure, or unsuitable for production.",
    icon: "AI",
    accent: "cyan",
    paragraphs: [
      "KORAX may provide AI-assisted tools for project strategy, token configuration, website generation, branding direction, content, documentation, code, and deployment preparation.",
      "AI output is generated automatically and may contain factual mistakes, insecure code, broken dependencies, misleading wording, intellectual-property conflicts, or legally unsuitable content.",
    ],
    bullets: [
      "Review, test, edit, and independently verify all generated output.",
      "Do not treat AI output as legal, financial, security, tax, or compliance advice.",
      "Do not deploy generated contracts or websites without appropriate testing and review.",
      "Do not submit confidential information, private keys, seed phrases, passwords, API secrets, or data you lack permission to use.",
      "KORAX does not guarantee that generated content is unique or free of third-party rights.",
    ],
  },
  {
    id: "creators",
    title: "11. Creator and Project-Owner Responsibility",
    summary:
      "Creators remain responsible for everything they build, publish, deploy, register, or launch.",
    icon: "⚙",
    paragraphs: [
      "A person using Token Builder AI, Website Builder AI, Launch, registry, deployment, GitHub, Vercel, or related creator functions remains the owner and responsible operator of the resulting project unless a separate written agreement states otherwise.",
      "KORAX does not become the issuer, promoter, operator, fiduciary, partner, agent, or guarantor of a creator project merely because KORAX tools were used.",
    ],
    bullets: [
      "Verify all tokenomics, permissions, supply, minting, burning, ownership, vault, staking, sale, and claim settings.",
      "Prepare all required disclosures, risk warnings, policies, licences, white papers, legal notices, and regulatory filings.",
      "Do not publish false audits, partnerships, approvals, statistics, guarantees, listings, team identities, or investment claims.",
      "Obtain rights to all text, images, trademarks, software, datasets, and other material used in the project.",
      "Maintain accurate project information and promptly correct material errors.",
    ],
  },
  {
    id: "launch",
    title: "12. Launchpad and Public Project Registry",
    summary:
      "Registration or visibility does not equal endorsement or due diligence.",
    icon: "↗",
    paragraphs: [
      "The launch infrastructure may allow approved creators to configure staged token sales and allow eligible users to participate through supported assets.",
      "Project registration, public visibility, a KORAX-generated website, or launchpad availability does not mean that KORAX has audited, endorsed, verified, recommended, or guaranteed the project.",
    ],
    bullets: [
      "Creators are responsible for sale-token funding, stage caps, prices, receivers, permissions, buyer access rules, closing, claims, and unsold-token handling.",
      "Buyers must independently review the project, contracts, token allocation, access requirements, contribution limits, and claim conditions.",
      "KORAX may hide or remove registry content from its interface where reasonably necessary, but blockchain records may remain permanently available.",
    ],
  },
  {
    id: "prohibited",
    title: "13. Prohibited Conduct",
    summary:
      "KORAX may not be used for unlawful, deceptive, abusive, or harmful activity.",
    icon: "⊘",
    accent: "red",
    bullets: [
      "Fraud, scams, theft, market manipulation, wash trading, misleading promotion, or impersonation.",
      "Money laundering, terrorist financing, sanctions evasion, or concealment of unlawful funds.",
      "Malware, phishing, credential theft, wallet draining, malicious contracts, exploits, or unauthorised access.",
      "Infringement of copyright, trademark, privacy, publicity, confidentiality, or other rights.",
      "Harassment, threats, unlawful discrimination, or distribution of illegal content.",
      "Automated abuse, denial-of-service activity, excessive scraping, or interference with platform operation.",
      "Misrepresentation of audits, partnerships, licensing, regulatory approval, guarantees, or expected returns.",
      "Use of KORAX to create or facilitate any project prohibited by applicable law.",
    ],
  },
  {
    id: "third-parties",
    title: "14. Third-Party Services and Links",
    summary:
      "External wallets, repositories, hosts, APIs, explorers, and projects operate independently.",
    icon: "↗",
    paragraphs: [
      "KORAX may connect to or link to third-party services such as wallet providers, blockchain RPC endpoints, BscScan, GitHub, Vercel, hosting providers, social networks, AI providers, and project websites.",
      "Third parties have their own terms, privacy practices, security models, fees, availability, and risks. KORAX does not control and is not responsible for their services or content.",
    ],
  },
  {
    id: "fees",
    title: "15. Fees, Gas, Taxes, and Costs",
    summary:
      "You are responsible for network fees and your own tax obligations.",
    icon: "≋",
    bullets: [
      "Blockchain gas fees are paid to the network, not refunded by KORAX, and may apply even to failed transactions.",
      "Third-party providers may charge separate fees.",
      "You are responsible for determining, reporting, and paying any applicable taxes, duties, levies, or reporting obligations.",
      "Any future KORAX platform fee will be disclosed through the relevant interface or contract before the applicable action.",
    ],
  },
  {
    id: "ip",
    title: "16. Intellectual Property",
    summary:
      "KORAX branding and platform materials remain protected.",
    icon: "©",
    paragraphs: [
      "Unless otherwise stated, KORAX names, logos, interface designs, documentation, visual assets, and original platform content are owned by or licensed to the KORAX operator.",
      "These Terms grant only a limited, revocable, non-exclusive, non-transferable right to access and use the platform for lawful purposes. They do not transfer ownership of KORAX intellectual property.",
    ],
    bullets: [
      "Do not copy, sell, sublicense, impersonate, or falsely present KORAX branding as your own.",
      "Open-source components remain governed by their respective licences.",
      "Creator-owned material remains subject to the rights and licences chosen by the creator and applicable third-party rights.",
    ],
  },
  {
    id: "privacy",
    title: "17. Privacy and Public Blockchain Data",
    summary:
      "Wallet activity on public blockchains may be visible permanently.",
    icon: "◉",
    paragraphs: [
      "Use of KORAX may involve processing of technical, wallet, transaction, authentication, repository, deployment, and support information as described in the Privacy Policy.",
      "Public blockchain data is generally visible to anyone and may be copied, analysed, or linked with other information by independent third parties. KORAX cannot erase or modify data recorded on a public blockchain.",
    ],
  },
  {
    id: "availability",
    title: "18. Availability, Maintenance, and Changes",
    summary:
      "Features may change, pause, fail, or be discontinued.",
    icon: "◌",
    paragraphs: [
      "KORAX may update, limit, suspend, replace, or discontinue interfaces, APIs, documentation, supported wallets, supported assets, AI tools, registry functions, launch features, and other services.",
      "Maintenance, security incidents, network conditions, legal requirements, third-party failures, or technical changes may affect availability.",
    ],
    bullets: [
      "No uninterrupted, error-free, or permanent availability is promised.",
      "Roadmaps and development plans are forward-looking and may change.",
      "KORAX may introduce reasonable security or usage limits.",
    ],
  },
  {
    id: "suspension",
    title: "19. Suspension and Termination",
    summary:
      "Access to hosted interfaces may be restricted for security, legal, or abuse-prevention reasons.",
    icon: "×",
    paragraphs: [
      "KORAX may restrict or terminate access to hosted platform functions where reasonably necessary to address unlawful conduct, security threats, abuse, infringement, sanctions risk, technical harm, or breach of these Terms.",
      "Suspension of a website interface may not prevent direct interaction with independently deployed public smart contracts. You remain responsible for understanding the contracts you use.",
    ],
  },
  {
    id: "disclaimer",
    title: "20. No Advice, Warranties, or Guarantees",
    summary:
      "The platform is provided on an as-available basis to the extent permitted by law.",
    icon: "!",
    accent: "amber",
    paragraphs: [
      "KORAX does not provide investment, financial, trading, brokerage, portfolio-management, tax, accounting, security, or legal advice.",
      "To the maximum extent permitted by applicable law, the platform and its content are provided without warranties of merchantability, fitness for a particular purpose, non-infringement, accuracy, availability, security, profitability, regulatory status, or compatibility.",
      "Nothing in these Terms excludes warranties or rights that cannot lawfully be excluded.",
    ],
  },
  {
    id: "liability",
    title: "21. Limitation of Liability",
    summary:
      "Liability is limited only where and to the extent permitted by mandatory law.",
    icon: "§",
    paragraphs: [
      "To the maximum extent permitted by law, KORAX is not liable for indirect, incidental, special, consequential, punitive, or purely economic losses arising from use of or inability to use the platform, third-party services, public blockchains, smart contracts, AI output, creator projects, tokens, market movements, wallet compromise, lost credentials, failed transactions, or lost opportunities.",
      "Nothing in these Terms excludes or limits liability where exclusion or limitation is prohibited, including mandatory liability for intent, gross negligence, injury to life, body, or health, fraud, or other non-excludable statutory rights.",
    ],
  },
  {
    id: "indemnity",
    title: "22. Creator Indemnity",
    summary:
      "Creators are responsible for claims caused by their projects and content.",
    icon: "◆",
    paragraphs: [
      "To the extent permitted by law, a creator agrees to defend, indemnify, and hold harmless the KORAX operator from third-party claims, losses, liabilities, and reasonable costs arising from the creator's project, content, token, contract, sale, website, marketing, infringement, unlawful conduct, or breach of these Terms.",
      "This clause does not apply where prohibited by mandatory consumer law or other non-waivable law.",
    ],
  },
  {
    id: "changes",
    title: "23. Changes to these Terms",
    summary:
      "The Terms may be updated when the platform, law, or risk environment changes.",
    icon: "↻",
    paragraphs: [
      "KORAX may update these Terms to reflect new features, contract changes, legal requirements, security practices, or operational changes.",
      "The current version and effective date will be published on this page. Where legally required, material changes will be communicated or require renewed acceptance.",
    ],
  },
  {
    id: "law",
    title: "24. Applicable Law and Mandatory Rights",
    summary:
      "Mandatory statutory and consumer rights remain unaffected.",
    icon: "⚖",
    paragraphs: [
      "These Terms must be interpreted together with applicable mandatory law and the legal information published by the KORAX operator.",
      "No governing-law, jurisdiction, dispute-resolution, or consumer-right clause in these Terms should deprive a user of protections that cannot legally be waived.",
    ],
  },
  {
    id: "contact",
    title: "25. Contact",
    summary:
      "Report legal, security, intellectual-property, or platform issues through official channels.",
    icon: "@",
    accent: "blue",
    paragraphs: [
      `Email: ${CONTACT_EMAIL}`,
      "Include enough information to identify the issue, but never include private keys, seed phrases, passwords, or other wallet-recovery information.",
    ],
  },
];

const toc = sections.map(({ id, title }) => ({
  id,
  label: title.replace(/^\d+\.\s*/, ""),
}));

function toneClasses(tone: TermSection["accent"]) {
  if (tone === "cyan") {
    return {
      border: "border-cyan-300/20",
      background: "bg-cyan-400/[0.055]",
      icon: "border-cyan-300/20 bg-cyan-400/10 text-cyan-100",
    };
  }

  if (tone === "amber") {
    return {
      border: "border-amber-300/20",
      background: "bg-amber-300/[0.045]",
      icon: "border-amber-300/20 bg-amber-300/10 text-amber-100",
    };
  }

  if (tone === "red") {
    return {
      border: "border-red-400/20",
      background: "bg-red-500/[0.045]",
      icon: "border-red-400/20 bg-red-500/10 text-red-100",
    };
  }

  return {
    border: "border-blue-400/18",
    background: "bg-blue-500/[0.045]",
    icon: "border-blue-400/20 bg-blue-500/10 text-blue-100",
  };
}

function LegalPill({
  children,
  tone = "blue",
}: {
  children: ReactNode;
  tone?: "blue" | "cyan" | "amber";
}) {
  const styles = {
    blue: "border-blue-400/25 bg-blue-500/10 text-blue-100",
    cyan: "border-cyan-300/25 bg-cyan-400/10 text-cyan-100",
    amber: "border-amber-300/20 bg-amber-300/[0.07] text-amber-100",
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

function TermsKoraxLogo() {
  return (
    <div className="terms-logo-zone relative flex min-h-[380px] flex-col items-center justify-center overflow-hidden rounded-[34px] border border-white/10 bg-[#020611]/85">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.27),transparent_32%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.11),transparent_36%)]" />
      <div className="terms-grid pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="terms-orbit terms-orbit-one pointer-events-none absolute left-1/2 top-[45%] h-[310px] w-[310px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/15" />
      <div className="terms-orbit terms-orbit-two pointer-events-none absolute left-1/2 top-[45%] h-[235px] w-[235px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />

      <div className="terms-logo-glow pointer-events-none absolute left-1/2 top-[45%] h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/25 blur-3xl" />

      <div className="absolute left-1/2 top-[45%] z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <img
          src="/Korax-logo.png"
          alt="KORAX official logo"
          draggable={false}
          className="terms-logo-spin h-44 w-44 bg-transparent object-contain drop-shadow-[0_0_44px_rgba(59,130,246,0.95)] sm:h-52 sm:w-52"
        />

        <img
          src="/korax-wordmark.png"
          alt="KORAX"
          draggable={false}
          className="terms-wordmark-float mt-3 h-11 w-auto max-w-[260px] bg-transparent object-contain drop-shadow-[0_0_24px_rgba(59,130,246,0.85)]"
        />
      </div>

      <div className="absolute bottom-5 left-5 right-5 z-20 rounded-[22px] border border-blue-400/20 bg-blue-500/10 p-4 backdrop-blur-xl">
        <div className="text-[9px] font-black uppercase tracking-[0.22em] text-white/38">
          Legal Framework
        </div>
        <div className="mt-1 text-lg font-black text-white">
          Responsibility • Transparency • Risk
        </div>
      </div>
    </div>
  );
}

function TermCard({ section }: { section: TermSection }) {
  const tone = toneClasses(section.accent);

  return (
    <article
      id={section.id}
      className={[
        "terms-card-3d relative scroll-mt-28 overflow-hidden rounded-[30px] border p-5 shadow-[0_20px_75px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-6",
        tone.border,
        tone.background,
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.05),transparent_38%)]" />

      <div className="relative">
        <div className="flex items-start gap-4">
          <div
            className={[
              "flex h-12 min-w-12 shrink-0 items-center justify-center rounded-2xl border px-2 text-xs font-black",
              tone.icon,
            ].join(" ")}
          >
            {section.icon}
          </div>

          <div>
            <h2 className="text-xl font-black leading-tight text-white sm:text-2xl">
              {section.title}
            </h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-blue-100/70">
              {section.summary}
            </p>
          </div>
        </div>

        {section.paragraphs?.length ? (
          <div className="mt-5 space-y-4">
            {section.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-sm leading-7 text-white/62 sm:text-[15px]"
              >
                {paragraph}
              </p>
            ))}
          </div>
        ) : null}

        {section.bullets?.length ? (
          <div className="mt-5 grid gap-3">
            {section.bullets.map((bullet) => (
              <div
                key={bullet}
                className="flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-black/20 px-4 py-3"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-300 shadow-[0_0_10px_rgba(96,165,250,0.9)]" />
                <p className="text-sm leading-6 text-white/56">{bullet}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default function TermsPage() {
  return (
    <div className="space-y-8 overflow-hidden">
      <style>{`
        @keyframes termsLogoSpin {
          0% {
            transform: rotateY(0deg) rotateX(0deg) translateY(0) scale(1);
          }
          50% {
            transform: rotateY(180deg) rotateX(7deg) translateY(-7px) scale(1.045);
          }
          100% {
            transform: rotateY(360deg) rotateX(0deg) translateY(0) scale(1);
          }
        }

        @keyframes termsWordmarkFloat {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.92;
          }
          50% {
            transform: translateY(-6px) scale(1.025);
            opacity: 1;
          }
        }

        @keyframes termsOrbit {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes termsOrbitReverse {
          from {
            transform: translate(-50%, -50%) rotate(360deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(0deg);
          }
        }

        @keyframes termsGlow {
          0%, 100% {
            opacity: 0.35;
            transform: translate(-50%, -50%) scale(0.94);
          }
          50% {
            opacity: 0.9;
            transform: translate(-50%, -50%) scale(1.14);
          }
        }

        @keyframes termsGridMove {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(-16px, -16px, 0);
          }
        }

        @keyframes termsScan {
          0% {
            transform: translateX(-135%);
            opacity: 0;
          }
          20%, 80% {
            opacity: 1;
          }
          100% {
            transform: translateX(135%);
            opacity: 0;
          }
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
          animation: termsWordmarkFloat 4.4s ease-in-out infinite;
          will-change: transform;
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .terms-logo-glow {
          animation: termsGlow 3.8s ease-in-out infinite;
        }

        .terms-grid {
          animation: termsGridMove 10s ease-in-out infinite;
        }

        .terms-orbit-one {
          animation: termsOrbit 20s linear infinite;
        }

        .terms-orbit-two {
          animation: termsOrbitReverse 15s linear infinite;
        }

        .terms-orbit::before,
        .terms-orbit::after {
          content: "";
          position: absolute;
          left: 50%;
          height: 7px;
          width: 7px;
          transform: translateX(-50%);
          border-radius: 999px;
          background: #60a5fa;
          box-shadow: 0 0 14px rgba(96,165,250,.95);
        }

        .terms-orbit::before {
          top: -3px;
        }

        .terms-orbit::after {
          bottom: -3px;
        }

        .terms-hero-scan {
          animation: termsScan 4.8s ease-in-out infinite;
        }

        .terms-card-3d {
          transform-style: preserve-3d;
          transition:
            transform 230ms ease,
            border-color 230ms ease,
            background-color 230ms ease,
            box-shadow 230ms ease;
        }

        .terms-card-3d:hover {
          transform: translateY(-5px);
          border-color: rgba(96, 165, 250, 0.34);
          box-shadow: 0 30px 90px rgba(37, 99, 235, 0.12);
        }

        @media (hover: none) {
          .terms-card-3d:hover {
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .terms-logo-spin,
          .terms-wordmark-float,
          .terms-logo-glow,
          .terms-grid,
          .terms-orbit-one,
          .terms-orbit-two,
          .terms-hero-scan {
            animation: none;
          }

          .terms-card-3d:hover {
            transform: none;
          }
        }
      `}</style>

      <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[#030711]/88 p-5 shadow-[0_40px_150px_rgba(0,0,0,0.68)] backdrop-blur-2xl sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.25),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.12),transparent_35%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:52px_52px]" />
        <div className="terms-hero-scan pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent" />

        <div className="relative grid gap-10 xl:grid-cols-[1.04fr_.96fr] xl:items-center">
          <div>
            <div className="flex flex-wrap gap-2">
              <LegalPill>Terms of Service</LegalPill>
              <LegalPill tone="cyan">KORAX Ecosystem</LegalPill>
              <LegalPill tone="amber">Effective {LAST_UPDATED}</LegalPill>
            </div>

            <h1 className="mt-7 text-4xl font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              Clear rules for using
              <span className="block bg-gradient-to-r from-blue-100 via-white to-cyan-200 bg-clip-text text-transparent drop-shadow-[0_0_22px_rgba(59,130,246,0.48)]">
                the KORAX ecosystem.
              </span>
            </h1>

            <p className="mt-6 max-w-4xl text-base leading-8 text-white/62 sm:text-lg">
              These Terms govern the KORAX website, KRX interfaces, presale,
              claim, staking, AI builders, project registry, and launch
              infrastructure. Read them before using the platform or connecting
              a wallet.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {quickPoints.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3"
                >
                  <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-blue-400/20 bg-blue-500/10 text-xs text-blue-100">
                    ✦
                  </span>
                  <span className="text-sm font-semibold leading-6 text-white/68">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="#acceptance"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-blue-500 px-6 py-3 text-sm font-black text-white shadow-[0_0_40px_rgba(59,130,246,0.34)] transition hover:-translate-y-0.5 hover:bg-blue-400"
              >
                Read the Terms
              </a>

              <Link
                href="/privacy"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-blue-400/25 bg-blue-500/10 px-6 py-3 text-sm font-black text-blue-100 transition hover:-translate-y-0.5 hover:bg-blue-500/20 hover:text-white"
              >
                Privacy Policy
              </Link>

              <Link
                href="/docs"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-black/30 px-6 py-3 text-sm font-bold text-white/75 transition hover:-translate-y-0.5 hover:bg-white/[0.07] hover:text-white"
              >
                Documentation
              </Link>
            </div>
          </div>

          <TermsKoraxLogo />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[300px_1fr]">
        <aside className="h-fit rounded-[30px] border border-white/10 bg-[#030711]/76 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.38)] backdrop-blur-xl xl:sticky xl:top-24">
          <div className="text-[10px] font-black uppercase tracking-[0.24em] text-blue-100">
            Contents
          </div>
          <div className="mt-4 max-h-[68vh] space-y-1 overflow-y-auto pr-1">
            {toc.map((item, index) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="flex items-start gap-3 rounded-xl px-3 py-2.5 text-xs leading-5 text-white/48 transition hover:bg-blue-500/10 hover:text-blue-100"
              >
                <span className="w-5 shrink-0 font-black text-blue-100/55">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </aside>

        <div className="space-y-5">
{sections.map((section) => (
            <TermCard key={section.id} section={section} />
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[40px] border border-blue-400/25 bg-[#050a18] p-6 shadow-[0_35px_130px_rgba(0,0,0,0.55)] sm:p-9 lg:p-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(37,99,235,0.22),transparent_38%),radial-gradient(circle_at_right,rgba(34,211,238,0.11),transparent_34%)]" />

        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-3xl">
            <div className="text-xs font-black uppercase tracking-[0.3em] text-blue-100">
              KORAX Legal Information
            </div>
            <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-5xl">
              Use the platform only after understanding the risks.
            </h2>
            <p className="mt-5 text-sm leading-8 text-white/60 sm:text-base">
              Verify every wallet transaction, review every generated project,
              and obtain independent advice where necessary.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/privacy"
              className="inline-flex min-w-[220px] items-center justify-center rounded-2xl bg-blue-500 px-6 py-3.5 text-sm font-black text-white shadow-[0_0_40px_rgba(59,130,246,0.32)] transition hover:-translate-y-0.5 hover:bg-blue-400"
            >
              Privacy Policy
            </Link>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex min-w-[220px] items-center justify-center rounded-2xl border border-blue-400/25 bg-blue-500/10 px-6 py-3.5 text-sm font-black text-blue-100 transition hover:-translate-y-0.5 hover:bg-blue-500/20 hover:text-white"
            >
              Contact KORAX
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}