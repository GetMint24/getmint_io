import getPinataImageUrl from "../../../../utils/getPinataImageUrl";
import prisma from "../../../../utils/prismaClient";

export async function GET(request: Request, route: { params: { id: string } }) {
    const id = route.params.id;
    
    if (id) {
        const nft = await prisma.nft.findFirst({ where: { id } });

        if (nft) {
            return await fetch(getPinataImageUrl(nft.pinataImageHash));
        }
    }

    return Response.json(null);
}