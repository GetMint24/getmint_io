import { User } from "@prisma/client";

import prisma from "../../../utils/prismaClient";
import { BadRequest } from "../utils/responses";
import { BalanceOperation } from "../../../common/enums/BalanceOperation";
import { BalanceLogType } from "../../../common/enums/BalanceLogType";
import { BalanceOperationCost } from "../../../common/enums/BalanceOperationCost";
import { sendNFTImage } from "../nft/sendNFTImage";

/**
 * Mint операция
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

    const formData = await request.formData();

    const image: File = formData.get('image') as unknown as File;
    const name: string = formData.get('name') as unknown as string;
    const description: string | null = formData.get('description') as unknown as string;
    const tokenId = parseInt(formData.get('tokenId') as string);
    const chainNetwork = formData.get('chainNetwork') as string;
    const transactionHash = formData.get('transactionHash') as string;

    const chain = await prisma.chain.findFirst({
        where: { network: chainNetwork }
    });

    if (!chain) {
        return new BadRequest(`Chain network ${chainNetwork} not found`);
    }

    const { pinataImageHash, pinataJsonHash } = await sendNFTImage(image, name, description);

    const nftExists = await prisma.nft.findFirst({
        where: { pinataImageHash }
    });

    if (nftExists) {
        return new BadRequest('NFT already minted');
    }

    const createdNFT = await createNFT({
        name,
        description,
        pinataImageHash,
        pinataJsonHash,
        user,
        userId: user.id,
        tokenId,
        chainId: chain.id,
        transactionHash
    });

    return Response.json(createdNFT);
}

interface CreateNFTDto {
    name: string;
    description?: string;
    pinataImageHash: string;
    pinataJsonHash: string;
    user: User;
    userId: string;
    tokenId: number;
    chainId: string;
    transactionHash: string;
}

async function createNFT(data: CreateNFTDto) {
    return prisma.$transaction(async (context) => {
        const nft = await context.nft.create({
            data: {
                name: data.name,
                description: data.description,
                pinataImageHash: data.pinataImageHash,
                userId: data.userId,
                pinataJsonHash: data.pinataJsonHash,
                tokenId: data.tokenId,
                chainId: data.chainId
            }
        });

        const balanceLog = await context.balanceLog.create({
           data: {
               userId: data.userId,
               operation: BalanceOperation.Debit,
               description: 'Начисление за Mint',
               type: BalanceLogType.Mint,
               amount: BalanceOperationCost.Mint,
            }
        });

        await context.mintLog.create({
            data: {
                balanceLogId: balanceLog.id,
                nftId: nft.id,
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
                    refferalId: data.userId
                }
            });
        }

        return nft;
    });
}