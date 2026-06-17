"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import JSZip from "jszip";
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

type StakingPlanForm = {
  durationDays: string;
  rewardBps: string;
};

const WEBSITE_BUILDER_ROUTE = "/website-builder-ai";

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

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-white/30 transition focus:border-[#7CFF6A]/45 focus:bg-black/55";

const selectClass =
  "w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-[#7CFF6A]/45 focus:bg-black/55";

function formatTokenAmount(raw: bigint) {
  return Number(ethers.formatUnits(raw, 18)).toLocaleString("en-US", {
    maximumFractionDigits: 4,
  });
}

function shortAddress(address?: string) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function cleanFileName(value: string) {
  return (
    value
      ?.toLowerCase()
      .replace(/[^a-z0-9-_]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "korax-project"
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-xs font-black uppercase tracking-[0.22em] text-white/38">
          {label}
        </span>

        {hint ? (
          <span className="text-[11px] text-white/30">{hint}</span>
        ) : null}
      </div>

      {children}
    </label>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/35 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.045)]">
      <div className="text-[11px] font-black uppercase tracking-[0.2em] text-white/35">
        {label}
      </div>

      <div className="mt-2 break-words text-lg font-black leading-relaxed text-white">
        {value}
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  active,
}: {
  label: string;
  value: string | number;
  active?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl border p-4",
        active
          ? "border-[#7CFF6A]/25 bg-[#7CFF6A]/10"
          : "border-white/10 bg-black/30",
      ].join(" ")}
    >
      <div className="text-xs font-black uppercase tracking-[0.2em] text-white/35">
        {label}
      </div>
      <div className="mt-2 text-lg font-black text-white">{value}</div>
    </div>
  );
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
          ? "border-[#7CFF6A]/25 bg-[#7CFF6A]/12 text-[#c4ffbc]"
          : "border-white/10 bg-white/[0.04] text-white/48",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function SectionCard({
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
    <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-black/30 p-5 shadow-[0_22px_90px_rgba(0,0,0,0.42)] backdrop-blur-xl md:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,255,106,0.08),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(40,120,255,0.10),transparent_36%)]" />

      <div className="relative">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            {eyebrow ? (
              <p className="text-xs font-black uppercase tracking-[0.25em] text-white/35">
                {eyebrow}
              </p>
            ) : null}

            <h3
              className={
                eyebrow
                  ? "mt-2 text-2xl font-black text-white"
                  : "text-xl font-black text-white"
              }
            >
              {title}
            </h3>
          </div>

          {right}
        </div>

        {children}
      </div>
    </section>
  );
}

function FlowStep({
  index,
  title,
  text,
  active,
}: {
  index: string;
  title: string;
  text: string;
  active?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl border p-4 transition",
        active
          ? "border-[#7CFF6A]/25 bg-[#7CFF6A]/10"
          : "border-white/10 bg-white/[0.035]",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <div
          className={[
            "flex h-10 w-10 items-center justify-center rounded-2xl text-xs font-black",
            active ? "bg-[#7CFF6A] text-black" : "bg-white/10 text-white/55",
          ].join(" ")}
        >
          {index}
        </div>

        <div className="font-black text-white">{title}</div>
      </div>

      <p className="mt-3 text-sm leading-6 text-white/55">{text}</p>
    </div>
  );
}

