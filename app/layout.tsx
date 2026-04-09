import "./globals.css";
import Topbar from "./ui/Topbar";
import Providers from "./providers";

export const metadata = {
  title: "KORAX — Your path to become a millionaire.",
  description: "KORAX Presale & Staking",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Providers>
          <Topbar />

          <main className="mx-auto w-full max-w-[1500px] px-6 pt-24 pb-10">
            {children}
          </main>

          <footer className="mx-auto w-full max-w-6xl px-6 pb-10 pt-6 text-xs text-white/45">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>© {new Date().getFullYear()} KORAX • All rights reserved</div>

              <div className="flex flex-wrap gap-4">
                <a className="hover:text-white" href="/about">
                  About
                </a>
                <a className="hover:text-white" href="/terms">
                  Terms of service
                </a>
                <a className="hover:text-white" href="/privacy">
                  Privacy Policy
                </a>
                <a className="hover:text-white" href="/docs">
                  Docs
                </a>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}