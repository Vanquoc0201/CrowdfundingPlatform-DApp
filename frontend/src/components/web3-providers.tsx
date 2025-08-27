"use client"; 

import * as React from 'react';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import {
  hardhat,
  sepolia, 
} from 'wagmi/chains';

import { ThemeProvider } from "@/components/theme/theme-provider"; 
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY; 

if (!walletConnectProjectId) {
  console.error("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not defined.");

}

const appChains = [
  sepolia,
  hardhat
] as const; 

const config = getDefaultConfig({
  appName: 'CrowdFunding Platform', 
  projectId: walletConnectProjectId!, 
  chains: appChains,
  ssr: true, 

});
const queryClient = new QueryClient();

export function Web3Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}