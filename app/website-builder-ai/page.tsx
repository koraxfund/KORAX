"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import {
  ACCESS_MANAGER_ADDRESS,
  RPC_URL,
  accessManagerAbi,
} from "@/lib/korax/contracts";

type WebsiteFile = {
  path: string;
  content: string;
};

type WebsiteResult = {
  websiteName: string;
  summary: string;
  brandDirection: {
    positioning: string;
    tone: string;
    visualIdentity: string;
    trustAngle: string;
  };
  styleGuide: {
    theme: string;
    primaryColor: string;
    secondaryColor: string;
    background: string;
    cardStyle: string;
    fontMood: string;
    buttonStyle: string;
  };
  sections: {
    name: string;
    purpose: string;
    headline: string;
    description: string;
  }[];
  files: WebsiteFile[];
  deploymentNotes: string[];
  koraxPublishingNote: string;
};

type SavedBuilderProject = {
  projectId?: string;
  projectName?: string;
  name?: string;
  symbol?: string;
  category?: string;
  shortDescription?: string;
  description?: string;
  targetAudience?: string;
  websiteLanguage?: string;
  network?: string;
  tokenAddress?: string;
  token?: string;
  vaultAddress?: string;
  vault?: string;
  stakingAddress?: string;
  staking?: string;
  launchpadAddress?: string;
  launchpad?: string;
  websiteStyle?: string;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundStyle?: string;
  xLink?: string;
  telegramLink?: string;
  youtubeLink?: string;
  tiktokLink?: string;
  instagramLink?: string;
  facebookLink?: string;
  discordLink?: string;
  tokenomics?: string;
  roadmap?: string;
  stakingPlans?: string;
  presaleStages?: string;
  txHash?: string;
};

type BuilderAccessState = {
  loading: boolean;
  connected: boolean;
  wallet: string;
  eligibleAmount: string;
  tokensPerProject: string;
  requiredRewardBps: number;
  totalSlots: number;
  hasAccess: boolean;
  error: string;
};


type BuilderForm = {
  projectName: string;
  symbol: string;
  category: string;
  shortDescription: string;
  targetAudience: string;
  websiteLanguage: string;
  websiteStyle: string;
  themeMode: string;
  colorPreset: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundPreset: string;
  backgroundStyle: string;
  network: string;
  tokenAddress: string;
  stakingAddress: string;
  vaultAddress: string;
  launchpadAddress: string;
  xLink: string;
  telegramLink: string;
  youtubeLink: string;
  tiktokLink: string;
  instagramLink: string;
  facebookLink: string;
  discordLink: string;
  websiteSections: string;
  specialInstructions: string;
};

type ValidationIssue = {
  field: string;
  message: string;
};

type GenerationStage =
  | "idle"
  | "validating"
  | "analyzing"
  | "generating"
  | "checking"
  | "ready"
  | "failed";

type PackageHealth = {
  score: number;
  fileCount: number;
  totalBytes: number;
  hasPackageJson: boolean;
  hasPage: boolean;
  hasLayout: boolean;
  hasStyles: boolean;
  hasReadme: boolean;
  hasEnvExample: boolean;
  suspiciousSecrets: string[];
  warnings: string[];
};

const SAVED_WEBSITE_RESULT_KEY = "korax_website_builder_saved_result";
const SAVED_GITHUB_REPO_URL_KEY = "korax_website_builder_github_repo_url";

const WEBSITE_RESULT_DB_NAME = "korax-website-builder";
const WEBSITE_RESULT_STORE_NAME = "generated-websites";
const WEBSITE_RESULT_RECORD_KEY = "latest";
const MAX_GENERATED_FILES = 220;
const MAX_GENERATED_BYTES = 8 * 1024 * 1024;
const MAX_EDIT_HISTORY = 5;
const ZERO_ADDRESS = ethers.ZeroAddress.toLowerCase();

const WEBSITE_STYLE_OPTIONS = [
  "KORAX Beast v4",
  "Premium Dark Web3",
  "Luxury Crypto",
  "Cyberpunk",
  "AI Startup",
  "Investor Focused",
  "Gaming Web3",
  "Black & White Premium",
  "Minimal Clean",
  "Meme Energy",
];

const CATEGORY_OPTIONS = [
  "Web3",
  "AI",
  "Launchpad",
  "Meme",
  "DeFi",
  "Gaming",
  "Move-to-Earn",
  "Community",
  "Utility Token",
];

const COLOR_PRESET_OPTIONS = [
  "Blue Night",
  "Royal Purple",
  "Gold Luxury",
  "Ocean Cyan",
  "Black & White",
  "Neon Green",
  "Red Energy",
  "Orange Fire",
];

const BACKGROUND_PRESET_OPTIONS = [
  "Dark blue / black gradient",
  "Glass dark",
  "Mesh premium",
  "Aurora glow",
  "Deep space",
  "Cyber grid",
  "White clean gradient",
  "Soft minimal light",
];

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-[#020617]/70 px-4 py-3 text-white outline-none placeholder:text-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition focus:border-blue-400/60 focus:bg-[#020617]/90 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]";

const selectClass =
  "w-full rounded-2xl border border-white/10 bg-[#020617]/70 px-4 py-3 text-white outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition focus:border-blue-400/60 focus:bg-[#020617]/90 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]";

const primaryButtonClass =
  "rounded-2xl bg-blue-500 px-6 py-4 font-black text-white shadow-[0_0_38px_rgba(59,130,246,0.28)] transition hover:scale-[1.01] hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50";

const smallPrimaryButtonClass =
  "rounded-2xl bg-blue-500 px-5 py-3 font-black text-white shadow-[0_0_30px_rgba(59,130,246,0.22)] transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60";

const glassButtonClass =
  "rounded-2xl border border-blue-300/25 bg-blue-500/10 px-5 py-3 font-black text-blue-100 transition hover:bg-blue-500/20";

async function copyToClipboard(text: string) {
  if (!text) {
    throw new Error("Nothing is available to copy.");
  }

  await navigator.clipboard.writeText(text);
}

function cleanDownloadName(value: string) {
  return (
    value
      ?.toLowerCase()
      .replace(/[^a-z0-9-_]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "korax-generated-website"
  );
}

function cleanRepositoryName(value: string) {
  return cleanDownloadName(value).replace(/^-+|-+$/g, "").slice(0, 80);
}

function formatTokenAmount(raw: bigint) {
  const value = Number(ethers.formatUnits(raw, 18));

  if (!Number.isFinite(value)) {
    return "0";
  }

  return value.toLocaleString("en-US", {
    maximumFractionDigits: 4,
  });
}

function formatBytes(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "0 B";
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;

  return `${(value / (1024 * 1024)).toFixed(2)} MB`;
}

function readSavedBuilderProject(): SavedBuilderProject | null {
  if (typeof window === "undefined") return null;

  const storageKeys = [
    "korax_last_project",
    "korax_last_deployed_project",
    "korax_builder_project",
    "korax_generated_project",
  ];

  for (const key of storageKeys) {
    const raw = window.localStorage.getItem(key);
    if (!raw) continue;

    try {
      const parsed = JSON.parse(raw);

      if (parsed && typeof parsed === "object") {
        return parsed as SavedBuilderProject;
      }
    } catch {
      continue;
    }
  }

  return null;
}

function openWebsiteResultDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      reject(new Error("IndexedDB is unavailable."));
      return;
    }

    const request = window.indexedDB.open(WEBSITE_RESULT_DB_NAME, 1);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(WEBSITE_RESULT_STORE_NAME)) {
        database.createObjectStore(WEBSITE_RESULT_STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error || new Error("Failed to open website storage."));
  });
}

async function readSavedWebsiteResult(): Promise<WebsiteResult | null> {
  if (typeof window === "undefined") return null;

  try {
    const database = await openWebsiteResultDatabase();

    const result = await new Promise<unknown>((resolve, reject) => {
      const transaction = database.transaction(
        WEBSITE_RESULT_STORE_NAME,
        "readonly"
      );

      const request = transaction
        .objectStore(WEBSITE_RESULT_STORE_NAME)
        .get(WEBSITE_RESULT_RECORD_KEY);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () =>
        reject(request.error || new Error("Failed to read saved website."));
    });

    database.close();

    if (result && typeof result === "object") {
      return normalizeWebsiteResult(result);
    }
  } catch {
    // Fall back to the legacy localStorage record below.
  }

  const legacyRaw = window.localStorage.getItem(SAVED_WEBSITE_RESULT_KEY);
  if (!legacyRaw) return null;

  try {
    return normalizeWebsiteResult(JSON.parse(legacyRaw));
  } catch {
    return null;
  }
}

async function saveWebsiteResult(result: WebsiteResult | null) {
  if (
    typeof window === "undefined" ||
    !result?.files?.length
  ) {
    return;
  }

  try {
    const database = await openWebsiteResultDatabase();

    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(
        WEBSITE_RESULT_STORE_NAME,
        "readwrite"
      );

      transaction
        .objectStore(WEBSITE_RESULT_STORE_NAME)
        .put(result, WEBSITE_RESULT_RECORD_KEY);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () =>
        reject(transaction.error || new Error("Failed to save website."));
      transaction.onabort = () =>
        reject(transaction.error || new Error("Website save was aborted."));
    });

    database.close();
    window.localStorage.removeItem(SAVED_WEBSITE_RESULT_KEY);
  } catch {
    try {
      window.localStorage.setItem(
        SAVED_WEBSITE_RESULT_KEY,
        JSON.stringify(result)
      );
    } catch {
      // Large generated packages can exceed localStorage. IndexedDB remains
      // the preferred storage path and generation should still stay usable.
    }
  }
}

async function clearSavedWebsiteResult() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(SAVED_WEBSITE_RESULT_KEY);

  try {
    const database = await openWebsiteResultDatabase();

    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(
        WEBSITE_RESULT_STORE_NAME,
        "readwrite"
      );

      transaction
        .objectStore(WEBSITE_RESULT_STORE_NAME)
        .delete(WEBSITE_RESULT_RECORD_KEY);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () =>
        reject(transaction.error || new Error("Failed to clear website."));
    });

    database.close();
  } catch {
    // Nothing else is required when IndexedDB is unavailable.
  }
}

function saveGitHubRepoUrl(url: string) {
  if (typeof window === "undefined") return;

  if (!url) {
    window.localStorage.removeItem(SAVED_GITHUB_REPO_URL_KEY);
    return;
  }

  window.localStorage.setItem(SAVED_GITHUB_REPO_URL_KEY, url);
}

function readSavedGitHubRepoUrl() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(SAVED_GITHUB_REPO_URL_KEY) || "";
}

function normalizeWebsiteFiles(input: unknown): WebsiteFile[] {
  if (!Array.isArray(input)) {
    throw new Error("The generated response does not contain website files.");
  }

  const uniqueFiles = new Map<string, string>();
  let totalBytes = 0;

  for (const rawFile of input) {
    if (!rawFile || typeof rawFile !== "object") continue;

    const rawPath = String(
      (rawFile as { path?: unknown }).path || ""
    )
      .replace(/\\/g, "/")
      .replace(/^\.\/+/, "")
      .trim();

    const content = String(
      (rawFile as { content?: unknown }).content ?? ""
    );

    if (
      !rawPath ||
      rawPath.startsWith("/") ||
      rawPath.includes("../") ||
      rawPath.includes("..\\") ||
      rawPath.includes("\0")
    ) {
      throw new Error(`Unsafe generated file path: ${rawPath || "empty path"}`);
    }

    if (uniqueFiles.has(rawPath)) {
      throw new Error(`Duplicate generated file path: ${rawPath}`);
    }

    totalBytes += new TextEncoder().encode(content).length;

    if (totalBytes > MAX_GENERATED_BYTES) {
      throw new Error(
        `Generated package is larger than ${formatBytes(
          MAX_GENERATED_BYTES
        )}. Reduce the requested scope and generate again.`
      );
    }

    uniqueFiles.set(rawPath, content);
  }

  const files = Array.from(uniqueFiles, ([path, content]) => ({
    path,
    content,
  }));

  if (!files.length) {
    throw new Error("The generated package contains no usable files.");
  }

  if (files.length > MAX_GENERATED_FILES) {
    throw new Error(
      `Generated package contains ${files.length} files. The current limit is ${MAX_GENERATED_FILES}.`
    );
  }

  return files.sort((first, second) =>
    first.path.localeCompare(second.path)
  );
}

