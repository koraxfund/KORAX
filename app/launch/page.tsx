"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ethers } from "ethers";
import {
  useAccount,
  useSwitchChain,
  useWalletClient,
} from "wagmi";
import {
  ACCESS_MANAGER_ADDRESS,
  LAUNCHPAD_ADDRESS,
  RPC_URL,
  USDT_ADDRESS,
  USDC_ADDRESS,
  accessManagerAbi,
  launchpadAbi,
} from "@/lib/korax/contracts";

const BSC_CHAIN_ID = 56;
const BSC_SCAN_URL = "https://bscscan.com";
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const SALE_REFRESH_INTERVAL_MS = 15_000;

const LEVEL_DEFINITIONS = [
  {
    name: "Level 1",
    label: "Basic Access",
    level: 1,
    fallbackMinKrx: "500",
    fallbackMaxUsd: 250,
    desc: "Entry access for KORAX launch participation.",
  },
  {
    name: "Level 2",
    label: "Strong Access",
    level: 2,
    fallbackMinKrx: "2,500",
    fallbackMaxUsd: 500,
    desc: "Higher allocation power for committed KRX holders.",
  },
  {
    name: "Level 3",
    label: "Priority Access",
    level: 3,
    fallbackMinKrx: "5,000",
    fallbackMaxUsd: 750,
    desc: "Priority participation with the highest launch allocation.",
  },
] as const;

const FULL_ERC20_ABI = [
  "function approve(address spender,uint256 amount) returns (bool)",
  "function allowance(address owner,address spender) view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

type PaymentKey = "USDT" | "USDC";

type PaymentAsset = {
  key: PaymentKey;
  address: string;
  decimals: number;
  symbol: string;
  ready: boolean;
  error: string;
};

type AccessState = {
  loading: boolean;
  connected: boolean;
  wallet: string;
  eligibleAmountRaw: bigint;
  eligibleAmount: string;
  launchLevel: number;
  totalProjectSlots: number;
  hasLaunchAccess: boolean;
  level1AmountRaw: bigint;
  level2AmountRaw: bigint;
  level3AmountRaw: bigint;
  level1Amount: string;
  level2Amount: string;
  level3Amount: string;
  requiredRewardBps: number;
  error: string;
};

type LoadedStage = {
  cap: bigint;
  priceUsd18: bigint;
  sold: bigint;
};

type LoadedSale = {
  owner: string;
  saleToken: string;
  saleTokenSymbol: string;
  fundReceiver: string;
  saleTokenDecimals: number;
  totalForSale: bigint;
  totalSold: bigint;
  active: boolean;
  claimOpen: boolean;
  requireKoraxAccess: boolean;
  stages: LoadedStage[];
};

type PublicProject = {
  id: string;
  owner: string;
  name: string;
  symbol: string;
  token: string;
  presale: string;
  staking: string;
  vault: string;
  metadataURI: string;
  createdAt: string;
  createdAtUnix: string;
  active: boolean;
  slug: string;
  launchUrl: string;
};

type LoadedBuilderProject = {
  projectId?: string;
  projectName?: string;
  name?: string;
  symbol?: string;
  category?: string;
  shortDescription?: string;
  description?: string;
  targetAudience?: string;
  network?: string;
  tokenAddress?: string;
  token?: string;
  vaultAddress?: string;
  vault?: string;
  stakingAddress?: string;
  staking?: string;
  launchpadAddress?: string;
  launchpad?: string;
  websiteName?: string;
  websiteSummary?: string;
  websiteGenerated?: boolean;
  txHash?: string;
  launchSaleId?: string;
  launchSaleTxHash?: string;
};

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-[#020617]/70 px-4 py-3 text-white outline-none placeholder:text-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition focus:border-blue-400/60 focus:bg-[#020617]/90 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]";

const selectClass =
  "w-full rounded-2xl border border-white/10 bg-[#020617]/70 px-4 py-3 text-white outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition focus:border-blue-400/60 focus:bg-[#020617]/90 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]";

const primaryButtonClass =
  "rounded-2xl bg-blue-500 px-5 py-3 font-black text-white shadow-[0_0_34px_rgba(59,130,246,0.26)] transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50";

const ghostButtonClass =
  "rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 font-black text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50";

const cyanButtonClass =
  "rounded-2xl border border-cyan-300/25 bg-cyan-400/10 px-5 py-3 font-black text-cyan-100 transition hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-50";

const dangerButtonClass =
  "rounded-2xl border border-red-500/25 bg-red-500/10 px-5 py-3 font-black text-red-100 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50";

function getErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "shortMessage" in error &&
    typeof (error as { shortMessage?: unknown }).shortMessage === "string"
  ) {
    return (error as { shortMessage: string }).shortMessage;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "reason" in error &&
    typeof (error as { reason?: unknown }).reason === "string"
  ) {
    return (error as { reason: string }).reason;
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
}

function shortAddress(address?: string) {
  if (!address) return "Not available";
  if (address.length < 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatUnitsSafe(value: bigint, decimals = 18, max = 6) {
  try {
    const raw = ethers.formatUnits(value, decimals);
    const [wholeRaw, fractionRaw = ""] = raw.split(".");
    const whole = BigInt(wholeRaw || "0").toLocaleString("en-US");
    const fraction = fractionRaw.slice(0, max).replace(/0+$/g, "");
    return fraction ? `${whole}.${fraction}` : whole;
  } catch {
    return "0";
  }
}

function formatPercent(numerator: bigint, denominator: bigint) {
  if (denominator <= 0n) return 0;
  return Math.min(100, Number((numerator * 10_000n) / denominator) / 100);
}

function isPositiveDecimal(value: string) {
  const normalized = value.trim();
  if (!/^(?:\d+\.?\d*|\.\d+)$/.test(normalized)) return false;
  const numberValue = Number(normalized);
  return Number.isFinite(numberValue) && numberValue > 0;
}

function isNonNegativeInteger(value: string) {
  return /^\d+$/.test(value.trim());
}

function normalizeDecimalInput(value: string) {
  return value.replace(",", ".");
}

function parseLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parsePositiveLines(value: string, label: string) {
  const lines = parseLines(value);

  if (!lines.length) {
    throw new Error(`${label}: add at least one value.`);
  }

  lines.forEach((line, index) => {
    if (!isPositiveDecimal(line)) {
      throw new Error(`${label}: line ${index + 1} is not a valid positive number.`);
    }
  });

  return lines;
}

function parseSaleId(value: string) {
  const normalized = value.trim();

  if (!/^\d+$/.test(normalized)) {
    throw new Error("Sale ID must be a non-negative whole number.");
  }

  return BigInt(normalized);
}

function safeParseUnits(value: string, decimals: number) {
  try {
    if (!isPositiveDecimal(value)) return 0n;
    return ethers.parseUnits(value.trim(), decimals);
  } catch {
    return 0n;
  }
}

function levelFromNumber(level: number) {
  if (level >= 3) return LEVEL_DEFINITIONS[2];
  if (level >= 2) return LEVEL_DEFINITIONS[1];
  if (level >= 1) return LEVEL_DEFINITIONS[0];
  return null;
}

function makeEip1193Provider(walletClient: any) {
  return {
    request: async ({
      method,
      params,
    }: {
      method: string;
      params?: unknown[] | object;
    }) =>
      walletClient.request({
        method: method as any,
        params: (params as any) ?? [],
      }),
  };
}

async function validateContract(
  provider: ethers.Provider,
  address: string,
  label: string
) {
  if (!address || !ethers.isAddress(address)) {
    throw new Error(`${label} address is missing or invalid.`);
  }

  const code = await provider.getCode(address);

  if (!code || code === "0x") {
    throw new Error(`No ${label} contract was found at ${address}.`);
  }
}

function getSafeProjectUrl(project: PublicProject) {
  const fallback = `/launch?project=${encodeURIComponent(project.slug)}`;
  const raw = project.launchUrl?.trim();

  if (!raw) return fallback;
  if (raw.startsWith("/") && !raw.startsWith("//")) return raw;

  try {
    const parsed = new URL(raw);
    return parsed.protocol === "https:" || parsed.protocol === "http:"
      ? parsed.toString()
      : fallback;
  } catch {
    return fallback;
  }
}

function readLastBuilderProject(): LoadedBuilderProject | null {
  if (typeof window === "undefined") return null;

  const keys = [
    "korax_last_project",
    "korax_last_deployed_project",
    "korax_builder_project",
    "korax_generated_project",
  ];

  for (const key of keys) {
    const raw = window.localStorage.getItem(key);
    if (!raw) continue;

    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return parsed as LoadedBuilderProject;
      }
    } catch {
      continue;
    }
  }

  return null;
}

function saveSaleToBuilderProject(saleId: string, txHash: string) {
  if (typeof window === "undefined") return;

  const previous = readLastBuilderProject() || {};

  window.localStorage.setItem(
    "korax_last_project",
    JSON.stringify({
      ...previous,
      launchSaleId: saleId,
      launchSaleTxHash: txHash,
    })
  );
}

function SectionBox({
  title,
  eyebrow,
  children,
  right,
  id,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  right?: ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      className="launch-section-card relative scroll-mt-28 overflow-hidden rounded-[32px] border border-white/10 bg-[#020617]/60 p-5 shadow-[0_24px_95px_rgba(0,0,0,0.48)] backdrop-blur-xl md:p-6"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.13),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.10),transparent_36%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:42px_42px]" />

      <div className="relative">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            {eyebrow ? (
              <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-100/60">
                {eyebrow}
              </p>
            ) : null}

            <h2 className="mt-2 text-2xl font-black text-white">{title}</h2>
          </div>

          {right}
        </div>

        {children}
      </div>
    </section>
  );
}

