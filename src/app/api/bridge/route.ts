import { Nft, User, Chain } from "@prisma/client";
import { BadRequest } from "../utils/responses";
import prisma from "../../../utils/prismaClient";
import { BridgeDto } from "../../../common/dto/BridgeDto";
import { BalanceOperation } from "../../../common/enums/BalanceOperation";
import { BalanceLogType } from "../../../common/enums/BalanceLogType";
import { BalanceOperationCost } from "../../../common/enums/BalanceOperationCost";

/**
 * Логика Bridge и начисления XP
 * @param request
 */
export async function POST(request: Request) {
    const metamaskWalletAddress = request.headers.get('X-Metamask-Address');

    if (!metamaskWalletAddress) {
        return new BadRequest('Metamask account not provided');
    }

    let user = await prisma.user.findFirst({
        where: { metamaskWalletAddress }
    });

    if (!user) {
        return new BadRequest('User not found');
    }

    const data: BridgeDto = await request.json();

    const nft = await prisma.nft.findFirst({
        where: { id: data.nftId }
    });

    if (!nft) {
        return new BadRequest('NFT not found');
    }

    const chain = await prisma.chain.findFirst({
        where: { network: data.nextChainNetwork }
    });

    if (!chain) {
        return new BadRequest(`Chain network ${data.nextChainNetwork} not found`);
    }

    const updatedNft = await bridge({
        ...data,
        user,
        nft,
        chain
    });

    return Response.json(updatedNft);
}

interface BridgeParams extends BridgeDto {
    chain: Chain;
    user: User;
    nft: Nft;
}

async function bridge(params: BridgeParams) {
    return prisma.$transaction(async (context) => {
        const nft = await context.nft.update({
            where: { id: params.nftId },
            data: { chainId: params.chain.id }
        });

        const balanceLog = await context.balanceLog.create({
            data: {
                userId: params.user.id,
                operation: BalanceOperation.Debit,
                description: 'Начисление за Bridge',
                type: BalanceLogType.Bridge,
                amount: BalanceOperationCost.Bridge,
            }
        });

        await context.bridgeLog.create({
            data: {
                balanceLogId: balanceLog.id,
                nftId: params.nft.id,
                transactionHash: params.transactionHash,
                previousChain: params.previousChainNetwork,
                nextChain: params.nextChainNetwork
            }
        });

        return nft;
    });
}