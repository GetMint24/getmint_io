import axios from "axios";

import prisma from "../../../utils/prismaClient";
import { BadRequest, InternalError } from "../utils/responses";
import { BalanceOperation } from "../../../common/enums/BalanceOperation";
import { BalanceLogType } from "../../../common/enums/BalanceLogType";
import { BalanceOperationCost } from "../../../common/enums/BalanceOperationCost";

/**
 * Mint операция
 */
export async function POST(request: Request) {
    const metamaskWalletAddress = request.headers.get('X-Metamask-Address');

    if (!metamaskWalletAddress) {
        return new BadRequest('Metamask account not provided');
    }

    try {
        const user = await prisma.user.findFirst({
            where: { metamaskWalletAddress }
        });

        if (!user) {
            return new BadRequest('User Not Found');
        }

        const formData = await request.formData();

        const image: File = formData.get('image') as unknown as File;
        const name: string = formData.get('name') as unknown as string;
        const description: string | null = formData.get('description') as unknown as string;

        const pinataImageHash = await sendNFTImage(image, name, description);

        const createdNFT = await createNFT({
            name,
            description,
            pinataImageHash,
            userId: user.id
        });

        return Response.json(createdNFT);
    } catch (e) {
        console.error(e);
        return new InternalError(e);
    }
}

async function sendNFTImage(image: File, name: string, description: string = ''): Promise<string> {
    const pinataFormData = new FormData();

    pinataFormData.append('file', image);
    pinataFormData.append('pinataMetadata', JSON.stringify({
        name,
        keyvalues: { description }
    }));

    const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        pinataFormData,
        {
            headers: {
                Authorization: `Bearer ${process.env.PINATA_JWT}`,
            },
        }
    );

    const { IpfsHash } = response.data;

    return IpfsHash;
}

interface CreateNFTDto {
    name: string;
    description?: string;
    pinataImageHash: string;
    userId: number;
}

async function createNFT(data: CreateNFTDto) {
    return prisma.$transaction(async (context) => {
        const nft = await context.nft.create({
            data: {
                name: data.name,
                description: data.description,
                pinataImageHash: data.pinataImageHash,
                userId: data.userId,
            }
        });

        let balance = BalanceOperationCost.Mint;

        const lastBalanceLogRecord = await context.balanceLog.findFirst({
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (lastBalanceLogRecord) {
            balance = lastBalanceLogRecord.balance + BalanceOperationCost.Mint;
        }

        await context.balanceLog.create({
           data: {
               userId: data.userId,
               operation: BalanceOperation.Debit,
               description: 'Начисление за Mint',
               type: BalanceLogType.Mint,
               amount: BalanceOperationCost.Mint,
               balance,
           }
        });

        return nft;
    });
}