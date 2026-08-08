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


type DeploymentValidationInput = {
  owner: string;
  name: string;
  symbol: string;
  initialSupply: bigint;
  maxSupply: bigint;
  mintable: boolean;
  burnable: boolean;
  stakingEnabled: boolean;
  stakingRewardsAllocation: bigint;
  stakingPlansCount: number;
  metadataURI: string;
};

const WEBSITE_BUILDER_ROUTE = "/website-builder-ai";
const DEFAULT_TOKENS_PER_PROJECT = "1,500";


const BSC_MAINNET_CHAIN_ID = 56n;
const AI_DEPLOYER_BUILD = 3n;
const MAX_NAME_LENGTH = 64;
const MAX_SYMBOL_LENGTH = 16;
const MAX_METADATA_LENGTH = 1024;
const MAX_STAKING_PLANS = 10;
const MIN_DURATION_DAYS = 1n;
const MAX_DURATION_DAYS = 5n * 365n;
const MAX_REWARD_BPS = 30_000n;
const DEPLOY_GAS_BUFFER_BPS = 12_000n;
const BPS_DENOMINATOR = 10_000n;

const aiDeployerAbi = [
  {
    type: "function",
    name: "BUILD",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "accessManager",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "registry",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "projectsUsedByOwner",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "availableProjectSlots",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "deployAIProject",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "cfg",
        type: "tuple",
        components: [
          {
            name: "token",
            type: "tuple",
            components: [
              { name: "name", type: "string" },
              { name: "symbol", type: "string" },
              { name: "initialSupply", type: "uint256" },
              { name: "maxSupply", type: "uint256" },
              { name: "mintable", type: "bool" },
              { name: "burnable", type: "bool" },
            ],
          },
          { name: "stakingEnabled", type: "bool" },
          { name: "stakingRewardsAllocation", type: "uint256" },
          { name: "metadataURI", type: "string" },
          {
            name: "stakingPlans",
            type: "tuple[]",
            components: [
              { name: "durationDays", type: "uint256" },
              { name: "rewardBps", type: "uint256" },
            ],
          },
        ],
      },
    ],
    outputs: [
      { name: "projectId", type: "uint256" },
      { name: "token", type: "address" },
      { name: "vault", type: "address" },
      { name: "staking", type: "address" },
    ],
  },
  {
    type: "event",
    name: "AIProjectDeployed",
    anonymous: false,
    inputs: [
      { indexed: true, name: "projectId", type: "uint256" },
      { indexed: true, name: "owner", type: "address" },
      { indexed: true, name: "token", type: "address" },
      { indexed: false, name: "vault", type: "address" },
      { indexed: false, name: "staking", type: "address" },
      { indexed: false, name: "name", type: "string" },
      { indexed: false, name: "symbol", type: "string" },
      { indexed: false, name: "metadataURI", type: "string" },
    ],
  },
];

const registryValidationAbi = [
  {
    type: "function",
    name: "authorizedFactories",
    stateMutability: "view",
    inputs: [{ name: "factory", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "getProject",
    stateMutability: "view",
    inputs: [{ name: "projectId", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "id", type: "uint256" },
          { name: "owner", type: "address" },
          { name: "name", type: "string" },
          { name: "symbol", type: "string" },
          { name: "token", type: "address" },
          { name: "presale", type: "address" },
          { name: "staking", type: "address" },
          { name: "vault", type: "address" },
          { name: "metadataURI", type: "string" },
          { name: "createdAt", type: "uint256" },
          { name: "active", type: "bool" },
        ],
      },
    ],
  },
];

const tokenValidationAbi = [
  "function owner() view returns (address)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function maxSupply() view returns (uint256)",
  "function mintable() view returns (bool)",
  "function burnable() view returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
];

const vaultValidationAbi = [
  "function BUILD() view returns (uint256)",
  "function owner() view returns (address)",
  "function token() view returns (address)",
  "function staking() view returns (address)",
];

const stakingValidationAbi = [
  "function BUILD() view returns (uint256)",
  "function owner() view returns (address)",
  "function token() view returns (address)",
  "function vault() view returns (address)",
  "function plansCount() view returns (uint256)",
  "function isVaultLinked() view returns (bool)",
];

function getErrorMessage(error: unknown, fallback: string) {
  if (error && typeof error === "object") {
    const candidate = error as {
      shortMessage?: string;
      reason?: string;
      message?: string;
      info?: { error?: { message?: string } };
    };

    return (
      candidate.shortMessage ||
      candidate.reason ||
      candidate.info?.error?.message ||
      candidate.message ||
      fallback
    );
  }

  return fallback;
}

function utf8Length(value: string) {
  return ethers.toUtf8Bytes(value).length;
}

function parseTokenAmount(value: string, label: string) {
  const normalized = value.trim();

  if (!/^\d+(?:\.\d{1,18})?$/.test(normalized)) {
    throw new Error(
      `${label} must be a positive decimal number with at most 18 decimals.`
    );
  }

  return ethers.parseUnits(normalized, 18);
}

function parseUnsignedInteger(value: string, label: string) {
  const normalized = value.trim();

  if (!/^\d+$/.test(normalized)) {
    throw new Error(`${label} must be a whole number.`);
  }

  return BigInt(normalized);
}

function formatTokenAmount(raw: bigint) {
  const formatted = ethers.formatUnits(raw, 18);
  const [wholeRaw, fractionRaw = ""] = formatted.split(".");
  const whole = BigInt(wholeRaw || "0").toLocaleString("en-US");
  const fraction = fractionRaw.slice(0, 4).replace(/0+$/, "");

  return fraction ? `${whole}.${fraction}` : whole;
}

function sameAddress(left: string, right: string) {
  return left.toLowerCase() === right.toLowerCase();
}

async function assertContract(
  provider: ethers.Provider,
  address: string,
  label: string
) {
  if (!ethers.isAddress(address)) {
    throw new Error(`${label} address is invalid.`);
  }

  const code = await provider.getCode(address);

  if (code === "0x") {
    throw new Error(`${label} address is not a deployed contract.`);
  }
}

async function validateAIDeployer(provider: ethers.Provider) {
  await assertContract(provider, AI_DEPLOYER_ADDRESS, "AI Deployer");
  await assertContract(provider, ACCESS_MANAGER_ADDRESS, "Access Manager");

  const deployer = new ethers.Contract(
    AI_DEPLOYER_ADDRESS,
    aiDeployerAbi,
    provider
  );

  const [buildRaw, linkedAccessRaw, registryRaw] = await Promise.all([
    deployer.BUILD(),
    deployer.accessManager(),
    deployer.registry(),
  ]);

  const build = BigInt(buildRaw.toString());
  const linkedAccess = ethers.getAddress(String(linkedAccessRaw));
  const registry = ethers.getAddress(String(registryRaw));

  if (build !== AI_DEPLOYER_BUILD) {
    throw new Error(
      `Wrong AI Deployer build. Expected BUILD 3, received BUILD ${build}.`
    );
  }

  if (!sameAddress(linkedAccess, ACCESS_MANAGER_ADDRESS)) {
    throw new Error(
      "AI Deployer is linked to a different Access Manager address."
    );
  }

  await assertContract(provider, registry, "Project Registry");

  const registryContract = new ethers.Contract(
    registry,
    registryValidationAbi,
    provider
  );

  const authorized = Boolean(
    await registryContract.authorizedFactories(AI_DEPLOYER_ADDRESS)
  );

  if (!authorized) {
    throw new Error(
      "AI Deployer is not authorized in the Project Registry."
    );
  }

  return {
    deployer,
    registry,
    registryContract,
  };
}

