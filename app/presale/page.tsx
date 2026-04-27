"use client";

import { useEffect, useRef, useState } from "react";
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
      } catch (err) {
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
      <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-black/30 p-8 shadow-[0_24px_90px_rgba(0,0,0,0.45)] backdrop-blur-md">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,255,106,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.07),transparent_30%)]" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">
              KORAX Presale
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
              Join the KORAX 5-stage presale
            </h1>

            <p className="mt-4 max-w-3xl leading-relaxed text-white/70">
              Participate through the verified on-chain presale contract on BNB
              Smart Chain. The sale follows a transparent five-stage structure
              with progressive pricing and live contract-based progress data.
            </p>

            <div className="mt-5 flex flex-wrap gap-3 text-xs">
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/60">
                Sale:{" "}
                <span
                  className={
                    saleActive
                      ? "font-semibold text-[#c4ffbc]"
                      : "font-semibold text-white"
                  }
                >
                  {saleActive ? "Active" : "Closed"}
                </span>
              </div>

              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/60">
                Stage:{" "}
                <span className="font-semibold text-white">{stage} / 5</span>
              </div>

              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/60">
                Network:{" "}
                <span className="font-semibold text-white">BNB Chain</span>
              </div>

              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/60">
                Wallet:{" "}
                <span className="font-semibold text-white">
                  {walletAddress ? shortenAddress(walletAddress) : "Not connected"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/35 p-5 text-sm text-white/75 lg:w-[430px]">
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
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white transition hover:bg-white/10"
              >
                Open on BscScan
              </a>

              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(PRESALE_ADDRESS)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white transition hover:bg-white/10"
              >
                Copy Address
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-[#7CFF6A]/20 bg-[#7CFF6A]/10 p-6 shadow-[0_18px_55px_rgba(0,0,0,0.28)] backdrop-blur-md">
          <div className="text-sm text-white/60">Current Stage</div>
          <div className="mt-2 text-3xl font-extrabold text-[#c4ffbc]">
            {stage} / 5
          </div>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Active presale stage based on the live contract state.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/25 p-6 shadow-[0_18px_55px_rgba(0,0,0,0.28)] backdrop-blur-md">
          <div className="text-sm text-white/50">Stage Price</div>
          <div className="mt-2 text-3xl font-extrabold text-white">
            ${stagePrice.toFixed(2)}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-white/65">
            Current token price for this stage.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/25 p-6 shadow-[0_18px_55px_rgba(0,0,0,0.28)] backdrop-blur-md">
          <div className="text-sm text-white/50">Total Sold</div>
          <div className="mt-2 text-2xl font-extrabold text-white">
            {totalSold} KORAX
          </div>
          <p className="mt-3 text-sm leading-relaxed text-white/65">
            Total KORAX sold across all presale stages.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/25 p-6 shadow-[0_18px_55px_rgba(0,0,0,0.28)] backdrop-blur-md">
          <div className="text-sm text-white/50">Stage Remaining</div>
          <div className="mt-2 text-2xl font-extrabold text-white">
            {stageRemaining} KORAX
          </div>
          <p className="mt-3 text-sm leading-relaxed text-white/65">
            Remaining allocation in the current stage.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-black/25 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.32)] backdrop-blur-md">
        <div className="mb-3 flex items-center justify-between text-sm text-white/60">
          <span>Presale Progress</span>
          <span className="font-semibold text-white">{progress.toFixed(2)}%</span>
        </div>

        <div className="h-4 w-full overflow-hidden rounded-full border border-white/10 bg-black/40">
          <div
            className="h-full rounded-full bg-[#7CFF6A] shadow-[0_0_28px_rgba(124,255,106,0.35)] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm text-white/50">Sale Status</div>
            <div
              className={`mt-2 font-semibold ${
                saleActive ? "text-[#c4ffbc]" : "text-white"
              }`}
            >
              {saleActive ? "Active" : "Closed"}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm text-white/50">Claim Status</div>
            <div className="mt-2 font-semibold text-white">
              {claimEnabled ? "Enabled" : "Not Enabled Yet"}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm text-white/50">Claim Start</div>
            <div className="mt-2 text-sm font-semibold text-white">
              {claimStart}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm text-white/50">Anti-Bot Protection</div>
            <div className="mt-2 font-semibold text-white">
              {antiBotEnabled ? `Enabled (${buyCooldown}s)` : "Off"}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="rounded-2xl border border-white/10 bg-black/25 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.32)] backdrop-blur-md">
          <div className="mb-5">
            <p className="text-xs uppercase tracking-[0.24em] text-white/40">
              Purchase Panel
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              Buy KORAX during the presale
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-white/60">
              Enter the amount you want to spend, preview the estimated KORAX
              amount, then complete the purchase with BNB, USDT, or USDC.
            </p>
          </div>

          <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_auto]">
            <input
              type="number"
              step="0.000001"
              min="0"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-[#7CFF6A]/40"
            />

            <select
              value={previewMode}
              onChange={(e) => setPreviewMode(e.target.value as PayMode)}
              className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-[#7CFF6A]/40"
            >
              <option value="usdt">Preview with USDT</option>
              <option value="usdc">Preview with USDC</option>
              <option value="bnb">Preview with BNB</option>
            </select>
          </div>

          <div className="mb-5 rounded-2xl border border-[#7CFF6A]/20 bg-[#7CFF6A]/10 p-5">
            <div className="text-sm text-white/60">Estimated Tokens</div>
            <div className="mt-2 text-2xl font-extrabold text-[#c4ffbc]">
              {preview}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-white/60">
              Preview is calculated from the presale contract and may change
              depending on stage availability and live contract state.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <button
              onClick={buyWithBNB}
              disabled={!saleActive || busy !== ""}
              className="rounded-xl bg-[#F0C94B] px-4 py-3 font-semibold text-black transition hover:scale-[1.01] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy === "bnb" ? "Processing..." : "Buy with BNB"}
            </button>

            <button
              onClick={() => approveAndBuyStable("usdt")}
              disabled={!saleActive || busy !== ""}
              className="rounded-xl bg-[#5EC46B] px-4 py-3 font-semibold text-black transition hover:scale-[1.01] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy === "usdt" ? "Processing..." : "Buy with USDT"}
            </button>

            <button
              onClick={() => approveAndBuyStable("usdc")}
              disabled={!saleActive || busy !== ""}
              className="rounded-xl bg-[#5A84E8] px-4 py-3 font-semibold text-white transition hover:scale-[1.01] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy === "usdc" ? "Processing..." : "Buy with USDC"}
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/60">
              Presale:{" "}
              <span className="font-semibold text-white">
                {saleActive ? "Active" : "Closed"}
              </span>
            </div>

            {walletAddress ? (
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/60">
                Connected:{" "}
                <span className="font-semibold text-white">
                  {shortenAddress(walletAddress)}
                </span>
              </div>
            ) : (
              <div className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-yellow-200">
                Connect wallet first from the top bar.
              </div>
            )}
          </div>

          {status ? (
            <div className="mt-5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
              {status}
            </div>
          ) : null}
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/25 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.32)] backdrop-blur-md">
          <p className="text-xs uppercase tracking-[0.24em] text-white/40">
            Presale Details
          </p>

          <h3 className="mt-2 text-xl font-bold text-white">
            Transparent stage-based pricing
          </h3>

          <div className="mt-5 space-y-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm text-white/50">Current Price</div>
              <div className="mt-1 text-lg font-semibold text-white">
                ${stagePrice.toFixed(2)}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm text-white/50">Planned Listing Price</div>
              <div className="mt-1 text-lg font-semibold text-white">$0.15</div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm text-white/50">Accepted Payments</div>
              <div className="mt-1 text-lg font-semibold text-white">
                BNB / USDT / USDC
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm text-white/50">Claim</div>
              <div className="mt-1 text-sm font-semibold text-white">
                Available after presale completion and claim activation.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-black/25 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.3)] backdrop-blur-md">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-white/40">
              KORAX Presale Stages
            </p>

            <h2 className="mt-2 text-xl font-bold text-white">
              Five-stage token allocation
            </h2>
          </div>

          <div className="text-sm text-white/55">
            Planned listing price:{" "}
            <span className="font-semibold text-white">$0.15</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {STAGE_PRICES.map((price, index) => {
            const active = stage === index + 1;

            return (
              <div
                key={index}
                className={`rounded-2xl border p-5 backdrop-blur-md transition ${
                  active
                    ? "border-[#7CFF6A]/40 bg-[#7CFF6A]/10 shadow-[0_0_38px_rgba(124,255,106,0.12)]"
                    : "border-white/10 bg-black/20"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm text-white/50">Stage {index + 1}</div>

                  {active ? (
                    <span className="rounded-full border border-[#7CFF6A]/20 bg-[#7CFF6A]/10 px-2 py-1 text-[11px] font-semibold text-[#c4ffbc]">
                      Current
                    </span>
                  ) : null}
                </div>

                <div className="mt-3 text-2xl font-extrabold text-white">
                  ${price.toFixed(2)}
                </div>

                <div className="mt-2 text-sm text-white/60">
                  {STAGE_CAPS[index].toLocaleString("en-US")} KORAX
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}