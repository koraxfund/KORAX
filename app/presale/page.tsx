"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ethers } from "ethers";
import { useAccount, useSwitchChain, useWalletClient } from "wagmi";

type PayMode = "bnb" | "usdt" | "usdc";

const RPC_URL = "https://bsc-dataseed.binance.org/";

const PRESALE_ADDRESS =
  process.env.NEXT_PUBLIC_PRESALE_ADDRESS ||
  "0xe00f19366cBd91f5603C3674f00de3CAB77261D7";

const USDT_ADDRESS =
  process.env.NEXT_PUBLIC_USDT_ADDRESS ||
  "0x55d398326f99059fF775485246999027B3197955";

const USDC_ADDRESS =
  process.env.NEXT_PUBLIC_USDC_ADDRESS ||
  "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d";

const PRESALE_BSCSCAN_URL =
  process.env.NEXT_PUBLIC_PRESALE_BSCSCAN_URL ||
  `https://bscscan.com/address/${PRESALE_ADDRESS}#code`;

const STAGE_CAPS = [
  10_000_000,
  10_000_000,
  10_000_000,
  10_000_000,
  10_000_000,
];

const STAGE_PRICES = [0.05, 0.07, 0.09, 0.11, 0.13];

const BSC_CHAIN_ID = 56;

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
  "w-full rounded-2xl border border-white/10 bg-[#020617]/75 px-4 py-3 text-white outline-none placeholder:text-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition focus:border-blue-400/60 focus:bg-[#020617]/95 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]";

const selectClass =
  "w-full rounded-2xl border border-white/10 bg-[#020617]/75 px-4 py-3 text-white outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition focus:border-blue-400/60 focus:bg-[#020617]/95 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]";

const glassButtonClass =
  "rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 font-black text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50";

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatTokenAmount(
  value: bigint,
  decimals = 18,
  maximumFractionDigits = 4
) {
  const formatted = ethers.formatUnits(value, decimals);
  const num = Number(formatted);

  if (!Number.isFinite(num)) return "0";

  return num.toLocaleString("en-US", { maximumFractionDigits });
}

function formatDate(unix: bigint | number) {
  const value = typeof unix === "bigint" ? Number(unix) : unix;
  if (!value) return "Not started";
  return new Date(value * 1000).toLocaleString("en-US");
}

async function validateContract(provider: ethers.Provider, address: string) {
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
        method,
        params: (params as any) ?? [],
      });
    },
  };
}

function StatusPill({
  active,
  children,
}: {
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em]",
        active
          ? "border-blue-300/30 bg-blue-500/10 text-blue-100 shadow-[0_0_22px_rgba(59,130,246,0.16)]"
          : "border-white/10 bg-white/[0.04] text-white/50",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function MetricCard({
  label,
  value,
  description,
  active,
}: {
  label: string;
  value: ReactNode;
  description: string;
  active?: boolean;
}) {
  return (
    <div
      className={[
        "presale-card-3d relative overflow-hidden rounded-[28px] border p-6 shadow-[0_18px_55px_rgba(0,0,0,0.32)] backdrop-blur-xl",
        active
          ? "border-blue-300/30 bg-blue-500/10"
          : "border-white/10 bg-[#020617]/55",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.10),transparent_36%)]" />

      <div className="relative">
        <div className="text-sm text-white/50">{label}</div>

        <div
          className={[
            "mt-2 font-black",
            active ? "text-blue-100" : "text-white",
          ].join(" ")}
        >
          {value}
        </div>

        <p className="mt-3 text-sm leading-relaxed text-white/60">
          {description}
        </p>
      </div>
    </div>
  );
}

