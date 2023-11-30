'use client'

import { ReactNode } from "react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { alchemyProvider } from '@wagmi/core/providers/alchemy';

const { chains, publicClient, webSocketPublicClient } = configureChains(
    [
        mainnet,
        sepolia,
    ],
    [
        alchemyProvider({ apiKey: 'y6QC0M5M2SuotNrlDd61wBsNXHh_RjNi' }),
        publicProvider()
    ],
);

const config = createConfig({
    autoConnect: true,
    connectors: [
        new MetaMaskConnector({ chains }),
    ],
    publicClient,
    webSocketPublicClient,
});

interface WalletProviderProps {
    children: ReactNode;
}

export default function WalletProvider({ children }: WalletProviderProps) {
    return (
        <WagmiConfig config={config}>
            {children}
        </WagmiConfig>
    )
}