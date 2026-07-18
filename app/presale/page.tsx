"use client";

import Link from "next/link";
import {
  useEffect,
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

type PayMode = "bnb" | "usdt" | "usdc";

type NoticeState = {
  type: "info" | "success" | "error" | "warning";
  message: string;
};

type StatusTone = "blue" | "cyan" | "slate" | "amber";

const RPC_URL =
  process.env.NEXT_PUBLIC_BSC_RPC_URL?.trim() ||
  "https://bsc-dataseed.binance.org/";

const PRESALE_ADDRESS =
  process.env.NEXT_PUBLIC_PRESALE_ADDRESS?.trim() ||
  "0xe00f19366cBd91f5603C3674f00de3CAB77261D7";

const DEFAULT_USDT_ADDRESS =
  process.env.NEXT_PUBLIC_USDT_ADDRESS?.trim() ||
  "0x55d398326f99059fF775485246999027B3197955";

const DEFAULT_USDC_ADDRESS =
  process.env.NEXT_PUBLIC_USDC_ADDRESS?.trim() ||
  "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d";

const PRESALE_BSCSCAN_URL =
  process.env.NEXT_PUBLIC_PRESALE_BSCSCAN_URL?.trim() ||
  `https://bscscan.com/address/${PRESALE_ADDRESS}#code`;

const BSC_CHAIN_ID = 56;
const REFRESH_INTERVAL_MS = 15_000;

const STAGE_CAPS = [
  10_000_000,
  10_000_000,
  10_000_000,
  10_000_000,
  10_000_000,
] as const;

const STAGE_PRICES = [0.05, 0.07, 0.09, 0.11, 0.13] as const;

const STAGE_CAPS_RAW = STAGE_CAPS.map((cap) =>
  ethers.parseUnits(String(cap), 18)
);

const presaleAbi = [
  "function currentStage() view returns (uint256)",
  "function totalSold() view returns (uint256)",
  "function TOTAL_FOR_SALE() view returns (uint256)",
  "function saleActive() view returns (bool)",
  "function claimEnabled() view returns (bool)",
  "function claimStart() view returns (uint256)",
  "function stageRemaining(uint256 idx) view returns (uint256)",
  "function antiBotEnabled() view returns (bool)",
  "function buyCooldown() view returns (uint256)",
  "function USDT() view returns (address)",
  "function USDC() view returns (address)",
  "function previewTokensForUSDT(uint256 amount) view returns (uint256)",
  "function previewTokensForUSDC(uint256 amount) view returns (uint256)",
  "function previewTokensForBNB(uint256 bnbAmountWei) view returns (uint256)",
  "function buyWithBNB() payable",
  "function buyWithUSDT(uint256 amount)",
  "function buyWithUSDC(uint256 amount)",
];

const erc20Abi = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-[#020617]/80 px-4 py-3.5 text-white outline-none placeholder:text-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition focus:border-blue-400/55 focus:bg-[#020617]/95 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]";

const selectClass =
  "w-full rounded-2xl border border-white/10 bg-[#020617]/80 px-4 py-3.5 text-white outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition focus:border-blue-400/55 focus:bg-[#020617]/95 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]";

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

function shortenAddress(address: string) {
  if (!address || address.length < 12) return address;

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatTokenAmount(
  value: bigint,
  decimals = 18,
  maximumFractionDigits = 4
) {
  const formatted = ethers.formatUnits(value, decimals);
  const numericValue = Number(formatted);

  if (!Number.isFinite(numericValue)) {
    return "0";
  }

  return numericValue.toLocaleString("en-US", {
    maximumFractionDigits,
  });
}

function formatDate(unix: bigint | number) {
  const value = typeof unix === "bigint" ? Number(unix) : unix;

  if (!value) return "Not started";

  return new Date(value * 1000).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function isValidPositiveAmount(value: string) {
  const normalized = value.trim();

  if (!normalized) return false;

  if (!/^(?:\d+\.?\d*|\.\d+)$/.test(normalized)) {
    return false;
  }

  const numericValue = Number(normalized);

  return Number.isFinite(numericValue) && numericValue > 0;
}

function clampBigInt(value: bigint, min: bigint, max: bigint) {
  if (value < min) return min;
  if (value > max) return max;

  return value;
}

function calculateStageProgress(
  totalSoldRaw: bigint,
  stageIndex: number
) {
  const stageCapRaw = STAGE_CAPS_RAW[stageIndex];

  if (!stageCapRaw) return 0;

  const soldBeforeStage = STAGE_CAPS_RAW.slice(
    0,
    stageIndex
  ).reduce((sum, current) => sum + current, 0n);

  const soldInStage = clampBigInt(
    totalSoldRaw - soldBeforeStage,
    0n,
    stageCapRaw
  );

  return Number((soldInStage * 10_000n) / stageCapRaw) / 100;
}

async function validateContract(
  provider: ethers.Provider,
  address: string
) {
  if (!address || !ethers.isAddress(address)) {
    throw new Error(`Invalid contract address: ${address || "empty"}`);
  }

  const code = await provider.getCode(address);

  if (!code || code === "0x") {
    throw new Error(`No contract deployed at ${address}`);
  }
}

function makeEip1193Provider(walletClient: any) {
  return {
    request: async ({
      method,
      params,
    }: {
      method: string;
      params?: unknown[] | object;
    }) => {
      return walletClient.request({
        method: method as any,
        params: (params as any) ?? [],
      });
    },
  };
}

function StatusPill({
  active,
  children,
  tone = "blue",
}: {
  active?: boolean;
  children: ReactNode;
  tone?: StatusTone;
}) {
  const activeStyles: Record<StatusTone, string> = {
    blue:
      "border-blue-400/30 bg-blue-500/10 text-blue-100 shadow-[0_0_22px_rgba(59,130,246,0.14)]",
    cyan:
      "border-cyan-300/25 bg-cyan-400/10 text-cyan-100 shadow-[0_0_22px_rgba(34,211,238,0.10)]",
    slate:
      "border-white/15 bg-white/[0.055] text-white/70",
    amber:
      "border-amber-300/25 bg-amber-300/[0.07] text-amber-100",
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.17em]",
        active
          ? activeStyles[tone]
          : "border-white/10 bg-white/[0.035] text-white/40",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function NoticeBox({ notice }: { notice: NoticeState }) {
  const styles: Record<NoticeState["type"], string> = {
    info:
      "border-blue-400/20 bg-blue-500/[0.08] text-blue-100",
    success:
      "border-cyan-300/20 bg-cyan-400/[0.08] text-cyan-100",
    error: "border-red-400/20 bg-red-500/10 text-red-100",
    warning:
      "border-amber-300/20 bg-amber-300/[0.06] text-amber-100",
  };

  return (
    <div
      className={[
        "rounded-2xl border px-4 py-3 text-sm leading-7",
        styles[notice.type],
      ].join(" ")}
    >
      {notice.message}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  right,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-4xl">
        <div className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.29em] text-blue-100">
          <span className="h-px w-9 bg-blue-400/70" />
          {eyebrow}
        </div>

        <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.025em] text-white sm:text-4xl">
          {title}
        </h2>

        {description ? (
          <p className="mt-4 max-w-3xl text-sm leading-8 text-white/55 sm:text-base">
            {description}
          </p>
        ) : null}
      </div>

      {right}
    </div>
  );
}

function MetricCard({
  number,
  label,
  value,
  description,
  active,
}: {
  number: string;
  label: string;
  value: ReactNode;
  description: string;
  active?: boolean;
}) {
  return (
    <article
      className={[
        "presale-card relative overflow-hidden rounded-[28px] border p-5 shadow-[0_20px_65px_rgba(0,0,0,0.3)] backdrop-blur-xl",
        active
          ? "border-blue-400/25 bg-blue-500/[0.09]"
          : "border-white/10 bg-[#030711]/72",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.07),transparent_38%)]" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
          {label}
        </div>

        <div
          className={[
            "flex h-10 w-10 items-center justify-center rounded-xl border text-xs font-black",
            active
              ? "border-blue-400/25 bg-blue-500/15 text-blue-100"
              : "border-white/10 bg-black/30 text-white/45",
          ].join(" ")}
        >
          {number}
        </div>
      </div>

      <div
        className={[
          "relative mt-4 break-words text-2xl font-black leading-tight",
          active ? "text-blue-100" : "text-white",
        ].join(" ")}
      >
        {value}
      </div>

      <p className="relative mt-3 text-sm leading-7 text-white/52">
        {description}
      </p>
    </article>
  );
}

function SectionBox({
  eyebrow,
  title,
  description,
  children,
  right,
  accent,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  right?: ReactNode;
  accent?: boolean;
}) {
  return (
    <section
      className={[
        "presale-section relative overflow-hidden rounded-[36px] border p-5 shadow-[0_28px_100px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:p-7",
        accent
          ? "border-blue-400/20 bg-blue-500/[0.065]"
          : "border-white/10 bg-[#030711]/76",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.07),transparent_38%)]" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />

      <div className="relative">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          right={right}
        />

        {children}
      </div>
    </section>
  );
}

function ContractAddressCard({
  label,
  address,
  copied,
  onCopy,
  explorerUrl,
}: {
  label: string;
  address: string;
  copied: boolean;
  onCopy: () => void;
  explorerUrl: string;
}) {
  return (
    <article className="presale-card rounded-[26px] border border-white/10 bg-black/25 p-5">
      <div className="text-[10px] font-black uppercase tracking-[0.21em] text-white/35">
        {label}
      </div>

      <div className="mt-3 break-all rounded-2xl border border-white/10 bg-black/35 p-3 font-mono text-xs leading-6 text-white/70">
        {address || "Address unavailable"}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onCopy}
          disabled={!address}
          className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-bold text-white/70 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {copied ? "Copied" : "Copy Address"}
        </button>

        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold text-blue-100 transition hover:bg-blue-500/20 hover:text-white"
        >
          View on BscScan ↗
        </a>
      </div>
    </article>
  );
}

