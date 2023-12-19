import { makeAutoObservable } from "mobx";
import { enableStaticRendering } from "mobx-react-lite";
import ApiService from "../services/ApiService";
import { NFTDto } from "../common/dto/NFTDto";

enableStaticRendering(typeof window === 'undefined');

class NftStore {
    loading: boolean = false;
    nfts: NFTDto[] = [];
    selectedNft: NFTDto | null = null;

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

    setNft(nft: NFTDto | null) {
        this.selectedNft = nft;
    }
}

export default new NftStore();