"use client";

import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";

const RPC_URL = "https://bsc-dataseed.binance.org/";
const STAKING_ADDRESS = process.env.NEXT_PUBLIC_STAKING_ADDRESS!;

const stakingAbi = [
  "function positionsCount(address) view returns (uint256)",
  "function getPosition(address,uint256) view returns (tuple(uint256 amount,uint256 unlockTime,uint256 rewardBps,bool claimed))",
];

const TIERS = [
  {
    name: "Bronze",
    min: 500,
    accent: "bg-[#cd7f32] text-black",
    activeBg: "bg-[#cd7f32]",
    inactiveBg: "bg-gray-800",
    features: [
      "Basic launch submission",
      "Standard review queue",
      "Core project profile",
    ],
  },
  {
    name: "Silver",
    min: 1000,
    accent: "bg-[#c0c0c0] text-black",
    activeBg: "bg-[#c0c0c0]",
    inactiveBg: "bg-gray-800",
    features: [
      "Improved project visibility",
      "Faster review access",
      "Expanded launch options",
    ],
  },
  {
    name: "Pearl",
    min: 3000,
    accent: "bg-[#e7e2ff] text-black",
    activeBg: "bg-[#e7e2ff]",
    inactiveBg: "bg-gray-800",
    features: [
      "Enhanced launch profile",
      "Priority application flow",
      "Better creator support access",
    ],
  },
  {
    name: "Gold",
    min: 10000,
    accent: "bg-[#ffd700] text-black",
    activeBg: "bg-[#ffd700]",
    inactiveBg: "bg-gray-800",
    features: [
      "Premium launch access",
      "Priority review level",
      "Advanced project setup tools",
    ],
  },
  {
    name: "Diamond",
    min: 20000,
    accent: "bg-[#7dd3fc] text-black",
    activeBg: "bg-[#7dd3fc]",
    inactiveBg: "bg-gray-800",
    features: [
      "High-priority project launch",
      "Featured launch tier",
      "Deeper launch customization",
    ],
  },
  {
    name: "Ruby",
    min: 50000,
    accent: "bg-[#e11d48] text-white",
    activeBg: "bg-[#e11d48]",
    inactiveBg: "bg-gray-800",
    features: [
      "Elite creator access",
      "Top review priority",
      "Extended launch support",
    ],
  },
  {
    name: "Emerald",
    min: 100000,
    accent: "bg-[#10b981] text-black",
    activeBg: "bg-[#10b981]",
    inactiveBg: "bg-gray-800",
    features: [
      "Maximum launch priority",
      "Highest creator tier",
      "Full premium launch pathway",
    ],
  },
];

function formatAmount(v: bigint) {
  return Number(ethers.formatUnits(v, 18)).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
}

function getTierFromAmount(amount: number) {
  let current = TIERS[0];
  for (const tier of TIERS) {
    if (amount >= tier.min) current = tier;
  }
  return current;
}

function getNextTier(amount: number) {
  for (const tier of TIERS) {
    if (amount < tier.min) return tier;
  }
  return null;
}

