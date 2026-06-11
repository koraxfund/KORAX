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

const InstagramIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
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

const ThreadsIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="currentColor"
      d="M12.02 2C6.48 2 2.6 5.82 2.6 12.02c0 6.18 3.88 9.98 9.42 9.98 5.36 0 9.02-3.26 9.02-8.03 0-4.07-2.44-6.26-5.74-6.26-2.72 0-4.82 1.58-4.82 3.97 0 2.1 1.55 3.41 3.54 3.41 1.13 0 2.1-.36 2.79-1.02-.39 1.75-1.93 2.82-4.32 2.82-3.15 0-5.19-1.92-5.19-4.9 0-3.1 2.02-5.04 5.04-5.04 1.94 0 3.25.66 4.25 1.79l1.84-1.64C16.97 5.21 14.86 4.3 12.02 4.3Zm2.1 10.98c-.82 0-1.35-.45-1.35-1.16 0-.73.57-1.21 1.43-1.21.97 0 1.58.56 1.67 1.45-.33.55-.95.92-1.75.92Z"
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
  soon?: boolean;
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
    label: "Instagram",
    href: "https://www.instagram.com/korax_fund",
    note: "Visual updates",
    icon: <InstagramIcon className="h-5 w-5" />,
    iconBg: "from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1Kv3xhJbmd/",
    note: "Official Facebook page",
    icon: <FacebookIcon className="h-5 w-5" />,
    iconBg: "from-[#1877F2] to-[#0A3D91]",
  },
  {
    label: "Threads",
    href: "https://www.threads.net/@koraxfund",
    note: "Threads updates",
    icon: <ThreadsIcon className="h-5 w-5" />,
    iconBg: "from-[#2A2A2A] to-[#000000]",
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
    iconBg: "from-[#7CFF6A] to-[#1E7A2E]",
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
        <span className="ml-auto hidden text-white/25 transition group-hover:text-[#c4ffbc] sm:inline-flex">
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
          "inline-flex h-9 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-0 text-xs font-bold text-white/85 transition hover:border-[#7CFF6A]/30 hover:bg-[#7CFF6A]/10 hover:text-[#c4ffbc] sm:h-10 sm:w-auto sm:gap-2 sm:px-4 sm:text-sm",
          fullWidth ? "w-full" : "whitespace-nowrap",
        ].join(" ")}
        aria-expanded={socialOpen}
        aria-label="Find KORAX social links"
      >
        <span className="hidden sm:inline">Find us here</span>
        <span className="sm:hidden">SM</span>
        <span className="text-white/45">{socialOpen ? "−" : "+"}</span>
      </button>

      {socialOpen ? (
        <div
          className={[
            "fixed left-4 right-4 top-[92px] z-50 max-h-[70vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#050914]/95 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.75)] backdrop-blur-xl sm:absolute sm:left-auto sm:right-auto sm:top-12 sm:w-80",
            fullWidth ? "sm:left-0 sm:right-0 sm:w-full" : positionClass,
          ].join(" ")}
        >
          <div className="border-b border-white/10 px-3 py-3">
            <div className="text-xs uppercase tracking-[0.22em] text-[#c4ffbc]">
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
      { label: "Token Builder AI", href: "/ai" },
      { label: "Website Builder AI", href: "/website-builder-ai", soon: true },
      { label: "Launch", href: "/launch" },
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
      <div className="mx-auto w-full max-w-[1500px] px-4 pt-4">
        <div className="flex items-center justify-between gap-2 rounded-2xl border border-white/10 bg-black/35 px-3 py-3 backdrop-blur-md">
          <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
            <img
              src="/raven-logo.png"
              alt="KORAX"
              className="h-8 w-8 shrink-0 rounded-full object-cover sm:h-9 sm:w-9"
            />

            <img
              src="/korax-wordmark.png"
              alt="KORAX wordmark"
              className="h-6 w-auto max-w-[110px] shrink-0 object-contain sm:h-7 sm:max-w-[150px] md:h-8 md:max-w-[180px]"
            />
          </Link>

          <nav className="hidden items-center gap-2 lg:flex">
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
                    {item.soon ? (
                      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/70">
                        Under Development
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

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <FindUsDropdown align="right" />

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
                        className="h-9 shrink-0 whitespace-nowrap rounded-xl bg-[#7CFF6A] px-3 text-sm font-semibold text-black sm:h-10 sm:px-5 sm:text-base"
                      >
                        Connect Wallet
                      </button>
                    ) : chain?.unsupported ? (
                      <button
                        onClick={openChainModal}
                        type="button"
                        className="h-9 shrink-0 whitespace-nowrap rounded-xl bg-red-500 px-3 text-sm font-semibold text-white sm:h-10 sm:px-5 sm:text-base"
                      >
                        Wrong Network
                      </button>
                    ) : (
                      <button
                        onClick={openAccountModal}
                        type="button"
                        className="h-9 max-w-[118px] shrink-0 overflow-hidden text-ellipsis whitespace-nowrap rounded-xl bg-[#7CFF6A] px-3 text-sm font-semibold text-black sm:h-10 sm:max-w-none sm:px-5 sm:text-base"
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

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 lg:hidden"
              aria-label="Open Menu"
            >
              <MenuIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
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

          <div className="fixed left-0 right-0 top-0 z-50 mx-auto w-full max-w-[1500px] px-4 pt-4">
            <div className="rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex min-w-0 items-center gap-2">
                  <img
                    src="/raven-logo.png"
                    alt="KORAX"
                    className="h-7 w-7 shrink-0 rounded-full object-cover"
                  />
                  <img
                    src="/korax-wordmark.png"
                    alt="KORAX wordmark"
                    className="h-6 w-auto max-w-[120px] object-contain"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/90 hover:bg-white/10"
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
                              className="h-11 w-full whitespace-nowrap rounded-xl bg-[#7CFF6A] font-semibold text-black"
                            >
                              Connect Wallet
                            </button>
                          ) : chain?.unsupported ? (
                            <button
                              onClick={openChainModal}
                              type="button"
                              className="h-11 w-full whitespace-nowrap rounded-xl bg-red-500 font-semibold text-white"
                            >
                              Wrong Network
                            </button>
                          ) : (
                            <button
                              onClick={openAccountModal}
                              type="button"
                              className="h-11 w-full whitespace-nowrap rounded-xl bg-[#7CFF6A] font-semibold text-black"
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

                      {item.soon ? (
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/70">
                          Under Development
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