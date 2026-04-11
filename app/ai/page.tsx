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
      "Basic AI token planning",
      "Starter project prompts",
      "Simple setup guidance",
    ],
  },
  {
    name: "Silver",
    min: 1000,
    accent: "bg-[#c0c0c0] text-black",
    activeBg: "bg-[#c0c0c0]",
    inactiveBg: "bg-gray-800",
    features: [
      "Improved builder options",
      "Expanded token setup fields",
      "Better generation support",
    ],
  },
  {
    name: "Pearl",
    min: 3000,
    accent: "bg-[#e7e2ff] text-black",
    activeBg: "bg-[#e7e2ff]",
    inactiveBg: "bg-gray-800",
    features: [
      "Advanced builder prompts",
      "Better launch structure generation",
      "Enhanced setup flow",
    ],
  },
  {
    name: "Gold",
    min: 10000,
    accent: "bg-[#ffd700] text-black",
    activeBg: "bg-[#ffd700]",
    inactiveBg: "bg-gray-800",
    features: [
      "Premium builder access",
      "Expanded tokenomics suggestions",
      "Stronger creator toolkit",
    ],
  },
  {
    name: "Diamond",
    min: 20000,
    accent: "bg-[#7dd3fc] text-black",
    activeBg: "bg-[#7dd3fc]",
    inactiveBg: "bg-gray-800",
    features: [
      "High-tier AI build planning",
      "Advanced utility suggestions",
      "Broader project generation",
    ],
  },
  {
    name: "Ruby",
    min: 50000,
    accent: "bg-[#e11d48] text-white",
    activeBg: "bg-[#e11d48]",
    inactiveBg: "bg-gray-800",
    features: [
      "Elite builder privileges",
      "Top-tier creator guidance",
      "Expanded contract generation scope",
    ],
  },
  {
    name: "Emerald",
    min: 100000,
    accent: "bg-[#10b981] text-black",
    activeBg: "bg-[#10b981]",
    inactiveBg: "bg-gray-800",
    features: [
      "Maximum builder access",
      "Highest creator tier",
      "Full premium AI generation path",
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

export default function AIPage() {
  const [wallet, setWallet] = useState("");
  const [totalStaked, setTotalStaked] = useState<bigint>(0n);
  const [status, setStatus] = useState("");
  const [generated, setGenerated] = useState("");

  const [form, setForm] = useState({
    projectName: "",
    tokenName: "",
    tokenSymbol: "",
    totalSupply: "",
    network: "BNB Chain",
    needBurn: "Yes",
    needPresale: "Yes",
    needStaking: "Yes",
    utility: "",
    taxes: "No",
    maxWallet: "No",
    notes: "",
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

  function handleGenerate(e: React.FormEvent) {
    e.preventDefault();

    if (!isConnected || !wallet) {
      setStatus("Connect wallet first.");
      return;
    }

    if (!form.projectName || !form.tokenName || !form.tokenSymbol || !form.totalSupply) {
      setStatus("Please fill the required fields first.");
      return;
    }

    const mockOutput = `// ${form.projectName}
Token Name: ${form.tokenName}
Token Symbol: ${form.tokenSymbol}
Total Supply: ${form.totalSupply}
Network: ${form.network}
Burn Enabled: ${form.needBurn}
Presale Enabled: ${form.needPresale}
Staking Enabled: ${form.needStaking}
Taxes: ${form.taxes}
Max Wallet: ${form.maxWallet}
Utility: ${form.utility || "Not specified"}
Builder Tier: ${currentTier.name}

Status:
This is a prepared project configuration output for future contract generation flow.`;

    setGenerated(mockOutput);
    setStatus(`Builder output prepared under ${currentTier.name} tier.`);
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
            <h1 className="text-3xl font-extrabold text-white">Token Builder AI</h1>
            <p className="mt-3 max-w-3xl text-white/70">
              Your builder capabilities scale with active KORAX staking. Higher tiers unlock
              stronger planning, deeper setup options, and broader creator tools.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white/80 lg:w-[360px]">
            <div className="text-sm text-white/50">Your Builder Tier</div>
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
          <h2 className="text-xl font-bold text-white">Builder Tiers</h2>
          <p className="mt-2 text-sm text-white/60">
            Seven AI builder access levels based on active KORAX staking.
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
          <h2 className="text-xl font-bold text-white">Builder Input</h2>
          <p className="mt-2 text-sm text-white/60">
            Enter your desired project setup to prepare token builder output and future contract generation.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="grid gap-4 md:grid-cols-2">
          <input
            value={form.projectName}
            onChange={(e) => updateField("projectName", e.target.value)}
            placeholder="Project Name *"
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
          />
          <input
            value={form.tokenName}
            onChange={(e) => updateField("tokenName", e.target.value)}
            placeholder="Token Name *"
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
          />
          <input
            value={form.tokenSymbol}
            onChange={(e) => updateField("tokenSymbol", e.target.value)}
            placeholder="Token Symbol *"
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
          />
          <input
            value={form.totalSupply}
            onChange={(e) => updateField("totalSupply", e.target.value)}
            placeholder="Total Supply *"
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
          />
          <input
            value={form.network}
            onChange={(e) => updateField("network", e.target.value)}
            placeholder="Network"
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
          />

          <select
            value={form.needBurn}
            onChange={(e) => updateField("needBurn", e.target.value)}
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
          >
            <option value="Yes">Burn Enabled</option>
            <option value="No">No Burn</option>
          </select>

          <select
            value={form.needPresale}
            onChange={(e) => updateField("needPresale", e.target.value)}
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
          >
            <option value="Yes">Presale Enabled</option>
            <option value="No">No Presale</option>
          </select>

          <select
            value={form.needStaking}
            onChange={(e) => updateField("needStaking", e.target.value)}
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
          >
            <option value="Yes">Staking Enabled</option>
            <option value="No">No Staking</option>
          </select>

          <select
            value={form.taxes}
            onChange={(e) => updateField("taxes", e.target.value)}
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
          >
            <option value="No">No Taxes</option>
            <option value="Yes">Taxes Enabled</option>
          </select>

          <select
            value={form.maxWallet}
            onChange={(e) => updateField("maxWallet", e.target.value)}
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
          >
            <option value="No">No Max Wallet</option>
            <option value="Yes">Max Wallet Enabled</option>
          </select>

          <textarea
            value={form.utility}
            onChange={(e) => updateField("utility", e.target.value)}
            placeholder="Token Utility"
            className="min-h-[120px] rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
          />
          <textarea
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            placeholder="Extra Notes"
            className="min-h-[120px] rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
          />

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full rounded-xl bg-[#7CFF6A] px-6 py-3 font-semibold text-black"
            >
              Generate Builder Output
            </button>
          </div>
        </form>

        {status ? (
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
            {status}
          </div>
        ) : null}

        {generated ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-5">
            <div className="mb-3 text-sm font-semibold text-white/70">Generated Output</div>
            <pre className="whitespace-pre-wrap text-sm text-white/80">{generated}</pre>
          </div>
        ) : null}
      </section>
    </div>
  );
}