import { PrismaClient } from '@prisma/client'
import { BridgeType } from "../src/common/enums/BridgeType";
const prisma = new PrismaClient()

const chains = [
    {
        chainId: 8453,
        name: 'Base',
        network: 'base',
        lzChain: 184,
        hyperlaneChain: 8453,
        token: 'ETH',
        rpcUrl: 'https://mainnet.base.org',
        availableBridgeTypes: [BridgeType.LayerZero, BridgeType.Hyperlane]
    },
    {
        chainId: 42170,
        name: 'Arbitrum Nova',
        network: 'arbitrum-nova',
        lzChain: 175,
        hyperlaneChain: null,
        token: 'ETH',
        rpcUrl: 'https://arbitrum-nova.drpc.org',
        availableBridgeTypes: [BridgeType.LayerZero]
    },
    {
        chainId: 42161,
        name: 'Arbitrum One',
        network: 'arbitrum',
        lzChain: 110,
        hyperlaneChain: 42161,
        token: 'ETH',
        rpcUrl: 'https://arb1.arbitrum.io/rpc',
        availableBridgeTypes: [BridgeType.LayerZero, BridgeType.Hyperlane]
    },
    {
        chainId: 43114,
        name: 'Avalance',
        network: 'avalanche',
        lzChain: 106,
        hyperlaneChain: 43114,
        token: 'AVAX',
        rpcUrl: 'https://rpc.ankr.com/avalanche',
        availableBridgeTypes: [BridgeType.LayerZero, BridgeType.Hyperlane]
    },
    {
        chainId: 59144,
        name: 'Linea Mainnet',
        network: 'linea-mainnet',
        lzChain: 183,
        hyperlaneChain: null,
        token: 'ETH',
        rpcUrl: 'https://linea.drpc.org',
        availableBridgeTypes: [BridgeType.LayerZero]
    },
    {
        chainId: 5000,
        name: 'Mantle',
        network: 'mantle',
        lzChain: 181,
        hyperlaneChain: null,
        token: 'MNT',
        rpcUrl: 'https://rpc.mantle.xyz',
        availableBridgeTypes: [BridgeType.LayerZero]
    },
    {
        chainId: 10,
        name: 'OP Mainnet',
        network: 'optimism',
        lzChain: 111,
        hyperlaneChain: 10,
        token: 'ETH',
        rpcUrl: 'https://rpc.ankr.com/optimism',
        availableBridgeTypes: [BridgeType.LayerZero, BridgeType.Hyperlane]
    },
    {
        chainId: 137,
        name: 'Polygon',
        network: 'matic',
        lzChain: 109,
        hyperlaneChain: 137,
        token: 'MATIC',
        rpcUrl: 'https://rpc.ankr.com/polygon',
        availableBridgeTypes: [BridgeType.LayerZero, BridgeType.Hyperlane]
    },
    {
        chainId: 1101,
        name: 'Polygon zkEVM',
        network: 'polygon-zkevm',
        lzChain: 158,
        hyperlaneChain: 1101,
        token: 'MATIC',
        rpcUrl: 'https://zkevm-rpc.com',
        availableBridgeTypes: [BridgeType.LayerZero],
    },
    {
        chainId: 534352,
        name: 'Scroll',
        network: 'scroll',
        lzChain: 214,
        hyperlaneChain: 534352,
        token: 'ETH',
        rpcUrl: 'https://scroll.blockpi.network/v1/rpc/public',
        availableBridgeTypes: [BridgeType.LayerZero, BridgeType.Hyperlane]
    },
    {
        chainId: 7777777,
        name: 'Zora',
        network: 'zora',
        lzChain: 195,
        hyperlaneChain: null,
        token: 'ETH',
        rpcUrl: 'https://rpc.zora.energy',
        availableBridgeTypes: [BridgeType.LayerZero]
    },
    {
        chainId: 324,
        name: 'zkSync Era',
        network: 'zksync-era',
        lzChain: 165,
        hyperlaneChain: null,
        token: 'ETH',
        rpcUrl: 'https://mainnet.era.zksync.io',
        availableBridgeTypes: [BridgeType.LayerZero]
    },
    {
        chainId: 56,
        name: 'BNB Smart Chain',
        network: 'bsc',
        lzChain: 102,
        hyperlaneChain: 56,
        token: 'BNB',
        rpcUrl: 'https://rpc.ankr.com/bsc',
        availableBridgeTypes: [BridgeType.LayerZero, BridgeType.Hyperlane]
    },
    {
        chainId: 42220,
        name: 'Celo',
        network: 'celo',
        lzChain: 125,
        hyperlaneChain: 42220,
        token: 'CELO',
        rpcUrl: 'https://forno.celo.org',
        availableBridgeTypes: [BridgeType.LayerZero, BridgeType.Hyperlane]
    },
    {
        chainId: 1116,
        name: 'Core Dao',
        network: 'coreDao',
        lzChain: 153,
        hyperlaneChain: null,
        token: 'CORE',
        rpcUrl: 'https://rpc.coredao.org',
        availableBridgeTypes: [BridgeType.LayerZero]
    },
    {
        chainId: 100,
        name: 'Gnosis',
        network: 'gnosis',
        lzChain: 145,
        hyperlaneChain: 100,
        token: 'xDAI',
        rpcUrl: 'https://rpc.gnosischain.com',
        availableBridgeTypes: [BridgeType.LayerZero, BridgeType.Hyperlane]
    },
    {
        chainId: 250,
        name: 'Fantom',
        network: 'fantom',
        lzChain: 112,
        hyperlaneChain: null,
        token: 'FTM',
        rpcUrl: 'https://rpc.ankr.com/fantom',
        availableBridgeTypes: [BridgeType.LayerZero]
    }
];

async function seed() {
    await prisma.$transaction(
        chains.map(chain =>
            prisma.chain.upsert({
                where: { chainId: chain.chainId },
                update: chain,
                create: chain,
            })
        )
    );
}

seed()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })