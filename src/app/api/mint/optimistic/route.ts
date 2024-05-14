import prisma from "../../../../utils/prismaClient";
import { BadRequest } from "../../utils/responses";
import { CreateOptimisticMintDto } from "../../../../common/dto/MintDto";

/**
 * Optimistic mint операция
 */
export async function POST(request: Request) {
    const metamaskWalletAddress = request.headers.get('X-Metamask-Address');

    if (!metamaskWalletAddress) {
        return new BadRequest('Metamask account not provided');
    }

    const user = await prisma.user.findFirst({
        where: { metamaskWalletAddress }
    });

    if (!user) {
        return new BadRequest('User not found');
    }

    const { name, description, chainNetwork, networkType, pinataImageHash, pinataJsonHash }: CreateOptimisticMintDto = await request.json();

    const chain = await prisma.chain.findFirst({
        where: { network: chainNetwork }
    });

    if (!chain) {
        return new BadRequest(`Chain network ${chainNetwork} not found`);
    }

    const createdNFT = await prisma.nft.create({
        data: {
            name,
            description,
            pinataImageHash,
            pinataJsonHash,
            userId: user.id,
            chainId: chain.id,
            networkType
        }
    });

    return Response.json(createdNFT);
}
