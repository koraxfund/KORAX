"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const TelegramIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="currentColor"
      d="M9.04 15.47 8.8 19.2c.56 0 .8-.24 1.09-.53l2.62-2.5 5.43 3.97c.99.55 1.7.26 1.95-.92l3.53-16.5h0c.31-1.43-.52-1.99-1.49-1.63L1.5 9.6c-1.39.54-1.37 1.32-.25 1.66l5.46 1.7L19.4 5.26c.61-.37 1.17-.17.71.2L9.04 15.47Z"
    />
  </svg>
);

const YouTubeIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="currentColor"
      d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12l-6.2 3.6Z"
    />
  </svg>
);

const TikTokIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="currentColor"
      d="M16.7 2c.3 2.3 1.6 3.8 4 4v4.1a8.5 8.5 0 0 1-4-1.1v6.5c0 4.2-2.8 6.5-6.4 6.5-3.2 0-6-2.2-6-5.6 0-3.8 3-5.9 6.7-5.6v4.2c-1.6-.4-2.8.3-2.8 1.5 0 1.1.9 1.8 2 1.8 1.3 0 2.1-.7 2.1-2.5V2h4.4Z"
    />
  </svg>
);

const FacebookIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="currentColor"
      d="M14 8.5h2.2V5.2c-.38-.05-1.7-.16-3.22-.16-3.18 0-5.36 1.94-5.36 5.5v3.1H4v3.7h3.62V24h4.42v-6.66h3.46l.55-3.7h-4.01v-2.74c0-1.07.3-2.4 1.96-2.4Z"
    />
  </svg>
);

const LinkedInIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="currentColor"
      d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.3 8h4.4v14H.3V8Zm7.2 0h4.2v1.9h.1c.6-1.1 2-2.3 4.1-2.3 4.4 0 5.2 2.9 5.2 6.6V22h-4.4v-6.9c0-1.6 0-3.8-2.3-3.8s-2.7 1.8-2.7 3.7v7H7.5V8Z"
    />
  </svg>
);

const MailIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="currentColor"
      d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z"
    />
  </svg>
);

const ExternalIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="currentColor"
      d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3ZM5 5h6v2H7v10h10v-4h2v6H5V5Z"
    />
  </svg>
);

const MenuIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="currentColor"
      d="M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h16v2H4v-2Z"
    />
  </svg>
);

const CloseIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="currentColor"
      d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.29 19.71 2.88 18.29 9.17 12 2.88 5.71 4.29 4.29l6.3 6.31 6.3-6.31 1.41 1.42Z"
    />
  </svg>
);

type NavItem = {
  label: string;
  href: string;
  status?: "Live" | "Planned";
  sublabel?: string;
};

type SocialItem = {
  label: string;
  href?: string;
  note?: string;
  icon: ReactNode;
  internal?: boolean;
  iconBg: string;
};

function shortAddress(address?: string) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function statusClass(status: NavItem["status"]) {
  if (status === "Live") {
    return "border-blue-400/25 bg-blue-500/10 text-blue-100";
  }

  return "border-white/10 bg-white/5 text-white/60";
}

const socialLinks: SocialItem[] = [
  {
    label: "Telegram Channel",
    href: "https://t.me/koraxfund",
    note: "Official updates",
    icon: <TelegramIcon className="h-5 w-5" />,
    iconBg: "from-[#26A5E4] to-[#0B6EA8]",
  },
  {
    label: "Telegram Group",
    href: "https://t.me/koraxgroub",
    note: "Community discussion",
    icon: <TelegramIcon className="h-5 w-5" />,
    iconBg: "from-[#229ED9] to-[#075985]",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@koraxfund",
    note: "Official videos",
    icon: <YouTubeIcon className="h-5 w-5" />,
    iconBg: "from-[#FF0000] to-[#7F0000]",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@koraxfund",
    note: "Short-form updates",
    icon: <TikTokIcon className="h-5 w-5" />,
    iconBg: "from-[#25F4EE] via-[#111111] to-[#FE2C55]",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1Kv3xhJbmd/",
    note: "Official Facebook page",
    icon: <FacebookIcon className="h-5 w-5" />,
    iconBg: "from-[#1877F2] to-[#0A3D91]",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/koraxfund",
    note: "Professional updates",
    icon: <LinkedInIcon className="h-5 w-5" />,
    iconBg: "from-[#0A66C2] to-[#003B73]",
  },
  {
    label: "Email",
    href: "mailto:contact@korax.fund",
    note: "contact@korax.fund",
    icon: <MailIcon className="h-5 w-5" />,
    iconBg: "from-[#2563eb] to-[#020617]",
  },
];

