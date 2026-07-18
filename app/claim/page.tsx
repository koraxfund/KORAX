"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ethers } from "ethers";
import { useAccount, useSwitchChain, useWalletClient } from "wagmi";

const RPC_URL = "https://bsc-dataseed.binance.org/";

const PRESALE_ADDRESS =
  process.env.NEXT_PUBLIC_PRESALE_ADDRESS?.trim() || "";

const TOKEN_ADDRESS =
  process.env.NEXT_PUBLIC_TOKEN_ADDRESS?.trim() || "";

const PRESALE_BSCSCAN_URL =
  process.env.NEXT_PUBLIC_PRESALE_BSCSCAN_URL?.trim() ||
  (PRESALE_ADDRESS
    ? `https://bscscan.com/address/${PRESALE_ADDRESS}#code`
    : "https://bscscan.com");

const TOKEN_BSCSCAN_URL = TOKEN_ADDRESS
  ? `https://bscscan.com/token/${TOKEN_ADDRESS}`
  : "https://bscscan.com";

const CLAIM_INTERVAL_SECONDS = 30 * 24 * 60 * 60;
const BSC_CHAIN_ID = 56;
const REFRESH_INTERVAL_MS = 15_000;

const presaleAbi = [
  "function saleActive() view returns (bool)",
  "function claimEnabled() view returns (bool)",
  "function claimStart() view returns (uint256)",
  "function purchased(address user) view returns (uint256)",
  "function claimed(address user) view returns (uint256)",
  "function claimableNow(address user) view returns (uint256)",
  "function vestedPercent(address user) view returns (uint256)",
  "function claim()",
];

const tokenAbi = ["function symbol() view returns (string)"];

type NoticeState = {
  type: "info" | "success" | "error" | "warning";
  message: string;
};

type VestingMilestone = {
  percentage: number;
  label: string;
  offset: number;
};

const vestingMilestones: VestingMilestone[] = [
  {
    percentage: 25,
    label: "Initial Release",
    offset: 0,
  },
  {
    percentage: 50,
    label: "Second Release",
    offset: CLAIM_INTERVAL_SECONDS,
  },
  {
    percentage: 75,
    label: "Third Release",
    offset: CLAIM_INTERVAL_SECONDS * 2,
  },
  {
    percentage: 100,
    label: "Final Release",
    offset: CLAIM_INTERVAL_SECONDS * 3,
  },
];

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

function formatTokenAmount(
  value: bigint,
  decimals = 18,
  maximumFractionDigits = 4
) {
  const numberValue = Number(ethers.formatUnits(value, decimals));

  if (!Number.isFinite(numberValue)) return "0";

  return numberValue.toLocaleString("en-US", {
    maximumFractionDigits,
  });
}

