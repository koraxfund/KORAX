"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ethers } from "ethers";
import { useAccount, useSwitchChain, useWalletClient } from "wagmi";

const RPC_URL = "https://bsc-dataseed.binance.org/";

const PRESALE_ADDRESS = process.env.NEXT_PUBLIC_PRESALE_ADDRESS!;
const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS!;

const PRESALE_BSCSCAN_URL =
  process.env.NEXT_PUBLIC_PRESALE_BSCSCAN_URL ||
  `https://bscscan.com/address/${PRESALE_ADDRESS}#code`;

const CLAIM_INTERVAL_SECONDS = 30 * 24 * 60 * 60;
const BSC_CHAIN_ID = 56;

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

function formatTokenAmount(
  value: bigint,
  decimals = 18,
  maximumFractionDigits = 4
) {
  const num = Number(ethers.formatUnits(value, decimals));

  if (!Number.isFinite(num)) return "0";

  return num.toLocaleString("en-US", {
    maximumFractionDigits,
  });
}

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatDate(unix: bigint | number) {
  const value = typeof unix === "bigint" ? Number(unix) : unix;

  if (!value) return "Not started";

  return new Date(value * 1000).toLocaleString("en-US");
}

function formatCountdown(secondsLeft: number) {
  if (secondsLeft <= 0) return "Now";

  const days = Math.floor(secondsLeft / 86400);
  const hours = Math.floor((secondsLeft % 86400) / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = Math.floor(secondsLeft % 60);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function getNextClaimTimestamp(claimStartUnix: number, vestedPercent: number) {
  if (!claimStartUnix || vestedPercent >= 100) return 0;

  if (vestedPercent < 25) return claimStartUnix;
  if (vestedPercent < 50) return claimStartUnix + CLAIM_INTERVAL_SECONDS;
  if (vestedPercent < 75) return claimStartUnix + CLAIM_INTERVAL_SECONDS * 2;
  if (vestedPercent < 100) return claimStartUnix + CLAIM_INTERVAL_SECONDS * 3;

  return 0;
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
        method,
        params: (params as any) ?? [],
      });
    },
  };
}

function StatusBadge({
  active,
  children,
}: {
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.18em]",
        active
          ? "border-blue-400/30 bg-blue-500/10 text-blue-100 shadow-[0_0_22px_rgba(59,130,246,0.16)]"
          : "border-white/10 bg-white/[0.04] text-white/60",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function StatCard({
  icon,
  label,
  value,
  desc,
  highlight,
}: {
  icon: string;
  label: string;
  value: string;
  desc: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "claim-card-3d relative overflow-hidden rounded-[28px] border p-6 shadow-[0_18px_55px_rgba(0,0,0,0.32)] backdrop-blur-xl",
        highlight
          ? "border-blue-400/25 bg-blue-500/10"
          : "border-white/10 bg-[#020617]/55",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.08),transparent_36%)]" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="text-sm text-white/50">{label}</div>

        <div className="claim-icon-orbit flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-black/35 text-2xl shadow-[0_0_30px_rgba(59,130,246,0.14)]">
          {icon}
        </div>
      </div>

      <div
        className={[
          "relative mt-3 text-2xl font-black",
          highlight ? "text-blue-100" : "text-white",
        ].join(" ")}
      >
        {value}
      </div>

      <p className="relative mt-3 text-sm leading-relaxed text-white/65">
        {desc}
      </p>
    </div>
  );
}

