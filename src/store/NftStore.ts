import { makeAutoObservable } from "mobx";
import { enableStaticRendering } from "mobx-react-lite";
import ApiService from "../services/ApiService";
import { NFTDto } from "../common/dto/NFTDto";

enableStaticRendering(typeof window === 'undefined');

class NftStore {
    loading: boolean = false;
    nfts: NFTDto[] = [];
    selectedNftId: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    async getNfts() {
        this.loading = true;

        try {
            this.nfts = await ApiService.getCollection();
        } finally {
            this.loading = false;
        }
    }

    setNft(id: string | null) {
        this.selectedNftId = id;
    }

    selectedNft() {
        return this.nfts.find((nft) => nft.id === this.selectedNftId);
    }

    selectNftById(id: string) {
        return this.nfts.find((nft) => nft.id === id);
    }
    
    selectNftByHash(hash: string) {
        return this.nfts.find((nft) => nft.pinataImageHash === hash);
    }
}

export default new NftStore();