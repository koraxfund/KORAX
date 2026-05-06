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

type StakingPlanForm = {
  durationDays: string;
  rewardBps: string;
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

function AIEngineVisual() {
  const topSources = Array.from({ length: 14 }, (_, i) => ({
    side: "top" as const,
    x: 3 + i * 7.25,
    y: 3,
    delay: `${i * 0.075}s`,
  }));

  const bottomSources = Array.from({ length: 14 }, (_, i) => ({
    side: "bottom" as const,
    x: 3 + i * 7.25,
    y: 97,
    delay: `${1.05 + i * 0.075}s`,
  }));

  const leftSources = Array.from({ length: 14 }, (_, i) => ({
    side: "left" as const,
    x: 3,
    y: 5 + i * 6.9,
    delay: `${2.1 + i * 0.075}s`,
  }));

  const rightSources = Array.from({ length: 14 }, (_, i) => ({
    side: "right" as const,
    x: 97,
    y: 5 + i * 6.9,
    delay: `${3.15 + i * 0.075}s`,
  }));

  const sources = [
    ...topSources,
    ...bottomSources,
    ...leftSources,
    ...rightSources,
  ];

  function buildCurvePath(
    x: number,
    y: number,
    side: "top" | "bottom" | "left" | "right"
  ) {
    const cx = 50;
    const cy = 50;

    if (side === "top") {
      const c1x = x;
      const c1y = 16 + Math.abs(x - 50) * 0.03;
      const c2x = 50 + (x - 50) * 0.38;
      const c2y = 31 + Math.abs(x - 50) * 0.025;
      return `M ${x} ${y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${cx} ${cy}`;
    }

    if (side === "bottom") {
      const c1x = x;
      const c1y = 84 - Math.abs(x - 50) * 0.03;
      const c2x = 50 + (x - 50) * 0.38;
      const c2y = 69 - Math.abs(x - 50) * 0.025;
      return `M ${x} ${y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${cx} ${cy}`;
    }

    if (side === "left") {
      const c1x = 16 + Math.abs(y - 50) * 0.03;
      const c1y = y;
      const c2x = 31 + Math.abs(y - 50) * 0.025;
      const c2y = 50 + (y - 50) * 0.38;
      return `M ${x} ${y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${cx} ${cy}`;
    }

    const c1x = 84 - Math.abs(y - 50) * 0.03;
    const c1y = y;
    const c2x = 69 - Math.abs(y - 50) * 0.025;
    const c2y = 50 + (y - 50) * 0.38;
    return `M ${x} ${y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${cx} ${cy}`;
  }

  const mainPaths = sources.map((source, i) => ({
    ...source,
    d: buildCurvePath(source.x, source.y, source.side),
    delay: `${i * 0.075}s`,
  }));

  const relayPaths = [
    "M 13 17 C 20 18, 28 22, 36 30",
    "M 87 17 C 80 18, 72 22, 64 30",
    "M 13 83 C 20 82, 28 78, 36 70",
    "M 87 83 C 80 82, 72 78, 64 70",

    "M 16 30 C 24 34, 32 39, 40 46",
    "M 16 70 C 24 66, 32 61, 40 54",
    "M 84 30 C 76 34, 68 39, 60 46",
    "M 84 70 C 76 66, 68 61, 60 54",

    "M 25 18 C 32 24, 39 30, 45 39",
    "M 75 18 C 68 24, 61 30, 55 39",
    "M 25 82 C 32 76, 39 70, 45 61",
    "M 75 82 C 68 76, 61 70, 55 61",

    "M 23 50 C 31 47, 38 46, 45 48",
    "M 77 50 C 69 47, 62 46, 55 48",

    "M 36 14 C 41 23, 45 31, 47 40",
    "M 64 14 C 59 23, 55 31, 53 40",
    "M 36 86 C 41 77, 45 69, 47 60",
    "M 64 86 C 59 77, 55 69, 53 60",

    "M 10 42 C 22 43, 32 46, 43 49",
    "M 90 42 C 78 43, 68 46, 57 49",
    "M 10 58 C 22 57, 32 54, 43 51",
    "M 90 58 C 78 57, 68 54, 57 51",

    "M 44 8 C 46 20, 48 33, 50 50",
    "M 56 8 C 54 20, 52 33, 50 50",
    "M 44 92 C 46 80, 48 67, 50 50",
    "M 56 92 C 54 80, 52 67, 50 50",
  ].map((d, i) => ({
    d,
    delay: `${(i % 12) * 0.12}s`,
  }));

  const microBranches = [
    "M 20 18 L 20 12 L 15 12",
    "M 30 22 L 30 14 L 25 14",
    "M 40 28 L 40 18 L 35 18",
    "M 60 28 L 60 18 L 65 18",
    "M 70 22 L 70 14 L 75 14",
    "M 80 18 L 80 12 L 85 12",

    "M 20 82 L 20 88 L 15 88",
    "M 30 78 L 30 86 L 25 86",
    "M 40 72 L 40 82 L 35 82",
    "M 60 72 L 60 82 L 65 82",
    "M 70 78 L 70 86 L 75 86",
    "M 80 82 L 80 88 L 85 88",

    "M 18 32 L 12 32 L 12 27",
    "M 22 44 L 14 44 L 14 39",
    "M 22 56 L 14 56 L 14 61",
    "M 18 68 L 12 68 L 12 73",

    "M 82 32 L 88 32 L 88 27",
    "M 78 44 L 86 44 L 86 39",
    "M 78 56 L 86 56 L 86 61",
    "M 82 68 L 88 68 L 88 73",
  ];

  const nodes = [
    ...sources.map((s) => ({ x: s.x, y: s.y, size: 6.5 })),
    { x: 13, y: 17, size: 4 },
    { x: 25, y: 18, size: 4 },
    { x: 36, y: 14, size: 4 },
    { x: 44, y: 8, size: 4 },
    { x: 56, y: 8, size: 4 },
    { x: 64, y: 14, size: 4 },
    { x: 75, y: 18, size: 4 },
    { x: 87, y: 17, size: 4 },
    { x: 16, y: 30, size: 4 },
    { x: 23, y: 50, size: 4 },
    { x: 16, y: 70, size: 4 },
    { x: 84, y: 30, size: 4 },
    { x: 77, y: 50, size: 4 },
    { x: 84, y: 70, size: 4 },
    { x: 13, y: 83, size: 4 },
    { x: 25, y: 82, size: 4 },
    { x: 36, y: 86, size: 4 },
    { x: 44, y: 92, size: 4 },
    { x: 56, y: 92, size: 4 },
    { x: 64, y: 86, size: 4 },
    { x: 75, y: 82, size: 4 },
    { x: 87, y: 83, size: 4 },
    { x: 36, y: 30, size: 3.5 },
    { x: 64, y: 30, size: 3.5 },
    { x: 40, y: 46, size: 3.5 },
    { x: 60, y: 46, size: 3.5 },
    { x: 40, y: 54, size: 3.5 },
    { x: 60, y: 54, size: 3.5 },
    { x: 36, y: 70, size: 3.5 },
    { x: 64, y: 70, size: 3.5 },
  ];

  const rings = Array.from({ length: 14 }, (_, i) => ({
    inset: i * 8,
    opacity: Math.max(0.028, 0.15 - i * 0.008),
    duration: `${24 - i * 1.1}s`,
    reverse: i % 2 !== 0,
  }));

  const tinySparks = Array.from({ length: 38 }, (_, i) => ({
    left: `${5 + ((i * 19) % 90)}%`,
    top: `${8 + ((i * 23) % 84)}%`,
    delay: `${(i % 16) * 0.16}s`,
  }));

  return (
    <div className="relative min-h-[430px] overflow-hidden rounded-[34px] border border-white/10 bg-[#020816] shadow-[0_30px_140px_rgba(0,0,0,0.75)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_16%),radial-gradient(circle_at_center,rgba(110,170,255,0.13),transparent_32%),radial-gradient(circle_at_12%_16%,rgba(110,170,255,0.05),transparent_18%),radial-gradient(circle_at_88%_84%,rgba(110,170,255,0.05),transparent_18%)]" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:22px_22px]" />

      {tinySparks.map((spark, i) => (
        <span
          key={`spark-${i}`}
          className="absolute h-[2px] w-[2px] rounded-full bg-white"
          style={{
            left: spark.left,
            top: spark.top,
            boxShadow:
              "0 0 8px rgba(255,255,255,0.7), 0 0 16px rgba(110,170,255,0.35)",
            animation: "sparkle 2.4s ease-in-out infinite",
            animationDelay: spark.delay,
          }}
        />
      ))}

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="pathGlowUltraToken">
            <feGaussianBlur stdDeviation="0.72" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {microBranches.map((d, i) => (
          <path
            key={`branch-${i}`}
            d={d}
            fill="none"
            stroke="rgba(150,190,255,0.12)"
            strokeWidth="0.26"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {mainPaths.map((path, i) => (
          <g key={`main-${i}`}>
            <path
              d={path.d}
              fill="none"
              stroke="rgba(120,160,255,0.11)"
              strokeWidth="0.38"
              strokeLinecap="round"
            />
            <path
              d={path.d}
              fill="none"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="0.78"
              strokeLinecap="round"
              strokeDasharray="12 145"
              filter="url(#pathGlowUltraToken)"
              style={{
                animation: "pulseToCoreUltra 2.9s linear infinite",
                animationDelay: path.delay,
              }}
            />
            <path
              d={path.d}
              fill="none"
              stroke="rgba(130,180,255,0.28)"
              strokeWidth="0.54"
              strokeLinecap="round"
              strokeDasharray="20 145"
              filter="url(#pathGlowUltraToken)"
              style={{
                animation: "trailToCoreUltra 2.9s linear infinite",
                animationDelay: path.delay,
              }}
            />
          </g>
        ))}

        {relayPaths.map((path, i) => (
          <g key={`relay-${i}`}>
            <path
              d={path.d}
              fill="none"
              stroke="rgba(110,160,255,0.09)"
              strokeWidth="0.32"
              strokeLinecap="round"
            />
            <path
              d={path.d}
              fill="none"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth="0.42"
              strokeLinecap="round"
              strokeDasharray="8 70"
              filter="url(#pathGlowUltraToken)"
              style={{
                animation: "relayPulseUltra 2.35s linear infinite",
                animationDelay: path.delay,
              }}
            />
          </g>
        ))}
      </svg>

      {nodes.map((node, i) => (
        <span
          key={`node-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            width: `${node.size}px`,
            height: `${node.size}px`,
            transform: "translate(-50%, -50%)",
            background: "rgba(255,255,255,0.95)",
            boxShadow:
              "0 0 10px rgba(255,255,255,0.70), 0 0 20px rgba(120,170,255,0.25)",
            animation: "nodeBlinkUltra 2.5s ease-in-out infinite",
            animationDelay: `${(i % 12) * 0.11}s`,
          }}
        />
      ))}

      <div className="absolute left-1/2 top-1/2 z-10 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2">
        {rings.map((ring, i) => (
          <span
            key={`ring-${i}`}
            className="absolute rounded-full border border-white/20"
            style={{
              inset: `${ring.inset}px`,
              opacity: ring.opacity,
              boxShadow: "0 0 14px rgba(130,180,255,0.10)",
              animation: `${ring.reverse ? "ringReverseUltra" : "ringForwardUltra"} ${ring.duration} linear infinite`,
            }}
          />
        ))}

        <div className="absolute left-1/2 top-1/2 h-[178px] w-[178px] -translate-x-1/2 -translate-y-1/2">
          <span className="absolute inset-[-58px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.13),transparent_66%)] animate-[coreAuraUltra_2.9s_ease-in-out_infinite]" />
          <span className="absolute inset-[-38px] rounded-full bg-[radial-gradient(circle,rgba(125,180,255,0.17),transparent_66%)] animate-[coreAuraUltra_2.9s_ease-in-out_infinite_0.35s]" />
          <span className="absolute inset-[-20px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_62%)] animate-[coreAuraUltra_2.9s_ease-in-out_infinite_0.7s]" />

          <div className="relative flex h-full w-full items-center justify-center rounded-[38px] border border-white/15 bg-[linear-gradient(180deg,rgba(15,24,46,0.98),rgba(4,8,18,0.99))] shadow-[0_0_70px_rgba(120,180,255,0.12)] animate-[coreChargeUltra_2.9s_ease-in-out_infinite]">
            <div className="absolute inset-[10px] rounded-[28px] border border-[#9fc6ff]/18 shadow-[inset_0_0_34px_rgba(130,180,255,0.14)]" />
            <div className="absolute inset-[24px] rounded-[22px] border border-white/8" />

            <div className="relative text-center">
              <div
                className="text-[68px] font-black tracking-[0.14em] text-white"
                style={{
                  textShadow:
                    "0 0 14px rgba(255,255,255,0.92), 0 0 34px rgba(130,180,255,0.38), 0 0 58px rgba(110,170,255,0.20)",
                }}
              >
                AI
              </div>
              <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.34em] text-white/72">
                CORE ENGINE
              </div>
            </div>

            <span className="absolute inset-0 rounded-[38px] border border-white/8 animate-[chipBorderPulseUltra_2.9s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 z-10 w-[84%] -translate-x-1/2 rounded-[24px] border border-white/10 bg-black/35 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
        <div className="grid grid-cols-3 gap-3">
          {["Input", "Reasoning", "Generation"].map((label, i) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-3"
            >
              <div className="text-xs font-semibold text-white/75">{label}</div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <span
                  className="block h-full w-2/3 rounded-full bg-white"
                  style={{
                    boxShadow: "0 0 12px rgba(255,255,255,0.65)",
                    animation: "statusBarUltra 2.4s ease-in-out infinite",
                    animationDelay: `${i * 0.18}s`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulseToCoreUltra {
          0% {
            stroke-dashoffset: 154;
            opacity: 0;
          }
          12% {
            opacity: 1;
          }
          78% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 0;
          }
        }

        @keyframes trailToCoreUltra {
          0% {
            stroke-dashoffset: 172;
            opacity: 0;
          }
          24% {
            opacity: 0.72;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 0;
          }
        }

        @keyframes relayPulseUltra {
          0% {
            stroke-dashoffset: 75;
            opacity: 0;
          }
          18% {
            opacity: 0.9;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 0;
          }
        }

        @keyframes sparkle {
          0%,
          100% {
            opacity: 0.15;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.7);
          }
        }

        @keyframes nodeBlinkUltra {
          0%,
          100% {
            opacity: 0.34;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.6);
          }
        }

        @keyframes coreChargeUltra {
          0%,
          100% {
            transform: scale(1);
            filter: brightness(0.95);
            box-shadow: 0 0 36px rgba(220, 240, 255, 0.08);
          }
          45% {
            transform: scale(1.05);
            filter: brightness(1.34);
            box-shadow: 0 0 92px rgba(235, 245, 255, 0.26),
              0 0 154px rgba(120, 180, 255, 0.23);
          }
        }

        @keyframes coreAuraUltra {
          0%,
          100% {
            transform: scale(0.88);
            opacity: 0.14;
          }
          50% {
            transform: scale(1.18);
            opacity: 0.74;
          }
        }

        @keyframes chipBorderPulseUltra {
          0%,
          100% {
            opacity: 0.08;
            transform: scale(1);
          }
          50% {
            opacity: 0.34;
            transform: scale(1.04);
          }
        }

        @keyframes ringForwardUltra {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes ringReverseUltra {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes statusBarUltra {
          0% {
            transform: translateX(-90%);
            opacity: 0.2;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(160%);
            opacity: 0.2;
          }
        }
      `}</style>
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

        <div className="relative grid gap-8 xl:grid-cols-[1fr_430px] xl:items-center">
          <div className="max-w-4xl">
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
              launch logic, staking direction, visuals, risk analysis, and
              on-chain project preparation through a connected AI-powered
              workflow.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="text-xs text-white/45">AI Draft</div>
                <div className="mt-1 font-bold text-white">Strategy Ready</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="text-xs text-white/45">Visual System</div>
                <div className="mt-1 font-bold text-white">AI Generated</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="text-xs text-white/45">Deployment</div>
                <div className="mt-1 font-bold text-white">KRX Access</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <AIEngineVisual />
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
                  setVisualForm((prev) => ({
                    ...prev,
                    colors: e.target.value,
                  }))
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
                {visualLoading
                  ? "Generating Visual..."
                  : "Generate Project Visual"}
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

              <SectionCard title="Flexible Token Settings">
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-xs text-white/45">
                      Initial Supply
                    </label>
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
                      className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/45">
                      Max Supply
                    </label>
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
                      className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/80">
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

                  <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/80">
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

                <p className="mt-4 text-sm leading-relaxed text-white/55">
                  If minting is disabled, max supply must equal initial supply.
                  If minting is enabled, the project owner can mint later up to
                  the max supply limit.
                </p>
              </SectionCard>

              <SectionCard title="Flexible Staking Settings">
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

                {deployForm.stakingEnabled ? (
                  <div className="mt-5 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-semibold text-white">
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
                          className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
                        />

                        <input
                          value={plan.rewardBps}
                          onChange={(e) =>
                            updateStakingPlan(index, "rewardBps", e.target.value)
                          }
                          placeholder="Reward BPS"
                          className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
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
                  className="mt-4 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
                />

                <p className="mt-4 text-sm leading-relaxed text-white/55">
                  The staking rewards allocation will be sent automatically to
                  the project vault. The remaining initial supply will be sent
                  to your wallet.
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