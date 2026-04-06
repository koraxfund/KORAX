"use client";

import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";

type EvmProvider = {
  isMetaMask?: boolean;
  isRabby?: boolean;
  isTrust?: boolean;
  isTrustWallet?: boolean;
  isOKXWallet?: boolean;
  isBinance?: boolean;
  providers?: EvmProvider[];
  request: (args: { method: string; params?: unknown[] | object }) => Promise<any>;
  on?: (event: string, callback: (...args: any[]) => void) => void;
  removeListener?: (event: string, callback: (...args: any[]) => void) => void;
};

const RPC_URL = "https://bsc-dataseed.binance.org/";

const PRESALE_ADDRESS = process.env.NEXT_PUBLIC_PRESALE_ADDRESS!;
const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS!;
const PRESALE_BSCSCAN_URL =
  process.env.NEXT_PUBLIC_PRESALE_BSCSCAN_URL ||
  `https://bscscan.com/address/${PRESALE_ADDRESS}#code`;

const BSC_MAINNET = {
  chainId: "0x38",
  chainName: "BNB Smart Chain",
  nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
  },
  rpcUrls: [RPC_URL],
  blockExplorerUrls: ["https://bscscan.com/"],
};

const CLAIM_INTERVAL_SECONDS = 30 * 24 * 60 * 60;

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

const tokenAbi = [
  "function symbol() view returns (string)",
];

function getInjectedProvider(): EvmProvider | null {
  if (typeof window === "undefined") return null;

  const eth = (window as any).ethereum as EvmProvider | undefined;
  if (!eth) return null;

  if (Array.isArray(eth.providers) && eth.providers.length > 0) {
    return (
      eth.providers.find((p) => p.isMetaMask) ||
      eth.providers.find((p) => p.isRabby) ||
      eth.providers.find((p) => p.isOKXWallet) ||
      eth.providers.find((p) => p.isTrust || p.isTrustWallet) ||
      eth.providers.find((p) => p.isBinance) ||
      eth.providers[0]
    );
  }

  return eth;
}

async function ensureBscNetwork(provider: EvmProvider) {
  const currentChainId = await provider.request({ method: "eth_chainId" });

  if (currentChainId === BSC_MAINNET.chainId) return;

  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: BSC_MAINNET.chainId }],
    });
  } catch (switchError: any) {
    if (switchError?.code === 4902) {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [BSC_MAINNET],
      });
      return;
    }
    throw switchError;
  }
}