export default function LaunchPage() {
  const [wallet, setWallet] = useState("");
  const [totalStaked, setTotalStaked] = useState<bigint>(0n);
  const [status, setStatus] = useState("");

  const [form, setForm] = useState({
    projectName: "",
    tokenSymbol: "",
    network: "BNB Chain",
    totalSupply: "",
    presaleType: "Presale",
    website: "",
    twitter: "",
    telegram: "",
    description: "",
    utility: "",
    launchGoal: "",
  });

  const { address, isConnected } = useAccount();

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

  const stakedNumber = useMemo(
    () => Number(ethers.formatUnits(totalStaked, 18)),
    [totalStaked]
  );

  const currentTier = useMemo(() => getTierFromAmount(stakedNumber), [stakedNumber]);
  const nextTier = useMemo(() => getNextTier(stakedNumber), [stakedNumber]);

  async function loadStaking(user?: string) {
    try {
      const currentWallet = user || wallet;
      if (!currentWallet) {
        setTotalStaked(0n);
        return;
      }

      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const staking = new ethers.Contract(STAKING_ADDRESS, stakingAbi, provider);

      const count = Number(await staking.positionsCount(currentWallet));
      let sum = 0n;

      for (let i = 0; i < count; i++) {
        const p = await staking.getPosition(currentWallet, i);
        if (!p.claimed) {
          sum += BigInt(p.amount.toString());
        }
      }

      setTotalStaked(sum);
    } catch (err) {
      console.error("Failed to load staking tier:", err);
      setTotalStaked(0n);
    }
  }

  useEffect(() => {
    loadStaking();
  }, [wallet]);

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isConnected || !wallet) {
      setStatus("Connect wallet first.");
      return;
    }

    if (!form.projectName || !form.tokenSymbol || !form.totalSupply || !form.description) {
      setStatus("Please fill the required fields first.");
      return;
    }

    setStatus(
      `Project request prepared under ${currentTier.name} tier. You can later connect this form to email, database, or backend review flow.`
    );
  }

  function tierCard(tier: (typeof TIERS)[number]) {
    const active = currentTier.name === tier.name;

    return (
      <div key={tier.name} className="cursor-default">
        <div
          className={`w-64 h-72 flex flex-col justify-center items-center text-center p-4 transition duration-300 hover:scale-105 ${
            active
              ? `${tier.activeBg} ${
                  tier.accent.includes("text-white") ? "text-white" : "text-black"
                }`
              : `${tier.inactiveBg} text-white`
          }`}
          style={{
            clipPath: "polygon(25% 6%,75% 6%,100% 50%,75% 94%,25% 94%,0% 50%)",
          }}
        >
          <div className="text-lg font-bold">{tier.name}</div>
          <div className="text-3xl font-extrabold mt-3">
            {tier.min.toLocaleString("en-US")}
          </div>
          <div className="text-sm mt-2 opacity-80">KRX Required</div>

          <div className="text-[11px] mt-3 opacity-85 px-5 space-y-1 leading-relaxed">
            {tier.features.map((feature) => (
              <div key={feature}>• {feature}</div>
            ))}
          </div>

          <div className="mt-4 text-xs font-semibold">
            {active ? "Active Tier" : "Locked Tier"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-white/10 bg-black/30 p-8 backdrop-blur-md">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Launch Your Project</h1>
            <p className="mt-3 max-w-3xl text-white/70">
              Creator access is tied to your active KORAX staking tier. Higher staking unlocks
              stronger launch privileges, faster review, and more advanced project support.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white/80 lg:w-[360px]">
            <div className="text-sm text-white/50">Your Active Tier</div>
            <div className="mt-2 text-2xl font-bold text-white">{currentTier.name}</div>
            <div className="mt-2 text-sm text-white/60">
              Active Staking: {formatAmount(totalStaked)} KRX
            </div>

            {nextTier ? (
              <div className="mt-3 text-sm text-yellow-300">
                You need{" "}
                {(nextTier.min - stakedNumber).toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })}{" "}
                KRX more to unlock {nextTier.name}.
              </div>
            ) : (
              <div className="mt-3 text-sm text-green-300">Highest tier unlocked.</div>
            )}

            {!wallet ? (
              <div className="mt-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70">
                Connect wallet from the top bar
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70">
                Wallet connected
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-md">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Launch Access Tiers</h2>
          <p className="mt-2 text-sm text-white/60">
            Seven creator tiers based on active KORAX staking.
          </p>
        </div>

        <div className="space-y-10">
          <div className="flex justify-center gap-10 flex-wrap">
            {TIERS.slice(0, 2).map(tierCard)}
          </div>

          <div className="flex justify-center gap-10 flex-wrap">
            {TIERS.slice(2, 5).map(tierCard)}
          </div>

          <div className="flex justify-center gap-10 flex-wrap">
            {TIERS.slice(5, 7).map(tierCard)}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-md">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Project Launch Form</h2>
          <p className="mt-2 text-sm text-white/60">
            Enter your project details to prepare your launch request through KORAX.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <input
            value={form.projectName}
            onChange={(e) => updateField("projectName", e.target.value)}
            placeholder="Project Name *"
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
          />
          <input
            value={form.tokenSymbol}
            onChange={(e) => updateField("tokenSymbol", e.target.value)}
            placeholder="Token Symbol *"
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
          />
          <input
            value={form.network}
            onChange={(e) => updateField("network", e.target.value)}
            placeholder="Network"
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
          />
          <input
            value={form.totalSupply}
            onChange={(e) => updateField("totalSupply", e.target.value)}
            placeholder="Total Supply *"
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
          />
          <select
            value={form.presaleType}
            onChange={(e) => updateField("presaleType", e.target.value)}
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
          >
            <option value="Presale">Presale</option>
            <option value="Fair Launch">Fair Launch</option>
            <option value="Private Round">Private Round</option>
          </select>
          <input
            value={form.website}
            onChange={(e) => updateField("website", e.target.value)}
            placeholder="Website"
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
          />
          <input
            value={form.twitter}
            onChange={(e) => updateField("twitter", e.target.value)}
            placeholder="Twitter / X"
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
          />
          <input
            value={form.telegram}
            onChange={(e) => updateField("telegram", e.target.value)}
            placeholder="Telegram"
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
          />

          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Project Description *"
            className="min-h-[120px] rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none md:col-span-2"
          />
          <textarea
            value={form.utility}
            onChange={(e) => updateField("utility", e.target.value)}
            placeholder="Token Utility"
            className="min-h-[120px] rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
          />
          <textarea
            value={form.launchGoal}
            onChange={(e) => updateField("launchGoal", e.target.value)}
            placeholder="Launch Goal / Fundraising Goal"
            className="min-h-[120px] rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
          />

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full rounded-xl bg-[#7CFF6A] px-6 py-3 font-semibold text-black"
            >
              Submit Launch Request
            </button>
          </div>
        </form>

        {status ? (
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
            {status}
          </div>
        ) : null}
      </section>
    </div>
  );
}