function AIEngineVisual() {
  return (
    <div className="relative min-h-[360px] overflow-hidden rounded-[34px] border border-white/10 bg-[#020816] shadow-[0_30px_100px_rgba(0,0,0,0.62)] md:min-h-[500px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,255,106,0.12),transparent_31%),radial-gradient(circle_at_top_right,rgba(30,90,180,0.28),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(80,130,255,0.14),transparent_36%)]" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#7CFF6A]/10 shadow-[0_0_100px_rgba(124,255,106,0.12)]" />

      <div className="edge-pulse edge-left" />
      <div className="edge-pulse edge-right" />
      <div className="edge-pulse edge-top" />
      <div className="edge-pulse edge-bottom" />

      <svg
        className="absolute inset-0 h-full w-full opacity-75"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="tokenLightPathGlow">
            <feGaussianBlur stdDeviation="0.35" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {[
          "M 5 18 C 25 24, 34 38, 50 50",
          "M 95 18 C 75 24, 66 38, 50 50",
          "M 5 83 C 25 78, 34 64, 50 50",
          "M 95 83 C 75 78, 66 64, 50 50",
          "M 50 4 C 49 25, 49 38, 50 50",
          "M 50 96 C 51 75, 51 62, 50 50",
        ].map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="rgba(180,220,255,0.25)"
            strokeLinecap="round"
            strokeWidth="0.7"
            filter="url(#tokenLightPathGlow)"
          />
        ))}

        {[
          { x: 5, y: 18 },
          { x: 95, y: 18 },
          { x: 5, y: 83 },
          { x: 95, y: 83 },
          { x: 50, y: 4 },
          { x: 50, y: 96 },
          { x: 50, y: 50 },
        ].map((node, i) => (
          <circle
            key={i}
            cx={node.x}
            cy={node.y}
            fill="rgba(255,255,255,0.85)"
            r={i === 6 ? 2.2 : 1.25}
          />
        ))}
      </svg>

      <div className="absolute left-1/2 top-[48%] z-10 flex h-[178px] w-[178px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[42px] border border-white/15 bg-[linear-gradient(180deg,rgba(15,24,46,0.98),rgba(4,8,18,0.99))] shadow-[0_0_65px_rgba(120,180,255,0.22)] ai-core">
        <div className="absolute inset-[10px] rounded-[32px] border border-[#9fc6ff]/15 shadow-[inset_0_0_32px_rgba(130,180,255,0.12)]" />
        <div className="absolute inset-[-16px] rounded-[54px] border border-[#7CFF6A]/10 ai-center-ring" />

        <div className="relative text-center">
          <div
            className="text-[68px] font-black tracking-[0.12em] text-white"
            style={{
              textShadow:
                "0 0 12px rgba(255,255,255,0.78), 0 0 36px rgba(130,180,255,0.34)",
            }}
          >
            AI
          </div>

          <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/65">
            Token Engine
          </div>
        </div>
      </div>

      <div className="absolute left-[7%] top-[16%] rounded-2xl border border-white/10 bg-black/35 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.35)] ai-float-slow">
        <div className="text-xs font-black uppercase tracking-[0.22em] text-[#c4ffbc]">
          Input
        </div>
        <div className="mt-2 text-lg font-black text-white">Idea Scan</div>
        <div className="mt-3 h-1.5 w-40 rounded-full bg-white/10">
          <div className="h-full w-4/5 rounded-full bg-[#7CFF6A]" />
        </div>
      </div>

      <div className="absolute right-[7%] top-[18%] rounded-2xl border border-white/10 bg-black/35 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.35)] ai-float">
        <div className="text-xs font-black uppercase tracking-[0.22em] text-blue-200">
          Output
        </div>
        <div className="mt-2 text-lg font-black text-white">KRX Deploy</div>
        <div className="mt-3 h-1.5 w-40 rounded-full bg-white/10">
          <div className="h-full w-3/4 rounded-full bg-blue-400" />
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 z-10 w-[88%] -translate-x-1/2 rounded-[26px] border border-white/10 bg-black/38 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.34)]">
        <div className="grid grid-cols-3 gap-3">
          {["Input", "Reasoning", "Deploy"].map((label, index) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/[0.035] p-3"
            >
              <div className="text-xs font-black uppercase tracking-[0.18em] text-white/58">
                {label}
              </div>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                <span
                  className="block h-full rounded-full bg-[#7CFF6A]"
                  style={{ width: `${62 + index * 12}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes edgeLeft {
          0% {
            left: -8%;
            top: 50%;
            opacity: 0;
            transform: translateY(-50%) scale(0.7);
          }
          16% {
            opacity: 1;
          }
          70% {
            left: 50%;
            top: 50%;
            opacity: 0.85;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            left: 50%;
            top: 50%;
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.35);
          }
        }

        @keyframes edgeRight {
          0% {
            right: -8%;
            top: 50%;
            opacity: 0;
            transform: translateY(-50%) scale(0.7);
          }
          16% {
            opacity: 1;
          }
          70% {
            right: 50%;
            top: 50%;
            opacity: 0.85;
            transform: translate(50%, -50%) scale(1);
          }
          100% {
            right: 50%;
            top: 50%;
            opacity: 0;
            transform: translate(50%, -50%) scale(0.35);
          }
        }

        @keyframes edgeTop {
          0% {
            left: 50%;
            top: -8%;
            opacity: 0;
            transform: translateX(-50%) scale(0.7);
          }
          16% {
            opacity: 1;
          }
          70% {
            left: 50%;
            top: 50%;
            opacity: 0.85;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            left: 50%;
            top: 50%;
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.35);
          }
        }

        @keyframes edgeBottom {
          0% {
            left: 50%;
            bottom: -8%;
            opacity: 0;
            transform: translateX(-50%) scale(0.7);
          }
          16% {
            opacity: 1;
          }
          70% {
            left: 50%;
            bottom: 50%;
            opacity: 0.85;
            transform: translate(-50%, 50%) scale(1);
          }
          100% {
            left: 50%;
            bottom: 50%;
            opacity: 0;
            transform: translate(-50%, 50%) scale(0.35);
          }
        }

        @keyframes corePulse {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
            box-shadow: 0 0 65px rgba(120, 180, 255, 0.22);
          }
          50% {
            transform: translate(-50%, -51.5%) scale(1.025);
            box-shadow: 0 0 84px rgba(124, 255, 106, 0.16);
          }
        }

        @keyframes ringPulse {
          0%,
          100% {
            opacity: 0.25;
            transform: scale(0.96);
          }
          50% {
            opacity: 0.65;
            transform: scale(1.04);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes floatSlow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(8px);
          }
        }

        .edge-pulse {
          position: absolute;
          z-index: 8;
          width: 18px;
          height: 18px;
          border-radius: 999px;
          background: #7cff6a;
          box-shadow:
            0 0 18px rgba(124, 255, 106, 0.62),
            0 0 42px rgba(70, 150, 255, 0.28);
          will-change: transform, opacity, left, right, top, bottom;
        }

        .edge-left {
          animation: edgeLeft 4.2s ease-in-out infinite;
        }

        .edge-right {
          animation: edgeRight 4.2s ease-in-out infinite;
          animation-delay: 0.35s;
        }

        .edge-top {
          animation: edgeTop 4.2s ease-in-out infinite;
          animation-delay: 0.7s;
        }

        .edge-bottom {
          animation: edgeBottom 4.2s ease-in-out infinite;
          animation-delay: 1.05s;
        }

        .ai-core {
          animation: corePulse 5.8s ease-in-out infinite;
          will-change: transform;
        }

        .ai-center-ring {
          animation: ringPulse 3.6s ease-in-out infinite;
        }

        .ai-float {
          animation: float 6s ease-in-out infinite;
        }

        .ai-float-slow {
          animation: floatSlow 7.5s ease-in-out infinite;
        }

        @media (max-width: 640px) {
          .edge-pulse {
            width: 12px;
            height: 12px;
          }
        }
      `}</style>
    </div>
  );
}

export default function AIPage() {
  const router = useRouter();

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
    initialSupply: "100000000",
    maxSupply: "100000000",
    mintable: false,
    burnable: true,
    stakingEnabled: true,
    stakingRewardsAllocation: "20000000",
    metadataURI: "",
  });

  const [stakingPlans, setStakingPlans] = useState<StakingPlanForm[]>([
    { durationDays: "30", rewardBps: "750" },
    { durationDays: "90", rewardBps: "2250" },
    { durationDays: "180", rewardBps: "4500" },
    { durationDays: "365", rewardBps: "9000" },
  ]);

  const [visualForm, setVisualForm] = useState({
    imageType: "Project Poster",
    visualStyle: "Futuristic Web3",
    colors: "black, deep blue, neon green, silver",
    mood: "premium, futuristic, serious, launch-ready",
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
    tokensPerProject: "1,500",
    requiredRewardBps: 9000,
    totalSlots: 0,
    usedSlots: 0,
    availableSlots: 0,
    hasAccess: false,
    registeredProjects: 0,
    error: "",
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function saveProjectForWebsiteBuilder(deployed: DeployResult) {
    const deployedProjectData = {
      projectId: deployed.projectId,

      projectName: form.projectName.trim(),
      symbol: form.symbol.trim().toUpperCase(),
      category: form.category || "Web3",
      shortDescription: form.shortDescription,
      targetAudience: form.targetAudience,
      network: form.network || "BNB Chain",

      tokenAddress: deployed.token,
      vaultAddress: deployed.vault,
      stakingAddress: deployed.staking,

      tokenomics: result ? JSON.stringify(result.tokenomicsPreview) : "",
      presaleStages: result ? JSON.stringify(result.launchPlan) : "",
      stakingPlans: JSON.stringify(stakingPlans),
      roadmap: result ? JSON.stringify(result.roadmap) : "",

      goal: form.goal,
      problemSolved: form.problemSolved,
      userCareReason: form.userCareReason,
      competitiveEdge: form.competitiveEdge,
      tokenUtilityReason: form.tokenUtilityReason,
      holdReason: form.holdReason,
      growthLogic: form.growthLogic,
      revenueLogic: form.revenueLogic,
      failureRisk: form.failureRisk,

      projectSummary: result?.projectSummary || "",
      projectVerdict: result?.projectVerdict || "",
      brandAngle: result?.brandAngle || "",
      pitch: result?.pitch || "",

      txHash: deployed.txHash,

      websiteStyle: "KORAX Beast v4",
      primaryColor: "#0B5FFF",
      secondaryColor: "#7CFF6A",
      backgroundStyle:
        "Deep dark blue-black futuristic command center with premium Web3 glow",
    };

    window.localStorage.setItem(
      "korax_last_project",
      JSON.stringify(deployedProjectData)
    );
  }

  function continueToWebsiteBuilder() {
    if (deployResult) {
      saveProjectForWebsiteBuilder(deployResult);
    }

    router.push(WEBSITE_BUILDER_ROUTE);
  }

  async function downloadCryptoProjectPackage() {
    if (!deployResult) {
      setDeployError("Deploy the project first.");
      return;
    }

    try {
      const zip = new JSZip();

      const projectName = form.projectName.trim() || "KORAX Project";
      const symbol = form.symbol.trim().toUpperCase() || "TKN";
      const folderName = cleanFileName(`${projectName}-${symbol}`);

      const projectInfo = {
        projectName,
        symbol,
        category: form.category,
        shortDescription: form.shortDescription,
        targetAudience: form.targetAudience,
        network: form.network,
        ownerWallet: address || "",
        createdAt: new Date().toISOString(),
        txHash: deployResult.txHash,
        projectId: deployResult.projectId,
      };

      const addresses = {
        token: deployResult.token,
        vault: deployResult.vault,
        staking:
          deployResult.staking === ethers.ZeroAddress
            ? "Not deployed"
            : deployResult.staking,
      };

      const stakingPlansExport = stakingPlans.map((plan, index) => ({
        planId: index,
        durationDays: plan.durationDays,
        rewardBps: plan.rewardBps,
        rewardPercent: Number(plan.rewardBps || "0") / 100,
      }));

      const tokenSettings = {
        initialSupply: deployForm.initialSupply,
        maxSupply: deployForm.maxSupply,
        mintable: deployForm.mintable,
        burnable: deployForm.burnable,
        stakingEnabled: deployForm.stakingEnabled,
        stakingRewardsAllocation: deployForm.stakingRewardsAllocation,
        metadataURI: deployForm.metadataURI,
      };

      const aiDraft = result
        ? {
            projectSummary: result.projectSummary,
            projectVerdict: result.projectVerdict,
            brandAngle: result.brandAngle,
            originalityScore: result.originalityScore,
            utilityStrengthScore: result.utilityStrengthScore,
            marketFitScore: result.marketFitScore,
            coreUtility: result.coreUtility,
            differentiation: result.differentiation,
            tokenomicsPreview: result.tokenomicsPreview,
            launchPlan: result.launchPlan,
            roadmap: result.roadmap,
            weakPoints: result.weakPoints,
            risks: result.risks,
            improvementActions: result.improvementActions,
            pitch: result.pitch,
            koraxConversionNote: result.koraxConversionNote,
          }
        : null;

      const readme = `# ${projectName} (${symbol})

Generated by KORAX Token Builder AI.

## Project

- Name: ${projectName}
- Symbol: ${symbol}
- Category: ${form.category}
- Network: ${form.network}
- Owner Wallet: ${address || "Not available"}

## Deployed Contracts

- Token: ${deployResult.token}
- Vault: ${deployResult.vault}
- Staking: ${
        deployResult.staking === ethers.ZeroAddress
          ? "Not deployed"
          : deployResult.staking
      }

## Transaction

${deployResult.txHash}

## Token Settings

- Initial Supply: ${deployForm.initialSupply}
- Max Supply: ${deployForm.maxSupply}
- Mintable: ${deployForm.mintable ? "Yes" : "No"}
- Burnable: ${deployForm.burnable ? "Yes" : "No"}
- Staking Enabled: ${deployForm.stakingEnabled ? "Yes" : "No"}
- Staking Rewards Allocation: ${deployForm.stakingRewardsAllocation}

## Staking Plans

${stakingPlansExport
  .map(
    (plan) =>
      `- Plan ${plan.planId}: ${plan.durationDays} days / ${plan.rewardPercent}% reward`
  )
  .join("\n")}

## AI Summary

${result?.projectSummary || "No AI draft summary available."}

## Notes

This package contains deployed contract addresses, project settings, staking configuration, and AI-generated project strategy.

For security:
- Verify contracts on BscScan.
- Review all settings before public launch.
- Keep owner wallet and deployment wallet secure.
- This package is informational and does not replace a security audit.
`;

      zip.file(`${folderName}/README.md`, readme);

      zip.file(
        `${folderName}/project-info.json`,
        JSON.stringify(projectInfo, null, 2)
      );

      zip.file(
        `${folderName}/contracts/addresses.json`,
        JSON.stringify(addresses, null, 2)
      );

      zip.file(
        `${folderName}/contracts/README.md`,
        `# Contracts

Token: ${deployResult.token}
Vault: ${deployResult.vault}
Staking: ${
          deployResult.staking === ethers.ZeroAddress
            ? "Not deployed"
            : deployResult.staking
        }

These contracts were deployed through KORAX Token Builder AI.
`
      );

      zip.file(
        `${folderName}/token/token-settings.json`,
        JSON.stringify(tokenSettings, null, 2)
      );

      zip.file(
        `${folderName}/staking/staking-plans.json`,
        JSON.stringify(stakingPlansExport, null, 2)
      );

      zip.file(
        `${folderName}/ai/ai-draft.json`,
        JSON.stringify(aiDraft, null, 2)
      );

      zip.file(
        `${folderName}/launch/launch-plan.json`,
        JSON.stringify(result?.launchPlan || {}, null, 2)
      );

      zip.file(
        `${folderName}/roadmap/roadmap.json`,
        JSON.stringify(result?.roadmap || [], null, 2)
      );

      const blob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
          level: 6,
        },
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${folderName}-crypto-project.zip`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setDeployError(err?.message || "Failed to download project package.");
    }
  }

  async function loadAccessData(user?: string) {
    if (!user) {
      setAccess({
        loading: false,
        connected: false,
        wallet: "",
        eligibleAmount: "0",
        tokensPerProject: "1,500",
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
        tokensPerProject: prev.tokensPerProject || "1,500",
        error:
          err?.shortMessage || err?.message || "Failed to load access data",
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
    if (loading) return;

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
    if (visualLoading) return;

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

  function addStakingPlan() {
    setStakingPlans((prev) => {
      if (prev.length >= 10) return prev;
      return [...prev, { durationDays: "30", rewardBps: "500" }];
    });
  }

  function removeStakingPlan(index: number) {
    setStakingPlans((prev) => prev.filter((_, i) => i !== index));
  }

  function updateStakingPlan(
    index: number,
    key: keyof StakingPlanForm,
    value: string
  ) {
    setStakingPlans((prev) =>
      prev.map((plan, i) => (i === index ? { ...plan, [key]: value } : plan))
    );
  }

  async function deployAIProject() {
    if (deployingProject) return;

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

      const initialSupply = ethers.parseUnits(
        deployForm.initialSupply || "0",
        18
      );

      const maxSupply = ethers.parseUnits(deployForm.maxSupply || "0", 18);

      const stakingRewardsAllocation = deployForm.stakingEnabled
        ? ethers.parseUnits(deployForm.stakingRewardsAllocation || "0", 18)
        : 0n;

      if (initialSupply <= 0n) {
        throw new Error("Initial supply must be greater than 0.");
      }

      if (maxSupply < initialSupply) {
        throw new Error("Max supply cannot be lower than initial supply.");
      }

      if (!deployForm.mintable && maxSupply !== initialSupply) {
        throw new Error(
          "Fixed-supply tokens must have max supply equal to initial supply."
        );
      }

      if (deployForm.stakingEnabled && stakingRewardsAllocation <= 0n) {
        throw new Error("Staking rewards allocation must be greater than 0.");
      }

      if (stakingRewardsAllocation > initialSupply) {
        throw new Error(
          "Staking rewards allocation cannot exceed initial supply."
        );
      }

      const cleanPlans = deployForm.stakingEnabled
        ? stakingPlans.map((plan) => ({
            durationDays: BigInt(plan.durationDays || "0"),
            rewardBps: BigInt(plan.rewardBps || "0"),
          }))
        : [];

      if (deployForm.stakingEnabled) {
        if (cleanPlans.length === 0) {
          throw new Error("At least one staking plan is required.");
        }

        if (cleanPlans.length > 10) {
          throw new Error("Maximum 10 staking plans allowed.");
        }

        for (const plan of cleanPlans) {
          if (plan.durationDays <= 0n) {
            throw new Error(
              "Each staking plan must have duration greater than 0."
            );
          }

          if (plan.rewardBps <= 0n) {
            throw new Error(
              "Each staking plan must have reward BPS greater than 0."
            );
          }

          if (plan.rewardBps > 10000n) {
            throw new Error("Reward BPS cannot exceed 10000.");
          }
        }
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
        token: {
          name: form.projectName.trim(),
          symbol: form.symbol.trim().toUpperCase(),
          initialSupply,
          maxSupply,
          mintable: deployForm.mintable,
          burnable: deployForm.burnable,
        },
        stakingEnabled: deployForm.stakingEnabled,
        stakingRewardsAllocation,
        metadataURI,
        stakingPlans: cleanPlans,
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

      const deployed: DeployResult = {
        projectId: parsedEvent.args.projectId.toString(),
        token: parsedEvent.args.token,
        vault: parsedEvent.args.vault,
        staking: parsedEvent.args.staking,
        txHash: receipt.hash,
      };

      saveProjectForWebsiteBuilder(deployed);
      setDeployResult(deployed);

      await loadAccessData(address);
    } catch (err: any) {
      setDeployError(err?.shortMessage || err?.message || "Deployment failed.");
    } finally {
      setDeployingProject(false);
    }
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
      <section className="relative overflow-hidden rounded-[34px] border border-white/10 bg-black/35 p-5 shadow-[0_30px_120px_rgba(0,0,0,0.55)] backdrop-blur-xl md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,255,106,0.14),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(30,90,180,0.18),transparent_35%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:52px_52px]" />

        <div className="relative grid gap-8 xl:grid-cols-[1fr_470px] xl:items-center">
          <div className="max-w-5xl">
            <div className="inline-flex rounded-full border border-[#7CFF6A]/20 bg-[#7CFF6A]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#c4ffbc]">
              KORAX Token Builder AI / Command Mode
            </div>

            <h1 className="mt-6 text-4xl font-black leading-[0.96] tracking-tight text-white sm:text-6xl xl:text-7xl">
              Turn an idea into a
              <span className="block text-[#7CFF6A]">
                serious Web3 launch system.
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-white/68 sm:text-lg">
              KORAX AI helps builders shape project strategy, tokenomics,
              staking logic, launch direction, risk analysis, AI visuals, and
              on-chain deployment through a connected builder workflow.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatusPill active>AI Draft</StatusPill>
              <StatusPill active={Boolean(visualImageSrc)}>AI Visual</StatusPill>
              <StatusPill active={access.hasAccess}>1500 KRX Gate</StatusPill>
              <StatusPill active={Boolean(deployResult)}>On-chain Ready</StatusPill>
            </div>
          </div>

          <AIEngineVisual />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_430px]">
        <SectionCard
          eyebrow="Builder Input"
          title="Describe your project"
          right={<StatusPill active>AI Strategy Engine</StatusPill>}
        >
          <div className="mt-6 grid gap-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Project Name">
                <input
                  value={form.projectName}
                  onChange={(e) => update("projectName", e.target.value)}
                  placeholder="Project Name"
                  className={inputClass}
                />
              </Field>

              <Field label="Token Symbol">
                <input
                  value={form.symbol}
                  onChange={(e) => update("symbol", e.target.value)}
                  placeholder="Token Symbol"
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Category">
                <select
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                  className={selectClass}
                >
                  <option>AI</option>
                  <option>Launchpad</option>
                  <option>Meme</option>
                  <option>Utility</option>
                  <option>Gaming</option>
                  <option>DeFi</option>
                  <option>Community</option>
                </select>
              </Field>

              <Field label="Network">
                <select
                  value={form.network}
                  onChange={(e) => update("network", e.target.value)}
                  className={selectClass}
                >
                  <option value="BNB Chain">BNB Chain</option>
                  <option value="Solana — Planned for Future">
                    Solana — Planned for Future
                  </option>
                </select>
              </Field>
            </div>

            <Field label="Short Description">
              <textarea
                value={form.shortDescription}
                onChange={(e) => update("shortDescription", e.target.value)}
                placeholder="Short Description"
                rows={4}
                className={inputClass}
              />
            </Field>

            <Field label="Target Audience">
              <input
                value={form.targetAudience}
                onChange={(e) => update("targetAudience", e.target.value)}
                placeholder="Target Audience"
                className={inputClass}
              />
            </Field>

            <Field label="Brand Style">
              <select
                value={form.style}
                onChange={(e) => update("style", e.target.value)}
                className={selectClass}
              >
                <option>Professional</option>
                <option>Aggressive Growth</option>
                <option>Community First</option>
                <option>Premium Brand</option>
                <option>Meme Energy</option>
              </select>
            </Field>

            <div className="rounded-[26px] border border-white/10 bg-black/25 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-black text-white">
                    Project Intelligence Questions
                  </div>
                  <p className="mt-1 text-xs leading-6 text-white/50">
                    Strong answers create stronger AI strategy, tokenomics, and
                    launch direction.
                  </p>
                </div>

                <StatusPill active>9 Signals</StatusPill>
              </div>

              <div className="mt-5 grid gap-4">
                {projectFields.map(([key, placeholder]) => (
                  <textarea
                    key={key}
                    value={form[key] as string}
                    onChange={(e) => update(key, e.target.value as any)}
                    placeholder={placeholder}
                    rows={3}
                    className={inputClass}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/80">
                <input
                  type="checkbox"
                  checked={form.presale}
                  onChange={(e) => update("presale", e.target.checked)}
                />
                Launchpad
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/80">
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

              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/80">
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
              className="rounded-2xl bg-[#7CFF6A] px-6 py-4 font-black text-black shadow-[0_0_32px_rgba(124,255,106,0.18)] transition hover:scale-[1.01] hover:bg-[#a6ff90] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Generating AI Draft... please wait"
                : "Generate AI Draft"}
            </button>

            {error ? (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            ) : null}
          </div>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard
            eyebrow="Access"
            title="KORAX Builder Package"
            right={
              <StatusPill active={access.hasAccess}>
                {access.hasAccess ? "Unlocked" : "Locked"}
              </StatusPill>
            }
          >
            <div className="mt-4 rounded-2xl border border-[#7CFF6A]/20 bg-[#7CFF6A]/10 p-4 text-sm leading-7 text-white/75">
              To unlock the KORAX Builder Package, users need to stake{" "}
              <span className="font-black text-white">
                {access.tokensPerProject} KRX
              </span>{" "}
              on the{" "}
              <span className="font-black text-white">12-month staking plan</span>.
              This package unlocks Token Builder AI, Website Builder AI, and
              launch creation tools for one project.
            </div>

            {!access.connected ? (
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-white/65">
                Connect your wallet to view your KORAX access, eligible staking
                amount, and available project slots.
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
              <div className="mt-4 grid gap-3">
                <InfoCard label="Wallet" value={shortAddress(access.wallet)} />

                <div className="grid grid-cols-2 gap-3">
                  <MetricCard
                    label="Eligible Staked"
                    value={`${access.eligibleAmount} KRX`}
                    active={access.hasAccess}
                  />
                  <MetricCard
                    label="Tokens Per Project"
                    value={`${access.tokensPerProject} KRX`}
                  />
                  <MetricCard label="Required Plan" value="12 Months" />
                  <MetricCard
                    label="Reward BPS"
                    value={access.requiredRewardBps}
                  />
                  <MetricCard
                    label="Access Status"
                    value={access.hasAccess ? "Unlocked" : "Locked"}
                    active={access.hasAccess}
                  />
                  <MetricCard
                    label="Available Slots"
                    value={access.availableSlots}
                    active={access.availableSlots > 0}
                  />
                </div>
              </div>
            )}
          </SectionCard>

          <SectionCard eyebrow="Free Draft" title="KORAX AI Intelligence">
            <p className="mt-3 text-sm leading-7 text-white/60">
              The free draft helps users understand whether their idea is strong,
              weak, fixable, or worth converting into a real on-chain project.
            </p>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-5">
              <div className="text-sm font-black text-white">
                What the AI checks
              </div>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-white/65">
                {freeFeatures.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </SectionCard>

          <SectionCard eyebrow="Visual AI" title="AI Project Visual">
            <p className="mt-3 text-sm leading-7 text-white/60">
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
                className={selectClass}
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
                className={selectClass}
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
                  setVisualForm((prev) => ({
                    ...prev,
                    colors: e.target.value,
                  }))
                }
                placeholder="Preferred colors"
                className={inputClass}
              />

              <input
                value={visualForm.mood}
                onChange={(e) =>
                  setVisualForm((prev) => ({ ...prev, mood: e.target.value }))
                }
                placeholder="Mood"
                className={inputClass}
              />

              <button
                type="button"
                onClick={generateVisual}
                disabled={visualLoading}
                className="rounded-2xl bg-[#7CFF6A] px-5 py-3 font-black text-black transition hover:bg-[#a6ff90] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {visualLoading
                  ? "Generating Visual... please wait"
                  : "Generate Project Visual"}
              </button>

              {visualError ? (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
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
                      {visualLoading
                        ? "Generating..."
                        : "Generate Another Visual"}
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

                  <div className="mt-3 inline-flex rounded-full border border-[#7CFF6A]/20 bg-[#7CFF6A]/10 px-3 py-1 text-xs font-semibold text-[#c4ffbc]">
                    Generated by KORAX AI
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
          <SectionCard eyebrow="AI Draft Result" title="Project intelligence generated">
            <p className="mt-3 text-sm leading-7 text-white/60">
              This draft was generated by KORAX AI and refined for stronger
              positioning, launch logic, risk analysis, and builder clarity.
            </p>
          </SectionCard>

          <SectionCard eyebrow="Next Step" title="Move from idea to on-chain project">
            <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-sm leading-7 text-white/60">
                Your AI draft is ready. You can now deploy the project on-chain
                through KORAX AI when your wallet has an available project slot.
              </p>

              {canContinueToCreation ? (
                <button
                  type="button"
                  onClick={() => setShowCreationStep((prev) => !prev)}
                  className="rounded-2xl bg-[#7CFF6A] px-5 py-3 font-black text-black transition hover:bg-[#a6ff90]"
                >
                  {showCreationStep
                    ? "Hide Project Creation"
                    : "Continue to Project Creation"}
                </button>
              ) : needsUnlock ? (
                <div className="rounded-2xl border border-[#7CFF6A]/20 bg-[#7CFF6A]/10 px-4 py-3 text-sm text-white/75">
                  Unlock the Builder Package with{" "}
                  <span className="font-black text-white">
                    {access.tokensPerProject} KRX
                  </span>{" "}
                  on the 12-month staking plan.
                </div>
              ) : null}
            </div>
          </SectionCard>

          {showCreationStep && finalProjectPreview ? (
            <section className="space-y-6 rounded-[30px] border border-[#7CFF6A]/20 bg-[#7CFF6A]/10 p-5 shadow-[0_22px_90px_rgba(0,0,0,0.42)] md:p-6">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[#c4ffbc]">
                  Project Creation Preview
                </p>
                <h3 className="mt-2 text-3xl font-black text-white">
                  Review before on-chain deployment
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/75">
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
                  <p className="mt-3 text-sm leading-7 text-white/70">
                    {finalProjectPreview.summary}
                  </p>
                </SectionCard>

                <SectionCard title="Pitch">
                  <p className="mt-3 text-sm leading-7 text-white/70">
                    {finalProjectPreview.pitch}
                  </p>
                </SectionCard>
              </div>

              <SectionCard title="Flexible Token Settings">
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <Field label="Initial Supply">
                    <input
                      value={deployForm.initialSupply}
                      onChange={(e) =>
                        setDeployForm((prev) => ({
                          ...prev,
                          initialSupply: e.target.value,
                          maxSupply: prev.mintable
                            ? prev.maxSupply
                            : e.target.value,
                        }))
                      }
                      placeholder="100000000"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Max Supply">
                    <input
                      value={deployForm.maxSupply}
                      onChange={(e) =>
                        setDeployForm((prev) => ({
                          ...prev,
                          maxSupply: e.target.value,
                        }))
                      }
                      placeholder="100000000"
                      disabled={!deployForm.mintable}
                      className={`${inputClass} disabled:opacity-50`}
                    />
                  </Field>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/80">
                    <input
                      type="checkbox"
                      checked={deployForm.mintable}
                      onChange={(e) =>
                        setDeployForm((prev) => ({
                          ...prev,
                          mintable: e.target.checked,
                          maxSupply: e.target.checked
                            ? prev.maxSupply
                            : prev.initialSupply,
                        }))
                      }
                    />
                    Mintable token
                  </label>

                  <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/80">
                    <input
                      type="checkbox"
                      checked={deployForm.burnable}
                      onChange={(e) =>
                        setDeployForm((prev) => ({
                          ...prev,
                          burnable: e.target.checked,
                        }))
                      }
                    />
                    Burnable token
                  </label>
                </div>

                <p className="mt-4 text-sm leading-7 text-white/55">
                  If minting is disabled, max supply must equal initial supply.
                  If minting is enabled, the project owner can mint later up to
                  the max supply limit.
                </p>
              </SectionCard>

              <SectionCard title="Flexible Staking Settings">
                <label className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/80">
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
                  <Field label="Staking Rewards Allocation">
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
                      className={`${inputClass} disabled:opacity-50`}
                    />
                  </Field>
                </div>

                {deployForm.stakingEnabled ? (
                  <div className="mt-5 space-y-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="font-black text-white">
                          Staking Plans
                        </div>
                        <p className="mt-1 text-xs text-white/50">
                          Add from 1 to 10 custom staking plans. Reward BPS:
                          10000 = 100%.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={addStakingPlan}
                        disabled={stakingPlans.length >= 10}
                        className="rounded-xl border border-[#7CFF6A]/20 bg-[#7CFF6A]/10 px-4 py-2 text-sm font-semibold text-[#c4ffbc] disabled:opacity-50"
                      >
                        Add Plan
                      </button>
                    </div>

                    {stakingPlans.map((plan, index) => (
                      <div
                        key={index}
                        className="grid gap-3 rounded-2xl border border-white/10 bg-black/25 p-4 md:grid-cols-[1fr_1fr_auto]"
                      >
                        <input
                          value={plan.durationDays}
                          onChange={(e) =>
                            updateStakingPlan(
                              index,
                              "durationDays",
                              e.target.value
                            )
                          }
                          placeholder="Duration days"
                          className={inputClass}
                        />

                        <input
                          value={plan.rewardBps}
                          onChange={(e) =>
                            updateStakingPlan(index, "rewardBps", e.target.value)
                          }
                          placeholder="Reward BPS"
                          className={inputClass}
                        />

                        <button
                          type="button"
                          onClick={() => removeStakingPlan(index)}
                          disabled={stakingPlans.length <= 1}
                          className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-100 disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </SectionCard>

              <SectionCard title="Metadata URI / Project Reference">
                <input
                  value={deployForm.metadataURI}
                  onChange={(e) =>
                    setDeployForm((prev) => ({
                      ...prev,
                      metadataURI: e.target.value,
                    }))
                  }
                  placeholder="Optional: IPFS / website / project reference"
                  className={`mt-4 ${inputClass}`}
                />

                <p className="mt-4 text-sm leading-7 text-white/55">
                  The staking rewards allocation will be sent automatically to
                  the project vault. The remaining initial supply will be sent to
                  your wallet.
                </p>
              </SectionCard>

              <SectionCard title="Project Slot Status">
                <p className="mt-3 text-sm leading-7 text-white/70">
                  Available Slots:{" "}
                  <span className="font-black text-white">
                    {access.availableSlots}
                  </span>
                </p>
                <p className="mt-2 text-sm leading-7 text-white/60">
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
                    className="rounded-2xl bg-[#7CFF6A] px-5 py-3 font-black text-black transition hover:bg-[#a6ff90] disabled:opacity-50"
                  >
                    {deployingProject
                      ? "Deploying Project... please wait"
                      : "Deploy AI Project On-chain"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCreationStep(false)}
                    className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white"
                  >
                    Back
                  </button>
                </div>

                {deployError ? (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {deployError}
                  </div>
                ) : null}

                {deployResult ? (
                  <div className="rounded-2xl border border-[#7CFF6A]/20 bg-black/35 p-5">
                    <div className="text-lg font-black text-[#c4ffbc]">
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

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={downloadCryptoProjectPackage}
                        className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-bold text-white transition hover:bg-white/10"
                      >
                        Download Crypto Project Package
                      </button>

                      <button
                        type="button"
                        onClick={continueToWebsiteBuilder}
                        className="rounded-xl bg-[#7CFF6A] px-5 py-3 font-bold text-black transition hover:bg-[#a6ff90]"
                      >
                        Continue to Website Builder AI
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          saveProjectForWebsiteBuilder(deployResult);
                          router.push(WEBSITE_BUILDER_ROUTE);
                        }}
                        className="rounded-xl border border-[#7CFF6A]/30 bg-[#7CFF6A]/10 px-5 py-3 font-bold text-[#c4ffbc] transition hover:bg-[#7CFF6A]/20"
                      >
                        Reload Data & Continue
                      </button>
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
              <p className="mt-3 leading-7 text-white/70">
                {result.projectSummary}
              </p>

              <h3 className="mt-6 text-lg font-black text-white">Brand Angle</h3>
              <p className="mt-3 leading-7 text-white/70">
                {result.brandAngle}
              </p>

              <h3 className="mt-6 text-lg font-black text-white">Pitch</h3>
              <p className="mt-3 leading-7 text-white/70">{result.pitch}</p>
            </SectionCard>

            <SectionCard title="Core Utility">
              <ul className="mt-3 space-y-2 text-white/70">
                {result.coreUtility.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>

              <h3 className="mt-6 text-lg font-black text-white">
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
                  <span className="font-black text-white">Supply:</span>{" "}
                  {result.tokenomicsPreview.totalSupplySuggestion}
                </div>
                <div>
                  <span className="font-black text-white">Launchpad:</span>{" "}
                  {result.tokenomicsPreview.presaleAllocationSuggestion}
                </div>
                <div>
                  <span className="font-black text-white">Staking:</span>{" "}
                  {result.tokenomicsPreview.stakingAllocationSuggestion}
                </div>
                <div>
                  <span className="font-black text-white">Treasury:</span>{" "}
                  {result.tokenomicsPreview.treasuryAllocationSuggestion}
                </div>
                <div>
                  <span className="font-black text-white">Liquidity:</span>{" "}
                  {result.tokenomicsPreview.liquidityAllocationSuggestion}
                </div>
                <div>
                  <span className="font-black text-white">Notes:</span>{" "}
                  {result.tokenomicsPreview.notes}
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Launch Plan">
              <div className="mt-4 space-y-3 text-sm text-white/70">
                <div>
                  <span className="font-black text-white">
                    Launch Recommended:
                  </span>{" "}
                  {result.launchPlan.presaleRecommended}
                </div>
                <div>
                  <span className="font-black text-white">
                    Suggested Stages:
                  </span>{" "}
                  {result.launchPlan.suggestedStageCount}
                </div>
                <div>
                  <span className="font-black text-white">Funding Logic:</span>{" "}
                  {result.launchPlan.fundingLogic}
                </div>
                <div>
                  <span className="font-black text-white">Launch Notes:</span>{" "}
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
                  className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm leading-7 text-white/70"
                >
                  <div className="mb-2 font-black text-white">
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

          <section className="relative overflow-hidden rounded-[30px] border border-[#7CFF6A]/20 bg-[#7CFF6A]/10 p-5 md:p-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,255,106,0.10),transparent_36%)]" />

            <div className="relative">
              <h3 className="text-2xl font-black text-[#c4ffbc]">
                Next Step with KORAX
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/75">
                {result.koraxConversionNote}
              </p>
            </div>
          </section>
        </section>
      ) : null}
    </div>
  );
}