function normalizeWebsiteResult(input: unknown): WebsiteResult {
  if (!input || typeof input !== "object") {
    throw new Error("Website Builder AI returned an invalid result.");
  }

  const raw = input as Partial<WebsiteResult>;
  const files = normalizeWebsiteFiles(raw.files);

  const brandDirection = raw.brandDirection || {
    positioning: "",
    tone: "",
    visualIdentity: "",
    trustAngle: "",
  };

  const styleGuide = raw.styleGuide || {
    theme: "",
    primaryColor: "",
    secondaryColor: "",
    background: "",
    cardStyle: "",
    fontMood: "",
    buttonStyle: "",
  };

  const sections = Array.isArray(raw.sections)
    ? raw.sections.map((section, index) => ({
        name: String(section?.name || `Section ${index + 1}`),
        purpose: String(section?.purpose || ""),
        headline: String(section?.headline || ""),
        description: String(section?.description || ""),
      }))
    : [];

  return {
    websiteName: String(raw.websiteName || "KORAX Generated Website"),
    summary: String(raw.summary || ""),
    brandDirection: {
      positioning: String(brandDirection.positioning || ""),
      tone: String(brandDirection.tone || ""),
      visualIdentity: String(brandDirection.visualIdentity || ""),
      trustAngle: String(brandDirection.trustAngle || ""),
    },
    styleGuide: {
      theme: String(styleGuide.theme || ""),
      primaryColor: String(styleGuide.primaryColor || ""),
      secondaryColor: String(styleGuide.secondaryColor || ""),
      background: String(styleGuide.background || ""),
      cardStyle: String(styleGuide.cardStyle || ""),
      fontMood: String(styleGuide.fontMood || ""),
      buttonStyle: String(styleGuide.buttonStyle || ""),
    },
    sections,
    files,
    deploymentNotes: Array.isArray(raw.deploymentNotes)
      ? raw.deploymentNotes.map((item) => String(item))
      : [],
    koraxPublishingNote: String(raw.koraxPublishingNote || ""),
  };
}

function calculatePackageHealth(result: WebsiteResult | null): PackageHealth {
  if (!result?.files?.length) {
    return {
      score: 0,
      fileCount: 0,
      totalBytes: 0,
      hasPackageJson: false,
      hasPage: false,
      hasLayout: false,
      hasStyles: false,
      hasReadme: false,
      hasEnvExample: false,
      suspiciousSecrets: [],
      warnings: [],
    };
  }

  const paths = result.files.map((file) => file.path.toLowerCase());
  const totalBytes = result.files.reduce(
    (sum, file) => sum + new TextEncoder().encode(file.content).length,
    0
  );

  const hasPackageJson = paths.includes("package.json");
  const hasPage = paths.some((path) =>
    [
      "app/page.tsx",
      "app/page.jsx",
      "src/app/page.tsx",
      "src/app/page.jsx",
      "pages/index.tsx",
      "pages/index.jsx",
    ].includes(path)
  );

  const hasLayout = paths.some((path) =>
    [
      "app/layout.tsx",
      "app/layout.jsx",
      "src/app/layout.tsx",
      "src/app/layout.jsx",
    ].includes(path)
  );

  const hasStyles = paths.some(
    (path) =>
      path.endsWith(".css") ||
      path.endsWith(".scss") ||
      path === "tailwind.config.ts" ||
      path === "tailwind.config.js"
  );

  const hasReadme = paths.some((path) => path.startsWith("readme"));
  const hasEnvExample = paths.some(
    (path) => path === ".env.example" || path === ".env.local.example"
  );

  const suspiciousSecrets: string[] = [];

  for (const file of result.files) {
    const matches = file.content.match(
      /(?:sk-[a-z0-9_-]{16,}|ghp_[a-z0-9]{20,}|github_pat_[a-z0-9_]{20,}|vercel_[a-z0-9_-]{20,})/gi
    );

    if (matches?.length) {
      suspiciousSecrets.push(file.path);
    }
  }

  const warnings: string[] = [];

  if (!hasPackageJson) warnings.push("package.json is missing.");
  if (!hasPage) warnings.push("A main page entry file is missing.");
  if (!hasLayout) warnings.push("An App Router layout file is missing.");
  if (!hasStyles) warnings.push("No stylesheet or Tailwind config was found.");
  if (!hasReadme) warnings.push("README deployment instructions are missing.");
  if (!hasEnvExample) warnings.push(".env.example is missing.");
  if (suspiciousSecrets.length) {
    warnings.push("Possible secret values were detected in generated files.");
  }

  const checks = [
    hasPackageJson,
    hasPage,
    hasLayout,
    hasStyles,
    hasReadme,
    hasEnvExample,
    suspiciousSecrets.length === 0,
  ];

  return {
    score: Math.round(
      (checks.filter(Boolean).length / checks.length) * 100
    ),
    fileCount: result.files.length,
    totalBytes,
    hasPackageJson,
    hasPage,
    hasLayout,
    hasStyles,
    hasReadme,
    hasEnvExample,
    suspiciousSecrets,
    warnings,
  };
}

function isValidHexColor(value: string) {
  return /^#[0-9a-f]{6}$/i.test(value.trim());
}