function readAccessTupleValue(
  value: any,
  names: string[],
  fallbackIndex: number,
  fallback: bigint
) {
  for (const name of names) {
    const candidate = value?.[name];

    if (candidate !== undefined && candidate !== null) {
      return BigInt(candidate.toString());
    }
  }

  const indexed = value?.[fallbackIndex];

  if (indexed !== undefined && indexed !== null) {
    return BigInt(indexed.toString());
  }

  return fallback;
}

async function readJsonResponse(response: Response) {
  const text = await response.text();

  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      `Server returned an invalid response (${response.status}).`
    );
  }
}


async function validateDeployedProject(
  provider: ethers.Provider,
  registryContract: ethers.Contract,
  deployed: DeployResult,
  expected: DeploymentValidationInput
) {
  const owner = ethers.getAddress(expected.owner);
  const tokenAddress = ethers.getAddress(deployed.token);
  const vaultAddress = ethers.getAddress(deployed.vault);
  const stakingAddress = ethers.getAddress(deployed.staking);

  await assertContract(provider, tokenAddress, "Generated Token");
  await assertContract(provider, vaultAddress, "Generated Vault");

  const token = new ethers.Contract(
    tokenAddress,
    tokenValidationAbi,
    provider
  );

  const vault = new ethers.Contract(
    vaultAddress,
    vaultValidationAbi,
    provider
  );

  const [
    tokenOwner,
    tokenName,
    tokenSymbol,
    totalSupplyRaw,
    maxSupplyRaw,
    mintableRaw,
    burnableRaw,
    ownerBalanceRaw,
    vaultBalanceRaw,
    vaultBuildRaw,
    vaultOwner,
    vaultToken,
    vaultStaking,
  ] = await Promise.all([
    token.owner(),
    token.name(),
    token.symbol(),
    token.totalSupply(),
    token.maxSupply(),
    token.mintable(),
    token.burnable(),
    token.balanceOf(owner),
    token.balanceOf(vaultAddress),
    vault.BUILD(),
    vault.owner(),
    vault.token(),
    vault.staking(),
  ]);

  if (!sameAddress(String(tokenOwner), owner)) {
    throw new Error("Generated token ownership was not transferred to you.");
  }

  if (String(tokenName) !== expected.name) {
    throw new Error("Generated token name does not match the requested name.");
  }

  if (String(tokenSymbol) !== expected.symbol) {
    throw new Error(
      "Generated token symbol does not match the requested symbol."
    );
  }

  if (BigInt(totalSupplyRaw.toString()) !== expected.initialSupply) {
    throw new Error("Generated token total supply is incorrect.");
  }

  if (BigInt(maxSupplyRaw.toString()) !== expected.maxSupply) {
    throw new Error("Generated token max supply is incorrect.");
  }

  if (Boolean(mintableRaw) !== expected.mintable) {
    throw new Error("Generated token mintable setting is incorrect.");
  }

  if (Boolean(burnableRaw) !== expected.burnable) {
    throw new Error("Generated token burnable setting is incorrect.");
  }

  const expectedOwnerBalance =
    expected.initialSupply - expected.stakingRewardsAllocation;

  if (BigInt(ownerBalanceRaw.toString()) !== expectedOwnerBalance) {
    throw new Error("Generated token owner allocation is incorrect.");
  }

  if (
    BigInt(vaultBalanceRaw.toString()) !==
    expected.stakingRewardsAllocation
  ) {
    throw new Error("Generated vault reward allocation is incorrect.");
  }

  if (BigInt(vaultBuildRaw.toString()) !== AI_DEPLOYER_BUILD) {
    throw new Error("Generated vault is not BUILD 3.");
  }

  if (!sameAddress(String(vaultOwner), owner)) {
    throw new Error("Generated vault ownership was not transferred to you.");
  }

  if (!sameAddress(String(vaultToken), tokenAddress)) {
    throw new Error("Generated vault is linked to the wrong token.");
  }

  if (expected.stakingEnabled) {
    if (stakingAddress === ethers.ZeroAddress) {
      throw new Error("Staking was enabled but no staking contract was created.");
    }

    await assertContract(provider, stakingAddress, "Generated Staking");

    if (!sameAddress(String(vaultStaking), stakingAddress)) {
      throw new Error("Generated vault is not linked to generated staking.");
    }

    const staking = new ethers.Contract(
      stakingAddress,
      stakingValidationAbi,
      provider
    );

    const [
      stakingBuildRaw,
      stakingOwner,
      stakingToken,
      stakingVault,
      plansCountRaw,
      vaultLinkedRaw,
    ] = await Promise.all([
      staking.BUILD(),
      staking.owner(),
      staking.token(),
      staking.vault(),
      staking.plansCount(),
      staking.isVaultLinked(),
    ]);

    if (BigInt(stakingBuildRaw.toString()) !== AI_DEPLOYER_BUILD) {
      throw new Error("Generated staking is not BUILD 3.");
    }

    if (!sameAddress(String(stakingOwner), owner)) {
      throw new Error("Generated staking owner is incorrect.");
    }

    if (!sameAddress(String(stakingToken), tokenAddress)) {
      throw new Error("Generated staking is linked to the wrong token.");
    }

    if (!sameAddress(String(stakingVault), vaultAddress)) {
      throw new Error("Generated staking is linked to the wrong vault.");
    }

    if (Number(plansCountRaw) !== expected.stakingPlansCount) {
      throw new Error("Generated staking plan count is incorrect.");
    }

    if (!Boolean(vaultLinkedRaw)) {
      throw new Error("Generated staking reports that its vault is not linked.");
    }
  } else {
    if (stakingAddress !== ethers.ZeroAddress) {
      throw new Error(
        "Staking was disabled but a staking contract address was returned."
      );
    }

    if (ethers.getAddress(String(vaultStaking)) !== ethers.ZeroAddress) {
      throw new Error("Token-only project vault unexpectedly links to staking.");
    }
  }

  const project = await registryContract.getProject(deployed.projectId);

  if (!sameAddress(String(project.owner), owner)) {
    throw new Error("Registry project owner is incorrect.");
  }

  if (!sameAddress(String(project.token), tokenAddress)) {
    throw new Error("Registry token address is incorrect.");
  }

  if (!sameAddress(String(project.vault), vaultAddress)) {
    throw new Error("Registry vault address is incorrect.");
  }

  if (!sameAddress(String(project.staking), stakingAddress)) {
    throw new Error("Registry staking address is incorrect.");
  }

  if (String(project.name) !== expected.name) {
    throw new Error("Registry project name is incorrect.");
  }

  if (String(project.symbol) !== expected.symbol) {
    throw new Error("Registry project symbol is incorrect.");
  }

  if (String(project.metadataURI) !== expected.metadataURI) {
    throw new Error("Registry metadata URI is incorrect.");
  }

  if (!Boolean(project.active)) {
    throw new Error("Registry project is unexpectedly inactive.");
  }
}

