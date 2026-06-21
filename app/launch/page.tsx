"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ethers } from "ethers";
import { useAccount, useWalletClient } from "wagmi";
import {
  ACCESS_MANAGER_ADDRESS,
  LAUNCHPAD_ADDRESS,
  RPC_URL,
  USDT_ADDRESS,
  USDC_ADDRESS,
  accessManagerAbi,
  launchpadAbi,
  erc20Abi,
} from "@/lib/korax/contracts";

const LEVELS = [
  {
    name: "Level 1",
    label: "Basic Access",
    minKrx: 500,
    maxUsd: 250,
    level: 1,
    desc: "Entry access for KORAX launch participation.",
  },
  {
    name: "Level 2",
    label: "Strong Access",
    minKrx: 2500,
    maxUsd: 500,
    level: 2,
    desc: "Higher allocation power for committed KRX holders.",
  },
  {
    name: "Level 3",
    label: "Priority Access",
    minKrx: 5000,
    maxUsd: 750,
    level: 3,
    desc: "Priority participation with the highest launch allocation.",
  },
];

type AccessState = {
  loading: boolean;
  connected: boolean;
  wallet: string;
  eligibleAmount: string;
  launchLevel: number;
  totalProjectSlots: number;
  hasLaunchAccess: boolean;
  level1Amount: string;
  level2Amount: string;
  level3Amount: string;
  requiredRewardBps: number;
  error: string;
};

type LoadedStage = {
  cap: bigint;
  priceUsd18: bigint;
  sold: bigint;
};

type LoadedSale = {
  owner: string;
  saleToken: string;
  fundReceiver: string;
  saleTokenDecimals: number;
  totalForSale: bigint;
  totalSold: bigint;
  active: boolean;
  claimOpen: boolean;
  requireKoraxAccess: boolean;
  stages: LoadedStage[];
};

type PublicProject = {
  id: string;
  owner: string;
  name: string;
  symbol: string;
  token: string;
  presale: string;
  staking: string;
  vault: string;
  metadataURI: string;
  createdAt: string;
  createdAtUnix: string;
  active: boolean;
  slug: string;
  launchUrl: string;
};

type LoadedBuilderProject = {
  projectName?: string;
  symbol?: string;
  category?: string;
  shortDescription?: string;
  targetAudience?: string;
  network?: string;

  tokenAddress?: string;
  vaultAddress?: string;
  stakingAddress?: string;
  launchpadAddress?: string;

  websiteName?: string;
  websiteSummary?: string;
  websiteGenerated?: boolean;

  txHash?: string;
};

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-[#020617]/70 px-4 py-3 text-white outline-none placeholder:text-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition focus:border-blue-400/60 focus:bg-[#020617]/90 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]";

const selectClass =
  "w-full rounded-2xl border border-white/10 bg-[#020617]/70 px-4 py-3 text-white outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition focus:border-blue-400/60 focus:bg-[#020617]/90 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]";

const primaryButtonClass =
  "rounded-2xl bg-blue-500 px-5 py-3 font-black text-white shadow-[0_0_34px_rgba(59,130,246,0.26)] transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50";

const ghostButtonClass =
  "rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 font-black text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50";

const cyanButtonClass =
  "rounded-2xl border border-cyan-300/25 bg-cyan-400/10 px-5 py-3 font-black text-cyan-100 transition hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-50";

const dangerButtonClass =
  "rounded-2xl border border-red-500/25 bg-red-500/10 px-5 py-3 font-black text-red-100 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50";

function shortAddress(address?: string) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatUnitsSafe(value: bigint, decimals = 18, max = 6) {
  try {
    return Number(ethers.formatUnits(value, decimals)).toLocaleString("en-US", {
      maximumFractionDigits: max,
    });
  } catch {
    return "0";
  }
}

function levelFromNumber(level: number) {
  if (level >= 3) return LEVELS[2];
  if (level >= 2) return LEVELS[1];
  if (level >= 1) return LEVELS[0];
  return null;
}

function parseLines(value: string) {
  return value
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}

function readLastBuilderProject(): LoadedBuilderProject | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem("korax_last_project");
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);

    if (parsed && typeof parsed === "object") {
      return parsed as LoadedBuilderProject;
    }

    return null;
  } catch {
    return null;
  }
}

function SectionBox({
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
    <section className="launch-section-card relative overflow-hidden rounded-[32px] border border-white/10 bg-[#020617]/60 p-5 shadow-[0_24px_95px_rgba(0,0,0,0.48)] backdrop-blur-xl md:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.13),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.10),transparent_36%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:42px_42px]" />

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
          ? "border-blue-300/30 bg-blue-500/10 text-blue-100 shadow-[0_0_22px_rgba(59,130,246,0.16)]"
          : "border-white/10 bg-white/[0.04] text-white/50",
      ].join(" ")}
    >
      {children}
    </span>
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
    <div className="launch-card-3d rounded-2xl border border-white/10 bg-[#020617]/60 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="text-[11px] font-black uppercase tracking-[0.2em] text-white/35">
        {label}
      </div>

      <div className="mt-2 break-all text-sm font-semibold leading-relaxed text-white/80">
        {value || "Not available"}
      </div>
    </div>
  );
}

function ProjectIconCard({
  project,
  active,
}: {
  project: PublicProject;
  active?: boolean;
}) {
  return (
    <a
      href={project.launchUrl}
      className={[
        "launch-card-3d group relative block overflow-hidden rounded-[34px] border p-5 transition hover:-translate-y-1",
        active
          ? "border-blue-300/30 bg-blue-500/10 shadow-[0_28px_95px_rgba(59,130,246,0.18)]"
          : "border-white/10 bg-[#020617]/60",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.16),transparent_35%)]" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-500/15 blur-3xl" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-[30px] border border-blue-300/20 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.99))] shadow-[0_0_42px_rgba(59,130,246,0.18)] transition group-hover:scale-[1.03]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.22),transparent_60%)]" />

            <img
              src="/Korax-logo.png"
              alt="KORAX"
              className="launch-logo-float relative h-16 w-16 object-contain drop-shadow-[0_0_22px_rgba(59,130,246,0.75)]"
            />
          </div>

          <StatusPill active={project.active}>
            {project.active ? "Live" : "Inactive"}
          </StatusPill>
        </div>

        <h3 className="mt-5 text-2xl font-black leading-tight text-white">
          {project.name}
        </h3>

        <div className="mt-2 text-sm font-black uppercase tracking-[0.22em] text-cyan-200">
          {project.symbol}
        </div>

        <p className="mt-4 text-sm leading-7 text-white/60">
          Registered on KORAX Project Registry and ready to be connected with
          Launchpad sale setup.
        </p>

        <div className="mt-5 grid gap-3">
          <InfoCard label="Launch Link" value={project.launchUrl} />
          <InfoCard
            label="Token"
            value={project.token ? shortAddress(project.token) : "Not available"}
          />
        </div>

        <div className="mt-5 rounded-2xl border border-blue-300/25 bg-blue-500/10 px-4 py-3 text-center text-sm font-black text-blue-100">
          Open Project Launch Page
        </div>
      </div>
    </a>
  );
}