function SectionBox({
  title,
  eyebrow,
  children,
  right,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  right?: ReactNode;
}) {
  return (
    <section className="presale-section-card relative overflow-hidden rounded-[32px] border border-white/10 bg-[#020617]/60 p-5 shadow-[0_24px_95px_rgba(0,0,0,0.48)] backdrop-blur-xl md:p-6">
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

function PresaleCoreVisual({
  stage,
  progress,
  saleActive,
}: {
  stage: number;
  progress: number;
  saleActive: boolean;
}) {
  return (
    <div
      className="home-float relative rounded-[38px] border border-white/10 bg-black/30 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.52)]"
      aria-label={`KORAX presale visual. Stage ${stage}. Progress ${progress.toFixed(
        2
      )} percent. Sale ${saleActive ? "active" : "closed"}.`}
    >
      <style>{`
        @keyframes homeFloat {
          0%, 100% {
            transform: translateY(0) rotateX(0deg) rotateY(0deg);
          }
          50% {
            transform: translateY(-12px) rotateX(3deg) rotateY(-3deg);
          }
        }

        @keyframes homeLogoSpin {
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

        @keyframes homeWordmarkFloat {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.94;
          }
          50% {
            transform: translateY(-7px) scale(1.02);
            opacity: 1;
          }
        }

        @keyframes homeLogoGlow {
          0%, 100% {
            opacity: 0.34;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.16);
          }
        }

        @keyframes homeRing {
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

        .home-float {
          animation: homeFloat 6.8s ease-in-out infinite;
          will-change: transform;
          transform-style: preserve-3d;
        }

        .home-logo-zone,
        .home-logo-zone img,
        .home-wordmark-float {
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .home-logo-spin {
          transform-style: preserve-3d;
          animation: homeLogoSpin 9s linear infinite;
          will-change: transform;
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .home-wordmark-float {
          animation: homeWordmarkFloat 4s ease-in-out infinite;
          will-change: transform;
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .home-logo-glow {
          animation: homeLogoGlow 3.6s ease-in-out infinite;
        }

        .home-energy-ring {
          animation: homeRing 12s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .home-float,
          .home-logo-spin,
          .home-wordmark-float,
          .home-logo-glow,
          .home-energy-ring {
            animation: none;
          }
        }
      `}</style>

      <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-blue-500/15 blur-3xl" />
      <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="home-logo-zone relative flex min-h-[330px] flex-col items-center justify-center overflow-visible bg-transparent">
        <div className="home-logo-glow absolute h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute h-44 w-44 rounded-full bg-cyan-400/10 blur-2xl" />
        <div className="absolute h-28 w-28 rounded-full bg-white/5 blur-2xl" />

        <img
          src="/Korax-logo.png"
          alt="KORAX official logo"
          className="home-logo-spin relative h-48 w-48 bg-transparent object-contain drop-shadow-[0_0_36px_rgba(59,130,246,0.95)] sm:h-56 sm:w-56 lg:h-60 lg:w-60"
        />

        <img
          src="/korax-wordmark.png"
          alt="KORAX wordmark"
          className="home-wordmark-float relative mt-4 h-14 w-auto max-w-[280px] bg-transparent object-contain drop-shadow-[0_0_24px_rgba(59,130,246,0.95)] sm:h-16 sm:max-w-[360px]"
        />

        <div className="home-energy-ring pointer-events-none absolute h-72 w-72 rounded-full border border-blue-400/10" />
      </div>
    </div>
  );
}

export default function PresalePage() {
  const [mounted, setMounted] = useState(false);

  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [stage, setStage] = useState<number>(1);
  const [stagePrice, setStagePrice] = useState<number>(0.05);
  const [stageRemaining, setStageRemaining] = useState<string>("0");
  const [totalSold, setTotalSold] = useState<string>("0");
  const [progress, setProgress] = useState<number>(0);
  const [saleActive, setSaleActive] = useState<boolean>(true);
  const [claimEnabled, setClaimEnabled] = useState<boolean>(false);
  const [claimStart, setClaimStart] = useState<string>("Not started");
  const [antiBotEnabled, setAntiBotEnabled] = useState<boolean>(false);
  const [buyCooldown, setBuyCooldown] = useState<number>(0);
  const [preview, setPreview] = useState<string>("-");
  const [busy, setBusy] = useState<"" | PayMode>("");
  const [previewMode, setPreviewMode] = useState<PayMode>("usdt");
  const [status, setStatus] = useState("");
  const [contractUsdtAddress, setContractUsdtAddress] = useState(USDT_ADDRESS);
  const [contractUsdcAddress, setContractUsdcAddress] = useState(USDC_ADDRESS);

  const previewDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  async function getRpcProvider() {
    const rpcProvider = new ethers.JsonRpcProvider(RPC_URL);
    await validateContract(rpcProvider, PRESALE_ADDRESS);
    return rpcProvider;
  }

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

  async function getRpcPresale() {
    const rpcProvider = await getRpcProvider();
    return new ethers.Contract(PRESALE_ADDRESS, presaleAbi, rpcProvider);
  }

  async function refreshPresaleData() {
    try {
      const presale = await getRpcPresale();

      const [
        currentStageRaw,
        totalSoldRaw,
        totalForSaleRaw,
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

      const currentStageNum = Number(currentStageRaw);
      const uiStage = Math.min(currentStageNum + 1, STAGE_PRICES.length);

      const totalSoldBig = BigInt(totalSoldRaw.toString());
      const totalForSaleBig = BigInt(totalForSaleRaw.toString());

      const currentRemainingRaw =
        currentStageNum < 5 ? await presale.stageRemaining(currentStageNum) : 0n;

      const progressValue =
        totalForSaleBig > 0n
          ? Math.min(
              100,
              Number((totalSoldBig * 10000n) / totalForSaleBig) / 100
            )
          : 0;

      setStage(uiStage);
      setStagePrice(
        STAGE_PRICES[Math.min(currentStageNum, 4)] ?? STAGE_PRICES[4]
      );
      setStageRemaining(
        formatTokenAmount(BigInt(currentRemainingRaw.toString()), 18, 2)
      );
      setTotalSold(formatTokenAmount(totalSoldBig, 18, 2));
      setProgress(progressValue);
      setSaleActive(Boolean(saleActiveRaw));
      setClaimEnabled(Boolean(claimEnabledRaw));
      setClaimStart(formatDate(BigInt(claimStartRaw.toString())));
      setAntiBotEnabled(Boolean(antiBotRaw));
      setBuyCooldown(Number(cooldownRaw));
      setContractUsdtAddress(ethers.getAddress(usdtRaw));
      setContractUsdcAddress(ethers.getAddress(usdcRaw));
    } catch (err) {
      console.error("Failed to read presale data:", err);
    }
  }

  async function refreshPreview(mode: PayMode, inputAmount: string) {
    try {
      if (!inputAmount || Number(inputAmount) <= 0) {
        setPreview("-");
        return;
      }

      const rpcProvider = await getRpcProvider();

      const presale = new ethers.Contract(
        PRESALE_ADDRESS,
        presaleAbi,
        rpcProvider
      );

      let out: bigint = 0n;

      if (mode === "bnb") {
        const wei = ethers.parseEther(inputAmount);
        out = await presale.previewTokensForBNB(wei);
      } else if (mode === "usdt") {
        await validateContract(rpcProvider, contractUsdtAddress);

        const token = new ethers.Contract(
          contractUsdtAddress,
          erc20Abi,
          rpcProvider
        );

        const decimals = Number(await token.decimals());
        const amountRaw = ethers.parseUnits(inputAmount, decimals);
        out = await presale.previewTokensForUSDT(amountRaw);
      } else {
        await validateContract(rpcProvider, contractUsdcAddress);

        const token = new ethers.Contract(
          contractUsdcAddress,
          erc20Abi,
          rpcProvider
        );

        const decimals = Number(await token.decimals());
        const amountRaw = ethers.parseUnits(inputAmount, decimals);
        out = await presale.previewTokensForUSDC(amountRaw);
      }

      setPreview(`${formatTokenAmount(BigInt(out.toString()), 18, 4)} KORAX`);
    } catch (err) {
      console.error("Preview failed:", err);
      setPreview("Error");
    }
  }

  useEffect(() => {
    if (!mounted) return;

    refreshPresaleData();

    const interval = setInterval(() => {
      refreshPresaleData();
    }, 10000);

    return () => clearInterval(interval);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    if (previewDebounceRef.current) {
      clearTimeout(previewDebounceRef.current);
    }

    previewDebounceRef.current = setTimeout(() => {
      refreshPreview(previewMode, amount);
    }, 350);

    return () => {
      if (previewDebounceRef.current) {
        clearTimeout(previewDebounceRef.current);
      }
    };
  }, [amount, previewMode, mounted, contractUsdtAddress, contractUsdcAddress]);

  async function buyWithBNB() {
    try {
      if (busy) return;

      if (!amount || Number(amount) <= 0) {
        alert("Enter a valid BNB amount.");
        return;
      }

      setPreviewMode("bnb");
      setBusy("bnb");
      setStatus("Preparing BNB transaction...");

      const browserProvider = await getConnectedBrowserProvider();
      if (!browserProvider) return;

      const signer = await browserProvider.getSigner();
      const presale = new ethers.Contract(PRESALE_ADDRESS, presaleAbi, signer);

      const active = await presale.saleActive();
      if (!active) throw new Error("Presale is not active");

      const value = ethers.parseEther(amount);
      const tx = await presale.buyWithBNB({ value });

      setStatus("BNB transaction sent. Waiting for confirmation...");
      await tx.wait();

      setStatus("BNB purchase completed successfully.");
      setAmount("");
      setPreview("-");
      await refreshPresaleData();
    } catch (error: any) {
      console.error("BNB buy failed:", error);

      const rawMsg =
        error?.shortMessage ||
        error?.reason ||
        error?.message ||
        "BNB purchase failed.";

      const lowered = String(rawMsg).toLowerCase();

      const msg = lowered.includes("insufficient funds")
        ? "Insufficient BNB balance for purchase + gas."
        : rawMsg;

      setStatus(msg);
      alert(msg);
    } finally {
      setBusy("");
    }
  }

  async function approveAndBuyStable(mode: "usdt" | "usdc") {
    try {
      if (busy) return;

      if (!amount || Number(amount) <= 0) {
        alert(`Enter a valid ${mode.toUpperCase()} amount.`);
        return;
      }

      setPreviewMode(mode);
      setBusy(mode);
      setStatus(`Preparing ${mode.toUpperCase()} transaction...`);

      const browserProvider = await getConnectedBrowserProvider();
      if (!browserProvider) return;

      const signer = await browserProvider.getSigner();
      const owner = await signer.getAddress();

      const presale = new ethers.Contract(PRESALE_ADDRESS, presaleAbi, signer);
      const active = await presale.saleActive();
      if (!active) throw new Error("Presale is not active");

      const tokenAddress =
        mode === "usdt" ? contractUsdtAddress : contractUsdcAddress;

      const token = new ethers.Contract(tokenAddress, erc20Abi, signer);

      const decimals = Number(await token.decimals());
      const amountRaw = ethers.parseUnits(amount, decimals);

      const balance = await token.balanceOf(owner);
      if (BigInt(balance.toString()) < amountRaw) {
        throw new Error(`Insufficient ${mode.toUpperCase()} balance`);
      }

      const allowance = await token.allowance(owner, PRESALE_ADDRESS);

      if (BigInt(allowance.toString()) < amountRaw) {
        setStatus(`Approving ${mode.toUpperCase()}...`);

        const approveTx = await token.approve(PRESALE_ADDRESS, amountRaw);
        await approveTx.wait();
      }

      setStatus(`Buying with ${mode.toUpperCase()}...`);

      const tx =
        mode === "usdt"
          ? await presale.buyWithUSDT(amountRaw)
          : await presale.buyWithUSDC(amountRaw);

      await tx.wait();

      setStatus(`${mode.toUpperCase()} purchase completed successfully.`);
      setAmount("");
      setPreview("-");
      await refreshPresaleData();
    } catch (error: any) {
      console.error(`${mode.toUpperCase()} buy failed:`, error);

      const msg =
        error?.shortMessage ||
        error?.reason ||
        error?.message ||
        `${mode.toUpperCase()} purchase failed.`;

      setStatus(msg);
      alert(msg);
    } finally {
      setBusy("");
    }
  }

  if (!mounted) return null;

  return (
    <div className="space-y-8">
      <style>{`
        @keyframes presaleCardShimmer {
          0%,
          76% {
            transform: translateX(-120%);
            opacity: 0;
          }

          84% {
            opacity: 1;
          }

          100% {
            transform: translateX(120%);
            opacity: 0;
          }
        }

        .presale-card-3d {
          transform-style: preserve-3d;
          transition:
            transform 240ms ease,
            border-color 240ms ease,
            background 240ms ease,
            box-shadow 240ms ease;
        }

        .presale-card-3d:hover {
          transform: translateY(-3px) perspective(900px) rotateX(1.4deg);
          border-color: rgba(96, 165, 250, 0.3);
          box-shadow: 0 20px 70px rgba(0, 0, 0, 0.42);
        }

        .presale-section-card {
          transform-style: preserve-3d;
        }

        .presale-section-card::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            120deg,
            transparent,
            rgba(255, 255, 255, 0.035),
            transparent
          );
          transform: translateX(-120%);
          animation: presaleCardShimmer 8s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .presale-section-card::after {
            animation: none;
          }

          .presale-card-3d:hover {
            transform: none;
          }
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
              KORAX Presale / BNB Chain
            </div>

            <h1 className="mt-6 text-4xl font-black leading-[0.96] tracking-tight text-white sm:text-6xl xl:text-7xl">
              Join the
              <span className="block bg-gradient-to-r from-blue-300 via-cyan-200 to-white bg-clip-text text-transparent">
                KORAX Presale.
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-white/70 sm:text-lg">
              Participate through the verified on-chain presale contract on BNB
              Smart Chain. The sale follows a transparent five-stage structure
              with progressive pricing and live contract-based progress data.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <StatusPill active={saleActive}>
                {saleActive ? "Sale Active" : "Sale Closed"}
              </StatusPill>

              <StatusPill active>Stage {stage} / 5</StatusPill>

              <StatusPill active>BNB Chain</StatusPill>

              <StatusPill active={Boolean(walletAddress)}>
                {walletAddress ? shortenAddress(walletAddress) : "Wallet Off"}
              </StatusPill>
            </div>

            <div className="mt-7 rounded-[28px] border border-white/10 bg-[#020617]/55 p-5 backdrop-blur-xl">
              <div className="text-xs font-black uppercase tracking-[0.22em] text-white/40">
                Verified Presale Contract
              </div>

              <div className="mt-3 break-all rounded-2xl border border-white/10 bg-black/35 p-4 font-mono text-xs text-white/80">
                {PRESALE_ADDRESS}
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={PRESALE_BSCSCAN_URL}
                  target="_blank"
                  rel="noreferrer"
                  className={glassButtonClass}
                >
                  Open on BscScan
                </a>

                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(PRESALE_ADDRESS)}
                  className={glassButtonClass}
                >
                  Copy Address
                </button>
              </div>
            </div>
          </div>

          <PresaleCoreVisual
            stage={stage}
            progress={progress}
            saleActive={saleActive}
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          active
          label="Current Stage"
          value={<div className="text-3xl">{stage} / 5</div>}
          description="Active presale stage based on the live contract state."
        />

        <MetricCard
          label="Stage Price"
          value={<div className="text-3xl">${stagePrice.toFixed(2)}</div>}
          description="Current token price for this stage."
        />

        <MetricCard
          label="Total Sold"
          value={<div className="text-2xl">{totalSold} KORAX</div>}
          description="Total KORAX sold across all presale stages."
        />

        <MetricCard
          label="Stage Remaining"
          value={<div className="text-2xl">{stageRemaining} KORAX</div>}
          description="Remaining allocation in the current stage."
        />
      </section>

      <SectionBox
        eyebrow="Live Contract Progress"
        title="Presale Progress"
        right={
          <StatusPill active={saleActive}>
            {saleActive ? "Active" : "Closed"}
          </StatusPill>
        }
      >
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between text-sm text-white/60">
            <span>Total presale allocation</span>
            <span className="font-black text-white">{progress.toFixed(2)}%</span>
          </div>

          <div className="h-4 w-full overflow-hidden rounded-full border border-white/10 bg-black/40">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-300 to-white shadow-[0_0_28px_rgba(34,211,238,0.35)] transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
            <div className="text-sm text-white/50">Sale Status</div>
            <div
              className={`mt-2 font-black ${
                saleActive ? "text-blue-100" : "text-white"
              }`}
            >
              {saleActive ? "Active" : "Closed"}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
            <div className="text-sm text-white/50">Claim Status</div>
            <div className="mt-2 font-black text-white">
              {claimEnabled ? "Enabled" : "Not Enabled Yet"}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
            <div className="text-sm text-white/50">Claim Start</div>
            <div className="mt-2 text-sm font-black text-white">
              {claimStart}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
            <div className="text-sm text-white/50">Anti-Bot</div>
            <div className="mt-2 font-black text-white">
              {antiBotEnabled ? `Enabled (${buyCooldown}s)` : "Off"}
            </div>
          </div>
        </div>
      </SectionBox>

      <section className="grid gap-6 xl:grid-cols-[1fr_430px]">
        <SectionBox eyebrow="Purchase Panel" title="Buy KORAX during the presale">
          <p className="mt-3 text-sm leading-7 text-white/60">
            Enter the amount you want to spend, preview the estimated KORAX
            amount, then complete the purchase with BNB, USDT, or USDC.
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_210px]">
            <input
              type="number"
              step="0.000001"
              min="0"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={inputClass}
            />

            <select
              value={previewMode}
              onChange={(e) => setPreviewMode(e.target.value as PayMode)}
              className={selectClass}
            >
              <option value="usdt">Preview with USDT</option>
              <option value="usdc">Preview with USDC</option>
              <option value="bnb">Preview with BNB</option>
            </select>
          </div>

          <div className="mt-5 rounded-[26px] border border-blue-300/20 bg-blue-500/10 p-5">
            <div className="text-sm text-white/60">Estimated Tokens</div>

            <div className="mt-2 text-3xl font-black text-blue-100">
              {preview}
            </div>

            <p className="mt-2 text-xs leading-relaxed text-white/60">
              Preview is calculated from the presale contract and may change
              depending on stage availability and live contract state.
            </p>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <button
              onClick={buyWithBNB}
              disabled={!saleActive || busy !== ""}
              style={{
                backgroundColor: "#F0C94B",
                color: "#000000",
                boxShadow: "0 0 34px rgba(240, 201, 75, 0.35)",
              }}
              className="rounded-2xl px-5 py-3 font-black transition hover:scale-[1.01] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-100"
            >
              {busy === "bnb" ? "Processing..." : "Buy with BNB"}
            </button>

            <button
              onClick={() => approveAndBuyStable("usdt")}
              disabled={!saleActive || busy !== ""}
              style={{
                backgroundColor: "#5EC46B",
                color: "#000000",
                boxShadow: "0 0 34px rgba(94, 196, 107, 0.35)",
              }}
              className="rounded-2xl px-5 py-3 font-black transition hover:scale-[1.01] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-100"
            >
              {busy === "usdt" ? "Processing..." : "Buy with USDT"}
            </button>

            <button
              onClick={() => approveAndBuyStable("usdc")}
              disabled={!saleActive || busy !== ""}
              style={{
                backgroundColor: "#5A84E8",
                color: "#ffffff",
                boxShadow: "0 0 34px rgba(90, 132, 232, 0.38)",
              }}
              className="rounded-2xl px-5 py-3 font-black transition hover:scale-[1.01] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-100"
            >
              {busy === "usdc" ? "Processing..." : "Buy with USDC"}
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <StatusPill active={saleActive}>
              Presale {saleActive ? "Active" : "Closed"}
            </StatusPill>

            {walletAddress ? (
              <StatusPill active>
                Connected {shortenAddress(walletAddress)}
              </StatusPill>
            ) : (
              <span className="inline-flex items-center rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-yellow-200">
                Connect wallet first
              </span>
            )}
          </div>

          {status ? (
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white/80">
              {status}
            </div>
          ) : null}
        </SectionBox>

        <SectionBox eyebrow="Presale Details" title="Stage-based pricing">
          <div className="mt-5 space-y-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
              <div className="text-sm text-white/50">Current Price</div>
              <div className="mt-1 text-lg font-black text-white">
                ${stagePrice.toFixed(2)}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
              <div className="text-sm text-white/50">Planned Listing Price</div>
              <div className="mt-1 text-lg font-black text-white">$0.15</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
              <div className="text-sm text-white/50">Accepted Payments</div>
              <div className="mt-1 text-lg font-black text-white">
                BNB / USDT / USDC
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
              <div className="text-sm text-white/50">Claim</div>
              <div className="mt-1 text-sm font-black text-white">
                Available after presale completion and claim activation.
              </div>
            </div>

            <div className="rounded-2xl border border-blue-300/20 bg-blue-500/10 p-4">
              <div className="text-sm text-white/50">Contract USDT</div>
              <div className="mt-1 break-all font-mono text-xs text-blue-100">
                {contractUsdtAddress}
              </div>
            </div>

            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4">
              <div className="text-sm text-white/50">Contract USDC</div>
              <div className="mt-1 break-all font-mono text-xs text-cyan-100">
                {contractUsdcAddress}
              </div>
            </div>
          </div>
        </SectionBox>
      </section>

      <SectionBox
        eyebrow="KORAX Presale Stages"
        title="Five-stage token allocation"
        right={
          <div className="text-sm text-white/55">
            Listing target:{" "}
            <span className="font-black text-white">$0.15</span>
          </div>
        }
      >
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {STAGE_PRICES.map((price, index) => {
            const active = stage === index + 1;
            const done = stage > index + 1;

            return (
              <div
                key={index}
                className={[
                  "presale-card-3d rounded-[26px] border p-5 backdrop-blur-xl transition",
                  active
                    ? "border-blue-300/40 bg-blue-500/10 shadow-[0_0_38px_rgba(59,130,246,0.16)]"
                    : done
                      ? "border-cyan-300/20 bg-cyan-400/10"
                      : "border-white/10 bg-[#020617]/50",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm text-white/50">
                    Stage {index + 1}
                  </div>

                  {active ? (
                    <span className="rounded-full border border-blue-300/25 bg-blue-500/10 px-2 py-1 text-[11px] font-black text-blue-100">
                      Current
                    </span>
                  ) : done ? (
                    <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-2 py-1 text-[11px] font-black text-cyan-100">
                      Done
                    </span>
                  ) : null}
                </div>

                <div className="mt-3 text-2xl font-black text-white">
                  ${price.toFixed(2)}
                </div>

                <div className="mt-2 text-sm text-white/60">
                  {STAGE_CAPS[index].toLocaleString("en-US")} KORAX
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={[
                      "h-full rounded-full transition-all duration-700",
                      active
                        ? "bg-gradient-to-r from-blue-500 via-cyan-300 to-white"
                        : done
                          ? "bg-cyan-300/70"
                          : "bg-white/15",
                    ].join(" ")}
                    style={{
                      width: active ? "72%" : done ? "100%" : "18%",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </SectionBox>
    </div>
  );
}