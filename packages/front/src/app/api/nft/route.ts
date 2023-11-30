import prisma from "../../../utils/prismaClient";

export async function GET(_req: Request, { params }: { params: { nft: string } }) {
    const pinataImageHash = params.nft;

    const nft = await prisma.nft.findFirst({
        where: { pinataImageHash }
    });

    return Response.json(nft);
}