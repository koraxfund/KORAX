import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Privacy Policy | KORAX",
  description:
    "Privacy information for the KORAX website, wallet connections, public blockchain interactions, AI builder tools, project registry, GitHub publishing, deployment workflows, and launch infrastructure.",
  alternates: {
    canonical: "https://www.korax.fund/privacy",
  },
  openGraph: {
    title: "KORAX Privacy Policy",
    description:
      "How KORAX handles website data, wallet addresses, public blockchain activity, AI builder inputs, project data, and third-party integrations.",
    url: "https://www.korax.fund/privacy",
    type: "website",
    images: [
      {
        url: "https://www.korax.fund/Korax-logo.png",
        width: 1200,
        height: 630,
        alt: "KORAX Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KORAX Privacy Policy",
    description:
      "Privacy information for the KORAX ecosystem and its Web3 builder tools.",
    images: ["https://www.korax.fund/Korax-logo.png"],
  },
};

type PrivacySection = {
  id: string;
  title: string;
  summary: string;
  icon: string;
  paragraphs?: string[];
  bullets?: string[];
  accent?: "blue" | "cyan" | "amber" | "red";
};

type ProcessingActivity = {
  activity: string;
  data: string;
  purpose: string;
  legalBasis: string;
  retention: string;
};

const LAST_UPDATED = "18 July 2026";
const CONTACT_EMAIL = "contact@korax.fund";

const quickPoints = [
  "KORAX never needs your seed phrase or private key.",
  "Wallet addresses and blockchain activity may be publicly visible.",
  "Builder inputs can be processed by configured AI and deployment providers.",
  "Functional browser storage may keep project progress on your device.",
];

const processingActivities: ProcessingActivity[] = [
  {
    activity: "Website delivery and security",
    data: "IP address, date and time, requested page, device/browser details, referrer, technical logs",
    purpose:
      "Deliver the website, prevent abuse, diagnose errors, maintain availability, and protect the platform",
    legalBasis:
      "Legitimate interests in secure and reliable operation; legal obligations where applicable",
    retention:
      "Normally limited to the period required for security, troubleshooting, and legal obligations",
  },
  {
    activity: "Wallet connection",
    data: "Public wallet address, selected network, connection status, wallet-provider metadata",
    purpose:
      "Connect the user-selected wallet and display wallet-specific on-chain information",
    legalBasis:
      "Performance of requested platform functions and legitimate interests in providing wallet-based access",
    retention:
      "Usually processed for the active session; functional state may remain locally on the user's device",
  },
  {
    activity: "Blockchain interaction",
    data: "Wallet address, transaction hash, token approvals, contract calls, balances, staking, claim, presale, and launch activity",
    purpose:
      "Read blockchain state, prepare transactions, show transaction status, and provide ecosystem functions",
    legalBasis:
      "Performance of requested platform functions; blockchain publication occurs through the user's signed transaction",
    retention:
      "Public blockchain records may remain permanently available and are not controlled by KORAX",
  },
  {
    activity: "AI builder tools",
    data: "Project descriptions, prompts, configuration, branding direction, generated files, edit instructions, and technical metadata",
    purpose:
      "Generate or revise project strategy, token configuration, website content, code, visuals, and deployment packages",
    legalBasis:
      "Performance of the user-requested builder service; consent where separately required",
    retention:
      "According to the active feature, local browser storage, server security logs, and the configured provider's retention rules",
  },
  {
    activity: "GitHub and deployment integrations",
    data: "OAuth identifiers, repository name, selected files, deployment configuration, provider responses, and status information",
    purpose:
      "Publish generated project files and initiate user-requested deployment workflows",
    legalBasis:
      "Performance of the integration requested by the user",
    retention:
      "According to the user's provider account, local project state, and limited security or troubleshooting logs",
  },
  {
    activity: "Public project registry and launch",
    data: "Project name, symbol, public wallet address, contract addresses, metadata, website/launch links, and on-chain timestamps",
    purpose:
      "Publish project information, enable discovery, and connect builder projects with launch infrastructure",
    legalBasis:
      "Performance of the creator-requested publication and legitimate interests in operating the registry",
    retention:
      "Until removal from the hosted interface where available; public blockchain data may remain permanently accessible",
  },
  {
    activity: "Support and legal communication",
    data: "Email address, name if provided, message content, attachments, and communication metadata",
    purpose:
      "Answer requests, investigate issues, protect rights, and meet legal obligations",
    legalBasis:
      "Contract or pre-contract steps, legitimate interests, consent, and legal obligations depending on the request",
    retention:
      "For the period needed to resolve the request and satisfy applicable limitation or record-keeping periods",
  },
];

const sections: PrivacySection[] = [
  {
    id: "controller",
    title: "1. Privacy Contact",
    summary:
      "Privacy questions and data-protection requests can be sent through the official KORAX contact.",
    icon: "@",
    accent: "blue",
    paragraphs: [
      `Privacy contact: ${CONTACT_EMAIL}.`,
      "Include enough information to identify and assess your request, but never include private keys, seed phrases, wallet passwords, API secrets, or recovery information.",
    ],
  },
  {
    id: "scope",
    title: "2. Scope of this Policy",
    summary:
      "This policy covers the KORAX website and connected ecosystem functions.",
    icon: "◎",
    paragraphs: [
      "This Privacy Policy explains how personal data may be processed when you visit the KORAX website, connect a wallet, interact with KRX interfaces, use presale, claim or staking functions, access AI builder tools, publish a project, connect GitHub, initiate deployment, browse the public registry, or use launch infrastructure.",
      "It does not govern independent third-party websites, wallets, blockchain networks, repositories, hosting accounts, exchanges, or external project websites. Their own privacy notices apply.",
    ],
  },
  {
    id: "principles",
    title: "3. Privacy Principles",
    summary:
      "KORAX aims to process only data reasonably needed for each function.",
    icon: "◇",
    accent: "cyan",
    bullets: [
      "Data minimisation: avoid collecting information that is not needed for the requested function.",
      "Purpose limitation: use information for the purpose described or another compatible and lawful purpose.",
      "Transparency: explain the main categories, purposes, recipients, retention logic, and user rights.",
      "Security: apply reasonable technical and organisational measures appropriate to the platform risk.",
      "User control: wallet transactions remain subject to the user's own wallet confirmation.",
      "No secret collection: KORAX never asks users to provide seed phrases or private keys.",
    ],
  },
  {
    id: "categories",
    title: "4. Categories of Data",
    summary:
      "The data processed depends on the feature you choose to use.",
    icon: "▦",
    bullets: [
      "Technical data: IP address, timestamps, browser and device information, request URLs, referrer, error and security logs.",
      "Wallet data: public wallet address, network, balances, contract eligibility, transaction hashes, and public on-chain activity.",
      "Project data: project name, token symbol, descriptions, branding, tokenomics, contract addresses, registry metadata, and public links.",
      "Builder data: prompts, instructions, generated content, code packages, edit history, configuration, and deployment preferences.",
      "Integration data: OAuth status, repository and deployment identifiers, provider responses, and user-selected publishing actions.",
      "Communication data: email address, name where provided, support messages, attachments, and related correspondence.",
      "Preference and local-state data: theme or functional settings, last-project state, access workflow state, and other necessary browser storage.",
    ],
  },
  {
    id: "sources",
    title: "5. Sources of Data",
    summary:
      "Data may come directly from you, your wallet, public chains, or connected providers.",
    icon: "↘",
    paragraphs: [
      "KORAX receives data when you enter information, connect a wallet, request AI generation, publish a repository, initiate a deployment, contact support, or otherwise use an interactive feature.",
      "KORAX may also read publicly available blockchain information from BNB Chain through configured RPC services and may receive status information from wallet, repository, hosting, deployment, AI, and infrastructure providers used for a requested feature.",
    ],
  },
  {
    id: "purposes",
    title: "6. Purposes and Legal Bases",
    summary:
      "Processing must have a defined purpose and a lawful basis.",
    icon: "§",
    accent: "blue",
    paragraphs: [
      "Depending on the function and context, KORAX may process personal data to perform a requested service, take steps before entering into a service relationship, comply with legal obligations, protect legitimate operational and security interests, or act on valid consent.",
      "Where processing is based on consent, you may withdraw consent for the future. Withdrawal does not affect processing already carried out lawfully before withdrawal.",
      "Where KORAX relies on legitimate interests, those interests may include secure website operation, fraud and abuse prevention, service improvement, error diagnosis, protection of legal claims, and operation of requested Web3 functionality.",
    ],
  },
  {
    id: "wallet",
    title: "7. Wallet Connections",
    summary:
      "Wallet providers handle keys; KORAX receives only public or connection-related information.",
    icon: "◈",
    accent: "cyan",
    paragraphs: [
      "When you connect a wallet, the connection is handled through the selected wallet software and supporting connection libraries. KORAX may receive your public address, selected chain, connection status, and information required to prepare or display transactions.",
      "KORAX does not receive or store your private key, seed phrase, wallet password, or recovery phrase. Never provide this information to KORAX staff, moderators, forms, AI tools, or support channels.",
      "Disconnecting a wallet ends the active connection but does not erase data already published on a blockchain or retained by your wallet provider.",
    ],
  },
  {
    id: "blockchain",
    title: "8. Public Blockchain Data",
    summary:
      "Blockchain transactions may be permanent, public, and independently analysable.",
    icon: "⌁",
    accent: "amber",
    paragraphs: [
      "Public wallet addresses, token transfers, approvals, presale purchases, claims, staking positions, deployed contracts, project registration, launch activity, and transaction metadata may be visible to anyone through blockchain nodes and explorers.",
      "Although a wallet address may appear pseudonymous, it can become personal data when linked or reasonably linkable to an individual.",
      "KORAX cannot erase, correct, reverse, or restrict information independently recorded on a public blockchain. Requests concerning hosted off-chain information will be assessed separately from immutable on-chain records.",
    ],
  },
  {
    id: "website-logs",
    title: "9. Website Hosting, Logs, and Security",
    summary:
      "Technical information may be processed to deliver and protect the website.",
    icon: "▤",
    paragraphs: [
      "The hosting and network infrastructure may automatically process IP addresses, request times, requested resources, browser or device information, referrers, error details, and security signals.",
      "These data may be used to deliver content, detect malicious activity, prevent abuse, investigate incidents, troubleshoot failures, and maintain platform availability.",
      "Security logs are retained only for as long as reasonably necessary for those purposes and any applicable legal obligations. Exact periods may vary according to incident severity and the configured hosting provider.",
    ],
  },
  {
    id: "storage",
    title: "10. Cookies and Browser Storage",
    summary:
      "Functional storage supports project continuity and integration workflows.",
    icon: "▣",
    accent: "cyan",
    paragraphs: [
      "KORAX may use localStorage, sessionStorage, cookies, or similar browser technologies that are technically necessary to provide a user-requested function, maintain security, continue project workflows, remember local preferences, or complete OAuth and deployment integrations.",
      "Functional browser storage can include the most recently generated project, deployment or launch identifiers, interface state, authentication state, and security values. Some information remains on your device until it expires or you clear browser data.",
      "Non-essential analytics, advertising, profiling, or similar storage will not be activated without an appropriate consent mechanism where consent is legally required. If such tools are added, this policy and the consent interface must be updated before activation.",
    ],
    bullets: [
      "Clearing browser storage may remove locally saved project progress.",
      "Blocking necessary storage may prevent login, publishing, deployment, or continuity features from working.",
      "Third-party services may set their own storage on their domains under their own notices.",
    ],
  },
  {
    id: "ai",
    title: "11. AI Builder Processing",
    summary:
      "Builder prompts and project data may be sent to configured AI infrastructure.",
    icon: "AI",
    accent: "cyan",
    paragraphs: [
      "When you request project analysis, website generation, visual generation, editing, or related AI functions, the information you submit may be transmitted to the configured AI service through KORAX server endpoints.",
      "Inputs may include project descriptions, target audience, token configuration, branding instructions, website requirements, edit requests, and files or content you choose to provide.",
      "Do not submit seed phrases, private keys, passwords, API secrets, confidential information, special-category personal data, or third-party personal data unless you have a lawful basis and the feature expressly supports that processing.",
    ],
    bullets: [
      "AI inputs and outputs may be logged temporarily for security, debugging, abuse prevention, and service reliability.",
      "Provider-specific retention and training settings depend on the configured AI service and account configuration.",
      "Generated content must be reviewed before publication or deployment.",
    ],
  },
  {
    id: "github",
    title: "12. GitHub and Repository Publishing",
    summary:
      "GitHub data is processed only when you choose the publishing integration.",
    icon: "GH",
    paragraphs: [
      "When you connect GitHub, KORAX may process OAuth identifiers, authentication state, account or organisation information made available by the granted scope, repository name, visibility choice, generated files, commit or publishing status, and provider responses.",
      "The exact permissions are shown by GitHub during authorisation. You can revoke KORAX access through your GitHub account settings.",
      "Files published to GitHub become subject to the repository visibility you select, your GitHub settings, and GitHub's own terms and privacy practices.",
    ],
  },
  {
    id: "deployment",
    title: "13. Hosting and Deployment Integrations",
    summary:
      "Deployment data is sent only when you request publication through a connected provider.",
    icon: "▲",
    paragraphs: [
      "When you initiate deployment, KORAX may transmit project files, repository references, project names, configuration, environment-variable names, deployment instructions, and status data to the configured hosting or deployment provider.",
      "Never place secret values directly inside generated public files. Review environment variables and repository visibility before publishing.",
      "The deployment provider independently processes account, usage, security, billing, and hosting data under its own privacy notice.",
    ],
  },
  {
    id: "registry",
    title: "14. Public Project Registry and Launch Data",
    summary:
      "Creators should expect approved project information to be public.",
    icon: "↗",
    accent: "blue",
    paragraphs: [
      "Project names, symbols, public owner wallets, token and contract addresses, metadata, public website links, launch identifiers, timestamps, and project status may be displayed in the KORAX public registry or launch interface.",
      "Creators must not publish private personal information through project metadata unless they have a lawful basis and understand that registry or blockchain data may remain publicly accessible.",
      "Removal from the hosted KORAX interface does not guarantee deletion from blockchain records, repositories, caches, archives, search engines, or third-party services.",
    ],
  },
  {
    id: "recipients",
    title: "15. Recipients and Service Providers",
    summary:
      "Data is shared only as needed for the chosen function, security, or legal compliance.",
    icon: "⇄",
    bullets: [
      "Hosting, content-delivery, security, and infrastructure providers.",
      "Wallet-connection providers and the wallet selected by the user.",
      "BNB Chain nodes, RPC providers, smart contracts, validators, and blockchain explorers.",
      "AI providers used by the selected builder function.",
      "GitHub or another repository provider when publishing is requested.",
      "Vercel or another hosting/deployment provider when deployment is requested.",
      "Professional advisers, authorities, courts, or counterparties where required by law or necessary to protect legal rights.",
      "Public visitors where a creator intentionally publishes project, registry, repository, website, or launch data.",
    ],
    paragraphs: [
      "KORAX does not sell personal data. This does not prevent necessary transmission to providers used to deliver a feature or public disclosure caused by a user-authorised blockchain or publishing action.",
    ],
  },
  {
    id: "transfers",
    title: "16. International Data Transfers",
    summary:
      "Some technology providers may process information outside the EU or EEA.",
    icon: "◉",
    accent: "amber",
    paragraphs: [
      "Depending on the provider and feature, personal data may be processed in countries outside the European Union or European Economic Area.",
      "Where GDPR transfer restrictions apply, the relevant transfer must rely on an available legal mechanism, such as an adequacy decision, approved standard contractual clauses, or another lawful safeguard.",
      "Public blockchain data is globally distributed by design and may be accessed from jurisdictions worldwide.",
    ],
  },
  {
    id: "retention",
    title: "17. Retention",
    summary:
      "Data is retained only for as long as required by its purpose or applicable law.",
    icon: "◷",
    paragraphs: [
      "Retention depends on the category, purpose, provider, security need, and legal obligation. KORAX removes or anonymises off-chain personal data when it is no longer reasonably needed, unless continued retention is required or permitted by law.",
      "Support correspondence and transaction-related records may be retained for applicable limitation, accounting, tax, fraud-prevention, or evidence periods.",
      "Local browser data remains under your control and can normally be cleared through browser settings. Public blockchain data, public repositories, and third-party archives may remain available independently of KORAX.",
    ],
  },
  {
    id: "rights",
    title: "18. Your Data-Protection Rights",
    summary:
      "Applicable law may give you rights over personal data controlled by KORAX.",
    icon: "✓",
    accent: "cyan",
    bullets: [
      "Access: ask whether personal data concerning you is processed and request a copy.",
      "Rectification: request correction of inaccurate or incomplete off-chain data.",
      "Erasure: request deletion where the legal conditions are met.",
      "Restriction: request limited processing in qualifying circumstances.",
      "Portability: receive eligible data in a structured, commonly used, machine-readable format.",
      "Objection: object to processing based on legitimate interests or direct marketing.",
      "Consent withdrawal: withdraw consent for future processing where consent is the legal basis.",
      "Complaint: lodge a complaint with a competent data-protection supervisory authority.",
    ],
    paragraphs: [
      `Send privacy requests to ${CONTACT_EMAIL}. KORAX may request reasonable information to verify identity and prevent unauthorised disclosure.`,
      "Rights relating to data controlled by independent wallet, blockchain, GitHub, hosting, AI, or other providers must also be exercised directly with the relevant provider.",
      "Erasure or rectification rights cannot force KORAX to alter immutable public blockchain records that it does not control.",
    ],
  },
  {
    id: "automated",
    title: "19. Automated Processing and Access Rules",
    summary:
      "Smart contracts may automatically apply transparent technical eligibility rules.",
    icon: "⚙",
    paragraphs: [
      "KORAX does not intentionally use personal data for solely automated decisions that produce legal or similarly significant effects on individuals.",
      "Smart contracts and platform interfaces may automatically calculate staking eligibility, project slots, launch levels, contribution limits, token previews, or claim availability from wallet and contract state. These are technical execution rules for the requested Web3 service rather than an assessment of personal characteristics.",
    ],
  },
  {
    id: "security",
    title: "20. Security",
    summary:
      "KORAX applies reasonable safeguards, but no system is risk-free.",
    icon: "▰",
    accent: "blue",
    bullets: [
      "Restricted access to operational systems and secrets.",
      "Encrypted transport where supported.",
      "Input validation, access checks, rate controls, logging, and incident investigation where appropriate.",
      "Separation of public client configuration from private server credentials.",
      "Review of provider permissions and minimisation of OAuth scopes.",
      "Ongoing correction of identified vulnerabilities and dependency risks.",
    ],
    paragraphs: [
      "No website, AI system, smart contract, wallet, repository, hosting platform, or blockchain can guarantee absolute security. Users remain responsible for device security, wallet protection, transaction review, and safe handling of credentials.",
    ],
  },
  {
    id: "children",
    title: "21. Children",
    summary:
      "KORAX is not intended for children.",
    icon: "18+",
    paragraphs: [
      "KORAX is intended for adults who can lawfully use blockchain and related services. KORAX does not knowingly seek personal data from children.",
      "A parent or guardian who believes a child has submitted personal data may contact KORAX to request review and appropriate action.",
    ],
  },
  {
    id: "changes",
    title: "22. Policy Changes",
    summary:
      "This policy will be updated when the platform or processing changes.",
    icon: "↻",
    paragraphs: [
      "KORAX may update this Privacy Policy to reflect new features, providers, legal requirements, security practices, or processing operations.",
      "The current version and last-updated date will be published on this page. Material changes will be communicated where legally required.",
    ],
  },
  {
    id: "contact",
    title: "23. Privacy Contact",
    summary:
      "Use the official KORAX privacy contact for requests or questions.",
    icon: "@",
    accent: "blue",
    paragraphs: [
      `Email: ${CONTACT_EMAIL}`,
      "Do not include private keys, seed phrases, wallet passwords, API secrets, or recovery information in any privacy request.",
    ],
  },
];

const toc = sections.map(({ id, title }) => ({
  id,
  label: title.replace(/^\d+\.\s*/, ""),
}));

function toneClasses(tone: PrivacySection["accent"]) {
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

function PrivacyPill({
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

function PrivacyKoraxLogo() {
  return (
    <div className="privacy-logo-zone relative flex min-h-[380px] flex-col items-center justify-center overflow-hidden rounded-[34px] border border-white/10 bg-[#020611]/85">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.27),transparent_32%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.11),transparent_36%)]" />
      <div className="privacy-grid pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="privacy-orbit privacy-orbit-one pointer-events-none absolute left-1/2 top-[45%] h-[310px] w-[310px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/15" />
      <div className="privacy-orbit privacy-orbit-two pointer-events-none absolute left-1/2 top-[45%] h-[235px] w-[235px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />

      <div className="privacy-logo-glow pointer-events-none absolute left-1/2 top-[45%] h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/25 blur-3xl" />

      <div className="absolute left-1/2 top-[45%] z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <img
          src="/Korax-logo.png"
          alt="KORAX official logo"
          draggable={false}
          className="privacy-logo-spin h-44 w-44 bg-transparent object-contain drop-shadow-[0_0_44px_rgba(59,130,246,0.95)] sm:h-52 sm:w-52"
        />

        <img
          src="/korax-wordmark.png"
          alt="KORAX"
          draggable={false}
          className="privacy-wordmark-float mt-3 h-11 w-auto max-w-[260px] bg-transparent object-contain drop-shadow-[0_0_24px_rgba(59,130,246,0.85)]"
        />
      </div>

      <div className="absolute bottom-5 left-5 right-5 z-20 rounded-[22px] border border-blue-400/20 bg-blue-500/10 p-4 backdrop-blur-xl">
        <div className="text-[9px] font-black uppercase tracking-[0.22em] text-white/38">
          Privacy Framework
        </div>
        <div className="mt-1 text-lg font-black text-white">
          Minimise • Protect • Explain
        </div>
      </div>
    </div>
  );
}

function PrivacyCard({ section }: { section: PrivacySection }) {
  const tone = toneClasses(section.accent);

  return (
    <article
      id={section.id}
      className={[
        "privacy-card-3d relative scroll-mt-28 overflow-hidden rounded-[30px] border p-5 shadow-[0_20px_75px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-6",
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

export default function PrivacyPage() {
  return (
    <div className="space-y-8 overflow-hidden">
      <style>{`
        @keyframes privacyLogoSpin {
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

        @keyframes privacyWordmarkFloat {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.92;
          }
          50% {
            transform: translateY(-6px) scale(1.025);
            opacity: 1;
          }
        }

        @keyframes privacyOrbit {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes privacyOrbitReverse {
          from {
            transform: translate(-50%, -50%) rotate(360deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(0deg);
          }
        }

        @keyframes privacyGlow {
          0%, 100% {
            opacity: 0.35;
            transform: translate(-50%, -50%) scale(0.94);
          }
          50% {
            opacity: 0.9;
            transform: translate(-50%, -50%) scale(1.14);
          }
        }

        @keyframes privacyGridMove {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(-16px, -16px, 0);
          }
        }

        @keyframes privacyScan {
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
          animation: privacyWordmarkFloat 4.4s ease-in-out infinite;
          will-change: transform;
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .privacy-logo-glow {
          animation: privacyGlow 3.8s ease-in-out infinite;
        }

        .privacy-grid {
          animation: privacyGridMove 10s ease-in-out infinite;
        }

        .privacy-orbit-one {
          animation: privacyOrbit 20s linear infinite;
        }

        .privacy-orbit-two {
          animation: privacyOrbitReverse 15s linear infinite;
        }

        .privacy-orbit::before,
        .privacy-orbit::after {
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

        .privacy-orbit::before {
          top: -3px;
        }

        .privacy-orbit::after {
          bottom: -3px;
        }

        .privacy-hero-scan {
          animation: privacyScan 4.8s ease-in-out infinite;
        }

        .privacy-card-3d {
          transform-style: preserve-3d;
          transition:
            transform 230ms ease,
            border-color 230ms ease,
            background-color 230ms ease,
            box-shadow 230ms ease;
        }

        .privacy-card-3d:hover {
          transform: translateY(-5px);
          border-color: rgba(96, 165, 250, 0.34);
          box-shadow: 0 30px 90px rgba(37, 99, 235, 0.12);
        }

        @media (hover: none) {
          .privacy-card-3d:hover {
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .privacy-logo-spin,
          .privacy-wordmark-float,
          .privacy-logo-glow,
          .privacy-grid,
          .privacy-orbit-one,
          .privacy-orbit-two,
          .privacy-hero-scan {
            animation: none;
          }

          .privacy-card-3d:hover {
            transform: none;
          }
        }
      `}</style>

      <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[#030711]/88 p-5 shadow-[0_40px_150px_rgba(0,0,0,0.68)] backdrop-blur-2xl sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.25),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.12),transparent_35%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:52px_52px]" />
        <div className="privacy-hero-scan pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent" />

        <div className="relative grid gap-10 xl:grid-cols-[1.04fr_.96fr] xl:items-center">
          <div>
            <div className="flex flex-wrap gap-2">
              <PrivacyPill>Privacy Policy</PrivacyPill>
              <PrivacyPill tone="cyan">Wallet-First Platform</PrivacyPill>
              <PrivacyPill tone="amber">Updated {LAST_UPDATED}</PrivacyPill>
            </div>

            <h1 className="mt-7 text-4xl font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              Privacy across
              <span className="block bg-gradient-to-r from-blue-100 via-white to-cyan-200 bg-clip-text text-transparent drop-shadow-[0_0_22px_rgba(59,130,246,0.48)]">
                wallets, AI, and Web3.
              </span>
            </h1>

            <p className="mt-6 max-w-4xl text-base leading-8 text-white/62 sm:text-lg">
              This policy explains how KORAX handles website data, public wallet
              information, builder inputs, project publishing, deployment
              integrations, registry information, and launch activity.
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
                href="#controller"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-blue-500 px-6 py-3 text-sm font-black text-white shadow-[0_0_40px_rgba(59,130,246,0.34)] transition hover:-translate-y-0.5 hover:bg-blue-400"
              >
                Read the Policy
              </a>

              <Link
                href="/terms"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-blue-400/25 bg-blue-500/10 px-6 py-3 text-sm font-black text-blue-100 transition hover:-translate-y-0.5 hover:bg-blue-500/20 hover:text-white"
              >
                Terms of Service
              </Link>

              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-black/30 px-6 py-3 text-sm font-bold text-white/75 transition hover:-translate-y-0.5 hover:bg-white/[0.07] hover:text-white"
              >
                Privacy Contact
              </a>
            </div>
          </div>

          <PrivacyKoraxLogo />
        </div>
      </section>

      <section className="rounded-[34px] border border-white/10 bg-[#030711]/76 p-5 shadow-[0_26px_100px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-7">
        <div className="text-[10px] font-black uppercase tracking-[0.26em] text-blue-100">
          Processing Overview
        </div>
        <h2 className="mt-3 text-3xl font-black text-white">
          What is processed and why.
        </h2>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-white/58">
          The exact processing depends on the features you use and the providers
          configured in production.
        </p>

        <div className="mt-7 overflow-x-auto rounded-[26px] border border-white/10">
          <table className="min-w-[980px] w-full border-collapse text-left">
            <thead className="bg-blue-500/10">
              <tr>
                {["Activity", "Data", "Purpose", "Legal basis", "Retention"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="border-b border-white/10 px-4 py-4 text-[10px] font-black uppercase tracking-[0.18em] text-blue-100"
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {processingActivities.map((activity) => (
                <tr
                  key={activity.activity}
                  className="border-b border-white/[0.07] align-top last:border-b-0"
                >
                  <td className="px-4 py-4 text-sm font-black text-white">
                    {activity.activity}
                  </td>
                  <td className="px-4 py-4 text-xs leading-6 text-white/55">
                    {activity.data}
                  </td>
                  <td className="px-4 py-4 text-xs leading-6 text-white/55">
                    {activity.purpose}
                  </td>
                  <td className="px-4 py-4 text-xs leading-6 text-white/55">
                    {activity.legalBasis}
                  </td>
                  <td className="px-4 py-4 text-xs leading-6 text-white/55">
                    {activity.retention}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
            <PrivacyCard key={section.id} section={section} />
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[40px] border border-blue-400/25 bg-[#050a18] p-6 shadow-[0_35px_130px_rgba(0,0,0,0.55)] sm:p-9 lg:p-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(37,99,235,0.22),transparent_38%),radial-gradient(circle_at_right,rgba(34,211,238,0.11),transparent_34%)]" />

        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-3xl">
            <div className="text-xs font-black uppercase tracking-[0.3em] text-blue-100">
              KORAX Privacy
            </div>
            <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-5xl">
              Protect your wallet and control what you publish.
            </h2>
            <p className="mt-5 text-sm leading-8 text-white/60 sm:text-base">
              Never submit secrets to an AI tool, verify every integration, and
              remember that public blockchain data can remain visible
              permanently.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex min-w-[220px] items-center justify-center rounded-2xl bg-blue-500 px-6 py-3.5 text-sm font-black text-white shadow-[0_0_40px_rgba(59,130,246,0.32)] transition hover:-translate-y-0.5 hover:bg-blue-400"
            >
              Contact Privacy
            </a>
            <Link
              href="/terms"
              className="inline-flex min-w-[220px] items-center justify-center rounded-2xl border border-blue-400/25 bg-blue-500/10 px-6 py-3.5 text-sm font-black text-blue-100 transition hover:-translate-y-0.5 hover:bg-blue-500/20 hover:text-white"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}