import { User } from "@prisma/client";

import prisma from "../../../../utils/prismaClient";
import { BadRequest } from "../../utils/responses";
import { BalanceOperation } from "../../../../common/enums/BalanceOperation";
import { BalanceLogType } from "../../../../common/enums/BalanceLogType";
import { BalanceOperationCost } from "../../../../common/enums/BalanceOperationCost";
import { ConfirmMintDto } from "../../../../common/dto/MintDto";

/**
 * confirm mint операция
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

    const { id, transactionHash, tokenId }: ConfirmMintDto = await request.json();

    const createdNFT = await confirmMintNFT({
        nftId: id,
        user,
        tokenId,
        transactionHash,
    });

    return Response.json(createdNFT);
}

interface ConfirmMintNFTDto {
    user: User;
    nftId: string;
    tokenId: number;
    transactionHash: string;
}

async function confirmMintNFT(data: ConfirmMintNFTDto) {
    return prisma.$transaction(async (context) => {
        const nft = await context.nft.update({
            where: { id: data.nftId },
            data: { tokenId: data.tokenId }
        });

        const balanceLog = await context.balanceLog.create({
           data: {
               userId: data.user.id,
               operation: BalanceOperation.Debit,
               description: 'Начисление за Mint',
               type: BalanceLogType.Mint,
               amount: BalanceOperationCost.Mint,
            }
        });

        await context.mintLog.create({
            data: {
                balanceLogId: balanceLog.id,
                nftId: data.nftId,
                transactionHash: data.transactionHash
            }
        });

        if (data.user.reffererId) {
            const balanceLog = await context.balanceLog.create({
                data: {
                    userId: data.user.reffererId,
                    operation: BalanceOperation.Debit,
                    description: 'Начисление за минт от реферального пользователя',
                    type: BalanceLogType.RefferalMint,
                    amount: BalanceOperationCost.RefferalMint,
                }
            });

            await context.refferalLog.create({
                data: {
                    balanceLogId: balanceLog.id,
                    reffererId: data.user.reffererId,
                    refferalId: data.user.id
                }
            });
        }

        return nft;
    });
}