"use client";

import { useEffect, useState } from "react";
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
  return num.toLocaleString("en-US", { maximumFractionDigits });
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
    const i = setInterval(() => {
      setNowTs(Math.floor(Date.now() / 1000));
    }, 1000);

    return () => clearInterval(i);
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

  const remaining =
    purchased > claimed ? purchased - claimed : 0n;

  if (!mounted) return null;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black/30 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.38)] backdrop-blur-md">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,255,106,0.12),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.06),transparent_28%)]" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">
              KORAX Claim
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
              Claim your purchased KORAX tokens
            </h1>

            <p className="mt-4 max-w-3xl leading-relaxed text-white/70">
              Purchased tokens become claimable after the presale is completed
              and the claim system is enabled. Claim data is read directly from
              the verified presale contract on BNB Smart Chain.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/60">
                Presale:{" "}
                <span className="font-semibold text-white">
                  {saleActive ? "Active" : "Closed"}
                </span>
              </div>

              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/60">
                Claim:{" "}
                <span
                  className={
                    claimEnabled
                      ? "font-semibold text-[#c4ffbc]"
                      : "font-semibold text-white"
                  }
                >
                  {claimEnabled ? "Enabled" : "Locked"}
                </span>
              </div>

              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/60">
                Network:{" "}
                <span className="font-semibold text-white">BNB Chain</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/35 p-5 text-sm text-white/75 lg:w-[420px]">
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
        <div className="rounded-2xl border border-white/10 bg-black/25 p-6 shadow-[0_18px_55px_rgba(0,0,0,0.28)] backdrop-blur-md">
          <div className="text-sm text-white/50">Claim Status</div>
          <div
            className={`mt-2 text-2xl font-bold ${
              claimEnabled ? "text-[#c4ffbc]" : "text-white"
            }`}
          >
            {claimEnabled ? "Enabled" : "Locked"}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-white/65">
            {claimEnabled
              ? "Claim is active for eligible purchased balances."
              : "Claim opens only after the presale is closed and enabled."}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/25 p-6 shadow-[0_18px_55px_rgba(0,0,0,0.28)] backdrop-blur-md">
          <div className="text-sm text-white/50">Purchased</div>
          <div className="mt-2 text-2xl font-bold text-white">
            {formatTokenAmount(purchased)} {tokenSymbol}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-white/65">
            Total tokens recorded for your wallet during the presale.
          </p>
        </div>

        <div className="rounded-2xl border border-[#7CFF6A]/20 bg-[#7CFF6A]/10 p-6 shadow-[0_18px_55px_rgba(0,0,0,0.28)] backdrop-blur-md">
          <div className="text-sm text-white/60">Claimable Now</div>
          <div className="mt-2 text-2xl font-bold text-[#c4ffbc]">
            {formatTokenAmount(claimableNow)} {tokenSymbol}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Amount currently available to claim from the contract.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/25 p-6 shadow-[0_18px_55px_rgba(0,0,0,0.28)] backdrop-blur-md">
          <div className="text-sm text-white/50">Already Claimed</div>
          <div className="mt-2 text-2xl font-bold text-white">
            {formatTokenAmount(claimed)} {tokenSymbol}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-white/65">
            Tokens already claimed from your allocation.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-md">
          <div className="text-sm text-white/50">Wallet</div>
          <div className="mt-2 text-xl font-semibold text-white">
            {walletAddress ? shortenAddress(walletAddress) : "Not connected"}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-white/65">
            Current wallet used for claim data.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-md">
          <div className="text-sm text-white/50">Claim Start</div>
          <div className="mt-2 text-xl font-semibold text-white">
            {claimStart}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-white/65">
            Start time returned by the presale contract.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-md">
          <div className="text-sm text-white/50">Unlocked Percent</div>
          <div className="mt-2 text-xl font-semibold text-white">
            {vestedPercent}%
          </div>
          <p className="mt-3 text-sm leading-relaxed text-white/65">
            Current unlocked percentage based on the vesting schedule.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-md">
          <div className="text-sm text-white/50">Next Claim In</div>
          <div className="mt-2 text-xl font-semibold text-white">
            {nextClaimCountdown}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-white/65">
            Countdown until the next vesting release.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-md">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Vesting Progress</h2>
            <p className="mt-2 text-sm text-white/60">
              Claim unlocks in scheduled portions after claim activation.
            </p>
          </div>

          <div className="text-right text-sm text-white/60">
            Remaining:{" "}
            <span className="font-semibold text-white">
              {formatTokenAmount(remaining)} {tokenSymbol}
            </span>
          </div>
        </div>

        <div className="overflow-hidden rounded-full border border-white/10 bg-black/40">
          <div
            className="h-3 rounded-full bg-[#7CFF6A] transition-all duration-500"
            style={{
              width: `${Math.min(Math.max(vestedPercent, 0), 100)}%`,
            }}
          />
        </div>

        <div className="mt-3 flex justify-between text-xs text-white/45">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-black/20 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-md">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Claim Tokens</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/60">
              The claim button becomes available when claim is enabled and your
              wallet has tokens claimable from the presale contract.
            </p>

            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/60">
                Presale status:{" "}
                <span className="font-semibold text-white">
                  {saleActive ? "Still active" : "Closed"}
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
            className={`rounded-xl px-7 py-3 text-sm font-semibold transition ${
              canClaim && !busy
                ? "bg-[#7CFF6A] text-black shadow-[0_0_35px_rgba(124,255,106,0.18)] hover:scale-[1.02] hover:opacity-90"
                : "cursor-not-allowed border border-white/10 bg-white/5 text-white/40"
            }`}
          >
            {busy ? "Processing..." : "Claim"}
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