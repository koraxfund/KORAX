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

const STAKING_ADDRESS = process.env.NEXT_PUBLIC_STAKING_ADDRESS!;
const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS!;

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
  { id: 0, title: "1 Day", ret: "0.15%", dur: "1 Day", desc: "Quick test plan" },
  { id: 14, title: "14 Days", ret: "3.5%", dur: "14 Days", desc: "Short-term hold" },
  { id: 1, title: "1 Month", ret: "7.5%", dur: "30 Days", desc: "Starter plan" },
  { id: 3, title: "3 Months", ret: "22.5%", dur: "90 Days", desc: "Balanced reward" },
  { id: 6, title: "6 Months", ret: "45%", dur: "180 Days", desc: "Strong return" },
  { id: 9, title: "9 Months", ret: "67.5%", dur: "270 Days", desc: "Premium plan" },
  { id: 12, title: "12 Months", ret: "90%", dur: "365 Days", desc: "Max reward" },
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

function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
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

  const provider = useMemo(() => getInjectedProvider(), []);

  async function refreshWallet() {
    try {
      const injected = getInjectedProvider();
      if (!injected) {
        setWallet("");
        return;
      }

      const accounts = await injected.request({ method: "eth_accounts" });
      if (accounts && Array.isArray(accounts) && accounts.length > 0) {
        setWallet(ethers.getAddress(accounts[0] as string));
      } else {
        setWallet("");
      }
    } catch {
      setWallet("");
    }
  }

  async function connect() {
    const injected = getInjectedProvider();
    if (!injected) {
      alert("No wallet found.");
      return "";
    }

    await ensureBscNetwork(injected);

    const acc = await injected.request({ method: "eth_requestAccounts" });
    const address = acc?.[0] ? ethers.getAddress(acc[0] as string) : "";
    setWallet(address);
    return address;
  }

  async function load(targetWallet?: string) {
    try {
      const currentWallet = targetWallet || wallet;

      const rpcProvider = new ethers.JsonRpcProvider(RPC_URL);
      const staking = new ethers.Contract(STAKING_ADDRESS, stakingAbi, rpcProvider);
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
    refreshWallet();
  }, []);

  useEffect(() => {
    load();
    const i = setInterval(() => load(), 8000);
    return () => clearInterval(i);
  }, [wallet]);

  useEffect(() => {
    const i = setInterval(() => {
      setNowTick((x) => x + 1);
    }, 1000);

    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    if (!provider?.on) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (!accounts || accounts.length === 0) {
        setWallet("");
        return;
      }
      setWallet(ethers.getAddress(accounts[0]));
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
  }, [provider]);

  async function stake() {
    const injected = getInjectedProvider();
    if (!injected) {
      alert("No wallet found.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Enter a valid amount.");
      return;
    }

    await ensureBscNetwork(injected);

    const provider = new ethers.BrowserProvider(injected as any);
    const signer = await provider.getSigner();

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
  }

  async function withdraw(i: number) {
    const injected = getInjectedProvider();
    if (!injected) {
      alert("No wallet found.");
      return;
    }

    await ensureBscNetwork(injected);

    const provider = new ethers.BrowserProvider(injected as any);
    const signer = await provider.getSigner();

    const staking = new ethers.Contract(STAKING_ADDRESS, stakingAbi, signer);

    setStatus(`Withdrawing position #${i}...`);
    const tx = await staking.withdraw(i);
    await tx.wait();

    setStatus("Withdraw completed successfully.");
    await load(await signer.getAddress());
  }

  function card(p: any) {
    const selected = plan === p.id;

    return (
      <div key={p.id} onClick={() => setPlan(p.id)} className="cursor-pointer">
        <div
          className={`w-[150px] h-[185px] sm:w-[220px] sm:h-[250px] md:w-64 md:h-72 flex flex-col justify-center items-center text-center p-3 sm:p-4 transition duration-300 hover:scale-105 ${
            selected ? "bg-green-500 text-black" : "bg-gray-800 text-white"
          }`}
          style={{
            clipPath: "polygon(25% 6%,75% 6%,100% 50%,75% 94%,25% 94%,0% 50%)",
          }}
        >
          <div className="text-sm sm:text-base md:text-lg font-bold">{p.title}</div>
          <div className="text-3xl sm:text-4xl md:text-4xl font-extrabold mt-2 sm:mt-3">{p.ret}</div>
          <div className="text-xs sm:text-sm mt-2 opacity-80">{p.dur}</div>
          <div className="text-[10px] sm:text-xs mt-2 sm:mt-3 opacity-80 px-2 sm:px-3">{p.desc}</div>
          <div className="mt-3 sm:mt-4 text-[10px] sm:text-xs font-semibold">
            {selected ? "Selected" : "Select Plan"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 text-white space-y-8 sm:space-y-10">
      <h1 className="text-3xl font-bold text-center">Staking</h1>

      <div className="text-center text-xs text-white/40 break-all">
        Token: {shortAddress(TOKEN_ADDRESS)} | Staking: {shortAddress(STAKING_ADDRESS)}
      </div>

      <div className="text-center text-xs text-yellow-300 break-all">
        Wallet: {wallet ? shortAddress(wallet) : "Not connected"} | Raw balance: {balance.toString()}
      </div>

      <div className="space-y-6 sm:space-y-10">
        <div className="flex justify-center gap-3 sm:gap-6 md:gap-10 flex-wrap">
          {plans.slice(0, 2).map(card)}
        </div>

        <div className="flex justify-center gap-3 sm:gap-6 md:gap-10 flex-wrap">
          {plans.slice(2, 5).map(card)}
        </div>

        <div className="flex justify-center gap-3 sm:gap-6 md:gap-10 flex-wrap">
          {plans.slice(5, 7).map(card)}
        </div>
      </div>

      <div className="flex justify-center">
        <div className="bg-gray-900/90 p-4 sm:p-6 rounded-xl w-full max-w-[420px] space-y-4 border border-white/10">
          <div className="text-center font-semibold">
            Balance: {format(balance)} {symbol}
          </div>

          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full p-3 bg-black text-center rounded border border-white/10 outline-none"
          />

          <button
            onClick={async () => {
              try {
                setLoading(true);
                let currentWallet = wallet;

                if (!currentWallet) {
                  currentWallet = await connect();
                  if (!currentWallet) return;
                }

                await stake();
              } catch (err) {
                console.error(err);
                setStatus("Stake failed.");
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
            className="bg-green-500 w-full py-3 rounded text-black font-semibold hover:scale-[1.01] transition disabled:opacity-60"
          >
            {loading ? "Processing..." : "Stake"}
          </button>

          {status ? (
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
              {status}
            </div>
          ) : null}
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-2xl font-bold text-center">My Positions</h2>

        {positions.length === 0 ? (
          <div className="bg-gray-800/80 p-4 rounded-xl text-center text-white/70">
            No staking positions yet.
          </div>
        ) : (
          positions.map((p) => {
            const unlocked = Date.now() / 1000 > p.unlock;

            return (
              <div key={p.index} className="bg-gray-800/90 p-4 rounded-xl border border-white/10">
                <div className="flex justify-between items-center gap-4">
                  <div>
                    <div className="font-semibold">
                      {format(p.amount)} {symbol}
                    </div>
                    <div className="text-sm text-white/70 mt-1">
                      Reward: +{format(p.reward)} {symbol}
                    </div>
                    <div className="text-sm text-white/60 mt-1">
                      Unlock: {new Date(p.unlock * 1000).toLocaleString("en-US")}
                    </div>
                    <div className="text-sm text-yellow-300 mt-1">
                      {p.claimed ? "Completed" : formatCountdown(p.unlock)}
                    </div>
                  </div>

                  <div className="text-right">
                    {p.claimed ? (
                      <div className="text-sm text-white/60 font-semibold">Withdrawn</div>
                    ) : unlocked ? (
                      <button
                        onClick={() => withdraw(p.index)}
                        className="bg-red-500 px-4 py-2 rounded font-semibold"
                      >
                        Withdraw
                      </button>
                    ) : (
                      <div className="text-sm text-yellow-300 font-semibold">Locked</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}