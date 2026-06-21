"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount, useSwitchChain, useWalletClient } from "wagmi";

const RPC_URL = "https://bsc-dataseed.binance.org/";

const STAKING_ADDRESS = process.env.NEXT_PUBLIC_STAKING_ADDRESS || "";
const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS || "";
const BSC_CHAIN_ID = 56;

const stakingAbi = [
  "function positionsCount(address) view returns (uint256)",
  "function getPosition(address,uint256) view returns (tuple(uint256 amount,uint256 unlockTime,uint256 rewardBps,bool claimed))",
  "function rewardOf(address,uint256) view returns (uint256)",
  "function stake(uint256,uint8)",
  "function withdraw(uint256)",
];

const tokenAbi = [
  "function approve(address,uint256) returns (bool)",
  "function allowance(address,address) view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function symbol() view returns (string)",
];

const plans = [
  {
    id: 0,
    title: "1 Day",
    ret: "0.15%",
    dur: "1 Day",
    desc: "Quick test plan",
    icon: "⚡",
  },
  {
    id: 14,
    title: "14 Days",
    ret: "3.5%",
    dur: "14 Days",
    desc: "Short-term hold",
    icon: "🔹",
  },
  {
    id: 1,
    title: "1 Month",
    ret: "7.5%",
    dur: "30 Days",
    desc: "Starter plan",
    icon: "💎",
  },
  {
    id: 3,
    title: "3 Months",
    ret: "22.5%",
    dur: "90 Days",
    desc: "Balanced reward",
    icon: "🔒",
  },
  {
    id: 6,
    title: "6 Months",
    ret: "45%",
    dur: "180 Days",
    desc: "Strong return",
    icon: "🔥",
  },
  {
    id: 9,
    title: "9 Months",
    ret: "67.5%",
    dur: "270 Days",
    desc: "Premium plan",
    icon: "🚀",
  },
  {
    id: 12,
    title: "12 Months",
    ret: "90%",
    dur: "365 Days",
    desc: "Max reward",
    icon: "👑",
  },
];

function format(v: bigint) {
  return Number(ethers.formatUnits(v, 18)).toLocaleString("en-US", {
    maximumFractionDigits: 4,
  });
}

