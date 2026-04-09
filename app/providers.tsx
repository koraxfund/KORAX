"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RainbowKitProvider,
  darkTheme,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  trustWallet,
  okxWallet,
  rabbyWallet,
  walletConnectWallet,
  injectedWallet,
  binanceWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { createConfig, http, WagmiProvider } from "wagmi";
import { bsc } from "wagmi/chains";

const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo-project-id";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [
        metaMaskWallet,
        trustWallet,
        binanceWallet,
        okxWallet,
        rabbyWallet,
        walletConnectWallet,
        injectedWallet,
      ],
    },
  ],
  {
    appName: "KORAX",
    projectId,
  }
);

const config = createConfig({
  chains: [bsc],
  connectors,
  transports: {
    [bsc.id]: http("https://bsc-dataseed.binance.org/"),
  },
  ssr: true,
});

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#7CFF6A",
            accentColorForeground: "#000000",
            borderRadius: "large",
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}