function PresaleCoreVisual({
  stage,
  stagePrice,
  progress,
  saleActive,
  totalSold,
}: {
  stage: number;
  stagePrice: number;
  progress: number;
  saleActive: boolean;
  totalSold: string;
}) {
  return (
    <div
      className="presale-command-core relative min-h-[520px] overflow-hidden rounded-[36px] border border-white/10 bg-[#020611] shadow-[0_35px_120px_rgba(0,0,0,0.62)]"
      aria-label={`KORAX presale status. Stage ${stage}. Price ${stagePrice.toFixed(
        2
      )} dollars. Total progress ${progress.toFixed(2)} percent.`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.28),transparent_32%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.13),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.10),transparent_36%)]" />

      <div className="presale-core-grid pointer-events-none absolute inset-0 opacity-[0.075] [background-image:linear-gradient(rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="presale-orbit presale-orbit-one pointer-events-none absolute left-1/2 top-[43%] h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/15" />

      <div className="presale-orbit presale-orbit-two pointer-events-none absolute left-1/2 top-[43%] h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />

      <div className="presale-orbit presale-orbit-three pointer-events-none absolute left-1/2 top-[43%] h-[212px] w-[212px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />

      <div className="presale-logo-glow pointer-events-none absolute left-1/2 top-[43%] h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/25 blur-3xl" />

      <div className="absolute left-1/2 top-[43%] z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <img
          src="/Korax-logo.png"
          alt="KORAX official logo"
          draggable={false}
          className="presale-logo-spin h-44 w-44 bg-transparent object-contain drop-shadow-[0_0_44px_rgba(59,130,246,0.95)] sm:h-52 sm:w-52"
        />

        <img
          src="/korax-wordmark.png"
          alt="KORAX"
          draggable={false}
          className="presale-wordmark-float mt-3 h-10 w-auto max-w-[230px] bg-transparent object-contain drop-shadow-[0_0_24px_rgba(59,130,246,0.85)] sm:h-12 sm:max-w-[285px]"
        />
      </div>

      <div className="presale-data-card absolute left-5 top-5 hidden min-w-[145px] rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur-xl sm:block">
        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
          Current Stage
        </div>

        <div className="mt-2 font-black text-blue-100">
          {stage} / 5
        </div>

        <div className="mt-1 text-xs text-white/42">
          Progressive pricing
        </div>
      </div>

      <div className="presale-data-card presale-data-delay absolute right-5 top-5 hidden min-w-[145px] rounded-2xl border border-white/10 bg-black/50 p-4 text-right backdrop-blur-xl sm:block">
        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
          Current Price
        </div>

        <div className="mt-2 font-black text-cyan-100">
          ${stagePrice.toFixed(2)}
        </div>

        <div className="mt-1 text-xs text-white/42">
          Per KRX
        </div>
      </div>

      <div className="presale-data-card presale-data-two absolute bottom-28 left-5 hidden min-w-[145px] rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur-xl sm:block">
        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
          Total Sold
        </div>

        <div className="mt-2 font-black text-white">
          {totalSold} KRX
        </div>

        <div className="mt-1 text-xs text-white/42">
          Contract data
        </div>
      </div>

      <div className="presale-data-card presale-data-three absolute bottom-28 right-5 hidden min-w-[145px] rounded-2xl border border-white/10 bg-black/50 p-4 text-right backdrop-blur-xl sm:block">
        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
          Sale Status
        </div>

        <div
          className={[
            "mt-2 font-black",
            saleActive ? "text-cyan-100" : "text-white",
          ].join(" ")}
        >
          {saleActive ? "Active" : "Closed"}
        </div>

        <div className="mt-1 text-xs text-white/42">
          BNB Chain
        </div>
      </div>

      <div className="absolute bottom-5 left-5 right-5 z-20 overflow-hidden rounded-[24px] border border-blue-400/20 bg-blue-500/10 p-4 backdrop-blur-xl">
        <div className="presale-panel-scan pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-blue-300/10 to-transparent" />

        <div className="relative">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[9px] font-black uppercase tracking-[0.24em] text-white/38">
                KORAX Presale Protocol
              </div>

              <div className="mt-1 text-lg font-black text-white">
                {progress.toFixed(2)}% allocated
              </div>
            </div>

            <div
              className={[
                "flex h-11 w-11 items-center justify-center rounded-full border",
                saleActive
                  ? "border-cyan-300/25 bg-cyan-400/10"
                  : "border-white/10 bg-black/25",
              ].join(" ")}
            >
              <span
                className={[
                  "h-3 w-3 rounded-full",
                  saleActive
                    ? "presale-live-dot bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.95)]"
                    : "bg-white/25",
                ].join(" ")}
              />
            </div>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/35">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-blue-200 to-cyan-200 shadow-[0_0_18px_rgba(59,130,246,0.35)]"
              style={{
                width: `${Math.min(Math.max(progress, 0), 100)}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PresalePage() {
  const [mounted, setMounted] = useState(false);

  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [stage, setStage] = useState(1);
  const [stagePrice, setStagePrice] = useState(0.05);

  const [stageRemainingRaw, setStageRemainingRaw] =
    useState<bigint>(0n);

  const [totalSoldRaw, setTotalSoldRaw] =
    useState<bigint>(0n);

  const [totalForSaleRaw, setTotalForSaleRaw] =
    useState<bigint>(ethers.parseUnits("50000000", 18));

  const [progress, setProgress] = useState(0);

  const [saleActive, setSaleActive] = useState(false);
  const [claimEnabled, setClaimEnabled] = useState(false);
  const [claimStart, setClaimStart] = useState("Not started");

  const [antiBotEnabled, setAntiBotEnabled] = useState(false);
  const [buyCooldown, setBuyCooldown] = useState(0);

  const [contractUsdtAddress, setContractUsdtAddress] =
    useState(DEFAULT_USDT_ADDRESS);

  const [contractUsdcAddress, setContractUsdcAddress] =
    useState(DEFAULT_USDC_ADDRESS);

  const [previewMode, setPreviewMode] =
    useState<PayMode>("usdt");

  const [preview, setPreview] = useState("-");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");

  const [busy, setBusy] = useState<"" | PayMode>("");

  const [notice, setNotice] =
    useState<NoticeState | null>(null);

  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  const [copiedTarget, setCopiedTarget] = useState("");

 const previewDebounceRef = useRef<number | null>(null);
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const previewRequestIdRef = useRef(0);

  const { address, isConnected, chainId } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { switchChainAsync } = useSwitchChain();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!address) {
      setWalletAddress("");
      return;
    }

    try {
      setWalletAddress(ethers.getAddress(address));
    } catch {
      setWalletAddress(address);
    }
  }, [address]);

  async function copyValue(target: string, value: string) {
    if (!value) {
      setNotice({
        type: "error",
        message: "The requested address is unavailable.",
      });

      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopiedTarget(target);

      window.setTimeout(() => {
        setCopiedTarget((current) =>
          current === target ? "" : current
        );
      }, 1800);
    } catch {
      setNotice({
        type: "error",
        message: "The address could not be copied.",
      });
    }
  }

  async function getRpcProvider() {
    const rpcProvider = new ethers.JsonRpcProvider(RPC_URL);

    await validateContract(rpcProvider, PRESALE_ADDRESS);

    return rpcProvider;
  }

  async function getConnectedBrowserProvider() {
    if (!isConnected || !walletClient || !address) {
      throw new Error(
        "Connect your wallet from the top bar first."
      );
    }

    if (chainId !== BSC_CHAIN_ID) {
      setNotice({
        type: "info",
        message: "Requesting a switch to BNB Chain...",
      });

      try {
        await switchChainAsync({
          chainId: BSC_CHAIN_ID,
        });

        await new Promise((resolve) => {
          window.setTimeout(resolve, 500);
        });
      } catch {
        throw new Error(
          "Switch your wallet to BNB Chain and try again."
        );
      }
    }

    const eip1193Provider =
      makeEip1193Provider(walletClient);

    const browserProvider = new ethers.BrowserProvider(
      eip1193Provider as any
    );

    const network = await browserProvider.getNetwork();

    if (Number(network.chainId) !== BSC_CHAIN_ID) {
      throw new Error(
        "The connected wallet is not using BNB Chain."
      );
    }

    await validateContract(browserProvider, PRESALE_ADDRESS);

    return browserProvider;
  }

  async function getRpcPresale() {
    const rpcProvider = await getRpcProvider();

    return new ethers.Contract(
      PRESALE_ADDRESS,
      presaleAbi,
      rpcProvider
    );
  }

  async function refreshPresaleData(silent = false) {
    if (!silent) {
      setDataLoading(true);
    }

    try {
      setDataError("");

      const presale = await getRpcPresale();

      const [
        currentStageRaw,
        totalSoldContractRaw,
        totalForSaleContractRaw,
        saleActiveRaw,
        claimEnabledRaw,
        claimStartRaw,
        antiBotRaw,
        cooldownRaw,
        usdtRaw,
        usdcRaw,
      ] = await Promise.all([
        presale.currentStage(),
        presale.totalSold(),
        presale.TOTAL_FOR_SALE(),
        presale.saleActive(),
        presale.claimEnabled(),
        presale.claimStart(),
        presale.antiBotEnabled(),
        presale.buyCooldown(),
        presale.USDT(),
        presale.USDC(),
      ]);

      const contractStageIndex = Number(currentStageRaw);

      const displayStageIndex = Math.min(
        Math.max(contractStageIndex, 0),
        STAGE_PRICES.length - 1
      );

      const totalSoldValue = BigInt(
        totalSoldContractRaw.toString()
      );

      const totalForSaleValue = BigInt(
        totalForSaleContractRaw.toString()
      );

      let currentRemainingValue = 0n;

      if (
        contractStageIndex >= 0 &&
        contractStageIndex < STAGE_PRICES.length
      ) {
        const remainingRaw =
          await presale.stageRemaining(contractStageIndex);

        currentRemainingValue = BigInt(
          remainingRaw.toString()
        );
      }

      const progressValue =
        totalForSaleValue > 0n
          ? Math.min(
              100,
              Number(
                (totalSoldValue * 10_000n) /
                  totalForSaleValue
              ) / 100
            )
          : 0;

      let usdtAddress = DEFAULT_USDT_ADDRESS;
      let usdcAddress = DEFAULT_USDC_ADDRESS;

      try {
        usdtAddress = ethers.getAddress(String(usdtRaw));
      } catch {
        usdtAddress = DEFAULT_USDT_ADDRESS;
      }

      try {
        usdcAddress = ethers.getAddress(String(usdcRaw));
      } catch {
        usdcAddress = DEFAULT_USDC_ADDRESS;
      }

      setCurrentStageIndex(contractStageIndex);

      setStage(displayStageIndex + 1);

      setStagePrice(
        STAGE_PRICES[displayStageIndex] ??
          STAGE_PRICES[STAGE_PRICES.length - 1]
      );

      setStageRemainingRaw(currentRemainingValue);
      setTotalSoldRaw(totalSoldValue);
      setTotalForSaleRaw(totalForSaleValue);
      setProgress(progressValue);

      setSaleActive(Boolean(saleActiveRaw));
      setClaimEnabled(Boolean(claimEnabledRaw));

      setClaimStart(
        formatDate(BigInt(claimStartRaw.toString()))
      );

      setAntiBotEnabled(Boolean(antiBotRaw));
      setBuyCooldown(Number(cooldownRaw));

      setContractUsdtAddress(usdtAddress);
      setContractUsdcAddress(usdcAddress);

      setLastUpdated(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    } catch (error) {
      console.error("Failed to read presale data:", error);

      setDataError(
        getErrorMessage(
          error,
          "Failed to load presale contract data."
        )
      );
    } finally {
      if (!silent) {
        setDataLoading(false);
      }
    }
  }

  async function refreshPreview(
    mode: PayMode,
    inputAmount: string
  ) {
    const requestId = ++previewRequestIdRef.current;

    if (!isValidPositiveAmount(inputAmount)) {
      setPreview("-");
      setPreviewError("");
      setPreviewLoading(false);
      return;
    }

    setPreviewLoading(true);
    setPreviewError("");

    try {
      const rpcProvider = await getRpcProvider();

      const presale = new ethers.Contract(
        PRESALE_ADDRESS,
        presaleAbi,
        rpcProvider
      );

      let outputRaw = 0n;

      if (mode === "bnb") {
        const valueWei = ethers.parseEther(inputAmount);

        const result =
          await presale.previewTokensForBNB(valueWei);

        outputRaw = BigInt(result.toString());
      }

      if (mode === "usdt") {
        await validateContract(
          rpcProvider,
          contractUsdtAddress
        );

        const token = new ethers.Contract(
          contractUsdtAddress,
          erc20Abi,
          rpcProvider
        );

        const decimals = Number(await token.decimals());

        const amountRaw = ethers.parseUnits(
          inputAmount,
          decimals
        );

        const result =
          await presale.previewTokensForUSDT(amountRaw);

        outputRaw = BigInt(result.toString());
      }

      if (mode === "usdc") {
        await validateContract(
          rpcProvider,
          contractUsdcAddress
        );

        const token = new ethers.Contract(
          contractUsdcAddress,
          erc20Abi,
          rpcProvider
        );

        const decimals = Number(await token.decimals());

        const amountRaw = ethers.parseUnits(
          inputAmount,
          decimals
        );

        const result =
          await presale.previewTokensForUSDC(amountRaw);

        outputRaw = BigInt(result.toString());
      }

      if (requestId !== previewRequestIdRef.current) {
        return;
      }

      setPreview(
        `${formatTokenAmount(outputRaw, 18, 4)} KRX`
      );
    } catch (error) {
      console.error("Presale preview failed:", error);

      if (requestId !== previewRequestIdRef.current) {
        return;
      }

      setPreview("Unavailable");

      setPreviewError(
        getErrorMessage(
          error,
          "The purchase preview could not be calculated."
        )
      );
    } finally {
      if (requestId === previewRequestIdRef.current) {
        setPreviewLoading(false);
      }
    }
  }

  useEffect(() => {
    if (!mounted) return;

    void refreshPresaleData(false);

    const interval = window.setInterval(() => {
      void refreshPresaleData(true);
    }, REFRESH_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    if (previewDebounceRef.current) {
      window.clearTimeout(previewDebounceRef.current);
    }

    previewDebounceRef.current = window.setTimeout(() => {
      void refreshPreview(previewMode, amount);
    }, 350);

    return () => {
      if (previewDebounceRef.current) {
        window.clearTimeout(previewDebounceRef.current);
      }
    };
  }, [
    amount,
    previewMode,
    mounted,
    contractUsdtAddress,
    contractUsdcAddress,
  ]);

  function updateAmount(value: string) {
    const normalized = value.replace(",", ".");

    if (
      normalized === "" ||
      /^(?:\d+\.?\d*|\.\d*)$/.test(normalized)
    ) {
      setAmount(normalized);
    }
  }

  async function buyWithBNB() {
    if (busy) return;

    setNotice(null);

    try {
      if (!isValidPositiveAmount(amount)) {
        throw new Error("Enter a valid BNB amount.");
      }

      if (!saleActive) {
        throw new Error("The KRX presale is not active.");
      }

      setPreviewMode("bnb");
      setBusy("bnb");

      setNotice({
        type: "info",
        message: "Preparing the BNB purchase transaction...",
      });

      const browserProvider =
        await getConnectedBrowserProvider();

      const signer = await browserProvider.getSigner();

      const presale = new ethers.Contract(
        PRESALE_ADDRESS,
        presaleAbi,
        signer
      );

      const liveSaleActive = Boolean(
        await presale.saleActive()
      );

      if (!liveSaleActive) {
        throw new Error("The KRX presale is not active.");
      }

      const purchaseValue = ethers.parseEther(amount);

      const buyerAddress = await signer.getAddress();
      const bnbBalance =
        await browserProvider.getBalance(buyerAddress);

      if (bnbBalance <= purchaseValue) {
        throw new Error(
          "Insufficient BNB balance for the purchase and network gas fee."
        );
      }

      setNotice({
        type: "info",
        message:
          "Confirm the BNB purchase in your connected wallet.",
      });

      const transaction = await presale.buyWithBNB({
        value: purchaseValue,
      });

      setNotice({
        type: "info",
        message:
          "The BNB transaction was submitted. Waiting for blockchain confirmation...",
      });

      const receipt = await transaction.wait();

      setNotice({
        type: "success",
        message: `BNB purchase completed successfully. Transaction: ${shortenAddress(
          receipt.hash
        )}`,
      });

      setAmount("");
      setPreview("-");
      setPreviewError("");

      await refreshPresaleData(true);
    } catch (error) {
      console.error("BNB purchase failed:", error);

      const rawMessage = getErrorMessage(
        error,
        "BNB purchase failed."
      );

      const loweredMessage = rawMessage.toLowerCase();

      const message = loweredMessage.includes(
        "insufficient funds"
      )
        ? "Insufficient BNB balance for the purchase and network gas fee."
        : rawMessage;

      setNotice({
        type: "error",
        message,
      });
    } finally {
      setBusy("");
    }
  }

  async function approveAndBuyStable(
    mode: "usdt" | "usdc"
  ) {
    if (busy) return;

    setNotice(null);

    try {
      const currency = mode.toUpperCase();

      if (!isValidPositiveAmount(amount)) {
        throw new Error(
          `Enter a valid ${currency} amount.`
        );
      }

      if (!saleActive) {
        throw new Error("The KRX presale is not active.");
      }

      setPreviewMode(mode);
      setBusy(mode);

      setNotice({
        type: "info",
        message: `Preparing the ${currency} purchase...`,
      });

      const browserProvider =
        await getConnectedBrowserProvider();

      const signer = await browserProvider.getSigner();
      const owner = await signer.getAddress();

      const presale = new ethers.Contract(
        PRESALE_ADDRESS,
        presaleAbi,
        signer
      );

      const liveSaleActive = Boolean(
        await presale.saleActive()
      );

      if (!liveSaleActive) {
        throw new Error("The KRX presale is not active.");
      }

      const tokenAddress =
        mode === "usdt"
          ? contractUsdtAddress
          : contractUsdcAddress;

      await validateContract(
        browserProvider,
        tokenAddress
      );

      const token = new ethers.Contract(
        tokenAddress,
        erc20Abi,
        signer
      );

      const [decimalsRaw, symbolRaw] =
        await Promise.all([
          token.decimals(),
          token.symbol(),
        ]);

      const decimals = Number(decimalsRaw);
      const tokenSymbol = String(symbolRaw || currency);

      const amountRaw = ethers.parseUnits(
        amount,
        decimals
      );

      const balanceRaw = await token.balanceOf(owner);
      const balance = BigInt(balanceRaw.toString());

      if (balance < amountRaw) {
        throw new Error(
          `Insufficient ${tokenSymbol} balance.`
        );
      }

      const allowanceRaw = await token.allowance(
        owner,
        PRESALE_ADDRESS
      );

      const allowance = BigInt(
        allowanceRaw.toString()
      );

      if (allowance < amountRaw) {
        setNotice({
          type: "info",
          message: `Approve ${tokenSymbol} spending in your wallet.`,
        });

        const approvalTransaction = await token.approve(
          PRESALE_ADDRESS,
          amountRaw
        );

        setNotice({
          type: "info",
          message: `${tokenSymbol} approval submitted. Waiting for confirmation...`,
        });

        await approvalTransaction.wait();
      }

      setNotice({
        type: "info",
        message: `Confirm the ${tokenSymbol} purchase in your wallet.`,
      });

      const transaction =
        mode === "usdt"
          ? await presale.buyWithUSDT(amountRaw)
          : await presale.buyWithUSDC(amountRaw);

      setNotice({
        type: "info",
        message: `${tokenSymbol} purchase submitted. Waiting for blockchain confirmation...`,
      });

      const receipt = await transaction.wait();

      setNotice({
        type: "success",
        message: `${tokenSymbol} purchase completed successfully. Transaction: ${shortenAddress(
          receipt.hash
        )}`,
      });

      setAmount("");
      setPreview("-");
      setPreviewError("");

      await refreshPresaleData(true);
    } catch (error) {
      console.error(
        `${mode.toUpperCase()} purchase failed:`,
        error
      );

      setNotice({
        type: "error",
        message: getErrorMessage(
          error,
          `${mode.toUpperCase()} purchase failed.`
        ),
      });
    } finally {
      setBusy("");
    }
  }

  const totalSoldDisplay = formatTokenAmount(
    totalSoldRaw,
    18,
    2
  );

  const totalForSaleDisplay = formatTokenAmount(
    totalForSaleRaw,
    18,
    2
  );

  const stageRemainingDisplay = formatTokenAmount(
    stageRemainingRaw,
    18,
    2
  );

  const quickAmounts =
    previewMode === "bnb"
      ? ["0.05", "0.1", "0.25", "0.5"]
      : ["50", "100", "250", "500"];

  const selectedCurrency =
    previewMode === "bnb"
      ? "BNB"
      : previewMode.toUpperCase();

  const amountIsValid =
    isValidPositiveAmount(amount);

  const totalAllocationProgress = Math.min(
    Math.max(progress, 0),
    100
  );

  if (!mounted) return null;

  return (
    <div className="space-y-8 overflow-hidden">
      <style>{`
        @keyframes presaleLogoSpin {
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

        @keyframes presaleWordmarkFloat {
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

        @keyframes presaleOrbit {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }

          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes presaleOrbitReverse {
          from {
            transform: translate(-50%, -50%) rotate(360deg);
          }

          to {
            transform: translate(-50%, -50%) rotate(0deg);
          }
        }

        @keyframes presaleGlow {
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

        @keyframes presaleGrid {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(-16px, -16px, 0);
          }
        }

        @keyframes presaleScan {
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

        @keyframes presaleDataFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-7px);
          }
        }

        @keyframes presalePulse {
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

        @keyframes presaleProgressGlow {
          0%,
          100% {
            filter: brightness(1);
          }

          50% {
            filter: brightness(1.18);
          }
        }

        @keyframes presaleSectionShimmer {
          0%,
          74% {
            transform: translateX(-130%);
            opacity: 0;
          }

          82% {
            opacity: 0.8;
          }

          100% {
            transform: translateX(130%);
            opacity: 0;
          }
        }

        .presale-card,
        .presale-stage-card {
          position: relative;
          transform-style: preserve-3d;
          transition:
            transform 230ms ease,
            border-color 230ms ease,
            background-color 230ms ease,
            box-shadow 230ms ease;
        }

        .presale-card::before,
        .presale-stage-card::before {
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

        .presale-card:hover,
        .presale-stage-card:hover {
          transform: translateY(-6px);
          border-color: rgba(96, 165, 250, 0.35);
          box-shadow: 0 30px 90px rgba(37, 99, 235, 0.13);
        }

        .presale-card:hover::before,
        .presale-stage-card:hover::before {
          opacity: 1;
        }

        .presale-section::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            120deg,
            transparent,
            rgba(255, 255, 255, 0.028),
            transparent
          );
          transform: translateX(-130%);
          animation: presaleSectionShimmer 9s ease-in-out infinite;
        }

        .presale-logo-spin {
          transform-style: preserve-3d;
          animation: presaleLogoSpin 9s linear infinite;
          will-change: transform;
          backface-visibility: visible;
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .presale-wordmark-float {
          animation: presaleWordmarkFloat 4.5s ease-in-out infinite;
          will-change: transform;
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .presale-orbit-one {
          animation: presaleOrbit 20s linear infinite;
        }

        .presale-orbit-two {
          animation: presaleOrbitReverse 16s linear infinite;
        }

        .presale-orbit-three {
          animation: presaleOrbit 12s linear infinite;
        }

        .presale-orbit::before,
        .presale-orbit::after {
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

        .presale-orbit::before {
          left: 50%;
          top: -4px;
          transform: translateX(-50%);
        }

        .presale-orbit::after {
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
        }

        .presale-logo-glow {
          animation: presaleGlow 3.8s ease-in-out infinite;
        }

        .presale-core-grid {
          animation: presaleGrid 10s ease-in-out infinite;
        }

        .presale-data-card {
          animation: presaleDataFloat 5s ease-in-out infinite;
        }

        .presale-data-delay {
          animation-delay: 0.7s;
        }

        .presale-data-two {
          animation-delay: 1.4s;
        }

        .presale-data-three {
          animation-delay: 2s;
        }

        .presale-panel-scan,
        .presale-hero-scan {
          animation: presaleScan 4.8s ease-in-out infinite;
        }

        .presale-live-dot {
          animation: presalePulse 1.7s ease-in-out infinite;
        }

        .presale-progress-bar {
          animation: presaleProgressGlow 3s ease-in-out infinite;
        }

        @media (max-width: 640px) {
          .presale-command-core {
            min-height: 450px;
          }

          .presale-orbit-one {
            height: 280px;
            width: 280px;
          }

          .presale-orbit-two {
            height: 220px;
            width: 220px;
          }

          .presale-orbit-three {
            height: 168px;
            width: 168px;
          }
        }

        @media (hover: none) {
          .presale-card:hover,
          .presale-stage-card:hover {
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .presale-logo-spin,
          .presale-wordmark-float,
          .presale-orbit-one,
          .presale-orbit-two,
          .presale-orbit-three,
          .presale-logo-glow,
          .presale-core-grid,
          .presale-data-card,
          .presale-panel-scan,
          .presale-hero-scan,
          .presale-live-dot,
          .presale-progress-bar,
          .presale-section::after {
            animation: none;
          }

          .presale-card:hover,
          .presale-stage-card:hover {
            transform: none;
          }
        }
      `}</style>

      <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[#030711]/88 p-5 shadow-[0_40px_150px_rgba(0,0,0,0.68)] backdrop-blur-2xl sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.25),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.12),transparent_35%)]" />

        <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:52px_52px]" />

        <div className="presale-hero-scan pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent" />

        <div className="relative grid gap-10 xl:grid-cols-[1.04fr_.96fr] xl:items-center">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-blue-100 shadow-[0_0_30px_rgba(59,130,246,0.16)]">
              <span
                className={[
                  "h-2 w-2 rounded-full",
                  saleActive
                    ? "presale-live-dot bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.95)]"
                    : "bg-white/30",
                ].join(" ")}
              />

              KORAX Presale • BNB Chain
            </div>

            <h1 className="mt-7 text-4xl font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              Join the KRX
              <span className="block bg-gradient-to-r from-blue-100 via-white to-cyan-200 bg-clip-text text-transparent drop-shadow-[0_0_22px_rgba(59,130,246,0.48)]">
                five-stage presale.
              </span>
            </h1>

            <p className="mt-6 max-w-4xl text-base leading-8 text-white/62 sm:text-lg">
              Participate through the official KORAX presale contract on BNB
              Chain. The sale uses five progressive pricing stages and reads
              current allocation data directly from the deployed contract.
            </p>

            <div className="mt-7 flex flex-wrap gap-2.5">
              <StatusPill
                active={saleActive}
                tone={saleActive ? "cyan" : "slate"}
              >
                Sale {saleActive ? "Active" : "Closed"}
              </StatusPill>

              <StatusPill active tone="blue">
                Stage {stage} / 5
              </StatusPill>

              <StatusPill active tone="blue">
                BNB Chain
              </StatusPill>

              <StatusPill
                active={Boolean(walletAddress)}
                tone="slate"
              >
                {walletAddress
                  ? shortenAddress(walletAddress)
                  : "Wallet Not Connected"}
              </StatusPill>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                {
                  title: "On-chain sale data",
                  description:
                    "Stage, sold amount, remaining allocation, and sale status come from the presale contract.",
                },
                {
                  title: "Three payment routes",
                  description:
                    "Purchase using BNB, USDT, or USDC through the supported contract functions.",
                },
                {
                  title: "Progressive stage pricing",
                  description:
                    "The KRX price increases from $0.05 in Stage 1 to $0.13 in Stage 5.",
                },
                {
                  title: "Post-presale claim",
                  description:
                    "Purchased KRX becomes available through the claim portal after official activation.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"
                >
                  <div className="text-sm font-black text-white">
                    {item.title}
                  </div>

                  <p className="mt-2 text-xs leading-6 text-white/45">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="#purchase-panel"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-blue-500 px-6 py-3 text-sm font-black text-white shadow-[0_0_40px_rgba(59,130,246,0.34)] transition duration-300 hover:-translate-y-0.5 hover:bg-blue-400"
              >
                Buy KRX
                <span className="ml-2">↓</span>
              </a>

              <a
                href={PRESALE_BSCSCAN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-blue-400/25 bg-blue-500/10 px-6 py-3 text-sm font-black text-blue-100 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-500/20 hover:text-white"
              >
                Verify Contract ↗
              </a>

              <Link
                href="/docs"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-black/30 px-6 py-3 text-sm font-bold text-white/75 transition duration-300 hover:-translate-y-0.5 hover:bg-white/[0.07] hover:text-white"
              >
                Read Documentation
              </Link>
            </div>
          </div>

          <PresaleCoreVisual
            stage={stage}
            stagePrice={stagePrice}
            progress={totalAllocationProgress}
            saleActive={saleActive}
            totalSold={totalSoldDisplay}
          />
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[28px] border border-blue-400/20 bg-blue-500/[0.07] px-5 py-4 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(59,130,246,0.08),transparent,rgba(34,211,238,0.07))]" />

        <div className="relative grid gap-4 text-center sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Sale Status",
              value: saleActive ? "ACTIVE" : "CLOSED",
            },
            {
              label: "Current Stage",
              value: `${stage} / 5`,
            },
            {
              label: "Current Price",
              value: `$${stagePrice.toFixed(2)}`,
            },
            {
              label: "Last Update",
              value: lastUpdated || "LOADING",
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

      {dataError ? (
        <NoticeBox
          notice={{
            type: "error",
            message: dataError,
          }}
        />
      ) : null}

      {notice ? <NoticeBox notice={notice} /> : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          number="01"
          label="Current Stage"
          value={
            dataLoading ? "Loading..." : `${stage} / 5`
          }
          description="Current presale stage returned by the deployed KORAX contract."
          active
        />

        <MetricCard
          number="02"
          label="Current Price"
          value={
            dataLoading
              ? "Loading..."
              : `$${stagePrice.toFixed(2)}`
          }
          description="Current USD-denominated KRX price for the active stage."
        />

        <MetricCard
          number="03"
          label="Total Sold"
          value={
            dataLoading
              ? "Loading..."
              : `${totalSoldDisplay} KRX`
          }
          description="Total KRX recorded as sold across all presale stages."
        />

        <MetricCard
          number="04"
          label="Stage Remaining"
          value={
            dataLoading
              ? "Loading..."
              : `${stageRemainingDisplay} KRX`
          }
          description="Remaining KRX allocation in the current sale stage."
        />
      </section>

      <SectionBox
        eyebrow="Live Contract Progress"
        title="KRX presale allocation."
        description="The progress bar is calculated from total KRX sold compared with the total presale allocation returned by the contract."
        right={
          <StatusPill
            active={saleActive}
            tone={saleActive ? "cyan" : "slate"}
          >
            {saleActive ? "Sale Active" : "Sale Closed"}
          </StatusPill>
        }
      >
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between gap-4 text-sm text-white/55">
            <span>
              {totalSoldDisplay} of {totalForSaleDisplay} KRX
            </span>

            <span className="font-black text-white">
              {totalAllocationProgress.toFixed(2)}%
            </span>
          </div>

          <div className="relative overflow-hidden rounded-full border border-white/10 bg-black/40 p-1">
            <div
              className="presale-progress-bar h-5 rounded-full bg-gradient-to-r from-blue-600 via-blue-300 to-cyan-200 shadow-[0_0_28px_rgba(59,130,246,0.38)] transition-all duration-700"
              style={{
                width: `${totalAllocationProgress}%`,
              }}
            />
          </div>

          <div className="mt-3 flex justify-between text-[10px] font-black text-white/30">
            <span>0 KRX</span>
            <span>25M KRX</span>
            <span>50M KRX</span>
          </div>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
              Sale Status
            </div>

            <div
              className={[
                "mt-2 font-black",
                saleActive ? "text-cyan-100" : "text-white",
              ].join(" ")}
            >
              {saleActive ? "Active" : "Closed"}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
              Claim Status
            </div>

            <div
              className={[
                "mt-2 font-black",
                claimEnabled
                  ? "text-cyan-100"
                  : "text-white",
              ].join(" ")}
            >
              {claimEnabled
                ? "Enabled"
                : "Not Enabled Yet"}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
              Claim Start
            </div>

            <div className="mt-2 text-sm font-black leading-6 text-white">
              {claimStart}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
              Anti-Bot
            </div>

            <div className="mt-2 font-black text-white">
              {antiBotEnabled
                ? `Enabled • ${buyCooldown}s`
                : "Disabled"}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => refreshPresaleData(false)}
          disabled={dataLoading}
          className="mt-5 rounded-2xl border border-blue-400/20 bg-blue-500/10 px-5 py-3 text-sm font-black text-blue-100 transition hover:bg-blue-500/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
        >
          {dataLoading
            ? "Refreshing Presale Data..."
            : "Refresh Contract Data"}
        </button>
      </SectionBox>

      <section
        id="purchase-panel"
        className="scroll-mt-28 grid gap-6 xl:grid-cols-[1fr_430px]"
      >
        <SectionBox
          eyebrow="Purchase Panel"
          title="Buy KRX during the presale."
          description="Select your payment asset, enter the amount you want to spend, review the estimated KRX output, and approve the wallet transaction."
          accent
        >
          <div className="mt-7">
            <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder={`Enter ${selectedCurrency} amount`}
                  value={amount}
                  onChange={(event) =>
                    updateAmount(event.target.value)
                  }
                  className={`${inputClass} pr-20`}
                />

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-blue-100">
                  {selectedCurrency}
                </span>
              </div>

              <select
                value={previewMode}
                onChange={(event) =>
                  setPreviewMode(
                    event.target.value as PayMode
                  )
                }
                className={selectClass}
              >
                <option value="usdt">Pay with USDT</option>
                <option value="usdc">Pay with USDC</option>
                <option value="bnb">Pay with BNB</option>
              </select>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  type="button"
                  onClick={() => setAmount(quickAmount)}
                  className={[
                    "rounded-xl border px-3 py-2 text-xs font-bold transition",
                    amount === quickAmount
                      ? "border-blue-400/30 bg-blue-500/15 text-blue-100"
                      : "border-white/10 bg-white/[0.04] text-white/55 hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                >
                  {quickAmount} {selectedCurrency}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setAmount("")}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-white/45 transition hover:bg-white/10 hover:text-white"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-[28px] border border-blue-400/20 bg-blue-500/[0.08] p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.21em] text-white/38">
                  Estimated KRX
                </div>

                <div className="mt-3 break-words text-3xl font-black text-blue-100 sm:text-4xl">
                  {previewLoading
                    ? "Calculating..."
                    : preview}
                </div>
              </div>

              <StatusPill
                active={amountIsValid && !previewError}
                tone="blue"
              >
                Contract Preview
              </StatusPill>
            </div>

            <p className="mt-4 text-xs leading-6 text-white/45">
              This estimate comes from the presale preview function and can
              change if stage availability or contract state changes before
              your transaction is confirmed.
            </p>

            {previewError ? (
              <div className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs leading-6 text-red-100">
                {previewError}
              </div>
            ) : null}
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <button
              type="button"
              onClick={buyWithBNB}
              disabled={
                !saleActive ||
                !amountIsValid ||
                busy !== ""
              }
              className="rounded-2xl bg-[#f3ba2f] px-5 py-4 text-sm font-black text-black shadow-[0_0_34px_rgba(243,186,47,0.27)] transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy === "bnb"
                ? "Processing BNB..."
                : "Buy with BNB"}
            </button>

            <button
              type="button"
              onClick={() =>
                approveAndBuyStable("usdt")
              }
              disabled={
                !saleActive ||
                !amountIsValid ||
                busy !== ""
              }
              className="rounded-2xl bg-[#26a17b] px-5 py-4 text-sm font-black text-white shadow-[0_0_34px_rgba(38,161,123,0.25)] transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy === "usdt"
                ? "Processing USDT..."
                : "Buy with USDT"}
            </button>

            <button
              type="button"
              onClick={() =>
                approveAndBuyStable("usdc")
              }
              disabled={
                !saleActive ||
                !amountIsValid ||
                busy !== ""
              }
              className="rounded-2xl bg-[#2775ca] px-5 py-4 text-sm font-black text-white shadow-[0_0_34px_rgba(39,117,202,0.27)] transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy === "usdc"
                ? "Processing USDC..."
                : "Buy with USDC"}
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <StatusPill
              active={saleActive}
              tone={saleActive ? "cyan" : "slate"}
            >
              Presale {saleActive ? "Active" : "Closed"}
            </StatusPill>

            <StatusPill
              active={Boolean(walletAddress)}
              tone="slate"
            >
              {walletAddress
                ? `Connected ${shortenAddress(
                    walletAddress
                  )}`
                : "Connect Wallet First"}
            </StatusPill>

            <StatusPill
              active={chainId === BSC_CHAIN_ID}
              tone="blue"
            >
              {chainId === BSC_CHAIN_ID
                ? "BNB Chain"
                : isConnected
                  ? "Wrong Network"
                  : "Network Offline"}
            </StatusPill>
          </div>

          <div className="mt-5 rounded-2xl border border-amber-300/15 bg-amber-300/[0.045] px-4 py-3 text-xs leading-6 text-white/45">
            USDT and USDC purchases may require two wallet confirmations:
            one approval transaction and one purchase transaction. Each
            confirmed transaction requires BNB for the network gas fee.
          </div>
        </SectionBox>

        <SectionBox
          eyebrow="Presale Details"
          title="Current sale conditions."
          description="Important information about pricing, payment assets, claiming, and contract configuration."
        >
          <div className="mt-7 grid gap-3">
            <div className="rounded-2xl border border-blue-400/20 bg-blue-500/[0.07] p-4">
              <div className="text-[9px] font-black uppercase tracking-[0.19em] text-white/35">
                Current Price
              </div>

              <div className="mt-2 text-2xl font-black text-blue-100">
                ${stagePrice.toFixed(2)}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="text-[9px] font-black uppercase tracking-[0.19em] text-white/35">
                Planned Listing Target
              </div>

              <div className="mt-2 text-2xl font-black text-white">
                $0.15
              </div>

              <p className="mt-2 text-xs leading-6 text-white/40">
                This is a target and not a guaranteed future market price or
                guaranteed exchange listing.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="text-[9px] font-black uppercase tracking-[0.19em] text-white/35">
                Accepted Payments
              </div>

              <div className="mt-2 text-lg font-black text-white">
                BNB • USDT • USDC
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="text-[9px] font-black uppercase tracking-[0.19em] text-white/35">
                Claim Schedule
              </div>

              <div className="mt-2 text-lg font-black text-white">
                Four releases • 25% each
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="text-[9px] font-black uppercase tracking-[0.19em] text-white/35">
                Buyer Gas Currency
              </div>

              <div className="mt-2 text-lg font-black text-white">
                BNB
              </div>
            </div>

            <button
              type="button"
              onClick={() => refreshPresaleData(false)}
              disabled={dataLoading}
              className="rounded-2xl border border-blue-400/20 bg-blue-500/10 px-5 py-3 text-sm font-black text-blue-100 transition hover:bg-blue-500/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
            >
              {dataLoading
                ? "Refreshing..."
                : "Refresh Presale Data"}
            </button>
          </div>
        </SectionBox>
      </section>

      <SectionBox
        eyebrow="KRX Presale Stages"
        title="Five progressive pricing stages."
        description="Each stage contains 10,000,000 KRX. Stage progress below is calculated from the real total sold amount instead of using decorative percentages."
        right={
          <div className="rounded-2xl border border-white/10 bg-black/25 px-5 py-3 text-right">
            <div className="text-[9px] font-black uppercase tracking-[0.19em] text-white/35">
              Listing Target
            </div>

            <div className="mt-1 text-xl font-black text-white">
              $0.15
            </div>
          </div>
        }
      >
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {STAGE_PRICES.map((price, index) => {
            const stageProgress = calculateStageProgress(
              totalSoldRaw,
              index
            );

            const stageCompleted = stageProgress >= 100;

            const stageActive =
              saleActive &&
              currentStageIndex === index &&
              !stageCompleted;

            const stageClosedCurrent =
              !saleActive &&
              currentStageIndex === index &&
              !stageCompleted;

            return (
              <article
                key={price}
                className={[
                  "presale-stage-card overflow-hidden rounded-[27px] border p-5",
                  stageActive
                    ? "border-blue-400/30 bg-blue-500/[0.09]"
                    : stageCompleted
                      ? "border-cyan-300/20 bg-cyan-400/[0.065]"
                      : "border-white/10 bg-black/25",
                ].join(" ")}
              >
                <div className="relative flex items-center justify-between gap-3">
                  <div className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40">
                    Stage {index + 1}
                  </div>

                  {stageActive ? (
                    <StatusPill active tone="blue">
                      Current
                    </StatusPill>
                  ) : stageCompleted ? (
                    <StatusPill active tone="cyan">
                      Completed
                    </StatusPill>
                  ) : stageClosedCurrent ? (
                    <StatusPill tone="slate">
                      Closed
                    </StatusPill>
                  ) : (
                    <StatusPill tone="slate">
                      Upcoming
                    </StatusPill>
                  )}
                </div>

                <div className="relative mt-5 text-3xl font-black text-white">
                  ${price.toFixed(2)}
                </div>

                <div className="relative mt-2 text-sm font-semibold text-white/50">
                  {STAGE_CAPS[index].toLocaleString("en-US")} KRX
                </div>

                <div className="relative mt-5">
                  <div className="mb-2 flex items-center justify-between text-[10px] font-black text-white/35">
                    <span>Progress</span>
                    <span>{stageProgress.toFixed(2)}%</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={[
                        "h-full rounded-full transition-all duration-700",
                        stageActive
                          ? "bg-gradient-to-r from-blue-500 via-blue-200 to-cyan-200"
                          : stageCompleted
                            ? "bg-cyan-300/70"
                            : "bg-white/15",
                      ].join(" ")}
                      style={{
                        width: `${stageProgress}%`,
                      }}
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </SectionBox>

      <SectionBox
        eyebrow="After the Presale"
        title="From purchase to KORAX builder access."
        description="KRX utility continues through claim, staking, project creation, website generation, and launch infrastructure."
        accent
      >
        <div className="relative mt-8 grid gap-4 lg:grid-cols-4">
          <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-gradient-to-r from-blue-400/70 via-blue-400/20 to-cyan-300/20 lg:block" />

          {[
            {
              number: "01",
              title: "Purchase KRX",
              description:
                "Participate during the active presale using BNB, USDT, or USDC.",
              href: "#purchase-panel",
            },
            {
              number: "02",
              title: "Claim Allocation",
              description:
                "Claim purchased KRX through four scheduled 25% releases after activation.",
              href: "/claim",
            },
            {
              number: "03",
              title: "Stake KRX",
              description:
                "Use fixed staking plans, including the qualifying 12-month builder access plan.",
              href: "/staking",
            },
            {
              number: "04",
              title: "Build & Launch",
              description:
                "An eligible 1,500 KRX 12-month stake provides one project slot according to contract logic.",
              href: "/ai",
            },
          ].map((item, index) => (
            <Link
              key={item.number}
              href={item.href}
              className="presale-card group rounded-[28px] border border-white/10 bg-black/25 p-5"
            >
              <div
                className={[
                  "relative z-10 flex h-14 w-14 items-center justify-center rounded-full border text-sm font-black",
                  index === 0
                    ? "border-blue-300/35 bg-blue-500 text-white"
                    : "border-blue-400/20 bg-[#061126] text-blue-100",
                ].join(" ")}
              >
                {item.number}
              </div>

              <h3 className="relative mt-5 text-lg font-black text-white">
                {item.title}
              </h3>

              <p className="relative mt-3 text-sm leading-7 text-white/52">
                {item.description}
              </p>

              <div className="relative mt-5 text-sm font-black text-blue-100 transition group-hover:text-white">
                Continue
                <span className="ml-2">→</span>
              </div>
            </Link>
          ))}
        </div>
      </SectionBox>

      <SectionBox
        eyebrow="Contract Transparency"
        title="Verify the configured presale assets."
        description="The presale reads supported USDT and USDC token addresses directly from the deployed contract."
      >
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <ContractAddressCard
            label="Presale Contract"
            address={PRESALE_ADDRESS}
            copied={copiedTarget === "presale"}
            onCopy={() =>
              copyValue("presale", PRESALE_ADDRESS)
            }
            explorerUrl={PRESALE_BSCSCAN_URL}
          />

          <ContractAddressCard
            label="Contract USDT"
            address={contractUsdtAddress}
            copied={copiedTarget === "usdt"}
            onCopy={() =>
              copyValue("usdt", contractUsdtAddress)
            }
            explorerUrl={`https://bscscan.com/token/${contractUsdtAddress}`}
          />

          <ContractAddressCard
            label="Contract USDC"
            address={contractUsdcAddress}
            copied={copiedTarget === "usdc"}
            onCopy={() =>
              copyValue("usdc", contractUsdcAddress)
            }
            explorerUrl={`https://bscscan.com/token/${contractUsdcAddress}`}
          />
        </div>
      </SectionBox>

      <section className="rounded-[24px] border border-amber-300/15 bg-amber-300/[0.045] px-5 py-4 text-xs leading-6 text-white/45">
        <span className="font-black text-amber-100">
          Presale and security notice:
        </span>{" "}
        KRX is a crypto asset and can lose value. Presale participation does
        not guarantee profit, liquidity, exchange listing, adoption, or a
        future market price. Never share your private key or seed phrase.
        Confirm the presale address, payment token, amount, network, and wallet
        transaction before approval. Blockchain transactions are generally
        irreversible.
      </section>
    </div>
  );
}