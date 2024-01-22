import { NextRequest } from "next/server";
import prisma from "../../../utils/prismaClient";
import { BadRequest, NotFoundError } from "../utils/responses";
import { sendNFTImage } from "./sendNFTImage";

export async function GET(request: NextRequest) {
    const id = request.nextUrl.searchParams.get('id');

    if (id) {
        const nft = await prisma.nft.findFirst({
            where: { id },
            include: { chain: true, user: true, tweetLog: true },
        });

        if (!nft) {
            return new NotFoundError('User not found');
        }

        return Response.json({
            id: nft.id,
            name: nft.name,
            pinataImageHash: nft.pinataImageHash,
            description: nft.description,
            createdAt: nft.createdAt,
            tokenId: nft.tokenId,
            chainNativeId: nft.chain.chainId,
            chainId: nft.chain.id,
            chainNetwork: nft.chain.network,
            chainName: nft.chain.name,
            userId: nft.user.id,
            userWalletAddress: nft.user.metamaskWalletAddress,
            userName: nft.user.twitterLogin,
            tweeted: !!nft.tweetLog,
        });
    }

    return new BadRequest('NFT id is required');
}

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

    const { pinataImageHash } = await sendNFTImage(image, name, description);

    const nftExists = await prisma.nft.findFirst({
        where: { pinataImageHash }
    });

    if (nftExists) {
        return new BadRequest('NFT already minted');
    }

    return Response.json({ pinataImageHash });
}