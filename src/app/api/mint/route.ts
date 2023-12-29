import axios from "axios";
import { User } from "@prisma/client";
import { format } from "date-fns";
import * as piexif from "piexifjs";

import prisma from "../../../utils/prismaClient";
import { BadRequest } from "../utils/responses";
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

async function sendNFTImage(image: File, name: string, description: string = '') {
    const pinataFormData = new FormData();

    const imageBuffer = await image.arrayBuffer();
    const binary = Buffer.from(imageBuffer).toString('binary');
    const exifString = piexif.dump({ 'Exif': { '36867': format(new Date(), 'yyyy:MM:dd HH:mm:ss') } });
    const inserted = piexif.insert(exifString, binary);
    console.log(inserted);
    const file = Buffer.from(inserted, 'binary');
    // console.log(file.toString('base64'));

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

    const { IpfsHash: pinataImageHash } = response.data;

    const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        generateNFTMetadata(name, description, pinataImageHash),
        {
            headers: {
                Authorization: `Bearer ${process.env.PINATA_JWT}`,
            },
        }
    );

    const { IpfsHash: pinataJsonHash } = res.data;

    return {
        pinataImageHash,
        pinataJsonHash
    };
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

        return nft;
    });
}

function generateNFTMetadata(name: string, description: string, imageHash: string) {
    return {
        pinataContent: {
            name,
            description,
            image: `${process.env.PINATA_GATEWAY}/ipfs/${imageHash}?pinataGatewayToken=${process.env.PINATA_GATEWAY_TOKEN}`,
        },
        pinataMetadata: {
            name: `${name}.json`
        }
    };
}