import prisma from "../../../utils/prismaClient";

export async function GET() {
    const chains = await prisma.chain.findMany();
    return Response.json(chains);
}