function formatCountdown(unlockTs: number) {
  const now = Math.floor(Date.now() / 1000);
  const diff = unlockTs - now;

  if (diff <= 0) return "Ready to withdraw";

  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function shortAddress(address?: string) {
  if (!address) return "Not set";
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
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

function StakingKoraxLogo() {
  return (
    <div className="staking-logo-zone relative flex min-h-[330px] flex-col items-center justify-center overflow-visible bg-transparent">
      <div className="staking-logo-glow absolute h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute h-44 w-44 rounded-full bg-cyan-400/10 blur-2xl" />
      <div className="absolute h-28 w-28 rounded-full bg-white/5 blur-2xl" />

      <img
        src="/Korax-logo.png"
        alt="KORAX official logo"
        className="staking-logo-spin relative h-48 w-48 bg-transparent object-contain drop-shadow-[0_0_36px_rgba(59,130,246,0.95)] sm:h-56 sm:w-56 lg:h-60 lg:w-60"
      />

      <img
        src="/korax-wordmark.png"
        alt="KORAX wordmark"
        className="staking-wordmark-float relative mt-4 h-14 w-auto max-w-[280px] bg-transparent object-contain drop-shadow-[0_0_24px_rgba(59,130,246,0.95)] sm:h-16 sm:max-w-[360px]"
      />

      <div className="staking-energy-ring pointer-events-none absolute h-72 w-72 rounded-full border border-blue-400/10" />
    </div>
  );
}

function MetricBox({
  label,
  value,
  desc,
  icon,
  active,
}: {
  label: string;
  value: string;
  desc: string;
  icon: string;
  active?: boolean;
}) {
  return (
    <div
      className={[
        "staking-card-3d relative overflow-hidden rounded-[28px] border p-5 shadow-[0_18px_60px_rgba(0,0,0,0.32)] backdrop-blur-md",
        active
          ? "border-blue-400/25 bg-blue-500/10"
          : "border-white/10 bg-black/25",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.08),transparent_34%)]" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-white/50">{label}</div>
          <div
            className={[
              "mt-2 text-xl font-black",
              active ? "text-blue-100" : "text-white",
            ].join(" ")}
          >
            {value}
          </div>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/35 text-2xl shadow-[0_0_35px_rgba(59,130,246,0.14)]">
          {icon}
        </div>
      </div>

      <p className="relative mt-4 text-sm leading-7 text-white/65">{desc}</p>
    </div>
  );
}

export default function Page() {
  const [wallet, setWallet] = useState("");
  const [amount, setAmount] = useState("");
  const [plan, setPlan] = useState(14);
  const [positions, setPositions] = useState<any[]>([]);
  const [balance, setBalance] = useState<bigint>(0n);
  const [symbol, setSymbol] = useState("KRX");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [, setNowTick] = useState(0);

  const { address, isConnected, chainId } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { switchChainAsync } = useSwitchChain();

  const selectedPlan = plans.find((x) => x.id === plan) || plans[1];
  const activePositions = positions.filter((p) => !p.claimed).length;

  useEffect(() => {
    if (!address) {
      setWallet("");
      return;
    }

    try {
      setWallet(ethers.getAddress(address));
    } catch {
      setWallet(address);
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

  async function load(targetWallet?: string) {
    try {
      if (!STAKING_ADDRESS || !TOKEN_ADDRESS) {
        setStatus("Missing staking or token environment variables.");
        return;
      }

      const currentWallet = targetWallet || wallet;

      const rpcProvider = new ethers.JsonRpcProvider(RPC_URL);
      const staking = new ethers.Contract(
        STAKING_ADDRESS,
        stakingAbi,
        rpcProvider
      );
      const token = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, rpcProvider);

      const sym = await token.symbol();
      setSymbol(sym);

      if (currentWallet) {
        const normalizedWallet = ethers.getAddress(currentWallet);

        const [bal, countRaw] = await Promise.all([
          token.balanceOf(normalizedWallet),
          staking.positionsCount(normalizedWallet),
        ]);

        setBalance(BigInt(bal.toString()));

        const count = Number(countRaw);
        const arr = [];

        for (let i = 0; i < count; i++) {
          const [p, r] = await Promise.all([
            staking.getPosition(normalizedWallet, i),
            staking.rewardOf(normalizedWallet, i),
          ]);

          arr.push({
            index: i,
            amount: BigInt(p.amount.toString()),
            unlock: Number(p.unlockTime),
            claimed: Boolean(p.claimed),
            reward: BigInt(r.toString()),
          });
        }

        setPositions(arr);
      } else {
        setBalance(0n);
        setPositions([]);
      }

      setStatus("");
    } catch (err) {
      console.error("Load failed:", err);
      setStatus("Failed to load staking data.");
    }
  }

  useEffect(() => {
    load();

    const interval = setInterval(() => {
      load();
    }, 8000);

    return () => clearInterval(interval);
  }, [wallet]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNowTick((x) => x + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  async function stake() {
    try {
      if (!STAKING_ADDRESS || !TOKEN_ADDRESS) {
        throw new Error("Missing staking or token environment variables.");
      }

      if (!amount || Number(amount) <= 0) {
        alert("Enter a valid amount.");
        return;
      }

      const browserProvider = await getConnectedBrowserProvider();
      if (!browserProvider) return;

      const signer = await browserProvider.getSigner();

      const staking = new ethers.Contract(STAKING_ADDRESS, stakingAbi, signer);
      const token = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, signer);

      const value = ethers.parseUnits(amount, 18);
      const owner = await signer.getAddress();

      const tokenBalance = await token.balanceOf(owner);

      if (BigInt(tokenBalance.toString()) < value) {
        alert(`Insufficient ${symbol} balance.`);
        return;
      }

      const allowance = await token.allowance(owner, STAKING_ADDRESS);

      if (BigInt(allowance.toString()) < value) {
        setStatus(`Approving ${symbol}...`);
        const tx = await token.approve(STAKING_ADDRESS, value);
        await tx.wait();
      }

      setStatus("Staking in progress...");

      const tx2 = await staking.stake(value, plan);
      await tx2.wait();

      setAmount("");
      setStatus("Stake completed successfully.");
      await load(owner);
    } catch (err: any) {
      console.error(err);

      const msg =
        err?.shortMessage || err?.reason || err?.message || "Stake failed.";

      setStatus(msg);
      alert(msg);
    }
  }

  async function withdraw(i: number) {
    try {
      if (!STAKING_ADDRESS) {
        throw new Error("Missing staking environment variable.");
      }

      const browserProvider = await getConnectedBrowserProvider();
      if (!browserProvider) return;

      const signer = await browserProvider.getSigner();
      const staking = new ethers.Contract(STAKING_ADDRESS, stakingAbi, signer);

      setStatus(`Withdrawing position #${i}...`);

      const tx = await staking.withdraw(i);
      await tx.wait();

      setStatus("Withdraw completed successfully.");
      await load(await signer.getAddress());
    } catch (err: any) {
      console.error(err);

      const msg =
        err?.shortMessage || err?.reason || err?.message || "Withdraw failed.";

      setStatus(msg);
      alert(msg);
    }
  }

  function PlanCard(p: (typeof plans)[number]) {
    const selected = plan === p.id;

    return (
      <button
        key={p.id}
        type="button"
        onClick={() => setPlan(p.id)}
        className="cursor-pointer text-left"
      >
        <div
          className={[
            "staking-plan-card group relative flex h-72 w-64 flex-col items-center justify-center overflow-hidden p-4 text-center transition duration-300 hover:scale-105",
            selected
              ? "bg-blue-500/22 text-white shadow-[0_0_55px_rgba(59,130,246,0.30)]"
              : "bg-[#020617]/80 text-white shadow-[0_18px_45px_rgba(0,0,0,0.35)]",
          ].join(" ")}
          style={{
            clipPath:
              "polygon(25% 6%,75% 6%,100% 50%,75% 94%,25% 94%,0% 50%)",
          }}
        >
          <div
            className={[
              "absolute inset-0 opacity-100 transition duration-300",
              selected
                ? "bg-[radial-gradient(circle_at_top,rgba(147,197,253,0.32),transparent_45%),linear-gradient(135deg,rgba(37,99,235,0.40),rgba(2,6,23,0.40))]"
                : "bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.13),transparent_45%),linear-gradient(135deg,rgba(15,23,42,0.75),rgba(2,6,23,0.94))]",
            ].join(" ")}
          />

          <div className="absolute inset-0 border border-white/10" />

          <div className="relative z-10 text-3xl">{p.icon}</div>

          <div className="relative z-10 mt-3 text-[11px] uppercase tracking-[0.24em] text-white/55">
            Annual
          </div>

          <div className="relative z-10 mt-2 text-lg font-bold">{p.title}</div>

          <div
            className={[
              "relative z-10 mt-3 text-4xl font-extrabold",
              selected ? "text-blue-100" : "text-white",
            ].join(" ")}
          >
            {p.ret}
          </div>

          <div className="relative z-10 mt-2 text-sm text-white/75">
            {p.dur}
          </div>

          <div className="relative z-10 mt-3 px-3 text-xs leading-5 text-white/70">
            {p.desc}
          </div>

          <div
            className={[
              "relative z-10 mt-4 rounded-full border px-3 py-1 text-xs font-black",
              selected
                ? "border-blue-300/35 bg-blue-400/15 text-blue-100"
                : "border-white/10 bg-white/5 text-white/65",
            ].join(" ")}
          >
            {selected ? "Selected Plan" : "Select Plan"}
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="space-y-8 text-white">
      <style>{`
        @keyframes stakingFloat {
          0%, 100% {
            transform: translateY(0) rotateX(0deg) rotateY(0deg);
          }
          50% {
            transform: translateY(-12px) rotateX(3deg) rotateY(-3deg);
          }
        }

        @keyframes stakingLogoSpin {
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

        @keyframes stakingWordmarkFloat {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.94;
          }
          50% {
            transform: translateY(-7px) scale(1.02);
            opacity: 1;
          }
        }

        @keyframes stakingLogoGlow {
          0%, 100% {
            opacity: 0.34;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.16);
          }
        }

        @keyframes stakingRing {
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

        @keyframes stakingScan {
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

        @keyframes stakingShimmer {
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

        .staking-hero-3d {
          transform-style: preserve-3d;
          perspective: 1200px;
        }

        .staking-float {
          animation: stakingFloat 6.8s ease-in-out infinite;
          will-change: transform;
          transform-style: preserve-3d;
        }

        .staking-logo-zone,
        .staking-logo-zone img,
        .staking-wordmark-float {
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .staking-logo-spin {
          transform-style: preserve-3d;
          animation: stakingLogoSpin 9s linear infinite;
          will-change: transform;
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .staking-wordmark-float {
          animation: stakingWordmarkFloat 4s ease-in-out infinite;
          will-change: transform;
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .staking-logo-glow {
          animation: stakingLogoGlow 3.6s ease-in-out infinite;
        }

        .staking-energy-ring {
          animation: stakingRing 12s linear infinite;
        }

        .staking-scan-line {
          animation: stakingScan 4s ease-in-out infinite;
        }

        .staking-shimmer {
          animation: stakingShimmer 5s ease-in-out infinite;
        }

        .staking-card-3d {
          transform-style: preserve-3d;
          transition:
            transform 220ms ease,
            border-color 220ms ease,
            background 220ms ease,
            box-shadow 220ms ease;
        }

        .staking-card-3d:hover {
          transform: translateY(-5px) rotateX(2deg) rotateY(-2deg);
          border-color: rgba(59, 130, 246, 0.38);
          background: rgba(37, 99, 235, 0.08);
          box-shadow: 0 28px 90px rgba(59, 130, 246, 0.14);
        }

        .staking-plan-card {
          transform-style: preserve-3d;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        @media (prefers-reduced-motion: reduce) {
          .staking-float,
          .staking-logo-spin,
          .staking-wordmark-float,
          .staking-logo-glow,
          .staking-energy-ring,
          .staking-scan-line,
          .staking-shimmer {
            animation: none;
          }

          .staking-card-3d:hover {
            transform: none;
          }
        }
      `}</style>

      <section className="staking-hero-3d relative overflow-hidden rounded-[38px] border border-white/10 bg-black/35 p-6 shadow-[0_35px_130px_rgba(0,0,0,0.62)] backdrop-blur-md sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.13),transparent_32%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.075] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="staking-scan-line pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent" />
        <div className="staking-shimmer pointer-events-none absolute left-0 top-0 h-full w-1/4 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

        <div className="relative grid gap-10 lg:grid-cols-[1.06fr_.94fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-blue-100 shadow-[0_0_30px_rgba(59,130,246,0.16)]">
              KORAX Staking 🔒
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              Stake KORAX and unlock
              <span className="block bg-gradient-to-r from-blue-100 via-white to-blue-200 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(59,130,246,0.55)]">
                fixed annual rewards.
              </span>
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/68 sm:text-lg">
              Choose a fixed-duration staking plan, lock your KORAX tokens, and
              withdraw your principal plus reward after the selected lock period
              ends. Longer plans provide stronger annual reward potential.
            </p>

            <div className="mt-7 flex flex-wrap gap-3 text-xs">
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/60">
                Token:{" "}
                <span className="font-semibold text-white">
                  {shortAddress(TOKEN_ADDRESS)}
                </span>
              </div>

              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/60">
                Staking:{" "}
                <span className="font-semibold text-white">
                  {shortAddress(STAKING_ADDRESS)}
                </span>
              </div>

              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/60">
                Wallet:{" "}
                <span className="font-semibold text-white">
                  {wallet ? shortAddress(wallet) : "Not connected"}
                </span>
              </div>
            </div>
          </div>

          <div className="staking-float relative rounded-[38px] border border-white/10 bg-black/30 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.52)]">
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-blue-500/15 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

            <StakingKoraxLogo />

            <div className="mt-4 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4 shadow-[0_0_38px_rgba(59,130,246,0.10)]">
              <div className="text-xs uppercase tracking-[0.22em] text-white/45">
                Selected Plan
              </div>

              <div className="mt-2 text-2xl font-black text-blue-100">
                {selectedPlan.title} • {selectedPlan.ret}
              </div>

              <p className="mt-2 text-sm leading-relaxed text-white/65">
                Fixed-duration KRX staking with transparent on-chain positions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricBox
          icon="👛"
          label="Wallet Balance"
          value={`${format(balance)} ${symbol}`}
          desc="Current token balance available in your connected wallet."
          active
        />

        <MetricBox
          icon="🔒"
          label="Active Positions"
          value={`${activePositions}`}
          desc="Open staking positions that are not withdrawn yet."
        />

        <MetricBox
          icon="⚡"
          label="Selected Plan"
          value={`${selectedPlan.title}`}
          desc={`${selectedPlan.ret} annual return for ${selectedPlan.dur}.`}
        />

        <MetricBox
          icon="🌐"
          label="Network"
          value="BNB Chain"
          desc="Staking transactions are executed through BNB Smart Chain."
        />
      </section>

      <section className="rounded-[34px] border border-white/10 bg-black/20 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.36)] backdrop-blur-md">
        <div className="mb-7 text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-100">
            Staking Plans 💎
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            Choose your lock period
          </h2>

          <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-white/60">
            Select one plan, enter the amount, approve the token if needed, then
            stake your KRX into the contract.
          </p>
        </div>

        <div className="space-y-10">
          <div className="flex flex-wrap justify-center gap-10">
            {plans.slice(0, 2).map((p) => PlanCard(p))}
          </div>

          <div className="flex flex-wrap justify-center gap-10">
            {plans.slice(2, 5).map((p) => PlanCard(p))}
          </div>

          <div className="flex flex-wrap justify-center gap-10">
            {plans.slice(5, 7).map((p) => PlanCard(p))}
          </div>
        </div>
      </section>

      <section className="flex justify-center">
        <div className="staking-card-3d w-full max-w-[460px] rounded-[30px] border border-white/10 bg-[#020617]/80 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-md">
          <div className="text-center">
            <div className="text-xs uppercase tracking-[0.22em] text-white/40">
              Stake Panel
            </div>

            <div className="mt-2 text-xl font-black text-white">
              {selectedPlan.title} • {selectedPlan.ret} Annual
            </div>

            <div className="mt-2 text-sm text-white/60">
              Balance: {format(balance)} {symbol}
            </div>
          </div>

          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="mt-5 w-full rounded-2xl border border-white/10 bg-black/55 p-3 text-center text-white outline-none transition placeholder:text-white/35 focus:border-blue-400/50 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.14)]"
          />

          <button
            onClick={async () => {
              try {
                setLoading(true);
                await stake();
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
            className="mt-4 w-full rounded-2xl bg-blue-500 py-3 font-black text-white shadow-[0_0_35px_rgba(59,130,246,0.35)] transition hover:scale-[1.01] hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Processing..." : "Stake KRX"}
          </button>

          {status ? (
            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
              {status}
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-3xl space-y-4">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-100">
            My Positions 📦
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            Active staking positions
          </h2>
        </div>

        {positions.length === 0 ? (
          <div className="rounded-[26px] border border-white/10 bg-black/25 p-6 text-center text-white/70">
            No staking positions yet.
          </div>
        ) : (
          positions.map((p) => {
            const unlocked = Date.now() / 1000 > p.unlock;

            return (
              <div
                key={p.index}
                className="staking-card-3d rounded-[28px] border border-white/10 bg-black/25 p-5 shadow-[0_14px_40px_rgba(0,0,0,0.28)] backdrop-blur-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.22em] text-white/40">
                      Position #{p.index}
                    </div>

                    <div className="mt-2 text-lg font-black text-white">
                      {format(p.amount)} {symbol}
                    </div>

                    <div className="mt-1 text-sm text-white/70">
                      Reward: +{format(p.reward)} {symbol}
                    </div>

                    <div className="mt-1 text-sm text-white/60">
                      Unlock:{" "}
                      {new Date(p.unlock * 1000).toLocaleString("en-US")}
                    </div>

                    <div
                      className={[
                        "mt-2 text-sm font-semibold",
                        p.claimed
                          ? "text-white/50"
                          : unlocked
                            ? "text-blue-100"
                            : "text-cyan-100",
                      ].join(" ")}
                    >
                      {p.claimed ? "Completed" : formatCountdown(p.unlock)}
                    </div>
                  </div>

                  <div className="text-right">
                    {p.claimed ? (
                      <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/60">
                        Withdrawn
                      </div>
                    ) : unlocked ? (
                      <button
                        onClick={() => withdraw(p.index)}
                        className="rounded-xl bg-blue-500 px-4 py-2 font-black text-white shadow-[0_0_25px_rgba(59,130,246,0.28)] transition hover:bg-blue-400"
                      >
                        Withdraw
                      </button>
                    ) : (
                      <div className="rounded-xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100">
                        Locked
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}