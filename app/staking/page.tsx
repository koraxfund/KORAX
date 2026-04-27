"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount, useSwitchChain, useWalletClient } from "wagmi";

const RPC_URL = "https://bsc-dataseed.binance.org/";

const STAKING_ADDRESS = process.env.NEXT_PUBLIC_STAKING_ADDRESS!;
const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS!;
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
  },
  {
    id: 14,
    title: "14 Days",
    ret: "3.5%",
    dur: "14 Days",
    desc: "Short-term hold",
  },
  {
    id: 1,
    title: "1 Month",
    ret: "7.5%",
    dur: "30 Days",
    desc: "Starter plan",
  },
  {
    id: 3,
    title: "3 Months",
    ret: "22.5%",
    dur: "90 Days",
    desc: "Balanced reward",
  },
  {
    id: 6,
    title: "6 Months",
    ret: "45%",
    dur: "180 Days",
    desc: "Strong return",
  },
  {
    id: 9,
    title: "9 Months",
    ret: "67.5%",
    dur: "270 Days",
    desc: "Premium plan",
  },
  {
    id: 12,
    title: "12 Months",
    ret: "90%",
    dur: "365 Days",
    desc: "Max reward",
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

function shortAddress(address: string) {
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
    const i = setInterval(() => load(), 8000);
    return () => clearInterval(i);
  }, [wallet]);

  useEffect(() => {
    const i = setInterval(() => {
      setNowTick((x) => x + 1);
    }, 1000);

    return () => clearInterval(i);
  }, []);

  async function stake() {
    try {
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
        err?.shortMessage ||
        err?.reason ||
        err?.message ||
        "Stake failed.";
      setStatus(msg);
      alert(msg);
    }
  }

  async function withdraw(i: number) {
    try {
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
        err?.shortMessage ||
        err?.reason ||
        err?.message ||
        "Withdraw failed.";
      setStatus(msg);
      alert(msg);
    }
  }

  function card(p: any) {
    const selected = plan === p.id;

    return (
      <div key={p.id} onClick={() => setPlan(p.id)} className="cursor-pointer">
        <div
          className={`group relative flex h-72 w-64 flex-col items-center justify-center overflow-hidden p-4 text-center transition duration-300 hover:scale-105 ${
            selected
              ? "bg-[#7CFF6A] text-black shadow-[0_0_45px_rgba(124,255,106,0.22)]"
              : "bg-gray-800 text-white shadow-[0_18px_45px_rgba(0,0,0,0.35)]"
          }`}
          style={{
            clipPath: "polygon(25% 6%,75% 6%,100% 50%,75% 94%,25% 94%,0% 50%)",
          }}
        >
          <div
            className={`absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 ${
              selected
                ? "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.35),transparent_45%)]"
                : "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.09),transparent_45%)]"
            }`}
          />

          <div className="relative z-10 text-[11px] uppercase tracking-[0.24em] opacity-70">
            Annual
          </div>

          <div className="relative z-10 mt-2 text-lg font-bold">{p.title}</div>

          <div className="relative z-10 mt-3 text-4xl font-extrabold">
            {p.ret}
          </div>

          <div className="relative z-10 mt-2 text-sm opacity-80">{p.dur}</div>

          <div className="relative z-10 mt-3 px-3 text-xs opacity-80">
            {p.desc}
          </div>

          <div className="relative z-10 mt-4 text-xs font-semibold">
            {selected ? "Selected Plan" : "Select Plan"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 p-10 text-white">
      <section className="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-black/25 p-8 text-center backdrop-blur-md">
        <p className="text-xs uppercase tracking-[0.28em] text-white/45">
          KORAX Staking
        </p>

        <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
          Stake KORAX and unlock fixed annual rewards
        </h1>

        <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-white/65">
          Choose a fixed-duration staking plan, lock your KORAX tokens, and
          withdraw your principal plus reward after the selected lock period
          ends. Longer plans provide stronger annual reward potential.
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-3 text-xs">
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
      </section>

      <div className="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-black/20 p-5 text-center backdrop-blur-md">
        <div className="text-xs uppercase tracking-[0.22em] text-white/40">
          Wallet Balance
        </div>
        <div className="mt-2 text-2xl font-bold text-white">
          {format(balance)} {symbol}
        </div>
        <div className="mt-1 text-xs text-white/35">
          Raw balance: {balance.toString()}
        </div>
      </div>

      <section className="space-y-10">
        <div className="flex flex-wrap justify-center gap-10">
          {plans.slice(0, 2).map(card)}
        </div>

        <div className="flex flex-wrap justify-center gap-10">
          {plans.slice(2, 5).map(card)}
        </div>

        <div className="flex flex-wrap justify-center gap-10">
          {plans.slice(5, 7).map(card)}
        </div>
      </section>

      <div className="flex justify-center">
        <div className="w-[420px] space-y-4 rounded-2xl border border-white/10 bg-gray-900/90 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-md">
          <div className="text-center">
            <div className="text-xs uppercase tracking-[0.22em] text-white/40">
              Selected Plan
            </div>
            <div className="mt-1 font-semibold text-white">
              {plans.find((x) => x.id === plan)?.title || "Selected Plan"} •{" "}
              {plans.find((x) => x.id === plan)?.ret || ""} Annual
            </div>
          </div>

          <div className="text-center font-semibold">
            Balance: {format(balance)} {symbol}
          </div>

          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full rounded-xl border border-white/10 bg-black p-3 text-center text-white outline-none transition placeholder:text-white/35 focus:border-[#7CFF6A]/40"
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
            className="w-full rounded-xl bg-[#7CFF6A] py-3 font-semibold text-black transition hover:scale-[1.01] hover:opacity-90 disabled:opacity-60"
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

      <div className="mx-auto max-w-2xl space-y-4">
        <h2 className="text-center text-2xl font-bold">My Positions</h2>

        {positions.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-gray-800/80 p-5 text-center text-white/70">
            No staking positions yet.
          </div>
        ) : (
          positions.map((p) => {
            const unlocked = Date.now() / 1000 > p.unlock;

            return (
              <div
                key={p.index}
                className="rounded-2xl border border-white/10 bg-gray-800/90 p-5 shadow-[0_14px_40px_rgba(0,0,0,0.28)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-semibold">
                      {format(p.amount)} {symbol}
                    </div>

                    <div className="mt-1 text-sm text-white/70">
                      Reward: +{format(p.reward)} {symbol}
                    </div>

                    <div className="mt-1 text-sm text-white/60">
                      Unlock:{" "}
                      {new Date(p.unlock * 1000).toLocaleString("en-US")}
                    </div>

                    <div className="mt-1 text-sm text-yellow-300">
                      {p.claimed ? "Completed" : formatCountdown(p.unlock)}
                    </div>
                  </div>

                  <div className="text-right">
                    {p.claimed ? (
                      <div className="text-sm font-semibold text-white/60">
                        Withdrawn
                      </div>
                    ) : unlocked ? (
                      <button
                        onClick={() => withdraw(p.index)}
                        className="rounded-xl bg-red-500 px-4 py-2 font-semibold text-white transition hover:opacity-90"
                      >
                        Withdraw
                      </button>
                    ) : (
                      <div className="text-sm font-semibold text-yellow-300">
                        Locked
                      </div>
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