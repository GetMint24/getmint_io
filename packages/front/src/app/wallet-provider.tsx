'use client'

import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { arbitrum, base, mainnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

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
})

export default function WalletProvider({ children }) {
    return (
        <WagmiConfig config={config}>
            {children}
        </WagmiConfig>
    )
}