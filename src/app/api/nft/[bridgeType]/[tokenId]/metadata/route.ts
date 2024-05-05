import prisma from "../../../../../../utils/prismaClient";
import { BridgeType } from "../../../../../../common/enums/BridgeType";

const notFound = () => Response.json({ message: 'Not Found' }, {
    status: 404
});

const notFoundBridge = () => Response.json({ message: 'Not Found Bridge' }, {
    status: 404
});

export async function GET(_: Request, route: { params: { bridgeType: string, tokenId: string } }) {
    const bridgeType = route.params.bridgeType;
    const tokenId = route.params.tokenId;

    if (!bridgeType || 
        (bridgeType != "layerzero" && 
        bridgeType != "hyperlane") ) {
        return notFoundBridge();
    }

    var currNetworkType = bridgeType === "layerzero" ? BridgeType.LayerZero : BridgeType.Hyperlane;
    
    if (!tokenId || !Number.isInteger(parseInt(tokenId))) {
        return notFound();
    }

    const nft = await prisma.nft.findFirst({
        where: {
            tokenId: parseInt(route.params.tokenId),
            networkType: currNetworkType
        },
        include: {
            chain: true
        }
    });

    if (!nft) {
        return notFound();
    }

    return Response.json({
        name: nft.name,
        description: nft.description,
        tokenId: nft.tokenId,
        chainId: nft.chain.chainId,
        external_url: process.env.APP_URL,
        image: `${process.env.PINATA_GATEWAY}/ipfs/${nft.pinataImageHash}?pinataGatewayToken=${process.env.PINATA_GATEWAY_TOKEN}`,
    });
}