import { BadRequest } from "../utils/responses";
import prisma from "../../../utils/prismaClient";
import { BridgeType } from "../../../common/enums/BridgeType";
import { NextRequest } from "next/server";
import { NFTDto } from "../../../common/dto/NFTDto";

export async function GET(request: NextRequest) {
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

    const params = request.nextUrl.searchParams;

    const nfts = await prisma.nft.findMany({
        where: {
            userId: user.id,
            networkType: params.get('type') as BridgeType
        },
        select: {
            id: true,
            pinataImageHash: true,
            name: true,
            description: true,
            createdAt: true,
            tokenId: true,
            tweetLog: true,
            chain: true,
            user: true,
            networkType: true
        }
    }).then(list => list.reduce((nfts: NFTDto[], item) => {
        if (item.tokenId) {
            nfts.push({
                id: item.id,
                name: item.name,
                pinataImageHash: item.pinataImageHash,
                description: item.description || '',
                createdAt: item.createdAt.toString(),
                tokenId: item.tokenId,
                chainNativeId: item.chain.chainId,
                chainId: item.chain.id,
                chainNetwork: item.chain.network,
                chainName: item.chain.name,
                userId: item.user.id,
                userWalletAddress: item.user.metamaskWalletAddress,
                userName: item.user.twitterLogin,
                tweeted: !!item.tweetLog,
                networkType: item.networkType as BridgeType
            })
        }
        return nfts
    }, []));

    return Response.json(nfts);
}