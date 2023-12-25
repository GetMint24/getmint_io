'use client'

import { ReactNode } from "react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
    arbitrum,
    arbitrumNova,
    avalanche,
    base,
    bsc,
    linea,
    mantle,
    optimism,
    polygon,
    polygonZkEvm,
    scroll,
    zkSync,
    zora
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

const { chains, publicClient, webSocketPublicClient } = configureChains(
    [
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
        bsc
    ],
    [
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