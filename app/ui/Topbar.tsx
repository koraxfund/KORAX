"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const XIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="currentColor"
      d="M18.9 2H22l-6.8 7.8L23 22h-6.2l-4.9-6.6L6.2 22H3l7.3-8.4L1 2h6.4l4.4 6L18.9 2Zm-1.1 18h1.7L6.3 3.9H4.5L17.8 20Z"
    />
  </svg>
);

const TelegramIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="currentColor"
      d="M9.04 15.47 8.8 19.2c.56 0 .8-.24 1.09-.53l2.62-2.5 5.43 3.97c.99.55 1.7.26 1.95-.92l3.53-16.5h0c.31-1.43-.52-1.99-1.49-1.63L1.5 9.6c-1.39.54-1.37 1.32-.25 1.66l5.46 1.7L19.4 5.26c.61-.37 1.17-.17.71.2L9.04 15.47Z"
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

export default function Topbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = useMemo<NavItem[]>(
    () => [
      { label: "Home", href: "/" },
      { label: "Presale", href: "/presale" },
      { label: "Claim", href: "/claim", sublabel: "After Presale Ends" },
      { label: "Staking", href: "/staking", sublabel: "Available After Claim" },
      { label: "Roadmap", href: "/roadmap" },
      { label: "Docs", href: "/docs" },
      { label: "Launch Your Project", href: "/launch", soon: true },
      { label: "Token Builder AI", href: "/ai", soon: true },
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
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/35 px-3 py-3 backdrop-blur-md">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/raven-logo.png"
              alt="KORAX"
              className="h-7 w-7 rounded-full object-cover"
            />
            <span className="text-sm font-semibold tracking-wide text-white">
              KORAX
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-2">
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
                        Coming Soon
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

          <div className="flex items-center gap-2">
            <a
              href="https://x.com/koraxfund"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
              aria-label="X"
              title="X"
            >
              <XIcon />
            </a>

            <a
              href="https://t.me/koraxfund"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
              aria-label="Telegram"
              title="Telegram"
            >
              <TelegramIcon />
            </a>

            <div className="block">
              <ConnectButton
                showBalance={false}
                chainStatus="none"
                accountStatus={{
                  smallScreen: "avatar",
                  largeScreen: "full",
                }}
              />
            </div>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/90 hover:bg-white/10"
              aria-label="Open Menu"
            >
              <MenuIcon />
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
                <div className="flex items-center gap-2">
                  <img
                    src="/raven-logo.png"
                    alt="KORAX"
                    className="h-7 w-7 rounded-full object-cover"
                  />
                  <span className="text-sm font-semibold tracking-wide text-white">
                    KORAX
                  </span>
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
                  <ConnectButton
                    showBalance={false}
                    chainStatus="none"
                    accountStatus="full"
                  />
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
                          Coming Soon
                        </span>
                      ) : null}
                    </Link>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-center gap-2">
                  <a
                    href="https://x.com/koraxfund"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                    aria-label="X"
                    title="X"
                  >
                    <XIcon className="h-5 w-5" />
                  </a>

                  <a
                    href="https://t.me/koraxfund"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                    aria-label="Telegram"
                    title="Telegram"
                  >
                    <TelegramIcon className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}