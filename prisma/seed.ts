import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const chains = [
    {
        chainId: 8453,
        name: 'Base',
        network: 'base',
        lzChain: 184
    },
    {
        chainId: 42170,
        name: 'Arbitrum Nova',
        network: 'arbitrum-nova',
        lzChain: 175
    },
    {
        chainId: 42161,
        name: 'Arbitrum One',
        network: 'arbitrum',
        lzChain: 110
    },
    {
        chainId: 43114,
        name: 'Avalance',
        network: 'avalanche',
        lzChain: 106
    },
    {
        chainId: 59144,
        name: 'Linea Mainnet',
        network: 'linea-mainnet',
        lzChain: 183
    },
    {
        chainId: 5000,
        name: 'Mantle',
        network: 'mantle',
        lzChain: 181
    },
    {
        chainId: 10,
        name: 'OP Mainnet',
        network: 'optimism',
        lzChain: 111
    },
    {
        chainId: 137,
        name: 'Polygon',
        network: 'matic',
        lzChain: 109
    },
    {
        chainId: 1101,
        name: 'Polygon zkEVM',
        network: 'polygon-zkevm',
        lzChain: 158
    },
    {
        chainId: 534352,
        name: 'Scroll',
        network: 'scroll',
        lzChain: 214
    },
    {
        chainId: 7777777,
        name: 'Zora',
        network: 'zora',
        lzChain: 195
    },
    {
        chainId: 324,
        name: 'zkSync Era',
        network: 'zksync-era',
        lzChain: 165
    },
    {
        chainId: 56,
        name: 'BNB Smart Chain',
        network: 'bsc',
        lzChain: 102
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