import prisma from "../../../../../utils/prismaClient";

const notFound = () => Response.json({ message: 'Not Found' }, {
    status: 404
});

export async function GET(_: Request, route: { params: { tokenId: string } }) {
    const tokenId = route.params.tokenId;

    if (!tokenId || !Number.isInteger(parseInt(tokenId))) {
        return notFound();
    }

    const nft = await prisma.nft.findFirst({
        where: {
            tokenId: parseInt(route.params.tokenId)
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