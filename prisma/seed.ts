import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const chains = [
    {
        chainId: 8453,
        name: 'Base',
        network: 'base',
        lzChain: 184,
        hyperlaneChain: 8453,
        token: 'ETH',
        rpcUrl: 'https://mainnet.base.org'
    },
    {
        chainId: 42170,
        name: 'Arbitrum Nova',
        network: 'arbitrum-nova',
        lzChain: 175,
        hyperlaneChain: null,
        token: 'ETH',
        rpcUrl: 'https://arbitrum-nova.drpc.org'
    },
    {
        chainId: 42161,
        name: 'Arbitrum One',
        network: 'arbitrum',
        lzChain: 110,
        hyperlaneChain: 42161,
        token: 'ETH',
        rpcUrl: 'https://arb1.arbitrum.io/rpc'
    },
    {
        chainId: 43114,
        name: 'Avalance',
        network: 'avalanche',
        lzChain: 106,
        hyperlaneChain: 43114,
        token: 'AVAX',
        rpcUrl: 'https://rpc.ankr.com/avalanche'
    },
    {
        chainId: 59144,
        name: 'Linea Mainnet',
        network: 'linea-mainnet',
        lzChain: 183,
        hyperlaneChain: null,
        token: 'ETH',
        rpcUrl: 'https://linea.drpc.org',
    },
    {
        chainId: 5000,
        name: 'Mantle',
        network: 'mantle',
        lzChain: 181,
        hyperlaneChain: null,
        token: 'MNT',
        rpcUrl: 'https://rpc.mantle.xyz'
    },
    {
        chainId: 10,
        name: 'OP Mainnet',
        network: 'optimism',
        lzChain: 111,
        hyperlaneChain: 10,
        token: 'ETH',
        rpcUrl: 'https://rpc.ankr.com/optimism'
    },
    {
        chainId: 137,
        name: 'Polygon',
        network: 'matic',
        lzChain: 109,
        hyperlaneChain: 137,
        token: 'MATIC',
        rpcUrl: 'https://rpc.ankr.com/polygon'
    },
    {
        chainId: 1101,
        name: 'Polygon zkEVM',
        network: 'polygon-zkevm',
        lzChain: 158,
        hyperlaneChain: 1101,
        token: 'MATIC',
        rpcUrl: 'https://zkevm-rpc.com'
    },
    {
        chainId: 534352,
        name: 'Scroll',
        network: 'scroll',
        lzChain: 214,
        hyperlaneChain: 534352,
        token: 'ETH',
        rpcUrl: 'https://scroll.blockpi.network/v1/rpc/public'
    },
    {
        chainId: 7777777,
        name: 'Zora',
        network: 'zora',
        lzChain: 195,
        hyperlaneChain: null,
        token: 'ETH',
        rpcUrl: 'https://rpc.zora.energy'
    },
    {
        chainId: 324,
        name: 'zkSync Era',
        network: 'zksync-era',
        lzChain: 165,
        hyperlaneChain: null,
        token: 'ETH',
        rpcUrl: 'https://mainnet.era.zksync.io'
    },
    {
        chainId: 56,
        name: 'BNB Smart Chain',
        network: 'bsc',
        lzChain: 102,
        hyperlaneChain: 56,
        token: 'BNB',
        rpcUrl: 'https://rpc.ankr.com/bsc'
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