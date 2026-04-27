"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount, useWalletClient } from "wagmi";
import {
  ACCESS_MANAGER_ADDRESS,
  AI_DEPLOYER_ADDRESS,
  RPC_URL,
  accessManagerAbi,
  aiDeployerAbi,
} from "@/lib/korax/contracts";

type DraftResult = {
  projectSummary: string;
  projectVerdict: string;
  brandAngle: string;
  originalityScore: string;
  utilityStrengthScore: string;
  marketFitScore: string;
  coreUtility: string[];
  differentiation: string[];
  tokenomicsPreview: {
    totalSupplySuggestion: string;
    presaleAllocationSuggestion: string;
    stakingAllocationSuggestion: string;
    treasuryAllocationSuggestion: string;
    liquidityAllocationSuggestion: string;
    notes: string;
  };
  launchPlan: {
    presaleRecommended: string;
    suggestedStageCount: string;
    fundingLogic: string;
    launchNotes: string;
  };
  roadmap: string[];
  weakPoints: string[];
  risks: string[];
  improvementActions: string[];
  pitch: string;
  koraxConversionNote: string;
};

type AccessState = {
  loading: boolean;
  connected: boolean;
  wallet: string;
  eligibleAmount: string;
  tokensPerProject: string;
  requiredRewardBps: number;
  totalSlots: number;
  usedSlots: number;
  availableSlots: number;
  hasAccess: boolean;
  registeredProjects: number;
  error: string;
};

type DeployResult = {
  projectId: string;
  token: string;
  vault: string;
  staking: string;
  txHash: string;
};

type VisualResult = {
  imageBase64?: string;
  imageUrl?: string;
  prompt?: string;
  model?: string;
};

const projectFields = [
  ["goal", "Main Goal of the Project"],
  ["problemSolved", "What problem does this project solve?"],
  ["userCareReason", "Why would users care about this project?"],
  ["competitiveEdge", "What makes it different from other projects?"],
  ["tokenUtilityReason", "How does the token create real utility?"],
  ["holdReason", "Why would people hold the token instead of selling it?"],
  ["growthLogic", "What is the long-term growth logic?"],
  ["revenueLogic", "How does the project make money or create ecosystem value?"],
  ["failureRisk", "What is the strongest reason this project could fail?"],
] as const;

const freeFeatures = [
  "Positioning and project verdict",
  "Utility direction and differentiation",
  "Tokenomics preview",
  "Launch logic and roadmap",
  "AI project visual generation",
  "Weak points and risks",
];

function formatTokenAmount(raw: bigint) {
  return Number(ethers.formatUnits(raw, 18)).toLocaleString("en-US", {
    maximumFractionDigits: 4,
  });
}

function shortAddress(address?: string) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="text-xs text-white/45">{label}</div>
      <div className="mt-1 text-lg font-bold text-white">{value}</div>
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-black/25 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-md">
      <h3 className="text-lg font-bold text-white">{title}</h3>
      {children}
    </div>
  );
}

export default function AIPage() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [form, setForm] = useState({
    projectName: "",
    symbol: "",
    category: "AI",
    shortDescription: "",
    targetAudience: "",
    network: "BNB Chain",
    presale: true,
    staking: true,
    vesting: false,
    style: "Professional",
    goal: "",
    problemSolved: "",
    userCareReason: "",
    competitiveEdge: "",
    tokenUtilityReason: "",
    holdReason: "",
    growthLogic: "",
    revenueLogic: "",
    failureRisk: "",
  });

  const [deployForm, setDeployForm] = useState({
    totalSupply: "100000000",
    stakingEnabled: true,
    stakingRewardsAllocation: "20000000",
    metadataURI: "",
  });

  const [visualForm, setVisualForm] = useState({
    imageType: "Project Poster",
    visualStyle: "Futuristic Web3",
    colors: "black, neon green, silver",
    mood: "premium, futuristic, serious",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DraftResult | null>(null);
  const [error, setError] = useState("");
  const [showCreationStep, setShowCreationStep] = useState(false);

  const [deployingProject, setDeployingProject] = useState(false);
  const [deployError, setDeployError] = useState("");
  const [deployResult, setDeployResult] = useState<DeployResult | null>(null);

  const [visualLoading, setVisualLoading] = useState(false);
  const [visualError, setVisualError] = useState("");
  const [visualResult, setVisualResult] = useState<VisualResult | null>(null);

  const [access, setAccess] = useState<AccessState>({
    loading: false,
    connected: false,
    wallet: "",
    eligibleAmount: "0",
    tokensPerProject: "500",
    requiredRewardBps: 9000,
    totalSlots: 0,
    usedSlots: 0,
    availableSlots: 0,
    hasAccess: false,
    registeredProjects: 0,
    error: "",
  });

  async function loadAccessData(user?: string) {
    if (!user) {
      setAccess({
        loading: false,
        connected: false,
        wallet: "",
        eligibleAmount: "0",
        tokensPerProject: "500",
        requiredRewardBps: 9000,
        totalSlots: 0,
        usedSlots: 0,
        availableSlots: 0,
        hasAccess: false,
        registeredProjects: 0,
        error: "",
      });
      return;
    }

    try {
      setAccess((prev) => ({
        ...prev,
        loading: true,
        connected: true,
        wallet: user,
        error: "",
      }));

      if (!ACCESS_MANAGER_ADDRESS) {
        throw new Error("Access manager address is missing.");
      }

      if (!AI_DEPLOYER_ADDRESS) {
        throw new Error("AI deployer address is missing.");
      }

      const provider = new ethers.JsonRpcProvider(RPC_URL);

      const accessManager = new ethers.Contract(
        ACCESS_MANAGER_ADDRESS,
        accessManagerAbi,
        provider
      );

      const aiDeployer = new ethers.Contract(
        AI_DEPLOYER_ADDRESS,
        aiDeployerAbi,
        provider
      );

      const [
        eligibleAmountRaw,
        totalSlotsRaw,
        hasAccessRaw,
        usedSlotsRaw,
        availableSlotsRaw,
        accessData,
      ] = await Promise.all([
        accessManager.getEligibleStakedAmount(user),
        accessManager.getProjectSlots(user),
        accessManager.hasKoraxAccess(user),
        aiDeployer.projectsUsedByOwner(user),
        aiDeployer.availableProjectSlots(user),
        accessManager.getAccessData(user),
      ]);

      const tokensPerProjectRaw =
        accessData.currentTokensPerProject ??
        accessData.tokensPerProject ??
        accessData[2];

      const requiredRewardBpsRaw =
        accessData.currentRequiredRewardBps ??
        accessData.requiredRewardBps ??
        accessData[3];

      setAccess({
        loading: false,
        connected: true,
        wallet: user,
        eligibleAmount: formatTokenAmount(BigInt(eligibleAmountRaw.toString())),
        tokensPerProject: formatTokenAmount(
          BigInt(tokensPerProjectRaw.toString())
        ),
        requiredRewardBps: Number(requiredRewardBpsRaw),
        totalSlots: Number(totalSlotsRaw),
        usedSlots: Number(usedSlotsRaw),
        availableSlots: Number(availableSlotsRaw),
        hasAccess: Boolean(hasAccessRaw),
        registeredProjects: Number(usedSlotsRaw),
        error: "",
      });
    } catch (err: any) {
      setAccess((prev) => ({
        ...prev,
        loading: false,
        connected: true,
        wallet: user,
        error: err?.shortMessage || err?.message || "Failed to load access data",
      }));
    }
  }

  useEffect(() => {
    if (!address || !isConnected) {
      loadAccessData(undefined);
      return;
    }

    loadAccessData(address);
  }, [address, isConnected]);

  async function generateDraft() {
    setLoading(true);
    setError("");
    setResult(null);
    setShowCreationStep(false);
    setDeployError("");
    setDeployResult(null);

    try {
      const res = await fetch("/api/ai-draft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to generate draft");
      }

      setResult(data.result);
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function generateVisual() {
    setVisualLoading(true);
    setVisualError("");
    setVisualResult(null);

    try {
      if (!form.projectName.trim()) {
        throw new Error("Project name is required.");
      }

      if (!form.symbol.trim()) {
        throw new Error("Token symbol is required.");
      }

      if (!form.shortDescription.trim()) {
        throw new Error("Short description is required.");
      }

      const res = await fetch("/api/ai-visual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName: form.projectName,
          symbol: form.symbol,
          category: form.category,
          shortDescription: form.shortDescription,
          imageType: visualForm.imageType,
          visualStyle: visualForm.visualStyle,
          colors: visualForm.colors,
          mood: visualForm.mood,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to generate project visual.");
      }

      setVisualResult({
        imageBase64: data.imageBase64,
        imageUrl: data.imageUrl,
        prompt: data.prompt,
        model: data.model,
      });
    } catch (err: any) {
      setVisualError(
        err?.message || "Something went wrong while generating the visual."
      );
    } finally {
      setVisualLoading(false);
    }
  }

  async function deployAIProject() {
    setDeployingProject(true);
    setDeployError("");
    setDeployResult(null);

    try {
      if (!isConnected || !address) {
        throw new Error("Connect your wallet first.");
      }

      if (!walletClient) {
        throw new Error("Wallet client not ready.");
      }

      if (!AI_DEPLOYER_ADDRESS) {
        throw new Error("AI deployer address is missing.");
      }

      if (!form.projectName.trim()) {
        throw new Error("Project name is required.");
      }

      if (!form.symbol.trim()) {
        throw new Error("Token symbol is required.");
      }

      if (access.availableSlots <= 0) {
        throw new Error("No available KORAX project slots.");
      }

      const totalSupply = ethers.parseUnits(deployForm.totalSupply || "0", 18);

      const stakingRewardsAllocation = deployForm.stakingEnabled
        ? ethers.parseUnits(deployForm.stakingRewardsAllocation || "0", 18)
        : 0n;

      if (totalSupply <= 0n) {
        throw new Error("Total supply must be greater than 0.");
      }

      if (deployForm.stakingEnabled && stakingRewardsAllocation <= 0n) {
        throw new Error("Staking rewards allocation must be greater than 0.");
      }

      if (stakingRewardsAllocation > totalSupply) {
        throw new Error("Staking rewards allocation cannot exceed total supply.");
      }

      const browserProvider = new ethers.BrowserProvider(
        walletClient.transport as any
      );

      const signer = await browserProvider.getSigner();

      const contract = new ethers.Contract(
        AI_DEPLOYER_ADDRESS,
        aiDeployerAbi,
        signer
      );

      const metadataURI =
        deployForm.metadataURI.trim() ||
        `korax-ai:${form.projectName.trim()}:${Date.now()}`;

      const cfg = {
        name: form.projectName.trim(),
        symbol: form.symbol.trim().toUpperCase(),
        totalSupply,
        stakingEnabled: deployForm.stakingEnabled,
        stakingRewardsAllocation,
        metadataURI,
      };

      const tx = await contract.deployAIProject(cfg);
      const receipt = await tx.wait();

      const iface = new ethers.Interface(aiDeployerAbi);
      let parsedEvent: any = null;

      for (const log of receipt.logs) {
        try {
          const parsed = iface.parseLog(log);
          if (parsed?.name === "AIProjectDeployed") {
            parsedEvent = parsed;
            break;
          }
        } catch {
          // ignore unrelated logs
        }
      }

      if (!parsedEvent) {
        throw new Error("Project deployed, but event was not found.");
      }

      setDeployResult({
        projectId: parsedEvent.args.projectId.toString(),
        token: parsedEvent.args.token,
        vault: parsedEvent.args.vault,
        staking: parsedEvent.args.staking,
        txHash: receipt.hash,
      });

      await loadAccessData(address);
    } catch (err: any) {
      setDeployError(err?.shortMessage || err?.message || "Deployment failed.");
    } finally {
      setDeployingProject(false);
    }
  }

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const canContinueToCreation = !!result && access.availableSlots > 0;
  const needsUnlock = !!result && access.availableSlots <= 0;

  const visualImageSrc = visualResult?.imageBase64
    ? `data:image/png;base64,${visualResult.imageBase64}`
    : visualResult?.imageUrl || "";

  const finalProjectPreview = result
    ? {
        name: form.projectName || "Untitled Project",
        symbol: form.symbol || "TKN",
        category: form.category,
        network: form.network,
        presale: form.presale ? "Launchpad Ready" : "Not Selected",
        staking: form.staking ? "Enabled" : "Disabled",
        vesting: form.vesting ? "Enabled" : "Disabled",
        verdict: result.projectVerdict,
        summary: result.projectSummary,
        pitch: result.pitch,
      }
    : null;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[34px] border border-white/10 bg-black/30 p-6 shadow-[0_30px_110px_rgba(0,0,0,0.55)] backdrop-blur-md sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,255,106,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_30%)]" />

        <div className="relative max-w-4xl">
          <div className="inline-flex rounded-full border border-[#7CFF6A]/20 bg-[#7CFF6A]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#c4ffbc]">
            KORAX Token Builder AI
          </div>

          <h1 className="mt-5 text-4xl font-black leading-tight text-white sm:text-5xl">
            Turn an idea into a serious
            <span className="block text-[#7CFF6A]">
              Web3 project blueprint.
            </span>
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/68">
            KORAX AI helps builders shape project strategy, tokenomics,
            launch logic, roadmap direction, visual identity, and on-chain
            project preparation through a clean AI-powered workflow.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="text-xs text-white/45">AI Draft</div>
              <div className="mt-1 font-bold text-white">Free</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="text-xs text-white/45">Project Deploy</div>
              <div className="mt-1 font-bold text-white">KRX Access</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="text-xs text-white/45">Future Expansion</div>
              <div className="mt-1 font-bold text-white">Solana Planned</div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="rounded-[30px] border border-white/10 bg-black/20 p-6 shadow-[0_22px_80px_rgba(0,0,0,0.35)] backdrop-blur-md">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/40">
                Builder Input
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-white">
                Describe your project
              </h2>
            </div>

            <div className="rounded-full border border-[#7CFF6A]/20 bg-[#7CFF6A]/10 px-4 py-2 text-xs font-semibold text-[#c4ffbc]">
              AI Strategy Engine
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <input
              value={form.projectName}
              onChange={(e) => update("projectName", e.target.value)}
              placeholder="Project Name"
              className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-[#7CFF6A]/40"
            />

            <input
              value={form.symbol}
              onChange={(e) => update("symbol", e.target.value)}
              placeholder="Token Symbol"
              className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-[#7CFF6A]/40"
            />

            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition focus:border-[#7CFF6A]/40"
            >
              <option>AI</option>
              <option>Launchpad</option>
              <option>Meme</option>
              <option>Utility</option>
              <option>Gaming</option>
              <option>DeFi</option>
              <option>Community</option>
            </select>

            <textarea
              value={form.shortDescription}
              onChange={(e) => update("shortDescription", e.target.value)}
              placeholder="Short Description"
              rows={4}
              className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-[#7CFF6A]/40"
            />

            <input
              value={form.targetAudience}
              onChange={(e) => update("targetAudience", e.target.value)}
              placeholder="Target Audience"
              className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-[#7CFF6A]/40"
            />

            <div className="space-y-2">
              <select
                value={form.network}
                onChange={(e) => update("network", e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition focus:border-[#7CFF6A]/40"
              >
                <option value="BNB Chain">BNB Chain</option>
                <option value="Solana — Planned for Future">
                  Solana — Planned for Future
                </option>
              </select>

              <p className="text-xs leading-relaxed text-white/45">
                BNB Chain is the current active ecosystem network. Solana is
                planned for future expansion.
              </p>
            </div>

            <select
              value={form.style}
              onChange={(e) => update("style", e.target.value)}
              className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition focus:border-[#7CFF6A]/40"
            >
              <option>Professional</option>
              <option>Aggressive Growth</option>
              <option>Community First</option>
              <option>Premium Brand</option>
              <option>Meme Energy</option>
            </select>

            {projectFields.map(([key, placeholder]) => (
              <textarea
                key={key}
                value={form[key] as string}
                onChange={(e) => update(key, e.target.value as any)}
                placeholder={placeholder}
                rows={3}
                className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-[#7CFF6A]/40"
              />
            ))}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/80">
                <input
                  type="checkbox"
                  checked={form.presale}
                  onChange={(e) => update("presale", e.target.checked)}
                />
                Launchpad
              </label>

              <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/80">
                <input
                  type="checkbox"
                  checked={form.staking}
                  onChange={(e) => {
                    update("staking", e.target.checked);
                    setDeployForm((prev) => ({
                      ...prev,
                      stakingEnabled: e.target.checked,
                      stakingRewardsAllocation: e.target.checked
                        ? prev.stakingRewardsAllocation || "20000000"
                        : "0",
                    }));
                  }}
                />
                Staking
              </label>

              <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/80">
                <input
                  type="checkbox"
                  checked={form.vesting}
                  onChange={(e) => update("vesting", e.target.checked)}
                />
                Vesting
              </label>
            </div>

            <button
              onClick={generateDraft}
              disabled={loading}
              className="rounded-xl bg-[#7CFF6A] px-5 py-3 font-bold text-black shadow-[0_0_35px_rgba(124,255,106,0.18)] transition hover:scale-[1.01] hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Generating AI Draft..." : "Generate AI Draft"}
            </button>

            {error ? (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-6">
          <SectionCard title="KORAX Access">
            <div className="mt-4 rounded-2xl border border-[#7CFF6A]/20 bg-[#7CFF6A]/10 p-4 text-sm leading-relaxed text-white/75">
              To create and deploy a project through KORAX AI, users need to
              stake{" "}
              <span className="font-semibold text-white">
                {access.tokensPerProject} KRX
              </span>{" "}
              on the{" "}
              <span className="font-semibold text-white">
                12-month staking plan
              </span>{" "}
              to unlock{" "}
              <span className="font-semibold text-white">1 project slot</span>.
            </div>

            {!access.connected ? (
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-white/65">
                Connect your wallet to view your current KORAX access, eligible
                staking amount, and available project slots.
              </div>
            ) : access.loading ? (
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-white/65">
                Loading access data...
              </div>
            ) : access.error ? (
              <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                {access.error}
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <InfoCard label="Wallet" value={shortAddress(access.wallet)} />

                <div className="grid grid-cols-2 gap-3">
                  <InfoCard
                    label="Eligible Staked"
                    value={`${access.eligibleAmount} KRX`}
                  />
                  <InfoCard
                    label="Tokens Per Project"
                    value={`${access.tokensPerProject} KRX`}
                  />
                  <InfoCard label="Required Plan" value="12 Months" />
                  <InfoCard label="Reward BPS" value={access.requiredRewardBps} />
                  <InfoCard
                    label="Access Status"
                    value={access.hasAccess ? "Unlocked" : "Locked"}
                  />
                  <InfoCard label="Total Slots" value={access.totalSlots} />
                  <InfoCard label="Used Slots" value={access.usedSlots} />
                  <InfoCard
                    label="Available Slots"
                    value={access.availableSlots}
                  />
                </div>
              </div>
            )}
          </SectionCard>

          <SectionCard title="KORAX AI Free Draft">
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              The free version helps users understand whether their idea is
              strong, weak, fixable, or worth converting into a real project.
            </p>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-5">
              <div className="text-sm font-semibold text-white">
                What you get for free
              </div>
              <ul className="mt-3 space-y-2 text-sm text-white/65">
                {freeFeatures.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </SectionCard>

          <SectionCard title="AI Project Visual">
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              Generate a matching project visual for social media, hero
              sections, posters, and early branding.
            </p>

            <div className="mt-5 grid gap-4">
              <select
                value={visualForm.imageType}
                onChange={(e) =>
                  setVisualForm((prev) => ({
                    ...prev,
                    imageType: e.target.value,
                  }))
                }
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
              >
                <option>Project Poster</option>
                <option>Token Artwork</option>
                <option>Landing Page Hero</option>
                <option>Marketing Banner</option>
                <option>Community Promo Visual</option>
                <option>Mascot / Character</option>
                <option>Logo Concept</option>
              </select>

              <select
                value={visualForm.visualStyle}
                onChange={(e) =>
                  setVisualForm((prev) => ({
                    ...prev,
                    visualStyle: e.target.value,
                  }))
                }
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
              >
                <option>Futuristic Web3</option>
                <option>Luxury Brand</option>
                <option>Dark Premium</option>
                <option>Minimal Clean</option>
                <option>Cyberpunk</option>
                <option>Community Meme Style</option>
              </select>

              <input
                value={visualForm.colors}
                onChange={(e) =>
                  setVisualForm((prev) => ({ ...prev, colors: e.target.value }))
                }
                placeholder="Preferred colors"
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
              />

              <input
                value={visualForm.mood}
                onChange={(e) =>
                  setVisualForm((prev) => ({ ...prev, mood: e.target.value }))
                }
                placeholder="Mood"
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
              />

              <button
                type="button"
                onClick={generateVisual}
                disabled={visualLoading}
                className="rounded-xl bg-[#7CFF6A] px-5 py-3 font-bold text-black transition hover:opacity-90 disabled:opacity-60"
              >
                {visualLoading ? "Generating Visual..." : "Generate Project Visual"}
              </button>

              {visualError ? (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {visualError}
                </div>
              ) : null}

              {visualImageSrc ? (
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/25 p-3">
                  <img
                    src={visualImageSrc}
                    alt="Generated project visual"
                    className="h-auto w-full rounded-xl object-cover"
                  />

                  <div className="mt-3 rounded-xl border border-white/10 bg-black/30 p-3 text-xs leading-relaxed text-white/55">
                    AI visuals are generated from your project description. Text
                    inside images may not always be perfect, so the best use is
                    for concept art, posters, branding direction, and early
                    marketing visuals.
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={generateVisual}
                      disabled={visualLoading}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-60"
                    >
                      {visualLoading ? "Generating..." : "Generate Another Visual"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setDeployForm((prev) => ({
                          ...prev,
                          metadataURI:
                            prev.metadataURI ||
                            `korax-ai-visual:${form.projectName.trim()}:${Date.now()}`,
                        }))
                      }
                      className="rounded-xl border border-[#7CFF6A]/20 bg-[#7CFF6A]/10 px-4 py-2 text-sm font-semibold text-[#c4ffbc] transition hover:bg-[#7CFF6A]/15"
                    >
                      Use Visual as Project Reference
                    </button>
                  </div>

                  <div className="mt-3 text-xs text-white/45">
                    Generated with {visualResult?.model || "image model"}
                  </div>

                  {visualResult?.prompt ? (
                    <details className="mt-3 rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-white/60">
                      <summary className="cursor-pointer font-semibold text-white/80">
                        Show Prompt
                      </summary>
                      <div className="mt-3 whitespace-pre-wrap leading-relaxed">
                        {visualResult.prompt}
                      </div>
                    </details>
                  ) : null}
                </div>
              ) : null}
            </div>
          </SectionCard>
        </div>
      </section>

      {result ? (
        <section className="space-y-6">
          <section className="rounded-[30px] border border-white/10 bg-black/25 p-6 shadow-[0_22px_80px_rgba(0,0,0,0.35)] backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">
              AI Draft Result
            </p>
            <h2 className="mt-2 text-3xl font-black text-white">
              Project intelligence generated
            </h2>
            <p className="mt-3 text-sm text-white/60">
              This draft was generated by KORAX AI and refined for stronger
              positioning, launch logic, and builder clarity.
            </p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-md">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Next Step</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  Your AI draft is ready. You can now deploy the project
                  on-chain through KORAX AI when your wallet has an available
                  project slot.
                </p>
              </div>

              {canContinueToCreation ? (
                <button
                  type="button"
                  onClick={() => setShowCreationStep((prev) => !prev)}
                  className="rounded-xl bg-[#7CFF6A] px-5 py-3 font-bold text-black transition hover:opacity-90"
                >
                  {showCreationStep
                    ? "Hide Project Creation"
                    : "Continue to Project Creation"}
                </button>
              ) : needsUnlock ? (
                <div className="rounded-xl border border-[#7CFF6A]/20 bg-[#7CFF6A]/10 px-4 py-3 text-sm text-white/75">
                  Unlock with{" "}
                  <span className="font-semibold text-white">
                    {access.tokensPerProject} KRX
                  </span>{" "}
                  on the{" "}
                  <span className="font-semibold text-white">
                    12-month staking plan
                  </span>{" "}
                  to activate your first project slot.
                </div>
              ) : null}
            </div>
          </section>

          {showCreationStep && finalProjectPreview ? (
            <section className="space-y-6 rounded-[30px] border border-[#7CFF6A]/20 bg-[#7CFF6A]/10 p-6 shadow-[0_22px_80px_rgba(0,0,0,0.35)] backdrop-blur-md">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#c4ffbc]">
                  Project Creation Preview
                </p>
                <h3 className="mt-2 text-2xl font-black text-white">
                  Review your project before on-chain deployment
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  This step connects your AI draft to the real KORAX AI Deployer
                  contract.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                  ["Project Name", finalProjectPreview.name],
                  ["Token Symbol", finalProjectPreview.symbol],
                  ["Category", finalProjectPreview.category],
                  ["Network", finalProjectPreview.network],
                  ["Launchpad", finalProjectPreview.presale],
                  ["Staking", finalProjectPreview.staking],
                  ["Vesting", finalProjectPreview.vesting],
                  ["AI Verdict", finalProjectPreview.verdict],
                ].map(([label, value]) => (
                  <InfoCard key={label} label={label} value={value} />
                ))}
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <SectionCard title="Summary">
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    {finalProjectPreview.summary}
                  </p>
                </SectionCard>

                <SectionCard title="Pitch">
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    {finalProjectPreview.pitch}
                  </p>
                </SectionCard>
              </div>

              <SectionCard title="On-chain Deployment Settings">
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-xs text-white/45">Total Supply</label>
                    <input
                      value={deployForm.totalSupply}
                      onChange={(e) =>
                        setDeployForm((prev) => ({
                          ...prev,
                          totalSupply: e.target.value,
                        }))
                      }
                      placeholder="100000000"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/45">
                      Staking Rewards Allocation
                    </label>
                    <input
                      value={deployForm.stakingRewardsAllocation}
                      onChange={(e) =>
                        setDeployForm((prev) => ({
                          ...prev,
                          stakingRewardsAllocation: e.target.value,
                        }))
                      }
                      placeholder="20000000"
                      disabled={!deployForm.stakingEnabled}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none disabled:opacity-50"
                    />
                  </div>
                </div>

                <label className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/80">
                  <input
                    type="checkbox"
                    checked={deployForm.stakingEnabled}
                    onChange={(e) =>
                      setDeployForm((prev) => ({
                        ...prev,
                        stakingEnabled: e.target.checked,
                        stakingRewardsAllocation: e.target.checked
                          ? prev.stakingRewardsAllocation || "20000000"
                          : "0",
                      }))
                    }
                  />
                  Deploy staking contract
                </label>

                <div className="mt-4">
                  <label className="text-xs text-white/45">
                    Metadata URI / Project Reference
                  </label>
                  <input
                    value={deployForm.metadataURI}
                    onChange={(e) =>
                      setDeployForm((prev) => ({
                        ...prev,
                        metadataURI: e.target.value,
                      }))
                    }
                    placeholder="Optional: IPFS / website / project reference"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
                  />
                </div>

                <p className="mt-4 text-sm leading-relaxed text-white/55">
                  The staking rewards allocation will be sent automatically to
                  the project vault. The remaining supply will be sent to your
                  wallet.
                </p>
              </SectionCard>

              <SectionCard title="Project Slot Status">
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  Available Slots:{" "}
                  <span className="font-semibold text-white">
                    {access.availableSlots}
                  </span>
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  Deploying this project will consume one available KORAX
                  project slot.
                </p>
              </SectionCard>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={deployAIProject}
                    disabled={deployingProject || access.availableSlots <= 0}
                    className="rounded-xl bg-[#7CFF6A] px-5 py-3 font-bold text-black transition hover:opacity-90 disabled:opacity-50"
                  >
                    {deployingProject
                      ? "Deploying Project..."
                      : "Deploy AI Project On-chain"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCreationStep(false)}
                    className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white"
                  >
                    Back
                  </button>
                </div>

                {deployError ? (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {deployError}
                  </div>
                ) : null}

                {deployResult ? (
                  <div className="rounded-2xl border border-[#7CFF6A]/20 bg-black/35 p-5">
                    <div className="text-lg font-bold text-[#c4ffbc]">
                      Project deployed successfully
                    </div>

                    <div className="mt-4 grid gap-3 text-sm text-white/75">
                      <div>
                        <span className="text-white/45">Project ID:</span>{" "}
                        <span className="font-semibold text-white">
                          {deployResult.projectId}
                        </span>
                      </div>

                      <div>
                        <span className="text-white/45">Token:</span>{" "}
                        <span className="break-all font-semibold text-white">
                          {deployResult.token}
                        </span>
                      </div>

                      <div>
                        <span className="text-white/45">Vault:</span>{" "}
                        <span className="break-all font-semibold text-white">
                          {deployResult.vault}
                        </span>
                      </div>

                      <div>
                        <span className="text-white/45">Staking:</span>{" "}
                        <span className="break-all font-semibold text-white">
                          {deployResult.staking === ethers.ZeroAddress
                            ? "Not deployed"
                            : deployResult.staking}
                        </span>
                      </div>

                      <div>
                        <span className="text-white/45">Transaction:</span>{" "}
                        <span className="break-all font-semibold text-white">
                          {deployResult.txHash}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}

          <div className="grid gap-6 lg:grid-cols-3">
            <InfoCard label="Project Verdict" value={result.projectVerdict} />
            <InfoCard label="Originality Score" value={result.originalityScore} />
            <InfoCard
              label="Utility Strength Score"
              value={result.utilityStrengthScore}
            />
          </div>

          <InfoCard label="Market Fit Score" value={result.marketFitScore} />

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Project Summary">
              <p className="mt-3 leading-relaxed text-white/70">
                {result.projectSummary}
              </p>

              <h3 className="mt-6 text-lg font-bold text-white">Brand Angle</h3>
              <p className="mt-3 leading-relaxed text-white/70">
                {result.brandAngle}
              </p>

              <h3 className="mt-6 text-lg font-bold text-white">Pitch</h3>
              <p className="mt-3 leading-relaxed text-white/70">
                {result.pitch}
              </p>
            </SectionCard>

            <SectionCard title="Core Utility">
              <ul className="mt-3 space-y-2 text-white/70">
                {result.coreUtility.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>

              <h3 className="mt-6 text-lg font-bold text-white">
                Differentiation
              </h3>
              <ul className="mt-3 space-y-2 text-white/70">
                {result.differentiation.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </SectionCard>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Tokenomics Preview">
              <div className="mt-4 space-y-3 text-sm text-white/70">
                <div>
                  <span className="font-semibold text-white">Supply:</span>{" "}
                  {result.tokenomicsPreview.totalSupplySuggestion}
                </div>
                <div>
                  <span className="font-semibold text-white">Launchpad:</span>{" "}
                  {result.tokenomicsPreview.presaleAllocationSuggestion}
                </div>
                <div>
                  <span className="font-semibold text-white">Staking:</span>{" "}
                  {result.tokenomicsPreview.stakingAllocationSuggestion}
                </div>
                <div>
                  <span className="font-semibold text-white">Treasury:</span>{" "}
                  {result.tokenomicsPreview.treasuryAllocationSuggestion}
                </div>
                <div>
                  <span className="font-semibold text-white">Liquidity:</span>{" "}
                  {result.tokenomicsPreview.liquidityAllocationSuggestion}
                </div>
                <div>
                  <span className="font-semibold text-white">Notes:</span>{" "}
                  {result.tokenomicsPreview.notes}
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Launch Plan">
              <div className="mt-4 space-y-3 text-sm text-white/70">
                <div>
                  <span className="font-semibold text-white">
                    Launch Recommended:
                  </span>{" "}
                  {result.launchPlan.presaleRecommended}
                </div>
                <div>
                  <span className="font-semibold text-white">
                    Suggested Stages:
                  </span>{" "}
                  {result.launchPlan.suggestedStageCount}
                </div>
                <div>
                  <span className="font-semibold text-white">Funding Logic:</span>{" "}
                  {result.launchPlan.fundingLogic}
                </div>
                <div>
                  <span className="font-semibold text-white">Launch Notes:</span>{" "}
                  {result.launchPlan.launchNotes}
                </div>
              </div>
            </SectionCard>
          </div>

          <SectionCard title="Roadmap">
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {result.roadmap.map((step, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-white/10 bg-black/25 p-4 text-sm text-white/70"
                >
                  <div className="mb-2 font-semibold text-white">
                    Phase {idx + 1}
                  </div>
                  {step}
                </div>
              ))}
            </div>
          </SectionCard>

          <div className="grid gap-6 lg:grid-cols-3">
            <SectionCard title="Weak Points">
              <ul className="mt-3 space-y-2 text-white/70">
                {result.weakPoints.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </SectionCard>

            <SectionCard title="Risks">
              <ul className="mt-3 space-y-2 text-white/70">
                {result.risks.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </SectionCard>

            <SectionCard title="Improvement Actions">
              <ul className="mt-3 space-y-2 text-white/70">
                {result.improvementActions.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </SectionCard>
          </div>

          <div className="rounded-2xl border border-[#7CFF6A]/20 bg-[#7CFF6A]/10 p-6">
            <h3 className="text-lg font-bold text-[#c4ffbc]">
              Next Step with KORAX
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/75">
              {result.koraxConversionNote}
            </p>
          </div>
        </section>
      ) : null}
    </div>
  );
}