import { cache } from "react";
import prisma from "../../../utils/prismaClient";

export const getNft = cache(async (id: string) => {
    const nft = await prisma.nft.findFirst({ where: { id } });
    return nft;
});