function isValidOptionalUrl(value: string) {
  const normalized = value.trim();
  if (!normalized) return true;

  try {
    const url = new URL(normalized);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function validateBuilderForm(form: BuilderForm): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (form.projectName.trim().length < 2) {
    issues.push({
      field: "Project Name",
      message: "Enter a project name with at least 2 characters.",
    });
  }

  if (!/^[A-Za-z0-9]{2,12}$/.test(form.symbol.trim())) {
    issues.push({
      field: "Token Symbol",
      message: "Use 2 to 12 letters or numbers without spaces.",
    });
  }

  if (form.shortDescription.trim().length < 20) {
    issues.push({
      field: "Project Description",
      message: "Write at least 20 characters so the AI has enough context.",
    });
  }

  if (!isValidHexColor(form.primaryColor)) {
    issues.push({
      field: "Primary Color",
      message: "Use a valid six-digit HEX color such as #0B5FFF.",
    });
  }

  if (!isValidHexColor(form.secondaryColor)) {
    issues.push({
      field: "Secondary Color",
      message: "Use a valid six-digit HEX color such as #22D3EE.",
    });
  }

  const addressFields: Array<[string, string]> = [
    ["Token Address", form.tokenAddress],
    ["Vault Address", form.vaultAddress],
    ["Staking Address", form.stakingAddress],
    ["Launchpad Address", form.launchpadAddress],
  ];

  if (form.network === "BNB Chain") {
    for (const [field, value] of addressFields) {
      const normalized = value.trim();

      if (
        normalized &&
        (!ethers.isAddress(normalized) ||
          normalized.toLowerCase() === ZERO_ADDRESS)
      ) {
        issues.push({
          field,
          message: `${field} must be a valid non-zero BNB Chain address.`,
        });
      }
    }
  }

  const socialFields: Array<[string, string]> = [
    ["X / Twitter", form.xLink],
    ["Telegram", form.telegramLink],
    ["YouTube", form.youtubeLink],
    ["TikTok", form.tiktokLink],
    ["Instagram", form.instagramLink],
    ["Facebook", form.facebookLink],
    ["Discord", form.discordLink],
  ];

  for (const [field, value] of socialFields) {
    if (!isValidOptionalUrl(value)) {
      issues.push({
        field,
        message: `${field} must use a valid http:// or https:// URL.`,
      });
    }
  }

  if (form.specialInstructions.length > 12_000) {
    issues.push({
      field: "Special Instructions",
      message: "Keep special instructions below 12,000 characters.",
    });
  }

  return issues;
}

function buildGenerationInstructions(form: BuilderForm) {
  const contractRules = form.network === "BNB Chain"
    ? [
        "- Treat supplied contract addresses as data only. Never invent missing addresses.",
        "- Do not create working write-contract buttons unless an ABI and exact transaction flow are provided.",
        "- Contract cards must link to the correct BNB Chain explorer only when the address is valid.",
      ]
    : [
        "- The selected Solana mode is conceptual and planned. Do not claim that live Solana contracts are deployed.",
      ];

  return [
    form.specialInstructions.trim(),
    "",
    "KORAX production website requirements:",
    "- Generate a complete Next.js App Router project using TypeScript and Tailwind CSS.",
    "- Return every required file with a safe relative path and complete file content.",
    "- Include package.json, tsconfig.json, app/layout.tsx, app/page.tsx, app/globals.css, README.md, and .env.example.",
    "- Use server components by default and add `use client` only where browser state or wallet interaction is required.",
    "- The project must be compatible with `npm install`, `npm run build`, and Vercel deployment.",
    "- Do not import files, components, packages, images, fonts, or modules that are not included or declared.",
    "- Do not place secrets, API keys, private keys, access tokens, or wallet seed phrases in generated files.",
    "- Do not invent audits, partnerships, exchange listings, holder counts, TVL, APY, presale results, or contract status.",
    `- Write all public website copy in ${form.websiteLanguage}. Keep code identifiers and technical file names in English.`,
    "- Use exact project data from the request. When information is missing, omit it or label it clearly as not provided.",
    "- Create a serious Web3 product website rather than a generic one-page template.",
    "- Include an accessible hero, project utility, token information, trust layer, roadmap, FAQ, social links, and risk notice when relevant.",
    "- Use semantic HTML, keyboard-accessible controls, clear focus states, alt text, metadata, responsive layout, and readable contrast.",
    "- Keep mobile animation lightweight and support prefers-reduced-motion.",
    "- Avoid expensive canvas, particle, video, or continuous 3D effects on mobile.",
    "- Prefer local CSS effects and included assets. Do not rely on remote images that require unconfigured Next.js domains.",
    "- Use the selected primary and secondary colors consistently through CSS variables.",
    "- Add a truthful legal/risk notice for crypto-related pages without promising profit, liquidity, listing, or token appreciation.",
    ...contractRules,
    "",
    "Required quality check before returning:",
    "- Verify all imports and paths.",
    "- Verify JSX/TSX syntax.",
    "- Verify package dependencies.",
    "- Verify there are no duplicate file paths.",
    "- Verify the page can render without undefined data.",
    "- Return the complete package, not partial snippets.",
  ]
    .filter(Boolean)
    .join("\n");
}

async function downloadWebsiteZip(files: WebsiteFile[], websiteName: string) {
  if (!files?.length) {
    throw new Error("No website files available for download.");
  }

  const response = await fetch("/api/website-builder/download", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      projectName: websiteName || "korax-generated-website",
      files,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || "Failed to generate ZIP file.");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${cleanDownloadName(websiteName)}-website.zip`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
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
        <span className="text-xs font-black uppercase tracking-[0.22em] text-white/42">
          {label}
        </span>

        {hint ? (
          <span className="text-[11px] text-white/32">{hint}</span>
        ) : null}
      </div>

      {children}
    </label>
  );
}

function SmallCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="website-card-3d rounded-2xl border border-white/10 bg-[#020617]/55 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="text-[11px] font-black uppercase tracking-[0.2em] text-white/35">
        {label}
      </div>

      <div className="mt-2 break-words text-sm font-semibold leading-relaxed text-white/80">
        {value || "Not provided"}
      </div>
    </div>
  );
}

function SectionBox({
  id,
  title,
  eyebrow,
  children,
  right,
}: {
  id?: string;
  title: string;
  eyebrow?: string;
  children: ReactNode;
  right?: ReactNode;
}) {
  return (
    <section
      id={id}
      className="website-section-card relative overflow-hidden rounded-[32px] border border-white/10 bg-[#020617]/55 p-5 shadow-[0_24px_95px_rgba(0,0,0,0.48)] backdrop-blur-xl md:p-6"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.10),transparent_36%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:42px_42px]" />

      <div className="relative">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            {eyebrow ? (
              <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-100/60">
                {eyebrow}
              </p>
            ) : null}

            <h2 className="mt-2 text-2xl font-black text-white">{title}</h2>
          </div>

          {right}
        </div>

        {children}
      </div>
    </section>
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
          ? "border-blue-300/30 bg-blue-500/12 text-blue-100 shadow-[0_0_24px_rgba(59,130,246,0.16)]"
          : "border-white/10 bg-white/[0.04] text-white/48",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function PipelineStep({
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
        "website-card-3d rounded-2xl border p-4 transition",
        active
          ? "border-blue-300/30 bg-blue-500/10"
          : "border-white/10 bg-white/[0.035]",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <div
          className={[
            "flex h-10 w-10 items-center justify-center rounded-2xl text-xs font-black",
            active
              ? "bg-blue-500 text-white shadow-[0_0_28px_rgba(59,130,246,0.35)]"
              : "bg-white/10 text-white/55",
          ].join(" ")}
        >
          {index}
        </div>

        <div className="font-black text-white">{title}</div>
      </div>

      <p className="mt-3 text-sm leading-6 text-white/58">{text}</p>
    </div>
  );
}

function AccessGateCard({
  loading,
  connected,
  hasAccess,
  isAdminWallet,
  tokensPerProject,
  eligibleAmount,
  totalSlots,
  requiredRewardBps,
  error,
}: {
  loading: boolean;
  connected: boolean;
  hasAccess: boolean;
  isAdminWallet: boolean;
  tokensPerProject: string;
  eligibleAmount: string;
  totalSlots: number;
  requiredRewardBps: number;
  error: string;
}) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-[32px] border p-5 shadow-[0_24px_95px_rgba(0,0,0,0.42)] backdrop-blur-xl md:p-6",
        hasAccess
          ? "border-blue-300/30 bg-blue-500/10"
          : "border-yellow-300/20 bg-yellow-300/10",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.08),transparent_36%)]" />

      <div className="relative">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-100/60">
              Builder Access
            </p>

            <h3 className="mt-2 text-xl font-black text-white">
              Stake {tokensPerProject || "1,500"} KRX to unlock Website Builder
              AI
            </h3>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/64">
              KORAX Website Builder AI is wallet-gated. Users must unlock the
              Builder Package through the 12-month staking plan before
              generating, publishing, or deploying premium websites.
            </p>
          </div>

          <StatusPill active={hasAccess}>
            {loading
              ? "Checking"
              : hasAccess
              ? "Unlocked"
              : connected
              ? "Locked"
              : "Wallet Required"}
          </StatusPill>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <SmallCard
            label="Eligible Stake"
            value={
              isAdminWallet
                ? "Admin override"
                : connected
                ? `${eligibleAmount} KRX`
                : "Connect wallet"
            }
          />
          <SmallCard
            label="Required Package"
            value={`${tokensPerProject} KRX`}
          />
          <SmallCard
            label="Required Plan"
            value={`12 Months / ${(
              requiredRewardBps / 100
            ).toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}%`}
          />
          <SmallCard
            label="Project Slots"
            value={isAdminWallet ? "Testing unlocked" : String(totalSlots || 0)}
          />
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm leading-7 text-white/68">
          {loading ? (
            "Checking Builder Package access..."
          ) : !connected ? (
            <>
              Connect your wallet to check Builder Package access. The required
              package is{" "}
              <span className="font-black text-white">
                {tokensPerProject} KRX
              </span>{" "}
              staked on the 12-month staking plan.
            </>
          ) : hasAccess ? (
            <>
              {isAdminWallet
                ? "Admin wallet unlocked. You can test Website Builder AI without staking."
                : "Builder Package unlocked. You can use Website Builder AI, GitHub publishing, and Vercel deployment flow."}
            </>
          ) : (
            <>
              Website Builder AI is locked. Stake{" "}
              <span className="font-black text-white">
                {tokensPerProject} KRX
              </span>{" "}
              on the 12-month plan to unlock Token Builder AI, Website Builder
              AI, and future launch tools.
            </>
          )}

          {error ? <div className="mt-2 text-red-200">{error}</div> : null}
        </div>
      </div>
    </div>
  );
}

function KoraxMiniLogo() {
  return (
    <div className="relative hidden h-20 w-20 shrink-0 items-center justify-center rounded-[28px] border border-blue-300/20 bg-blue-500/10 shadow-[0_0_48px_rgba(59,130,246,0.26)] lg:flex">
      <div className="absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.24),transparent_60%)]" />
      <img
        src="/Korax-logo.png"
        alt="KORAX"
        className="website-logo-spin relative h-14 w-14 object-contain drop-shadow-[0_0_24px_rgba(59,130,246,0.8)]"
      />
    </div>
  );
}

function WebsiteBuilderEngineVisual() {
  return (
    <div className="relative min-h-[380px] overflow-hidden rounded-[36px] border border-white/10 bg-[#020617] shadow-[0_34px_120px_rgba(0,0,0,0.68)] md:min-h-[520px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.18),transparent_34%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.20),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.9),transparent_44%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="website-orbit absolute left-1/2 top-1/2 h-[310px] w-[310px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-300/10" />
      <div className="website-orbit website-orbit-two absolute left-1/2 top-1/2 h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />

      <svg
        className="absolute inset-0 h-full w-full opacity-80"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="websitePathGlow">
            <feGaussianBlur stdDeviation="0.35" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {[
          "M 8 20 C 27 27, 35 39, 50 50",
          "M 92 20 C 73 27, 65 39, 50 50",
          "M 8 80 C 27 73, 35 61, 50 50",
          "M 92 80 C 73 73, 65 61, 50 50",
          "M 50 5 C 50 25, 50 37, 50 50",
          "M 50 95 C 50 75, 50 63, 50 50",
        ].map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="rgba(180,220,255,0.22)"
            strokeLinecap="round"
            strokeWidth="0.72"
            filter="url(#websitePathGlow)"
          />
        ))}
      </svg>

      <div className="absolute left-[7%] top-[14%] rounded-2xl border border-blue-300/15 bg-black/38 p-4 shadow-[0_18px_55px_rgba(0,0,0,0.4)] website-float-slow">
        <div className="text-xs font-black uppercase tracking-[0.22em] text-blue-100">
          Input
        </div>
        <div className="mt-2 text-lg font-black text-white">Project Data</div>
        <div className="mt-3 h-1.5 w-40 rounded-full bg-white/10">
          <div className="h-full w-4/5 rounded-full bg-blue-400 shadow-[0_0_16px_rgba(59,130,246,0.55)]" />
        </div>
      </div>

      <div className="absolute right-[7%] top-[18%] rounded-2xl border border-cyan-300/15 bg-black/38 p-4 shadow-[0_18px_55px_rgba(0,0,0,0.4)] website-float">
        <div className="text-xs font-black uppercase tracking-[0.22em] text-cyan-100">
          Output
        </div>
        <div className="mt-2 text-lg font-black text-white">Website ZIP</div>
        <div className="mt-3 h-1.5 w-40 rounded-full bg-white/10">
          <div className="h-full w-3/4 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.55)]" />
        </div>
      </div>

      <div className="absolute left-1/2 top-[47%] z-10 flex h-[188px] w-[188px] -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-[48px] border border-blue-200/20 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.99))] shadow-[0_0_78px_rgba(59,130,246,0.28)] website-ai-core">
        <div className="absolute inset-[10px] rounded-[38px] border border-cyan-200/15 shadow-[inset_0_0_34px_rgba(34,211,238,0.14)]" />
        <div className="website-center-dot" />

        <div className="website-pulse-line website-pulse-left" />
        <div className="website-pulse-line website-pulse-right" />
        <div className="website-pulse-line website-pulse-top" />
        <div className="website-pulse-line website-pulse-bottom" />

        <div className="website-pulse-line website-pulse-left website-delay-1" />
        <div className="website-pulse-line website-pulse-right website-delay-1" />
        <div className="website-pulse-line website-pulse-top website-delay-1" />
        <div className="website-pulse-line website-pulse-bottom website-delay-1" />

        <div className="relative z-10 text-center">
          <img
            src="/Korax-logo.png"
            alt="KORAX"
            className="website-logo-spin mx-auto h-16 w-16 object-contain drop-shadow-[0_0_30px_rgba(59,130,246,0.85)]"
          />

          <div
            className="mt-2 text-[42px] font-black tracking-[0.08em] text-white"
            style={{
              textShadow:
                "0 0 12px rgba(255,255,255,0.7), 0 0 34px rgba(59,130,246,0.45)",
            }}
          >
            AI
          </div>

          <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/65">
            Website Engine
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 z-10 w-[88%] -translate-x-1/2 rounded-[28px] border border-white/10 bg-black/42 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.38)]">
        <div className="grid grid-cols-3 gap-3">
          {["Build", "GitHub", "Vercel"].map((label, index) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/[0.035] p-3"
            >
              <div className="text-xs font-black uppercase tracking-[0.18em] text-white/58">
                {label}
              </div>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                <span
                  className="block h-full rounded-full bg-blue-400 shadow-[0_0_18px_rgba(59,130,246,0.55)]"
                  style={{ width: `${64 + index * 13}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes websiteCoreBreath {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
            box-shadow: 0 0 78px rgba(59, 130, 246, 0.28);
          }

          50% {
            transform: translate(-50%, -51%) scale(1.025);
            box-shadow: 0 0 96px rgba(34, 211, 238, 0.2);
          }
        }

        @keyframes websitePulseFromLeft {
          0% {
            transform: translateY(-50%) scaleX(0);
            opacity: 0;
          }

          18% {
            opacity: 1;
          }

          72% {
            transform: translateY(-50%) scaleX(1);
            opacity: 0.92;
          }

          100% {
            transform: translateY(-50%) scaleX(1);
            opacity: 0;
          }
        }

        @keyframes websitePulseFromRight {
          0% {
            transform: translateY(-50%) scaleX(0);
            opacity: 0;
          }

          18% {
            opacity: 1;
          }

          72% {
            transform: translateY(-50%) scaleX(1);
            opacity: 0.92;
          }

          100% {
            transform: translateY(-50%) scaleX(1);
            opacity: 0;
          }
        }

        @keyframes websitePulseFromTop {
          0% {
            transform: translateX(-50%) scaleY(0);
            opacity: 0;
          }

          18% {
            opacity: 1;
          }

          72% {
            transform: translateX(-50%) scaleY(1);
            opacity: 0.92;
          }

          100% {
            transform: translateX(-50%) scaleY(1);
            opacity: 0;
          }
        }

        @keyframes websitePulseFromBottom {
          0% {
            transform: translateX(-50%) scaleY(0);
            opacity: 0;
          }

          18% {
            opacity: 1;
          }

          72% {
            transform: translateX(-50%) scaleY(1);
            opacity: 0.92;
          }

          100% {
            transform: translateX(-50%) scaleY(1);
            opacity: 0;
          }
        }

        @keyframes websiteCenterDot {
          0%,
          58%,
          100% {
            opacity: 0.25;
            transform: translate(-50%, -50%) scale(0.72);
          }

          72% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.25);
          }
        }

        @keyframes websiteFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes websiteFloatSlow {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(8px);
          }
        }

        @keyframes websiteLogoSpin {
          0% {
            transform: rotateY(0deg) rotateX(0deg) translateY(0);
          }

          50% {
            transform: rotateY(180deg) rotateX(7deg) translateY(-3px);
          }

          100% {
            transform: rotateY(360deg) rotateX(0deg) translateY(0);
          }
        }

        @keyframes websiteOrbit {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) scale(1);
            opacity: 0.4;
          }

          50% {
            opacity: 0.8;
          }

          100% {
            transform: translate(-50%, -50%) rotate(360deg) scale(1);
            opacity: 0.4;
          }
        }

        .website-ai-core {
          animation: websiteCoreBreath 5.8s ease-in-out infinite;
          will-change: transform;
        }

        .website-logo-spin {
          transform-style: preserve-3d;
          animation: websiteLogoSpin 8s linear infinite;
          will-change: transform;
        }

        .website-center-dot {
          position: absolute;
          left: 50%;
          top: 50%;
          z-index: 3;
          width: 12px;
          height: 12px;
          border-radius: 999px;
          background: #ffffff;
          box-shadow: 0 0 16px rgba(255, 255, 255, 0.85),
            0 0 34px rgba(59, 130, 246, 0.58),
            0 0 58px rgba(34, 211, 238, 0.38);
          animation: websiteCenterDot 2.6s ease-in-out infinite;
          will-change: transform, opacity;
        }

        .website-pulse-line {
          position: absolute;
          z-index: 2;
          pointer-events: none;
          border-radius: 999px;
          opacity: 0;
          will-change: transform, opacity;
        }

        .website-pulse-left {
          left: 16px;
          top: 50%;
          width: 76px;
          height: 2px;
          transform-origin: left center;
          background: linear-gradient(
            90deg,
            rgba(59, 130, 246, 0),
            rgba(59, 130, 246, 0.76),
            rgba(255, 255, 255, 0.95)
          );
          box-shadow: 0 0 16px rgba(59, 130, 246, 0.46);
          animation: websitePulseFromLeft 2.6s ease-in-out infinite;
        }

        .website-pulse-right {
          right: 16px;
          top: 50%;
          width: 76px;
          height: 2px;
          transform-origin: right center;
          background: linear-gradient(
            270deg,
            rgba(34, 211, 238, 0),
            rgba(34, 211, 238, 0.72),
            rgba(255, 255, 255, 0.95)
          );
          box-shadow: 0 0 16px rgba(34, 211, 238, 0.44);
          animation: websitePulseFromRight 2.6s ease-in-out infinite;
        }

        .website-pulse-top {
          top: 16px;
          left: 50%;
          width: 2px;
          height: 76px;
          transform-origin: top center;
          background: linear-gradient(
            180deg,
            rgba(59, 130, 246, 0),
            rgba(59, 130, 246, 0.76),
            rgba(255, 255, 255, 0.95)
          );
          box-shadow: 0 0 16px rgba(59, 130, 246, 0.46);
          animation: websitePulseFromTop 2.6s ease-in-out infinite;
        }

        .website-pulse-bottom {
          bottom: 16px;
          left: 50%;
          width: 2px;
          height: 76px;
          transform-origin: bottom center;
          background: linear-gradient(
            0deg,
            rgba(34, 211, 238, 0),
            rgba(34, 211, 238, 0.72),
            rgba(255, 255, 255, 0.95)
          );
          box-shadow: 0 0 16px rgba(34, 211, 238, 0.44);
          animation: websitePulseFromBottom 2.6s ease-in-out infinite;
        }

        .website-delay-1 {
          animation-delay: 1.3s;
        }

        .website-float {
          animation: websiteFloat 6s ease-in-out infinite;
        }

        .website-float-slow {
          animation: websiteFloatSlow 7.5s ease-in-out infinite;
        }

        .website-orbit {
          animation: websiteOrbit 16s linear infinite;
        }

        .website-orbit-two {
          animation-duration: 23s;
          animation-direction: reverse;
        }

        @media (max-width: 640px) {
          .website-pulse-left,
          .website-pulse-right {
            width: 58px;
          }

          .website-pulse-top,
          .website-pulse-bottom {
            height: 58px;
          }

          .website-center-dot {
            width: 9px;
            height: 9px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .website-ai-core,
          .website-center-dot,
          .website-pulse-line,
          .website-float,
          .website-float-slow,
          .website-logo-spin,
          .website-orbit {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

export default function WebsiteBuilderAIPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();

  const adminWallet =
    process.env.NEXT_PUBLIC_BUILDER_ADMIN_WALLET?.toLowerCase();

  const isAdminWallet =
    !!address && !!adminWallet && address.toLowerCase() === adminWallet;

  const [form, setForm] = useState<BuilderForm>({
    projectName: "",
    symbol: "",
    category: "Web3",
    shortDescription: "",
    targetAudience: "",
    websiteLanguage: "English",
    websiteStyle: "KORAX Beast v4",
    themeMode: "Dark",
    colorPreset: "Blue Night",
    primaryColor: "#0B5FFF",
    secondaryColor: "#22D3EE",
    backgroundPreset: "Dark blue / black gradient",
    backgroundStyle:
      "Deep dark blue-black futuristic command center with premium Web3 glow",
    network: "BNB Chain",
    tokenAddress: "",
    stakingAddress: "",
    vaultAddress: "",
    launchpadAddress: "",
    xLink: "",
    telegramLink: "",
    youtubeLink: "",
    tiktokLink: "",
    instagramLink: "",
    facebookLink: "",
    discordLink: "",
    websiteSections: "",
    specialInstructions: "",
  });
  const [builderAccess, setBuilderAccess] = useState<BuilderAccessState>({
    loading: false,
    connected: false,
    wallet: "",
    eligibleAmount: "0",
    tokensPerProject: "1,500",
    requiredRewardBps: 9000,
    totalSlots: 0,
    hasAccess: false,
    error: "",
  });

  const hasBuilderAccess = builderAccess.hasAccess || isAdminWallet;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>(
    []
  );
  const [generationStage, setGenerationStage] =
    useState<GenerationStage>("idle");

  const [result, setResult] = useState<WebsiteResult | null>(null);
  const [editHistory, setEditHistory] = useState<WebsiteResult[]>([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [copyStatus, setCopyStatus] = useState("");

  const [loadedProjectFromBuilder, setLoadedProjectFromBuilder] =
    useState(false);
  const [linkedProjectId, setLinkedProjectId] = useState("");
  const [linkedDeploymentTx, setLinkedDeploymentTx] = useState("");

  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState("");
  const [editInstruction, setEditInstruction] = useState("");
  const [editTargetFile, setEditTargetFile] = useState("Entire website");

  const [githubConnected, setGithubConnected] = useState(false);
  const [githubLogin, setGithubLogin] = useState("");
  const [githubProfileUrl, setGithubProfileUrl] = useState("");
  const [checkingGithub, setCheckingGithub] = useState(false);

  const [githubRepoName, setGithubRepoName] = useState("");
  const [githubPrivateRepo, setGithubPrivateRepo] = useState(false);
  const [publishingGithub, setPublishingGithub] = useState(false);
  const [githubStatus, setGithubStatus] = useState("");
  const [githubRepoUrl, setGithubRepoUrl] = useState("");

  const [vercelStatus, setVercelStatus] = useState("");

  const selectedFileData = useMemo(() => {
    if (!result) return null;

    return (
      result.files.find((file) => file.path === selectedFile) || result.files[0]
    );
  }, [result, selectedFile]);

  const packageHealth = useMemo(
    () => calculatePackageHealth(result),
    [result]
  );

  const generationStageLabel: Record<GenerationStage, string> = {
    idle: "Ready for project data",
    validating: "Validating project data",
    analyzing: "Analyzing brand and website requirements",
    generating: "Generating the complete website package",
    checking: "Checking files, paths, and package safety",
    ready: "Website package ready",
    failed: "Generation needs attention",
  };

  useEffect(() => {
    let active = true;

    void (async () => {
      const [savedWebsite, savedRepoUrl] = await Promise.all([
        readSavedWebsiteResult(),
        Promise.resolve(readSavedGitHubRepoUrl()),
      ]);

      if (!active) return;

      if (savedWebsite?.files?.length) {
        setResult(savedWebsite);
        setSelectedFile(savedWebsite.files[0]?.path || "");
        setGithubRepoName(
          cleanRepositoryName(savedWebsite.websiteName || "")
        );
        setGenerationStage("ready");
      }

      if (savedRepoUrl) {
        setGithubRepoUrl(savedRepoUrl);
        setGithubStatus(`Published successfully: ${savedRepoUrl}`);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!result?.files?.length) return;

    const timeout = window.setTimeout(() => {
      void saveWebsiteResult(result);
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [result]);

  useEffect(() => {
    const savedProject = readSavedBuilderProject();

    if (!savedProject) return;

    setForm((prev) => {
      const projectName =
        savedProject.projectName || savedProject.name || prev.projectName;

      const symbol = savedProject.symbol || prev.symbol;

      const shortDescription =
        savedProject.shortDescription ||
        savedProject.description ||
        prev.shortDescription;

      const tokenAddress =
        savedProject.tokenAddress || savedProject.token || prev.tokenAddress;

      const vaultAddress =
        savedProject.vaultAddress || savedProject.vault || prev.vaultAddress;

      const stakingAddress =
        savedProject.stakingAddress ||
        savedProject.staking ||
        prev.stakingAddress;

      const launchpadAddress =
        savedProject.launchpadAddress ||
        savedProject.launchpad ||
        prev.launchpadAddress;

      const generatedInstructions = [
        "Build this website based on the project that was already created through KORAX Token Builder AI.",
        prev.specialInstructions,
        savedProject.projectId ? `Project ID: ${savedProject.projectId}` : "",
        savedProject.txHash
          ? `Deployment transaction: ${savedProject.txHash}`
          : "",
        savedProject.tokenomics ? `Tokenomics: ${savedProject.tokenomics}` : "",
        savedProject.presaleStages
          ? `Presale stages: ${savedProject.presaleStages}`
          : "",
        savedProject.stakingPlans
          ? `Staking plans: ${savedProject.stakingPlans}`
          : "",
        savedProject.roadmap ? `Roadmap: ${savedProject.roadmap}` : "",
        tokenAddress
          ? `Use token contract address in the Contracts section: ${tokenAddress}`
          : "",
        vaultAddress
          ? `Use vault contract address in the Contracts section: ${vaultAddress}`
          : "",
        stakingAddress
          ? `Use staking contract address in the Contracts section: ${stakingAddress}`
          : "",
      ]
        .filter(Boolean)
        .join("\n\n");

      return {
        ...prev,
        projectName,
        symbol,
        category: savedProject.category || prev.category,
        shortDescription,
        targetAudience: savedProject.targetAudience || prev.targetAudience,
        websiteLanguage:
          savedProject.websiteLanguage || prev.websiteLanguage,
        network: savedProject.network || prev.network,

        tokenAddress,
        vaultAddress,
        stakingAddress:
          stakingAddress &&
          stakingAddress !== "0x0000000000000000000000000000000000000000"
            ? stakingAddress
            : "",
        launchpadAddress,

        websiteStyle: savedProject.websiteStyle || prev.websiteStyle,
        primaryColor: savedProject.primaryColor || prev.primaryColor,
        secondaryColor: savedProject.secondaryColor || prev.secondaryColor,
        backgroundStyle: savedProject.backgroundStyle || prev.backgroundStyle,

        xLink: savedProject.xLink || prev.xLink,
        telegramLink: savedProject.telegramLink || prev.telegramLink,
        youtubeLink: savedProject.youtubeLink || prev.youtubeLink,
        tiktokLink: savedProject.tiktokLink || prev.tiktokLink,
        instagramLink: savedProject.instagramLink || prev.instagramLink,
        facebookLink: savedProject.facebookLink || prev.facebookLink,
        discordLink: savedProject.discordLink || prev.discordLink,

        websiteSections: prev.websiteSections,
        specialInstructions: generatedInstructions,
      };
    });

    setLinkedProjectId(savedProject.projectId || "");
    setLinkedDeploymentTx(savedProject.txHash || "");
    setLoadedProjectFromBuilder(true);
  }, []);

  useEffect(() => {
    if (!address || !isConnected) {
      void loadBuilderAccess(undefined);
      return;
    }

    void loadBuilderAccess(address);

    const interval = window.setInterval(() => {
      void loadBuilderAccess(address);
    }, 20_000);

    return () => window.clearInterval(interval);
  }, [address, isConnected]);

  useEffect(() => {
    void checkGithubStatus();

    const params = new URLSearchParams(window.location.search);
    const github = params.get("github");

    if (github === "connected") {
      setGithubStatus("GitHub connected successfully. You can publish now.");

      window.setTimeout(() => {
        document
          .getElementById("github-publish")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 250);
    }

    if (github === "failed_state") {
      setGithubStatus("GitHub connection failed: security state mismatch.");
    }

    if (github === "failed_token") {
      setGithubStatus("GitHub connection failed: token was not received.");
    }

    if (github) {
      params.delete("github");
      const query = params.toString();
      const cleanUrl = `${window.location.pathname}${
        query ? `?${query}` : ""
      }${window.location.hash}`;

      window.history.replaceState({}, "", cleanUrl);
    }
  }, []);

  function update<K extends keyof BuilderForm>(
    key: K,
    value: BuilderForm[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setValidationIssues([]);
  }

  function requireBuilderAccess(action: string) {
    if (hasBuilderAccess) return true;

    const message = `Website Builder AI requires the Builder Package before ${action}. Stake ${builderAccess.tokensPerProject} KRX on the qualifying 12-month plan.`;
    setError(message);
    return false;
  }

  async function checkGithubStatus() {
    try {
      setCheckingGithub(true);

      const res = await fetch("/api/github/status", {
        cache: "no-store",
      });

      const data = await res.json();

      setGithubConnected(Boolean(data?.connected));
      setGithubLogin(data?.login || "");
      setGithubProfileUrl(data?.profileUrl || "");
    } catch {
      setGithubConnected(false);
      setGithubLogin("");
      setGithubProfileUrl("");
    } finally {
      setCheckingGithub(false);
    }
  }

  async function loadBuilderAccess(user?: string) {
    if (!user) {
      setBuilderAccess({
        loading: false,
        connected: false,
        wallet: "",
        eligibleAmount: "0",
        tokensPerProject: "1,500",
        requiredRewardBps: 9000,
        totalSlots: 0,
        hasAccess: false,
        error: "",
      });
      return;
    }

    try {
      setBuilderAccess((prev) => ({
        ...prev,
        loading: true,
        connected: true,
        wallet: user,
        error: "",
      }));

      if (!ACCESS_MANAGER_ADDRESS) {
        throw new Error("Access manager address is missing.");
      }

      const provider = new ethers.JsonRpcProvider(RPC_URL);

      const accessManager = new ethers.Contract(
        ACCESS_MANAGER_ADDRESS,
        accessManagerAbi,
        provider
      );

      const [eligibleAmountRaw, totalSlotsRaw, hasAccessRaw, accessData] =
        await Promise.all([
          accessManager.getEligibleStakedAmount(user),
          accessManager.getProjectSlots(user),
          accessManager.hasKoraxAccess(user),
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

      setBuilderAccess({
        loading: false,
        connected: true,
        wallet: user,
        eligibleAmount: formatTokenAmount(BigInt(eligibleAmountRaw.toString())),
        tokensPerProject: formatTokenAmount(
          BigInt(tokensPerProjectRaw.toString())
        ),
        requiredRewardBps: Number(requiredRewardBpsRaw),
        totalSlots: Number(totalSlotsRaw),
        hasAccess: Boolean(hasAccessRaw),
        error: "",
      });
    } catch (err: any) {
      setBuilderAccess((prev) => ({
        ...prev,
        loading: false,
        connected: Boolean(user),
        wallet: user || "",
        tokensPerProject: prev.tokensPerProject || "1,500",
        error:
          err?.shortMessage ||
          err?.message ||
          "Failed to load builder access.",
      }));
    }
  }

  function applyColorPreset(preset: string) {
    let primary = "#0B5FFF";
    let secondary = "#22D3EE";

    if (preset === "Royal Purple") {
      primary = "#6D28D9";
      secondary = "#A78BFA";
    } else if (preset === "Gold Luxury") {
      primary = "#D4AF37";
      secondary = "#F5E7A1";
    } else if (preset === "Ocean Cyan") {
      primary = "#06B6D4";
      secondary = "#67E8F9";
    } else if (preset === "Black & White") {
      primary = "#FFFFFF";
      secondary = "#A1A1AA";
    } else if (preset === "Neon Green") {
      primary = "#7CFF6A";
      secondary = "#D9FFD2";
    } else if (preset === "Red Energy") {
      primary = "#EF4444";
      secondary = "#FCA5A5";
    } else if (preset === "Orange Fire") {
      primary = "#F97316";
      secondary = "#FDBA74";
    }

    setForm((prev) => ({
      ...prev,
      colorPreset: preset,
      primaryColor: primary,
      secondaryColor: secondary,
    }));
  }

  function applyBackgroundPreset(preset: string) {
    let backgroundStyle =
      "Deep dark blue-black futuristic command center with premium Web3 glow";

    if (preset === "White clean gradient") {
      backgroundStyle = "Soft white minimal gradient";
    } else if (preset === "Glass dark") {
      backgroundStyle = "Dark glassmorphism with deep blue glow";
    } else if (preset === "Mesh premium") {
      backgroundStyle = "Premium mesh gradient with dark luxury atmosphere";
    } else if (preset === "Aurora glow") {
      backgroundStyle = "Aurora glow background with blue green lighting";
    } else if (preset === "Soft minimal light") {
      backgroundStyle = "Soft minimal light background with premium clean feel";
    } else if (preset === "Deep space") {
      backgroundStyle =
        "Deep space dark background with subtle stars and blue light";
    } else if (preset === "Cyber grid") {
      backgroundStyle =
        "Cyber grid background with futuristic dark neon structure";
    }

    setForm((prev) => ({
      ...prev,
      backgroundPreset: preset,
      backgroundStyle,
    }));
  }
  async function generateWebsite() {
    if (loading) return;

    setGenerationStage("validating");
    setError("");
    setValidationIssues([]);

    if (!requireBuilderAccess("generating a website")) {
      setGenerationStage("failed");
      return;
    }

    const issues = validateBuilderForm(form);

    if (issues.length) {
      setValidationIssues(issues);
      setError("Correct the highlighted project data before generation.");
      setGenerationStage("failed");
      return;
    }

    setLoading(true);
    setGenerationStage("analyzing");
    setEditError("");
    setEditInstruction("");
    setDownloadError("");
    setCopyStatus("");

    try {
      setGenerationStage("generating");

      const response = await fetch("/api/website-builder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          symbol: form.symbol.trim().toUpperCase(),
          walletAddress: address || "",
          linkedProjectId,
          linkedDeploymentTx,
          builderAccess: {
            tokensPerProject: builderAccess.tokensPerProject,
            requiredRewardBps: builderAccess.requiredRewardBps,
            totalSlots: builderAccess.totalSlots,
          },
          specialInstructions: buildGenerationInstructions(form),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error ||
            `Website generation failed with status ${response.status}.`
        );
      }

      setGenerationStage("checking");

      const normalizedResult = normalizeWebsiteResult(data?.result);
      const health = calculatePackageHealth(normalizedResult);

      if (health.suspiciousSecrets.length) {
        throw new Error(
          `Generation stopped because possible secret values were detected in: ${health.suspiciousSecrets.join(
            ", "
          )}`
        );
      }

      setResult(normalizedResult);
      setEditHistory([]);
      setSelectedFile(normalizedResult.files[0]?.path || "");
      setGithubRepoName(
        cleanRepositoryName(normalizedResult.websiteName || form.projectName)
      );
      setGithubRepoUrl("");
      setGithubStatus(
        "A new website package was generated. Publish it to GitHub when ready."
      );
      setVercelStatus("");
      saveGitHubRepoUrl("");
      setGenerationStage("ready");

      await saveWebsiteResult(normalizedResult);
    } catch (err: unknown) {
      setGenerationStage("failed");
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while generating the website."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadWebsiteZip() {
    if (downloadingZip) return;

    setDownloadError("");

    if (!requireBuilderAccess("downloading the generated package")) {
      setDownloadError(
        `Stake ${builderAccess.tokensPerProject} KRX on the qualifying 12-month plan first.`
      );
      return;
    }

    setDownloadingZip(true);

    try {
      if (!result?.files?.length) {
        throw new Error("Generate a website first.");
      }

      if (packageHealth.suspiciousSecrets.length) {
        throw new Error(
          "Possible secret values were detected. Remove them before download."
        );
      }

      const safeFiles = normalizeWebsiteFiles(result.files);

      await downloadWebsiteZip(
        safeFiles,
        result.websiteName || form.projectName
      );
    } catch (err: unknown) {
      setDownloadError(
        err instanceof Error ? err.message : "ZIP download failed."
      );
    } finally {
      setDownloadingZip(false);
    }
  }

  function continueToLaunching() {
    if (!requireBuilderAccess("continuing to project launch")) {
      return;
    }

    if (!result?.files?.length) {
      setError("Generate the project website before continuing to Launch.");
      return;
    }

    const existingProject = readSavedBuilderProject() || {};

    const latestProject = {
      ...existingProject,
      projectName: form.projectName,
      symbol: form.symbol.trim().toUpperCase(),
      category: form.category,
      shortDescription: form.shortDescription,
      targetAudience: form.targetAudience,
      websiteLanguage: form.websiteLanguage,
      network: form.network,

      tokenAddress: form.tokenAddress,
      vaultAddress: form.vaultAddress,
      stakingAddress: form.stakingAddress,
      launchpadAddress: form.launchpadAddress,

      xLink: form.xLink,
      telegramLink: form.telegramLink,
      youtubeLink: form.youtubeLink,
      tiktokLink: form.tiktokLink,
      instagramLink: form.instagramLink,
      facebookLink: form.facebookLink,
      discordLink: form.discordLink,

      websiteName: result.websiteName || form.projectName,
      websiteSummary: result.summary || "",
      websiteGenerated: true,
      websiteFilesCount: result.files.length,
      websitePackageScore: packageHealth.score,
      githubRepoUrl,

      websiteStyle: form.websiteStyle,
      themeMode: form.themeMode,
      primaryColor: form.primaryColor,
      secondaryColor: form.secondaryColor,
      backgroundStyle: form.backgroundStyle,
    };

    window.localStorage.setItem(
      "korax_last_project",
      JSON.stringify(latestProject)
    );

    router.push("/launch");
  }

  async function editWebsite() {
    if (editing) return;

    setEditError("");

    if (!requireBuilderAccess("editing the generated website")) {
      setEditError(
        `Stake ${builderAccess.tokensPerProject} KRX on the qualifying 12-month plan first.`
      );
      return;
    }

    setEditing(true);

    try {
      if (!result) {
        throw new Error("Generate a website first.");
      }

      const instruction = editInstruction.trim();

      if (!instruction) {
        throw new Error("Write what you want KORAX AI to change.");
      }

      if (instruction.length > 5_000) {
        throw new Error("Keep the edit instruction below 5,000 characters.");
      }

      if (
        editTargetFile !== "Entire website" &&
        !result.files.some((file) => file.path === editTargetFile)
      ) {
        throw new Error("The selected target file no longer exists.");
      }

      const response = await fetch("/api/website-editor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentWebsite: result,
          walletAddress: address || "",
          editInstruction: [
            instruction,
            "",
            "KORAX editor safety and quality rules:",
            "- Preserve every untouched file and return the complete website package.",
            "- Keep all existing working functionality unless the user explicitly asks to remove it.",
            "- Do not invent contract addresses, audits, partnerships, listings, statistics, or live blockchain status.",
            "- Keep TypeScript, JSX, imports, package dependencies, and file paths consistent.",
            "- Keep the project compatible with npm run build and Vercel.",
            "- Do not add secrets, API keys, private keys, access tokens, or seed phrases.",
            "- Use server components by default and `use client` only where needed.",
            "- Keep mobile performance lightweight and preserve prefers-reduced-motion.",
            "- Do not downgrade the visual quality or remove the chosen brand identity.",
            "- When editing one file, update any dependent files required for a valid build.",
          ].join("\n"),
          targetFile: editTargetFile,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error || `Website edit failed with status ${response.status}.`
        );
      }

      const editedResult = normalizeWebsiteResult(data?.result);
      const editedHealth = calculatePackageHealth(editedResult);

      if (editedHealth.suspiciousSecrets.length) {
        throw new Error(
          `Edit rejected because possible secret values were detected in: ${editedHealth.suspiciousSecrets.join(
            ", "
          )}`
        );
      }

      setEditHistory((current) =>
        [result, ...current].slice(0, MAX_EDIT_HISTORY)
      );
      setResult(editedResult);
      setSelectedFile(
        editedResult.files.some((file) => file.path === editTargetFile)
          ? editTargetFile
          : editedResult.files[0]?.path || ""
      );
      setEditInstruction("");
      setGithubRepoUrl("");
      setGithubStatus(
        "Website changed. Publish again to update or create the GitHub repository."
      );
      setVercelStatus("");
      saveGitHubRepoUrl("");

      await saveWebsiteResult(editedResult);
    } catch (err: unknown) {
      setEditError(
        err instanceof Error ? err.message : "Website edit failed."
      );
    } finally {
      setEditing(false);
    }
  }

  async function undoLastEdit() {
    const previous = editHistory[0];

    if (!previous) {
      setEditError("There is no earlier edit available.");
      return;
    }

    setEditHistory((current) => current.slice(1));
    setResult(previous);
    setSelectedFile(previous.files[0]?.path || "");
    setEditError("");
    setGithubRepoUrl("");
    setGithubStatus(
      "The previous website version was restored. Publish again when ready."
    );
    setVercelStatus("");
    saveGitHubRepoUrl("");

    await saveWebsiteResult(previous);
  }

  async function clearGeneratedWebsite() {
    setResult(null);
    setEditHistory([]);
    setSelectedFile("");
    setEditInstruction("");
    setEditError("");
    setError("");
    setDownloadError("");
    setGithubRepoUrl("");
    setGithubStatus("");
    setVercelStatus("");
    setGenerationStage("idle");
    saveGitHubRepoUrl("");

    await clearSavedWebsiteResult();
  }

  async function handleCopySelectedFile() {
    if (!selectedFileData) return;

    try {
      await copyToClipboard(selectedFileData.content);
      setCopyStatus("File copied");

      window.setTimeout(() => {
        setCopyStatus("");
      }, 1_800);
    } catch (err: unknown) {
      setCopyStatus(
        err instanceof Error ? err.message : "Copy failed"
      );
    }
  }

  async function connectGitHub() {
    if (!requireBuilderAccess("connecting GitHub publishing")) {
      return;
    }

    if (result?.files?.length) {
      await saveWebsiteResult(result);
    }

    window.location.href = "/api/github/oauth/start";
  }

  function openVercelImport() {
    setVercelStatus("");

    if (!requireBuilderAccess("opening Vercel deployment")) {
      setVercelStatus(
        `Stake ${builderAccess.tokensPerProject} KRX on the qualifying 12-month plan first.`
      );
      return;
    }

    if (!githubRepoUrl) {
      setVercelStatus("Publish the generated website to GitHub first.");
      return;
    }

    let repositoryUrl: URL;

    try {
      repositoryUrl = new URL(githubRepoUrl);
    } catch {
      setVercelStatus("The saved GitHub repository URL is invalid.");
      return;
    }

    if (
      repositoryUrl.protocol !== "https:" ||
      repositoryUrl.hostname.toLowerCase() !== "github.com"
    ) {
      setVercelStatus("Only a valid HTTPS GitHub repository can be imported.");
      return;
    }

    const vercelCloneUrl = `https://vercel.com/new/clone?repository-url=${encodeURIComponent(
      repositoryUrl.toString()
    )}`;

    setVercelStatus(
      "Opening Vercel import. The deployment will be created inside the connected user's Vercel account."
    );

    window.open(vercelCloneUrl, "_blank", "noopener,noreferrer");
  }

  async function publishToGitHub() {
    if (publishingGithub) return;

    setGithubStatus("");

    if (!requireBuilderAccess("publishing to GitHub")) {
      setGithubStatus(
        `Stake ${builderAccess.tokensPerProject} KRX on the qualifying 12-month plan first.`
      );
      return;
    }

    setPublishingGithub(true);
    setGithubRepoUrl("");
    setVercelStatus("");
    saveGitHubRepoUrl("");

    try {
      if (!result) {
        throw new Error("Generate a website first.");
      }

      if (!githubConnected) {
        throw new Error("Connect GitHub first, then publish.");
      }

      if (packageHealth.suspiciousSecrets.length) {
        throw new Error(
          "Possible secret values were detected. Remove them before publishing."
        );
      }

      const repoName = cleanRepositoryName(
        githubRepoName.trim() ||
          result.websiteName ||
          "korax-generated-site"
      );

      if (!repoName || !/^[a-z0-9._-]+$/i.test(repoName)) {
        throw new Error(
          "Repository name may contain only letters, numbers, dots, hyphens, and underscores."
        );
      }

      const safeFiles = normalizeWebsiteFiles(result.files);

      const response = await fetch("/api/github/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repoName,
          privateRepo: githubPrivateRepo,
          files: safeFiles,
          walletAddress: address || "",
          description: `Generated by KORAX Website Builder AI for ${result.websiteName}`,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error || `GitHub publish failed with status ${response.status}.`
        );
      }

      const repoUrl = String(data?.repoUrl || "");

      if (!isValidOptionalUrl(repoUrl) || !repoUrl) {
        throw new Error(
          "GitHub publishing completed without a valid repository URL."
        );
      }

      setGithubRepoName(repoName);
      setGithubRepoUrl(repoUrl);
      saveGitHubRepoUrl(repoUrl);
      setGithubStatus(`Published successfully: ${repoUrl}`);
      await checkGithubStatus();
    } catch (err: unknown) {
      setGithubStatus(
        err instanceof Error ? err.message : "GitHub publish failed."
      );
    } finally {
      setPublishingGithub(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[38px] border border-white/10 bg-[#020617]/60 p-5 shadow-[0_34px_130px_rgba(0,0,0,0.62)] backdrop-blur-xl md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.20),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.14),transparent_35%),linear-gradient(135deg,rgba(15,23,42,0.85),rgba(2,6,23,0.95))]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:52px_52px]" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative grid gap-8 xl:grid-cols-[1fr_500px] xl:items-center">
          <div className="max-w-5xl">
            <div className="flex flex-wrap items-center gap-4">
              <KoraxMiniLogo />

              <div className="inline-flex rounded-full border border-blue-300/25 bg-blue-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-blue-100">
                KORAX Website Builder AI / Beast Mode
              </div>
            </div>

            <h1 className="mt-6 text-4xl font-black leading-[0.96] tracking-tight text-white sm:text-6xl xl:text-7xl">
              Generate. Publish.
              <span className="block bg-gradient-to-r from-blue-300 via-cyan-200 to-white bg-clip-text text-transparent">
                Deploy like a real Web3 product.
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-white/68 sm:text-lg">
              KORAX Website Builder AI turns a token project into a premium
              deployment-ready Web3 website package, publishes it to the
              user&apos;s GitHub account, then opens Vercel deployment inside
              the user&apos;s own Vercel account.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatusPill active>{builderAccess.tokensPerProject} KRX Gate</StatusPill>
              <StatusPill active={Boolean(result?.files?.length)}>
                Website Package
              </StatusPill>
              <StatusPill active={githubConnected}>GitHub OAuth</StatusPill>
              <StatusPill active={Boolean(githubRepoUrl)}>
                Vercel Ready
              </StatusPill>
            </div>
          </div>

          <WebsiteBuilderEngineVisual />
        </div>
      </section>

      <AccessGateCard
        loading={builderAccess.loading}
        connected={builderAccess.connected}
        hasAccess={hasBuilderAccess}
        isAdminWallet={isAdminWallet}
        tokensPerProject={builderAccess.tokensPerProject}
        eligibleAmount={builderAccess.eligibleAmount}
        totalSlots={builderAccess.totalSlots}
        requiredRewardBps={builderAccess.requiredRewardBps}
        error={builderAccess.error}
      />

      <section className="grid gap-6 xl:grid-cols-[1fr_430px]">
        <SectionBox
          eyebrow="Website Inputs"
          title="Project website setup"
          right={
            <StatusPill active>
              {loadedProjectFromBuilder ? "Project Loaded" : "Manual Setup"}
            </StatusPill>
          }
        >
          {loadedProjectFromBuilder ? (
            <div className="mt-5 rounded-2xl border border-blue-300/25 bg-blue-500/10 px-4 py-3 text-sm leading-6 text-blue-100">
              Project data loaded automatically from KORAX Builder. Contract
              addresses and project details were added to the Website Builder AI
              form.
            </div>
          ) : null}

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

            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Category">
                <select
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                  className={selectClass}
                >
                  {CATEGORY_OPTIONS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </Field>

              <Field label="Network">
                <select
                  value={form.network}
                  onChange={(e) => update("network", e.target.value)}
                  className={selectClass}
                >
                  <option>BNB Chain</option>
                  <option>Solana — Planned for Future</option>
                </select>
              </Field>

              <Field label="Website Language">
                <select
                  value={form.websiteLanguage}
                  onChange={(e) => update("websiteLanguage", e.target.value)}
                  className={selectClass}
                >
                  <option>English</option>
                  <option>German</option>
                  <option>Arabic</option>
                  <option>French</option>
                  <option>Spanish</option>
                  <option>Turkish</option>
                  <option>Russian</option>
                </select>
              </Field>
            </div>

            <Field label="Project Description">
              <textarea
                value={form.shortDescription}
                onChange={(e) => update("shortDescription", e.target.value)}
                placeholder="Short but strong project description"
                rows={4}
                className={inputClass}
              />
            </Field>

            <Field label="Target Audience">
              <input
                value={form.targetAudience}
                onChange={(e) => update("targetAudience", e.target.value)}
                placeholder="Web3 founders, traders, holders, builders..."
                className={inputClass}
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Website Style">
                <select
                  value={form.websiteStyle}
                  onChange={(e) => update("websiteStyle", e.target.value)}
                  className={selectClass}
                >
                  {WEBSITE_STYLE_OPTIONS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </Field>

              <Field label="Theme Mode">
                <select
                  value={form.themeMode}
                  onChange={(e) => update("themeMode", e.target.value)}
                  className={selectClass}
                >
                  <option>Dark</option>
                  <option>Light</option>
                  <option>Dark with Light Sections</option>
                  <option>System Adaptive</option>
                </select>
              </Field>

              <Field label="Color Preset">
                <select
                  value={form.colorPreset}
                  onChange={(e) => applyColorPreset(e.target.value)}
                  className={selectClass}
                >
                  {COLOR_PRESET_OPTIONS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Primary Color">
                <input
                  value={form.primaryColor}
                  onChange={(e) => update("primaryColor", e.target.value)}
                  placeholder="#0B5FFF"
                  className={inputClass}
                />
              </Field>

              <Field label="Secondary Color">
                <input
                  value={form.secondaryColor}
                  onChange={(e) => update("secondaryColor", e.target.value)}
                  placeholder="#22D3EE"
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Background Preset">
              <select
                value={form.backgroundPreset}
                onChange={(e) => applyBackgroundPreset(e.target.value)}
                className={selectClass}
              >
                {BACKGROUND_PRESET_OPTIONS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </Field>

            <Field label="Background Style">
              <input
                value={form.backgroundStyle}
                onChange={(e) => update("backgroundStyle", e.target.value)}
                placeholder="Background Style"
                className={inputClass}
              />
            </Field>

            <div className="rounded-[28px] border border-blue-300/20 bg-blue-500/10 p-5 shadow-[0_18px_70px_rgba(0,0,0,0.28)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-black text-blue-100">
                    Contract Console
                  </div>
                  <p className="mt-1 text-xs leading-6 text-white/58">
                    These fields can be loaded from KORAX Token Builder AI after
                    deployment.
                  </p>
                </div>

                <StatusPill active>Verified Data Layer</StatusPill>
              </div>

              <div className="mt-5 grid gap-4">
                <input
                  value={form.tokenAddress}
                  onChange={(e) => update("tokenAddress", e.target.value)}
                  placeholder="Token Address"
                  className={inputClass}
                />

                <input
                  value={form.vaultAddress}
                  onChange={(e) => update("vaultAddress", e.target.value)}
                  placeholder="Vault Address"
                  className={inputClass}
                />

                <input
                  value={form.stakingAddress}
                  onChange={(e) => update("stakingAddress", e.target.value)}
                  placeholder="Staking Address"
                  className={inputClass}
                />

                <input
                  value={form.launchpadAddress}
                  onChange={(e) => update("launchpadAddress", e.target.value)}
                  placeholder="Launchpad Address / Sale Reference"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#020617]/45 p-5">
              <div className="text-sm font-black text-white">Social Links</div>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <input
                  value={form.xLink}
                  onChange={(e) => update("xLink", e.target.value)}
                  placeholder="X / Twitter Link"
                  className={inputClass}
                />

                <input
                  value={form.telegramLink}
                  onChange={(e) => update("telegramLink", e.target.value)}
                  placeholder="Telegram Link"
                  className={inputClass}
                />

                <input
                  value={form.youtubeLink}
                  onChange={(e) => update("youtubeLink", e.target.value)}
                  placeholder="YouTube Link"
                  className={inputClass}
                />

                <input
                  value={form.tiktokLink}
                  onChange={(e) => update("tiktokLink", e.target.value)}
                  placeholder="TikTok Link"
                  className={inputClass}
                />

                <input
                  value={form.instagramLink}
                  onChange={(e) => update("instagramLink", e.target.value)}
                  placeholder="Instagram Link"
                  className={inputClass}
                />

                <input
                  value={form.facebookLink}
                  onChange={(e) => update("facebookLink", e.target.value)}
                  placeholder="Facebook Link"
                  className={inputClass}
                />

                <input
                  value={form.discordLink}
                  onChange={(e) => update("discordLink", e.target.value)}
                  placeholder="Discord Link"
                  className={`${inputClass} md:col-span-2 xl:col-span-3`}
                />
              </div>
            </div>

            <Field label="Website Sections">
              <textarea
                value={form.websiteSections}
                onChange={(e) => update("websiteSections", e.target.value)}
                placeholder="Website Sections"
                rows={3}
                className={inputClass}
              />
            </Field>

            <Field label="Special Instructions">
              <textarea
                value={form.specialInstructions}
                onChange={(e) => update("specialInstructions", e.target.value)}
                placeholder="Special Instructions"
                rows={7}
                className={inputClass}
              />
            </Field>

            <button
              onClick={generateWebsite}
              disabled={loading || builderAccess.loading || !hasBuilderAccess}
              className={primaryButtonClass}
            >
              {loading
                ? generationStageLabel[generationStage]
                : builderAccess.loading
                ? "Checking Builder Access..."
                : hasBuilderAccess
                ? "Generate Production Website"
                : `Stake ${builderAccess.tokensPerProject} KRX to Unlock`}
            </button>

            {generationStage !== "idle" ? (
              <div
                className={[
                  "rounded-2xl border px-4 py-3 text-sm leading-7",
                  generationStage === "failed"
                    ? "border-red-500/20 bg-red-500/10 text-red-200"
                    : generationStage === "ready"
                    ? "border-cyan-300/20 bg-cyan-400/10 text-cyan-100"
                    : "border-blue-400/20 bg-blue-500/10 text-blue-100",
                ].join(" ")}
              >
                <div className="font-black">
                  {generationStageLabel[generationStage]}
                </div>

                <div className="mt-1 text-white/60">
                  KORAX validates the project input, generates the full package,
                  checks file paths and required files, then stores the result
                  safely in the browser.
                </div>
              </div>
            ) : null}

            {validationIssues.length ? (
              <div className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.07] p-4 text-sm text-amber-100">
                <div className="font-black">Project data needs correction</div>

                <div className="mt-3 space-y-2">
                  {validationIssues.map((issue) => (
                    <div key={`${issue.field}-${issue.message}`}>
                      <span className="font-black">{issue.field}:</span>{" "}
                      {issue.message}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {error ? (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            ) : null}
          </div>
        </SectionBox>

        <div className="space-y-6">
          <SectionBox eyebrow="Loaded Data" title="Auto-Loaded Project">
            <p className="mt-3 text-sm leading-7 text-white/64">
              When a user deploys a project through KORAX Token Builder AI, this
              page can automatically receive the token, vault, staking
              addresses, project name, symbol, network, and description.
            </p>

            <div className="mt-5 grid gap-3">
              <SmallCard
                label="Project"
                value={form.projectName || "Not loaded yet"}
              />
              <SmallCard
                label="Symbol"
                value={form.symbol || "Not loaded yet"}
              />
              <SmallCard label="Network" value={form.network} />
              <SmallCard
                label="Project ID"
                value={linkedProjectId || "Manual website mode"}
              />
              <SmallCard
                label="Deployment Transaction"
                value={linkedDeploymentTx || "Not loaded"}
              />
              <SmallCard
                label="Token"
                value={form.tokenAddress || "Not loaded yet"}
              />
              <SmallCard
                label="Vault"
                value={form.vaultAddress || "Not loaded yet"}
              />
              <SmallCard
                label="Staking"
                value={form.stakingAddress || "Not loaded / disabled"}
              />
            </div>
          </SectionBox>

          <SectionBox eyebrow="Pipeline" title="KORAX Publishing Layer">
            <p className="mt-3 text-sm leading-7 text-white/64">
              Website Builder AI creates the project website package first.
              GitHub publishing and Vercel deployment are part of the connected
              KORAX builder pipeline.
            </p>

            <div className="mt-5 grid gap-3">
              <PipelineStep
                index="01"
                title="Generate"
                text="KORAX creates the full website package."
                active={Boolean(result?.files?.length)}
              />
              <PipelineStep
                index="02"
                title="Publish"
                text="The generated project is pushed to GitHub."
                active={Boolean(githubRepoUrl)}
              />
              <PipelineStep
                index="03"
                title="Deploy"
                text="The user imports the GitHub repository into Vercel."
                active={Boolean(githubRepoUrl)}
              />
            </div>
          </SectionBox>

          {result ? (
            <SectionBox eyebrow="Output" title="Generated Website">
              <p className="mt-3 text-sm leading-7 text-white/64">
                {result.summary}
              </p>

              <div className="mt-5 grid gap-3">
                <SmallCard label="Website Name" value={result.websiteName} />
                <SmallCard label="Theme" value={result.styleGuide.theme} />
                <SmallCard
                  label="Files Generated"
                  value={String(packageHealth.fileCount)}
                />
                <SmallCard
                  label="Package Size"
                  value={formatBytes(packageHealth.totalBytes)}
                />
                <SmallCard
                  label="Readiness Score"
                  value={`${packageHealth.score}%`}
                />
                <SmallCard
                  label="Primary / Secondary"
                  value={`${result.styleGuide.primaryColor} / ${result.styleGuide.secondaryColor}`}
                />
              </div>

              {packageHealth.warnings.length ? (
                <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/[0.07] p-4 text-xs leading-6 text-amber-100">
                  <div className="font-black">Package checks</div>

                  <div className="mt-2 space-y-1">
                    {packageHealth.warnings.map((warning) => (
                      <div key={warning}>• {warning}</div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4 text-xs leading-6 text-cyan-100">
                  Core package files were found and no obvious secret patterns
                  were detected.
                </div>
              )}
            </SectionBox>
          ) : null}
        </div>
      </section>

      {result ? (
        <section className="space-y-6">
          <SectionBox eyebrow="Brand System" title="Brand Direction">
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <SmallCard
                label="Positioning"
                value={result.brandDirection.positioning}
              />
              <SmallCard label="Tone" value={result.brandDirection.tone} />
              <SmallCard
                label="Visual Identity"
                value={result.brandDirection.visualIdentity}
              />
              <SmallCard
                label="Trust Angle"
                value={result.brandDirection.trustAngle}
              />
            </div>
          </SectionBox>

          <SectionBox eyebrow="Design System" title="Production Style Guide">
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <SmallCard
                label="Theme"
                value={result.styleGuide.theme}
              />
              <SmallCard
                label="Background"
                value={result.styleGuide.background}
              />
              <SmallCard
                label="Card Style"
                value={result.styleGuide.cardStyle}
              />
              <SmallCard
                label="Font Mood"
                value={result.styleGuide.fontMood}
              />
              <SmallCard
                label="Button Style"
                value={result.styleGuide.buttonStyle}
              />
              <SmallCard
                label="Colors"
                value={`${result.styleGuide.primaryColor} / ${result.styleGuide.secondaryColor}`}
              />
            </div>
          </SectionBox>

          <SectionBox eyebrow="Generated Structure" title="Website Sections">
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {result.sections.map((section, index) => (
                <div
                  key={`${section.name}-${index}`}
                  className="website-card-3d rounded-[24px] border border-white/10 bg-[#020617]/45 p-5"
                >
                  <div className="text-xs font-black uppercase tracking-[0.22em] text-blue-100/50">
                    {section.name}
                  </div>

                  <h3 className="mt-3 font-black text-white">
                    {section.headline}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-white/62">
                    {section.description}
                  </p>

                  <p className="mt-3 text-xs leading-6 text-white/40">
                    {section.purpose}
                  </p>
                </div>
              ))}
            </div>
          </SectionBox>

          <SectionBox eyebrow="AI Editing" title="Website Editor AI">
            <p className="mt-3 text-sm leading-7 text-white/64">
              Modify the generated website with simple instructions. You can
              improve the whole website or target a specific file.
            </p>

            <div className="mt-5 grid gap-4">
              <select
                value={editTargetFile}
                onChange={(e) => setEditTargetFile(e.target.value)}
                className={selectClass}
              >
                <option>Entire website</option>
                {result.files.map((file) => (
                  <option key={file.path} value={file.path}>
                    {file.path}
                  </option>
                ))}
              </select>

              <textarea
                value={editInstruction}
                onChange={(e) => setEditInstruction(e.target.value)}
                rows={5}
                placeholder="Example: Make it more luxury, add staking section, change colors to dark blue, add contract cards, make hero stronger..."
                className={inputClass}
              />

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={editWebsite}
                  disabled={editing || !hasBuilderAccess}
                  className={smallPrimaryButtonClass}
                >
                  {editing
                    ? "Editing Website... please wait"
                    : "Apply AI Edit"}
                </button>

                <button
                  type="button"
                  onClick={undoLastEdit}
                  disabled={editing || editHistory.length === 0}
                  className={glassButtonClass}
                >
                  Undo Last Edit
                </button>

                <button
                  type="button"
                  onClick={clearGeneratedWebsite}
                  disabled={editing}
                  className="rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-3 font-black text-red-100 transition hover:bg-red-500/15 disabled:opacity-50"
                >
                  Clear Generated Website
                </button>
              </div>

              <div className="text-xs leading-6 text-white/42">
                Edit history keeps the latest {MAX_EDIT_HISTORY} versions in the
                current browser session. Publishing must be repeated after an
                edit or undo.
              </div>

              {editError ? (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {editError}
                </div>
              ) : null}
            </div>
          </SectionBox>

          <SectionBox eyebrow="Code Package" title="Generated Files">
            <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-sm leading-7 text-white/60">
                Review the generated website package. You can copy a single file
                or download the full website as one ZIP package.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <select
                  value={selectedFileData?.path || ""}
                  onChange={(e) => setSelectedFile(e.target.value)}
                  className={selectClass}
                >
                  {result.files.map((file) => (
                    <option key={file.path} value={file.path}>
                      {file.path}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleDownloadWebsiteZip}
                  disabled={downloadingZip || !hasBuilderAccess}
                  className={smallPrimaryButtonClass}
                >
                  {downloadingZip
                    ? "Preparing ZIP..."
                    : "Download Full Website ZIP"}
                </button>

                <button
                  type="button"
                  onClick={continueToLaunching}
                  disabled={!hasBuilderAccess}
                  className={glassButtonClass}
                >
                  Continue to Launch
                </button>
              </div>
            </div>

            {downloadError ? (
              <div className="mt-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {downloadError}
              </div>
            ) : null}

            {selectedFileData ? (
              <div className="mt-5 overflow-hidden rounded-[24px] border border-white/10 bg-[#020617]/65">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                  <div className="font-mono text-sm text-white">
                    {selectedFileData.path}
                  </div>

                  <div className="flex items-center gap-2">
                    {copyStatus ? (
                      <span className="text-xs font-semibold text-cyan-100">
                        {copyStatus}
                      </span>
                    ) : null}

                    <button
                      type="button"
                      onClick={handleCopySelectedFile}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                    >
                      Copy File
                    </button>
                  </div>
                </div>

                <pre className="max-h-[360px] overflow-auto p-4 text-xs leading-relaxed text-white/75 md:max-h-[560px]">
                  <code>{selectedFileData.content}</code>
                </pre>
              </div>
            ) : null}
          </SectionBox>

          <SectionBox
            id="github-publish"
            eyebrow="GitHub Publishing"
            title="Publish to GitHub"
            right={
              <StatusPill active={githubConnected}>
                {githubConnected ? "Connected" : "Not Connected"}
              </StatusPill>
            }
          >
            <p className="mt-3 text-sm leading-7 text-white/64">
              Connect the user&apos;s GitHub account and publish the generated
              website files into a repository owned by that connected user.
            </p>

            <div className="mt-5 rounded-[28px] border border-white/10 bg-[#020617]/45 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-100/50">
                    GitHub Connection
                  </p>

                  <h3 className="mt-2 text-lg font-black text-white">
                    Publish to the connected user&apos;s GitHub account
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-white/58">
                    KORAX publishes to the GitHub account connected in this
                    browser. It will not publish to KORAX unless that account is
                    connected.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={connectGitHub}
                  disabled={!hasBuilderAccess}
                  className={glassButtonClass}
                >
                  {githubConnected ? "Reconnect GitHub" : "Connect GitHub"}
                </button>
              </div>

              <div className="mt-4">
                {checkingGithub ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/65">
                    Checking GitHub connection...
                  </div>
                ) : githubConnected ? (
                  <div className="rounded-2xl border border-blue-300/25 bg-blue-500/10 px-4 py-3 text-sm text-blue-100">
                    <div className="font-black">
                      GitHub connected successfully.
                    </div>

                    <div className="mt-1 text-white/75">
                      Connected as:{" "}
                      {githubProfileUrl ? (
                        <a
                          href={githubProfileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-black text-cyan-200 underline underline-offset-4"
                        >
                          {githubLogin || "GitHub user"}
                        </a>
                      ) : (
                        <span className="font-black text-cyan-200">
                          {githubLogin || "GitHub user"}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60">
                    GitHub is not connected yet.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              <input
                value={githubRepoName}
                onChange={(e) => setGithubRepoName(e.target.value)}
                placeholder="Repository name, example: my-web3-project"
                className={inputClass}
              />

              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#020617]/45 px-4 py-3 text-sm text-white/80">
                <input
                  type="checkbox"
                  checked={githubPrivateRepo}
                  onChange={(e) => setGithubPrivateRepo(e.target.checked)}
                />
                Create private repository
              </label>

              <button
                type="button"
                onClick={publishToGitHub}
                disabled={
                  publishingGithub || !githubConnected || !hasBuilderAccess
                }
                className={smallPrimaryButtonClass}
              >
                {publishingGithub
                  ? "Publishing... please wait"
                  : githubConnected
                  ? "Publish to GitHub"
                  : "Connect GitHub First"}
              </button>

              {githubStatus ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
                  {githubRepoUrl ? (
                    <a
                      href={githubRepoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-cyan-200 hover:text-white"
                    >
                      {githubStatus}
                    </a>
                  ) : (
                    githubStatus
                  )}
                </div>
              ) : null}
            </div>
          </SectionBox>

          <SectionBox
            eyebrow="Vercel Deployment"
            title="Deploy to the user's own Vercel account"
            right={
              <StatusPill active={Boolean(githubRepoUrl)}>
                {githubRepoUrl ? "Ready" : "GitHub Required"}
              </StatusPill>
            }
          >
            <p className="mt-3 text-sm leading-7 text-white/64">
              After GitHub publishing succeeds, KORAX opens Vercel&apos;s import
              flow for the generated repository. The project is deployed inside
              the user&apos;s own Vercel account. No manual Vercel token is
              required.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <PipelineStep
                index="01"
                title="Generate"
                text="Create the premium website package."
                active={Boolean(result?.files?.length)}
              />
              <PipelineStep
                index="02"
                title="GitHub"
                text="Publish the repository to GitHub."
                active={Boolean(githubRepoUrl)}
              />
              <PipelineStep
                index="03"
                title="Vercel"
                text="Import and deploy through the user's Vercel account."
                active={Boolean(githubRepoUrl)}
              />
            </div>

            <div className="mt-6 grid gap-4">
              {githubRepoUrl ? (
                <div className="rounded-2xl border border-blue-300/20 bg-blue-500/10 p-4 text-sm leading-7 text-white/75">
                  GitHub repository is ready:
                  <div className="mt-2 break-all font-black text-cyan-200">
                    {githubRepoUrl}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-4 text-sm leading-7 text-yellow-100">
                  First publish the generated website to GitHub. After that,
                  Deploy to Vercel becomes available.
                </div>
              )}

              <button
                type="button"
                onClick={openVercelImport}
                disabled={!githubRepoUrl || !hasBuilderAccess}
                className={primaryButtonClass}
              >
                Deploy to Vercel
              </button>

              <div className="grid gap-3 md:grid-cols-2">
                <a
                  href={githubRepoUrl || "#github-publish"}
                  target={githubRepoUrl ? "_blank" : undefined}
                  rel={githubRepoUrl ? "noopener noreferrer" : undefined}
                  className="rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-center font-black text-white transition hover:bg-white/10"
                >
                  Open GitHub Repository
                </a>

                {hasBuilderAccess ? (
                  <a
                    href="/api/vercel/connect"
                    className="rounded-2xl border border-blue-300/20 bg-blue-400/10 px-5 py-3 text-center font-black text-blue-100 transition hover:bg-blue-400/15"
                  >
                    Connect Vercel Integration
                  </a>
                ) : (
                  <span className="rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-3 text-center font-black text-white/35">
                    Builder Access Required
                  </span>
                )}
              </div>

              {vercelStatus ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-white/80">
                  {vercelStatus}
                </div>
              ) : null}

              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-xs leading-6 text-white/45">
                The old Vercel token field was removed. This flow is safer for
                users because deployment happens through Vercel&apos;s own import
                screen inside the user&apos;s account. Native one-click Vercel
                deployment can be added later after completing the full
                integration installation token flow.
              </div>
            </div>
          </SectionBox>

          {result.deploymentNotes.length ? (
            <SectionBox
              eyebrow="Deployment Notes"
              title="Generated production instructions"
            >
              <div className="mt-5 grid gap-3">
                {result.deploymentNotes.map((note, index) => (
                  <div
                    key={`${note}-${index}`}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm leading-7 text-white/62"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-blue-400/20 bg-blue-500/10 text-[10px] font-black text-blue-100">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {note}
                  </div>
                ))}
              </div>
            </SectionBox>
          ) : null}

          <section className="relative overflow-hidden rounded-[32px] border border-blue-300/25 bg-blue-500/10 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.4)] md:p-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.10),transparent_36%)]" />

            <div className="relative">
              <h2 className="text-2xl font-black text-blue-100">
                KORAX Publishing Note
              </h2>

              <p className="mt-3 text-sm leading-7 text-white/75">
                {result.koraxPublishingNote}
              </p>

              <div className="mt-5 rounded-2xl border border-white/10 bg-[#020617]/45 p-4 text-sm leading-7 text-white/65">
                Current flow: KORAX generates and validates the website package,
                publishes it to the connected user&apos;s GitHub account, then opens
                Vercel import for user-owned deployment. The Builder Package gate
                is checked before generation, editing, download, publishing, and
                deployment actions.
              </div>
            </div>
          </section>
        </section>
      ) : null}

      <style jsx global>{`
        .website-card-3d {
          transform-style: preserve-3d;
          transition:
            transform 240ms ease,
            border-color 240ms ease,
            background 240ms ease,
            box-shadow 240ms ease;
        }

        .website-card-3d:hover {
          transform: translateY(-3px) perspective(900px) rotateX(1.4deg);
          border-color: rgba(96, 165, 250, 0.28);
          box-shadow: 0 18px 65px rgba(0, 0, 0, 0.38);
        }

        .website-section-card {
          transform-style: preserve-3d;
        }

        .website-section-card::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            120deg,
            transparent,
            rgba(255, 255, 255, 0.04),
            transparent
          );
          transform: translateX(-120%);
          animation: websiteCardShimmer 8s ease-in-out infinite;
        }

        @keyframes websiteCardShimmer {
          0%,
          74% {
            transform: translateX(-120%);
            opacity: 0;
          }

          82% {
            opacity: 1;
          }

          100% {
            transform: translateX(120%);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .website-card-3d,
          .website-section-card::after {
            animation: none;
            transition: none;
          }

          .website-card-3d:hover {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}