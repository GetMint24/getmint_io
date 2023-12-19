import { Nft } from "@prisma/client";
import { makeAutoObservable } from "mobx";
import { enableStaticRendering } from "mobx-react-lite";
import prisma from "../utils/prismaClient";

enableStaticRendering(typeof window === 'undefined');

class NftStore {
    nfts: Nft[] = [];
    selectedNft: number | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    async getNfts() {
        this.nfts = await prisma.nft.findMany();
    }

    setNft(nft: number | null) {
        this.selectedNft = nft;
    }
}

export default new NftStore();