const projectFields = [
  ["goal", "Main Goal of the Project"],
  ["problemSolved", "What problem does this project solve?"],
  ["userCareReason", "Why would users care about this project?"],
  ["competitiveEdge", "What makes it different from other projects?"],
  ["tokenUtilityReason", "How does the token create real utility?"],
  ["holdReason", "Why would people hold the token instead of selling it?"],
  ["growthLogic", "What is the long-term growth logic?"],
  [
    "revenueLogic",
    "How does the project make money or create ecosystem value?",
  ],
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
  "w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-white/30 transition focus:border-blue-400/45 focus:bg-black/55 focus:shadow-[0_0_28px_rgba(59,130,246,0.12)]";

const selectClass =
  "w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-blue-400/45 focus:bg-black/55 focus:shadow-[0_0_28px_rgba(59,130,246,0.12)]";

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
    <div className="ai-card-3d rounded-2xl border border-white/10 bg-black/35 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.045)]">
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
        "ai-card-3d rounded-2xl border p-4",
        active
          ? "border-blue-400/30 bg-blue-500/10"
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
          ? "border-blue-400/30 bg-blue-500/10 text-blue-100 shadow-[0_0_22px_rgba(59,130,246,0.14)]"
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
    <section className="ai-section-card relative overflow-hidden rounded-[34px] border border-white/10 bg-black/30 p-5 shadow-[0_24px_95px_rgba(0,0,0,0.44)] backdrop-blur-xl md:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.10),transparent_36%)]" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />

      <div className="relative">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            {eyebrow ? (
              <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-100">
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
        "ai-card-3d rounded-2xl border p-4 transition",
        active
          ? "border-blue-400/30 bg-blue-500/10"
          : "border-white/10 bg-white/[0.035]",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <div
          className={[
            "flex h-10 w-10 items-center justify-center rounded-2xl text-xs font-black",
            active ? "bg-blue-500 text-white" : "bg-white/10 text-white/55",
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

function KoraxMiniBrand() {
  return (
    <div className="relative flex flex-col items-center justify-center bg-transparent">
      <div className="absolute h-32 w-32 rounded-full bg-blue-500/15 blur-3xl" />

      <img
        src="/Korax-logo.png"
        alt="KORAX logo"
        className="ai-mini-logo relative h-20 w-20 bg-transparent object-contain drop-shadow-[0_0_24px_rgba(59,130,246,0.88)]"
      />

      <img
        src="/korax-wordmark.png"
        alt="KORAX wordmark"
        className="relative mt-2 h-8 w-auto max-w-[170px] bg-transparent object-contain drop-shadow-[0_0_18px_rgba(59,130,246,0.8)]"
      />
    </div>
  );
}

function AIEngineVisual() {
  return (
    <div className="ai-engine-shell relative min-h-[390px] overflow-hidden rounded-[38px] border border-white/10 bg-[#020816] shadow-[0_35px_130px_rgba(0,0,0,0.68)] md:min-h-[520px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.25),transparent_30%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.22),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(96,165,250,0.14),transparent_36%)]" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="ai-processor-orbit absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/10 shadow-[0_0_100px_rgba(59,130,246,0.16)]" />

      <div className="ai-processor-orbit ai-processor-orbit-two absolute left-1/2 top-1/2 h-[285px] w-[285px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />

      <div className="ai-processor-orbit ai-processor-orbit-three absolute left-1/2 top-1/2 h-[215px] w-[215px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />

      <div className="edge-pulse edge-left" />
      <div className="edge-pulse edge-right" />
      <div className="edge-pulse edge-top" />
      <div className="edge-pulse edge-bottom" />

      <svg
        className="absolute inset-0 h-full w-full opacity-80"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <filter id="aiLightPathGlow">
            <feGaussianBlur stdDeviation="0.45" result="blur" />

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
          "M 14 50 C 27 48, 38 48, 50 50",
          "M 86 50 C 73 48, 62 48, 50 50",
        ].map((d, index) => (
          <path
            key={index}
            d={d}
            fill="none"
            stroke="rgba(147,197,253,0.32)"
            strokeLinecap="round"
            strokeWidth="0.7"
            filter="url(#aiLightPathGlow)"
          />
        ))}

        {[
          { x: 5, y: 18 },
          { x: 95, y: 18 },
          { x: 5, y: 83 },
          { x: 95, y: 83 },
          { x: 50, y: 4 },
          { x: 50, y: 96 },
          { x: 14, y: 50 },
          { x: 86, y: 50 },
          { x: 50, y: 50 },
        ].map((node, index) => (
          <circle
            key={index}
            cx={node.x}
            cy={node.y}
            fill={
              index === 8
                ? "rgba(255,255,255,0.95)"
                : "rgba(147,197,253,0.85)"
            }
            r={index === 8 ? 2.4 : 1.15}
          />
        ))}
      </svg>

      <div className="ai-core absolute left-1/2 top-[48%] z-10 flex h-[208px] w-[208px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-blue-300/25 bg-[radial-gradient(circle_at_50%_25%,rgba(96,165,250,0.28),rgba(4,8,18,0.99)_55%,rgba(2,6,23,1))] shadow-[0_0_90px_rgba(59,130,246,0.38)]">
        <div className="absolute inset-[10px] rounded-full border border-blue-200/15 shadow-[inset_0_0_48px_rgba(96,165,250,0.18)]" />

        <div className="absolute inset-[22px] rounded-full border border-white/[0.06]" />

        <div className="ai-center-ring absolute inset-[-18px] rounded-full border border-blue-400/15" />

        <div className="ai-center-ring-two absolute inset-[-34px] rounded-full border border-cyan-300/10" />

        <div className="ai-core-corner ai-core-corner-one" />
        <div className="ai-core-corner ai-core-corner-two" />
        <div className="ai-core-corner ai-core-corner-three" />
        <div className="ai-core-corner ai-core-corner-four" />

        <div className="ai-core-mark relative flex h-[154px] w-[154px] items-center justify-center overflow-hidden rounded-full border border-blue-300/15 bg-black/25 shadow-[inset_0_0_40px_rgba(59,130,246,0.16)]">
          <div className="ai-core-mark-grid pointer-events-none absolute inset-0 opacity-30" />

          <div className="ai-core-sweep pointer-events-none absolute inset-y-0 left-[-45%] w-[45%] bg-gradient-to-r from-transparent via-blue-100/20 to-transparent" />

          <div className="relative text-center">
            <div className="text-[8px] font-black uppercase tracking-[0.42em] text-blue-100/65">
              KORAX
            </div>

            <div
              className="ai-core-letters mt-1 bg-gradient-to-b from-white via-blue-50 to-blue-300 bg-clip-text text-[74px] font-black leading-[0.86] tracking-[-0.08em] text-transparent"
              style={{
                WebkitTextStroke: "1px rgba(255,255,255,0.12)",
                textShadow:
                  "0 0 12px rgba(255,255,255,0.9), 0 0 34px rgba(59,130,246,0.7), 0 0 72px rgba(14,165,233,0.32)",
              }}
            >
              AI
            </div>

            <div className="mt-2 flex items-center justify-center gap-2">
              <span className="h-px w-5 bg-gradient-to-r from-transparent to-blue-300/80" />

              <span className="text-[7px] font-black uppercase tracking-[0.26em] text-cyan-100/75">
                Intelligence Core
              </span>

              <span className="h-px w-5 bg-gradient-to-l from-transparent to-blue-300/80" />
            </div>
          </div>
        </div>

        <div className="ai-core-status absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-blue-400/25 bg-[#040b18]/95 px-3 py-1.5 shadow-[0_0_24px_rgba(59,130,246,0.22)] backdrop-blur-xl">
          <span className="ai-core-status-dot h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.95)]" />

          <span className="text-[8px] font-black uppercase tracking-[0.22em] text-blue-100">
            Neural Engine Online
          </span>
        </div>
      </div>

      <div className="ai-chip-card ai-float-slow absolute left-[6%] top-[14%] rounded-2xl border border-white/10 bg-black/38 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.38)] backdrop-blur-md">
        <div className="text-xs font-black uppercase tracking-[0.22em] text-blue-100">
          Input
        </div>

        <div className="mt-2 text-lg font-black text-white">Idea Scan</div>

        <div className="mt-3 h-1.5 w-40 rounded-full bg-white/10">
          <div className="h-full w-4/5 rounded-full bg-blue-400 shadow-[0_0_18px_rgba(59,130,246,0.55)]" />
        </div>
      </div>

      <div className="ai-chip-card ai-float absolute right-[6%] top-[17%] rounded-2xl border border-white/10 bg-black/38 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.38)] backdrop-blur-md">
        <div className="text-xs font-black uppercase tracking-[0.22em] text-cyan-100">
          Output
        </div>

        <div className="mt-2 text-lg font-black text-white">KRX Deploy</div>

        <div className="mt-3 h-1.5 w-40 rounded-full bg-white/10">
          <div className="h-full w-3/4 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.45)]" />
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 z-10 w-[88%] -translate-x-1/2 rounded-[28px] border border-white/10 bg-black/40 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.38)] backdrop-blur-md">
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
                  className="block h-full rounded-full bg-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.45)]"
                  style={{
                    width: `${62 + index * 12}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
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
            opacity: 0.9;
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
            opacity: 0.9;
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
            opacity: 0.9;
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
            opacity: 0.9;
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
            box-shadow: 0 0 90px rgba(59, 130, 246, 0.38);
          }

          50% {
            transform: translate(-50%, -51.5%) scale(1.03);
            box-shadow:
              0 0 110px rgba(14, 165, 233, 0.38),
              0 0 155px rgba(59, 130, 246, 0.14);
          }
        }

        @keyframes ringPulse {
          0%,
          100% {
            opacity: 0.24;
            transform: scale(0.96);
          }

          50% {
            opacity: 0.72;
            transform: scale(1.045);
          }
        }

        @keyframes ringSpin {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
          }

          100% {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes ringSpinReverse {
          0% {
            transform: translate(-50%, -50%) rotate(360deg);
          }

          100% {
            transform: translate(-50%, -50%) rotate(0deg);
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

        @keyframes aiCoreSweep {
          0% {
            left: -50%;
            opacity: 0;
          }

          20% {
            opacity: 0.8;
          }

          80% {
            opacity: 0.8;
          }

          100% {
            left: 110%;
            opacity: 0;
          }
        }

        @keyframes aiCoreLetters {
          0%,
          100% {
            filter: brightness(1);
            transform: scale(1);
          }

          50% {
            filter: brightness(1.22);
            transform: scale(1.025);
          }
        }

        @keyframes aiCoreStatus {
          0%,
          100% {
            opacity: 0.45;
            transform: scale(0.82);
          }

          50% {
            opacity: 1;
            transform: scale(1.15);
          }
        }

        @keyframes aiCoreCorner {
          0%,
          100% {
            opacity: 0.25;
          }

          50% {
            opacity: 0.9;
          }
        }

        .edge-pulse {
          position: absolute;
          z-index: 8;
          width: 18px;
          height: 18px;
          border-radius: 999px;
          background: #60a5fa;
          box-shadow:
            0 0 18px rgba(96, 165, 250, 0.72),
            0 0 42px rgba(14, 165, 233, 0.32);
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

        .ai-center-ring-two {
          animation: ringPulse 4.4s ease-in-out infinite;
          animation-delay: 0.45s;
        }

        .ai-processor-orbit {
          animation: ringSpin 18s linear infinite;
          transform-origin: center;
        }

        .ai-processor-orbit-two {
          animation: ringSpinReverse 15s linear infinite;
        }

        .ai-processor-orbit-three {
          animation: ringSpin 11s linear infinite;
        }

        .ai-float {
          animation: float 6s ease-in-out infinite;
        }

        .ai-float-slow {
          animation: floatSlow 7.5s ease-in-out infinite;
        }

        .ai-core-sweep {
          animation: aiCoreSweep 4.8s ease-in-out infinite;
        }

        .ai-core-letters {
          animation: aiCoreLetters 3.4s ease-in-out infinite;
        }

        .ai-core-status-dot {
          animation: aiCoreStatus 1.7s ease-in-out infinite;
        }

        .ai-core-mark-grid {
          background-image:
            linear-gradient(
              rgba(147, 197, 253, 0.08) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(147, 197, 253, 0.08) 1px,
              transparent 1px
            );
          background-size: 14px 14px;
        }

        .ai-core-corner {
          position: absolute;
          z-index: 4;
          height: 17px;
          width: 17px;
          border-color: rgba(147, 197, 253, 0.72);
          animation: aiCoreCorner 2.8s ease-in-out infinite;
        }

        .ai-core-corner-one {
          left: 29px;
          top: 29px;
          border-left-width: 1px;
          border-top-width: 1px;
        }

        .ai-core-corner-two {
          right: 29px;
          top: 29px;
          border-right-width: 1px;
          border-top-width: 1px;
          animation-delay: 0.4s;
        }

        .ai-core-corner-three {
          bottom: 29px;
          left: 29px;
          border-bottom-width: 1px;
          border-left-width: 1px;
          animation-delay: 0.8s;
        }

        .ai-core-corner-four {
          bottom: 29px;
          right: 29px;
          border-bottom-width: 1px;
          border-right-width: 1px;
          animation-delay: 1.2s;
        }

        @media (max-width: 640px) {
          .edge-pulse {
            width: 12px;
            height: 12px;
          }

          .ai-chip-card {
            display: none;
          }

          .ai-core {
            height: 176px;
            width: 176px;
          }

          .ai-core-mark {
            height: 132px;
            width: 132px;
          }

          .ai-core-letters {
            font-size: 62px;
          }

          .ai-core-corner-one,
          .ai-core-corner-three {
            left: 24px;
          }

          .ai-core-corner-two,
          .ai-core-corner-four {
            right: 24px;
          }

          .ai-core-corner-one,
          .ai-core-corner-two {
            top: 24px;
          }

          .ai-core-corner-three,
          .ai-core-corner-four {
            bottom: 24px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .edge-pulse,
          .ai-core,
          .ai-center-ring,
          .ai-center-ring-two,
          .ai-processor-orbit,
          .ai-float,
          .ai-float-slow,
          .ai-core-sweep,
          .ai-core-letters,
          .ai-core-status-dot,
          .ai-core-corner {
            animation: none;
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
    colors: "black, deep blue, electric blue, cyan, silver",
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
    tokensPerProject: DEFAULT_TOKENS_PER_PROJECT,
    requiredRewardBps: 9000,
    totalSlots: 0,
    usedSlots: 0,
    availableSlots: 0,
    hasAccess: false,
    registeredProjects: 0,
    error: "",
  });

  function update<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
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
      primaryColor: "#2563EB",
      secondaryColor: "#22D3EE",
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
        tokensPerProject: DEFAULT_TOKENS_PER_PROJECT,
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
      const wallet = ethers.getAddress(user);

      setAccess((prev) => ({
        ...prev,
        loading: true,
        connected: true,
        wallet,
        error: "",
      }));

      if (!RPC_URL?.trim()) {
        throw new Error("BSC RPC URL is missing.");
      }

      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const network = await provider.getNetwork();

      if (network.chainId !== BSC_MAINNET_CHAIN_ID) {
        throw new Error(
          `Wrong RPC network. Expected BSC Mainnet 56, received ${network.chainId}.`
        );
      }

      const { deployer: aiDeployer } = await validateAIDeployer(provider);

      const accessManager = new ethers.Contract(
        ACCESS_MANAGER_ADDRESS,
        accessManagerAbi,
        provider
      );

      const [
        eligibleAmountRaw,
        totalSlotsRaw,
        usedSlotsRaw,
        availableSlotsRaw,
      ] = await Promise.all([
        accessManager.getEligibleStakedAmount(wallet),
        accessManager.getProjectSlots(wallet),
        aiDeployer.projectsUsedByOwner(wallet),
        aiDeployer.availableProjectSlots(wallet),
      ]);

      const eligibleAmount = BigInt(eligibleAmountRaw.toString());
      const totalSlots = Number(totalSlotsRaw);
      const usedSlots = Number(usedSlotsRaw);
      const contractAvailableSlots = Number(availableSlotsRaw);
      const calculatedAvailableSlots = Math.max(totalSlots - usedSlots, 0);

      if (!Number.isSafeInteger(totalSlots) || totalSlots < 0) {
        throw new Error("Invalid project slot count returned by Access Manager.");
      }

      if (!Number.isSafeInteger(usedSlots) || usedSlots < 0) {
        throw new Error("Invalid used slot count returned by AI Deployer.");
      }

      if (contractAvailableSlots !== calculatedAvailableSlots) {
        throw new Error(
          "Project slot data is inconsistent between AI Deployer and Access Manager."
        );
      }

      let hasAccess = totalSlots > 0;

      try {
        hasAccess =
          Boolean(await accessManager.hasKoraxAccess(wallet)) || totalSlots > 0;
      } catch {
        hasAccess = totalSlots > 0;
      }

      let tokensPerProjectRaw = ethers.parseUnits("1500", 18);
      let requiredRewardBpsRaw = 9000n;

      try {
        const accessData = await accessManager.getAccessData(wallet);

        tokensPerProjectRaw = readAccessTupleValue(
          accessData,
          ["currentTokensPerProject", "tokensPerProject"],
          2,
          tokensPerProjectRaw
        );

        requiredRewardBpsRaw = readAccessTupleValue(
          accessData,
          ["currentRequiredRewardBps", "requiredRewardBps"],
          3,
          requiredRewardBpsRaw
        );
      } catch {
        // Core slot access remains available even if extended display data fails.
      }

      setAccess({
        loading: false,
        connected: true,
        wallet,
        eligibleAmount: formatTokenAmount(eligibleAmount),
        tokensPerProject: formatTokenAmount(tokensPerProjectRaw),
        requiredRewardBps: Number(requiredRewardBpsRaw),
        totalSlots,
        usedSlots,
        availableSlots: contractAvailableSlots,
        hasAccess,
        registeredProjects: usedSlots,
        error: "",
      });
    } catch (error: unknown) {
      setAccess((prev) => ({
        ...prev,
        loading: false,
        connected: true,
        wallet: user,
        tokensPerProject:
          prev.tokensPerProject || DEFAULT_TOKENS_PER_PROJECT,
        error: getErrorMessage(error, "Failed to load access data."),
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

      const data = await readJsonResponse(res);

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

      const data = await readJsonResponse(res);

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
        err?.message ||
          "Something went wrong while generating the visual."
      );
    } finally {
      setVisualLoading(false);
    }
  }

  function addStakingPlan() {
    setStakingPlans((prev) => {
      if (prev.length >= 10) return prev;

      return [
        ...prev,
        {
          durationDays: "30",
          rewardBps: "500",
        },
      ];
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
      prev.map((plan, i) =>
        i === index
          ? {
              ...plan,
              [key]: value,
            }
          : plan
      )
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

      if (form.network !== "BNB Chain") {
        throw new Error(
          "On-chain deployment is currently available only on BNB Chain."
        );
      }

      const projectName = form.projectName.trim();
      const symbol = form.symbol.trim().toUpperCase();

      if (!projectName) {
        throw new Error("Project name is required.");
      }

      if (!symbol) {
        throw new Error("Token symbol is required.");
      }

      if (utf8Length(projectName) > MAX_NAME_LENGTH) {
        throw new Error(
          `Project name exceeds the ${MAX_NAME_LENGTH}-byte contract limit.`
        );
      }

      if (utf8Length(symbol) > MAX_SYMBOL_LENGTH) {
        throw new Error(
          `Token symbol exceeds the ${MAX_SYMBOL_LENGTH}-byte contract limit.`
        );
      }

      const initialSupply = parseTokenAmount(
        deployForm.initialSupply,
        "Initial supply"
      );

      const maxSupply = parseTokenAmount(
        deployForm.maxSupply,
        "Max supply"
      );

      const stakingRewardsAllocation = deployForm.stakingEnabled
        ? parseTokenAmount(
            deployForm.stakingRewardsAllocation,
            "Staking rewards allocation"
          )
        : 0n;

      if (initialSupply <= 0n) {
        throw new Error("Initial supply must be greater than 0.");
      }

      if (initialSupply > ethers.MaxUint256 || maxSupply > ethers.MaxUint256) {
        throw new Error("Token supply exceeds the uint256 contract limit.");
      }

      if (maxSupply < initialSupply) {
        throw new Error("Max supply cannot be lower than initial supply.");
      }

      if (!deployForm.mintable && maxSupply !== initialSupply) {
        throw new Error(
          "Fixed-supply tokens must have max supply equal to initial supply."
        );
      }

      if (
        deployForm.stakingEnabled &&
        stakingRewardsAllocation <= 0n
      ) {
        throw new Error(
          "Staking rewards allocation must be greater than 0."
        );
      }

      if (stakingRewardsAllocation > initialSupply) {
        throw new Error(
          "Staking rewards allocation cannot exceed initial supply."
        );
      }

      const cleanPlans = deployForm.stakingEnabled
        ? stakingPlans.map((plan, index) => ({
            durationDays: parseUnsignedInteger(
              plan.durationDays,
              `Plan ${index + 1} duration`
            ),
            rewardBps: parseUnsignedInteger(
              plan.rewardBps,
              `Plan ${index + 1} reward BPS`
            ),
          }))
        : [];

      if (deployForm.stakingEnabled) {
        if (cleanPlans.length === 0) {
          throw new Error("At least one staking plan is required.");
        }

        if (cleanPlans.length > MAX_STAKING_PLANS) {
          throw new Error(
            `Maximum ${MAX_STAKING_PLANS} staking plans allowed.`
          );
        }

        for (const [index, plan] of cleanPlans.entries()) {
          if (plan.durationDays < MIN_DURATION_DAYS) {
            throw new Error(
              `Plan ${index + 1} duration must be at least 1 day.`
            );
          }

          if (plan.durationDays > MAX_DURATION_DAYS) {
            throw new Error(
              `Plan ${index + 1} duration cannot exceed 1,825 days.`
            );
          }

          if (plan.rewardBps <= 0n) {
            throw new Error(
              `Plan ${index + 1} reward BPS must be greater than 0.`
            );
          }

          if (plan.rewardBps > MAX_REWARD_BPS) {
            throw new Error(
              `Plan ${index + 1} reward BPS cannot exceed 30,000 (300%).`
            );
          }
        }
      }

      const metadataURI =
        deployForm.metadataURI.trim() ||
        `korax-ai:${projectName}:${Date.now()}`;

      if (utf8Length(metadataURI) > MAX_METADATA_LENGTH) {
        throw new Error(
          `Metadata URI exceeds the ${MAX_METADATA_LENGTH}-byte contract limit.`
        );
      }

      const browserProvider = new ethers.BrowserProvider(
        walletClient.transport as any
      );

      const network = await browserProvider.getNetwork();

      if (network.chainId !== BSC_MAINNET_CHAIN_ID) {
        throw new Error(
          `Switch your wallet to BSC Mainnet (chain ID 56). Current chain ID: ${network.chainId}.`
        );
      }

      const signer = await browserProvider.getSigner();
      const signerAddress = ethers.getAddress(await signer.getAddress());
      const connectedAddress = ethers.getAddress(address);

      if (!sameAddress(signerAddress, connectedAddress)) {
        throw new Error(
          "Connected wallet and transaction signer do not match. Reconnect the wallet."
        );
      }

      const { registryContract } = await validateAIDeployer(browserProvider);

      const contract = new ethers.Contract(
        AI_DEPLOYER_ADDRESS,
        aiDeployerAbi,
        signer
      );

      const availableSlotsRaw = await contract.availableProjectSlots(
        signerAddress
      );

      if (BigInt(availableSlotsRaw.toString()) <= 0n) {
        throw new Error("No available KORAX project slots.");
      }

      const cfg = {
        token: {
          name: projectName,
          symbol,
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

      await contract.deployAIProject.staticCall(cfg);

      const estimatedGas = await contract.deployAIProject.estimateGas(cfg);
      const gasLimit =
        (estimatedGas * DEPLOY_GAS_BUFFER_BPS) / BPS_DENOMINATOR;

      const [walletBalance, feeData] = await Promise.all([
        browserProvider.getBalance(signerAddress),
        browserProvider.getFeeData(),
      ]);

      const effectiveGasPrice =
        feeData.maxFeePerGas ?? feeData.gasPrice;

      if (
        effectiveGasPrice !== null &&
        walletBalance < gasLimit * effectiveGasPrice
      ) {
        throw new Error(
          "Insufficient BNB to deploy the project with the safety gas buffer."
        );
      }

      const tx = await contract.deployAIProject(cfg, {
        gasLimit,
      });

      const receipt = await tx.wait();

      if (!receipt || receipt.status !== 1) {
        throw new Error(
          `Deployment transaction failed or was reverted. Transaction: ${tx.hash}`
        );
      }

      const iface = new ethers.Interface(aiDeployerAbi);
      let parsedEvent: ethers.LogDescription | null = null;

      for (const log of receipt.logs) {
        if (!sameAddress(log.address, AI_DEPLOYER_ADDRESS)) {
          continue;
        }

        try {
          const parsed = iface.parseLog(log);

          if (parsed?.name === "AIProjectDeployed") {
            parsedEvent = parsed;
            break;
          }
        } catch {
          // Ignore unrelated logs from the same transaction.
        }
      }

      if (!parsedEvent) {
        throw new Error(
          `Project transaction was mined, but AIProjectDeployed was not found. Transaction: ${receipt.hash}`
        );
      }

      const eventOwner = ethers.getAddress(
        String(parsedEvent.args.owner ?? parsedEvent.args[1])
      );

      if (!sameAddress(eventOwner, signerAddress)) {
        throw new Error("Deployment event contains the wrong project owner.");
      }

      const eventName = String(
        parsedEvent.args.name ?? parsedEvent.args[5]
      );
      const eventSymbol = String(
        parsedEvent.args.symbol ?? parsedEvent.args[6]
      );
      const eventMetadata = String(
        parsedEvent.args.metadataURI ?? parsedEvent.args[7]
      );

      if (
        eventName !== projectName ||
        eventSymbol !== symbol ||
        eventMetadata !== metadataURI
      ) {
        throw new Error(
          "Deployment event configuration does not match the submitted project."
        );
      }

      const deployed: DeployResult = {
        projectId: String(
          parsedEvent.args.projectId ?? parsedEvent.args[0]
        ),
        token: ethers.getAddress(
          String(parsedEvent.args.token ?? parsedEvent.args[2])
        ),
        vault: ethers.getAddress(
          String(parsedEvent.args.vault ?? parsedEvent.args[3])
        ),
        staking: ethers.getAddress(
          String(parsedEvent.args.staking ?? parsedEvent.args[4])
        ),
        txHash: receipt.hash,
      };

      try {
        await validateDeployedProject(
          browserProvider,
          registryContract,
          deployed,
          {
            owner: signerAddress,
            name: projectName,
            symbol,
            initialSupply,
            maxSupply,
            mintable: deployForm.mintable,
            burnable: deployForm.burnable,
            stakingEnabled: deployForm.stakingEnabled,
            stakingRewardsAllocation,
            stakingPlansCount: cleanPlans.length,
            metadataURI,
          }
        );
      } catch (validationError: unknown) {
        saveProjectForWebsiteBuilder(deployed);
        setDeployResult(deployed);

        throw new Error(
          `Project was deployed, but automatic post-deployment validation reported: ${getErrorMessage(
            validationError,
            "Unknown validation error"
          )}. Transaction: ${receipt.hash}`
        );
      }

      saveProjectForWebsiteBuilder(deployed);
      setDeployResult(deployed);

      await loadAccessData(signerAddress);
    } catch (error: unknown) {
      setDeployError(
        getErrorMessage(error, "Deployment failed.")
      );
    } finally {
      setDeployingProject(false);
    }
  }

  const canContinueToCreation =
    Boolean(result) && access.availableSlots > 0;

  const needsUnlock =
    Boolean(result) && access.availableSlots <= 0;

  const visualImageSrc = visualResult?.imageBase64
    ? `data:image/png;base64,${visualResult.imageBase64}`
    : visualResult?.imageUrl || "";

  const displayedTokensPerProject =
    access.tokensPerProject || DEFAULT_TOKENS_PER_PROJECT;

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
      <style>{`
        @keyframes aiHeroScan {
          0% {
            transform: translateX(-120%);
            opacity: 0;
          }

          20% {
            opacity: 1;
          }

          80% {
            opacity: 1;
          }

          100% {
            transform: translateX(120%);
            opacity: 0;
          }
        }

        @keyframes aiHeroShimmer {
          0% {
            transform: translateX(-120%);
            opacity: 0;
          }

          30% {
            opacity: 1;
          }

          70% {
            opacity: 1;
          }

          100% {
            transform: translateX(120%);
            opacity: 0;
          }
        }

        @keyframes aiMiniLogoSpin {
          0% {
            transform: rotateY(0deg) rotateX(0deg) translateY(0);
          }

          50% {
            transform: rotateY(180deg) rotateX(7deg) translateY(-4px);
          }

          100% {
            transform: rotateY(360deg) rotateX(0deg) translateY(0);
          }
        }

        .ai-hero-3d {
          transform-style: preserve-3d;
          perspective: 1200px;
        }

        .ai-section-card,
        .ai-card-3d {
          position: relative;
          transform-style: preserve-3d;
          transition:
            transform 220ms ease,
            border-color 220ms ease,
            background 220ms ease,
            box-shadow 220ms ease;
        }

        .ai-section-card:hover,
        .ai-card-3d:hover {
          border-color: rgba(59, 130, 246, 0.38);
          box-shadow: 0 32px 100px rgba(59, 130, 246, 0.13);
        }

        .ai-card-3d:hover {
          transform: translateY(-6px) rotateX(2deg) rotateY(-2deg);
          background: rgba(37, 99, 235, 0.075);
        }

        .ai-hero-scan {
          animation: aiHeroScan 4.4s ease-in-out infinite;
        }

        .ai-hero-shimmer {
          animation: aiHeroShimmer 5.4s ease-in-out infinite;
        }

        .ai-mini-logo {
          transform-style: preserve-3d;
          animation: aiMiniLogoSpin 8s linear infinite;
          will-change: transform;
        }

        @media (hover: none) {
          .ai-card-3d:hover {
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ai-hero-scan,
          .ai-hero-shimmer,
          .ai-mini-logo {
            animation: none;
          }

          .ai-card-3d:hover {
            transform: none;
          }
        }
      `}</style>

      <section className="ai-hero-3d relative overflow-hidden rounded-[38px] border border-white/10 bg-black/35 p-5 shadow-[0_35px_130px_rgba(0,0,0,0.62)] backdrop-blur-xl md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.24),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.16),transparent_35%)]" />

        <div className="pointer-events-none absolute inset-0 opacity-[0.075] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:52px_52px]" />

        <div className="ai-hero-scan pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent" />

        <div className="ai-hero-shimmer pointer-events-none absolute left-0 top-0 h-full w-1/4 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

        <div className="relative grid gap-8 xl:grid-cols-[1fr_470px] xl:items-center">
          <div className="max-w-5xl">
            <div className="inline-flex rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-blue-100 shadow-[0_0_30px_rgba(59,130,246,0.16)]">
              KORAX Token Builder AI / Command Mode
            </div>

            <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-center">
              <div className="hidden lg:block">
                <KoraxMiniBrand />
              </div>

              <div>
                <h1 className="text-4xl font-black leading-[0.96] tracking-tight text-white sm:text-6xl xl:text-7xl">
                  Turn an idea into a
                  <span className="block bg-gradient-to-r from-blue-100 via-white to-cyan-200 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(59,130,246,0.55)]">
                    serious Web3 launch system.
                  </span>
                </h1>

                <p className="mt-6 max-w-3xl text-base leading-8 text-white/68 sm:text-lg">
                  KORAX AI helps builders shape project strategy, tokenomics,
                  staking logic, launch direction, risk analysis, AI visuals,
                  and on-chain deployment through a connected builder workflow.
                </p>
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatusPill active>AI Draft</StatusPill>

              <StatusPill active={Boolean(visualImageSrc)}>
                AI Visual
              </StatusPill>

              <StatusPill active={access.hasAccess}>
                1,500 KRX Gate
              </StatusPill>

              <StatusPill active={Boolean(deployResult)}>
                On-chain Ready
              </StatusPill>
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
                  onChange={(event) =>
                    update("projectName", event.target.value)
                  }
                  placeholder="Project Name"
                  className={inputClass}
                />
              </Field>

              <Field label="Token Symbol">
                <input
                  value={form.symbol}
                  onChange={(event) =>
                    update("symbol", event.target.value)
                  }
                  placeholder="Token Symbol"
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Category">
                <select
                  value={form.category}
                  onChange={(event) =>
                    update("category", event.target.value)
                  }
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
                  onChange={(event) =>
                    update("network", event.target.value)
                  }
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
                onChange={(event) =>
                  update("shortDescription", event.target.value)
                }
                placeholder="Short Description"
                rows={4}
                className={inputClass}
              />
            </Field>

            <Field label="Target Audience">
              <input
                value={form.targetAudience}
                onChange={(event) =>
                  update("targetAudience", event.target.value)
                }
                placeholder="Target Audience"
                className={inputClass}
              />
            </Field>

            <Field label="Brand Style">
              <select
                value={form.style}
                onChange={(event) =>
                  update("style", event.target.value)
                }
                className={selectClass}
              >
                <option>Professional</option>
                <option>Aggressive Growth</option>
                <option>Community First</option>
                <option>Premium Brand</option>
                <option>Meme Energy</option>
              </select>
            </Field>

            <div className="rounded-[28px] border border-white/10 bg-black/25 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.28)]">
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
                    onChange={(event) =>
                      update(key, event.target.value as any)
                    }
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
                  onChange={(event) =>
                    update("presale", event.target.checked)
                  }
                />

                Launchpad
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/80">
                <input
                  type="checkbox"
                  checked={form.staking}
                  onChange={(event) => {
                    update("staking", event.target.checked);

                    setDeployForm((prev) => ({
                      ...prev,
                      stakingEnabled: event.target.checked,
                      stakingRewardsAllocation: event.target.checked
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
                  onChange={(event) =>
                    update("vesting", event.target.checked)
                  }
                />

                Vesting
              </label>
            </div>

            <button
              type="button"
              onClick={generateDraft}
              disabled={loading}
              className="rounded-2xl bg-blue-500 px-6 py-4 font-black text-white shadow-[0_0_36px_rgba(59,130,246,0.28)] transition hover:scale-[1.01] hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
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
            <div className="mt-4 rounded-2xl border border-blue-400/25 bg-blue-500/10 p-4 text-sm leading-7 text-white/75">
              To unlock the KORAX Builder Package, users need to stake{" "}
              <span className="font-black text-white">
                {displayedTokensPerProject} KRX
              </span>{" "}
              on the{" "}
              <span className="font-black text-white">
                12-month staking plan
              </span>
              . This package unlocks Token Builder AI, Website Builder AI, and
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
                <InfoCard
                  label="Wallet"
                  value={shortAddress(access.wallet)}
                />

                <div className="grid grid-cols-2 gap-3">
                  <MetricCard
                    label="Eligible Staked"
                    value={`${access.eligibleAmount} KRX`}
                    active={access.hasAccess}
                  />

                  <MetricCard
                    label="Tokens Per Project"
                    value={`${displayedTokensPerProject} KRX`}
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
              The free draft helps users understand whether their idea is
              strong, weak, fixable, or worth converting into a real on-chain
              project.
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
                onChange={(event) =>
                  setVisualForm((prev) => ({
                    ...prev,
                    imageType: event.target.value,
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
                onChange={(event) =>
                  setVisualForm((prev) => ({
                    ...prev,
                    visualStyle: event.target.value,
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
                onChange={(event) =>
                  setVisualForm((prev) => ({
                    ...prev,
                    colors: event.target.value,
                  }))
                }
                placeholder="Preferred colors"
                className={inputClass}
              />

              <input
                value={visualForm.mood}
                onChange={(event) =>
                  setVisualForm((prev) => ({
                    ...prev,
                    mood: event.target.value,
                  }))
                }
                placeholder="Mood"
                className={inputClass}
              />

              <button
                type="button"
                onClick={generateVisual}
                disabled={visualLoading}
                className="rounded-2xl bg-blue-500 px-5 py-3 font-black text-white shadow-[0_0_30px_rgba(59,130,246,0.24)] transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
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
                    AI visuals are generated from your project description.
                    Text inside images may not always be perfect, so the best
                    use is for concept art, posters, branding direction, and
                    early marketing visuals.
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
                      className="rounded-xl border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-100 transition hover:bg-blue-500/15"
                    >
                      Use Visual as Project Reference
                    </button>
                  </div>

                  <div className="mt-3 inline-flex rounded-full border border-blue-400/25 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-100">
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
          <SectionCard
            eyebrow="AI Draft Result"
            title="Project intelligence generated"
          >
            <p className="mt-3 text-sm leading-7 text-white/60">
              This draft was generated by KORAX AI and refined for stronger
              positioning, launch logic, risk analysis, and builder clarity.
            </p>
          </SectionCard>

          <SectionCard
            eyebrow="Next Step"
            title="Move from idea to on-chain project"
          >
            <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-sm leading-7 text-white/60">
                Your AI draft is ready. You can now deploy the project on-chain
                through KORAX AI when your wallet has an available project
                slot.
              </p>

              {canContinueToCreation ? (
                <button
                  type="button"
                  onClick={() =>
                    setShowCreationStep((prev) => !prev)
                  }
                  className="rounded-2xl bg-blue-500 px-5 py-3 font-black text-white shadow-[0_0_34px_rgba(59,130,246,0.28)] transition hover:bg-blue-400"
                >
                  {showCreationStep
                    ? "Hide Project Creation"
                    : "Continue to Project Creation"}
                </button>
              ) : needsUnlock ? (
                <div className="rounded-2xl border border-blue-400/25 bg-blue-500/10 px-4 py-3 text-sm text-white/75">
                  Unlock the Builder Package with{" "}
                  <span className="font-black text-white">
                    {displayedTokensPerProject} KRX
                  </span>{" "}
                  on the 12-month staking plan.
                </div>
              ) : null}
            </div>
          </SectionCard>

          {showCreationStep && finalProjectPreview ? (
            <section className="space-y-6 rounded-[34px] border border-blue-400/25 bg-blue-500/10 p-5 shadow-[0_26px_100px_rgba(0,0,0,0.48)] backdrop-blur-xl md:p-6">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-100">
                  Project Creation Preview
                </p>

                <h3 className="mt-2 text-3xl font-black text-white">
                  Review before on-chain deployment
                </h3>

                <p className="mt-3 text-sm leading-7 text-white/75">
                  This step connects your AI draft to the real KORAX AI
                  Deployer contract.
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
                      onChange={(event) =>
                        setDeployForm((prev) => ({
                          ...prev,
                          initialSupply: event.target.value,
                          maxSupply: prev.mintable
                            ? prev.maxSupply
                            : event.target.value,
                        }))
                      }
                      placeholder="100000000"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Max Supply">
                    <input
                      value={deployForm.maxSupply}
                      onChange={(event) =>
                        setDeployForm((prev) => ({
                          ...prev,
                          maxSupply: event.target.value,
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
                      onChange={(event) =>
                        setDeployForm((prev) => ({
                          ...prev,
                          mintable: event.target.checked,
                          maxSupply: event.target.checked
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
                      onChange={(event) =>
                        setDeployForm((prev) => ({
                          ...prev,
                          burnable: event.target.checked,
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
                    onChange={(event) =>
                      setDeployForm((prev) => ({
                        ...prev,
                        stakingEnabled: event.target.checked,
                        stakingRewardsAllocation: event.target.checked
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
                      onChange={(event) =>
                        setDeployForm((prev) => ({
                          ...prev,
                          stakingRewardsAllocation: event.target.value,
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
                          10000 = 100%, maximum 30000 = 300%.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={addStakingPlan}
                        disabled={stakingPlans.length >= 10}
                        className="rounded-xl border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-100 transition hover:bg-blue-500/15 disabled:opacity-50"
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
                          onChange={(event) =>
                            updateStakingPlan(
                              index,
                              "durationDays",
                              event.target.value
                            )
                          }
                          placeholder="Duration days"
                          className={inputClass}
                        />

                        <input
                          value={plan.rewardBps}
                          onChange={(event) =>
                            updateStakingPlan(
                              index,
                              "rewardBps",
                              event.target.value
                            )
                          }
                          placeholder="Reward BPS"
                          className={inputClass}
                        />

                        <button
                          type="button"
                          onClick={() => removeStakingPlan(index)}
                          disabled={stakingPlans.length <= 1}
                          className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-100 transition hover:bg-red-500/15 disabled:opacity-50"
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
                  onChange={(event) =>
                    setDeployForm((prev) => ({
                      ...prev,
                      metadataURI: event.target.value,
                    }))
                  }
                  placeholder="Optional: IPFS / website / project reference"
                  className={`mt-4 ${inputClass}`}
                />

                <p className="mt-4 text-sm leading-7 text-white/55">
                  The staking rewards allocation will be sent automatically to
                  the project vault. The remaining initial supply will be sent
                  to your wallet.
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
                    disabled={
                      deployingProject || access.availableSlots <= 0
                    }
                    className="rounded-2xl bg-blue-500 px-5 py-3 font-black text-white shadow-[0_0_34px_rgba(59,130,246,0.28)] transition hover:bg-blue-400 disabled:opacity-50"
                  >
                    {deployingProject
                      ? "Deploying Project... please wait"
                      : "Deploy AI Project On-chain"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCreationStep(false)}
                    className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
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
                  <div className="rounded-2xl border border-blue-400/25 bg-black/35 p-5 shadow-[0_0_40px_rgba(59,130,246,0.10)]">
                    <div className="text-lg font-black text-blue-100">
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
                        className="rounded-xl bg-blue-500 px-5 py-3 font-bold text-white shadow-[0_0_28px_rgba(59,130,246,0.22)] transition hover:bg-blue-400"
                      >
                        Continue to Website Builder AI
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          saveProjectForWebsiteBuilder(deployResult);
                          router.push(WEBSITE_BUILDER_ROUTE);
                        }}
                        className="rounded-xl border border-blue-400/30 bg-blue-500/10 px-5 py-3 font-bold text-blue-100 transition hover:bg-blue-500/20"
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
            <InfoCard
              label="Project Verdict"
              value={result.projectVerdict}
            />

            <InfoCard
              label="Originality Score"
              value={result.originalityScore}
            />

            <InfoCard
              label="Utility Strength Score"
              value={result.utilityStrengthScore}
            />
          </div>

          <InfoCard
            label="Market Fit Score"
            value={result.marketFitScore}
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Project Summary">
              <p className="mt-3 leading-7 text-white/70">
                {result.projectSummary}
              </p>

              <h3 className="mt-6 text-lg font-black text-white">
                Brand Angle
              </h3>

              <p className="mt-3 leading-7 text-white/70">
                {result.brandAngle}
              </p>

              <h3 className="mt-6 text-lg font-black text-white">
                Pitch
              </h3>

              <p className="mt-3 leading-7 text-white/70">
                {result.pitch}
              </p>
            </SectionCard>

            <SectionCard title="Core Utility">
              <ul className="mt-3 space-y-2 text-white/70">
                {result.coreUtility.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>

              <h3 className="mt-6 text-lg font-black text-white">
                Differentiation
              </h3>

              <ul className="mt-3 space-y-2 text-white/70">
                {result.differentiation.map((item, index) => (
                  <li key={index}>• {item}</li>
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
                  <span className="font-black text-white">
                    Launchpad:
                  </span>{" "}
                  {result.tokenomicsPreview.presaleAllocationSuggestion}
                </div>

                <div>
                  <span className="font-black text-white">Staking:</span>{" "}
                  {result.tokenomicsPreview.stakingAllocationSuggestion}
                </div>

                <div>
                  <span className="font-black text-white">
                    Treasury:
                  </span>{" "}
                  {result.tokenomicsPreview.treasuryAllocationSuggestion}
                </div>

                <div>
                  <span className="font-black text-white">
                    Liquidity:
                  </span>{" "}
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
                  <span className="font-black text-white">
                    Funding Logic:
                  </span>{" "}
                  {result.launchPlan.fundingLogic}
                </div>

                <div>
                  <span className="font-black text-white">
                    Launch Notes:
                  </span>{" "}
                  {result.launchPlan.launchNotes}
                </div>
              </div>
            </SectionCard>
          </div>

          <SectionCard title="Roadmap">
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {result.roadmap.map((step, index) => (
                <div
                  key={index}
                  className="ai-card-3d rounded-2xl border border-white/10 bg-black/25 p-4 text-sm leading-7 text-white/70"
                >
                  <div className="mb-2 font-black text-white">
                    Phase {index + 1}
                  </div>

                  {step}
                </div>
              ))}
            </div>
          </SectionCard>

          <div className="grid gap-6 lg:grid-cols-3">
            <SectionCard title="Weak Points">
              <ul className="mt-3 space-y-2 text-white/70">
                {result.weakPoints.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </SectionCard>

            <SectionCard title="Risks">
              <ul className="mt-3 space-y-2 text-white/70">
                {result.risks.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </SectionCard>

            <SectionCard title="Improvement Actions">
              <ul className="mt-3 space-y-2 text-white/70">
                {result.improvementActions.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </SectionCard>
          </div>

          <section className="relative overflow-hidden rounded-[34px] border border-blue-400/25 bg-blue-500/10 p-5 shadow-[0_24px_95px_rgba(0,0,0,0.44)] backdrop-blur-xl md:p-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.10),transparent_36%)]" />

            <div className="relative grid gap-6 lg:grid-cols-[1fr_260px] lg:items-center">
              <div>
                <h3 className="text-2xl font-black text-blue-100">
                  Next Step with KORAX
                </h3>

                <p className="mt-3 text-sm leading-7 text-white/75">
                  {result.koraxConversionNote}
                </p>
              </div>

              <div className="hidden lg:block">
                <KoraxMiniBrand />
              </div>
            </div>
          </section>
        </section>
      ) : null}
    </div>
  );
}