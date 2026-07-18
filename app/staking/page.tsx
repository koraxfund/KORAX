"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  useAccount,
  useSwitchChain,
  useWalletClient,
} from "wagmi";

const RPC_URL =
  process.env.NEXT_PUBLIC_BSC_RPC_URL?.trim() ||
  "https://bsc-dataseed.binance.org/";

const STAKING_ADDRESS =
  process.env.NEXT_PUBLIC_STAKING_ADDRESS?.trim() || "";

const TOKEN_ADDRESS =
  process.env.NEXT_PUBLIC_TOKEN_ADDRESS?.trim() || "";

const BSC_CHAIN_ID = 56;
const REFRESH_INTERVAL_MS = 10_000;

const BUILDER_ACCESS_AMOUNT = 1500;
const BUILDER_ACCESS_REWARD_BPS = 9000;

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
  "function decimals() view returns (uint8)",
];

type StakingPosition = {
  index: number;
  amount: bigint;
  unlock: number;
  rewardBps: number;
  claimed: boolean;
  reward: bigint;
};

type StakingPlan = {
  id: number;
  title: string;
  ret: string;
  rewardBps: number;
  dur: string;
  durationDays: number;
  desc: string;
  icon: string;
  builderAccess?: boolean;
};

const plans: StakingPlan[] = [
  {
    id: 0,
    title: "1 Day",
    ret: "0.15%",
    rewardBps: 15,
    dur: "1 Day",
    durationDays: 1,
    desc: "Quick test plan",
    icon: "⚡",
  },
  {
    id: 14,
    title: "14 Days",
    ret: "3.5%",
    rewardBps: 350,
    dur: "14 Days",
    durationDays: 14,
    desc: "Short-term hold",
    icon: "🔹",
  },
  {
    id: 1,
    title: "1 Month",
    ret: "7.5%",
    rewardBps: 750,
    dur: "30 Days",
    durationDays: 30,
    desc: "Starter plan",
    icon: "💎",
  },
  {
    id: 3,
    title: "3 Months",
    ret: "22.5%",
    rewardBps: 2250,
    dur: "90 Days",
    durationDays: 90,
    desc: "Balanced reward",
    icon: "🔒",
  },
  {
    id: 6,
    title: "6 Months",
    ret: "45%",
    rewardBps: 4500,
    dur: "180 Days",
    durationDays: 180,
    desc: "Strong return",
    icon: "🔥",
  },
  {
    id: 9,
    title: "9 Months",
    ret: "67.5%",
    rewardBps: 6750,
    dur: "270 Days",
    durationDays: 270,
    desc: "Premium plan",
    icon: "🚀",
  },
  {
    id: 12,
    title: "12 Months",
    ret: "90%",
    rewardBps: 9000,
    dur: "365 Days",
    durationDays: 365,
    desc: "Maximum reward and builder access",
    icon: "👑",
    builderAccess: true,
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
  const formatted = ethers.formatUnits(value, decimals);
  const numberValue = Number(formatted);

  if (!Number.isFinite(numberValue)) {
    return "0";
  }

  return numberValue.toLocaleString("en-US", {
    maximumFractionDigits,
  });
}

function formatCountdown(unlockTs: number, currentTime: number) {
  const difference = unlockTs - currentTime;

  if (difference <= 0) {
    return "Ready to withdraw";
  }

  const days = Math.floor(difference / 86400);
  const hours = Math.floor((difference % 86400) / 3600);
  const minutes = Math.floor((difference % 3600) / 60);
  const seconds = Math.floor(difference % 60);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function formatDate(unixSeconds: number) {
  if (!unixSeconds) return "Unavailable";

  return new Date(unixSeconds * 1000).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function shortAddress(address?: string) {
  if (!address) return "Not set";
  if (address.length < 10) return address;

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function isValidPositiveAmount(value: string) {
  const normalizedValue = value.trim();

  if (!normalizedValue) return false;

  if (!/^(?:\d+\.?\d*|\.\d+)$/.test(normalizedValue)) {
    return false;
  }

  const numberValue = Number(normalizedValue);

  return Number.isFinite(numberValue) && numberValue > 0;
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

function StakingKoraxLogo() {
  return (
    <div className="staking-logo-zone relative flex min-h-[330px] flex-col items-center justify-center overflow-visible bg-transparent">
      <div className="staking-logo-glow absolute h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute h-44 w-44 rounded-full bg-cyan-400/10 blur-2xl" />
      <div className="absolute h-28 w-28 rounded-full bg-white/5 blur-2xl" />

      <img
        src="/Korax-logo.png"
        alt="KORAX official logo"
        draggable={false}
        className="staking-logo-spin relative h-48 w-48 bg-transparent object-contain drop-shadow-[0_0_36px_rgba(59,130,246,0.95)] sm:h-56 sm:w-56 lg:h-60 lg:w-60"
      />

      <img
        src="/korax-wordmark.png"
        alt="KORAX wordmark"
        draggable={false}
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
              "mt-2 break-words text-xl font-black",
              active ? "text-blue-100" : "text-white",
            ].join(" ")}
          >
            {value}
          </div>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/35 text-2xl shadow-[0_0_35px_rgba(59,130,246,0.14)]">
          {icon}
        </div>
      </div>

      <p className="relative mt-4 text-sm leading-7 text-white/65">
        {desc}
      </p>
    </div>
  );
}

function PlanCard({
  stakingPlan,
  selected,
  onSelect,
}: {
  stakingPlan: StakingPlan;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className="staking-hex-button cursor-pointer text-left"
    >
      <div
        className={[
          "staking-plan-card group relative flex h-72 w-64 flex-col items-center justify-center overflow-hidden p-4 text-center text-white transition duration-300 hover:scale-105",
          selected
            ? "bg-blue-500/22 shadow-[0_0_55px_rgba(59,130,246,0.30)]"
            : stakingPlan.builderAccess
              ? "bg-cyan-500/[0.08] shadow-[0_18px_50px_rgba(0,0,0,0.38)]"
              : "bg-[#020617]/80 shadow-[0_18px_45px_rgba(0,0,0,0.35)]",
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
              : stakingPlan.builderAccess
                ? "bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_47%),linear-gradient(135deg,rgba(8,47,73,0.46),rgba(2,6,23,0.94))]"
                : "bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.13),transparent_45%),linear-gradient(135deg,rgba(15,23,42,0.75),rgba(2,6,23,0.94))]",
          ].join(" ")}
        />

        <div className="staking-hex-inner pointer-events-none absolute inset-[2px]" />

        {stakingPlan.builderAccess ? (
          <div className="absolute right-10 top-7 z-20 rounded-full border border-cyan-300/25 bg-cyan-400/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-cyan-100">
            Builder
          </div>
        ) : null}

        <div className="relative z-10 text-3xl">
          {stakingPlan.icon}
        </div>

        <div className="relative z-10 mt-3 text-[11px] uppercase tracking-[0.24em] text-white/55">
          Fixed Reward
        </div>

        <div className="relative z-10 mt-2 text-lg font-bold">
          {stakingPlan.title}
        </div>

        <div
          className={[
            "relative z-10 mt-3 text-4xl font-extrabold",
            selected
              ? "text-blue-100"
              : stakingPlan.builderAccess
                ? "text-cyan-100"
                : "text-white",
          ].join(" ")}
        >
          {stakingPlan.ret}
        </div>

        <div className="relative z-10 mt-2 text-sm text-white/75">
          {stakingPlan.dur}
        </div>

        <div className="relative z-10 mt-3 px-3 text-xs leading-5 text-white/70">
          {stakingPlan.desc}
        </div>

        {stakingPlan.builderAccess ? (
          <div className="relative z-10 mt-2 text-[10px] font-black text-cyan-100">
            1,500 KRX = 1 Project Slot
          </div>
        ) : null}

        <div
          className={[
            "relative z-10 mt-3 rounded-full border px-3 py-1 text-xs font-black",
            selected
              ? "border-blue-300/35 bg-blue-400/15 text-blue-100"
              : stakingPlan.builderAccess
                ? "border-cyan-300/25 bg-cyan-400/10 text-cyan-100"
                : "border-white/10 bg-white/5 text-white/65",
          ].join(" ")}
        >
          {selected ? "Selected Plan" : "Select Plan"}
        </div>
      </div>
    </button>
  );
}

export default function Page() {
  const [wallet, setWallet] = useState("");
  const [amount, setAmount] = useState("");
  const [plan, setPlan] = useState(14);

  const [positions, setPositions] = useState<StakingPosition[]>([]);
  const [balance, setBalance] = useState<bigint>(0n);

  const [symbol, setSymbol] = useState("KRX");
  const [tokenDecimals, setTokenDecimals] = useState(18);

  const [loading, setLoading] = useState(false);
  const [withdrawingIndex, setWithdrawingIndex] =
    useState<number | null>(null);

  const [dataLoading, setDataLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  const [nowTick, setNowTick] = useState(
    Math.floor(Date.now() / 1000)
  );

  const { address, isConnected, chainId } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { switchChainAsync } = useSwitchChain();

  const selectedPlan =
    plans.find((item) => item.id === plan) || plans[1];

  const activePositionList = positions.filter(
    (position) => !position.claimed
  );

  const activePositions = activePositionList.length;

  const totalStakedRaw = activePositionList.reduce(
    (total, position) => total + position.amount,
    0n
  );

  const pendingRewardsRaw = activePositionList.reduce(
    (total, position) => total + position.reward,
    0n
  );

  const eligibleBuilderAmountRaw = activePositionList
    .filter(
      (position) =>
        position.rewardBps === BUILDER_ACCESS_REWARD_BPS
    )
    .reduce(
      (total, position) => total + position.amount,
      0n
    );

  const builderRequirementRaw = ethers.parseUnits(
    String(BUILDER_ACCESS_AMOUNT),
    tokenDecimals
  );

  const estimatedBuilderSlots =
    builderRequirementRaw > 0n
      ? Number(
          eligibleBuilderAmountRaw / builderRequirementRaw
        )
      : 0;

  const enteredAmountRaw = (() => {
    if (!isValidPositiveAmount(amount)) return 0n;

    try {
      return ethers.parseUnits(amount, tokenDecimals);
    } catch {
      return 0n;
    }
  })();

  const estimatedRewardRaw =
    enteredAmountRaw > 0n
      ? (enteredAmountRaw *
          BigInt(selectedPlan.rewardBps)) /
        10_000n
      : 0n;

  const estimatedReturnRaw =
    enteredAmountRaw + estimatedRewardRaw;

  const enteredAmountQualifies =
    selectedPlan.builderAccess &&
    enteredAmountRaw >= builderRequirementRaw;

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

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNowTick(Math.floor(Date.now() / 1000));
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  async function getConnectedBrowserProvider() {
    if (!isConnected || !walletClient || !address) {
      throw new Error(
        "Connect your wallet first from the top bar."
      );
    }

    if (chainId !== BSC_CHAIN_ID) {
      try {
        setStatus("Requesting switch to BNB Chain...");

        await switchChainAsync({
          chainId: BSC_CHAIN_ID,
        });

        await new Promise((resolve) => {
          window.setTimeout(resolve, 500);
        });
      } catch {
        throw new Error(
          "Please switch to BNB Chain and try again."
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

    return browserProvider;
  }

  async function load(
    targetWallet?: string,
    silent = false
  ) {
    if (!silent) {
      setDataLoading(true);
    }

    try {
      if (!STAKING_ADDRESS || !TOKEN_ADDRESS) {
        throw new Error(
          "Missing staking or token environment variables."
        );
      }

      if (
        !ethers.isAddress(STAKING_ADDRESS) ||
        !ethers.isAddress(TOKEN_ADDRESS)
      ) {
        throw new Error(
          "The staking or token contract address is invalid."
        );
      }

      const currentWallet = targetWallet || wallet;

      const rpcProvider = new ethers.JsonRpcProvider(RPC_URL);

      const stakingContract = new ethers.Contract(
        STAKING_ADDRESS,
        stakingAbi,
        rpcProvider
      );

      const tokenContract = new ethers.Contract(
        TOKEN_ADDRESS,
        tokenAbi,
        rpcProvider
      );

      const [loadedSymbol, loadedDecimals] =
        await Promise.all([
          tokenContract.symbol(),
          tokenContract.decimals(),
        ]);

      const decimals = Number(loadedDecimals);

      setSymbol(String(loadedSymbol || "KRX"));
      setTokenDecimals(decimals);

      if (currentWallet && ethers.isAddress(currentWallet)) {
        const normalizedWallet =
          ethers.getAddress(currentWallet);

        const [balanceRaw, countRaw] = await Promise.all([
          tokenContract.balanceOf(normalizedWallet),
          stakingContract.positionsCount(normalizedWallet),
        ]);

        setBalance(BigInt(balanceRaw.toString()));

        const positionsCount = Number(countRaw);

        const loadedPositions = await Promise.all(
          Array.from(
            { length: positionsCount },
            async (_, positionIndex) => {
              const [positionRaw, rewardRaw] =
                await Promise.all([
                  stakingContract.getPosition(
                    normalizedWallet,
                    positionIndex
                  ),
                  stakingContract.rewardOf(
                    normalizedWallet,
                    positionIndex
                  ),
                ]);

              const amountRaw =
                positionRaw.amount ?? positionRaw[0];

              const unlockTimeRaw =
                positionRaw.unlockTime ?? positionRaw[1];

              const rewardBpsRaw =
                positionRaw.rewardBps ?? positionRaw[2];

              const claimedRaw =
                positionRaw.claimed ?? positionRaw[3];

              return {
                index: positionIndex,
                amount: BigInt(amountRaw.toString()),
                unlock: Number(unlockTimeRaw),
                rewardBps: Number(rewardBpsRaw),
                claimed: Boolean(claimedRaw),
                reward: BigInt(rewardRaw.toString()),
              } satisfies StakingPosition;
            }
          )
        );

        setPositions(
          loadedPositions.sort(
            (first, second) =>
              second.index - first.index
          )
        );
      } else {
        setBalance(0n);
        setPositions([]);
      }

      setLastUpdated(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );

      if (!silent) {
        setStatus("");
      }
    } catch (error) {
      console.error("Load failed:", error);

      if (!silent) {
        setStatus(
          getErrorMessage(
            error,
            "Failed to load staking data."
          )
        );
      }
    } finally {
      if (!silent) {
        setDataLoading(false);
      }
    }
  }

  useEffect(() => {
    void load(wallet, false);

    const interval = window.setInterval(() => {
      void load(wallet, true);
    }, REFRESH_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [wallet]);

  function updateAmount(value: string) {
    const normalizedValue = value.replace(",", ".");

    if (
      normalizedValue === "" ||
      /^(?:\d+\.?\d*|\.\d*)$/.test(normalizedValue)
    ) {
      setAmount(normalizedValue);
    }
  }

  function useMaximumBalance() {
    if (balance <= 0n) {
      setAmount("");
      return;
    }

    setAmount(
      ethers.formatUnits(balance, tokenDecimals)
    );
  }

  async function stake() {
    if (loading) return;

    setLoading(true);
    setStatus("");

    try {
      if (!STAKING_ADDRESS || !TOKEN_ADDRESS) {
        throw new Error(
          "Missing staking or token environment variables."
        );
      }

      if (!isValidPositiveAmount(amount)) {
        throw new Error("Enter a valid KRX amount.");
      }

      const browserProvider =
        await getConnectedBrowserProvider();

      const signer = await browserProvider.getSigner();

      const stakingContract = new ethers.Contract(
        STAKING_ADDRESS,
        stakingAbi,
        signer
      );

      const tokenContract = new ethers.Contract(
        TOKEN_ADDRESS,
        tokenAbi,
        signer
      );

      const value = ethers.parseUnits(
        amount,
        tokenDecimals
      );

      const owner = await signer.getAddress();

      const tokenBalanceRaw =
        await tokenContract.balanceOf(owner);

      const tokenBalance = BigInt(
        tokenBalanceRaw.toString()
      );

      if (tokenBalance < value) {
        throw new Error(
          `Insufficient ${symbol} balance.`
        );
      }

      const allowanceRaw =
        await tokenContract.allowance(
          owner,
          STAKING_ADDRESS
        );

      const allowance = BigInt(
        allowanceRaw.toString()
      );

      if (allowance < value) {
        setStatus(
          `Approve ${symbol} spending in your wallet.`
        );

        const approvalTransaction =
          await tokenContract.approve(
            STAKING_ADDRESS,
            value
          );

        setStatus(
          "Approval submitted. Waiting for confirmation..."
        );

        await approvalTransaction.wait();
      }

      setStatus(
        `Confirm the ${selectedPlan.title} staking transaction in your wallet.`
      );

      const stakingTransaction =
        await stakingContract.stake(value, plan);

      setStatus(
        "Staking transaction submitted. Waiting for confirmation..."
      );

      const receipt =
        await stakingTransaction.wait();

      setAmount("");

      setStatus(
        `Stake completed successfully. Transaction: ${shortAddress(
          receipt.hash
        )}`
      );

      await load(owner, true);
    } catch (error) {
      console.error("Stake failed:", error);

      setStatus(
        getErrorMessage(error, "Stake failed.")
      );
    } finally {
      setLoading(false);
    }
  }

  async function withdraw(positionIndex: number) {
    if (withdrawingIndex !== null) return;

    setWithdrawingIndex(positionIndex);
    setStatus("");

    try {
      if (!STAKING_ADDRESS) {
        throw new Error(
          "Missing staking environment variable."
        );
      }

      const browserProvider =
        await getConnectedBrowserProvider();

      const signer = await browserProvider.getSigner();

      const stakingContract = new ethers.Contract(
        STAKING_ADDRESS,
        stakingAbi,
        signer
      );

      setStatus(
        `Confirm withdrawal for position #${positionIndex} in your wallet.`
      );

      const withdrawalTransaction =
        await stakingContract.withdraw(positionIndex);

      setStatus(
        "Withdrawal submitted. Waiting for confirmation..."
      );

      const receipt =
        await withdrawalTransaction.wait();

      setStatus(
        `Withdrawal completed successfully. Transaction: ${shortAddress(
          receipt.hash
        )}`
      );

      await load(await signer.getAddress(), true);
    } catch (error) {
      console.error("Withdraw failed:", error);

      setStatus(
        getErrorMessage(
          error,
          "Withdrawal failed."
        )
      );
    } finally {
      setWithdrawingIndex(null);
    }
  }

  return (
    <div className="space-y-8 overflow-hidden text-white">
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

          25% {
            transform: rotateY(90deg) rotateX(4deg) translateY(-4px)
              scale(1.02);
          }

          50% {
            transform: rotateY(180deg) rotateX(7deg) translateY(-7px)
              scale(1.045);
          }

          75% {
            transform: rotateY(270deg) rotateX(4deg) translateY(-4px)
              scale(1.02);
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

        @keyframes stakingHexPulse {
          0%, 100% {
            filter: brightness(1);
          }

          50% {
            filter: brightness(1.08);
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
          backface-visibility: visible;
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
          animation: stakingHexPulse 5.5s ease-in-out infinite;
        }

        .staking-hex-inner {
          clip-path:
            polygon(25% 6%,75% 6%,100% 50%,75% 94%,25% 94%,0% 50%);
          border: 1px solid rgba(255,255,255,0.09);
          box-shadow:
            inset 0 0 34px rgba(59,130,246,0.06),
            inset 0 1px 0 rgba(255,255,255,0.06);
        }

        .staking-hex-button {
          transition: transform 220ms ease;
        }

        .staking-hex-button:focus-visible {
          outline: none;
          filter: drop-shadow(0 0 20px rgba(96,165,250,0.65));
        }

        @media (max-width: 640px) {
          .staking-plan-card {
            height: 17rem;
            width: 15rem;
          }
        }

        @media (hover: none) {
          .staking-plan-card:hover {
            transform: none;
          }

          .staking-card-3d:hover {
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .staking-float,
          .staking-logo-spin,
          .staking-wordmark-float,
          .staking-logo-glow,
          .staking-energy-ring,
          .staking-scan-line,
          .staking-shimmer,
          .staking-plan-card {
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
              Stake KRX and unlock
              <span className="block bg-gradient-to-r from-blue-100 via-white to-cyan-200 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(59,130,246,0.55)]">
                fixed staking rewards.
              </span>
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/68 sm:text-lg">
              Choose a fixed-duration staking plan, lock your KRX tokens,
              and withdraw your principal plus the contract-calculated
              reward after the selected lock period ends.
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
                  {wallet
                    ? shortAddress(wallet)
                    : "Not connected"}
                </span>
              </div>

              <div className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-cyan-100">
                Builder Access:{" "}
                <span className="font-black">
                  1,500 KRX / 12M
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
                Fixed-duration KRX staking with transparent
                on-chain positions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricBox
          icon="👛"
          label="Wallet Balance"
          value={
            dataLoading
              ? "Loading..."
              : `${formatTokenAmount(
                  balance,
                  tokenDecimals
                )} ${symbol}`
          }
          desc="Current token balance available in your connected wallet."
          active
        />

        <MetricBox
          icon="🔒"
          label="Active Positions"
          value={
            dataLoading
              ? "Loading..."
              : String(activePositions)
          }
          desc="Open staking positions that have not been withdrawn."
        />

        <MetricBox
          icon="💎"
          label="Active Staked"
          value={
            dataLoading
              ? "Loading..."
              : `${formatTokenAmount(
                  totalStakedRaw,
                  tokenDecimals
                )} ${symbol}`
          }
          desc="Combined principal across your active staking positions."
        />

        <MetricBox
          icon="🧰"
          label="Builder Slots"
          value={
            dataLoading
              ? "Loading..."
              : String(estimatedBuilderSlots)
          }
          desc={`Estimated from active 12-month positions using ${BUILDER_ACCESS_AMOUNT.toLocaleString(
            "en-US"
          )} KRX per project slot.`}
          active={estimatedBuilderSlots > 0}
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
            Select one of the seven hexagonal plans, enter your amount,
            approve the token if required, and create your on-chain KRX
            staking position.
          </p>
        </div>

        <div className="space-y-10">
          <div className="flex flex-wrap justify-center gap-10">
            {plans.slice(0, 2).map((stakingPlan) => (
              <PlanCard
                key={stakingPlan.id}
                stakingPlan={stakingPlan}
                selected={plan === stakingPlan.id}
                onSelect={() =>
                  setPlan(stakingPlan.id)
                }
              />
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-10">
            {plans.slice(2, 5).map((stakingPlan) => (
              <PlanCard
                key={stakingPlan.id}
                stakingPlan={stakingPlan}
                selected={plan === stakingPlan.id}
                onSelect={() =>
                  setPlan(stakingPlan.id)
                }
              />
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-10">
            {plans.slice(5, 7).map((stakingPlan) => (
              <PlanCard
                key={stakingPlan.id}
                stakingPlan={stakingPlan}
                selected={plan === stakingPlan.id}
                onSelect={() =>
                  setPlan(stakingPlan.id)
                }
              />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[34px] border border-cyan-300/20 bg-cyan-400/[0.055] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.4)] backdrop-blur-md">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.15),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.09),transparent_38%)]" />

        <div className="relative grid gap-6 lg:grid-cols-[1fr_.9fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.26em] text-cyan-100">
              KORAX Builder Access
            </p>

            <h2 className="mt-3 text-3xl font-black text-white">
              1,500 KRX for one project slot.
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-8 text-white/65">
              Stake at least 1,500 KRX in the qualifying 12-month
              plan to support one KORAX project slot. Additional
              qualifying amounts can support additional slots according
              to the deployed access contract logic.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/ai"
                className="rounded-2xl bg-blue-500 px-5 py-3 text-sm font-black text-white shadow-[0_0_30px_rgba(59,130,246,0.28)] transition hover:bg-blue-400"
              >
                Open Token Builder AI
              </Link>

              <Link
                href="/website-builder-ai"
                className="rounded-2xl border border-blue-400/25 bg-blue-500/10 px-5 py-3 text-sm font-black text-blue-100 transition hover:bg-blue-500/20 hover:text-white"
              >
                Website Builder AI
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[26px] border border-white/10 bg-black/25 p-5">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
                Required Amount
              </div>

              <div className="mt-3 text-3xl font-black text-cyan-100">
                1,500 KRX
              </div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-black/25 p-5">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
                Required Plan
              </div>

              <div className="mt-3 text-3xl font-black text-white">
                12 Months
              </div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-black/25 p-5">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
                Eligible Amount
              </div>

              <div className="mt-3 text-xl font-black text-blue-100">
                {formatTokenAmount(
                  eligibleBuilderAmountRaw,
                  tokenDecimals
                )}{" "}
                {symbol}
              </div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-black/25 p-5">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
                Estimated Slots
              </div>

              <div className="mt-3 text-3xl font-black text-cyan-100">
                {estimatedBuilderSlots}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex justify-center">
        <div className="staking-card-3d w-full max-w-[520px] rounded-[30px] border border-white/10 bg-[#020617]/80 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-md">
          <div className="text-center">
            <div className="text-xs uppercase tracking-[0.22em] text-white/40">
              Stake Panel
            </div>

            <div className="mt-2 text-xl font-black text-white">
              {selectedPlan.title} • {selectedPlan.ret} Reward
            </div>

            <div className="mt-2 text-sm text-white/60">
              Balance:{" "}
              {formatTokenAmount(
                balance,
                tokenDecimals
              )}{" "}
              {symbol}
            </div>
          </div>

          <div className="relative mt-5">
            <input
              value={amount}
              inputMode="decimal"
              autoComplete="off"
              onChange={(event) =>
                updateAmount(event.target.value)
              }
              placeholder="Enter KRX amount"
              className="w-full rounded-2xl border border-white/10 bg-black/55 p-3 pr-24 text-center text-white outline-none transition placeholder:text-white/35 focus:border-blue-400/50 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.14)]"
            />

            <button
              type="button"
              onClick={useMaximumBalance}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg border border-blue-400/20 bg-blue-500/10 px-2.5 py-1 text-[10px] font-black text-blue-100 transition hover:bg-blue-500/20"
            >
              MAX
            </button>
          </div>

          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {["500", "1000", "1500", "3000"].map(
              (quickAmount) => (
                <button
                  key={quickAmount}
                  type="button"
                  onClick={() =>
                    setAmount(quickAmount)
                  }
                  className={[
                    "rounded-xl border px-3 py-2 text-xs font-bold transition",
                    amount === quickAmount
                      ? "border-blue-400/30 bg-blue-500/15 text-blue-100"
                      : "border-white/10 bg-white/[0.04] text-white/55 hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                >
                  {Number(
                    quickAmount
                  ).toLocaleString("en-US")}{" "}
                  KRX
                </button>
              )
            )}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-center">
              <div className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                Estimated Reward
              </div>

              <div className="mt-2 font-black text-blue-100">
                {formatTokenAmount(
                  estimatedRewardRaw,
                  tokenDecimals
                )}{" "}
                {symbol}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-center">
              <div className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                Estimated Return
              </div>

              <div className="mt-2 font-black text-white">
                {formatTokenAmount(
                  estimatedReturnRaw,
                  tokenDecimals
                )}{" "}
                {symbol}
              </div>
            </div>
          </div>

          {selectedPlan.builderAccess ? (
            <div
              className={[
                "mt-4 rounded-2xl border px-4 py-3 text-center text-sm",
                enteredAmountQualifies
                  ? "border-cyan-300/25 bg-cyan-400/10 text-cyan-100"
                  : "border-blue-400/20 bg-blue-500/10 text-blue-100",
              ].join(" ")}
            >
              {enteredAmountQualifies
                ? "This amount meets the current 1,500 KRX builder-access requirement."
                : "Stake at least 1,500 KRX in this plan to meet the current project-slot requirement."}
            </div>
          ) : null}

          <button
            type="button"
            onClick={stake}
            disabled={
              loading ||
              !wallet ||
              !isValidPositiveAmount(amount)
            }
            className="mt-4 w-full rounded-2xl bg-blue-500 py-3 font-black text-white shadow-[0_0_35px_rgba(59,130,246,0.35)] transition hover:scale-[1.01] hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {loading
              ? "Processing..."
              : wallet
                ? `Stake ${symbol}`
                : "Connect Wallet First"}
          </button>

          <button
            type="button"
            onClick={() => load(wallet, false)}
            disabled={dataLoading}
            className="mt-3 w-full rounded-2xl border border-white/10 bg-white/[0.05] py-3 text-sm font-bold text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-45"
          >
            {dataLoading
              ? "Refreshing..."
              : "Refresh Staking Data"}
          </button>

          {status ? (
            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-white/80">
              {status}
            </div>
          ) : null}

          <div className="mt-4 text-center text-[11px] text-white/35">
            Last update: {lastUpdated || "Waiting for data"}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl space-y-4">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-100">
            My Positions 📦
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            Active staking positions
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/55">
            Review principal amounts, contract-calculated rewards,
            unlock dates, and withdrawal availability.
          </p>
        </div>

        {!wallet ? (
          <div className="rounded-[26px] border border-white/10 bg-black/25 p-6 text-center text-white/70">
            Connect your wallet from the top bar to load your
            staking positions.
          </div>
        ) : dataLoading && positions.length === 0 ? (
          <div className="rounded-[26px] border border-white/10 bg-black/25 p-6 text-center text-white/70">
            Loading staking positions...
          </div>
        ) : positions.length === 0 ? (
          <div className="rounded-[26px] border border-white/10 bg-black/25 p-6 text-center text-white/70">
            No staking positions yet.
          </div>
        ) : (
          positions.map((position) => {
            const unlocked =
              nowTick >= position.unlock;

            const positionPlan =
              plans.find(
                (stakingPlan) =>
                  stakingPlan.rewardBps ===
                  position.rewardBps
              ) || null;

            const totalReturn =
              position.amount + position.reward;

            return (
              <div
                key={position.index}
                className="staking-card-3d rounded-[28px] border border-white/10 bg-black/25 p-5 shadow-[0_14px_40px_rgba(0,0,0,0.28)] backdrop-blur-md"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.22em] text-white/40">
                      Position #{position.index}
                    </div>

                    <div className="mt-2 text-lg font-black text-white">
                      {formatTokenAmount(
                        position.amount,
                        tokenDecimals
                      )}{" "}
                      {symbol}
                    </div>

                    <div className="mt-1 text-sm font-semibold text-blue-100">
                      {positionPlan?.title ||
                        `${position.rewardBps / 100}% Plan`}
                    </div>

                    <div className="mt-3 grid gap-2 text-sm text-white/65 sm:grid-cols-2">
                      <div>
                        Reward:{" "}
                        <span className="font-semibold text-blue-100">
                          +
                          {formatTokenAmount(
                            position.reward,
                            tokenDecimals
                          )}{" "}
                          {symbol}
                        </span>
                      </div>

                      <div>
                        Total:{" "}
                        <span className="font-semibold text-white">
                          {formatTokenAmount(
                            totalReturn,
                            tokenDecimals
                          )}{" "}
                          {symbol}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 text-sm text-white/60">
                      Unlock: {formatDate(position.unlock)}
                    </div>

                    <div
                      className={[
                        "mt-2 text-sm font-semibold",
                        position.claimed
                          ? "text-white/50"
                          : unlocked
                            ? "text-blue-100"
                            : "text-cyan-100",
                      ].join(" ")}
                    >
                      {position.claimed
                        ? "Completed"
                        : formatCountdown(
                            position.unlock,
                            nowTick
                          )}
                    </div>
                  </div>

                  <div className="sm:text-right">
                    {position.claimed ? (
                      <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/60">
                        Withdrawn
                      </div>
                    ) : unlocked ? (
                      <button
                        type="button"
                        onClick={() =>
                          withdraw(position.index)
                        }
                        disabled={
                          withdrawingIndex !== null
                        }
                        className="rounded-xl bg-blue-500 px-4 py-2 font-black text-white shadow-[0_0_25px_rgba(59,130,246,0.28)] transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        {withdrawingIndex === position.index
                          ? "Withdrawing..."
                          : "Withdraw"}
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

      <section className="rounded-[24px] border border-amber-300/15 bg-amber-300/[0.045] px-5 py-4 text-xs leading-6 text-white/45">
        <span className="font-black text-amber-100">
          Staking and security notice:
        </span>{" "}
        Staked KRX remains locked until the contract-defined unlock
        time. Reward percentages do not guarantee future KRX value,
        liquidity, or profitability. Verify the token address, staking
        address, selected plan, amount, and wallet transaction before
        approval. Blockchain transactions are generally irreversible.
      </section>
    </div>
  );
}