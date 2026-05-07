"use client";

import { useMemo, useState } from "react";
import JSZip from "jszip";

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

const WEBSITE_STYLE_OPTIONS = [
  "Premium Dark Web3",
  "Luxury Crypto",
  "Cyberpunk",
  "Minimal Clean",
  "Meme Energy",
  "Investor Focused",
  "AI Startup",
  "Gaming Web3",
  "Corporate Light",
  "Black & White Premium",
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

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

async function downloadWebsiteZip(files: WebsiteFile[], websiteName: string) {
  const zip = new JSZip();

  for (const file of files) {
    const cleanPath = file.path.replace(/^\/+/, "");
    zip.file(cleanPath, file.content);
  }

  const cleanName =
    websiteName
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "korax-website";

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${cleanName}.zip`;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

function SmallCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="text-xs text-white/45">{label}</div>
      <div className="mt-1 text-sm font-semibold leading-relaxed text-white">
        {value || "Not provided"}
      </div>
    </div>
  );
}

function SectionBox({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[26px] border border-white/10 bg-black/20 p-5 shadow-[0_16px_45px_rgba(0,0,0,0.28)] md:rounded-[30px] md:p-6 md:shadow-[0_22px_80px_rgba(0,0,0,0.35)]">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      {children}
    </section>
  );
}

/**
 * Lightweight AI visual.
 * The old version had many SVG paths, rings, nodes, sparks, and infinite animations.
 * That caused heavy mobile lag. This version keeps the look but removes expensive animations.
 */
function AIEngineVisual() {
  return (
    <div className="relative min-h-[260px] overflow-hidden rounded-[28px] border border-white/10 bg-[#020816] shadow-[0_20px_70px_rgba(0,0,0,0.55)] md:min-h-[430px] md:rounded-[34px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,255,106,0.10),transparent_34%),radial-gradient(circle_at_top_right,rgba(30,90,180,0.20),transparent_38%)]" />

      <div className="pointer-events-none absolute inset-0 hidden opacity-[0.07] md:block [background-image:linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:24px_24px]" />

      <svg
        className="absolute inset-0 h-full w-full opacity-80"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="lightPathGlow">
            <feGaussianBlur stdDeviation="0.35" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {[
          "M 5 15 C 25 20, 34 36, 50 50",
          "M 95 15 C 75 20, 66 36, 50 50",
          "M 5 85 C 25 80, 34 64, 50 50",
          "M 95 85 C 75 80, 66 64, 50 50",
          "M 50 5 C 49 25, 49 38, 50 50",
          "M 50 95 C 51 75, 51 62, 50 50",
        ].map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="rgba(180,220,255,0.26)"
            strokeWidth="0.7"
            strokeLinecap="round"
            filter="url(#lightPathGlow)"
          />
        ))}

        {[
          { x: 5, y: 15 },
          { x: 95, y: 15 },
          { x: 5, y: 85 },
          { x: 95, y: 85 },
          { x: 50, y: 5 },
          { x: 50, y: 95 },
          { x: 50, y: 50 },
        ].map((node, i) => (
          <circle
            key={i}
            cx={node.x}
            cy={node.y}
            r={i === 6 ? 2.2 : 1.4}
            fill="rgba(255,255,255,0.85)"
          />
        ))}
      </svg>

      <div className="absolute left-1/2 top-1/2 z-10 flex h-[150px] w-[150px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[32px] border border-white/15 bg-[linear-gradient(180deg,rgba(15,24,46,0.98),rgba(4,8,18,0.99))] shadow-[0_0_45px_rgba(120,180,255,0.14)] md:h-[178px] md:w-[178px] md:rounded-[38px]">
        <div className="absolute inset-[10px] rounded-[24px] border border-[#9fc6ff]/15 shadow-[inset_0_0_26px_rgba(130,180,255,0.10)] md:rounded-[28px]" />

        <div className="relative text-center">
          <div
            className="text-[54px] font-black tracking-[0.12em] text-white md:text-[68px]"
            style={{
              textShadow:
                "0 0 12px rgba(255,255,255,0.72), 0 0 28px rgba(130,180,255,0.24)",
            }}
          >
            AI
          </div>

          <div className="mt-1 text-[9px] font-semibold uppercase tracking-[0.28em] text-white/65 md:text-[11px]">
            CORE ENGINE
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 z-10 w-[88%] -translate-x-1/2 rounded-[20px] border border-white/10 bg-black/35 p-3 shadow-[0_14px_30px_rgba(0,0,0,0.30)] md:bottom-5 md:w-[84%] md:rounded-[24px] md:p-4">
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          {["Input", "Reasoning", "Generation"].map((label) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-2 md:p-3"
            >
              <div className="text-[10px] font-semibold text-white/75 md:text-xs">
                {label}
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <span className="block h-full w-2/3 rounded-full bg-white/70" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function WebsiteBuilderAIPage() {
  const [form, setForm] = useState({
    projectName: "",
    symbol: "",
    category: "Web3",
    shortDescription: "",
    targetAudience: "",
    websiteStyle: "Premium Dark Web3",
    themeMode: "Dark",
    colorPreset: "Blue Night",
    primaryColor: "#0B5FFF",
    secondaryColor: "#7CFF6A",
    backgroundPreset: "Dark blue / black gradient",
    backgroundStyle: "Dark blue-black futuristic gradient",
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
    websiteSections:
      "Hero, About, Tokenomics, Roadmap, Staking, Launch on KORAX, Contracts, FAQ, Footer",
    specialInstructions:
      "Make it look like a premium Web3 project website with strong trust, serious builder energy, dark design, and clean launch-ready sections.",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<WebsiteResult | null>(null);
  const [selectedFile, setSelectedFile] = useState("");

  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState("");
  const [editInstruction, setEditInstruction] = useState("");
  const [editTargetFile, setEditTargetFile] = useState("Entire website");

  const [githubRepoName, setGithubRepoName] = useState("");
  const [githubPrivateRepo, setGithubPrivateRepo] = useState(false);
  const [publishingGithub, setPublishingGithub] = useState(false);
  const [githubStatus, setGithubStatus] = useState("");
  const [githubRepoUrl, setGithubRepoUrl] = useState("");

  const selectedFileData = useMemo(() => {
    if (!result) return null;
    return (
      result.files.find((file) => file.path === selectedFile) || result.files[0]
    );
  }, [result, selectedFile]);

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function applyColorPreset(preset: string) {
    let primary = "#0B5FFF";
    let secondary = "#7CFF6A";

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
    let backgroundStyle = "Dark blue-black futuristic gradient";

    if (preset === "White clean gradient") {
      backgroundStyle = "Soft white minimal gradient";
    } else if (preset === "Glass dark") {
      backgroundStyle = "Dark glassmorphism with blue glow";
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

    setLoading(true);
    setError("");
    setResult(null);
    setSelectedFile("");
    setEditError("");
    setEditInstruction("");
    setGithubStatus("");
    setGithubRepoUrl("");

    try {
      const res = await fetch("/api/website-builder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to generate website.");
      }

      setResult(data.result);
      setSelectedFile(data.result?.files?.[0]?.path || "");
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function editWebsite() {
    if (editing) return;

    setEditing(true);
    setEditError("");

    try {
      if (!result) {
        throw new Error("Generate a website first.");
      }

      if (!editInstruction.trim()) {
        throw new Error("Write what you want KORAX AI to change.");
      }

      const res = await fetch("/api/website-editor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentWebsite: result,
          editInstruction,
          targetFile: editTargetFile,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to edit website.");
      }

      setResult(data.result);
      setSelectedFile(data.result?.files?.[0]?.path || "");
      setEditInstruction("");
    } catch (err: any) {
      setEditError(err?.message || "Website edit failed.");
    } finally {
      setEditing(false);
    }
  }

  function connectGitHub() {
    window.location.href = "/api/github/oauth/start";
  }

  async function publishToGitHub() {
    if (publishingGithub) return;

    setPublishingGithub(true);
    setGithubStatus("");
    setGithubRepoUrl("");

    try {
      if (!result) {
        throw new Error("Generate a website first.");
      }

      const repoName =
        githubRepoName.trim() ||
        result.websiteName
          ?.toLowerCase()
          .replace(/[^a-z0-9-_]+/g, "-")
          .replace(/^-+|-+$/g, "") ||
        "korax-generated-site";

      const res = await fetch("/api/github/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repoName,
          privateRepo: githubPrivateRepo,
          files: result.files,
          description: `Generated by KORAX Website Builder AI for ${result.websiteName}`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "GitHub publish failed.");
      }

      setGithubRepoUrl(data.repoUrl);
      setGithubStatus(`Published successfully: ${data.repoUrl}`);
    } catch (err: any) {
      setGithubStatus(err?.message || "GitHub publish failed.");
    } finally {
      setPublishingGithub(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black/30 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.40)] md:rounded-[34px] md:p-8 md:shadow-[0_30px_110px_rgba(0,0,0,0.55)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,255,106,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(30,90,180,0.14),transparent_32%)]" />

        <div className="relative grid gap-8 xl:grid-cols-[1fr_430px] xl:items-center">
          <div className="max-w-4xl">
            <div className="inline-flex rounded-full border border-[#7CFF6A]/20 bg-[#7CFF6A]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#c4ffbc] md:tracking-[0.22em]">
              KORAX Website Builder AI
            </div>

            <h1 className="mt-5 text-3xl font-black leading-tight text-white sm:text-5xl">
              Generate a complete
              <span className="block text-[#7CFF6A]">
                Web3 project website.
              </span>
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/68 sm:text-lg">
              Build premium Web3 websites from project descriptions, token data,
              staking structure, launch direction, brand style, and social
              links. The output is a complete website package with code, copy,
              sections, and deployment notes.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="text-xs text-white/45">Output</div>
                <div className="mt-1 font-bold text-white">Website Files</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="text-xs text-white/45">Code</div>
                <div className="mt-1 font-bold text-white">
                  Next.js + Tailwind
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="text-xs text-white/45">Wallet</div>
                <div className="mt-1 font-bold text-white">
                  RainbowKit Ready
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <AIEngineVisual />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="rounded-[26px] border border-white/10 bg-black/20 p-5 shadow-[0_16px_45px_rgba(0,0,0,0.28)] md:rounded-[30px] md:p-6 md:shadow-[0_22px_80px_rgba(0,0,0,0.35)]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/40">
                Website Inputs
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-white">
                Describe the website you want
              </h2>
            </div>

            <div className="rounded-full border border-[#7CFF6A]/20 bg-[#7CFF6A]/10 px-4 py-2 text-xs font-semibold text-[#c4ffbc]">
              AI Website Architect
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <input
              value={form.projectName}
              onChange={(e) => update("projectName", e.target.value)}
              placeholder="Project Name"
              className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-[#7CFF6A]/40"
            />

            <input
              value={form.symbol}
              onChange={(e) => update("symbol", e.target.value)}
              placeholder="Token Symbol"
              className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-[#7CFF6A]/40"
            />

            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none focus:border-[#7CFF6A]/40"
            >
              {CATEGORY_OPTIONS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <textarea
              value={form.shortDescription}
              onChange={(e) => update("shortDescription", e.target.value)}
              placeholder="Project Description"
              rows={4}
              className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-[#7CFF6A]/40"
            />

            <input
              value={form.targetAudience}
              onChange={(e) => update("targetAudience", e.target.value)}
              placeholder="Target Audience"
              className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-[#7CFF6A]/40"
            />

            <select
              value={form.themeMode}
              onChange={(e) => update("themeMode", e.target.value)}
              className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none focus:border-[#7CFF6A]/40"
            >
              <option>Dark</option>
              <option>Light</option>
              <option>Auto</option>
            </select>

            <select
              value={form.websiteStyle}
              onChange={(e) => update("websiteStyle", e.target.value)}
              className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none focus:border-[#7CFF6A]/40"
            >
              {WEBSITE_STYLE_OPTIONS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <select
              value={form.colorPreset}
              onChange={(e) => applyColorPreset(e.target.value)}
              className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none focus:border-[#7CFF6A]/40"
            >
              <option>Blue Night</option>
              <option>Royal Purple</option>
              <option>Gold Luxury</option>
              <option>Ocean Cyan</option>
              <option>Black & White</option>
              <option>Neon Green</option>
              <option>Red Energy</option>
              <option>Orange Fire</option>
            </select>

            <select
              value={form.backgroundPreset}
              onChange={(e) => applyBackgroundPreset(e.target.value)}
              className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none focus:border-[#7CFF6A]/40"
            >
              <option>Dark blue / black gradient</option>
              <option>White clean gradient</option>
              <option>Glass dark</option>
              <option>Mesh premium</option>
              <option>Aurora glow</option>
              <option>Soft minimal light</option>
              <option>Deep space</option>
              <option>Cyber grid</option>
            </select>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs text-white/50">
                  Primary Color
                </label>
                <input
                  value={form.primaryColor}
                  onChange={(e) => update("primaryColor", e.target.value)}
                  placeholder="#0B5FFF"
                  className="w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-[#7CFF6A]/40"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-white/50">
                  Secondary Color
                </label>
                <input
                  value={form.secondaryColor}
                  onChange={(e) => update("secondaryColor", e.target.value)}
                  placeholder="#7CFF6A"
                  className="w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-[#7CFF6A]/40"
                />
              </div>
            </div>

            <input
              value={form.backgroundStyle}
              onChange={(e) => update("backgroundStyle", e.target.value)}
              placeholder="Background Style"
              className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-[#7CFF6A]/40"
            />

            <select
              value={form.network}
              onChange={(e) => update("network", e.target.value)}
              className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none focus:border-[#7CFF6A]/40"
            >
              <option>BNB Chain</option>
              <option>Solana — Planned for Future</option>
            </select>

            <input
              value={form.tokenAddress}
              onChange={(e) => update("tokenAddress", e.target.value)}
              placeholder="Token Address"
              className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-[#7CFF6A]/40"
            />

            <input
              value={form.stakingAddress}
              onChange={(e) => update("stakingAddress", e.target.value)}
              placeholder="Staking Address"
              className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-[#7CFF6A]/40"
            />

            <input
              value={form.vaultAddress}
              onChange={(e) => update("vaultAddress", e.target.value)}
              placeholder="Vault Address"
              className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-[#7CFF6A]/40"
            />

            <input
              value={form.launchpadAddress}
              onChange={(e) => update("launchpadAddress", e.target.value)}
              placeholder="Launchpad Address / Sale Reference"
              className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-[#7CFF6A]/40"
            />

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="text-sm font-semibold text-white">
                Social Links
              </div>
              <p className="mt-1 text-xs leading-relaxed text-white/45">
                Add all official project channels for footer and community
                sections.
              </p>

              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <input
                  value={form.xLink}
                  onChange={(e) => update("xLink", e.target.value)}
                  placeholder="X / Twitter Link"
                  className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-[#7CFF6A]/40"
                />

                <input
                  value={form.telegramLink}
                  onChange={(e) => update("telegramLink", e.target.value)}
                  placeholder="Telegram Link"
                  className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-[#7CFF6A]/40"
                />

                <input
                  value={form.youtubeLink}
                  onChange={(e) => update("youtubeLink", e.target.value)}
                  placeholder="YouTube Link"
                  className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-[#7CFF6A]/40"
                />

                <input
                  value={form.tiktokLink}
                  onChange={(e) => update("tiktokLink", e.target.value)}
                  placeholder="TikTok Link"
                  className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-[#7CFF6A]/40"
                />

                <input
                  value={form.instagramLink}
                  onChange={(e) => update("instagramLink", e.target.value)}
                  placeholder="Instagram Link"
                  className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-[#7CFF6A]/40"
                />

                <input
                  value={form.facebookLink}
                  onChange={(e) => update("facebookLink", e.target.value)}
                  placeholder="Facebook Link"
                  className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-[#7CFF6A]/40"
                />

                <input
                  value={form.discordLink}
                  onChange={(e) => update("discordLink", e.target.value)}
                  placeholder="Discord Link"
                  className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-[#7CFF6A]/40 md:col-span-2 xl:col-span-3"
                />
              </div>
            </div>

            <textarea
              value={form.websiteSections}
              onChange={(e) => update("websiteSections", e.target.value)}
              placeholder="Website Sections"
              rows={3}
              className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-[#7CFF6A]/40"
            />

            <textarea
              value={form.specialInstructions}
              onChange={(e) => update("specialInstructions", e.target.value)}
              placeholder="Special Instructions"
              rows={4}
              className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-[#7CFF6A]/40"
            />

            <button
              onClick={generateWebsite}
              disabled={loading}
              className="rounded-xl bg-[#7CFF6A] px-5 py-3 font-bold text-black shadow-[0_0_25px_rgba(124,255,106,0.14)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 md:hover:scale-[1.01]"
            >
              {loading ? "Generating Website... please wait" : "Generate Website"}
            </button>

            {error ? (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-6">
          <SectionBox title="KORAX Publishing Layer">
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Website Builder AI generates the full project website package
              first. GitHub publishing and Vercel deployment are part of the
              KORAX builder pipeline.
            </p>

            <div className="mt-5 grid gap-3">
              <SmallCard label="Website Package" value="Generated by AI" />
              <SmallCard label="Publishing" value="GitHub OAuth" />
              <SmallCard label="Hosting" value="Vercel layer next" />
            </div>
          </SectionBox>

          <SectionBox title="Builder Access Direction">
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Website Builder AI is planned as a premium KORAX builder layer.
              It is designed to connect with Token Builder AI and later generate
              websites that match the project’s contracts, launch logic, staking
              structure, and visual identity.
            </p>

            <div className="mt-5 rounded-2xl border border-[#7CFF6A]/20 bg-[#7CFF6A]/10 p-4 text-sm text-white/75">
              Future access direction: full website generation and assisted
              publishing may require a higher builder access package.
            </div>
          </SectionBox>

          {result ? (
            <SectionBox title="Generated Website">
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                {result.summary}
              </p>

              <div className="mt-5 grid gap-3">
                <SmallCard label="Website Name" value={result.websiteName} />
                <SmallCard label="Theme" value={result.styleGuide.theme} />
                <SmallCard
                  label="Primary Color"
                  value={result.styleGuide.primaryColor}
                />
                <SmallCard
                  label="Secondary Color"
                  value={result.styleGuide.secondaryColor}
                />
              </div>
            </SectionBox>
          ) : null}
        </div>
      </section>

      {result ? (
        <section className="space-y-6">
          <SectionBox title="Brand Direction">
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

          <SectionBox title="Website Sections">
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {result.sections.map((section) => (
                <div
                  key={section.name}
                  className="rounded-2xl border border-white/10 bg-black/25 p-5"
                >
                  <div className="text-xs uppercase tracking-[0.22em] text-white/45">
                    {section.name}
                  </div>

                  <h3 className="mt-2 font-bold text-white">
                    {section.headline}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    {section.description}
                  </p>

                  <p className="mt-3 text-xs leading-relaxed text-white/40">
                    {section.purpose}
                  </p>
                </div>
              ))}
            </div>
          </SectionBox>

          <SectionBox title="Website Editor AI">
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Modify the generated website with simple instructions. You can
              improve the whole website or target a specific file.
            </p>

            <div className="mt-5 grid gap-4">
              <select
                value={editTargetFile}
                onChange={(e) => setEditTargetFile(e.target.value)}
                className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none"
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
                className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-[#7CFF6A]/40"
              />

              <button
                type="button"
                onClick={editWebsite}
                disabled={editing}
                className="rounded-xl bg-[#7CFF6A] px-5 py-3 font-bold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {editing ? "Editing Website... please wait" : "Apply AI Edit"}
              </button>

              {editError ? (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {editError}
                </div>
              ) : null}
            </div>
          </SectionBox>

          <SectionBox title="Generated Files">
            <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-sm text-white/60">
                Review the generated website package. You can copy a single file
                or download the full website as one ZIP package.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <select
                  value={selectedFileData?.path || ""}
                  onChange={(e) => setSelectedFile(e.target.value)}
                  className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none"
                >
                  {result.files.map((file) => (
                    <option key={file.path} value={file.path}>
                      {file.path}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() =>
                    downloadWebsiteZip(result.files, result.websiteName)
                  }
                  className="rounded-xl bg-[#7CFF6A] px-5 py-3 text-sm font-bold text-black transition hover:opacity-90"
                >
                  Download Full Website ZIP
                </button>
              </div>
            </div>

            {selectedFileData ? (
              <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black/35">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                  <div className="font-mono text-sm text-white">
                    {selectedFileData.path}
                  </div>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(selectedFileData.content)}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                  >
                    Copy File
                  </button>
                </div>

                <pre className="max-h-[360px] overflow-auto p-4 text-xs leading-relaxed text-white/75 md:max-h-[560px]">
                  <code>{selectedFileData.content}</code>
                </pre>
              </div>
            ) : null}
          </SectionBox>

          <SectionBox title="Publish to GitHub">
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Connect your GitHub account and let KORAX publish the generated
              website files into a new repository. No manual token copying is
              required.
            </p>

            <div className="mt-5 grid gap-4">
              <button
                type="button"
                onClick={connectGitHub}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Connect GitHub
              </button>

              <input
                value={githubRepoName}
                onChange={(e) => setGithubRepoName(e.target.value)}
                placeholder="Repository name, example: my-web3-project"
                className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-[#7CFF6A]/40"
              />

              <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/80">
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
                disabled={publishingGithub}
                className="rounded-xl bg-[#7CFF6A] px-5 py-3 font-bold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {publishingGithub ? "Publishing... please wait" : "Publish to GitHub"}
              </button>

              {githubStatus ? (
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
                  {githubRepoUrl ? (
                    <a
                      href={githubRepoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#c4ffbc] hover:text-white"
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

          <section className="rounded-[26px] border border-[#7CFF6A]/20 bg-[#7CFF6A]/10 p-5 md:rounded-[30px] md:p-6">
            <h2 className="text-xl font-bold text-[#c4ffbc]">
              KORAX Publishing Note
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-white/75">
              {result.koraxPublishingNote}
            </p>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-white/65">
              Next planned steps: Vercel deployment, domain connection, and
              managed publishing options.
            </div>
          </section>
        </section>
      ) : null}
    </div>
  );
}