function StatusPill({
  active,
  children,
  tone = "blue",
}: {
  active?: boolean;
  children: ReactNode;
  tone?: "blue" | "cyan" | "amber" | "slate";
}) {
  const tones = {
    blue: "border-blue-300/30 bg-blue-500/10 text-blue-100",
    cyan: "border-cyan-300/30 bg-cyan-400/10 text-cyan-100",
    amber: "border-amber-300/25 bg-amber-300/10 text-amber-100",
    slate: "border-white/10 bg-white/[0.04] text-white/50",
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em]",
        active
          ? `${tones[tone]} shadow-[0_0_22px_rgba(59,130,246,0.12)]`
          : tones.slate,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function InfoCard({
  label,
  value,
  mono,
}: {
  label: string;
  value: string | number;
  mono?: boolean;
}) {
  return (
    <div className="launch-card-3d rounded-2xl border border-white/10 bg-[#020617]/60 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="text-[11px] font-black uppercase tracking-[0.2em] text-white/35">
        {label}
      </div>

      <div
        className={[
          "mt-2 break-all text-sm font-semibold leading-relaxed text-white/80",
          mono ? "font-mono text-xs" : "",
        ].join(" ")}
      >
        {value === "" || value === null || value === undefined
          ? "Not available"
          : value}
      </div>
    </div>
  );
}

function TransactionStatus({
  message,
  txHash,
}: {
  message: string;
  txHash?: string;
}) {
  if (!message) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-white/80">
      <div>{message}</div>

      {txHash ? (
        <a
          href={`${BSC_SCAN_URL}/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex break-all font-black text-cyan-200 hover:text-white"
        >
          Open transaction on BscScan ↗
        </a>
      ) : null}
    </div>
  );
}

function ProjectIconCard({
  project,
  active,
}: {
  project: PublicProject;
  active?: boolean;
}) {
  const launchUrl = getSafeProjectUrl(project);
  const external = /^https?:\/\//i.test(launchUrl);

  return (
    <a
      href={launchUrl}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={[
        "launch-card-3d group relative block overflow-hidden rounded-[34px] border p-5 transition hover:-translate-y-1",
        active
          ? "border-blue-300/30 bg-blue-500/10 shadow-[0_28px_95px_rgba(59,130,246,0.18)]"
          : "border-white/10 bg-[#020617]/60",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.16),transparent_35%)]" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-500/15 blur-3xl" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-[30px] border border-blue-300/20 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.99))] shadow-[0_0_42px_rgba(59,130,246,0.18)] transition group-hover:scale-[1.03]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.22),transparent_60%)]" />

            <img
              src="/Korax-logo.png"
              alt="KORAX"
              className="launch-logo-float relative h-16 w-16 object-contain drop-shadow-[0_0_22px_rgba(59,130,246,0.75)]"
            />
          </div>

          <StatusPill active={project.active} tone="cyan">
            {project.active ? "Live" : "Inactive"}
          </StatusPill>
        </div>

        <h3 className="mt-5 text-2xl font-black leading-tight text-white">
          {project.name || "Unnamed Project"}
        </h3>

        <div className="mt-2 text-sm font-black uppercase tracking-[0.22em] text-cyan-200">
          {project.symbol || "TOKEN"}
        </div>

        <p className="mt-4 text-sm leading-7 text-white/60">
          Registered through the KORAX Project Registry and available for public
          launch discovery.
        </p>

        <div className="mt-5 grid gap-3">
          <InfoCard label="Project ID" value={project.id} />
          <InfoCard
            label="Token"
            value={project.token ? shortAddress(project.token) : "Not available"}
          />
        </div>

        <div className="mt-5 rounded-2xl border border-blue-300/25 bg-blue-500/10 px-4 py-3 text-center text-sm font-black text-blue-100">
          Open Project Launch Page
        </div>
      </div>
    </a>
  );
}

function LaunchHeroVisual() {
  return (
    <div className="realistic-launch-hero">
      <div className="realistic-stars" />
      <div className="realistic-grid" />
      <div className="realistic-orbit realistic-orbit-one" />
      <div className="realistic-orbit realistic-orbit-two" />
      <div className="realistic-cloud realistic-cloud-left" />
      <div className="realistic-cloud realistic-cloud-right" />

      <div className="realistic-rocket-stack">
        <div className="realistic-speed-lines" />

        <svg
          viewBox="0 0 300 640"
          className="realistic-rocket-svg"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="metalBody" x1="60" y1="0" x2="240" y2="0">
              <stop offset="0%" stopColor="#111827" />
              <stop offset="10%" stopColor="#64748B" />
              <stop offset="24%" stopColor="#F8FAFC" />
              <stop offset="45%" stopColor="#94A3B8" />
              <stop offset="63%" stopColor="#FFFFFF" />
              <stop offset="82%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            <linearGradient id="noseBlue" x1="75" y1="0" x2="225" y2="0">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="35%" stopColor="#60A5FA" />
              <stop offset="62%" stopColor="#E0F2FE" />
              <stop offset="100%" stopColor="#1E3A8A" />
            </linearGradient>

            <linearGradient id="boosterMetal" x1="0" y1="0" x2="60" y2="0">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="20%" stopColor="#64748B" />
              <stop offset="45%" stopColor="#E2E8F0" />
              <stop offset="72%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>

            <linearGradient id="flameReal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="16%" stopColor="#DBEAFE" />
              <stop offset="32%" stopColor="#60A5FA" />
              <stop offset="55%" stopColor="#22D3EE" />
              <stop offset="72%" stopColor="#F97316" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>

            <filter id="flameBlur">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Side boosters */}
          <path
            d="M62 170C42 220 36 345 45 465C49 512 66 548 91 558C79 414 80 282 103 170H62Z"
            fill="url(#boosterMetal)"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="2"
          />
          <path
            d="M238 170C258 220 264 345 255 465C251 512 234 548 209 558C221 414 220 282 197 170H238Z"
            fill="url(#boosterMetal)"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="2"
          />

          {/* Main body */}
          <path
            d="M150 20C112 62 92 118 92 190V452C92 501 116 535 150 535C184 535 208 501 208 452V190C208 118 188 62 150 20Z"
            fill="url(#metalBody)"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="2.5"
          />

          {/* Nose */}
          <path
            d="M150 20C118 56 101 96 94 146H206C199 96 182 56 150 20Z"
            fill="url(#noseBlue)"
            stroke="rgba(191,219,254,0.85)"
            strokeWidth="2.5"
          />

          {/* Horizontal rings */}
          <path d="M98 172H202" stroke="#1D4ED8" strokeWidth="6" strokeLinecap="round" />
          <path d="M96 382H204" stroke="#1D4ED8" strokeWidth="6" strokeLinecap="round" />

          {/* Window */}
          <ellipse
            cx="150"
            cy="174"
            rx="32"
            ry="32"
            fill="#020617"
            stroke="#93C5FD"
            strokeWidth="6"
          />
          <ellipse cx="150" cy="174" rx="17" ry="17" fill="#38BDF8" />
          <ellipse cx="140" cy="162" rx="7" ry="5" fill="white" opacity="0.9" />

          {/* Logo panel */}
          <path
            d="M112 260C132 275 168 275 188 260V342C166 358 134 358 112 342V260Z"
            fill="rgba(2,6,23,0.48)"
            stroke="rgba(96,165,250,0.45)"
            strokeWidth="2"
          />
          <rect x="124" y="283" width="52" height="52" rx="16" fill="rgba(15,23,42,0.78)" />
          <image href="/Korax-logo.png" x="130" y="289" width="40" height="40" />

          {/* Fins */}
          <path
            d="M93 408C61 438 48 493 43 545C75 531 96 505 108 462L112 418L93 408Z"
            fill="#1D4ED8"
            stroke="#93C5FD"
            strokeWidth="2"
          />
          <path
            d="M207 408C239 438 252 493 257 545C225 531 204 505 192 462L188 418L207 408Z"
            fill="#1D4ED8"
            stroke="#93C5FD"
            strokeWidth="2"
          />

          {/* Engines */}
          <path
            d="M110 520H190L176 568H124L110 520Z"
            fill="#020617"
            stroke="#94A3B8"
            strokeWidth="2"
          />
          <path d="M128 560H172L162 600H138L128 560Z" fill="#020617" />

          {/* Flames */}
          <path
            className="realistic-flame-side"
            d="M72 555C93 578 95 625 76 640C55 606 48 575 72 555Z"
            fill="url(#flameReal)"
            filter="url(#flameBlur)"
          />
          <path
            className="realistic-flame-side"
            d="M228 555C207 578 205 625 224 640C245 606 252 575 228 555Z"
            fill="url(#flameReal)"
            filter="url(#flameBlur)"
          />
          <path
            className="realistic-flame-main"
            d="M150 558C184 596 180 630 150 640C120 630 116 596 150 558Z"
            fill="url(#flameReal)"
            filter="url(#flameBlur)"
          />
        </svg>

        <img
          src="/korax-wordmark.png"
          alt="KORAX"
          className="realistic-wordmark"
        />
      </div>

      <div className="realistic-launch-bars">
        <div className="realistic-bar-card">
          <span>Access</span>
          <div className="realistic-track">
            <div className="realistic-fill realistic-fill-access" />
          </div>
        </div>

        <div className="realistic-bar-card">
          <span>Buy</span>
          <div className="realistic-track">
            <div className="realistic-fill realistic-fill-buy" />
          </div>
        </div>

        <div className="realistic-bar-card">
          <span>Release</span>
          <div className="realistic-track">
            <div className="realistic-fill realistic-fill-release" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .realistic-launch-hero {
          position: relative;
          min-height: 560px;
          overflow: hidden;
          border-radius: 34px;
          background:
            radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.24), transparent 34%),
            radial-gradient(circle at 20% 75%, rgba(34, 211, 238, 0.12), transparent 30%),
            linear-gradient(180deg, #061020 0%, #020617 58%, #01030a 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 34px 120px rgba(0, 0, 0, 0.68);
          isolation: isolate;
        }

        .realistic-grid {
          position: absolute;
          inset: 0;
          opacity: 0.055;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.09) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.09) 1px, transparent 1px);
          background-size: 36px 36px;
        }

        .realistic-stars {
          position: absolute;
          inset: 0;
          opacity: 0.75;
          background-image:
            radial-gradient(1.4px 1.4px at 9% 18%, #fff, transparent),
            radial-gradient(1px 1px at 23% 43%, #dbeafe, transparent),
            radial-gradient(1.5px 1.5px at 54% 12%, #fff, transparent),
            radial-gradient(1px 1px at 74% 28%, #dbeafe, transparent),
            radial-gradient(1.3px 1.3px at 88% 14%, #fff, transparent),
            radial-gradient(1px 1px at 92% 64%, #fff, transparent),
            radial-gradient(1.2px 1.2px at 40% 78%, #fff, transparent),
            radial-gradient(1px 1px at 16% 82%, #dbeafe, transparent);
          background-repeat: no-repeat;
          animation: realisticStars 5.5s ease-in-out infinite;
        }

        .realistic-orbit {
          position: absolute;
          left: 50%;
          top: 42%;
          border-radius: 999px;
          border: 1px solid rgba(56, 189, 248, 0.13);
          transform: translate(-50%, -50%);
        }

        .realistic-orbit-one {
          width: 420px;
          height: 420px;
          animation: realisticOrbit 22s linear infinite;
        }

        .realistic-orbit-two {
          width: 560px;
          height: 560px;
          border-color: rgba(96, 165, 250, 0.08);
          animation: realisticOrbit 34s linear infinite reverse;
        }

        .realistic-cloud {
          position: absolute;
          bottom: 72px;
          width: 210px;
          height: 95px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(255,255,255,0.14), rgba(148,163,184,0.08) 50%, transparent 75%);
          filter: blur(12px);
          opacity: 0.7;
        }

        .realistic-cloud-left {
          left: -55px;
        }

        .realistic-cloud-right {
          right: -55px;
        }

        .realistic-rocket-stack {
          position: absolute;
          left: 50%;
          top: 48%;
          width: 300px;
          height: 640px;
          transform: translate(-50%, -50%);
          z-index: 5;
          animation: realisticRocketToSky 6.8s cubic-bezier(0.18, 0.9, 0.22, 1) infinite;
          will-change: transform, opacity;
          transform-style: preserve-3d;
        }

        .realistic-rocket-svg {
          width: 300px;
          height: 640px;
          display: block;
          filter: drop-shadow(0 28px 46px rgba(0, 0, 0, 0.5));
          transform: perspective(950px) rotateX(7deg) rotateY(-9deg);
        }

        .realistic-speed-lines {
          position: absolute;
          left: 50%;
          top: 0;
          width: 160px;
          height: 560px;
          transform: translateX(-50%);
          background:
            linear-gradient(180deg, transparent, rgba(96,165,250,0.38), transparent),
            linear-gradient(90deg, transparent 20%, rgba(34,211,238,0.35), transparent 80%);
          opacity: 0;
          filter: blur(4px);
          animation: realisticSpeedLines 6.8s ease-in-out infinite;
        }

        .realistic-wordmark {
          position: absolute;
          left: 50%;
          top: 390px;
          width: 136px;
          height: auto;
          transform: translateX(-50%);
          object-fit: contain;
          filter: drop-shadow(0 0 14px rgba(59, 130, 246, 0.6));
        }

        .realistic-flame-main {
          animation: realisticFlameMain 0.55s ease-in-out infinite alternate;
          transform-origin: center top;
        }

        .realistic-flame-side {
          animation: realisticFlameSide 0.7s ease-in-out infinite alternate;
          transform-origin: center top;
        }

        .realistic-launch-bars {
          position: absolute;
          left: 16px;
          right: 16px;
          bottom: 16px;
          z-index: 10;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .realistic-bar-card {
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          background: rgba(2, 6, 23, 0.72);
          padding: 14px;
          backdrop-filter: blur(16px);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.045);
        }

        .realistic-bar-card span {
          display: block;
          margin-bottom: 12px;
          color: #ffffff;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .realistic-track {
          height: 8px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.09);
        }

        .realistic-fill {
          width: 0;
          height: 100%;
          border-radius: 999px;
          animation-duration: 6.8s;
          animation-fill-mode: both;
          animation-timing-function: cubic-bezier(0.18, 0.9, 0.28, 1);
          animation-iteration-count: infinite;
        }

        .realistic-fill-access {
          background: linear-gradient(90deg, #1d4ed8, #60a5fa, #dbeafe);
          animation-name: realisticFillAccess;
        }

        .realistic-fill-buy {
          background: linear-gradient(90deg, #0891b2, #22d3ee, #cffafe);
          animation-name: realisticFillBuy;
          animation-delay: 0.08s;
        }

        .realistic-fill-release {
          background: linear-gradient(90deg, #b45309, #f59e0b, #fde68a);
          animation-name: realisticFillRelease;
          animation-delay: 0.16s;
        }

        @keyframes realisticRocketToSky {
          0% {
            transform: translate(-50%, -34%) scale(0.82) rotate(-0.7deg);
            opacity: 1;
          }

          10% {
            transform: translate(-51%, -36%) scale(0.86) rotate(0.8deg);
            opacity: 1;
          }

          22% {
            transform: translate(-50%, -48%) scale(0.92) rotate(-0.3deg);
            opacity: 1;
          }

          42% {
            transform: translate(-50%, -105%) scale(0.86) rotate(0deg);
            opacity: 1;
          }

          58% {
            transform: translate(-50%, -205%) scale(0.62) rotate(0deg);
            opacity: 0;
          }

          74% {
            transform: translate(-50%, -205%) scale(0.62) rotate(0deg);
            opacity: 0;
          }

          75% {
            transform: translate(-50%, 16%) scale(0.78) rotate(-0.7deg);
            opacity: 0;
          }

          86% {
            transform: translate(-50%, -34%) scale(0.82) rotate(-0.7deg);
            opacity: 1;
          }

          100% {
            transform: translate(-50%, -34%) scale(0.82) rotate(-0.7deg);
            opacity: 1;
          }
        }

        @keyframes realisticSpeedLines {
          0%,
          12% {
            opacity: 0;
            transform: translateX(-50%) translateY(40px) scaleY(0.7);
          }

          24% {
            opacity: 0.45;
          }

          44% {
            opacity: 0.85;
            transform: translateX(-50%) translateY(-90px) scaleY(1.12);
          }

          60%,
          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-210px) scaleY(1.2);
          }
        }

        @keyframes realisticFillAccess {
          0% {
            width: 0;
          }
          44% {
            width: 84%;
          }
          74% {
            width: 84%;
          }
          100% {
            width: 0;
          }
        }

        @keyframes realisticFillBuy {
          0% {
            width: 0;
          }
          44% {
            width: 68%;
          }
          74% {
            width: 68%;
          }
          100% {
            width: 0;
          }
        }

        @keyframes realisticFillRelease {
          0% {
            width: 0;
          }
          44% {
            width: 92%;
          }
          74% {
            width: 92%;
          }
          100% {
            width: 0;
          }
        }

        @keyframes realisticStars {
          0%,
          100% {
            opacity: 0.45;
          }
          50% {
            opacity: 0.85;
          }
        }

        @keyframes realisticOrbit {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes realisticFlameMain {
          from {
            transform: scaleY(0.9);
            opacity: 0.82;
          }
          to {
            transform: scaleY(1.16);
            opacity: 1;
          }
        }

        @keyframes realisticFlameSide {
          from {
            transform: scaleY(0.85);
            opacity: 0.72;
          }
          to {
            transform: scaleY(1.06);
            opacity: 0.96;
          }
        }

        @media (max-width: 640px) {
          .realistic-launch-hero {
            min-height: 640px;
          }

          .realistic-rocket-stack {
            top: 43%;
            transform: translate(-50%, -50%) scale(0.78);
          }

          .realistic-launch-bars {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .realistic-stars,
          .realistic-orbit,
          .realistic-rocket-stack,
          .realistic-speed-lines,
          .realistic-flame-main,
          .realistic-flame-side,
          .realistic-fill {
            animation: none !important;
          }

          .realistic-fill-access {
            width: 84%;
          }

          .realistic-fill-buy {
            width: 68%;
          }

          .realistic-fill-release {
            width: 92%;
          }
        }
      `}</style>
    </div>
  );
}

export default function LaunchPage() {
  const { address, isConnected, chainId } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { switchChainAsync } = useSwitchChain();

  const previewRequestIdRef = useRef(0);
  const initialSaleIdRef = useRef("");

  const [publicProjects, setPublicProjects] = useState<PublicProject[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState("");
  const [activeProjectSlug, setActiveProjectSlug] = useState("");

  const [loadedBuilderProject, setLoadedBuilderProject] =
    useState<LoadedBuilderProject | null>(null);

  const [isLaunchpadOwner, setIsLaunchpadOwner] = useState(false);
  const [isApprovedCreator, setIsApprovedCreator] = useState(false);
  const [permissionError, setPermissionError] = useState("");

  const [access, setAccess] = useState<AccessState>({
    loading: false,
    connected: false,
    wallet: "",
    eligibleAmountRaw: 0n,
    eligibleAmount: "0",
    launchLevel: 0,
    totalProjectSlots: 0,
    hasLaunchAccess: false,
    level1AmountRaw: ethers.parseUnits("500", 18),
    level2AmountRaw: ethers.parseUnits("2500", 18),
    level3AmountRaw: ethers.parseUnits("5000", 18),
    level1Amount: "500",
    level2Amount: "2,500",
    level3Amount: "5,000",
    requiredRewardBps: 9000,
    error: "",
  });

  const [paymentAssets, setPaymentAssets] = useState<
    Record<PaymentKey, PaymentAsset>
  >({
    USDT: {
      key: "USDT",
      address: USDT_ADDRESS,
      decimals: 18,
      symbol: "USDT",
      ready: false,
      error: "",
    },
    USDC: {
      key: "USDC",
      address: USDC_ADDRESS,
      decimals: 18,
      symbol: "USDC",
      ready: false,
      error: "",
    },
  });

  const [creatorForm, setCreatorForm] = useState({
    saleToken: "",
    fundReceiver: "",
    stageCaps: "1000000\n1000000\n1000000",
    stagePricesUsd: "0.01\n0.015\n0.02",
    requireKoraxAccess: true,
  });

  const [adminForm, setAdminForm] = useState({
    saleId: "0",
    creatorAddress: "",
    approved: true,
    claimOpen: true,
    unsoldReceiver: "",
    level1Limit: "250",
    level2Limit: "500",
    level3Limit: "750",
    antiBotEnabled: true,
    cooldown: "15",
  });

  const [buyerForm, setBuyerForm] = useState<{
    saleId: string;
    paymentAmount: string;
    payToken: PaymentKey;
  }>({
    saleId: "0",
    paymentAmount: "10",
    payToken: "USDT",
  });

  const [creatorStatus, setCreatorStatus] = useState("");
  const [creatorTxHash, setCreatorTxHash] = useState("");
  const [adminStatus, setAdminStatus] = useState("");
  const [adminTxHash, setAdminTxHash] = useState("");
  const [buyerStatus, setBuyerStatus] = useState("");
  const [buyerTxHash, setBuyerTxHash] = useState("");

  const [creatingSale, setCreatingSale] = useState(false);
  const [adminBusy, setAdminBusy] = useState(false);
  const [loadingSale, setLoadingSale] = useState(false);
  const [buying, setBuying] = useState(false);
  const [claiming, setClaiming] = useState(false);

  const [loadedSaleId, setLoadedSaleId] = useState("");
  const [loadedSale, setLoadedSale] = useState<LoadedSale | null>(null);
  const [buyerMax, setBuyerMax] = useState<bigint>(0n);
  const [buyerPurchased, setBuyerPurchased] = useState<bigint>(0n);
  const [buyerContributed, setBuyerContributed] = useState<bigint>(0n);
  const [buyerClaimed, setBuyerClaimed] = useState(false);
  const [previewTokens, setPreviewTokens] = useState<bigint>(0n);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const [lastSaleUpdate, setLastSaleUpdate] = useState("");

  const activeProject = useMemo(() => {
    if (!publicProjects.length) return null;

    if (activeProjectSlug) {
      return (
        publicProjects.find((item) => item.slug === activeProjectSlug) ||
        publicProjects[0]
      );
    }

    return publicProjects[0];
  }, [publicProjects, activeProjectSlug]);

  const currentLevel = useMemo(
    () => levelFromNumber(access.launchLevel),
    [access.launchLevel]
  );

  const canCreateSale = isLaunchpadOwner || isApprovedCreator;
  const currentPaymentAsset = paymentAssets[buyerForm.payToken];

  const dynamicLevels = useMemo(
    () =>
      LEVEL_DEFINITIONS.map((level) => ({
        ...level,
        minKrx:
          level.level === 1
            ? access.level1Amount
            : level.level === 2
              ? access.level2Amount
              : access.level3Amount,
      })),
    [access.level1Amount, access.level2Amount, access.level3Amount]
  );

  const loadedSaleMatchesInput =
    Boolean(loadedSale) && loadedSaleId === buyerForm.saleId.trim();

  const saleProgress = loadedSale
    ? formatPercent(loadedSale.totalSold, loadedSale.totalForSale)
    : 0;

  const currentStageIndex = loadedSale
    ? loadedSale.stages.findIndex((stage) => stage.sold < stage.cap)
    : -1;

  const buyerRemainingUsd18 =
    buyerMax > buyerContributed ? buyerMax - buyerContributed : 0n;

  const paymentAmountUsd18 = safeParseUnits(buyerForm.paymentAmount, 18);

  const exceedsBuyerLimit =
    buyerMax > 0n && paymentAmountUsd18 > buyerRemainingUsd18;

  const participationAccessReady =
    !loadedSale?.requireKoraxAccess || access.hasLaunchAccess;

  const canBuy =
    loadedSaleMatchesInput &&
    Boolean(loadedSale?.active) &&
    isPositiveDecimal(buyerForm.paymentAmount) &&
    previewTokens > 0n &&
    participationAccessReady &&
    !exceedsBuyerLimit &&
    !buying;

  const canClaim =
    loadedSaleMatchesInput &&
    Boolean(loadedSale?.claimOpen) &&
    buyerPurchased > 0n &&
    !buyerClaimed &&
    !claiming;

  async function getReadProvider() {
    return new ethers.JsonRpcProvider(RPC_URL);
  }

  async function getBrowserSigner() {
    if (!isConnected || !address || !walletClient) {
      throw new Error("Connect your wallet from the top bar first.");
    }

    if (chainId !== BSC_CHAIN_ID) {
      try {
        setBuyerStatus("Requesting a switch to BNB Chain...");
        await switchChainAsync({ chainId: BSC_CHAIN_ID });
        await new Promise((resolve) => window.setTimeout(resolve, 450));
      } catch {
        throw new Error("Switch your wallet to BNB Chain and try again.");
      }
    }

    const provider = new ethers.BrowserProvider(
      makeEip1193Provider(walletClient) as any
    );

    const network = await provider.getNetwork();

    if (Number(network.chainId) !== BSC_CHAIN_ID) {
      throw new Error("The connected wallet is not using BNB Chain.");
    }

    await validateContract(provider, LAUNCHPAD_ADDRESS, "Launchpad");

    return provider.getSigner();
  }

  async function loadPaymentAssets() {
    const provider = await getReadProvider();

    const nextAssets = { ...paymentAssets };

    for (const key of ["USDT", "USDC"] as PaymentKey[]) {
      const addressValue = key === "USDT" ? USDT_ADDRESS : USDC_ADDRESS;

      try {
        await validateContract(provider, addressValue, key);

        const token = new ethers.Contract(
          addressValue,
          FULL_ERC20_ABI,
          provider
        );

        const [decimalsRaw, symbolRaw] = await Promise.all([
          token.decimals(),
          token.symbol().catch(() => key),
        ]);

        nextAssets[key] = {
          key,
          address: ethers.getAddress(addressValue),
          decimals: Number(decimalsRaw),
          symbol: String(symbolRaw || key),
          ready: true,
          error: "",
        };
      } catch (error) {
        nextAssets[key] = {
          key,
          address: addressValue,
          decimals: 18,
          symbol: key,
          ready: false,
          error: getErrorMessage(error, `${key} configuration failed.`),
        };
      }
    }

    setPaymentAssets(nextAssets);
  }

  async function loadPublicProjects() {
    setProjectsLoading(true);
    setProjectsError("");

    try {
      const response = await fetch("/api/public-projects?limit=50", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "Failed to load public projects.");
      }

      setPublicProjects(Array.isArray(data.projects) ? data.projects : []);
    } catch (error) {
      setProjectsError(
        getErrorMessage(
          error,
          "Failed to load public projects from the registry."
        )
      );
      setPublicProjects([]);
    } finally {
      setProjectsLoading(false);
    }
  }

  async function loadLaunchpadPermissions(user?: string) {
    setPermissionError("");

    try {
      if (!user || !LAUNCHPAD_ADDRESS) {
        setIsLaunchpadOwner(false);
        setIsApprovedCreator(false);
        return;
      }

      const provider = await getReadProvider();
      await validateContract(provider, LAUNCHPAD_ADDRESS, "Launchpad");

      const launchpad = new ethers.Contract(
        LAUNCHPAD_ADDRESS,
        launchpadAbi,
        provider
      );

      const [ownerRaw, approvedRaw] = await Promise.all([
        launchpad.owner(),
        launchpad.approvedSaleCreators(user),
      ]);

      setIsLaunchpadOwner(
        String(ownerRaw).toLowerCase() === user.toLowerCase()
      );
      setIsApprovedCreator(Boolean(approvedRaw));
    } catch (error) {
      setIsLaunchpadOwner(false);
      setIsApprovedCreator(false);
      setPermissionError(
        getErrorMessage(error, "Failed to load Launchpad permissions.")
      );
    }
  }

  async function loadAccess(user?: string) {
    if (!user) {
      setAccess((previous) => ({
        ...previous,
        loading: false,
        connected: false,
        wallet: "",
        eligibleAmountRaw: 0n,
        eligibleAmount: "0",
        launchLevel: 0,
        totalProjectSlots: 0,
        hasLaunchAccess: false,
        error: "",
      }));
      return;
    }

    try {
      setAccess((previous) => ({
        ...previous,
        loading: true,
        connected: true,
        wallet: user,
        error: "",
      }));

      const provider = await getReadProvider();
      await validateContract(provider, ACCESS_MANAGER_ADDRESS, "Access Manager");

      const accessManager = new ethers.Contract(
        ACCESS_MANAGER_ADDRESS,
        accessManagerAbi,
        provider
      );

      const [launchData, accessData, hasLaunchAccessRaw] = await Promise.all([
        accessManager.getLaunchAccessData(user),
        accessManager.getAccessData(user),
        accessManager.hasLaunchAccess(user),
      ]);

      const eligibleAmountRaw = BigInt(
        launchData.totalEligibleAmount.toString()
      );
      const level1AmountRaw = BigInt(launchData.level1Amount.toString());
      const level2AmountRaw = BigInt(launchData.level2Amount.toString());
      const level3AmountRaw = BigInt(launchData.level3Amount.toString());

      setAccess({
        loading: false,
        connected: true,
        wallet: user,
        eligibleAmountRaw,
        eligibleAmount: formatUnitsSafe(eligibleAmountRaw, 18, 4),
        launchLevel: Number(launchData.launchLevel),
        totalProjectSlots: Number(accessData.totalProjectSlots || 0),
        hasLaunchAccess: Boolean(hasLaunchAccessRaw),
        level1AmountRaw,
        level2AmountRaw,
        level3AmountRaw,
        level1Amount: formatUnitsSafe(level1AmountRaw, 18, 0),
        level2Amount: formatUnitsSafe(level2AmountRaw, 18, 0),
        level3Amount: formatUnitsSafe(level3AmountRaw, 18, 0),
        requiredRewardBps: Number(launchData.currentRequiredRewardBps),
        error: "",
      });
    } catch (error) {
      setAccess((previous) => ({
        ...previous,
        loading: false,
        connected: true,
        wallet: user,
        error: getErrorMessage(error, "Failed to load launch access."),
      }));
    }
  }

  async function updatePreview(saleIdText?: string) {
    const requestId = ++previewRequestIdRef.current;
    setPreviewError("");

    try {
      const idText = (saleIdText ?? buyerForm.saleId).trim();

      if (!/^\d+$/.test(idText) || !isPositiveDecimal(buyerForm.paymentAmount)) {
        setPreviewTokens(0n);
        setPreviewLoading(false);
        return;
      }

      if (!currentPaymentAsset.ready) {
        throw new Error(
          currentPaymentAsset.error ||
            `${buyerForm.payToken} token configuration is unavailable.`
        );
      }

      setPreviewLoading(true);

      const saleId = BigInt(idText);
      const paymentAmount = ethers.parseUnits(
        buyerForm.paymentAmount,
        currentPaymentAsset.decimals
      );

      const provider = await getReadProvider();
      await validateContract(provider, LAUNCHPAD_ADDRESS, "Launchpad");

      const launchpad = new ethers.Contract(
        LAUNCHPAD_ADDRESS,
        launchpadAbi,
        provider
      );

      const output =
        buyerForm.payToken === "USDC"
          ? await launchpad.previewTokensForUSDC(saleId, paymentAmount)
          : await launchpad.previewTokensForUSDT(saleId, paymentAmount);

      if (requestId !== previewRequestIdRef.current) return;

      setPreviewTokens(BigInt(output.toString()));
    } catch (error) {
      if (requestId !== previewRequestIdRef.current) return;

      setPreviewTokens(0n);
      setPreviewError(
        getErrorMessage(error, "The token preview could not be calculated.")
      );
    } finally {
      if (requestId === previewRequestIdRef.current) {
        setPreviewLoading(false);
      }
    }
  }

  async function loadSaleById(saleIdText: string, silent = false) {
    if (!silent) {
      setLoadingSale(true);
      setBuyerStatus("");
      setBuyerTxHash("");
    }

    try {
      const saleId = parseSaleId(saleIdText);
      const provider = await getReadProvider();
      await validateContract(provider, LAUNCHPAD_ADDRESS, "Launchpad");

      const launchpad = new ethers.Contract(
        LAUNCHPAD_ADDRESS,
        launchpadAbi,
        provider
      );

      const [saleRaw, countRaw] = await Promise.all([
        launchpad.sales(saleId),
        launchpad.stagesCount(saleId),
      ]);

      if (
        !saleRaw?.owner ||
        String(saleRaw.owner).toLowerCase() === ZERO_ADDRESS
      ) {
        throw new Error(`Sale #${saleId.toString()} was not found.`);
      }

      const stageCount = Number(countRaw);

      if (!Number.isSafeInteger(stageCount) || stageCount < 1 || stageCount > 50) {
        throw new Error("The sale contains an invalid number of stages.");
      }

      const stages = await Promise.all(
        Array.from({ length: stageCount }, async (_, index) => {
          const stageRaw = await launchpad.getStage(saleId, index);

          return {
            cap: BigInt(stageRaw.cap.toString()),
            priceUsd18: BigInt(stageRaw.priceUsd18.toString()),
            sold: BigInt(stageRaw.sold.toString()),
          } satisfies LoadedStage;
        })
      );

      const saleTokenDecimals = Number(saleRaw.saleTokenDecimals);
      let saleTokenSymbol = "TOKEN";

      try {
        const saleToken = new ethers.Contract(
          saleRaw.saleToken,
          FULL_ERC20_ABI,
          provider
        );
        saleTokenSymbol = String(await saleToken.symbol());
      } catch {
        saleTokenSymbol = "TOKEN";
      }

      const sale: LoadedSale = {
        owner: String(saleRaw.owner),
        saleToken: String(saleRaw.saleToken),
        saleTokenSymbol,
        fundReceiver: String(saleRaw.fundReceiver),
        saleTokenDecimals,
        totalForSale: BigInt(saleRaw.totalForSale.toString()),
        totalSold: BigInt(saleRaw.totalSold.toString()),
        active: Boolean(saleRaw.active),
        claimOpen: Boolean(saleRaw.claimOpen),
        requireKoraxAccess: Boolean(saleRaw.requireKoraxAccess),
        stages,
      };

      setLoadedSale(sale);
      setLoadedSaleId(saleId.toString());
      setBuyerForm((previous) => ({
        ...previous,
        saleId: saleId.toString(),
      }));

      if (address) {
        const [maxRaw, contributedRaw, purchasedRaw, claimedRaw] =
          await Promise.all([
            launchpad.maxContributionOf(saleId, address),
            launchpad.contributedUsd18(saleId, address),
            launchpad.purchased(saleId, address),
            launchpad.claimed(saleId, address),
          ]);

        setBuyerMax(BigInt(maxRaw.toString()));
        setBuyerContributed(BigInt(contributedRaw.toString()));
        setBuyerPurchased(BigInt(purchasedRaw.toString()));
        setBuyerClaimed(Boolean(claimedRaw));
      } else {
        setBuyerMax(0n);
        setBuyerContributed(0n);
        setBuyerPurchased(0n);
        setBuyerClaimed(false);
      }

      setLastSaleUpdate(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );

      await updatePreview(saleId.toString());

      if (!silent) {
        setBuyerStatus(`Sale #${saleId.toString()} loaded successfully.`);
      }
    } catch (error) {
      if (!silent) {
        setLoadedSale(null);
        setLoadedSaleId("");
        setBuyerMax(0n);
        setBuyerContributed(0n);
        setBuyerPurchased(0n);
        setBuyerClaimed(false);
        setBuyerStatus(getErrorMessage(error, "Failed to load sale."));
      }
    } finally {
      if (!silent) setLoadingSale(false);
    }
  }

  async function createSale() {
    if (creatingSale) return;

    setCreatingSale(true);
    setCreatorStatus("");
    setCreatorTxHash("");

    try {
      if (!canCreateSale) {
        throw new Error(
          "Only the Launchpad owner or an approved sale creator can create a sale."
        );
      }

      const signer = await getBrowserSigner();
      const creator = await signer.getAddress();
      const provider = signer.provider;

      const saleTokenAddress = ethers.getAddress(creatorForm.saleToken.trim());
      const fundReceiver = creatorForm.fundReceiver.trim()
        ? ethers.getAddress(creatorForm.fundReceiver.trim())
        : creator;

      await validateContract(provider, saleTokenAddress, "sale token");

      const saleToken = new ethers.Contract(
        saleTokenAddress,
        FULL_ERC20_ABI,
        signer
      );

      const saleDecimals = Number(await saleToken.decimals());
      const caps = parsePositiveLines(creatorForm.stageCaps, "Stage caps");
      const prices = parsePositiveLines(
        creatorForm.stagePricesUsd,
        "Stage prices"
      );

      if (caps.length !== prices.length) {
        throw new Error("Stage caps and prices must contain the same number of lines.");
      }

      if (caps.length > 10) {
        throw new Error("A launch sale can contain a maximum of 10 stages.");
      }

      const stageCaps = caps.map((value) =>
        ethers.parseUnits(value, saleDecimals)
      );
      const stagePricesUsd18 = prices.map((value) =>
        ethers.parseUnits(value, 18)
      );
      const totalForSale = stageCaps.reduce(
        (total, value) => total + value,
        0n
      );

      const tokenBalanceRaw = await saleToken.balanceOf(creator);
      const tokenBalance = BigInt(tokenBalanceRaw.toString());

      if (tokenBalance < totalForSale) {
        throw new Error(
          `Insufficient sale-token balance. Required: ${formatUnitsSafe(
            totalForSale,
            saleDecimals,
            4
          )}.`
        );
      }

      const allowanceRaw = await saleToken.allowance(
        creator,
        LAUNCHPAD_ADDRESS
      );
      const allowance = BigInt(allowanceRaw.toString());

      if (allowance < totalForSale) {
        setCreatorStatus("Approve the complete sale allocation in your wallet...");

        const approvalTransaction = await saleToken.approve(
          LAUNCHPAD_ADDRESS,
          totalForSale
        );

        setCreatorStatus("Sale-token approval submitted. Waiting for confirmation...");
        await approvalTransaction.wait();
      }

      const launchpad = new ethers.Contract(
        LAUNCHPAD_ADDRESS,
        launchpadAbi,
        signer
      );

      setCreatorStatus("Confirm the launch-sale creation transaction...");

      const transaction = await launchpad.createSale(
        saleTokenAddress,
        fundReceiver,
        stageCaps,
        stagePricesUsd18,
        creatorForm.requireKoraxAccess
      );

      setCreatorStatus("Launch sale submitted. Waiting for confirmation...");

      const receipt = await transaction.wait();
      let createdSaleId = "";

      for (const log of receipt.logs) {
        try {
          const parsed = launchpad.interface.parseLog({
            topics: [...log.topics],
            data: log.data,
          });

          if (!parsed) continue;

          const candidate =
            parsed.args?.saleId ?? parsed.args?.id ?? parsed.args?.[0];

          if (
            candidate !== undefined &&
            candidate !== null &&
            /sale/i.test(parsed.name)
          ) {
            createdSaleId = candidate.toString();
            break;
          }
        } catch {
          continue;
        }
      }

      setCreatorTxHash(receipt.hash);
      setCreatorStatus(
        createdSaleId
          ? `Launch sale #${createdSaleId} created successfully.`
          : "Launch sale created successfully. The transaction is confirmed."
      );

      if (createdSaleId) {
        saveSaleToBuilderProject(createdSaleId, receipt.hash);
        setAdminForm((previous) => ({
          ...previous,
          saleId: createdSaleId,
        }));
        await loadSaleById(createdSaleId, true);
      }

      await loadPublicProjects();
    } catch (error) {
      setCreatorStatus(getErrorMessage(error, "Create sale failed."));
    } finally {
      setCreatingSale(false);
    }
  }

  async function buy() {
    if (buying) return;

    setBuying(true);
    setBuyerStatus("");
    setBuyerTxHash("");

    try {
      if (!loadedSale || !loadedSaleMatchesInput) {
        throw new Error("Load the selected sale before buying.");
      }

      if (!loadedSale.active) {
        throw new Error("This sale is not active.");
      }

      if (loadedSale.requireKoraxAccess && !access.hasLaunchAccess) {
        throw new Error(
          "This sale requires eligible KORAX launch access from the qualifying staking plan."
        );
      }

      if (!currentPaymentAsset.ready) {
        throw new Error(
          currentPaymentAsset.error ||
            `${buyerForm.payToken} is not configured correctly.`
        );
      }

      const paymentAmount = safeParseUnits(
        buyerForm.paymentAmount,
        currentPaymentAsset.decimals
      );
      const requestedUsd18 = safeParseUnits(buyerForm.paymentAmount, 18);

      if (paymentAmount <= 0n || requestedUsd18 <= 0n) {
        throw new Error("Enter a valid positive payment amount.");
      }

      if (buyerMax > 0n && requestedUsd18 > buyerRemainingUsd18) {
        throw new Error(
          `This purchase exceeds your remaining limit of $${formatUnitsSafe(
            buyerRemainingUsd18,
            18,
            2
          )}.`
        );
      }

      if (previewTokens <= 0n) {
        throw new Error("The contract preview returned zero tokens.");
      }

      const signer = await getBrowserSigner();
      const buyer = await signer.getAddress();
      const saleId = parseSaleId(buyerForm.saleId);

      await validateContract(
        signer.provider,
        currentPaymentAsset.address,
        buyerForm.payToken
      );

      const paymentToken = new ethers.Contract(
        currentPaymentAsset.address,
        FULL_ERC20_ABI,
        signer
      );

      const balanceRaw = await paymentToken.balanceOf(buyer);
      const balance = BigInt(balanceRaw.toString());

      if (balance < paymentAmount) {
        throw new Error(`Insufficient ${buyerForm.payToken} balance.`);
      }

      const allowanceRaw = await paymentToken.allowance(
        buyer,
        LAUNCHPAD_ADDRESS
      );
      const allowance = BigInt(allowanceRaw.toString());

      if (allowance < paymentAmount) {
        setBuyerStatus(`Approve ${buyerForm.payToken} in your wallet...`);

        const approvalTransaction = await paymentToken.approve(
          LAUNCHPAD_ADDRESS,
          paymentAmount
        );

        setBuyerStatus(
          `${buyerForm.payToken} approval submitted. Waiting for confirmation...`
        );
        await approvalTransaction.wait();
      }

      const launchpad = new ethers.Contract(
        LAUNCHPAD_ADDRESS,
        launchpadAbi,
        signer
      );

      setBuyerStatus(`Confirm the ${buyerForm.payToken} purchase...`);

      const transaction =
        buyerForm.payToken === "USDC"
          ? await launchpad.buyWithUSDC(saleId, paymentAmount)
          : await launchpad.buyWithUSDT(saleId, paymentAmount);

      setBuyerStatus("Purchase submitted. Waiting for blockchain confirmation...");

      const receipt = await transaction.wait();

      setBuyerTxHash(receipt.hash);
      setBuyerStatus("Purchase completed successfully.");
      await loadSaleById(saleId.toString(), true);
    } catch (error) {
      setBuyerStatus(getErrorMessage(error, "Buy failed."));
    } finally {
      setBuying(false);
    }
  }

  async function claim() {
    if (claiming) return;

    setClaiming(true);
    setBuyerStatus("");
    setBuyerTxHash("");

    try {
      if (!loadedSale || !loadedSaleMatchesInput) {
        throw new Error("Load the selected sale before claiming.");
      }

      if (!loadedSale.claimOpen) {
        throw new Error("Claim is not open for this sale.");
      }

      if (buyerPurchased <= 0n) {
        throw new Error("This wallet has no purchased tokens to claim.");
      }

      if (buyerClaimed) {
        throw new Error("This wallet has already claimed its allocation.");
      }

      const signer = await getBrowserSigner();
      const launchpad = new ethers.Contract(
        LAUNCHPAD_ADDRESS,
        launchpadAbi,
        signer
      );
      const saleId = parseSaleId(buyerForm.saleId);

      setBuyerStatus("Confirm the claim transaction in your wallet...");

      const transaction = await launchpad.claim(saleId);

      setBuyerStatus("Claim submitted. Waiting for blockchain confirmation...");

      const receipt = await transaction.wait();

      setBuyerTxHash(receipt.hash);
      setBuyerStatus("Claim completed successfully.");
      await loadSaleById(saleId.toString(), true);
    } catch (error) {
      setBuyerStatus(getErrorMessage(error, "Claim failed."));
    } finally {
      setClaiming(false);
    }
  }

  async function adminAction(
    action: "approve" | "close" | "claim" | "unsold" | "limits" | "antibot"
  ) {
    if (adminBusy) return;

    setAdminBusy(true);
    setAdminStatus("");
    setAdminTxHash("");

    try {
      if (!isLaunchpadOwner) {
        throw new Error("Only the Launchpad owner can perform this action.");
      }

      const signer = await getBrowserSigner();
      const launchpad = new ethers.Contract(
        LAUNCHPAD_ADDRESS,
        launchpadAbi,
        signer
      );

      let transaction: ethers.ContractTransactionResponse;

      if (action === "approve") {
        if (!adminForm.creatorAddress.trim()) {
          throw new Error("Creator address is required.");
        }

        transaction = await launchpad.setSaleCreatorApproval(
          ethers.getAddress(adminForm.creatorAddress.trim()),
          adminForm.approved
        );
      } else if (action === "close") {
        transaction = await launchpad.closeSale(
          parseSaleId(adminForm.saleId)
        );
      } else if (action === "claim") {
        transaction = await launchpad.setClaimOpen(
          parseSaleId(adminForm.saleId),
          adminForm.claimOpen
        );
      } else if (action === "unsold") {
        const receiver = adminForm.unsoldReceiver.trim()
          ? ethers.getAddress(adminForm.unsoldReceiver.trim())
          : await signer.getAddress();

        transaction = await launchpad.withdrawUnsold(
          parseSaleId(adminForm.saleId),
          receiver
        );
      } else if (action === "limits") {
        const level1 = safeParseUnits(adminForm.level1Limit, 18);
        const level2 = safeParseUnits(adminForm.level2Limit, 18);
        const level3 = safeParseUnits(adminForm.level3Limit, 18);

        if (level1 <= 0n || level2 <= 0n || level3 <= 0n) {
          throw new Error("All contribution limits must be positive.");
        }

        if (!(level1 <= level2 && level2 <= level3)) {
          throw new Error("Contribution limits must increase from Level 1 to Level 3.");
        }

        transaction = await launchpad.setContributionLimits(
          level1,
          level2,
          level3
        );
      } else {
        if (!isNonNegativeInteger(adminForm.cooldown)) {
          throw new Error("Cooldown must be a non-negative whole number.");
        }

        const cooldown = BigInt(adminForm.cooldown);

        if (cooldown > 86_400n) {
          throw new Error("Cooldown cannot exceed 86,400 seconds.");
        }

        transaction = await launchpad.setAntiBot(
          adminForm.antiBotEnabled,
          cooldown
        );
      }

      setAdminStatus("Admin transaction submitted. Waiting for confirmation...");

      const receipt = await transaction.wait();

      setAdminTxHash(receipt.hash);
      setAdminStatus("Admin action completed successfully.");

      if (loadedSaleId) {
        await loadSaleById(loadedSaleId, true);
      }

      if (action === "approve") {
        await loadLaunchpadPermissions(address);
      }
    } catch (error) {
      setAdminStatus(getErrorMessage(error, "Admin action failed."));
    } finally {
      setAdminBusy(false);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const projectSlug = params.get("project") || "";
    const saleId = params.get("sale") || params.get("saleId") || "";

    setActiveProjectSlug(projectSlug);

    if (/^\d+$/.test(saleId)) {
      initialSaleIdRef.current = saleId;
      setBuyerForm((previous) => ({ ...previous, saleId }));
      setAdminForm((previous) => ({ ...previous, saleId }));
    }

    const project = readLastBuilderProject();

    if (project) {
      setLoadedBuilderProject(project);

      const tokenAddress = project.tokenAddress || project.token || "";

      setCreatorForm((previous) => ({
        ...previous,
        saleToken: tokenAddress || previous.saleToken,
      }));

      if (
        !saleId &&
        project.launchSaleId &&
        /^\d+$/.test(project.launchSaleId)
      ) {
        initialSaleIdRef.current = project.launchSaleId;
        setBuyerForm((previous) => ({
          ...previous,
          saleId: project.launchSaleId || previous.saleId,
        }));
        setAdminForm((previous) => ({
          ...previous,
          saleId: project.launchSaleId || previous.saleId,
        }));
      }
    }

    void loadPaymentAssets();
    void loadPublicProjects();
  }, []);

  useEffect(() => {
    if (!activeProject?.token) return;

    setCreatorForm((previous) => ({
      ...previous,
      saleToken: activeProject.token || previous.saleToken,
    }));
  }, [activeProject?.token]);

  useEffect(() => {
    if (!address || !isConnected) {
      void loadAccess(undefined);
      void loadLaunchpadPermissions(undefined);
      return;
    }

    void loadAccess(address);
    void loadLaunchpadPermissions(address);
  }, [address, isConnected]);

  useEffect(() => {
    if (!initialSaleIdRef.current) return;
    void loadSaleById(initialSaleIdRef.current, true);
  }, [address]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void updatePreview();
    }, 320);

    return () => window.clearTimeout(timer);
  }, [
    buyerForm.paymentAmount,
    buyerForm.payToken,
    buyerForm.saleId,
    currentPaymentAsset.decimals,
    currentPaymentAsset.ready,
  ]);

  useEffect(() => {
    if (!loadedSaleId) return;

    const interval = window.setInterval(() => {
      void loadSaleById(loadedSaleId, true);
    }, SALE_REFRESH_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [loadedSaleId, address]);

  function renderLevelCard(level: (typeof dynamicLevels)[number]) {
    const active = access.launchLevel >= level.level;

    return (
      <div
        key={level.name}
        className={[
          "launch-card-3d rounded-[28px] border p-6 transition",
          active
            ? "border-blue-300/30 bg-blue-500/10"
            : "border-white/10 bg-[#020617]/45",
        ].join(" ")}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm uppercase tracking-[0.25em] text-white/45">
              {level.name}
            </div>

            <div className="mt-2 text-2xl font-black text-white">
              {level.label}
            </div>
          </div>

          <StatusPill active={active} tone={active ? "cyan" : "slate"}>
            {active ? "Unlocked" : "Locked"}
          </StatusPill>
        </div>

        <div className="mt-4 grid gap-3">
          <InfoCard label="On-chain Requirement" value={`${level.minKrx} KRX`} />
          <InfoCard
            label="Default Displayed Limit"
            value={`$${level.fallbackMaxUsd}`}
          />
        </div>

        <p className="mt-4 text-sm leading-relaxed text-white/65">
          {level.desc}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 overflow-hidden">
      <style jsx global>{`
        @keyframes launchCardShimmer {
          0%, 76% { transform: translateX(-120%); opacity: 0; }
          84% { opacity: 1; }
          100% { transform: translateX(120%); opacity: 0; }
        }

        @keyframes launchLogoFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-4px) scale(1.03); }
        }

        .launch-logo-float {
          animation: launchLogoFloat 4.8s ease-in-out infinite;
          will-change: transform;
        }

        .launch-card-3d {
          transform-style: preserve-3d;
          transition: transform 240ms ease, border-color 240ms ease,
            background 240ms ease, box-shadow 240ms ease;
        }

        .launch-card-3d:hover {
          transform: translateY(-3px) perspective(900px) rotateX(1.4deg);
          border-color: rgba(96, 165, 250, 0.3);
          box-shadow: 0 20px 70px rgba(0, 0, 0, 0.42);
        }

        .launch-section-card { transform-style: preserve-3d; }

        .launch-section-card::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,.035), transparent);
          transform: translateX(-120%);
          animation: launchCardShimmer 8s ease-in-out infinite;
        }

        @media (hover: none) {
          .launch-card-3d:hover { transform: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .launch-logo-float,
          .launch-section-card::after { animation: none; }
          .launch-card-3d:hover { transform: none; }
        }
      `}</style>

      <section className="relative overflow-hidden rounded-[38px] border border-white/10 bg-[#020617]/65 p-5 shadow-[0_34px_130px_rgba(0,0,0,0.66)] backdrop-blur-xl md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.15),transparent_35%),linear-gradient(135deg,rgba(15,23,42,0.86),rgba(2,6,23,0.96))]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:52px_52px]" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative grid gap-8 xl:grid-cols-[1fr_470px] xl:items-center">
          <div>
            <div className="inline-flex rounded-full border border-blue-300/25 bg-blue-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-blue-100">
              KORAX Launchpad / Command Center
            </div>

            <h1 className="mt-6 text-4xl font-black leading-[0.96] tracking-tight text-white sm:text-6xl xl:text-7xl">
              Launch. Join.
              <span className="block bg-gradient-to-r from-blue-300 via-cyan-200 to-white bg-clip-text text-transparent">
                Claim through KORAX.
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-white/70 sm:text-lg">
              A staged BNB Chain launch system for KORAX-created and approved
              external projects. Sales support USDT and USDC participation,
              access levels, controlled closing, and owner-activated claims.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatusPill active={Boolean(currentLevel)}>
                {currentLevel ? currentLevel.label : "Access Locked"}
              </StatusPill>
              <StatusPill active={Boolean(publicProjects.length)}>
                Project Registry
              </StatusPill>
              <StatusPill active={Boolean(loadedSale?.active)} tone="cyan">
                Sale {loadedSale?.active ? "Live" : "Console"}
              </StatusPill>
              <StatusPill active={Boolean(loadedSale?.claimOpen)} tone="cyan">
                Claim {loadedSale?.claimOpen ? "Open" : "Layer"}
              </StatusPill>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="#buyer-console" className={primaryButtonClass}>
                Join a Launch
              </a>
              <Link href="/staking" className={cyanButtonClass}>
                Unlock Launch Access
              </Link>
              <Link href="/docs" className={ghostButtonClass}>
                Read Documentation
              </Link>
            </div>
          </div>

          <LaunchHeroVisual />
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[28px] border border-blue-400/20 bg-blue-500/[0.07] px-5 py-4 backdrop-blur-xl">
        <div className="relative grid gap-4 text-center sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Wallet Role",
              value: isLaunchpadOwner
                ? "OWNER"
                : isApprovedCreator
                  ? "APPROVED CREATOR"
                  : "BUYER / VISITOR",
            },
            {
              label: "Launch Access",
              value: access.hasLaunchAccess
                ? `LEVEL ${access.launchLevel}`
                : "LOCKED",
            },
            {
              label: "Loaded Sale",
              value: loadedSaleId ? `#${loadedSaleId}` : "NONE",
            },
            {
              label: "Network",
              value:
                chainId === BSC_CHAIN_ID
                  ? "BNB CHAIN"
                  : isConnected
                    ? "WRONG NETWORK"
                    : "OFFLINE",
            },
          ].map((item, index) => (
            <div
              key={item.label}
              className={index > 0 ? "px-4 py-2 lg:border-l lg:border-white/10" : "px-4 py-2"}
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

      <section className="grid gap-6 xl:grid-cols-[1fr_430px]">
        <SectionBox
          eyebrow="Your Launch Access"
          title={currentLevel ? currentLevel.label : "Launch Access Locked"}
          right={
            <StatusPill active={access.hasLaunchAccess} tone="cyan">
              {access.loading
                ? "Checking"
                : access.hasLaunchAccess
                  ? "Unlocked"
                  : "Locked"}
            </StatusPill>
          }
        >
          <p className="mt-3 text-sm leading-7 text-white/64">
            Your launch participation level is read from eligible KRX staking.
            Project-slot access and buyer allocation access are separate contract
            values.
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <InfoCard label="Eligible Staking" value={`${access.eligibleAmount} KRX`} />
            <InfoCard label="Launch Level" value={access.launchLevel} />
            <InfoCard label="Project Slots" value={access.totalProjectSlots} />
            <InfoCard
              label="Qualifying Reward Plan"
              value={`${access.requiredRewardBps / 100}% fixed plan`}
            />
          </div>

          {access.loading ? (
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
              Loading launch access from the Access Manager...
            </div>
          ) : !access.connected ? (
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
              Connect your wallet from the top bar to calculate launch access.
            </div>
          ) : access.error ? (
            <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {access.error}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-blue-300/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-100">
              Wallet: {shortAddress(access.wallet)}
            </div>
          )}
        </SectionBox>

        <SectionBox eyebrow="Launch Status" title="Live Operations">
          <div className="mt-5 grid gap-3">
            <InfoCard
              label="Launchpad Role"
              value={
                isLaunchpadOwner
                  ? "Owner"
                  : isApprovedCreator
                    ? "Approved Creator"
                    : "Visitor / Buyer"
              }
            />
            <InfoCard label="Selected Sale" value={buyerForm.saleId || "0"} />
            <InfoCard label="Selected Payment" value={buyerForm.payToken} />
            <InfoCard
              label="Claim Status"
              value={loadedSale?.claimOpen ? "Open" : "Closed / Not loaded"}
            />
          </div>

          {permissionError ? (
            <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {permissionError}
            </div>
          ) : null}
        </SectionBox>
      </section>

      <SectionBox
        eyebrow="Global Project Registry"
        title="Public KORAX Launch Projects"
        right={
          <button
            type="button"
            onClick={loadPublicProjects}
            disabled={projectsLoading}
            className={ghostButtonClass}
          >
            {projectsLoading ? "Refreshing..." : "Refresh Registry"}
          </button>
        }
      >
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/60">
          Projects returned by the KORAX public-project API appear here for all
          visitors. Launch links are sanitized before being rendered.
        </p>

        {projectsError ? (
          <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {projectsError}
          </div>
        ) : null}

        {projectsLoading ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-[#020617]/45 p-5 text-sm text-white/60">
            Loading public projects from the registry...
          </div>
        ) : publicProjects.length ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {publicProjects.map((project) => (
              <ProjectIconCard
                key={project.id}
                project={project}
                active={activeProject?.slug === project.slug}
              />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[28px] border border-white/10 bg-[#020617]/45 p-6">
            <div className="text-lg font-black text-white">No public launches yet</div>
            <p className="mt-3 text-sm leading-7 text-white/60">
              Registered projects will appear here after the public-project API
              returns them.
            </p>
          </div>
        )}
      </SectionBox>

      {activeProject ? (
        <SectionBox
          eyebrow="Selected Project"
          title={`${activeProject.name} (${activeProject.symbol})`}
          right={
            <StatusPill active={activeProject.active} tone="cyan">
              Registry {activeProject.active ? "Live" : "Inactive"}
            </StatusPill>
          }
        >
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InfoCard label="Project ID" value={activeProject.id} />
            <InfoCard label="Owner" value={shortAddress(activeProject.owner)} />
            <InfoCard label="Token" value={activeProject.token} mono />
            <InfoCard
              label="Created"
              value={
                activeProject.createdAt
                  ? new Date(activeProject.createdAt).toLocaleDateString("en-US")
                  : "Unknown"
              }
            />
          </div>

          <div className="mt-5 rounded-2xl border border-blue-300/20 bg-blue-500/10 p-4 text-sm leading-7 text-white/75">
            The selected registry token is copied into the creator form. The
            Launchpad contract still verifies creator permissions and receives
            the actual token allocation through approval.
          </div>
        </SectionBox>
      ) : null}

      {loadedBuilderProject ? (
        <SectionBox eyebrow="Local Builder Data" title="Last KORAX Builder Project">
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/60">
            This information is loaded only from the current browser to continue
            the Token Builder → Website Builder → Launch workflow.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InfoCard
              label="Project"
              value={
                loadedBuilderProject.projectName ||
                loadedBuilderProject.name ||
                loadedBuilderProject.websiteName ||
                "Loaded Project"
              }
            />
            <InfoCard
              label="Token"
              value={
                loadedBuilderProject.tokenAddress ||
                loadedBuilderProject.token ||
                "Not available"
              }
              mono
            />
            <InfoCard
              label="Website"
              value={loadedBuilderProject.websiteGenerated ? "Generated" : "Not generated"}
            />
            <InfoCard
              label="Launch Sale ID"
              value={loadedBuilderProject.launchSaleId || "Not created"}
            />
          </div>
        </SectionBox>
      ) : null}

      <SectionBox title="Launch Access Levels" eyebrow="Staking-Based Participation">
        <p className="mt-2 text-sm leading-relaxed text-white/60">
          KRX requirements below are read from the Access Manager. The displayed
          USD caps are the Launchpad defaults used by this interface; after a sale
          is loaded, the exact wallet limit comes from maxContributionOf.
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {dynamicLevels.map(renderLevelCard)}
        </div>
      </SectionBox>

      <section id="buyer-console" className="grid scroll-mt-28 gap-6 xl:grid-cols-2">
        <SectionBox eyebrow="Buyer Console" title="Join a Launch">
          <p className="mt-2 text-sm leading-relaxed text-white/60">
            Load a sale by ID, inspect its real stages and wallet limit, preview
            the output, then purchase with the configured USDT or USDC contract.
          </p>

          <div className="mt-6 grid gap-4">
            <div className="grid gap-4 md:grid-cols-[1fr_auto]">
              <input
                value={buyerForm.saleId}
                onChange={(event) =>
                  setBuyerForm((previous) => ({
                    ...previous,
                    saleId: event.target.value.replace(/\D/g, ""),
                  }))
                }
                placeholder="Sale ID"
                inputMode="numeric"
                className={inputClass}
              />

              <button
                type="button"
                onClick={() => loadSaleById(buyerForm.saleId)}
                disabled={loadingSale || !buyerForm.saleId}
                className={ghostButtonClass}
              >
                {loadingSale ? "Loading..." : "Load Sale"}
              </button>
            </div>

            {loadedSale ? (
              <div className="rounded-[28px] border border-white/10 bg-[#020617]/45 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.2em] text-blue-100/60">
                      Sale #{loadedSaleId}
                    </div>
                    <div className="mt-2 text-2xl font-black text-white">
                      {loadedSale.saleTokenSymbol}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <StatusPill active={loadedSale.active} tone="cyan">
                      {loadedSale.active ? "Active" : "Closed"}
                    </StatusPill>
                    <StatusPill active={loadedSale.claimOpen} tone="cyan">
                      Claim {loadedSale.claimOpen ? "Open" : "Closed"}
                    </StatusPill>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <InfoCard label="Owner" value={shortAddress(loadedSale.owner)} />
                  <InfoCard label="Fund Receiver" value={shortAddress(loadedSale.fundReceiver)} />
                  <InfoCard label="Sale Token" value={loadedSale.saleToken} mono />
                  <InfoCard
                    label="Access Rule"
                    value={loadedSale.requireKoraxAccess ? "KORAX access required" : "Public sale"}
                  />
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-xs text-white/50">
                    <span>
                      {formatUnitsSafe(loadedSale.totalSold, loadedSale.saleTokenDecimals, 4)} / {formatUnitsSafe(loadedSale.totalForSale, loadedSale.saleTokenDecimals, 4)} {loadedSale.saleTokenSymbol}
                    </span>
                    <span className="font-black text-white">{saleProgress.toFixed(2)}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 via-blue-200 to-cyan-200 transition-all duration-700"
                      style={{ width: `${saleProgress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <InfoCard
                    label="Your Maximum"
                    value={buyerMax > 0n ? `$${formatUnitsSafe(buyerMax, 18, 2)}` : "Contract returned 0"}
                  />
                  <InfoCard
                    label="Remaining Limit"
                    value={buyerMax > 0n ? `$${formatUnitsSafe(buyerRemainingUsd18, 18, 2)}` : "Contract returned 0"}
                  />
                  <InfoCard
                    label="Your Contributed"
                    value={`$${formatUnitsSafe(buyerContributed, 18, 2)}`}
                  />
                  <InfoCard
                    label="Your Purchased"
                    value={`${formatUnitsSafe(buyerPurchased, loadedSale.saleTokenDecimals, 4)} ${loadedSale.saleTokenSymbol}`}
                  />
                </div>

                <div className="mt-5 grid gap-3">
                  <div className="font-black text-white">Sale Stages</div>

                  {loadedSale.stages.map((stage, index) => {
                    const progress = formatPercent(stage.sold, stage.cap);
                    const stageActive = index === currentStageIndex && loadedSale.active;

                    return (
                      <div
                        key={`${index}-${stage.cap.toString()}`}
                        className={[
                          "launch-card-3d rounded-2xl border p-4 text-sm text-white/70",
                          stageActive
                            ? "border-blue-300/25 bg-blue-500/10"
                            : "border-white/10 bg-[#020617]/45",
                        ].join(" ")}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="font-black text-white">Stage {index + 1}</div>
                          <StatusPill active={stageActive} tone="cyan">
                            {stage.sold >= stage.cap ? "Completed" : stageActive ? "Current" : "Pending"}
                          </StatusPill>
                        </div>
                        <div className="mt-2">Price: ${formatUnitsSafe(stage.priceUsd18, 18, 6)}</div>
                        <div className="mt-1">
                          Sold: {formatUnitsSafe(stage.sold, loadedSale.saleTokenDecimals, 4)} / {formatUnitsSafe(stage.cap, loadedSale.saleTokenDecimals, 4)}
                        </div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-200"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 text-xs text-white/35">
                  Last sale update: {lastSaleUpdate || "Waiting"}
                </div>
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-[1fr_160px]">
              <input
                value={buyerForm.paymentAmount}
                onChange={(event) =>
                  setBuyerForm((previous) => ({
                    ...previous,
                    paymentAmount: normalizeDecimalInput(event.target.value),
                  }))
                }
                placeholder="Payment Amount"
                inputMode="decimal"
                className={inputClass}
              />

              <select
                value={buyerForm.payToken}
                onChange={(event) =>
                  setBuyerForm((previous) => ({
                    ...previous,
                    payToken: event.target.value as PaymentKey,
                  }))
                }
                className={selectClass}
              >
                <option value="USDT">USDT</option>
                <option value="USDC">USDC</option>
              </select>
            </div>

            <div className="rounded-2xl border border-blue-300/20 bg-blue-500/10 p-4 text-sm text-white/75">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                Contract Preview
              </div>
              <div className="mt-2 text-2xl font-black text-blue-100">
                {previewLoading
                  ? "Calculating..."
                  : loadedSale
                    ? `${formatUnitsSafe(previewTokens, loadedSale.saleTokenDecimals, 6)} ${loadedSale.saleTokenSymbol}`
                    : "0"}
              </div>
              {previewError ? (
                <div className="mt-3 text-xs leading-6 text-red-200">{previewError}</div>
              ) : null}
            </div>

            {loadedSale?.requireKoraxAccess && !access.hasLaunchAccess ? (
              <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-7 text-amber-100">
                This sale requires KORAX launch access. Your connected wallet is
                not currently eligible.
              </div>
            ) : null}

            {exceedsBuyerLimit ? (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm leading-7 text-red-200">
                The entered amount exceeds your remaining contract limit.
              </div>
            ) : null}

            <button
              type="button"
              onClick={buy}
              disabled={!canBuy}
              className={primaryButtonClass}
            >
              {buying ? `Buying with ${buyerForm.payToken}...` : `Buy with ${buyerForm.payToken}`}
            </button>

            <TransactionStatus message={buyerStatus} txHash={buyerTxHash} />
          </div>
        </SectionBox>

        <SectionBox eyebrow="Claim Console" title="Claim Purchased Tokens">
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            Buyers can claim after the sale owner closes the sale and the
            Launchpad owner opens claim for that sale.
          </p>

          <div className="mt-6 grid gap-4">
            <input
              value={buyerForm.saleId}
              onChange={(event) =>
                setBuyerForm((previous) => ({
                  ...previous,
                  saleId: event.target.value.replace(/\D/g, ""),
                }))
              }
              placeholder="Sale ID"
              inputMode="numeric"
              className={inputClass}
            />

            <div className="rounded-2xl border border-white/10 bg-[#020617]/45 p-5 text-sm text-white/70">
              <div>
                Purchased: <span className="font-black text-white">
                  {loadedSale
                    ? `${formatUnitsSafe(buyerPurchased, loadedSale.saleTokenDecimals, 6)} ${loadedSale.saleTokenSymbol}`
                    : "0"}
                </span>
              </div>
              <div className="mt-2">
                Claim status: <span className="font-black text-white">{loadedSale?.claimOpen ? "Open" : "Closed"}</span>
              </div>
              <div className="mt-2">
                Already claimed: <span className="font-black text-white">{buyerClaimed ? "Yes" : "No"}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => loadSaleById(buyerForm.saleId)}
                disabled={loadingSale || !buyerForm.saleId}
                className={ghostButtonClass}
              >
                Refresh Sale
              </button>

              <button
                type="button"
                onClick={claim}
                disabled={!canClaim}
                className={cyanButtonClass}
              >
                {claiming ? "Claiming..." : "Claim Tokens"}
              </button>
            </div>

            {!buyerClaimed && buyerPurchased <= 0n ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs leading-6 text-white/45">
                Claim becomes available only when this wallet has a purchased
                balance and the selected sale has claim enabled.
              </div>
            ) : null}
          </div>
        </SectionBox>
      </section>

      {canCreateSale ? (
        <SectionBox
          id="creator-console"
          eyebrow="Creator Console"
          title="Create Launch Sale"
          right={<StatusPill active tone="cyan">Creator Access</StatusPill>}
        >
          <p className="mt-2 text-sm leading-relaxed text-white/60">
            The Launchpad contract accepts the sale-token allocation, stage caps,
            USD prices with 18 decimals, fund receiver, and optional KORAX buyer gate.
          </p>

          <div className="mt-6 grid gap-4">
            <input
              value={creatorForm.saleToken}
              onChange={(event) =>
                setCreatorForm((previous) => ({
                  ...previous,
                  saleToken: event.target.value,
                }))
              }
              placeholder="Sale Token Address"
              className={inputClass}
            />

            <input
              value={creatorForm.fundReceiver}
              onChange={(event) =>
                setCreatorForm((previous) => ({
                  ...previous,
                  fundReceiver: event.target.value,
                }))
              }
              placeholder="Fund Receiver / leave empty for your wallet"
              className={inputClass}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <label>
                <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-white/40">
                  Stage Token Caps — one per line
                </div>
                <textarea
                  value={creatorForm.stageCaps}
                  onChange={(event) =>
                    setCreatorForm((previous) => ({
                      ...previous,
                      stageCaps: event.target.value,
                    }))
                  }
                  rows={6}
                  placeholder={"1000000\n1000000\n1000000"}
                  className={inputClass}
                />
              </label>

              <label>
                <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-white/40">
                  Stage USD Prices — one per line
                </div>
                <textarea
                  value={creatorForm.stagePricesUsd}
                  onChange={(event) =>
                    setCreatorForm((previous) => ({
                      ...previous,
                      stagePricesUsd: event.target.value,
                    }))
                  }
                  rows={6}
                  placeholder={"0.01\n0.015\n0.02"}
                  className={inputClass}
                />
              </label>
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#020617]/45 px-4 py-3 text-sm text-white/80">
              <input
                type="checkbox"
                checked={creatorForm.requireKoraxAccess}
                onChange={(event) =>
                  setCreatorForm((previous) => ({
                    ...previous,
                    requireKoraxAccess: event.target.checked,
                  }))
                }
              />
              Require KORAX launch access for buyers
            </label>

            <div className="grid gap-3 md:grid-cols-3">
              <InfoCard
                label="Configured Stages"
                value={parseLines(creatorForm.stageCaps).length}
              />
              <InfoCard
                label="Price Lines"
                value={parseLines(creatorForm.stagePricesUsd).length}
              />
              <InfoCard
                label="Buyer Gate"
                value={creatorForm.requireKoraxAccess ? "Required" : "Public"}
              />
            </div>

            <button
              type="button"
              onClick={createSale}
              disabled={creatingSale}
              className={primaryButtonClass}
            >
              {creatingSale ? "Creating Sale..." : "Approve Allocation & Create Sale"}
            </button>

            <TransactionStatus message={creatorStatus} txHash={creatorTxHash} />
          </div>
        </SectionBox>
      ) : (
        <SectionBox eyebrow="Creator Access" title="Sale Creation Requires Approval">
          <p className="mt-3 text-sm leading-7 text-white/60">
            Public users can discover, buy, and claim. Creating a launch sale is
            limited by the Launchpad contract to its owner and approved sale creators.
          </p>
        </SectionBox>
      )}

      {isLaunchpadOwner ? (
        <SectionBox
          eyebrow="Admin Control"
          title="Admin / Launch Manager"
          right={<StatusPill active tone="cyan">Owner Only</StatusPill>}
        >
          <p className="mt-2 text-sm leading-relaxed text-white/60">
            These transactions modify Launchpad permissions, sale status, claim,
            contribution limits, unsold-token recovery, and anti-bot settings.
          </p>

          <div className="mt-6 grid gap-4">
            <input
              value={adminForm.saleId}
              onChange={(event) =>
                setAdminForm((previous) => ({
                  ...previous,
                  saleId: event.target.value.replace(/\D/g, ""),
                }))
              }
              placeholder="Sale ID"
              inputMode="numeric"
              className={inputClass}
            />

            <div className="grid gap-4 md:grid-cols-[1fr_160px]">
              <input
                value={adminForm.creatorAddress}
                onChange={(event) =>
                  setAdminForm((previous) => ({
                    ...previous,
                    creatorAddress: event.target.value,
                  }))
                }
                placeholder="Creator address"
                className={inputClass}
              />

              <select
                value={adminForm.approved ? "true" : "false"}
                onChange={(event) =>
                  setAdminForm((previous) => ({
                    ...previous,
                    approved: event.target.value === "true",
                  }))
                }
                className={selectClass}
              >
                <option value="true">Approve</option>
                <option value="false">Remove</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => adminAction("approve")}
              disabled={adminBusy}
              className={ghostButtonClass}
            >
              Set Creator Approval
            </button>

            <div className="grid gap-3 md:grid-cols-3">
              <button
                type="button"
                onClick={() => adminAction("close")}
                disabled={adminBusy}
                className={dangerButtonClass}
              >
                Close Sale
              </button>

              <button
                type="button"
                onClick={() => adminAction("claim")}
                disabled={adminBusy}
                className={cyanButtonClass}
              >
                Apply Claim Status
              </button>

              <select
                value={adminForm.claimOpen ? "true" : "false"}
                onChange={(event) =>
                  setAdminForm((previous) => ({
                    ...previous,
                    claimOpen: event.target.value === "true",
                  }))
                }
                className={selectClass}
              >
                <option value="true">Claim Open</option>
                <option value="false">Claim Closed</option>
              </select>
            </div>

            <input
              value={adminForm.unsoldReceiver}
              onChange={(event) =>
                setAdminForm((previous) => ({
                  ...previous,
                  unsoldReceiver: event.target.value,
                }))
              }
              placeholder="Unsold receiver / leave empty for your wallet"
              className={inputClass}
            />

            <button
              type="button"
              onClick={() => adminAction("unsold")}
              disabled={adminBusy}
              className={ghostButtonClass}
            >
              Withdraw Unsold Tokens
            </button>

            <div className="grid gap-4 md:grid-cols-3">
              {(["level1Limit", "level2Limit", "level3Limit"] as const).map(
                (key, index) => (
                  <input
                    key={key}
                    value={adminForm[key]}
                    onChange={(event) =>
                      setAdminForm((previous) => ({
                        ...previous,
                        [key]: normalizeDecimalInput(event.target.value),
                      }))
                    }
                    placeholder={`Level ${index + 1} USD`}
                    inputMode="decimal"
                    className={inputClass}
                  />
                )
              )}
            </div>

            <button
              type="button"
              onClick={() => adminAction("limits")}
              disabled={adminBusy}
              className={ghostButtonClass}
            >
              Update Contribution Limits
            </button>

            <div className="grid gap-4 md:grid-cols-[1fr_180px]">
              <select
                value={adminForm.antiBotEnabled ? "true" : "false"}
                onChange={(event) =>
                  setAdminForm((previous) => ({
                    ...previous,
                    antiBotEnabled: event.target.value === "true",
                  }))
                }
                className={selectClass}
              >
                <option value="true">Anti-Bot On</option>
                <option value="false">Anti-Bot Off</option>
              </select>

              <input
                value={adminForm.cooldown}
                onChange={(event) =>
                  setAdminForm((previous) => ({
                    ...previous,
                    cooldown: event.target.value.replace(/\D/g, ""),
                  }))
                }
                placeholder="Cooldown seconds"
                inputMode="numeric"
                className={inputClass}
              />
            </div>

            <button
              type="button"
              onClick={() => adminAction("antibot")}
              disabled={adminBusy}
              className={ghostButtonClass}
            >
              Update Anti-Bot
            </button>

            <TransactionStatus message={adminStatus} txHash={adminTxHash} />
          </div>
        </SectionBox>
      ) : null}

      <SectionBox eyebrow="Contract Transparency" title="Configured Launch Infrastructure">
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <InfoCard label="Launchpad" value={LAUNCHPAD_ADDRESS || "Missing"} mono />
          <InfoCard label="Access Manager" value={ACCESS_MANAGER_ADDRESS || "Missing"} mono />
          <InfoCard label="USDT" value={USDT_ADDRESS || "Missing"} mono />
          <InfoCard label="USDC" value={USDC_ADDRESS || "Missing"} mono />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {LAUNCHPAD_ADDRESS ? (
            <a
              href={`${BSC_SCAN_URL}/address/${LAUNCHPAD_ADDRESS}#code`}
              target="_blank"
              rel="noopener noreferrer"
              className={cyanButtonClass}
            >
              Verify Launchpad ↗
            </a>
          ) : null}

          {ACCESS_MANAGER_ADDRESS ? (
            <a
              href={`${BSC_SCAN_URL}/address/${ACCESS_MANAGER_ADDRESS}#code`}
              target="_blank"
              rel="noopener noreferrer"
              className={ghostButtonClass}
            >
              Verify Access Manager ↗
            </a>
          ) : null}
        </div>
      </SectionBox>

      <section className="relative overflow-hidden rounded-[42px] border border-blue-400/25 bg-[#050a18] p-6 shadow-[0_35px_130px_rgba(0,0,0,0.55)] sm:p-9 lg:p-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(37,99,235,0.22),transparent_38%),radial-gradient(circle_at_right,rgba(34,211,238,0.11),transparent_34%)]" />

        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-3xl">
            <div className="text-xs font-black uppercase tracking-[0.3em] text-blue-100">
              KORAX Launch Infrastructure
            </div>
            <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-5xl">
              Build the project, publish the website, then launch on-chain.
            </h2>
            <p className="mt-5 text-sm leading-8 text-white/60 sm:text-base">
              KORAX connects project creation, website generation, public registry,
              staged token sales, staking-based access, and controlled claims.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/ai" className={primaryButtonClass}>
              Token Builder AI
            </Link>
            <Link href="/website-builder-ai" className={cyanButtonClass}>
              Website Builder AI
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-amber-300/15 bg-amber-300/[0.045] px-5 py-4 text-xs leading-6 text-white/45">
        <span className="font-black text-amber-100">Launch and security notice:</span>{" "}
        KORAX launch participation involves crypto assets and smart contracts.
        Project registration does not constitute an audit, endorsement, guarantee,
        or promise of profit. Review project information, contract addresses,
        allocation limits, token approvals, claim conditions, and wallet
        transactions before confirmation. Blockchain transactions are generally
        irreversible.
      </section>
    </div>
  );
}