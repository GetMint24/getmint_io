import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const chains = [
    {
        chainId: 8453,
        name: 'Base',
        network: 'base',
        lzChain: 184,
        token: 'ETH'
    },
    {
        chainId: 42170,
        name: 'Arbitrum Nova',
        network: 'arbitrum-nova',
        lzChain: 175,
        token: 'ETH'
    },
    {
        chainId: 42161,
        name: 'Arbitrum One',
        network: 'arbitrum',
        lzChain: 110,
        token: 'ETH'
    },
    {
        chainId: 43114,
        name: 'Avalance',
        network: 'avalanche',
        lzChain: 106,
        token: 'AVAX'
    },
    {
        chainId: 59144,
        name: 'Linea Mainnet',
        network: 'linea-mainnet',
        lzChain: 183,
        token: 'ETH'
    },
    {
        chainId: 5000,
        name: 'Mantle',
        network: 'mantle',
        lzChain: 181,
        token: 'MNT'
    },
    {
        chainId: 10,
        name: 'OP Mainnet',
        network: 'optimism',
        lzChain: 111,
        token: 'ETH'
    },
    {
        chainId: 137,
        name: 'Polygon',
        network: 'matic',
        lzChain: 109,
        token: 'MATIC'
    },
    {
        chainId: 1101,
        name: 'Polygon zkEVM',
        network: 'polygon-zkevm',
        lzChain: 158,
        token: 'MATIC'
    },
    {
        chainId: 534352,
        name: 'Scroll',
        network: 'scroll',
        lzChain: 214,
        token: 'ETH'
    },
    {
        chainId: 7777777,
        name: 'Zora',
        network: 'zora',
        lzChain: 195,
        token: 'ETH'
    },
    {
        chainId: 324,
        name: 'zkSync Era',
        network: 'zksync-era',
        lzChain: 165,
        token: 'ETH'
    },
    {
        chainId: 56,
        name: 'BNB Smart Chain',
        network: 'bsc',
        lzChain: 102,
        token: 'BNB'
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