function formatTokenAmount(value: bigint, decimals = 18, maximumFractionDigits = 4) {
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

  const provider = useMemo(() => getInjectedProvider(), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const i = setInterval(() => {
      setNowTs(Math.floor(Date.now() / 1000));
    }, 1000);

    return () => clearInterval(i);
  }, []);

  async function refreshWallet() {
    try {
      const injected = getInjectedProvider();
      if (!injected) return;

      const accounts = await injected.request({ method: "eth_accounts" });
      if (accounts && Array.isArray(accounts) && accounts.length > 0) {
        setWalletAddress(ethers.getAddress(accounts[0] as string));
      } else {
        setWalletAddress("");
      }
    } catch {
      setWalletAddress("");
    }
  }

  async function connectIfNeeded() {
    const injected = getInjectedProvider();
    if (!injected) {
      alert("No wallet found.");
      return null;
    }

    await ensureBscNetwork(injected);

    const accounts = await injected.request({ method: "eth_requestAccounts" });
    if (!accounts || !Array.isArray(accounts) || accounts.length === 0) {
      throw new Error("No account returned");
    }

    const address = ethers.getAddress(accounts[0] as string);
    setWalletAddress(address);

    return new ethers.BrowserProvider(injected as any);
  }

  async function loadClaimData(currentWallet?: string) {
    try {
      const rpcProvider = new ethers.JsonRpcProvider(RPC_URL);

      const presale = new ethers.Contract(PRESALE_ADDRESS, presaleAbi, rpcProvider);
      const token = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, rpcProvider);

      const [saleActiveRaw, claimEnabledRaw, claimStartRaw, symbolRaw] = await Promise.all([
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
        const [purchasedRaw, claimedRaw, claimableRaw, vestedRaw] = await Promise.all([
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
    refreshWallet();
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    loadClaimData();

    const interval = setInterval(() => {
      loadClaimData();
    }, 10000);

    return () => clearInterval(interval);
  }, [mounted, walletAddress]);

  useEffect(() => {
    if (!provider?.on || !mounted) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (!accounts || accounts.length === 0) {
        setWalletAddress("");
        return;
      }
      setWalletAddress(ethers.getAddress(accounts[0]));
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    provider.on("accountsChanged", handleAccountsChanged);
    provider.on("chainChanged", handleChainChanged);

    return () => {
      provider.removeListener?.("accountsChanged", handleAccountsChanged);
      provider.removeListener?.("chainChanged", handleChainChanged);
    };
  }, [provider, mounted]);

  async function handleClaim() {
    try {
      if (busy) return;

      setBusy(true);
      setStatus("");

      let browserProvider: ethers.BrowserProvider | null = null;
      let currentWallet = walletAddress;

      if (!currentWallet) {
        browserProvider = await connectIfNeeded();
        if (!browserProvider) return;
        const signer = await browserProvider.getSigner();
        currentWallet = await signer.getAddress();
      } else {
        const injected = getInjectedProvider();
        if (!injected) {
          alert("No wallet found.");
          return;
        }
        await ensureBscNetwork(injected);
        browserProvider = new ethers.BrowserProvider(injected as any);
      }

      const signer = await browserProvider.getSigner();
      const presale = new ethers.Contract(PRESALE_ADDRESS, presaleAbi, signer);

      const liveClaimable = await presale.claimableNow(currentWallet);
      if (BigInt(liveClaimable.toString()) <= 0n) {
        throw new Error("Nothing claimable right now.");
      }

      setStatus("Claim transaction sent. Waiting for confirmation...");
      const tx = await presale.claim();
      await tx.wait();

      setStatus("Claim completed successfully.");
      await loadClaimData(currentWallet);
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
    nextClaimTs > nowTs ? formatCountdown(nextClaimTs - nowTs) : vestedPercent >= 100 ? "Completed" : "Available now";

  if (!mounted) return null;

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-white/10 bg-black/30 p-8 backdrop-blur-md">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Claim</h1>
            <p className="mt-3 max-w-3xl text-white/70">
              Claim your purchased tokens after the presale ends and claiming becomes enabled.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/75 lg:max-w-xl">
            <div className="text-white/50">Verified Presale Contract</div>
            <div className="mt-2 break-all font-mono text-xs text-white">
              {PRESALE_ADDRESS}
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              <a
                href={PRESALE_BSCSCAN_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white hover:bg-white/10"
              >
                Open on BscScan
              </a>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(PRESALE_ADDRESS)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white hover:bg-white/10"
              >
                Copy Address
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-md">
          <div className="text-sm text-white/50">Claim Status</div>
          <div className="mt-2 text-xl font-semibold text-white">
            {claimEnabled ? "Enabled" : "Locked"}
          </div>
          <p className="mt-3 text-sm text-white/65">
            {claimEnabled
              ? "Claim is live now."
              : "Claim opens only after the presale is closed and enabled."}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-md">
          <div className="text-sm text-white/50">Your Tokens</div>
          <div className="mt-2 text-xl font-semibold text-white">
            {formatTokenAmount(purchased)} {tokenSymbol}
          </div>
          <p className="mt-3 text-sm text-white/65">
            Total tokens purchased in presale.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-md">
          <div className="text-sm text-white/50">Claimable Now</div>
          <div className="mt-2 text-xl font-semibold text-white">
            {formatTokenAmount(claimableNow)} {tokenSymbol}
          </div>
          <p className="mt-3 text-sm text-white/65">
            Available to claim right now.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-md">
          <div className="text-sm text-white/50">Claimed</div>
          <div className="mt-2 text-xl font-semibold text-white">
            {formatTokenAmount(claimed)} {tokenSymbol}
          </div>
          <p className="mt-3 text-sm text-white/65">
            Already claimed from your purchased allocation.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-md">
          <div className="text-sm text-white/50">Wallet</div>
          <div className="mt-2 text-xl font-semibold text-white">
            {walletAddress ? shortenAddress(walletAddress) : "Connected from top bar or click Claim"}
          </div>
          <p className="mt-3 text-sm text-white/65">
            Current connected wallet for claim.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-md">
          <div className="text-sm text-white/50">Claim Start</div>
          <div className="mt-2 text-xl font-semibold text-white">{claimStart}</div>
          <p className="mt-3 text-sm text-white/65">
            Claim start time from the contract.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-md">
          <div className="text-sm text-white/50">Unlocked Percent</div>
          <div className="mt-2 text-xl font-semibold text-white">{vestedPercent}%</div>
          <p className="mt-3 text-sm text-white/65">
            Current unlocked percentage according to vesting.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-md">
          <div className="text-sm text-white/50">Next Claim In</div>
          <div className="mt-2 text-xl font-semibold text-white">{nextClaimCountdown}</div>
          <p className="mt-3 text-sm text-white/65">
            Countdown until the next vesting release.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Claim Tokens</h2>
            <p className="mt-2 text-sm text-white/60">
              The button becomes effective when claim is enabled and you have claimable tokens.
            </p>
            <div className="mt-3 text-sm text-white/70">
              Presale status:{" "}
              <span className="font-semibold text-white">
                {saleActive ? "Still active" : "Closed"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClaim}
            disabled={busy || !canClaim}
            className={`rounded-xl px-6 py-3 text-sm font-semibold transition ${
              canClaim && !busy
                ? "bg-[#7CFF6A] text-black hover:scale-[1.02]"
                : "cursor-not-allowed border border-white/10 bg-white/5 text-white/40"
            }`}
          >
            {busy ? "Processing..." : "Claim"}
          </button>
        </div>

        {status ? (
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
            {status}
          </div>
        ) : null}
      </section>
    </div>
  );
}