function SocialLinkRow({ item }: { item: SocialItem }) {
  const content = (
    <>
      <span
        className={[
          "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-[0_0_22px_rgba(80,140,255,0.22)] ring-1 ring-white/10 transition group-hover:scale-105",
          item.iconBg,
        ].join(" ")}
      >
        {item.icon}
      </span>

      <span className="min-w-0">
        <span className="block text-sm font-semibold">{item.label}</span>
        {item.note ? (
          <span className="block truncate text-xs text-white/40">
            {item.note}
          </span>
        ) : null}
      </span>

      {item.href ? (
        <span className="ml-auto hidden text-white/25 transition group-hover:text-blue-100 sm:inline-flex">
          <ExternalIcon className="h-4 w-4" />
        </span>
      ) : null}
    </>
  );

  if (!item.href) {
    return (
      <div className="flex items-center gap-3 rounded-xl px-3 py-3 text-white/35">
        {content}
      </div>
    );
  }

  if (item.internal) {
    return (
      <Link
        href={item.href}
        className="group flex items-center gap-3 rounded-xl px-3 py-3 text-white/75 transition hover:bg-white/[0.06] hover:text-white"
      >
        {content}
      </Link>
    );
  }

  return (
    <a
      href={item.href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center gap-3 rounded-xl px-3 py-3 text-white/75 transition hover:bg-white/[0.06] hover:text-white"
    >
      {content}
    </a>
  );
}

function FindUsDropdown({
  align = "right",
  fullWidth = false,
}: {
  align?: "left" | "right" | "center";
  fullWidth?: boolean;
}) {
  const [socialOpen, setSocialOpen] = useState(false);

  const positionClass =
    align === "left"
      ? "left-0"
      : align === "center"
        ? "left-1/2 -translate-x-1/2"
        : "right-0";

  return (
    <div className={fullWidth ? "relative w-full" : "relative"}>
      <button
        type="button"
        onClick={() => setSocialOpen((prev) => !prev)}
        className={[
          "inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-black text-white/85 transition hover:border-blue-400/35 hover:bg-blue-500/10 hover:text-blue-100",
          fullWidth ? "w-full" : "whitespace-nowrap",
        ].join(" ")}
        aria-expanded={socialOpen}
        aria-label="Find KORAX social links"
      >
        <span>{fullWidth ? "Find us here" : "SM"}</span>
        <span className="ml-1 text-white/45">{socialOpen ? "−" : "+"}</span>
      </button>

      {socialOpen ? (
        <div
          className={[
            "fixed left-4 right-4 top-[92px] z-50 max-h-[70vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#050914]/95 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.75)] backdrop-blur-xl sm:absolute sm:left-auto sm:right-auto sm:top-12 sm:w-80",
            fullWidth ? "sm:left-0 sm:right-0 sm:w-full" : positionClass,
          ].join(" ")}
        >
          <div className="border-b border-white/10 px-3 py-3">
            <div className="text-xs uppercase tracking-[0.22em] text-blue-100">
              KORAX Socials
            </div>

            <div className="mt-1 text-xs leading-relaxed text-white/45">
              Official channels and community links.
            </div>
          </div>

          <div className="mt-2 grid gap-1">
            {socialLinks.map((item) => (
              <SocialLinkRow key={item.label} item={item} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function WordmarkBrand({ mobileMenu = false }: { mobileMenu?: boolean }) {
  return (
    <Link
      href="/"
      className="topbar-wordmark-link flex min-w-0 shrink-0 items-center bg-transparent"
      aria-label="KORAX Home"
    >
      <img
        src="/korax-wordmark.png"
        alt="KORAX"
        className={[
          "topbar-wordmark-image bg-transparent object-contain",
          mobileMenu
            ? "h-8 w-auto max-w-[180px]"
            : "h-7 w-auto max-w-[112px] sm:h-8 sm:max-w-[170px] lg:h-9 lg:max-w-[210px]",
        ].join(" ")}
      />
    </Link>
  );
}

export default function Topbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = useMemo<NavItem[]>(
    () => [
      { label: "Home", href: "/" },
      { label: "Roadmap", href: "/roadmap" },
      { label: "Docs", href: "/docs" },
      { label: "Presale", href: "/presale" },
      { label: "Claim", href: "/claim", sublabel: "After Presale Ends" },
      { label: "Staking", href: "/staking", sublabel: "Available After Claim" },
      { label: "Token Builder AI", href: "/ai", status: "Live" },
      {
        label: "Website Builder AI",
        href: "/website-builder-ai",
        status: "Live",
      },
      { label: "Launch", href: "/launch", status: "Live" },
    ],
    []
  );

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <header className="fixed left-0 right-0 top-0 z-50">
      <style>{`
        @keyframes topbarFloat {
          0%, 100% {
            transform: translateY(0) rotateX(0deg);
          }

          50% {
            transform: translateY(-2px) rotateX(2deg);
          }
        }

        @keyframes topbarGlow {
          0%, 100% {
            opacity: 0.35;
          }

          50% {
            opacity: 0.85;
          }
        }

        .topbar-shell {
          transform-style: preserve-3d;
          perspective: 1000px;
        }

        .topbar-wordmark-link {
          transform-style: preserve-3d;
        }

        .topbar-wordmark-image {
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
          filter: drop-shadow(0 0 14px rgba(59, 130, 246, 0.72));
          animation: topbarFloat 5s ease-in-out infinite;
          will-change: transform;
        }

        .topbar-shell::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 1rem;
          pointer-events: none;
          background:
            radial-gradient(circle at 15% 50%, rgba(59, 130, 246, 0.13), transparent 28%),
            radial-gradient(circle at 85% 50%, rgba(14, 165, 233, 0.08), transparent 26%);
          animation: topbarGlow 4s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .topbar-wordmark-image,
          .topbar-shell::before {
            animation: none;
          }
        }
      `}</style>

      <div className="mx-auto w-full max-w-[1500px] px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="topbar-shell relative flex min-h-[64px] items-center gap-2 rounded-2xl border border-white/10 bg-black/40 px-3 py-3 shadow-[0_18px_70px_rgba(0,0,0,0.45)] backdrop-blur-md">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="relative z-20 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 lg:hidden"
            aria-label="Open Menu"
          >
            <MenuIcon className="h-5 w-5" />
          </button>

          <WordmarkBrand />

          <nav className="relative z-10 hidden flex-1 items-center justify-center gap-2 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "rounded-xl px-3 py-2 text-sm transition",
                  isActive(item.href)
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white",
                ].join(" ")}
              >
                <span className="flex flex-col items-center text-center leading-tight">
                  <span className="inline-flex items-center gap-2">
                    {item.label}
                    {item.status ? (
                      <span
                        className={[
                          "rounded-full border px-2 py-0.5 text-[11px]",
                          statusClass(item.status),
                        ].join(" ")}
                      >
                        {item.status}
                      </span>
                    ) : null}
                  </span>

                  {item.sublabel ? (
                    <span className="mt-1 text-[10px] text-white/40">
                      {item.sublabel}
                    </span>
                  ) : null}
                </span>
              </Link>
            ))}
          </nav>

          <div className="relative z-20 ml-auto flex shrink-0 items-center gap-2">
            <div className="hidden md:block">
              <FindUsDropdown align="right" />
            </div>

            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
              }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                return (
                  <div
                    aria-hidden={!ready}
                    className={!ready ? "pointer-events-none opacity-0" : ""}
                  >
                    {!connected ? (
                      <button
                        onClick={openConnectModal}
                        type="button"
                        className="h-10 shrink-0 whitespace-nowrap rounded-xl bg-blue-500 px-4 text-xs font-black text-white shadow-[0_0_25px_rgba(59,130,246,0.25)] transition hover:bg-blue-400 sm:px-5 sm:text-sm"
                      >
                        Connect Wallet
                      </button>
                    ) : chain?.unsupported ? (
                      <button
                        onClick={openChainModal}
                        type="button"
                        className="h-10 shrink-0 whitespace-nowrap rounded-xl bg-red-500 px-4 text-xs font-black text-white sm:px-5 sm:text-sm"
                      >
                        Wrong Network
                      </button>
                    ) : (
                      <button
                        onClick={openAccountModal}
                        type="button"
                        className="h-10 max-w-[120px] shrink-0 overflow-hidden text-ellipsis whitespace-nowrap rounded-xl bg-blue-500 px-4 text-xs font-black text-white shadow-[0_0_25px_rgba(59,130,246,0.25)] transition hover:bg-blue-400 sm:max-w-none sm:px-5 sm:text-sm"
                        title={account.address}
                      >
                        <span className="sm:hidden">
                          {shortAddress(account.address)}
                        </span>
                        <span className="hidden sm:inline">
                          {account.displayName}
                        </span>
                      </button>
                    )}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </div>
      </div>

      {open ? (
        <div className="lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/60"
            aria-label="Close Overlay"
          />

          <div className="fixed left-0 right-0 top-0 z-50 mx-auto w-full max-w-[1500px] px-3 pt-3 sm:px-4 sm:pt-4">
            <div className="max-h-[calc(100vh-24px)] overflow-y-auto rounded-2xl border border-white/10 bg-black/80 shadow-[0_24px_90px_rgba(0,0,0,0.75)] backdrop-blur-md">
              <div className="relative flex min-h-[64px] items-center justify-between px-4 py-3">
                <WordmarkBrand mobileMenu />

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/90 hover:bg-white/10"
                  aria-label="Close Menu"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="px-4 pb-4">
                <div className="mb-3">
                  <ConnectButton.Custom>
                    {({
                      account,
                      chain,
                      openAccountModal,
                      openChainModal,
                      openConnectModal,
                      mounted,
                    }) => {
                      const ready = mounted;
                      const connected = ready && account && chain;

                      return (
                        <div
                          aria-hidden={!ready}
                          className={
                            !ready ? "pointer-events-none opacity-0" : ""
                          }
                        >
                          {!connected ? (
                            <button
                              onClick={openConnectModal}
                              type="button"
                              className="h-11 w-full whitespace-nowrap rounded-xl bg-blue-500 font-black text-white"
                            >
                              Connect Wallet
                            </button>
                          ) : chain?.unsupported ? (
                            <button
                              onClick={openChainModal}
                              type="button"
                              className="h-11 w-full whitespace-nowrap rounded-xl bg-red-500 font-black text-white"
                            >
                              Wrong Network
                            </button>
                          ) : (
                            <button
                              onClick={openAccountModal}
                              type="button"
                              className="h-11 w-full whitespace-nowrap rounded-xl bg-blue-500 font-black text-white"
                              title={account.address}
                            >
                              {account.displayName}
                            </button>
                          )}
                        </div>
                      );
                    }}
                  </ConnectButton.Custom>
                </div>

                <div className="mb-3">
                  <FindUsDropdown align="center" fullWidth />
                </div>

                <div className="grid gap-2 rounded-2xl border border-white/10 bg-white/5 p-3">
                  {nav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={[
                        "flex items-start justify-between rounded-xl px-3 py-3 text-sm transition",
                        isActive(item.href)
                          ? "bg-white/10 text-white"
                          : "text-white/80 hover:bg-white/10",
                      ].join(" ")}
                    >
                      <div className="flex flex-col leading-tight">
                        <span>{item.label}</span>

                        {item.sublabel ? (
                          <span className="mt-1 text-[11px] text-white/45">
                            {item.sublabel}
                          </span>
                        ) : null}
                      </div>

                      {item.status ? (
                        <span
                          className={[
                            "rounded-full border px-2 py-0.5 text-[11px]",
                            statusClass(item.status),
                          ].join(" ")}
                        >
                          {item.status}
                        </span>
                      ) : null}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}