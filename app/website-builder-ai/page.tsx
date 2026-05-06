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
    <section className="rounded-[30px] border border-white/10 bg-black/20 p-6 shadow-[0_22px_80px_rgba(0,0,0,0.35)] backdrop-blur-md">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      {children}
    </section>
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
          <filter id="pathGlowUltra">
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
              filter="url(#pathGlowUltra)"
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
              filter="url(#pathGlowUltra)"
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
              filter="url(#pathGlowUltra)"
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
              animation: `${
                ring.reverse ? "ringReverseUltra" : "ringForwardUltra"
              } ${ring.duration} linear infinite`,
            }}
          />
        ))}

        <div className="absolute left-1/2 top-1/2 h-[178px] w-[178px] -translate-x-1/2 -translate-y-1/2">
          <span className="absolute inset-[-58px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.13),transparent_66%)] animate-[coreAuraUltra_2.9s_ease-in-out_infinite]" />
          <span className="absolute inset-[-38px] rounded-full bg-[radial-gradient(circle,rgba(125,180,255,0.17),transparent_66%)] animate-[coreAuraUltra_2.9s_ease-in-out_infinite_0.35s]" />
          <span className="absolute inset-[-20px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_62%)] animate-[coreAuraUltra_2.9s_ease-in-out_infinite_0.7s]" />

          <div className="relative flex h-full w-full items-center justify-center rounded-[38px] border border-white/15 bg-[linear-gradient(180deg,rgba(15,24,46,0.98),rgba(4,8,18,0.99))] shadow-[0_0_70px_rgba(120,180,255,0.12)] animate-[coreChargeUltra_2.9s_ease-in-out_infinite]">
            {Array.from({ length: 9 }).map((_, i) => (
              <span
                key={`pin-l-${i}`}
                className="absolute -left-8 h-[2px] w-8 bg-white/80"
                style={{
                  top: `${16 + i * 16}px`,
                  boxShadow: "0 0 8px rgba(255,255,255,0.3)",
                }}
              />
            ))}

            {Array.from({ length: 9 }).map((_, i) => (
              <span
                key={`pin-r-${i}`}
                className="absolute -right-8 h-[2px] w-8 bg-white/80"
                style={{
                  top: `${16 + i * 16}px`,
                  boxShadow: "0 0 8px rgba(255,255,255,0.3)",
                }}
              />
            ))}

            {Array.from({ length: 7 }).map((_, i) => (
              <span
                key={`pin-t-${i}`}
                className="absolute -top-8 h-8 w-[2px] bg-white/75"
                style={{
                  left: `${30 + i * 19}px`,
                  boxShadow: "0 0 8px rgba(255,255,255,0.25)",
                }}
              />
            ))}

            {Array.from({ length: 7 }).map((_, i) => (
              <span
                key={`pin-b-${i}`}
                className="absolute -bottom-8 h-8 w-[2px] bg-white/75"
                style={{
                  left: `${30 + i * 19}px`,
                  boxShadow: "0 0 8px rgba(255,255,255,0.25)",
                }}
              />
            ))}

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
      <section className="relative overflow-hidden rounded-[34px] border border-white/10 bg-black/30 p-8 shadow-[0_30px_110px_rgba(0,0,0,0.55)] backdrop-blur-md">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,255,106,0.15),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(30,90,180,0.18),transparent_32%)]" />

        <div className="relative grid gap-8 xl:grid-cols-[1fr_430px] xl:items-center">
          <div className="max-w-4xl">
            <div className="inline-flex rounded-full border border-[#7CFF6A]/20 bg-[#7CFF6A]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#c4ffbc]">
              KORAX Website Builder AI
            </div>

            <h1 className="mt-5 text-4xl font-black leading-tight text-white sm:text-5xl">
              Generate a complete
              <span className="block text-[#7CFF6A]">
                Web3 project website.
              </span>
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/68 sm:text-lg">
              Build premium Web3 websites from project descriptions, token data,
              staking structure, launch direction, brand style, and social links.
              The output is a complete website package with code, copy, sections,
              and deployment notes.
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
                <div className="mt-1 font-bold text-white">RainbowKit Ready</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <AIEngineVisual />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="rounded-[30px] border border-white/10 bg-black/20 p-6 shadow-[0_22px_80px_rgba(0,0,0,0.35)] backdrop-blur-md">
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
                Add all official project channels for footer and community sections.
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
              className="rounded-xl bg-[#7CFF6A] px-5 py-3 font-bold text-black shadow-[0_0_35px_rgba(124,255,106,0.18)] transition hover:scale-[1.01] hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Generating Website..." : "Generate Website"}
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
              websites that match the project’s contracts, launch logic,
              staking structure, and visual identity.
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
                className="rounded-xl bg-[#7CFF6A] px-5 py-3 font-bold text-black transition hover:opacity-90 disabled:opacity-60"
              >
                {editing ? "Editing Website..." : "Apply AI Edit"}
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

                <pre className="max-h-[560px] overflow-auto p-4 text-xs leading-relaxed text-white/75">
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
                className="rounded-xl bg-[#7CFF6A] px-5 py-3 font-bold text-black transition hover:opacity-90 disabled:opacity-60"
              >
                {publishingGithub ? "Publishing..." : "Publish to GitHub"}
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

          <section className="rounded-[30px] border border-[#7CFF6A]/20 bg-[#7CFF6A]/10 p-6 backdrop-blur-md">
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