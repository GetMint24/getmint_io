'use client';

import { ReactNode } from 'react';

import { getDefaultConfig, RainbowKitProvider, darkTheme} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  arbitrum,
  arbitrumNova,
  avalanche,
  base,
  bsc,
  celo,
  gnosis,
  linea,
  mantle,
  optimism,
  polygon,
  polygonZkEvm,
  scroll,
  zkSync,
  zora,
} from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [
    base,
    arbitrumNova,
    arbitrum,
    linea,
    optimism,
    avalanche,
    zora,
    scroll,
    polygon,
    polygonZkEvm,
    mantle,
    zkSync,
    bsc,
    celo,
    gnosis,
  ],
  ssr: true,
});

const queryClient = new QueryClient();

interface WalletProviderProps {
  children: ReactNode;
}

export default function WalletProvider({ children }: WalletProviderProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
