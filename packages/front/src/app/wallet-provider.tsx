'use client'

import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { arbitrum, base, mainnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { ReactNode } from "react";

const { chains, publicClient, webSocketPublicClient } = configureChains(
    [
        mainnet,
        arbitrum,
        base,
    ],
    [publicProvider()],
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