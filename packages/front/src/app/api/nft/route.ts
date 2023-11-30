import prisma from "../../../utils/prismaClient";
import { BadRequest } from "../utils/responses";

export async function GET(_req: Request, { params }: { params: { nft: string } }) {
    const pinataImageHash = params?.nft;

    if (pinataImageHash) {
        const nft = await prisma.nft.findFirst({
            where: { pinataImageHash }
        });

        return Response.json(nft);
    }

    return new BadRequest('Pinata NFT Hash is required');
}