function shortenAddress(address: string) {
  if (!address || address.length < 12) return address;

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatDate(unix: bigint | number) {
  const value = typeof unix === "bigint" ? Number(unix) : unix;

  if (!value) return "Not started";

  return new Date(value * 1000).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatCountdown(secondsLeft: number) {
  if (secondsLeft <= 0) return "Now";

  const days = Math.floor(secondsLeft / 86400);
  const hours = Math.floor((secondsLeft % 86400) / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = Math.floor(secondsLeft % 60);

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  return `${hours}h ${minutes}m ${seconds}s`;
}

function getNextClaimTimestamp(
  claimStartUnix: number,
  vestedPercent: number
) {
  if (!claimStartUnix || vestedPercent >= 100) return 0;

  if (vestedPercent < 25) {
    return claimStartUnix;
  }

  if (vestedPercent < 50) {
    return claimStartUnix + CLAIM_INTERVAL_SECONDS;
  }

  if (vestedPercent < 75) {
    return claimStartUnix + CLAIM_INTERVAL_SECONDS * 2;
  }

  return claimStartUnix + CLAIM_INTERVAL_SECONDS * 3;
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

function StatusBadge({
  active,
  children,
  tone = "blue",
}: {
  active?: boolean;
  children: ReactNode;
  tone?: "blue" | "cyan" | "slate" | "amber";
}) {
  const activeStyles = {
    blue:
      "border-blue-400/30 bg-blue-500/10 text-blue-100 shadow-[0_0_22px_rgba(59,130,246,0.15)]",
    cyan:
      "border-cyan-300/25 bg-cyan-400/10 text-cyan-100 shadow-[0_0_22px_rgba(34,211,238,0.11)]",
    slate: "border-white/15 bg-white/[0.06] text-white/70",
    amber:
      "border-amber-300/25 bg-amber-300/[0.08] text-amber-100/85",
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.17em]",
        active
          ? activeStyles[tone]
          : "border-white/10 bg-white/[0.035] text-white/38",
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
        <div className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-blue-100">
          <span className="h-px w-9 bg-blue-400/70" />
          {eyebrow}
        </div>

        <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.025em] text-white sm:text-4xl">
          {title}
        </h2>

        {description ? (
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/55 sm:text-base">
            {description}
          </p>
        ) : null}
      </div>

      {right}
    </div>
  );
}

function NoticeBox({ notice }: { notice: NoticeState }) {
  const styles = {
    info: "border-blue-400/20 bg-blue-500/[0.08] text-blue-100",
    success: "border-cyan-300/20 bg-cyan-400/[0.08] text-cyan-100",
    error: "border-red-400/20 bg-red-500/10 text-red-100",
    warning: "border-amber-300/20 bg-amber-300/[0.06] text-amber-100/85",
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

function StatCard({
  number,
  label,
  value,
  description,
  highlight,
}: {
  number: string;
  label: string;
  value: string;
  description: string;
  highlight?: boolean;
}) {
  return (
    <article
      className={[
        "claim-card relative overflow-hidden rounded-[28px] border p-5 shadow-[0_20px_65px_rgba(0,0,0,0.3)] backdrop-blur-xl",
        highlight
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
            highlight
              ? "border-blue-400/25 bg-blue-500/15 text-blue-100"
              : "border-white/10 bg-black/30 text-white/45",
          ].join(" ")}
        >
          {number}
        </div>
      </div>

      <div
        className={[
          "relative mt-4 break-words text-xl font-black leading-tight sm:text-2xl",
          highlight ? "text-blue-100" : "text-white",
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

function ContractCard({
  label,
  address,
  href,
  copied,
  onCopy,
}: {
  label: string;
  address: string;
  href: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <article className="claim-card rounded-[26px] border border-white/10 bg-black/30 p-5">
      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
        {label}
      </div>

      <div className="mt-3 break-all rounded-2xl border border-white/10 bg-black/35 p-3 font-mono text-xs leading-6 text-white/70">
        {address || "Contract address is not configured"}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onCopy}
          disabled={!address}
          className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-bold text-white/70 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
        >
          {copied ? "Copied" : "Copy Address"}
        </button>

        <a
          href={href}
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

function ClaimCoreVisual({
  saleActive,
  claimEnabled,
  tokenSymbol,
  vestedPercent,
}: {
  saleActive: boolean;
  claimEnabled: boolean;
  tokenSymbol: string;
  vestedPercent: number;
}) {
  return (
    <div className="claim-command-core relative min-h-[500px] overflow-hidden rounded-[36px] border border-white/10 bg-[#020611] shadow-[0_35px_120px_rgba(0,0,0,0.62)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.28),transparent_32%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.13),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.10),transparent_36%)]" />

      <div className="claim-core-grid pointer-events-none absolute inset-0 opacity-[0.075] [background-image:linear-gradient(rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="claim-orbit claim-orbit-one pointer-events-none absolute left-1/2 top-[43%] h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/15" />

      <div className="claim-orbit claim-orbit-two pointer-events-none absolute left-1/2 top-[43%] h-[270px] w-[270px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />

      <div className="claim-orbit claim-orbit-three pointer-events-none absolute left-1/2 top-[43%] h-[205px] w-[205px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />

      <div className="claim-core-glow pointer-events-none absolute left-1/2 top-[43%] h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/25 blur-3xl" />

      <div className="absolute left-1/2 top-[43%] z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <img
          src="/Korax-logo.png"
          alt="KORAX official logo"
          draggable={false}
          className="claim-logo-spin h-44 w-44 bg-transparent object-contain drop-shadow-[0_0_44px_rgba(59,130,246,0.95)] sm:h-52 sm:w-52"
        />

        <img
          src="/korax-wordmark.png"
          alt="KORAX"
          draggable={false}
          className="claim-wordmark-float mt-3 h-10 w-auto max-w-[230px] bg-transparent object-contain drop-shadow-[0_0_24px_rgba(59,130,246,0.85)] sm:h-12 sm:max-w-[280px]"
        />
      </div>

      <div className="claim-data-chip absolute left-5 top-5 hidden min-w-[145px] rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur-xl sm:block">
        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
          Presale
        </div>

        <div className="mt-2 font-black text-white">
          {saleActive ? "Active" : "Closed"}
        </div>

        <div className="mt-1 text-xs text-white/42">
          {saleActive ? "Claim follows presale" : "Presale completed"}
        </div>
      </div>

      <div className="claim-data-chip claim-data-delay absolute right-5 top-5 hidden min-w-[145px] rounded-2xl border border-white/10 bg-black/50 p-4 text-right backdrop-blur-xl sm:block">
        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
          Claim Engine
        </div>

        <div
          className={[
            "mt-2 font-black",
            claimEnabled ? "text-cyan-100" : "text-white",
          ].join(" ")}
        >
          {claimEnabled ? "Enabled" : "Locked"}
        </div>

        <div className="mt-1 text-xs text-white/42">
          On-chain status
        </div>
      </div>

      <div className="claim-data-chip claim-data-two absolute bottom-28 left-5 hidden min-w-[145px] rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur-xl sm:block">
        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
          Asset
        </div>

        <div className="mt-2 font-black text-blue-100">{tokenSymbol}</div>

        <div className="mt-1 text-xs text-white/42">
          BNB Chain token
        </div>
      </div>

      <div className="claim-data-chip claim-data-three absolute bottom-28 right-5 hidden min-w-[145px] rounded-2xl border border-white/10 bg-black/50 p-4 text-right backdrop-blur-xl sm:block">
        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
          Unlocked
        </div>

        <div className="mt-2 font-black text-cyan-100">
          {vestedPercent}%
        </div>

        <div className="mt-1 text-xs text-white/42">
          Vesting progress
        </div>
      </div>

      <div className="absolute bottom-5 left-5 right-5 z-20 overflow-hidden rounded-[24px] border border-blue-400/20 bg-blue-500/10 p-4 backdrop-blur-xl">
        <div className="claim-panel-scan pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-blue-300/10 to-transparent" />

        <div className="relative flex items-center justify-between gap-4">
          <div>
            <div className="text-[9px] font-black uppercase tracking-[0.24em] text-white/38">
              KORAX Claim Protocol
            </div>

            <div className="mt-1 text-lg font-black text-white">
              25% scheduled releases
            </div>
          </div>

          <div
            className={[
              "flex h-11 w-11 items-center justify-center rounded-full border",
              claimEnabled
                ? "border-cyan-300/30 bg-cyan-400/10"
                : "border-white/10 bg-black/25",
            ].join(" ")}
          >
            <span
              className={[
                "h-3 w-3 rounded-full",
                claimEnabled
                  ? "claim-live-dot bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.95)]"
                  : "bg-white/30",
              ].join(" ")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClaimPage() {
  const [mounted, setMounted] = useState(false);

  const [walletAddress, setWalletAddress] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("KRX");

  const [saleActive, setSaleActive] = useState(false);
  const [claimEnabled, setClaimEnabled] = useState(false);
  const [claimStart, setClaimStart] = useState("Not started");
  const [claimStartUnix, setClaimStartUnix] = useState(0);

  const [purchased, setPurchased] = useState<bigint>(0n);
  const [claimed, setClaimed] = useState<bigint>(0n);
  const [claimableNow, setClaimableNow] = useState<bigint>(0n);
  const [vestedPercent, setVestedPercent] = useState(0);

  const [busy, setBusy] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState("");
  const [notice, setNotice] = useState<NoticeState | null>(null);

  const [copiedTarget, setCopiedTarget] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  const [nowTs, setNowTs] = useState(
    Math.floor(Date.now() / 1000)
  );

  const { address, isConnected, chainId } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { switchChainAsync } = useSwitchChain();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNowTs(Math.floor(Date.now() / 1000));
    }, 1000);

    return () => window.clearInterval(interval);
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

  async function copyContractAddress(
    target: string,
    value: string
  ) {
    if (!value) {
      setNotice({
        type: "error",
        message: "The contract address is not configured.",
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

  async function getConnectedBrowserProvider() {
    if (!isConnected || !walletClient || !address) {
      throw new Error("Connect your wallet from the top bar first.");
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

    const eip1193Provider = makeEip1193Provider(walletClient);

    return new ethers.BrowserProvider(eip1193Provider as any);
  }

  async function loadClaimData(
    currentWallet?: string,
    silent = false
  ) {
    if (!silent) {
      setDataLoading(true);
    }

    try {
      setDataError("");

      if (!PRESALE_ADDRESS || !ethers.isAddress(PRESALE_ADDRESS)) {
        throw new Error(
          "The presale contract address is not configured correctly."
        );
      }

      const rpcProvider = new ethers.JsonRpcProvider(RPC_URL);

      const presale = new ethers.Contract(
        PRESALE_ADDRESS,
        presaleAbi,
        rpcProvider
      );

      let symbol = "KRX";

      if (TOKEN_ADDRESS && ethers.isAddress(TOKEN_ADDRESS)) {
        try {
          const token = new ethers.Contract(
            TOKEN_ADDRESS,
            tokenAbi,
            rpcProvider
          );

          symbol = String(await token.symbol());
        } catch {
          symbol = "KRX";
        }
      }

      const [
        saleActiveRaw,
        claimEnabledRaw,
        claimStartRaw,
      ] = await Promise.all([
        presale.saleActive(),
        presale.claimEnabled(),
        presale.claimStart(),
      ]);

      const claimStartNumber = Number(claimStartRaw);

      setSaleActive(Boolean(saleActiveRaw));
      setClaimEnabled(Boolean(claimEnabledRaw));
      setClaimStartUnix(claimStartNumber);
      setClaimStart(formatDate(claimStartNumber));
      setTokenSymbol(symbol);

      const user = currentWallet || walletAddress;

      if (user && ethers.isAddress(user)) {
        const [
          purchasedRaw,
          claimedRaw,
          claimableRaw,
          vestedRaw,
        ] = await Promise.all([
          presale.purchased(user),
          presale.claimed(user),
          presale.claimableNow(user),
          presale.vestedPercent(user),
        ]);

        setPurchased(BigInt(purchasedRaw.toString()));
        setClaimed(BigInt(claimedRaw.toString()));
        setClaimableNow(BigInt(claimableRaw.toString()));
        setVestedPercent(Number(vestedRaw));
      } else {
        setPurchased(0n);
        setClaimed(0n);
        setClaimableNow(0n);
        setVestedPercent(0);
      }

      setLastUpdated(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    } catch (error) {
      console.error("Failed to load claim data:", error);

      setDataError(
        getErrorMessage(error, "Failed to load claim data.")
      );
    } finally {
      if (!silent) {
        setDataLoading(false);
      }
    }
  }

  useEffect(() => {
    if (!mounted) return;

    void loadClaimData(walletAddress, false);

    const interval = window.setInterval(() => {
      void loadClaimData(walletAddress, true);
    }, REFRESH_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [mounted, walletAddress]);

  async function handleClaim() {
    if (busy) return;

    setBusy(true);
    setNotice(null);

    try {
      if (!walletAddress) {
        throw new Error("Connect your wallet first.");
      }

      if (!claimEnabled) {
        throw new Error("The claim system is not enabled yet.");
      }

      if (!PRESALE_ADDRESS || !ethers.isAddress(PRESALE_ADDRESS)) {
        throw new Error(
          "The presale contract address is not configured correctly."
        );
      }

      const browserProvider =
        await getConnectedBrowserProvider();

      const signer = await browserProvider.getSigner();

      const presale = new ethers.Contract(
        PRESALE_ADDRESS,
        presaleAbi,
        signer
      );

      const liveClaimable = await presale.claimableNow(
        walletAddress
      );

      const liveClaimableAmount = BigInt(
        liveClaimable.toString()
      );

      if (liveClaimableAmount <= 0n) {
        throw new Error(
          "There are no tokens available to claim right now."
        );
      }

      setNotice({
        type: "info",
        message:
          "The claim transaction was submitted. Waiting for blockchain confirmation...",
      });

      const transaction = await presale.claim();
      const receipt = await transaction.wait();

      setNotice({
        type: "success",
        message: `Claim completed successfully. Transaction: ${shortenAddress(
          receipt.hash
        )}`,
      });

      await loadClaimData(walletAddress, true);
    } catch (error) {
      console.error("Claim failed:", error);

      setNotice({
        type: "error",
        message: getErrorMessage(error, "Claim failed."),
      });
    } finally {
      setBusy(false);
    }
  }

  const remaining =
    purchased > claimed ? purchased - claimed : 0n;

  const canClaim =
    Boolean(walletAddress) &&
    claimEnabled &&
    claimableNow > 0n &&
    !busy;

  const nextClaimTimestamp = getNextClaimTimestamp(
    claimStartUnix,
    vestedPercent
  );

  const nextClaimCountdown = (() => {
    if (!claimEnabled) {
      if (claimStartUnix > nowTs) {
        return formatCountdown(claimStartUnix - nowTs);
      }

      return "Waiting for activation";
    }

    if (vestedPercent >= 100) {
      return "Schedule completed";
    }

    if (
      nextClaimTimestamp &&
      nextClaimTimestamp > nowTs
    ) {
      return formatCountdown(nextClaimTimestamp - nowTs);
    }

    return "Available now";
  })();

  const nextClaimDate =
    nextClaimTimestamp > 0
      ? formatDate(nextClaimTimestamp)
      : vestedPercent >= 100
        ? "Completed"
        : "Not scheduled";

  const claimButtonLabel = (() => {
    if (busy) return "Processing Claim...";
    if (!walletAddress) return "Connect Wallet First";
    if (saleActive && !claimEnabled) {
      return "Available After Presale";
    }
    if (!claimEnabled) return "Claim Locked";
    if (claimableNow <= 0n) return "Nothing Claimable";
    return `Claim ${formatTokenAmount(
      claimableNow
    )} ${tokenSymbol}`;
  })();

  const nextMilestone =
    vestingMilestones.find(
      (milestone) =>
        milestone.percentage > vestedPercent
    )?.percentage || 100;

  if (!mounted) return null;

  return (
    <div className="space-y-8 overflow-hidden">
      <style>{`
        @keyframes claimLogoSpin {
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

        @keyframes claimWordmarkFloat {
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

        @keyframes claimOrbit {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }

          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes claimOrbitReverse {
          from {
            transform: translate(-50%, -50%) rotate(360deg);
          }

          to {
            transform: translate(-50%, -50%) rotate(0deg);
          }
        }

        @keyframes claimCoreGlow {
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

        @keyframes claimGridMove {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(-16px, -16px, 0);
          }
        }

        @keyframes claimScan {
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

        @keyframes claimDataFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-7px);
          }
        }

        @keyframes claimLivePulse {
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

        @keyframes claimProgressGlow {
          0%,
          100% {
            filter: brightness(1);
          }

          50% {
            filter: brightness(1.2);
          }
        }

        .claim-card {
          position: relative;
          transform-style: preserve-3d;
          transition:
            transform 230ms ease,
            border-color 230ms ease,
            background-color 230ms ease,
            box-shadow 230ms ease;
        }

        .claim-card::before {
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

        .claim-card:hover {
          transform: translateY(-6px);
          border-color: rgba(96, 165, 250, 0.35);
          box-shadow: 0 30px 90px rgba(37, 99, 235, 0.13);
        }

        .claim-card:hover::before {
          opacity: 1;
        }

        .claim-logo-spin {
          transform-style: preserve-3d;
          animation: claimLogoSpin 9s linear infinite;
          will-change: transform;
          backface-visibility: visible;
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .claim-wordmark-float {
          animation: claimWordmarkFloat 4.5s ease-in-out infinite;
          will-change: transform;
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .claim-orbit-one {
          animation: claimOrbit 20s linear infinite;
        }

        .claim-orbit-two {
          animation: claimOrbitReverse 16s linear infinite;
        }

        .claim-orbit-three {
          animation: claimOrbit 12s linear infinite;
        }

        .claim-orbit::before,
        .claim-orbit::after {
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

        .claim-orbit::before {
          left: 50%;
          top: -4px;
          transform: translateX(-50%);
        }

        .claim-orbit::after {
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
        }

        .claim-core-glow {
          animation: claimCoreGlow 3.8s ease-in-out infinite;
        }

        .claim-core-grid {
          animation: claimGridMove 10s ease-in-out infinite;
        }

        .claim-data-chip {
          animation: claimDataFloat 5s ease-in-out infinite;
        }

        .claim-data-delay {
          animation-delay: 0.7s;
        }

        .claim-data-two {
          animation-delay: 1.4s;
        }

        .claim-data-three {
          animation-delay: 2s;
        }

        .claim-panel-scan,
        .claim-hero-scan {
          animation: claimScan 4.8s ease-in-out infinite;
        }

        .claim-live-dot {
          animation: claimLivePulse 1.7s ease-in-out infinite;
        }

        .claim-progress-bar {
          animation: claimProgressGlow 3s ease-in-out infinite;
        }

        @media (max-width: 640px) {
          .claim-command-core {
            min-height: 440px;
          }

          .claim-orbit-one {
            height: 280px;
            width: 280px;
          }

          .claim-orbit-two {
            height: 220px;
            width: 220px;
          }

          .claim-orbit-three {
            height: 168px;
            width: 168px;
          }
        }

        @media (hover: none) {
          .claim-card:hover {
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .claim-logo-spin,
          .claim-wordmark-float,
          .claim-orbit-one,
          .claim-orbit-two,
          .claim-orbit-three,
          .claim-core-glow,
          .claim-core-grid,
          .claim-data-chip,
          .claim-panel-scan,
          .claim-hero-scan,
          .claim-live-dot,
          .claim-progress-bar {
            animation: none;
          }

          .claim-card:hover {
            transform: none;
          }
        }
      `}</style>

      <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[#030711]/88 p-5 shadow-[0_40px_150px_rgba(0,0,0,0.68)] backdrop-blur-2xl sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.25),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.12),transparent_35%)]" />

        <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:52px_52px]" />

        <div className="claim-hero-scan pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent" />

        <div className="relative grid gap-10 xl:grid-cols-[1.04fr_.96fr] xl:items-center">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-blue-100 shadow-[0_0_30px_rgba(59,130,246,0.16)]">
              <span
                className={[
                  "h-2 w-2 rounded-full",
                  claimEnabled
                    ? "claim-live-dot bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.95)]"
                    : "bg-blue-300/55",
                ].join(" ")}
              />

              KORAX Claim Portal
            </div>

            <h1 className="mt-7 text-4xl font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              Claim your purchased
              <span className="block bg-gradient-to-r from-blue-100 via-white to-cyan-200 bg-clip-text text-transparent drop-shadow-[0_0_22px_rgba(59,130,246,0.48)]">
                KRX allocation.
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-white/62 sm:text-lg">
              The KORAX Claim Portal reads purchased, unlocked, claimed, and
              claimable balances directly from the official BNB Chain presale
              contract.
            </p>

            <div className="mt-7 flex flex-wrap gap-2.5">
              <StatusBadge
                active={!saleActive}
                tone={saleActive ? "amber" : "cyan"}
              >
                Presale {saleActive ? "Active" : "Closed"}
              </StatusBadge>

              <StatusBadge
                active={claimEnabled}
                tone="cyan"
              >
                Claim {claimEnabled ? "Enabled" : "Locked"}
              </StatusBadge>

              <StatusBadge active tone="blue">
                BNB Chain
              </StatusBadge>

              <StatusBadge
                active={Boolean(walletAddress)}
                tone="slate"
              >
                {walletAddress
                  ? shortenAddress(walletAddress)
                  : "Wallet Not Connected"}
              </StatusBadge>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                {
                  title: "On-chain balances",
                  text: "Purchase and claim information is read directly from the configured presale contract.",
                },
                {
                  title: "Scheduled vesting",
                  text: "KRX unlocks through four scheduled 25% vesting releases.",
                },
                {
                  title: "User-controlled wallet",
                  text: "The connected wallet approves the claim transaction and pays the BNB gas fee.",
                },
                {
                  title: "Automatic updates",
                  text: "Claim information is refreshed automatically every 15 seconds.",
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
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <ClaimCoreVisual
            saleActive={saleActive}
            claimEnabled={claimEnabled}
            tokenSymbol={tokenSymbol}
            vestedPercent={vestedPercent}
          />
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[28px] border border-blue-400/20 bg-blue-500/[0.07] px-5 py-4 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(59,130,246,0.08),transparent,rgba(34,211,238,0.07))]" />

        <div className="relative grid gap-4 text-center sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Presale Status",
              value: saleActive ? "ACTIVE" : "CLOSED",
            },
            {
              label: "Claim Status",
              value: claimEnabled ? "ENABLED" : "LOCKED",
            },
            {
              label: "Vesting",
              value: "4 × 25%",
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
        <StatCard
          number="01"
          label="Purchased"
          value={
            dataLoading
              ? "Loading..."
              : `${formatTokenAmount(purchased)} ${tokenSymbol}`
          }
          description="Total KRX allocated to the connected wallet through the presale contract."
        />

        <StatCard
          number="02"
          label="Claimable Now"
          value={
            dataLoading
              ? "Loading..."
              : `${formatTokenAmount(claimableNow)} ${tokenSymbol}`
          }
          description="Tokens currently unlocked and available for an on-chain claim transaction."
          highlight={claimableNow > 0n}
        />

        <StatCard
          number="03"
          label="Already Claimed"
          value={
            dataLoading
              ? "Loading..."
              : `${formatTokenAmount(claimed)} ${tokenSymbol}`
          }
          description="The amount previously claimed by the connected wallet."
        />

        <StatCard
          number="04"
          label="Remaining Allocation"
          value={
            dataLoading
              ? "Loading..."
              : `${formatTokenAmount(remaining)} ${tokenSymbol}`
          }
          description="Purchased KRX that has not yet been claimed."
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.12fr_.88fr]">
        <section className="relative overflow-hidden rounded-[36px] border border-blue-400/20 bg-[#030711]/82 p-5 shadow-[0_30px_110px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-7">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.16),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.08),transparent_35%)]" />

          <div className="relative">
            <SectionHeading
              eyebrow="Claim Action"
              title="Release your available KRX."
              description="The button becomes active only when claim is enabled, the wallet is connected, and the contract reports a positive claimable balance."
              right={
                <StatusBadge
                  active={canClaim}
                  tone={canClaim ? "cyan" : "slate"}
                >
                  {canClaim ? "Ready to Claim" : "Not Available"}
                </StatusBadge>
              }
            />

            <div className="mt-7 rounded-[28px] border border-white/10 bg-black/30 p-5">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
                    Available
                  </div>

                  <div className="mt-2 text-xl font-black text-blue-100">
                    {formatTokenAmount(claimableNow)} {tokenSymbol}
                  </div>
                </div>

                <div>
                  <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
                    Gas Network
                  </div>

                  <div className="mt-2 text-xl font-black text-white">
                    BNB Chain
                  </div>
                </div>

                <div>
                  <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
                    Gas Currency
                  </div>

                  <div className="mt-2 text-xl font-black text-white">
                    BNB
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClaim}
              disabled={!canClaim}
              className={[
                "mt-5 min-h-14 w-full rounded-2xl px-6 py-4 text-sm font-black transition duration-300",
                canClaim
                  ? "bg-blue-500 text-white shadow-[0_0_40px_rgba(59,130,246,0.34)] hover:-translate-y-0.5 hover:bg-blue-400 hover:shadow-[0_0_55px_rgba(59,130,246,0.45)]"
                  : "cursor-not-allowed border border-white/10 bg-white/[0.045] text-white/35",
              ].join(" ")}
            >
              {claimButtonLabel}
            </button>

            <div className="mt-4 rounded-2xl border border-amber-300/15 bg-amber-300/[0.045] px-4 py-3 text-xs leading-6 text-white/45">
              Review the wallet transaction before approval. Blockchain
              transactions are irreversible, and the connected wallet pays
              the required network gas fee.
            </div>
          </div>
        </section>

        <section className="rounded-[36px] border border-white/10 bg-black/20 p-5 shadow-[0_26px_95px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-7">
          <SectionHeading
            eyebrow="Wallet Overview"
            title="Connected account status."
          />

          <div className="mt-6 grid gap-3">
            <StatCard
              number="W"
              label="Wallet"
              value={
                walletAddress
                  ? shortenAddress(walletAddress)
                  : "Not connected"
              }
              description="The wallet used to read and claim the KRX allocation."
              highlight={Boolean(walletAddress)}
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="text-[9px] font-black uppercase tracking-[0.18em] text-white/35">
                  Network
                </div>

                <div
                  className={[
                    "mt-2 font-black",
                    chainId === BSC_CHAIN_ID
                      ? "text-cyan-100"
                      : "text-white",
                  ].join(" ")}
                >
                  {chainId === BSC_CHAIN_ID
                    ? "BNB Chain"
                    : isConnected
                      ? "Wrong Network"
                      : "Not Connected"}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="text-[9px] font-black uppercase tracking-[0.18em] text-white/35">
                  Token
                </div>

                <div className="mt-2 font-black text-blue-100">
                  {tokenSymbol}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="text-[9px] font-black uppercase tracking-[0.18em] text-white/35">
                  Claim Start
                </div>

                <div className="mt-2 text-sm font-black leading-6 text-white">
                  {claimStart}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="text-[9px] font-black uppercase tracking-[0.18em] text-white/35">
                  Next Release
                </div>

                <div className="mt-2 text-sm font-black leading-6 text-white">
                  {nextClaimDate}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                loadClaimData(walletAddress, false)
              }
              disabled={dataLoading}
              className="rounded-2xl border border-blue-400/20 bg-blue-500/10 px-5 py-3 text-sm font-black text-blue-100 transition hover:bg-blue-500/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
            >
              {dataLoading
                ? "Refreshing Claim Data..."
                : "Refresh Claim Data"}
            </button>
          </div>
        </section>
      </section>

      <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[#030711]/78 p-5 shadow-[0_28px_100px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:p-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(37,99,235,0.13),transparent_38%)]" />

        <div className="relative">
          <SectionHeading
            eyebrow="Vesting Progress"
            title="Four scheduled KRX releases."
            description="The displayed unlocked percentage and claimable balance are read from the presale contract."
            right={
              <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 px-5 py-3 text-right">
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
                  Unlocked
                </div>

                <div className="mt-1 text-2xl font-black text-blue-100">
                  {vestedPercent}%
                </div>
              </div>
            }
          />

          <div className="mt-8">
            <div className="relative overflow-hidden rounded-full border border-white/10 bg-black/40 p-1">
              <div
                className="claim-progress-bar h-5 rounded-full bg-gradient-to-r from-blue-600 via-blue-300 to-cyan-200 shadow-[0_0_28px_rgba(59,130,246,0.38)] transition-all duration-700"
                style={{
                  width: `${Math.min(
                    Math.max(vestedPercent, 0),
                    100
                  )}%`,
                }}
              />
            </div>

            <div className="mt-3 flex justify-between text-[10px] font-black text-white/35">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
                Next Release In
              </div>

              <div className="mt-2 text-lg font-black text-white">
                {nextClaimCountdown}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
                Claimable Now
              </div>

              <div className="mt-2 text-lg font-black text-blue-100">
                {formatTokenAmount(claimableNow)} {tokenSymbol}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
                Unclaimed Balance
              </div>

              <div className="mt-2 text-lg font-black text-white">
                {formatTokenAmount(remaining)} {tokenSymbol}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[36px] border border-white/10 bg-black/20 p-5 backdrop-blur-xl sm:p-7">
        <SectionHeading
          eyebrow="Release Schedule"
          title="KRX vesting milestones."
          description="Each milestone represents the cumulative portion of the purchased allocation scheduled to be unlocked."
        />

        <div className="relative mt-8 grid gap-4 lg:grid-cols-4">
          <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-gradient-to-r from-blue-400/70 via-blue-400/20 to-cyan-300/20 lg:block" />

          {vestingMilestones.map((milestone, index) => {
            const milestoneTimestamp = claimStartUnix
              ? claimStartUnix + milestone.offset
              : 0;

            const unlocked =
              vestedPercent >= milestone.percentage;

            const next =
              !unlocked &&
              milestone.percentage === nextMilestone;

            return (
              <article
                key={milestone.percentage}
                className={[
                  "claim-card relative rounded-[26px] border p-5",
                  unlocked
                    ? "border-cyan-300/25 bg-cyan-400/[0.07]"
                    : next
                      ? "border-blue-400/25 bg-blue-500/[0.08]"
                      : "border-white/10 bg-black/25",
                ].join(" ")}
              >
                <div
                  className={[
                    "relative z-10 flex h-14 w-14 items-center justify-center rounded-full border text-sm font-black",
                    unlocked
                      ? "border-cyan-300/35 bg-cyan-400/15 text-cyan-100 shadow-[0_0_25px_rgba(34,211,238,0.17)]"
                      : next
                        ? "border-blue-400/35 bg-blue-500/15 text-blue-100 shadow-[0_0_25px_rgba(59,130,246,0.17)]"
                        : "border-white/10 bg-[#061020] text-white/45",
                  ].join(" ")}
                >
                  {milestone.percentage}%
                </div>

                <div className="mt-5 text-[9px] font-black uppercase tracking-[0.2em] text-white/35">
                  Release {index + 1}
                </div>

                <h3 className="mt-2 font-black text-white">
                  {milestone.label}
                </h3>

                <p className="mt-3 text-sm leading-6 text-white/48">
                  {milestoneTimestamp
                    ? formatDate(milestoneTimestamp)
                    : "Waiting for the official claim start"}
                </p>

                <div className="mt-4">
                  <StatusBadge
                    active={unlocked || next}
                    tone={unlocked ? "cyan" : "blue"}
                  >
                    {unlocked
                      ? "Unlocked"
                      : next
                        ? "Next Release"
                        : "Scheduled"}
                  </StatusBadge>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-[36px] border border-white/10 bg-[#030711]/76 p-5 shadow-[0_28px_100px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-7">
        <SectionHeading
          eyebrow="Contract Transparency"
          title="Verify the configured KORAX contracts."
          description="Always confirm contract addresses through the official KORAX website and official communication channels."
        />

        <div className="mt-7 grid gap-4 lg:grid-cols-2">
          <ContractCard
            label="Presale & Claim Contract"
            address={PRESALE_ADDRESS}
            href={PRESALE_BSCSCAN_URL}
            copied={copiedTarget === "presale"}
            onCopy={() =>
              copyContractAddress(
                "presale",
                PRESALE_ADDRESS
              )
            }
          />

          <ContractCard
            label="KRX Token Contract"
            address={TOKEN_ADDRESS}
            href={TOKEN_BSCSCAN_URL}
            copied={copiedTarget === "token"}
            onCopy={() =>
              copyContractAddress("token", TOKEN_ADDRESS)
            }
          />
        </div>
      </section>

      <section className="rounded-[24px] border border-amber-300/15 bg-amber-300/[0.045] px-5 py-4 text-xs leading-6 text-white/45">
        <span className="font-black text-amber-100/78">
          Claim and security notice:
        </span>{" "}
        Never share your seed phrase or private key. The KORAX Claim Portal
        does not require a direct token payment to claim purchased KRX, but
        the connected wallet must hold enough BNB to pay the blockchain gas
        fee. Verify the contract address and transaction details before
        approving any wallet request.
      </section>
    </div>
  );
}