function KoraxFloatingLogo() {
  return (
    <div className="claim-logo-zone relative flex min-h-[330px] flex-col items-center justify-center overflow-visible bg-transparent">
      <div className="claim-logo-glow absolute h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute h-44 w-44 rounded-full bg-cyan-400/10 blur-2xl" />
      <div className="absolute h-28 w-28 rounded-full bg-white/5 blur-2xl" />

      <img
        src="/Korax-logo.png"
        alt="KORAX official logo"
        className="claim-logo-spin relative h-48 w-48 bg-transparent object-contain drop-shadow-[0_0_36px_rgba(59,130,246,0.95)] sm:h-56 sm:w-56 lg:h-60 lg:w-60"
      />

      <img
        src="/korax-wordmark.png"
        alt="KORAX wordmark"
        className="claim-wordmark-float relative mt-4 h-14 w-auto max-w-[280px] bg-transparent object-contain drop-shadow-[0_0_24px_rgba(59,130,246,0.95)] sm:h-16 sm:max-w-[360px]"
      />

      <div className="claim-energy-ring pointer-events-none absolute h-72 w-72 rounded-full border border-blue-400/10" />
    </div>
  );
}

export default function ClaimPage() {
  const [mounted, setMounted] = useState(false);

  const [walletAddress, setWalletAddress] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("KORAX");

  const [saleActive, setSaleActive] = useState(true);
  const [claimEnabled, setClaimEnabled] = useState(false);
  const [claimStart, setClaimStart] = useState("Not started");
  const [claimStartUnix, setClaimStartUnix] = useState(0);

  const [purchased, setPurchased] = useState<bigint>(0n);
  const [claimed, setClaimed] = useState<bigint>(0n);
  const [claimableNow, setClaimableNow] = useState<bigint>(0n);
  const [vestedPercent, setVestedPercentState] = useState<number>(0);

  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [nowTs, setNowTs] = useState<number>(Math.floor(Date.now() / 1000));

  const { address, isConnected, chainId } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { switchChainAsync } = useSwitchChain();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setNowTs(Math.floor(Date.now() / 1000));
    }, 1000);

    return () => clearInterval(interval);
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

  async function getConnectedBrowserProvider() {
    if (!isConnected || !walletClient || !address) {
      alert("Connect wallet first from the top bar.");
      return null;
    }

    if (chainId !== BSC_CHAIN_ID) {
      try {
        setStatus("Please switch to BNB Chain...");
        await switchChainAsync({ chainId: BSC_CHAIN_ID });
      } catch {
        throw new Error("Please switch to BNB Chain and try again.");
      }
    }

    const eip1193Provider = makeEip1193Provider(walletClient);
    return new ethers.BrowserProvider(eip1193Provider as any);
  }

  async function loadClaimData(currentWallet?: string) {
    try {
      const rpcProvider = new ethers.JsonRpcProvider(RPC_URL);

      const presale = new ethers.Contract(
        PRESALE_ADDRESS,
        presaleAbi,
        rpcProvider
      );

      const token = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, rpcProvider);

      const [saleActiveRaw, claimEnabledRaw, claimStartRaw, symbolRaw] =
        await Promise.all([
          presale.saleActive(),
          presale.claimEnabled(),
          presale.claimStart(),
          token.symbol(),
        ]);

      const claimStartNum = Number(claimStartRaw);

      setSaleActive(Boolean(saleActiveRaw));
      setClaimEnabled(Boolean(claimEnabledRaw));
      setClaimStartUnix(claimStartNum);
      setClaimStart(formatDate(claimStartNum));
      setTokenSymbol(String(symbolRaw));
      setStatus("");

      const user = currentWallet || walletAddress;

      if (user) {
        const [purchasedRaw, claimedRaw, claimableRaw, vestedRaw] =
          await Promise.all([
            presale.purchased(user),
            presale.claimed(user),
            presale.claimableNow(user),
            presale.vestedPercent(user),
          ]);

        setPurchased(BigInt(purchasedRaw.toString()));
        setClaimed(BigInt(claimedRaw.toString()));
        setClaimableNow(BigInt(claimableRaw.toString()));
        setVestedPercentState(Number(vestedRaw));
      } else {
        setPurchased(0n);
        setClaimed(0n);
        setClaimableNow(0n);
        setVestedPercentState(0);
      }
    } catch (err) {
      console.error("Failed to load claim data:", err);
      setStatus("Failed to load claim data.");
    }
  }

  useEffect(() => {
    if (!mounted) return;

    loadClaimData();

    const interval = setInterval(() => {
      loadClaimData();
    }, 10000);

    return () => clearInterval(interval);
  }, [mounted, walletAddress]);

  async function handleClaim() {
    try {
      if (busy) return;

      setBusy(true);
      setStatus("");

      const browserProvider = await getConnectedBrowserProvider();

      if (!browserProvider || !walletAddress) return;

      const signer = await browserProvider.getSigner();

      const presale = new ethers.Contract(PRESALE_ADDRESS, presaleAbi, signer);

      const liveClaimable = await presale.claimableNow(walletAddress);

      if (BigInt(liveClaimable.toString()) <= 0n) {
        throw new Error("Nothing claimable right now.");
      }

      setStatus("Claim transaction sent. Waiting for confirmation...");

      const tx = await presale.claim();
      await tx.wait();

      setStatus("Claim completed successfully.");
      await loadClaimData(walletAddress);
    } catch (error: any) {
      console.error("Claim failed:", error);

      const msg =
        error?.shortMessage ||
        error?.reason ||
        error?.message ||
        "Claim failed.";

      setStatus(msg);
      alert(msg);
    } finally {
      setBusy(false);
    }
  }

  const canClaim = claimEnabled && claimableNow > 0n;

  const nextClaimTs = getNextClaimTimestamp(claimStartUnix, vestedPercent);

  const nextClaimCountdown =
    nextClaimTs > nowTs
      ? formatCountdown(nextClaimTs - nowTs)
      : vestedPercent >= 100
        ? "Completed"
        : "Available now";

  const remaining = purchased > claimed ? purchased - claimed : 0n;

  if (!mounted) return null;

  return (
    <div className="space-y-8">
      <style>{`
        @keyframes claimFloat {
          0%, 100% {
            transform: translateY(0) rotateX(0deg) rotateY(0deg);
          }

          50% {
            transform: translateY(-12px) rotateX(3deg) rotateY(-3deg);
          }
        }

        @keyframes claimLogoSpin {
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

        @keyframes claimWordmarkFloat {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.94;
          }

          50% {
            transform: translateY(-7px) scale(1.02);
            opacity: 1;
          }
        }

        @keyframes claimLogoGlow {
          0%, 100% {
            opacity: 0.34;
            transform: scale(1);
          }

          50% {
            opacity: 0.9;
            transform: scale(1.16);
          }
        }

        @keyframes claimRing {
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

        @keyframes claimPulse {
          0%, 100% {
            opacity: 0.35;
            transform: scale(1);
          }

          50% {
            opacity: 0.9;
            transform: scale(1.05);
          }
        }

        @keyframes claimScan {
          0% {
            transform: translateX(-110%);
            opacity: 0;
          }

          20% {
            opacity: 1;
          }

          80% {
            opacity: 1;
          }

          100% {
            transform: translateX(110%);
            opacity: 0;
          }
        }

        .claim-hero-3d {
          transform-style: preserve-3d;
          perspective: 1100px;
        }

        .claim-float {
          animation: claimFloat 6.8s ease-in-out infinite;
          will-change: transform;
          transform-style: preserve-3d;
        }

        .claim-logo-zone,
        .claim-logo-zone img,
        .claim-wordmark-float {
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .claim-logo-spin {
          transform-style: preserve-3d;
          animation: claimLogoSpin 9s linear infinite;
          will-change: transform;
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .claim-wordmark-float {
          animation: claimWordmarkFloat 4s ease-in-out infinite;
          will-change: transform;
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .claim-logo-glow {
          animation: claimLogoGlow 3.6s ease-in-out infinite;
        }

        .claim-energy-ring {
          animation: claimRing 12s linear infinite;
        }

        .claim-pulse {
          animation: claimPulse 3s ease-in-out infinite;
        }

        .claim-card-3d {
          transform-style: preserve-3d;
          transition:
            transform 220ms ease,
            border-color 220ms ease,
            background 220ms ease,
            box-shadow 220ms ease;
        }

        .claim-card-3d:hover {
          transform: translateY(-5px) rotateX(2deg) rotateY(-2deg);
          border-color: rgba(59, 130, 246, 0.35);
          box-shadow: 0 28px 80px rgba(59, 130, 246, 0.16);
        }

        .claim-icon-orbit {
          transform: translateZ(24px);
        }

        .claim-scan-line {
          animation: claimScan 3.8s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .claim-float,
          .claim-logo-spin,
          .claim-wordmark-float,
          .claim-logo-glow,
          .claim-energy-ring,
          .claim-pulse,
          .claim-scan-line {
            animation: none;
          }

          .claim-card-3d:hover {
            transform: none;
          }
        }
      `}</style>

      <section className="claim-hero-3d relative overflow-hidden rounded-[38px] border border-white/10 bg-black/35 p-6 shadow-[0_35px_130px_rgba(0,0,0,0.62)] backdrop-blur-md sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.13),transparent_32%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.075] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />

        <div className="claim-scan-line pointer-events-none absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent" />

        <div className="relative grid gap-10 lg:grid-cols-[1.06fr_.94fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-blue-100 shadow-[0_0_30px_rgba(59,130,246,0.16)]">
              KORAX Claim Portal 🎁
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              Claim your purchased
              <span className="block bg-gradient-to-r from-blue-100 via-white to-blue-200 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(59,130,246,0.55)]">
                KORAX tokens.
              </span>
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/68 sm:text-lg">
              Purchased tokens become claimable after the presale is completed
              and the claim system is enabled. Claim data is read directly from
              the verified presale contract on BNB Smart Chain.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <StatusBadge active={!saleActive}>
                Presale {saleActive ? "Active 🔥" : "Closed ✅"}
              </StatusBadge>

              <StatusBadge active={claimEnabled}>
                Claim {claimEnabled ? "Enabled 🎁" : "Locked 🔒"}
              </StatusBadge>

              <StatusBadge active>BNB Chain ⚡</StatusBadge>

              <StatusBadge active={Boolean(walletAddress)}>
                {walletAddress ? shortenAddress(walletAddress) : "Wallet Off"}
              </StatusBadge>
            </div>

            <div className="mt-7 rounded-[28px] border border-white/10 bg-black/25 p-5 backdrop-blur-md">
              <div className="text-xs uppercase tracking-[0.22em] text-white/40">
                Verified Presale Contract
              </div>

              <div className="mt-3 break-all rounded-xl border border-white/10 bg-black/30 p-3 font-mono text-xs text-white">
                {PRESALE_ADDRESS}
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={PRESALE_BSCSCAN_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-blue-400/35 hover:bg-blue-500/10"
                >
                  Open on BscScan ↗
                </a>

                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(PRESALE_ADDRESS)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-blue-400/35 hover:bg-blue-500/10"
                >
                  Copy Address 📋
                </button>
              </div>
            </div>
          </div>

          <div className="claim-float relative rounded-[38px] border border-white/10 bg-black/30 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.52)]">
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-blue-500/15 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

            <KoraxFloatingLogo />

            <div className="mt-4 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4 shadow-[0_0_38px_rgba(59,130,246,0.10)]">
              <div className="text-xs uppercase tracking-[0.22em] text-white/45">
                Claim Engine
              </div>

              <div className="mt-2 text-2xl font-black text-blue-100">
                {tokenSymbol}
              </div>

              <p className="mt-2 text-sm leading-relaxed text-white/65">
                Secure claim interface connected to the official KORAX presale
                contract.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={claimEnabled ? "✅" : "🔒"}
          label="Claim Status"
          value={claimEnabled ? "Enabled" : "Locked"}
          desc={
            claimEnabled
              ? "Claim is active for eligible purchased balances."
              : "Claim opens only after the presale is closed and enabled."
          }
          highlight={claimEnabled}
        />

        <StatCard
          icon="🛒"
          label="Purchased"
          value={`${formatTokenAmount(purchased)} ${tokenSymbol}`}
          desc="Total tokens recorded for your wallet during the presale."
        />

        <StatCard
          icon="💎"
          label="Claimable Now"
          value={`${formatTokenAmount(claimableNow)} ${tokenSymbol}`}
          desc="Amount currently available to claim from the contract."
          highlight
        />

        <StatCard
          icon="📦"
          label="Already Claimed"
          value={`${formatTokenAmount(claimed)} ${tokenSymbol}`}
          desc="Tokens already claimed from your allocation."
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon="👛"
          label="Wallet"
          value={walletAddress ? shortenAddress(walletAddress) : "Not connected"}
          desc="Current wallet used for claim data."
        />

        <StatCard
          icon="⏰"
          label="Claim Start"
          value={claimStart}
          desc="Start time returned by the presale contract."
        />

        <StatCard
          icon="📈"
          label="Unlocked Percent"
          value={`${vestedPercent}%`}
          desc="Current unlocked percentage based on the vesting schedule."
        />

        <StatCard
          icon="⏳"
          label="Next Claim In"
          value={nextClaimCountdown}
          desc="Countdown until the next vesting release."
        />
      </section>

      <section className="claim-card-3d relative overflow-hidden rounded-[30px] border border-white/10 bg-black/25 p-6 backdrop-blur-md">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(37,99,235,0.12),transparent_34%)]" />

        <div className="relative mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-100">
              Vesting Progress 📊
            </p>

            <h2 className="mt-2 text-2xl font-black text-white">
              Unlock schedule
            </h2>

            <p className="mt-2 text-sm text-white/60">
              Claim unlocks in scheduled portions after claim activation.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-right text-sm text-white/60">
            Remaining
            <div className="mt-1 font-black text-white">
              {formatTokenAmount(remaining)} {tokenSymbol}
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-full border border-white/10 bg-black/40">
          <div
            className="h-4 rounded-full bg-gradient-to-r from-blue-500 via-blue-200 to-white transition-all duration-700"
            style={{
              width: `${Math.min(Math.max(vestedPercent, 0), 100)}%`,
            }}
          />

          <div className="claim-pulse pointer-events-none absolute inset-0 bg-blue-400/10" />
        </div>

        <div className="mt-3 flex justify-between text-xs text-white/45">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </section>

      <section className="claim-card-3d rounded-[30px] border border-white/10 bg-black/25 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-md">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-100">
              Final Action 🚀
            </p>

            <h2 className="mt-2 text-2xl font-black text-white">
              Claim Tokens
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/60">
              The claim button becomes available when claim is enabled and your
              wallet has tokens claimable from the presale contract.
            </p>

            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/60">
                Presale status:{" "}
                <span className="font-semibold text-white">
                  {saleActive ? "Still active 🔥" : "Closed ✅"}
                </span>
              </div>

              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/60">
                Available now:{" "}
                <span className="font-semibold text-white">
                  {formatTokenAmount(claimableNow)} {tokenSymbol}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClaim}
            disabled={busy || !canClaim}
            className={[
              "rounded-2xl px-8 py-4 text-sm font-black transition",
              canClaim && !busy
                ? "bg-blue-500 text-white shadow-[0_0_35px_rgba(59,130,246,0.35)] hover:scale-[1.03] hover:bg-blue-400"
                : "cursor-not-allowed border border-white/10 bg-white/5 text-white/40",
            ].join(" ")}
          >
            {busy ? "Processing..." : "Claim 💎"}
          </button>
        </div>

        {status ? (
          <div className="mt-5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
            {status}
          </div>
        ) : null}
      </section>
    </div>
  );
}