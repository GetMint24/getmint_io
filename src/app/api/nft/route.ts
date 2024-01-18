import prisma from "../../../utils/prismaClient";
import { BadRequest } from "../utils/responses";
import { sendNFTImage } from "./sendNFTImage";

export async function GET(_req: Request, { params }: { params: { nft: string } }) {
    const id = params?.nft;

    console.log(params);

    if (id) {
        const nft = await prisma.nft.findFirst({
            where: { id }
        });

        return Response.json(nft);
    }

    return new BadRequest('Pinata NFT Hash is required');
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