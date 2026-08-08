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

const launchpadAbi = [
  "function PROJECT() view returns (string)",
  "function MODULE() view returns (string)",
  "function BUILD() view returns (uint256)",
  "function owner() view returns (address)",
  "function USDT() view returns (address)",
  "function USDC() view returns (address)",
  "function USDT_DECIMALS() view returns (uint8)",
  "function USDC_DECIMALS() view returns (uint8)",
  "function accessManager() view returns (address)",
  "function nextSaleId() view returns (uint256)",
  "function approvedSaleCreators(address) view returns (bool)",
  "function globalPaused() view returns (bool)",
  "function antiBotEnabled() view returns (bool)",
  "function buyCooldown() view returns (uint256)",
  "function level1ContributionLimitUsd18() view returns (uint256)",
  "function level2ContributionLimitUsd18() view returns (uint256)",
  "function level3ContributionLimitUsd18() view returns (uint256)",
  "function sales(uint256) view returns (address owner,address saleToken,address fundReceiver,uint8 saleTokenDecimals,uint64 startTime,uint64 endTime,uint256 totalForSale,uint256 totalSold,uint256 softCapUsd18,uint256 hardCapUsd18,uint256 totalRaisedUsd18,bool active,bool paused,bool finalized,bool successful,bool cancelled,bool claimOpen,bool proceedsWithdrawn,bool saleTokensWithdrawn,bool requireKoraxAccess)",
  "function stagesCount(uint256 saleId) view returns (uint256)",
  "function getStage(uint256 saleId,uint256 index) view returns (tuple(uint256 cap,uint256 priceUsd18,uint256 sold))",
  "function getSaleFunds(uint256 saleId) view returns (tuple(uint256 totalRaisedUSDT,uint256 totalRaisedUSDC,uint256 escrowUSDT,uint256 escrowUSDC))",
  "function getSaleLimits(uint256 saleId) view returns (tuple(uint256 level1Usd18,uint256 level2Usd18,uint256 level3Usd18))",
  "function isSaleLive(uint256 saleId) view returns (bool)",
  "function canFinalize(uint256 saleId) view returns (bool)",
  "function currentStage(uint256 saleId) view returns (uint256)",
  "function stageRemaining(uint256 saleId,uint256 index) view returns (uint256)",
  "function maxContributionOf(uint256 saleId,address user) view returns (uint256)",
  "function contributedUsd18(uint256 saleId,address user) view returns (uint256)",
  "function contributedUSDT(uint256 saleId,address user) view returns (uint256)",
  "function contributedUSDC(uint256 saleId,address user) view returns (uint256)",
  "function purchased(uint256 saleId,address user) view returns (uint256)",
  "function claimed(uint256 saleId,address user) view returns (bool)",
  "function refunded(uint256 saleId,address user) view returns (bool)",
  "function lastBuyAt(uint256 saleId,address user) view returns (uint256)",
  "function previewTokensForUSDT(uint256 saleId,uint256 maxPaymentAmount) view returns (uint256 tokensOut)",
  "function previewTokensForUSDC(uint256 saleId,uint256 maxPaymentAmount) view returns (uint256 tokensOut)",
  "function quoteUSDT(uint256 saleId,uint256 maxPaymentAmount) view returns (uint256 tokensOut,uint256 paymentUsed,uint256 usdValue18)",
  "function quoteUSDC(uint256 saleId,uint256 maxPaymentAmount) view returns (uint256 tokensOut,uint256 paymentUsed,uint256 usdValue18)",
  "function createSale(address saleToken,address fundReceiver,uint256[] stageCaps,uint256[] stagePricesUsd18,uint256 softCapUsd18,uint64 startTime,uint64 endTime,bool requireKoraxAccess) returns (uint256 saleId)",
  "function buyWithUSDT(uint256 saleId,uint256 maxPaymentAmount,uint256 minTokensOut,uint256 deadline)",
  "function buyWithUSDC(uint256 saleId,uint256 maxPaymentAmount,uint256 minTokensOut,uint256 deadline)",
  "function claim(uint256 saleId)",
  "function refund(uint256 saleId)",
  "function finalizeSale(uint256 saleId)",
  "function cancelSale(uint256 saleId)",
  "function withdrawProceeds(uint256 saleId)",
  "function withdrawSaleTokens(uint256 saleId)",
  "function setSaleCreatorApproval(address account,bool approved)",
  "function setAccessManager(address newAccessManager)",
  "function setGlobalPaused(bool paused)",
  "function setSalePaused(uint256 saleId,bool paused)",
  "function setAntiBot(bool enabled,uint256 cooldownSeconds)",
  "function setContributionLimits(uint256 level1Usd18,uint256 level2Usd18,uint256 level3Usd18)",
  "event SaleCreated(uint256 indexed saleId,address indexed owner,address indexed saleToken,address fundReceiver,uint256 totalForSale,uint256 softCapUsd18,uint256 hardCapUsd18,uint64 startTime,uint64 endTime,bool requireKoraxAccess)",
  "event Bought(uint256 indexed saleId,address indexed buyer,address indexed paymentToken,uint256 paymentAmount,uint256 usdValue18,uint256 tokenAmount)",
  "event SaleFinalized(uint256 indexed saleId,bool successful,uint256 totalRaisedUsd18,uint256 softCapUsd18)",
  "event Claimed(uint256 indexed saleId,address indexed user,uint256 amount)",
  "event Refunded(uint256 indexed saleId,address indexed user,uint256 usdtAmount,uint256 usdcAmount)",
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
  startTime: number;
  endTime: number;
  totalForSale: bigint;
  totalSold: bigint;
  softCapUsd18: bigint;
  hardCapUsd18: bigint;
  totalRaisedUsd18: bigint;
  active: boolean;
  paused: boolean;
  finalized: boolean;
  successful: boolean;
  cancelled: boolean;
  claimOpen: boolean;
  proceedsWithdrawn: boolean;
  saleTokensWithdrawn: boolean;
  requireKoraxAccess: boolean;
  live: boolean;
  canFinalize: boolean;
  currentStage: number;
  funds: {
    totalRaisedUSDT: bigint;
    totalRaisedUSDC: bigint;
    escrowUSDT: bigint;
    escrowUSDC: bigint;
  };
  limits: {
    level1Usd18: bigint;
    level2Usd18: bigint;
    level3Usd18: bigint;
  };
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

function isNonNegativeDecimal(value: string) {
  const normalized = value.trim();
  if (!/^(?:\d+\.?\d*|\.\d+)$/.test(normalized)) return false;
  const numberValue = Number(normalized);
  return Number.isFinite(numberValue) && numberValue >= 0;
}

function safeParseNonNegativeUnits(value: string, decimals: number) {
  try {
    if (!isNonNegativeDecimal(value)) return 0n;
    return ethers.parseUnits(value.trim(), decimals);
  } catch {
    return 0n;
  }
}

function parseDateTimeToUnix(
  value: string,
  label: string,
  allowImmediate = false
) {
  const normalized = value.trim();

  if (!normalized) {
    if (allowImmediate) return 0;
    throw new Error(`${label} is required.`);
  }

  const milliseconds = new Date(normalized).getTime();

  if (!Number.isFinite(milliseconds)) {
    throw new Error(`${label} is invalid.`);
  }

  const unix = Math.floor(milliseconds / 1000);

  if (!Number.isSafeInteger(unix) || unix <= 0) {
    throw new Error(`${label} is invalid.`);
  }

  return unix;
}

function formatUnixDate(unixSeconds: number) {
  if (!unixSeconds) return "Immediate";

  return new Date(unixSeconds * 1000).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function mulDivUp(x: bigint, y: bigint, denominator: bigint) {
  if (denominator <= 0n) {
    throw new Error("Invalid division denominator.");
  }

  const product = x * y;
  return (product + denominator - 1n) / denominator;
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

async function waitForReceipt(
  transaction: ethers.ContractTransactionResponse
): Promise<ethers.TransactionReceipt> {
  const receipt = await transaction.wait();

  if (!receipt) {
    throw new Error(
      "The transaction was submitted, but no confirmation receipt was returned."
    );
  }

  return receipt;
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
    softCapUsd: "0",
    startTime: "",
    endTime: "",
    requireKoraxAccess: true,
  });

  const [adminForm, setAdminForm] = useState({
    saleId: "0",
    creatorAddress: "",
    approved: true,
    globalPaused: false,
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
    slippagePercent: string;
    deadlineMinutes: string;
  }>({
    saleId: "0",
    paymentAmount: "10",
    payToken: "USDT",
    slippagePercent: "1",
    deadlineMinutes: "15",
  });

  const [creatorStatus, setCreatorStatus] = useState("");
  const [creatorTxHash, setCreatorTxHash] = useState("");
  const [adminStatus, setAdminStatus] = useState("");
  const [adminTxHash, setAdminTxHash] = useState("");
  const [saleManagerStatus, setSaleManagerStatus] = useState("");
  const [saleManagerTxHash, setSaleManagerTxHash] = useState("");
  const [buyerStatus, setBuyerStatus] = useState("");
  const [buyerTxHash, setBuyerTxHash] = useState("");

  const [creatingSale, setCreatingSale] = useState(false);
  const [adminBusy, setAdminBusy] = useState(false);
  const [saleManagerBusy, setSaleManagerBusy] = useState(false);
  const [loadingSale, setLoadingSale] = useState(false);
  const [buying, setBuying] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [refunding, setRefunding] = useState(false);

  const [loadedSaleId, setLoadedSaleId] = useState("");
  const [loadedSale, setLoadedSale] = useState<LoadedSale | null>(null);
  const [buyerMax, setBuyerMax] = useState<bigint>(0n);
  const [buyerPurchased, setBuyerPurchased] = useState<bigint>(0n);
  const [buyerContributed, setBuyerContributed] = useState<bigint>(0n);
  const [buyerContributedUSDT, setBuyerContributedUSDT] = useState<bigint>(0n);
  const [buyerContributedUSDC, setBuyerContributedUSDC] = useState<bigint>(0n);
  const [buyerClaimed, setBuyerClaimed] = useState(false);
  const [buyerRefunded, setBuyerRefunded] = useState(false);
  const [previewTokens, setPreviewTokens] = useState<bigint>(0n);
  const [previewPaymentUsed, setPreviewPaymentUsed] = useState<bigint>(0n);
  const [previewUsdValue18, setPreviewUsdValue18] = useState<bigint>(0n);
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

  const canCreateSale = isApprovedCreator;
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

  const currentStageIndex = loadedSale ? loadedSale.currentStage : -1;

  const buyerRemainingUsd18 =
    buyerMax > buyerContributed ? buyerMax - buyerContributed : 0n;

  const exceedsBuyerLimit =
    buyerMax > 0n && previewUsdValue18 > buyerRemainingUsd18;

  const participationAccessReady =
    !loadedSale?.requireKoraxAccess || access.hasLaunchAccess;

  const connectedIsSaleOwner =
    Boolean(address && loadedSale?.owner) &&
    loadedSale!.owner.toLowerCase() === address!.toLowerCase();

  const canManageLoadedSale =
    Boolean(loadedSale) && (connectedIsSaleOwner || isLaunchpadOwner);

  const totalBuyerStableContribution =
    buyerContributedUSDT + buyerContributedUSDC;

  const canBuy =
    loadedSaleMatchesInput &&
    Boolean(loadedSale?.live) &&
    isPositiveDecimal(buyerForm.paymentAmount) &&
    previewTokens > 0n &&
    previewPaymentUsed > 0n &&
    participationAccessReady &&
    !exceedsBuyerLimit &&
    !buying;

  const canClaim =
    loadedSaleMatchesInput &&
    Boolean(
      loadedSale?.finalized &&
        loadedSale.successful &&
        loadedSale.claimOpen
    ) &&
    buyerPurchased > 0n &&
    !buyerClaimed &&
    !claiming;

  const canRefund =
    loadedSaleMatchesInput &&
    Boolean(loadedSale?.finalized && !loadedSale.successful) &&
    totalBuyerStableContribution > 0n &&
    !buyerRefunded &&
    !refunding;

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
      if (!LAUNCHPAD_ADDRESS) {
        setIsLaunchpadOwner(false);
        setIsApprovedCreator(false);
        throw new Error("Launchpad address is missing.");
      }

      const provider = await getReadProvider();
      await validateContract(provider, LAUNCHPAD_ADDRESS, "Launchpad");

      const launchpad = new ethers.Contract(
        LAUNCHPAD_ADDRESS,
        launchpadAbi,
        provider
      );

      const [
        ownerRaw,
        approvedRaw,
        globalPausedRaw,
        antiBotEnabledRaw,
        cooldownRaw,
        level1Raw,
        level2Raw,
        level3Raw,
      ] = await Promise.all([
        launchpad.owner(),
        user ? launchpad.approvedSaleCreators(user) : Promise.resolve(false),
        launchpad.globalPaused(),
        launchpad.antiBotEnabled(),
        launchpad.buyCooldown(),
        launchpad.level1ContributionLimitUsd18(),
        launchpad.level2ContributionLimitUsd18(),
        launchpad.level3ContributionLimitUsd18(),
      ]);

      setIsLaunchpadOwner(
        Boolean(user) &&
          String(ownerRaw).toLowerCase() === String(user).toLowerCase()
      );
      setIsApprovedCreator(Boolean(user) && Boolean(approvedRaw));

      setAdminForm((previous) => ({
        ...previous,
        globalPaused: Boolean(globalPausedRaw),
        antiBotEnabled: Boolean(antiBotEnabledRaw),
        cooldown: cooldownRaw.toString(),
        level1Limit: ethers.formatUnits(level1Raw, 18),
        level2Limit: ethers.formatUnits(level2Raw, 18),
        level3Limit: ethers.formatUnits(level3Raw, 18),
      }));
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
        setPreviewPaymentUsed(0n);
        setPreviewUsdValue18(0n);
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

      const quote =
        buyerForm.payToken === "USDC"
          ? await launchpad.quoteUSDC(saleId, paymentAmount)
          : await launchpad.quoteUSDT(saleId, paymentAmount);

      if (requestId !== previewRequestIdRef.current) return;

      const tokensOutRaw = quote.tokensOut ?? quote[0];
      const paymentUsedRaw = quote.paymentUsed ?? quote[1];
      const usdValueRaw = quote.usdValue18 ?? quote[2];

      setPreviewTokens(BigInt(tokensOutRaw.toString()));
      setPreviewPaymentUsed(BigInt(paymentUsedRaw.toString()));
      setPreviewUsdValue18(BigInt(usdValueRaw.toString()));
    } catch (error) {
      if (requestId !== previewRequestIdRef.current) return;

      setPreviewTokens(0n);
      setPreviewPaymentUsed(0n);
      setPreviewUsdValue18(0n);
      setPreviewError(
        getErrorMessage(error, "The token quote could not be calculated.")
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

      const saleRaw = await launchpad.sales(saleId);
      const saleOwnerRaw = saleRaw?.owner ?? saleRaw?.[0];

      if (
        !saleOwnerRaw ||
        String(saleOwnerRaw).toLowerCase() === ZERO_ADDRESS
      ) {
        throw new Error(`Sale #${saleId.toString()} was not found.`);
      }

      const [
        countRaw,
        fundsRaw,
        limitsRaw,
        liveRaw,
        canFinalizeRaw,
        currentStageRaw,
      ] = await Promise.all([
        launchpad.stagesCount(saleId),
        launchpad.getSaleFunds(saleId),
        launchpad.getSaleLimits(saleId),
        launchpad.isSaleLive(saleId),
        launchpad.canFinalize(saleId),
        launchpad.currentStage(saleId),
      ]);

      const stageCount = Number(countRaw);

      if (!Number.isSafeInteger(stageCount) || stageCount < 1 || stageCount > 10) {
        throw new Error("The sale contains an invalid number of stages.");
      }

      const stages = await Promise.all(
        Array.from({ length: stageCount }, async (_, index) => {
          const stageRaw = await launchpad.getStage(saleId, index);

          return {
            cap: BigInt((stageRaw.cap ?? stageRaw[0]).toString()),
            priceUsd18: BigInt(
              (stageRaw.priceUsd18 ?? stageRaw[1]).toString()
            ),
            sold: BigInt((stageRaw.sold ?? stageRaw[2]).toString()),
          } satisfies LoadedStage;
        })
      );

      const field = (name: string, index: number) =>
        saleRaw?.[name] ?? saleRaw?.[index];

      const saleTokenAddress = String(field("saleToken", 1));
      const saleTokenDecimals = Number(field("saleTokenDecimals", 3));
      let saleTokenSymbol = "TOKEN";

      try {
        const saleToken = new ethers.Contract(
          saleTokenAddress,
          FULL_ERC20_ABI,
          provider
        );
        saleTokenSymbol = String(await saleToken.symbol());
      } catch {
        saleTokenSymbol = "TOKEN";
      }

      const currentStageNumber = Number(currentStageRaw);

      const sale: LoadedSale = {
        owner: String(field("owner", 0)),
        saleToken: saleTokenAddress,
        saleTokenSymbol,
        fundReceiver: String(field("fundReceiver", 2)),
        saleTokenDecimals,
        startTime: Number(field("startTime", 4)),
        endTime: Number(field("endTime", 5)),
        totalForSale: BigInt(field("totalForSale", 6).toString()),
        totalSold: BigInt(field("totalSold", 7).toString()),
        softCapUsd18: BigInt(field("softCapUsd18", 8).toString()),
        hardCapUsd18: BigInt(field("hardCapUsd18", 9).toString()),
        totalRaisedUsd18: BigInt(field("totalRaisedUsd18", 10).toString()),
        active: Boolean(field("active", 11)),
        paused: Boolean(field("paused", 12)),
        finalized: Boolean(field("finalized", 13)),
        successful: Boolean(field("successful", 14)),
        cancelled: Boolean(field("cancelled", 15)),
        claimOpen: Boolean(field("claimOpen", 16)),
        proceedsWithdrawn: Boolean(field("proceedsWithdrawn", 17)),
        saleTokensWithdrawn: Boolean(field("saleTokensWithdrawn", 18)),
        requireKoraxAccess: Boolean(field("requireKoraxAccess", 19)),
        live: Boolean(liveRaw),
        canFinalize: Boolean(canFinalizeRaw),
        currentStage:
          currentStageNumber >= 0 && currentStageNumber < stageCount
            ? currentStageNumber
            : -1,
        funds: {
          totalRaisedUSDT: BigInt(
            (fundsRaw.totalRaisedUSDT ?? fundsRaw[0]).toString()
          ),
          totalRaisedUSDC: BigInt(
            (fundsRaw.totalRaisedUSDC ?? fundsRaw[1]).toString()
          ),
          escrowUSDT: BigInt(
            (fundsRaw.escrowUSDT ?? fundsRaw[2]).toString()
          ),
          escrowUSDC: BigInt(
            (fundsRaw.escrowUSDC ?? fundsRaw[3]).toString()
          ),
        },
        limits: {
          level1Usd18: BigInt(
            (limitsRaw.level1Usd18 ?? limitsRaw[0]).toString()
          ),
          level2Usd18: BigInt(
            (limitsRaw.level2Usd18 ?? limitsRaw[1]).toString()
          ),
          level3Usd18: BigInt(
            (limitsRaw.level3Usd18 ?? limitsRaw[2]).toString()
          ),
        },
        stages,
      };

      setLoadedSale(sale);
      setLoadedSaleId(saleId.toString());
      setBuyerForm((previous) => ({
        ...previous,
        saleId: saleId.toString(),
      }));
      setAdminForm((previous) => ({
        ...previous,
        saleId: saleId.toString(),
      }));

      if (address) {
        const [
          maxRaw,
          contributedRaw,
          contributedUSDTRaw,
          contributedUSDCRaw,
          purchasedRaw,
          claimedRaw,
          refundedRaw,
        ] = await Promise.all([
          launchpad.maxContributionOf(saleId, address),
          launchpad.contributedUsd18(saleId, address),
          launchpad.contributedUSDT(saleId, address),
          launchpad.contributedUSDC(saleId, address),
          launchpad.purchased(saleId, address),
          launchpad.claimed(saleId, address),
          launchpad.refunded(saleId, address),
        ]);

        setBuyerMax(BigInt(maxRaw.toString()));
        setBuyerContributed(BigInt(contributedRaw.toString()));
        setBuyerContributedUSDT(BigInt(contributedUSDTRaw.toString()));
        setBuyerContributedUSDC(BigInt(contributedUSDCRaw.toString()));
        setBuyerPurchased(BigInt(purchasedRaw.toString()));
        setBuyerClaimed(Boolean(claimedRaw));
        setBuyerRefunded(Boolean(refundedRaw));
      } else {
        setBuyerMax(0n);
        setBuyerContributed(0n);
        setBuyerContributedUSDT(0n);
        setBuyerContributedUSDC(0n);
        setBuyerPurchased(0n);
        setBuyerClaimed(false);
        setBuyerRefunded(false);
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
        setBuyerContributedUSDT(0n);
        setBuyerContributedUSDC(0n);
        setBuyerPurchased(0n);
        setBuyerClaimed(false);
        setBuyerRefunded(false);
        setPreviewTokens(0n);
        setPreviewPaymentUsed(0n);
        setPreviewUsdValue18(0n);
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
          "This wallet is not approved by the Launchpad contract to create sales."
        );
      }

      const signer = await getBrowserSigner();
      const creator = await signer.getAddress();
      const provider = signer.provider;

      if (!creatorForm.saleToken.trim()) {
        throw new Error("Sale token address is required.");
      }

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

      if (
        !Number.isSafeInteger(saleDecimals) ||
        saleDecimals < 0 ||
        saleDecimals > 18
      ) {
        throw new Error("The sale token must use between 0 and 18 decimals.");
      }

      const caps = parsePositiveLines(creatorForm.stageCaps, "Stage caps");
      const prices = parsePositiveLines(
        creatorForm.stagePricesUsd,
        "Stage prices"
      );

      if (caps.length !== prices.length) {
        throw new Error(
          "Stage caps and prices must contain the same number of lines."
        );
      }

      if (caps.length > 10) {
        throw new Error("A launch sale can contain a maximum of 10 stages.");
      }

      if (!isNonNegativeDecimal(creatorForm.softCapUsd)) {
        throw new Error("Soft cap must be a valid non-negative USD amount.");
      }

      const stageCaps = caps.map((value) =>
        ethers.parseUnits(value, saleDecimals)
      );
      const stagePricesUsd18 = prices.map((value) =>
        ethers.parseUnits(value, 18)
      );
      const softCapUsd18 = safeParseNonNegativeUnits(
        creatorForm.softCapUsd,
        18
      );
      const totalForSale = stageCaps.reduce(
        (total, value) => total + value,
        0n
      );
      const saleUnit = 10n ** BigInt(saleDecimals);
      const hardCapUsd18 = stageCaps.reduce(
        (total, cap, index) =>
          total + mulDivUp(cap, stagePricesUsd18[index], saleUnit),
        0n
      );

      if (totalForSale <= 0n) {
        throw new Error("Total sale allocation must be greater than zero.");
      }

      if (softCapUsd18 > hardCapUsd18) {
        throw new Error(
          `Soft cap cannot exceed the calculated hard cap of $${formatUnitsSafe(
            hardCapUsd18,
            18,
            6
          )}.`
        );
      }

      const startTime = parseDateTimeToUnix(
        creatorForm.startTime,
        "Start time",
        true
      );
      const endTime = parseDateTimeToUnix(
        creatorForm.endTime,
        "End time"
      );
      const now = Math.floor(Date.now() / 1000);
      const effectiveStart = startTime === 0 ? now : startTime;

      if (startTime !== 0 && startTime < now + 60) {
        throw new Error(
          "Choose a start time at least one minute in the future, or leave it empty to start immediately."
        );
      }

      if (endTime <= effectiveStart) {
        throw new Error("End time must be later than the effective start time.");
      }

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
        setCreatorStatus(
          "Approve the complete sale-token allocation in your wallet..."
        );

        const approvalTransaction = await saleToken.approve(
          LAUNCHPAD_ADDRESS,
          totalForSale
        );

        setCreatorStatus(
          "Sale-token approval submitted. Waiting for confirmation..."
        );
        await waitForReceipt(approvalTransaction);
      }

      const launchpad = new ethers.Contract(
        LAUNCHPAD_ADDRESS,
        launchpadAbi,
        signer
      );

      setCreatorStatus("Confirm the BUILD 3 launch-sale transaction...");

      const transaction = await launchpad.createSale(
        saleTokenAddress,
        fundReceiver,
        stageCaps,
        stagePricesUsd18,
        softCapUsd18,
        startTime,
        endTime,
        creatorForm.requireKoraxAccess
      );

      setCreatorStatus("Launch sale submitted. Waiting for confirmation...");

      const receipt = await waitForReceipt(transaction);
      let createdSaleId = "";

      for (const log of receipt.logs) {
        try {
          const parsed = launchpad.interface.parseLog({
            topics: [...log.topics],
            data: log.data,
          });

          if (parsed?.name !== "SaleCreated") continue;

          const candidate = parsed.args?.saleId ?? parsed.args?.[0];

          if (candidate !== undefined && candidate !== null) {
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

      if (!loadedSale.live) {
        throw new Error(
          "This sale is not currently live. Check its start time, pause state, finalization state, or end time."
        );
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

      if (!isPositiveDecimal(buyerForm.paymentAmount)) {
        throw new Error("Enter a valid positive payment amount.");
      }

      if (!isNonNegativeDecimal(buyerForm.slippagePercent)) {
        throw new Error("Slippage must be a valid non-negative percentage.");
      }

      const slippageBps = ethers.parseUnits(
        buyerForm.slippagePercent.trim(),
        2
      );

      if (slippageBps > 2_000n) {
        throw new Error("Slippage cannot exceed 20%.");
      }

      if (!isNonNegativeInteger(buyerForm.deadlineMinutes)) {
        throw new Error("Deadline minutes must be a whole number.");
      }

      const deadlineMinutes = BigInt(buyerForm.deadlineMinutes);

      if (deadlineMinutes < 1n || deadlineMinutes > 120n) {
        throw new Error("Deadline must be between 1 and 120 minutes.");
      }

      const maxPaymentAmount = ethers.parseUnits(
        buyerForm.paymentAmount,
        currentPaymentAsset.decimals
      );

      if (maxPaymentAmount <= 0n) {
        throw new Error("Enter a valid positive payment amount.");
      }

      const signer = await getBrowserSigner();
      const buyer = await signer.getAddress();
      const saleId = parseSaleId(buyerForm.saleId);

      await validateContract(
        signer.provider,
        currentPaymentAsset.address,
        buyerForm.payToken
      );

      const launchpad = new ethers.Contract(
        LAUNCHPAD_ADDRESS,
        launchpadAbi,
        signer
      );

      const liveNow = await launchpad.isSaleLive(saleId);

      if (!liveNow) {
        throw new Error("The sale is no longer live.");
      }

      const freshQuote =
        buyerForm.payToken === "USDC"
          ? await launchpad.quoteUSDC(saleId, maxPaymentAmount)
          : await launchpad.quoteUSDT(saleId, maxPaymentAmount);

      const quotedTokens = BigInt(
        (freshQuote.tokensOut ?? freshQuote[0]).toString()
      );
      const quotedPaymentUsed = BigInt(
        (freshQuote.paymentUsed ?? freshQuote[1]).toString()
      );
      const quotedUsdValue = BigInt(
        (freshQuote.usdValue18 ?? freshQuote[2]).toString()
      );

      if (quotedTokens <= 0n || quotedPaymentUsed <= 0n) {
        throw new Error("The contract quote returned zero output.");
      }

      const maxAllowedRaw = await launchpad.maxContributionOf(saleId, buyer);
      const alreadyContributedRaw = await launchpad.contributedUsd18(
        saleId,
        buyer
      );
      const maxAllowed = BigInt(maxAllowedRaw.toString());
      const alreadyContributed = BigInt(alreadyContributedRaw.toString());
      const remainingAllowed =
        maxAllowed > alreadyContributed
          ? maxAllowed - alreadyContributed
          : 0n;

      if (maxAllowed <= 0n) {
        throw new Error("This wallet has no contribution access for the sale.");
      }

      if (quotedUsdValue > remainingAllowed) {
        throw new Error(
          `This purchase exceeds your remaining limit of $${formatUnitsSafe(
            remainingAllowed,
            18,
            2
          )}.`
        );
      }

      const paymentToken = new ethers.Contract(
        currentPaymentAsset.address,
        FULL_ERC20_ABI,
        signer
      );

      const balanceRaw = await paymentToken.balanceOf(buyer);
      const balance = BigInt(balanceRaw.toString());

      if (balance < quotedPaymentUsed) {
        throw new Error(
          `Insufficient ${buyerForm.payToken} balance for the quoted payment.`
        );
      }

      const allowanceRaw = await paymentToken.allowance(
        buyer,
        LAUNCHPAD_ADDRESS
      );
      const allowance = BigInt(allowanceRaw.toString());

      if (allowance < maxPaymentAmount) {
        setBuyerStatus(`Approve ${buyerForm.payToken} in your wallet...`);

        const approvalTransaction = await paymentToken.approve(
          LAUNCHPAD_ADDRESS,
          maxPaymentAmount
        );

        setBuyerStatus(
          `${buyerForm.payToken} approval submitted. Waiting for confirmation...`
        );
        await waitForReceipt(approvalTransaction);
      }

      const minTokensOut =
        (quotedTokens * (10_000n - slippageBps)) / 10_000n;
      const safeMinTokensOut = minTokensOut > 0n ? minTokensOut : 1n;
      const deadline =
        BigInt(Math.floor(Date.now() / 1000)) + deadlineMinutes * 60n;

      setBuyerStatus(
        `Confirm the ${buyerForm.payToken} purchase. Minimum output: ${formatUnitsSafe(
          safeMinTokensOut,
          loadedSale.saleTokenDecimals,
          6
        )} ${loadedSale.saleTokenSymbol}.`
      );

      const transaction =
        buyerForm.payToken === "USDC"
          ? await launchpad.buyWithUSDC(
              saleId,
              maxPaymentAmount,
              safeMinTokensOut,
              deadline
            )
          : await launchpad.buyWithUSDT(
              saleId,
              maxPaymentAmount,
              safeMinTokensOut,
              deadline
            );

      setBuyerStatus(
        "Purchase submitted. Waiting for blockchain confirmation..."
      );

      const receipt = await waitForReceipt(transaction);

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

      if (!loadedSale.finalized || !loadedSale.successful) {
        throw new Error("Only a finalized successful sale can be claimed.");
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

      setBuyerStatus(
        "Claim submitted. Waiting for blockchain confirmation..."
      );

      const receipt = await waitForReceipt(transaction);

      setBuyerTxHash(receipt.hash);
      setBuyerStatus("Claim completed successfully.");
      await loadSaleById(saleId.toString(), true);
    } catch (error) {
      setBuyerStatus(getErrorMessage(error, "Claim failed."));
    } finally {
      setClaiming(false);
    }
  }

  async function refund() {
    if (refunding) return;

    setRefunding(true);
    setBuyerStatus("");
    setBuyerTxHash("");

    try {
      if (!loadedSale || !loadedSaleMatchesInput) {
        throw new Error("Load the selected sale before requesting a refund.");
      }

      if (!loadedSale.finalized || loadedSale.successful) {
        throw new Error(
          "Refunds are available only after an unsuccessful sale is finalized."
        );
      }

      if (buyerRefunded) {
        throw new Error("This wallet has already received its refund.");
      }

      if (totalBuyerStableContribution <= 0n) {
        throw new Error("This wallet has no refundable contribution.");
      }

      const signer = await getBrowserSigner();
      const launchpad = new ethers.Contract(
        LAUNCHPAD_ADDRESS,
        launchpadAbi,
        signer
      );
      const saleId = parseSaleId(buyerForm.saleId);

      setBuyerStatus("Confirm the refund transaction in your wallet...");

      const transaction = await launchpad.refund(saleId);

      setBuyerStatus(
        "Refund submitted. Waiting for blockchain confirmation..."
      );

      const receipt = await waitForReceipt(transaction);

      setBuyerTxHash(receipt.hash);
      setBuyerStatus("Refund completed successfully.");
      await loadSaleById(saleId.toString(), true);
    } catch (error) {
      setBuyerStatus(getErrorMessage(error, "Refund failed."));
    } finally {
      setRefunding(false);
    }
  }

  async function adminAction(
    action: "approve" | "globalPause" | "limits" | "antibot"
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
      } else if (action === "globalPause") {
        transaction = await launchpad.setGlobalPaused(adminForm.globalPaused);
      } else if (action === "limits") {
        const level1 = safeParseUnits(adminForm.level1Limit, 18);
        const level2 = safeParseUnits(adminForm.level2Limit, 18);
        const level3 = safeParseUnits(adminForm.level3Limit, 18);

        if (level1 <= 0n || level2 <= 0n || level3 <= 0n) {
          throw new Error("All contribution limits must be positive.");
        }

        if (!(level1 < level2 && level2 < level3)) {
          throw new Error(
            "Contribution limits must strictly increase from Level 1 to Level 3."
          );
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

      setAdminStatus(
        "Admin transaction submitted. Waiting for confirmation..."
      );

      const receipt = await waitForReceipt(transaction);

      setAdminTxHash(receipt.hash);
      setAdminStatus("Admin action completed successfully.");

      await loadLaunchpadPermissions(address);

      if (loadedSaleId) {
        await loadSaleById(loadedSaleId, true);
      }
    } catch (error) {
      setAdminStatus(getErrorMessage(error, "Admin action failed."));
    } finally {
      setAdminBusy(false);
    }
  }

  async function saleAction(
    action:
      | "pause"
      | "resume"
      | "finalize"
      | "cancel"
      | "proceeds"
      | "tokens"
  ) {
    if (saleManagerBusy) return;

    setSaleManagerBusy(true);
    setSaleManagerStatus("");
    setSaleManagerTxHash("");

    try {
      if (!loadedSale || !loadedSaleId) {
        throw new Error("Load a sale before using sale management.");
      }

      if (!canManageLoadedSale) {
        throw new Error(
          "Only the sale owner or Launchpad owner can manage this sale."
        );
      }

      const signer = await getBrowserSigner();
      const connected = await signer.getAddress();
      const saleId = parseSaleId(loadedSaleId);
      const launchpad = new ethers.Contract(
        LAUNCHPAD_ADDRESS,
        launchpadAbi,
        signer
      );

      let transaction: ethers.ContractTransactionResponse;

      if (action === "pause" || action === "resume") {
        if (loadedSale.finalized || loadedSale.cancelled) {
          throw new Error("A finalized or cancelled sale cannot be paused.");
        }

        transaction = await launchpad.setSalePaused(
          saleId,
          action === "pause"
        );
      } else if (action === "finalize") {
        if (!loadedSale.canFinalize) {
          throw new Error(
            "The sale cannot be finalized until it ends or sells out."
          );
        }

        transaction = await launchpad.finalizeSale(saleId);
      } else if (action === "cancel") {
        if (
          connected.toLowerCase() !== loadedSale.owner.toLowerCase()
        ) {
          throw new Error("Only the sale owner can cancel this sale.");
        }

        if (loadedSale.totalRaisedUsd18 > 0n) {
          throw new Error(
            "A sale with contributions cannot be cancelled."
          );
        }

        transaction = await launchpad.cancelSale(saleId);
      } else if (action === "proceeds") {
        if (!loadedSale.finalized || !loadedSale.successful) {
          throw new Error(
            "Proceeds can be withdrawn only from a finalized successful sale."
          );
        }

        if (loadedSale.proceedsWithdrawn) {
          throw new Error("Sale proceeds have already been withdrawn.");
        }

        transaction = await launchpad.withdrawProceeds(saleId);
      } else {
        if (
          connected.toLowerCase() !== loadedSale.owner.toLowerCase()
        ) {
          throw new Error("Only the sale owner can withdraw sale tokens.");
        }

        if (!loadedSale.finalized) {
          throw new Error(
            "Sale tokens can be withdrawn only after finalization."
          );
        }

        if (loadedSale.saleTokensWithdrawn) {
          throw new Error("Sale tokens have already been withdrawn.");
        }

        transaction = await launchpad.withdrawSaleTokens(saleId);
      }

      setSaleManagerStatus(
        "Sale-management transaction submitted. Waiting for confirmation..."
      );

      const receipt = await waitForReceipt(transaction);

      setSaleManagerTxHash(receipt.hash);
      setSaleManagerStatus("Sale-management action completed successfully.");
      await loadSaleById(loadedSaleId, true);
    } catch (error) {
      setSaleManagerStatus(
        getErrorMessage(error, "Sale-management action failed.")
      );
    } finally {
      setSaleManagerBusy(false);
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
              access levels, timed finalization, automatic successful-sale
              claims, and refunds for unsuccessful sales.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatusPill active={Boolean(currentLevel)}>
                {currentLevel ? currentLevel.label : "Access Locked"}
              </StatusPill>
              <StatusPill active={Boolean(publicProjects.length)}>
                Project Registry
              </StatusPill>
              <StatusPill active={Boolean(loadedSale?.live)} tone="cyan">
                Sale {loadedSale?.live ? "Live" : "Console"}
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
                    <StatusPill active={loadedSale.live} tone="cyan">
                      {loadedSale.live
                        ? "Live"
                        : loadedSale.finalized
                          ? "Finalized"
                          : loadedSale.cancelled
                            ? "Cancelled"
                            : loadedSale.paused
                              ? "Paused"
                              : "Not Live"}
                    </StatusPill>
                    <StatusPill
                      active={loadedSale.finalized && loadedSale.successful}
                      tone="cyan"
                    >
                      {loadedSale.finalized
                        ? loadedSale.successful
                          ? "Successful"
                          : "Failed"
                        : "Pending Result"}
                    </StatusPill>
                    <StatusPill active={loadedSale.claimOpen} tone="cyan">
                      Claim {loadedSale.claimOpen ? "Open" : "Closed"}
                    </StatusPill>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <InfoCard label="Owner" value={shortAddress(loadedSale.owner)} />
                  <InfoCard
                    label="Fund Receiver"
                    value={shortAddress(loadedSale.fundReceiver)}
                  />
                  <InfoCard label="Sale Token" value={loadedSale.saleToken} mono />
                  <InfoCard
                    label="Access Rule"
                    value={
                      loadedSale.requireKoraxAccess
                        ? "KORAX access required"
                        : "Public sale"
                    }
                  />
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <InfoCard
                    label="Start"
                    value={formatUnixDate(loadedSale.startTime)}
                  />
                  <InfoCard
                    label="End"
                    value={formatUnixDate(loadedSale.endTime)}
                  />
                  <InfoCard
                    label="Soft Cap"
                    value={`$${formatUnitsSafe(
                      loadedSale.softCapUsd18,
                      18,
                      4
                    )}`}
                  />
                  <InfoCard
                    label="Hard Cap"
                    value={`$${formatUnitsSafe(
                      loadedSale.hardCapUsd18,
                      18,
                      4
                    )}`}
                  />
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <InfoCard
                    label="Raised"
                    value={`$${formatUnitsSafe(
                      loadedSale.totalRaisedUsd18,
                      18,
                      4
                    )}`}
                  />
                  <InfoCard
                    label="USDT Escrow"
                    value={`${formatUnitsSafe(
                      loadedSale.funds.escrowUSDT,
                      paymentAssets.USDT.decimals,
                      6
                    )} ${paymentAssets.USDT.symbol}`}
                  />
                  <InfoCard
                    label="USDC Escrow"
                    value={`${formatUnitsSafe(
                      loadedSale.funds.escrowUSDC,
                      paymentAssets.USDC.decimals,
                      6
                    )} ${paymentAssets.USDC.symbol}`}
                  />
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-xs text-white/50">
                    <span>
                      {formatUnitsSafe(
                        loadedSale.totalSold,
                        loadedSale.saleTokenDecimals,
                        4
                      )}{" "}
                      /{" "}
                      {formatUnitsSafe(
                        loadedSale.totalForSale,
                        loadedSale.saleTokenDecimals,
                        4
                      )}{" "}
                      {loadedSale.saleTokenSymbol}
                    </span>
                    <span className="font-black text-white">
                      {saleProgress.toFixed(2)}%
                    </span>
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
                    value={
                      buyerMax > 0n
                        ? `$${formatUnitsSafe(buyerMax, 18, 2)}`
                        : "Contract returned 0"
                    }
                  />
                  <InfoCard
                    label="Remaining Limit"
                    value={
                      buyerMax > 0n
                        ? `$${formatUnitsSafe(
                            buyerRemainingUsd18,
                            18,
                            2
                          )}`
                        : "Contract returned 0"
                    }
                  />
                  <InfoCard
                    label="Your Contributed"
                    value={`$${formatUnitsSafe(
                      buyerContributed,
                      18,
                      2
                    )}`}
                  />
                  <InfoCard
                    label="Your Purchased"
                    value={`${formatUnitsSafe(
                      buyerPurchased,
                      loadedSale.saleTokenDecimals,
                      4
                    )} ${loadedSale.saleTokenSymbol}`}
                  />
                </div>

                <div className="mt-5 grid gap-3">
                  <div className="font-black text-white">Sale Stages</div>

                  {loadedSale.stages.map((stage, index) => {
                    const progress = formatPercent(stage.sold, stage.cap);
                    const stageActive =
                      index === currentStageIndex && loadedSale.live;

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
                          <div className="font-black text-white">
                            Stage {index + 1}
                          </div>
                          <StatusPill active={stageActive} tone="cyan">
                            {stage.sold >= stage.cap
                              ? "Completed"
                              : stageActive
                                ? "Current"
                                : "Pending"}
                          </StatusPill>
                        </div>
                        <div className="mt-2">
                          Price: $
                          {formatUnitsSafe(stage.priceUsd18, 18, 6)}
                        </div>
                        <div className="mt-1">
                          Sold:{" "}
                          {formatUnitsSafe(
                            stage.sold,
                            loadedSale.saleTokenDecimals,
                            4
                          )}{" "}
                          /{" "}
                          {formatUnitsSafe(
                            stage.cap,
                            loadedSale.saleTokenDecimals,
                            4
                          )}
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
                placeholder="Maximum Payment Amount"
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

            <div className="grid gap-4 md:grid-cols-2">
              <label>
                <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-white/40">
                  Slippage Protection
                </div>
                <input
                  value={buyerForm.slippagePercent}
                  onChange={(event) =>
                    setBuyerForm((previous) => ({
                      ...previous,
                      slippagePercent: normalizeDecimalInput(event.target.value),
                    }))
                  }
                  placeholder="1"
                  inputMode="decimal"
                  className={inputClass}
                />
                <div className="mt-2 text-xs leading-6 text-white/35">
                  Percentage used to calculate the minimum acceptable token output.
                </div>
              </label>

              <label>
                <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-white/40">
                  Transaction Deadline
                </div>
                <input
                  value={buyerForm.deadlineMinutes}
                  onChange={(event) =>
                    setBuyerForm((previous) => ({
                      ...previous,
                      deadlineMinutes: event.target.value.replace(/\D/g, ""),
                    }))
                  }
                  placeholder="15"
                  inputMode="numeric"
                  className={inputClass}
                />
                <div className="mt-2 text-xs leading-6 text-white/35">
                  Minutes before the signed purchase instruction expires.
                </div>
              </label>
            </div>

            <div className="rounded-2xl border border-blue-300/20 bg-blue-500/10 p-4 text-sm text-white/75">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                Contract Quote
              </div>

              <div className="mt-2 text-2xl font-black text-blue-100">
                {previewLoading
                  ? "Calculating..."
                  : loadedSale
                    ? `${formatUnitsSafe(
                        previewTokens,
                        loadedSale.saleTokenDecimals,
                        6
                      )} ${loadedSale.saleTokenSymbol}`
                    : "0"}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-white/35">
                    Payment Used
                  </div>
                  <div className="mt-1 font-black text-white">
                    {formatUnitsSafe(
                      previewPaymentUsed,
                      currentPaymentAsset.decimals,
                      6
                    )}{" "}
                    {currentPaymentAsset.symbol}
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-white/35">
                    Quoted USD Value
                  </div>
                  <div className="mt-1 font-black text-cyan-100">
                    ${formatUnitsSafe(previewUsdValue18, 18, 6)}
                  </div>
                </div>
              </div>

              <div className="mt-3 text-xs leading-6 text-white/45">
                The Launchpad may use less than the entered maximum when the sale
                reaches its remaining allocation.
              </div>

              {previewError ? (
                <div className="mt-3 text-xs leading-6 text-red-200">
                  {previewError}
                </div>
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

        <SectionBox eyebrow="Settlement Console" title="Claim Tokens or Request Refund">
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            A successful sale opens claims automatically when finalized. An
            unsuccessful finalized sale enables each buyer to recover the USDT
            and USDC contributed by that wallet.
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
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  Purchased:{" "}
                  <span className="font-black text-white">
                    {loadedSale
                      ? `${formatUnitsSafe(
                          buyerPurchased,
                          loadedSale.saleTokenDecimals,
                          6
                        )} ${loadedSale.saleTokenSymbol}`
                      : "0"}
                  </span>
                </div>

                <div>
                  Sale result:{" "}
                  <span className="font-black text-white">
                    {!loadedSale
                      ? "Not loaded"
                      : !loadedSale.finalized
                        ? "Awaiting finalization"
                        : loadedSale.successful
                          ? "Successful"
                          : "Unsuccessful"}
                  </span>
                </div>

                <div>
                  Claim status:{" "}
                  <span className="font-black text-white">
                    {loadedSale?.claimOpen ? "Open" : "Closed"}
                  </span>
                </div>

                <div>
                  Already claimed:{" "}
                  <span className="font-black text-white">
                    {buyerClaimed ? "Yes" : "No"}
                  </span>
                </div>

                <div>
                  USDT contributed:{" "}
                  <span className="font-black text-white">
                    {formatUnitsSafe(
                      buyerContributedUSDT,
                      paymentAssets.USDT.decimals,
                      6
                    )}{" "}
                    {paymentAssets.USDT.symbol}
                  </span>
                </div>

                <div>
                  USDC contributed:{" "}
                  <span className="font-black text-white">
                    {formatUnitsSafe(
                      buyerContributedUSDC,
                      paymentAssets.USDC.decimals,
                      6
                    )}{" "}
                    {paymentAssets.USDC.symbol}
                  </span>
                </div>

                <div>
                  Refund status:{" "}
                  <span className="font-black text-white">
                    {buyerRefunded ? "Refunded" : "Not refunded"}
                  </span>
                </div>
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

              <button
                type="button"
                onClick={refund}
                disabled={!canRefund}
                className={dangerButtonClass}
              >
                {refunding ? "Refunding..." : "Request Refund"}
              </button>
            </div>

            {!canClaim && !canRefund ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs leading-6 text-white/45">
                Claim is available after successful finalization. Refund is
                available after unsuccessful finalization when this wallet has
                a stablecoin contribution.
              </div>
            ) : null}

            <TransactionStatus message={buyerStatus} txHash={buyerTxHash} />
          </div>
        </SectionBox>
      </section>

      {canCreateSale ? (
        <SectionBox
          id="creator-console"
          eyebrow="Creator Console"
          title="Create Launch Sale"
          right={<StatusPill active tone="cyan">Approved Creator</StatusPill>}
        >
          <p className="mt-2 text-sm leading-relaxed text-white/60">
            Configure the token allocation, staged USD prices, soft cap, start
            and end times, fund receiver, and optional KORAX buyer-access gate.
            The full sale-token allocation is transferred into the Launchpad
            contract when the sale is created.
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

            <div className="grid gap-4 md:grid-cols-3">
              <label>
                <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-white/40">
                  Soft Cap — USD
                </div>
                <input
                  value={creatorForm.softCapUsd}
                  onChange={(event) =>
                    setCreatorForm((previous) => ({
                      ...previous,
                      softCapUsd: normalizeDecimalInput(event.target.value),
                    }))
                  }
                  placeholder="0"
                  inputMode="decimal"
                  className={inputClass}
                />
              </label>

              <label>
                <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-white/40">
                  Start Time
                </div>
                <input
                  type="datetime-local"
                  value={creatorForm.startTime}
                  onChange={(event) =>
                    setCreatorForm((previous) => ({
                      ...previous,
                      startTime: event.target.value,
                    }))
                  }
                  className={inputClass}
                />
                <div className="mt-2 text-xs leading-6 text-white/35">
                  Leave empty to start immediately.
                </div>
              </label>

              <label>
                <div className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-white/40">
                  End Time
                </div>
                <input
                  type="datetime-local"
                  value={creatorForm.endTime}
                  onChange={(event) =>
                    setCreatorForm((previous) => ({
                      ...previous,
                      endTime: event.target.value,
                    }))
                  }
                  className={inputClass}
                />
                <div className="mt-2 text-xs leading-6 text-white/35">
                  Required and must be later than the effective start.
                </div>
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

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <InfoCard
                label="Configured Stages"
                value={parseLines(creatorForm.stageCaps).length}
              />
              <InfoCard
                label="Price Lines"
                value={parseLines(creatorForm.stagePricesUsd).length}
              />
              <InfoCard
                label="Soft Cap"
                value={`$${creatorForm.softCapUsd || "0"}`}
              />
              <InfoCard
                label="Buyer Gate"
                value={creatorForm.requireKoraxAccess ? "Required" : "Public"}
              />
            </div>

            <div className="rounded-2xl border border-amber-300/15 bg-amber-300/[0.05] px-4 py-3 text-xs leading-6 text-amber-100/80">
              Creation requires an approved creator wallet. Review every stage,
              price, cap, token address, receiver, and time before confirming;
              these values become part of the on-chain sale.
            </div>

            <button
              type="button"
              onClick={createSale}
              disabled={creatingSale}
              className={primaryButtonClass}
            >
              {creatingSale
                ? "Creating Sale..."
                : "Approve Allocation & Create Sale"}
            </button>

            <TransactionStatus message={creatorStatus} txHash={creatorTxHash} />
          </div>
        </SectionBox>
      ) : (
        <SectionBox eyebrow="Creator Access" title="Sale Creation Requires Approval">
          <p className="mt-3 text-sm leading-7 text-white/60">
            Public users can discover and participate in launches. Creating a
            sale requires the connected wallet to be explicitly approved as a
            sale creator by the Launchpad owner.
          </p>
        </SectionBox>
      )}

      {canManageLoadedSale && loadedSale ? (
        <SectionBox
          eyebrow="Sale Management"
          title={`Manage Sale #${loadedSaleId}`}
          right={
            <StatusPill
              active={loadedSale.live}
              tone={loadedSale.live ? "cyan" : "amber"}
            >
              {loadedSale.live
                ? "Live"
                : loadedSale.cancelled
                  ? "Cancelled"
                  : loadedSale.finalized
                    ? loadedSale.successful
                      ? "Finalized Success"
                      : "Finalized Failed"
                    : loadedSale.paused
                      ? "Paused"
                      : "Awaiting Window"}
            </StatusPill>
          }
        >
          <p className="mt-2 text-sm leading-relaxed text-white/60">
            Sale-level controls follow the BUILD 3 lifecycle. Finalization is
            available only after the end time or a complete sellout. Successful
            sales open claims automatically; unsuccessful sales enable refunds.
          </p>

          <div className="mt-6 grid gap-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <InfoCard
                label="Sale Owner"
                value={shortAddress(loadedSale.owner)}
                mono
              />
              <InfoCard
                label="Can Finalize"
                value={loadedSale.canFinalize ? "Yes" : "No"}
              />
              <InfoCard
                label="Proceeds"
                value={
                  loadedSale.proceedsWithdrawn
                    ? "Withdrawn"
                    : loadedSale.successful && loadedSale.finalized
                      ? "Available"
                      : "Locked"
                }
              />
              <InfoCard
                label="Remaining Tokens"
                value={
                  loadedSale.saleTokensWithdrawn
                    ? "Withdrawn"
                    : loadedSale.finalized
                      ? "Available to owner"
                      : "Locked"
                }
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  saleAction(loadedSale.paused ? "resume" : "pause")
                }
                disabled={
                  saleManagerBusy ||
                  loadedSale.finalized ||
                  loadedSale.cancelled
                }
                className={ghostButtonClass}
              >
                {loadedSale.paused ? "Resume Sale" : "Pause Sale"}
              </button>

              <button
                type="button"
                onClick={() => saleAction("finalize")}
                disabled={
                  saleManagerBusy ||
                  !loadedSale.canFinalize ||
                  loadedSale.finalized ||
                  loadedSale.cancelled
                }
                className={cyanButtonClass}
              >
                Finalize Sale
              </button>

              <button
                type="button"
                onClick={() => saleAction("cancel")}
                disabled={
                  saleManagerBusy ||
                  !connectedIsSaleOwner ||
                  loadedSale.finalized ||
                  loadedSale.cancelled ||
                  loadedSale.totalRaisedUsd18 > 0n
                }
                className={dangerButtonClass}
              >
                Cancel Empty Sale
              </button>

              <button
                type="button"
                onClick={() => saleAction("proceeds")}
                disabled={
                  saleManagerBusy ||
                  !loadedSale.finalized ||
                  !loadedSale.successful ||
                  loadedSale.proceedsWithdrawn
                }
                className={primaryButtonClass}
              >
                Withdraw Proceeds
              </button>

              <button
                type="button"
                onClick={() => saleAction("tokens")}
                disabled={
                  saleManagerBusy ||
                  !connectedIsSaleOwner ||
                  !loadedSale.finalized ||
                  loadedSale.saleTokensWithdrawn
                }
                className={ghostButtonClass}
              >
                Withdraw Remaining Sale Tokens
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs leading-6 text-white/45">
              Cancel is permitted only to the sale owner before any contribution.
              Remaining sale tokens are also returned only to the sale owner.
              Proceeds always go to the configured fund receiver.
            </div>

            <TransactionStatus
              message={saleManagerStatus}
              txHash={saleManagerTxHash}
            />
          </div>
        </SectionBox>
      ) : null}

      {isLaunchpadOwner ? (
        <SectionBox
          eyebrow="Admin Control"
          title="Launchpad Owner Settings"
          right={<StatusPill active tone="cyan">Owner Only</StatusPill>}
        >
          <p className="mt-2 text-sm leading-relaxed text-white/60">
            Manage approved sale creators, the global purchase pause,
            contribution limits, and anti-bot cooldown. Sale lifecycle actions
            are handled separately in the Sale Management panel.
          </p>

          <div className="mt-6 grid gap-6">
            <div className="rounded-[26px] border border-white/10 bg-[#020617]/45 p-5">
              <div className="text-xs font-black uppercase tracking-[0.22em] text-blue-100">
                Creator Permission
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-[1fr_160px]">
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
                className={`${ghostButtonClass} mt-4`}
              >
                Set Creator Approval
              </button>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-[#020617]/45 p-5">
              <div className="text-xs font-black uppercase tracking-[0.22em] text-blue-100">
                Global Purchase Pause
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto]">
                <select
                  value={adminForm.globalPaused ? "true" : "false"}
                  onChange={(event) =>
                    setAdminForm((previous) => ({
                      ...previous,
                      globalPaused: event.target.value === "true",
                    }))
                  }
                  className={selectClass}
                >
                  <option value="false">Purchases Enabled</option>
                  <option value="true">Purchases Globally Paused</option>
                </select>

                <button
                  type="button"
                  onClick={() => adminAction("globalPause")}
                  disabled={adminBusy}
                  className={dangerButtonClass}
                >
                  Apply Global Pause
                </button>
              </div>

              <div className="mt-3 text-xs leading-6 text-white/40">
                Global pause blocks purchases but does not replace individual
                sale finalization, claims, refunds, or withdrawal controls.
              </div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-[#020617]/45 p-5">
              <div className="text-xs font-black uppercase tracking-[0.22em] text-blue-100">
                Contribution Limits
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
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
                className={`${ghostButtonClass} mt-4`}
              >
                Update Contribution Limits
              </button>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-[#020617]/45 p-5">
              <div className="text-xs font-black uppercase tracking-[0.22em] text-blue-100">
                Anti-Bot Protection
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-[1fr_180px]">
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
                className={`${ghostButtonClass} mt-4`}
              >
                Update Anti-Bot
              </button>
            </div>

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
              staged token sales, staking-based access, finalization, claims,
              and failed-sale refunds.
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