function LaunchHeroVisual() {
  return (
    <div className="realistic-launch-hero">
      <div className="realistic-stars" />
      <div className="realistic-grid" />
      <div className="realistic-orbit realistic-orbit-one" />
      <div className="realistic-orbit realistic-orbit-two" />
      <div className="realistic-cloud realistic-cloud-left" />
      <div className="realistic-cloud realistic-cloud-right" />

      <div className="realistic-rocket-stack">
        <div className="realistic-speed-lines" />

        <svg
          viewBox="0 0 300 640"
          className="realistic-rocket-svg"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="metalBody" x1="60" y1="0" x2="240" y2="0">
              <stop offset="0%" stopColor="#111827" />
              <stop offset="10%" stopColor="#64748B" />
              <stop offset="24%" stopColor="#F8FAFC" />
              <stop offset="45%" stopColor="#94A3B8" />
              <stop offset="63%" stopColor="#FFFFFF" />
              <stop offset="82%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            <linearGradient id="noseBlue" x1="75" y1="0" x2="225" y2="0">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="35%" stopColor="#60A5FA" />
              <stop offset="62%" stopColor="#E0F2FE" />
              <stop offset="100%" stopColor="#1E3A8A" />
            </linearGradient>

            <linearGradient id="boosterMetal" x1="0" y1="0" x2="60" y2="0">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="20%" stopColor="#64748B" />
              <stop offset="45%" stopColor="#E2E8F0" />
              <stop offset="72%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>

            <linearGradient id="flameReal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="16%" stopColor="#DBEAFE" />
              <stop offset="32%" stopColor="#60A5FA" />
              <stop offset="55%" stopColor="#22D3EE" />
              <stop offset="72%" stopColor="#F97316" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>

            <filter id="flameBlur">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Side boosters */}
          <path
            d="M62 170C42 220 36 345 45 465C49 512 66 548 91 558C79 414 80 282 103 170H62Z"
            fill="url(#boosterMetal)"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="2"
          />
          <path
            d="M238 170C258 220 264 345 255 465C251 512 234 548 209 558C221 414 220 282 197 170H238Z"
            fill="url(#boosterMetal)"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="2"
          />

          {/* Main body */}
          <path
            d="M150 20C112 62 92 118 92 190V452C92 501 116 535 150 535C184 535 208 501 208 452V190C208 118 188 62 150 20Z"
            fill="url(#metalBody)"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="2.5"
          />

          {/* Nose */}
          <path
            d="M150 20C118 56 101 96 94 146H206C199 96 182 56 150 20Z"
            fill="url(#noseBlue)"
            stroke="rgba(191,219,254,0.85)"
            strokeWidth="2.5"
          />

          {/* Horizontal rings */}
          <path d="M98 172H202" stroke="#1D4ED8" strokeWidth="6" strokeLinecap="round" />
          <path d="M96 382H204" stroke="#1D4ED8" strokeWidth="6" strokeLinecap="round" />

          {/* Window */}
          <ellipse
            cx="150"
            cy="174"
            rx="32"
            ry="32"
            fill="#020617"
            stroke="#93C5FD"
            strokeWidth="6"
          />
          <ellipse cx="150" cy="174" rx="17" ry="17" fill="#38BDF8" />
          <ellipse cx="140" cy="162" rx="7" ry="5" fill="white" opacity="0.9" />

          {/* Logo panel */}
          <path
            d="M112 260C132 275 168 275 188 260V342C166 358 134 358 112 342V260Z"
            fill="rgba(2,6,23,0.48)"
            stroke="rgba(96,165,250,0.45)"
            strokeWidth="2"
          />
          <rect x="124" y="283" width="52" height="52" rx="16" fill="rgba(15,23,42,0.78)" />
          <image href="/Korax-logo.png" x="130" y="289" width="40" height="40" />

          {/* Fins */}
          <path
            d="M93 408C61 438 48 493 43 545C75 531 96 505 108 462L112 418L93 408Z"
            fill="#1D4ED8"
            stroke="#93C5FD"
            strokeWidth="2"
          />
          <path
            d="M207 408C239 438 252 493 257 545C225 531 204 505 192 462L188 418L207 408Z"
            fill="#1D4ED8"
            stroke="#93C5FD"
            strokeWidth="2"
          />

          {/* Engines */}
          <path
            d="M110 520H190L176 568H124L110 520Z"
            fill="#020617"
            stroke="#94A3B8"
            strokeWidth="2"
          />
          <path d="M128 560H172L162 600H138L128 560Z" fill="#020617" />

          {/* Flames */}
          <path
            className="realistic-flame-side"
            d="M72 555C93 578 95 625 76 640C55 606 48 575 72 555Z"
            fill="url(#flameReal)"
            filter="url(#flameBlur)"
          />
          <path
            className="realistic-flame-side"
            d="M228 555C207 578 205 625 224 640C245 606 252 575 228 555Z"
            fill="url(#flameReal)"
            filter="url(#flameBlur)"
          />
          <path
            className="realistic-flame-main"
            d="M150 558C184 596 180 630 150 640C120 630 116 596 150 558Z"
            fill="url(#flameReal)"
            filter="url(#flameBlur)"
          />
        </svg>

        <img
          src="/korax-wordmark.png"
          alt="KORAX"
          className="realistic-wordmark"
        />
      </div>

      <div className="realistic-launch-bars">
        <div className="realistic-bar-card">
          <span>Access</span>
          <div className="realistic-track">
            <div className="realistic-fill realistic-fill-access" />
          </div>
        </div>

        <div className="realistic-bar-card">
          <span>Buy</span>
          <div className="realistic-track">
            <div className="realistic-fill realistic-fill-buy" />
          </div>
        </div>

        <div className="realistic-bar-card">
          <span>Release</span>
          <div className="realistic-track">
            <div className="realistic-fill realistic-fill-release" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .realistic-launch-hero {
          position: relative;
          min-height: 560px;
          overflow: hidden;
          border-radius: 34px;
          background:
            radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.24), transparent 34%),
            radial-gradient(circle at 20% 75%, rgba(34, 211, 238, 0.12), transparent 30%),
            linear-gradient(180deg, #061020 0%, #020617 58%, #01030a 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 34px 120px rgba(0, 0, 0, 0.68);
          isolation: isolate;
        }

        .realistic-grid {
          position: absolute;
          inset: 0;
          opacity: 0.055;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.09) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.09) 1px, transparent 1px);
          background-size: 36px 36px;
        }

        .realistic-stars {
          position: absolute;
          inset: 0;
          opacity: 0.75;
          background-image:
            radial-gradient(1.4px 1.4px at 9% 18%, #fff, transparent),
            radial-gradient(1px 1px at 23% 43%, #dbeafe, transparent),
            radial-gradient(1.5px 1.5px at 54% 12%, #fff, transparent),
            radial-gradient(1px 1px at 74% 28%, #dbeafe, transparent),
            radial-gradient(1.3px 1.3px at 88% 14%, #fff, transparent),
            radial-gradient(1px 1px at 92% 64%, #fff, transparent),
            radial-gradient(1.2px 1.2px at 40% 78%, #fff, transparent),
            radial-gradient(1px 1px at 16% 82%, #dbeafe, transparent);
          background-repeat: no-repeat;
          animation: realisticStars 5.5s ease-in-out infinite;
        }

        .realistic-orbit {
          position: absolute;
          left: 50%;
          top: 42%;
          border-radius: 999px;
          border: 1px solid rgba(56, 189, 248, 0.13);
          transform: translate(-50%, -50%);
        }

        .realistic-orbit-one {
          width: 420px;
          height: 420px;
          animation: realisticOrbit 22s linear infinite;
        }

        .realistic-orbit-two {
          width: 560px;
          height: 560px;
          border-color: rgba(96, 165, 250, 0.08);
          animation: realisticOrbit 34s linear infinite reverse;
        }

        .realistic-cloud {
          position: absolute;
          bottom: 72px;
          width: 210px;
          height: 95px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(255,255,255,0.14), rgba(148,163,184,0.08) 50%, transparent 75%);
          filter: blur(12px);
          opacity: 0.7;
        }

        .realistic-cloud-left {
          left: -55px;
        }

        .realistic-cloud-right {
          right: -55px;
        }

        .realistic-rocket-stack {
          position: absolute;
          left: 50%;
          top: 48%;
          width: 300px;
          height: 640px;
          transform: translate(-50%, -50%);
          z-index: 5;
          animation: realisticRocketToSky 6.8s cubic-bezier(0.18, 0.9, 0.22, 1) infinite;
          will-change: transform, opacity;
          transform-style: preserve-3d;
        }

        .realistic-rocket-svg {
          width: 300px;
          height: 640px;
          display: block;
          filter: drop-shadow(0 28px 46px rgba(0, 0, 0, 0.5));
          transform: perspective(950px) rotateX(7deg) rotateY(-9deg);
        }

        .realistic-speed-lines {
          position: absolute;
          left: 50%;
          top: 0;
          width: 160px;
          height: 560px;
          transform: translateX(-50%);
          background:
            linear-gradient(180deg, transparent, rgba(96,165,250,0.38), transparent),
            linear-gradient(90deg, transparent 20%, rgba(34,211,238,0.35), transparent 80%);
          opacity: 0;
          filter: blur(4px);
          animation: realisticSpeedLines 6.8s ease-in-out infinite;
        }

        .realistic-wordmark {
          position: absolute;
          left: 50%;
          top: 390px;
          width: 136px;
          height: auto;
          transform: translateX(-50%);
          object-fit: contain;
          filter: drop-shadow(0 0 14px rgba(59, 130, 246, 0.6));
        }

        .realistic-flame-main {
          animation: realisticFlameMain 0.55s ease-in-out infinite alternate;
          transform-origin: center top;
        }

        .realistic-flame-side {
          animation: realisticFlameSide 0.7s ease-in-out infinite alternate;
          transform-origin: center top;
        }

        .realistic-launch-bars {
          position: absolute;
          left: 16px;
          right: 16px;
          bottom: 16px;
          z-index: 10;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .realistic-bar-card {
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          background: rgba(2, 6, 23, 0.72);
          padding: 14px;
          backdrop-filter: blur(16px);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.045);
        }

        .realistic-bar-card span {
          display: block;
          margin-bottom: 12px;
          color: #ffffff;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .realistic-track {
          height: 8px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.09);
        }

        .realistic-fill {
          width: 0;
          height: 100%;
          border-radius: 999px;
          animation-duration: 6.8s;
          animation-fill-mode: both;
          animation-timing-function: cubic-bezier(0.18, 0.9, 0.28, 1);
          animation-iteration-count: infinite;
        }

        .realistic-fill-access {
          background: linear-gradient(90deg, #1d4ed8, #60a5fa, #dbeafe);
          animation-name: realisticFillAccess;
        }

        .realistic-fill-buy {
          background: linear-gradient(90deg, #0891b2, #22d3ee, #cffafe);
          animation-name: realisticFillBuy;
          animation-delay: 0.08s;
        }

        .realistic-fill-release {
          background: linear-gradient(90deg, #b45309, #f59e0b, #fde68a);
          animation-name: realisticFillRelease;
          animation-delay: 0.16s;
        }

        @keyframes realisticRocketToSky {
          0% {
            transform: translate(-50%, -34%) scale(0.82) rotate(-0.7deg);
            opacity: 1;
          }

          10% {
            transform: translate(-51%, -36%) scale(0.86) rotate(0.8deg);
            opacity: 1;
          }

          22% {
            transform: translate(-50%, -48%) scale(0.92) rotate(-0.3deg);
            opacity: 1;
          }

          42% {
            transform: translate(-50%, -105%) scale(0.86) rotate(0deg);
            opacity: 1;
          }

          58% {
            transform: translate(-50%, -205%) scale(0.62) rotate(0deg);
            opacity: 0;
          }

          74% {
            transform: translate(-50%, -205%) scale(0.62) rotate(0deg);
            opacity: 0;
          }

          75% {
            transform: translate(-50%, 16%) scale(0.78) rotate(-0.7deg);
            opacity: 0;
          }

          86% {
            transform: translate(-50%, -34%) scale(0.82) rotate(-0.7deg);
            opacity: 1;
          }

          100% {
            transform: translate(-50%, -34%) scale(0.82) rotate(-0.7deg);
            opacity: 1;
          }
        }

        @keyframes realisticSpeedLines {
          0%,
          12% {
            opacity: 0;
            transform: translateX(-50%) translateY(40px) scaleY(0.7);
          }

          24% {
            opacity: 0.45;
          }

          44% {
            opacity: 0.85;
            transform: translateX(-50%) translateY(-90px) scaleY(1.12);
          }

          60%,
          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-210px) scaleY(1.2);
          }
        }

        @keyframes realisticFillAccess {
          0% {
            width: 0;
          }
          44% {
            width: 84%;
          }
          74% {
            width: 84%;
          }
          100% {
            width: 0;
          }
        }

        @keyframes realisticFillBuy {
          0% {
            width: 0;
          }
          44% {
            width: 68%;
          }
          74% {
            width: 68%;
          }
          100% {
            width: 0;
          }
        }

        @keyframes realisticFillRelease {
          0% {
            width: 0;
          }
          44% {
            width: 92%;
          }
          74% {
            width: 92%;
          }
          100% {
            width: 0;
          }
        }

        @keyframes realisticStars {
          0%,
          100% {
            opacity: 0.45;
          }
          50% {
            opacity: 0.85;
          }
        }

        @keyframes realisticOrbit {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes realisticFlameMain {
          from {
            transform: scaleY(0.9);
            opacity: 0.82;
          }
          to {
            transform: scaleY(1.16);
            opacity: 1;
          }
        }

        @keyframes realisticFlameSide {
          from {
            transform: scaleY(0.85);
            opacity: 0.72;
          }
          to {
            transform: scaleY(1.06);
            opacity: 0.96;
          }
        }

        @media (max-width: 640px) {
          .realistic-launch-hero {
            min-height: 640px;
          }

          .realistic-rocket-stack {
            top: 43%;
            transform: translate(-50%, -50%) scale(0.78);
          }

          .realistic-launch-bars {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .realistic-stars,
          .realistic-orbit,
          .realistic-rocket-stack,
          .realistic-speed-lines,
          .realistic-flame-main,
          .realistic-flame-side,
          .realistic-fill {
            animation: none !important;
          }

          .realistic-fill-access {
            width: 84%;
          }

          .realistic-fill-buy {
            width: 68%;
          }

          .realistic-fill-release {
            width: 92%;
          }
        }
      `}</style>
    </div>
  );
}

export default function LaunchPage() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [publicProjects, setPublicProjects] = useState<PublicProject[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState("");
  const [activeProjectSlug, setActiveProjectSlug] = useState("");

  const activeProject = useMemo(() => {
    if (!publicProjects.length) return null;

    if (activeProjectSlug) {
      return (
        publicProjects.find((item) => item.slug === activeProjectSlug) ||
        publicProjects[0]
      );
    }

    return publicProjects[0];
  }, [publicProjects, activeProjectSlug]);

  const [loadedBuilderProject, setLoadedBuilderProject] =
    useState<LoadedBuilderProject | null>(null);

  const [isLaunchpadOwner, setIsLaunchpadOwner] = useState(false);
  const [isApprovedCreator, setIsApprovedCreator] = useState(false);

  const [access, setAccess] = useState<AccessState>({
    loading: false,
    connected: false,
    wallet: "",
    eligibleAmount: "0",
    launchLevel: 0,
    totalProjectSlots: 0,
    hasLaunchAccess: false,
    level1Amount: "500",
    level2Amount: "2,500",
    level3Amount: "5,000",
    requiredRewardBps: 9000,
    error: "",
  });

  const currentLevel = useMemo(
    () => levelFromNumber(access.launchLevel),
    [access.launchLevel]
  );

  const canCreateSale = isLaunchpadOwner || isApprovedCreator;

  const [creatorForm, setCreatorForm] = useState({
    saleToken: "",
    fundReceiver: "",
    stageCaps: "1000000\n1000000\n1000000",
    stagePricesUsd: "0.01\n0.015\n0.02",
    requireKoraxAccess: true,
  });

  const [adminForm, setAdminForm] = useState({
    saleId: "0",
    creatorAddress: "",
    approved: true,
    claimOpen: true,
    unsoldReceiver: "",
    level1Limit: "250",
    level2Limit: "500",
    level3Limit: "750",
    antiBotEnabled: true,
    cooldown: "15",
  });

  const [creatorStatus, setCreatorStatus] = useState("");
  const [adminStatus, setAdminStatus] = useState("");
  const [creatingSale, setCreatingSale] = useState(false);
  const [adminBusy, setAdminBusy] = useState(false);

  const [buyerForm, setBuyerForm] = useState({
    saleId: "0",
    paymentAmount: "10",
    payToken: "USDT",
  });

  const [loadedSale, setLoadedSale] = useState<LoadedSale | null>(null);
  const [buyerMax, setBuyerMax] = useState<bigint>(0n);
  const [buyerPurchased, setBuyerPurchased] = useState<bigint>(0n);
  const [buyerContributed, setBuyerContributed] = useState<bigint>(0n);
  const [buyerClaimed, setBuyerClaimed] = useState(false);
  const [previewTokens, setPreviewTokens] = useState<bigint>(0n);

  const [buyerStatus, setBuyerStatus] = useState("");
  const [loadingSale, setLoadingSale] = useState(false);
  const [buying, setBuying] = useState(false);
  const [claiming, setClaiming] = useState(false);

  async function loadPublicProjects() {
    setProjectsLoading(true);
    setProjectsError("");

    try {
      const res = await fetch("/api/public-projects?limit=50", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Failed to load public projects.");
      }

      setPublicProjects(Array.isArray(data.projects) ? data.projects : []);
    } catch (err: any) {
      setProjectsError(
        err?.message || "Failed to load public projects from registry."
      );
      setPublicProjects([]);
    } finally {
      setProjectsLoading(false);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setActiveProjectSlug(params.get("project") || "");

    const project = readLastBuilderProject();

    if (project) {
      setLoadedBuilderProject(project);

      setCreatorForm((prev) => ({
        ...prev,
        saleToken: project.tokenAddress || prev.saleToken,
      }));
    }

    loadPublicProjects();
  }, []);

  useEffect(() => {
    if (!activeProject?.token) return;

    setCreatorForm((prev) => ({
      ...prev,
      saleToken: activeProject.token || prev.saleToken,
    }));
  }, [activeProject?.token]);

  async function getBrowserSigner() {
    if (!isConnected || !address) {
      throw new Error("Connect wallet first.");
    }

    if (!walletClient) {
      throw new Error("Wallet client not ready.");
    }

    const browserProvider = new ethers.BrowserProvider(
      walletClient.transport as any
    );

    return browserProvider.getSigner();
  }

  async function getSaleTokenDecimals(saleToken: string) {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const token = new ethers.Contract(saleToken, erc20Abi, provider);
    return Number(await token.decimals());
  }

  async function loadLaunchpadPermissions(user?: string) {
    try {
      if (!user || !LAUNCHPAD_ADDRESS) {
        setIsLaunchpadOwner(false);
        setIsApprovedCreator(false);
        return;
      }

      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const launchpad = new ethers.Contract(
        LAUNCHPAD_ADDRESS,
        launchpadAbi,
        provider
      );

      const [ownerRaw, approvedRaw] = await Promise.all([
        launchpad.owner(),
        launchpad.approvedSaleCreators(user),
      ]);

      setIsLaunchpadOwner(ownerRaw.toLowerCase() === user.toLowerCase());
      setIsApprovedCreator(Boolean(approvedRaw));
    } catch {
      setIsLaunchpadOwner(false);
      setIsApprovedCreator(false);
    }
  }

  async function loadAccess(user?: string) {
    if (!user) {
      setAccess({
        loading: false,
        connected: false,
        wallet: "",
        eligibleAmount: "0",
        launchLevel: 0,
        totalProjectSlots: 0,
        hasLaunchAccess: false,
        level1Amount: "500",
        level2Amount: "2,500",
        level3Amount: "5,000",
        requiredRewardBps: 9000,
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

      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const accessManager = new ethers.Contract(
        ACCESS_MANAGER_ADDRESS,
        accessManagerAbi,
        provider
      );

      const [launchData, accessData, hasLaunchAccessRaw] = await Promise.all([
        accessManager.getLaunchAccessData(user),
        accessManager.getAccessData(user),
        accessManager.hasLaunchAccess(user),
      ]);

      const eligibleBig = BigInt(launchData.totalEligibleAmount.toString());

      setAccess({
        loading: false,
        connected: true,
        wallet: user,
        eligibleAmount: Number(
          ethers.formatUnits(eligibleBig, 18)
        ).toLocaleString("en-US", { maximumFractionDigits: 4 }),
        launchLevel: Number(launchData.launchLevel),
        totalProjectSlots: Number(accessData.totalProjectSlots),
        hasLaunchAccess: Boolean(hasLaunchAccessRaw),
        level1Amount: Number(
          ethers.formatUnits(BigInt(launchData.level1Amount.toString()), 18)
        ).toLocaleString("en-US", { maximumFractionDigits: 0 }),
        level2Amount: Number(
          ethers.formatUnits(BigInt(launchData.level2Amount.toString()), 18)
        ).toLocaleString("en-US", { maximumFractionDigits: 0 }),
        level3Amount: Number(
          ethers.formatUnits(BigInt(launchData.level3Amount.toString()), 18)
        ).toLocaleString("en-US", { maximumFractionDigits: 0 }),
        requiredRewardBps: Number(launchData.currentRequiredRewardBps),
        error: "",
      });
    } catch (err: any) {
      setAccess((prev) => ({
        ...prev,
        loading: false,
        connected: true,
        wallet: user,
        error: err?.shortMessage || err?.message || "Failed to load access.",
      }));
    }
  }

  useEffect(() => {
    if (!address || !isConnected) {
      loadAccess(undefined);
      loadLaunchpadPermissions(undefined);
      return;
    }

    loadAccess(address);
    loadLaunchpadPermissions(address);
  }, [address, isConnected]);

  async function createSale() {
    setCreatingSale(true);
    setCreatorStatus("");

    try {
      if (!LAUNCHPAD_ADDRESS) {
        throw new Error("Launchpad address is missing.");
      }

      if (!creatorForm.saleToken.trim()) {
        throw new Error("Sale token address is required.");
      }

      const signer = await getBrowserSigner();
      const owner = await signer.getAddress();

      const saleTokenAddress = ethers.getAddress(creatorForm.saleToken.trim());
      const fundReceiver = creatorForm.fundReceiver.trim()
        ? ethers.getAddress(creatorForm.fundReceiver.trim())
        : owner;

      const saleDecimals = await getSaleTokenDecimals(saleTokenAddress);

      const caps = parseLines(creatorForm.stageCaps);
      const prices = parseLines(creatorForm.stagePricesUsd);

      if (caps.length === 0) throw new Error("At least one stage is required.");

      if (caps.length !== prices.length) {
        throw new Error("Stage caps and prices count must match.");
      }

      if (caps.length > 10) {
        throw new Error("Maximum 10 stages allowed.");
      }

      const stageCaps = caps.map((x) => ethers.parseUnits(x, saleDecimals));
      const stagePricesUsd18 = prices.map((x) => ethers.parseUnits(x, 18));

      const totalForSale = stageCaps.reduce((a, b) => a + b, 0n);

      if (totalForSale <= 0n) {
        throw new Error("Total for sale must be > 0.");
      }

      const saleToken = new ethers.Contract(saleTokenAddress, erc20Abi, signer);
      const allowanceRaw = await saleToken.allowance(owner, LAUNCHPAD_ADDRESS);
      const allowance = BigInt(allowanceRaw.toString());

      if (allowance < totalForSale) {
        setCreatorStatus("Approving sale tokens...");

        const approveTx = await saleToken.approve(
          LAUNCHPAD_ADDRESS,
          totalForSale
        );

        await approveTx.wait();
      }

      const launchpad = new ethers.Contract(
        LAUNCHPAD_ADDRESS,
        launchpadAbi,
        signer
      );

      setCreatorStatus("Creating launch sale...");

      const tx = await launchpad.createSale(
        saleTokenAddress,
        fundReceiver,
        stageCaps,
        stagePricesUsd18,
        creatorForm.requireKoraxAccess
      );

      const receipt = await tx.wait();

      setCreatorStatus(
        `Launch sale created successfully. Transaction: ${receipt.hash}`
      );

      await loadPublicProjects();
    } catch (err: any) {
      setCreatorStatus(
        err?.shortMessage ||
          err?.reason ||
          err?.message ||
          "Create sale failed."
      );
    } finally {
      setCreatingSale(false);
    }
  }

  async function loadSale() {
    setLoadingSale(true);
    setBuyerStatus("");

    try {
      if (!LAUNCHPAD_ADDRESS) {
        throw new Error("Launchpad address is missing.");
      }

      const provider = new ethers.JsonRpcProvider(RPC_URL);

      const launchpad = new ethers.Contract(
        LAUNCHPAD_ADDRESS,
        launchpadAbi,
        provider
      );

      const saleId = BigInt(buyerForm.saleId || "0");
      const s = await launchpad.sales(saleId);
      const countRaw = await launchpad.stagesCount(saleId);
      const count = Number(countRaw);

      const stages: LoadedStage[] = [];

      for (let i = 0; i < count; i++) {
        const st = await launchpad.getStage(saleId, i);

        stages.push({
          cap: BigInt(st.cap.toString()),
          priceUsd18: BigInt(st.priceUsd18.toString()),
          sold: BigInt(st.sold.toString()),
        });
      }

      const sale: LoadedSale = {
        owner: s.owner,
        saleToken: s.saleToken,
        fundReceiver: s.fundReceiver,
        saleTokenDecimals: Number(s.saleTokenDecimals),
        totalForSale: BigInt(s.totalForSale.toString()),
        totalSold: BigInt(s.totalSold.toString()),
        active: Boolean(s.active),
        claimOpen: Boolean(s.claimOpen),
        requireKoraxAccess: Boolean(s.requireKoraxAccess),
        stages,
      };

      setLoadedSale(sale);

      if (address) {
        const [maxRaw, contributedRaw, purchasedRaw, claimedRaw] =
          await Promise.all([
            launchpad.maxContributionOf(saleId, address),
            launchpad.contributedUsd18(saleId, address),
            launchpad.purchased(saleId, address),
            launchpad.claimed(saleId, address),
          ]);

        setBuyerMax(BigInt(maxRaw.toString()));
        setBuyerContributed(BigInt(contributedRaw.toString()));
        setBuyerPurchased(BigInt(purchasedRaw.toString()));
        setBuyerClaimed(Boolean(claimedRaw));
      } else {
        setBuyerMax(0n);
        setBuyerContributed(0n);
        setBuyerPurchased(0n);
        setBuyerClaimed(false);
      }

      await updatePreview(saleId);
      setBuyerStatus("Sale loaded.");
    } catch (err: any) {
      setLoadedSale(null);

      setBuyerStatus(
        err?.shortMessage ||
          err?.reason ||
          err?.message ||
          "Failed to load sale."
      );
    } finally {
      setLoadingSale(false);
    }
  }

  async function updatePreview(id?: bigint) {
    try {
      if (!LAUNCHPAD_ADDRESS) return;

      const saleId = id ?? BigInt(buyerForm.saleId || "0");
      const amount = ethers.parseUnits(buyerForm.paymentAmount || "0", 18);

      if (amount <= 0n) {
        setPreviewTokens(0n);
        return;
      }

      const provider = new ethers.JsonRpcProvider(RPC_URL);

      const launchpad = new ethers.Contract(
        LAUNCHPAD_ADDRESS,
        launchpadAbi,
        provider
      );

      const out =
        buyerForm.payToken === "USDC"
          ? await launchpad.previewTokensForUSDC(saleId, amount)
          : await launchpad.previewTokensForUSDT(saleId, amount);

      setPreviewTokens(BigInt(out.toString()));
    } catch {
      setPreviewTokens(0n);
    }
  }

  useEffect(() => {
    updatePreview();
  }, [buyerForm.paymentAmount, buyerForm.payToken, buyerForm.saleId]);

  async function buy() {
    setBuying(true);
    setBuyerStatus("");

    try {
      if (!loadedSale) throw new Error("Load sale first.");
      if (!LAUNCHPAD_ADDRESS) throw new Error("Launchpad address is missing.");

      const signer = await getBrowserSigner();
      const buyer = await signer.getAddress();
      const saleId = BigInt(buyerForm.saleId || "0");

      const paymentAmount = ethers.parseUnits(
        buyerForm.paymentAmount || "0",
        18
      );

      if (paymentAmount <= 0n) {
        throw new Error("Payment amount must be > 0.");
      }

      const paymentAddress =
        buyerForm.payToken === "USDC" ? USDC_ADDRESS : USDT_ADDRESS;

      const paymentToken = new ethers.Contract(paymentAddress, erc20Abi, signer);
      const allowanceRaw = await paymentToken.allowance(buyer, LAUNCHPAD_ADDRESS);
      const allowance = BigInt(allowanceRaw.toString());

      if (allowance < paymentAmount) {
        setBuyerStatus(`Approving ${buyerForm.payToken}...`);

        const approveTx = await paymentToken.approve(
          LAUNCHPAD_ADDRESS,
          paymentAmount
        );

        await approveTx.wait();
      }

      const launchpad = new ethers.Contract(
        LAUNCHPAD_ADDRESS,
        launchpadAbi,
        signer
      );

      const tx =
        buyerForm.payToken === "USDC"
          ? await launchpad.buyWithUSDC(saleId, paymentAmount)
          : await launchpad.buyWithUSDT(saleId, paymentAmount);

      const receipt = await tx.wait();

      setBuyerStatus(`Buy successful. Transaction: ${receipt.hash}`);
      await loadSale();
    } catch (err: any) {
      setBuyerStatus(
        err?.shortMessage || err?.reason || err?.message || "Buy failed."
      );
    } finally {
      setBuying(false);
    }
  }

  async function claim() {
    setClaiming(true);
    setBuyerStatus("");

    try {
      if (!LAUNCHPAD_ADDRESS) {
        throw new Error("Launchpad address is missing.");
      }

      const signer = await getBrowserSigner();

      const launchpad = new ethers.Contract(
        LAUNCHPAD_ADDRESS,
        launchpadAbi,
        signer
      );

      const saleId = BigInt(buyerForm.saleId || "0");
      const tx = await launchpad.claim(saleId);
      const receipt = await tx.wait();

      setBuyerStatus(`Claim successful. Transaction: ${receipt.hash}`);
      await loadSale();
    } catch (err: any) {
      setBuyerStatus(
        err?.shortMessage || err?.reason || err?.message || "Claim failed."
      );
    } finally {
      setClaiming(false);
    }
  }

  async function adminAction(
    action: "approve" | "close" | "claim" | "unsold" | "limits" | "antibot"
  ) {
    setAdminBusy(true);
    setAdminStatus("");

    try {
      if (!LAUNCHPAD_ADDRESS) {
        throw new Error("Launchpad address is missing.");
      }

      const signer = await getBrowserSigner();

      const launchpad = new ethers.Contract(
        LAUNCHPAD_ADDRESS,
        launchpadAbi,
        signer
      );

      let tx;

      if (action === "approve") {
        if (!adminForm.creatorAddress.trim()) {
          throw new Error("Creator address is required.");
        }

        tx = await launchpad.setSaleCreatorApproval(
          ethers.getAddress(adminForm.creatorAddress.trim()),
          adminForm.approved
        );
      }

      if (action === "close") {
        tx = await launchpad.closeSale(BigInt(adminForm.saleId || "0"));
      }

      if (action === "claim") {
        tx = await launchpad.setClaimOpen(
          BigInt(adminForm.saleId || "0"),
          adminForm.claimOpen
        );
      }

      if (action === "unsold") {
        const to = adminForm.unsoldReceiver.trim()
          ? ethers.getAddress(adminForm.unsoldReceiver.trim())
          : await signer.getAddress();

        tx = await launchpad.withdrawUnsold(BigInt(adminForm.saleId || "0"), to);
      }

      if (action === "limits") {
        tx = await launchpad.setContributionLimits(
          ethers.parseUnits(adminForm.level1Limit || "0", 18),
          ethers.parseUnits(adminForm.level2Limit || "0", 18),
          ethers.parseUnits(adminForm.level3Limit || "0", 18)
        );
      }

      if (action === "antibot") {
        tx = await launchpad.setAntiBot(
          adminForm.antiBotEnabled,
          BigInt(adminForm.cooldown || "0")
        );
      }

      if (!tx) {
        throw new Error("Unknown admin action.");
      }

      const receipt = await tx.wait();

      setAdminStatus(`Admin action successful. Transaction: ${receipt.hash}`);
      await loadSale();
    } catch (err: any) {
      setAdminStatus(
        err?.shortMessage ||
          err?.reason ||
          err?.message ||
          "Admin action failed."
      );
    } finally {
      setAdminBusy(false);
    }
  }

  function levelCard(level: (typeof LEVELS)[number]) {
    const active = access.launchLevel >= level.level;

    return (
      <div
        key={level.name}
        className={[
          "launch-card-3d rounded-[28px] border p-6 transition",
          active
            ? "border-blue-300/30 bg-blue-500/10"
            : "border-white/10 bg-[#020617]/45",
        ].join(" ")}
      >
        <div className="text-sm uppercase tracking-[0.25em] text-white/45">
          {level.name}
        </div>

        <div className="mt-2 text-2xl font-black text-white">
          {level.label}
        </div>

        <div className="mt-4 grid gap-3">
          <InfoCard
            label="Requirement"
            value={`${level.minKrx.toLocaleString("en-US")} KRX`}
          />

          <InfoCard label="Max Participation" value={`$${level.maxUsd}`} />
        </div>

        <p className="mt-4 text-sm leading-relaxed text-white/65">
          {level.desc}
        </p>

        <div className="mt-5 text-sm font-black">
          {active ? (
            <span className="text-blue-100">Unlocked</span>
          ) : (
            <span className="text-white/45">Locked</span>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      <style jsx global>{`
        @keyframes launchCardShimmer {
          0%,
          76% {
            transform: translateX(-120%);
            opacity: 0;
          }

          84% {
            opacity: 1;
          }

          100% {
            transform: translateX(120%);
            opacity: 0;
          }
        }

        @keyframes launchLogoFloat {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }

          50% {
            transform: translateY(-4px) scale(1.03);
          }
        }

        .launch-logo-float {
          animation: launchLogoFloat 4.8s ease-in-out infinite;
          will-change: transform;
        }

        .launch-card-3d {
          transform-style: preserve-3d;
          transition:
            transform 240ms ease,
            border-color 240ms ease,
            background 240ms ease,
            box-shadow 240ms ease;
        }

        .launch-card-3d:hover {
          transform: translateY(-3px) perspective(900px) rotateX(1.4deg);
          border-color: rgba(96, 165, 250, 0.3);
          box-shadow: 0 20px 70px rgba(0, 0, 0, 0.42);
        }

        .launch-section-card {
          transform-style: preserve-3d;
        }

        .launch-section-card::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            120deg,
            transparent,
            rgba(255, 255, 255, 0.035),
            transparent
          );
          transform: translateX(-120%);
          animation: launchCardShimmer 8s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .launch-logo-float,
          .launch-section-card::after {
            animation: none;
          }

          .launch-card-3d:hover {
            transform: none;
          }
        }
      `}</style>

      <section className="relative overflow-hidden rounded-[38px] border border-white/10 bg-[#020617]/65 p-5 shadow-[0_34px_130px_rgba(0,0,0,0.66)] backdrop-blur-xl md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.15),transparent_35%),linear-gradient(135deg,rgba(15,23,42,0.86),rgba(2,6,23,0.96))]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:52px_52px]" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative grid gap-8 xl:grid-cols-[1fr_470px] xl:items-center">
          <div>
            <div className="inline-flex rounded-full border border-blue-300/25 bg-blue-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-blue-100">
              KORAX Launchpad / Command Center
            </div>

            <h1 className="mt-6 text-4xl font-black leading-[0.96] tracking-tight text-white sm:text-6xl xl:text-7xl">
              Launch. Join.
              <span className="block bg-gradient-to-r from-blue-300 via-cyan-200 to-white bg-clip-text text-transparent">
                Claim through KORAX.
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-white/70 sm:text-lg">
              A flexible launch system for AI-created projects and external
              projects. Sales use USDT / USDC, staged pricing, access levels,
              and controlled claim activation.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatusPill active={Boolean(currentLevel)}>
                {currentLevel ? currentLevel.label : "Access Locked"}
              </StatusPill>

              <StatusPill active={Boolean(publicProjects.length)}>
                Project Registry
              </StatusPill>

              <StatusPill active={Boolean(loadedSale?.active)}>
                Sale Console
              </StatusPill>

              <StatusPill active={Boolean(loadedSale?.claimOpen)}>
                Claim Layer
              </StatusPill>
            </div>
          </div>

          <LaunchHeroVisual />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_430px]">
        <SectionBox
          eyebrow="Your Launch Access"
          title={currentLevel ? currentLevel.label : "Launch Access Locked"}
          right={
            <StatusPill active={access.hasLaunchAccess}>
              {access.loading
                ? "Checking"
                : access.hasLaunchAccess
                  ? "Unlocked"
                  : "Locked"}
            </StatusPill>
          }
        >
          <p className="mt-3 text-sm leading-7 text-white/64">
            Your launch participation level is calculated from eligible KRX
            staking. Higher levels unlock stronger participation limits.
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <InfoCard
              label="Eligible Staking"
              value={`${access.eligibleAmount} KRX`}
            />
            <InfoCard label="Launch Level" value={access.launchLevel} />
            <InfoCard label="Project Slots" value={access.totalProjectSlots} />
            <InfoCard
              label="Required Plan"
              value={`${access.requiredRewardBps / 100}% reward plan`}
            />
          </div>

          {access.loading ? (
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
              Loading access...
            </div>
          ) : !access.connected ? (
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
              Connect wallet from the top bar.
            </div>
          ) : access.error ? (
            <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {access.error}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-blue-300/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-100">
              Wallet: {shortAddress(access.wallet)}
            </div>
          )}
        </SectionBox>

        <SectionBox eyebrow="Launch Status" title="Live Operations">
          <div className="mt-5 grid gap-3">
            <InfoCard
              label="Launchpad Role"
              value={
                isLaunchpadOwner
                  ? "Owner"
                  : isApprovedCreator
                    ? "Approved Creator"
                    : "Visitor / Buyer"
              }
            />

            <InfoCard label="Selected Sale" value={buyerForm.saleId || "0"} />
            <InfoCard label="Selected Payment" value={buyerForm.payToken} />

            <InfoCard
              label="Claim Status"
              value={loadedSale?.claimOpen ? "Open" : "Closed / Not loaded"}
            />
          </div>
        </SectionBox>
      </section>

      <SectionBox
        eyebrow="Global Project Registry"
        title="Public KORAX Launch Projects"
        right={
          <button
            type="button"
            onClick={loadPublicProjects}
            disabled={projectsLoading}
            className={ghostButtonClass}
          >
            {projectsLoading ? "Refreshing..." : "Refresh"}
          </button>
        }
      >
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/60">
          Projects registered in the KORAX Project Registry appear here for all
          visitors. Each project receives a public launch link.
        </p>

        {projectsError ? (
          <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {projectsError}
          </div>
        ) : null}

        {projectsLoading ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-[#020617]/45 p-5 text-sm text-white/60">
            Loading public projects from Project Registry...
          </div>
        ) : publicProjects.length > 0 ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {publicProjects.map((project) => (
              <ProjectIconCard
                key={project.id}
                project={project}
                active={activeProject?.slug === project.slug}
              />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[28px] border border-white/10 bg-[#020617]/45 p-6">
            <div className="text-lg font-black text-white">
              No public launches yet
            </div>

            <p className="mt-3 text-sm leading-7 text-white/60">
              After the first project is registered in the KORAX Project
              Registry, it will appear here for everyone.
            </p>
          </div>
        )}
      </SectionBox>

      {activeProject ? (
        <SectionBox
          eyebrow="Selected Project"
          title={`${activeProject.name} (${activeProject.symbol})`}
          right={<StatusPill active={activeProject.active}>Registry Live</StatusPill>}
        >
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InfoCard label="Project ID" value={activeProject.id} />
            <InfoCard label="Owner" value={shortAddress(activeProject.owner)} />
            <InfoCard label="Token" value={activeProject.token} />
            <InfoCard
              label="Created"
              value={
                activeProject.createdAt
                  ? new Date(activeProject.createdAt).toLocaleDateString()
                  : "Unknown"
              }
            />
          </div>

          <div className="mt-5 rounded-2xl border border-blue-300/20 bg-blue-500/10 p-4 text-sm leading-7 text-white/75">
            This project token is automatically selected for launch sale setup
            if your wallet is the Launchpad owner or an approved sale creator.
          </div>
        </SectionBox>
      ) : null}

      {loadedBuilderProject ? (
        <SectionBox
          eyebrow="Local Builder Data"
          title="Last project from your builder flow"
        >
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/60">
            This section is only loaded from your current browser to help you
            continue your own builder flow. Public projects above come from the
            on-chain Project Registry.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <InfoCard
              label="Project"
              value={
                loadedBuilderProject.projectName ||
                loadedBuilderProject.websiteName ||
                "Loaded Project"
              }
            />

            <InfoCard
              label="Token"
              value={loadedBuilderProject.tokenAddress || "Not available"}
            />

            <InfoCard
              label="Website"
              value={
                loadedBuilderProject.websiteGenerated
                  ? "Generated"
                  : "Not generated"
              }
            />
          </div>
        </SectionBox>
      ) : null}

      <SectionBox title="Launch Access Levels">
        <p className="mt-2 text-sm leading-relaxed text-white/60">
          Participation limits are based on KRX staking access.
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {LEVELS.map(levelCard)}
        </div>
      </SectionBox>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionBox eyebrow="Buyer Console" title="Join Launch">
          <p className="mt-2 text-sm leading-relaxed text-white/60">
            Load a sale by ID, buy with USDT or USDC, then claim after the sale
            closes and claim opens.
          </p>

          <div className="mt-6 grid gap-4">
            <div className="grid gap-4 md:grid-cols-[1fr_auto]">
              <input
                value={buyerForm.saleId}
                onChange={(e) =>
                  setBuyerForm((prev) => ({ ...prev, saleId: e.target.value }))
                }
                placeholder="Sale ID"
                className={inputClass}
              />

              <button
                type="button"
                onClick={loadSale}
                disabled={loadingSale}
                className={ghostButtonClass}
              >
                {loadingSale ? "Loading..." : "Load Sale"}
              </button>
            </div>

            {loadedSale ? (
              <div className="rounded-[28px] border border-white/10 bg-[#020617]/45 p-5">
                <div className="grid gap-3 text-sm text-white/75">
                  <div>
                    <span className="text-white/45">Owner:</span>{" "}
                    {shortAddress(loadedSale.owner)}
                  </div>

                  <div>
                    <span className="text-white/45">Sale Token:</span>{" "}
                    {shortAddress(loadedSale.saleToken)}
                  </div>

                  <div>
                    <span className="text-white/45">Fund Receiver:</span>{" "}
                    {shortAddress(loadedSale.fundReceiver)}
                  </div>

                  <div>
                    <span className="text-white/45">Status:</span>{" "}
                    {loadedSale.active ? "Active" : "Closed"} / Claim{" "}
                    {loadedSale.claimOpen ? "Open" : "Closed"}
                  </div>

                  <div>
                    <span className="text-white/45">Sold:</span>{" "}
                    {formatUnitsSafe(
                      loadedSale.totalSold,
                      loadedSale.saleTokenDecimals
                    )}{" "}
                    /{" "}
                    {formatUnitsSafe(
                      loadedSale.totalForSale,
                      loadedSale.saleTokenDecimals
                    )}
                  </div>

                  <div>
                    <span className="text-white/45">Your Max:</span> $
                    {formatUnitsSafe(buyerMax, 18, 2)}
                  </div>

                  <div>
                    <span className="text-white/45">Your Contributed:</span> $
                    {formatUnitsSafe(buyerContributed, 18, 2)}
                  </div>

                  <div>
                    <span className="text-white/45">Your Purchased:</span>{" "}
                    {formatUnitsSafe(
                      buyerPurchased,
                      loadedSale.saleTokenDecimals
                    )}
                  </div>

                  <div>
                    <span className="text-white/45">Claimed:</span>{" "}
                    {buyerClaimed ? "Yes" : "No"}
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  <div className="font-black text-white">Stages</div>

                  {loadedSale.stages.map((st, idx) => (
                    <div
                      key={idx}
                      className="launch-card-3d rounded-2xl border border-white/10 bg-[#020617]/45 p-4 text-sm text-white/70"
                    >
                      <div className="font-black text-white">
                        Stage {idx + 1}
                      </div>

                      <div className="mt-1">
                        Price: ${formatUnitsSafe(st.priceUsd18, 18, 6)}
                      </div>

                      <div className="mt-1">
                        Sold:{" "}
                        {formatUnitsSafe(st.sold, loadedSale.saleTokenDecimals)} /{" "}
                        {formatUnitsSafe(st.cap, loadedSale.saleTokenDecimals)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-[1fr_160px]">
              <input
                value={buyerForm.paymentAmount}
                onChange={(e) =>
                  setBuyerForm((prev) => ({
                    ...prev,
                    paymentAmount: e.target.value,
                  }))
                }
                placeholder="Payment Amount"
                className={inputClass}
              />

              <select
                value={buyerForm.payToken}
                onChange={(e) =>
                  setBuyerForm((prev) => ({
                    ...prev,
                    payToken: e.target.value,
                  }))
                }
                className={selectClass}
              >
                <option value="USDT">USDT</option>
                <option value="USDC">USDC</option>
              </select>
            </div>

            <div className="rounded-2xl border border-blue-300/20 bg-blue-500/10 p-4 text-sm text-white/75">
              Estimated tokens:{" "}
              <span className="font-black text-blue-100">
                {loadedSale
                  ? formatUnitsSafe(previewTokens, loadedSale.saleTokenDecimals)
                  : "0"}
              </span>
            </div>

            <button
              type="button"
              onClick={buy}
              disabled={buying || !loadedSale || !loadedSale.active}
              className={primaryButtonClass}
            >
              {buying ? "Buying..." : "Buy"}
            </button>

            {buyerStatus ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
                {buyerStatus}
              </div>
            ) : null}
          </div>
        </SectionBox>

        <SectionBox eyebrow="Claim Console" title="Claim Purchased Tokens">
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            After the project owner closes the sale and opens claim, buyers can
            withdraw their purchased tokens here.
          </p>

          <div className="mt-6 grid gap-4">
            <input
              value={buyerForm.saleId}
              onChange={(e) =>
                setBuyerForm((prev) => ({ ...prev, saleId: e.target.value }))
              }
              placeholder="Sale ID"
              className={inputClass}
            />

            <div className="rounded-2xl border border-white/10 bg-[#020617]/45 p-5 text-sm text-white/70">
              <div>
                Purchased:{" "}
                <span className="font-black text-white">
                  {loadedSale
                    ? formatUnitsSafe(
                        buyerPurchased,
                        loadedSale.saleTokenDecimals
                      )
                    : "0"}
                </span>
              </div>

              <div className="mt-2">
                Claim status:{" "}
                <span className="font-black text-white">
                  {loadedSale?.claimOpen ? "Open" : "Closed"}
                </span>
              </div>

              <div className="mt-2">
                Already claimed:{" "}
                <span className="font-black text-white">
                  {buyerClaimed ? "Yes" : "No"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={loadSale}
                disabled={loadingSale}
                className={ghostButtonClass}
              >
                Refresh Sale
              </button>

              <button
                type="button"
                onClick={claim}
                disabled={claiming || !loadedSale || !loadedSale.claimOpen}
                className={cyanButtonClass}
              >
                {claiming ? "Claiming..." : "Claim Tokens"}
              </button>
            </div>
          </div>
        </SectionBox>
      </section>

      {canCreateSale ? (
        <SectionBox
          eyebrow="Creator Console"
          title="Create Launch Sale"
          right={<StatusPill active>Creator Access</StatusPill>}
        >
          <p className="mt-2 text-sm leading-relaxed text-white/60">
            Visible only for Launchpad owner or approved sale creators.
          </p>

          <div className="mt-6 grid gap-4">
            <input
              value={creatorForm.saleToken}
              onChange={(e) =>
                setCreatorForm((prev) => ({
                  ...prev,
                  saleToken: e.target.value,
                }))
              }
              placeholder="Sale Token Address"
              className={inputClass}
            />

            <input
              value={creatorForm.fundReceiver}
              onChange={(e) =>
                setCreatorForm((prev) => ({
                  ...prev,
                  fundReceiver: e.target.value,
                }))
              }
              placeholder="Fund Receiver Wallet / leave empty for your wallet"
              className={inputClass}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <textarea
                value={creatorForm.stageCaps}
                onChange={(e) =>
                  setCreatorForm((prev) => ({
                    ...prev,
                    stageCaps: e.target.value,
                  }))
                }
                rows={5}
                placeholder={"Stage caps\n1000000\n1000000\n1000000"}
                className={inputClass}
              />

              <textarea
                value={creatorForm.stagePricesUsd}
                onChange={(e) =>
                  setCreatorForm((prev) => ({
                    ...prev,
                    stagePricesUsd: e.target.value,
                  }))
                }
                rows={5}
                placeholder={"Stage prices USD\n0.01\n0.015\n0.02"}
                className={inputClass}
              />
            </div>

            <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#020617]/45 px-4 py-3 text-sm text-white/80">
              <input
                type="checkbox"
                checked={creatorForm.requireKoraxAccess}
                onChange={(e) =>
                  setCreatorForm((prev) => ({
                    ...prev,
                    requireKoraxAccess: e.target.checked,
                  }))
                }
              />
              Require KORAX launch access to participate
            </label>

            <button
              type="button"
              onClick={createSale}
              disabled={creatingSale}
              className={primaryButtonClass}
            >
              {creatingSale ? "Creating Sale..." : "Create Launch Sale"}
            </button>

            {creatorStatus ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
                {creatorStatus}
              </div>
            ) : null}
          </div>
        </SectionBox>
      ) : null}

      {isLaunchpadOwner ? (
        <SectionBox
          eyebrow="Admin Control"
          title="Admin / Launch Manager"
          right={<StatusPill active>Owner Only</StatusPill>}
        >
          <p className="mt-2 text-sm leading-relaxed text-white/60">
            Visible only for Launchpad owner.
          </p>

          <div className="mt-6 grid gap-4">
            <input
              value={adminForm.saleId}
              onChange={(e) =>
                setAdminForm((prev) => ({ ...prev, saleId: e.target.value }))
              }
              placeholder="Sale ID"
              className={inputClass}
            />

            <div className="grid gap-4 md:grid-cols-[1fr_160px]">
              <input
                value={adminForm.creatorAddress}
                onChange={(e) =>
                  setAdminForm((prev) => ({
                    ...prev,
                    creatorAddress: e.target.value,
                  }))
                }
                placeholder="Creator address"
                className={inputClass}
              />

              <select
                value={adminForm.approved ? "true" : "false"}
                onChange={(e) =>
                  setAdminForm((prev) => ({
                    ...prev,
                    approved: e.target.value === "true",
                  }))
                }
                className={selectClass}
              >
                <option value="true">Approve</option>
                <option value="false">Remove</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => adminAction("approve")}
              disabled={adminBusy}
              className={ghostButtonClass}
            >
              Set Creator Approval
            </button>

            <div className="grid gap-3 md:grid-cols-3">
              <button
                type="button"
                onClick={() => adminAction("close")}
                disabled={adminBusy}
                className={dangerButtonClass}
              >
                Close Sale
              </button>

              <button
                type="button"
                onClick={() => adminAction("claim")}
                disabled={adminBusy}
                className={cyanButtonClass}
              >
                {adminForm.claimOpen ? "Open Claim" : "Close Claim"}
              </button>

              <select
                value={adminForm.claimOpen ? "true" : "false"}
                onChange={(e) =>
                  setAdminForm((prev) => ({
                    ...prev,
                    claimOpen: e.target.value === "true",
                  }))
                }
                className={selectClass}
              >
                <option value="true">Claim Open</option>
                <option value="false">Claim Closed</option>
              </select>
            </div>

            <input
              value={adminForm.unsoldReceiver}
              onChange={(e) =>
                setAdminForm((prev) => ({
                  ...prev,
                  unsoldReceiver: e.target.value,
                }))
              }
              placeholder="Unsold receiver / leave empty for your wallet"
              className={inputClass}
            />

            <button
              type="button"
              onClick={() => adminAction("unsold")}
              disabled={adminBusy}
              className={ghostButtonClass}
            >
              Withdraw Unsold Tokens
            </button>

            <div className="grid gap-4 md:grid-cols-3">
              <input
                value={adminForm.level1Limit}
                onChange={(e) =>
                  setAdminForm((prev) => ({
                    ...prev,
                    level1Limit: e.target.value,
                  }))
                }
                placeholder="Level 1 USD"
                className={inputClass}
              />

              <input
                value={adminForm.level2Limit}
                onChange={(e) =>
                  setAdminForm((prev) => ({
                    ...prev,
                    level2Limit: e.target.value,
                  }))
                }
                placeholder="Level 2 USD"
                className={inputClass}
              />

              <input
                value={adminForm.level3Limit}
                onChange={(e) =>
                  setAdminForm((prev) => ({
                    ...prev,
                    level3Limit: e.target.value,
                  }))
                }
                placeholder="Level 3 USD"
                className={inputClass}
              />
            </div>

            <button
              type="button"
              onClick={() => adminAction("limits")}
              disabled={adminBusy}
              className={ghostButtonClass}
            >
              Update Contribution Limits
            </button>

            <div className="grid gap-4 md:grid-cols-[1fr_160px]">
              <select
                value={adminForm.antiBotEnabled ? "true" : "false"}
                onChange={(e) =>
                  setAdminForm((prev) => ({
                    ...prev,
                    antiBotEnabled: e.target.value === "true",
                  }))
                }
                className={selectClass}
              >
                <option value="true">Anti-Bot On</option>
                <option value="false">Anti-Bot Off</option>
              </select>

              <input
                value={adminForm.cooldown}
                onChange={(e) =>
                  setAdminForm((prev) => ({
                    ...prev,
                    cooldown: e.target.value,
                  }))
                }
                placeholder="Cooldown"
                className={inputClass}
              />
            </div>

            <button
              type="button"
              onClick={() => adminAction("antibot")}
              disabled={adminBusy}
              className={ghostButtonClass}
            >
              Update Anti-Bot
            </button>

            {adminStatus ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
                {adminStatus}
              </div>
            ) : null}
          </div>
        </SectionBox>
      ) : null}
    </div>
  );
}