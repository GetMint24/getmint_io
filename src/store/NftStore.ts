import { makeAutoObservable } from "mobx";
import { enableStaticRendering } from "mobx-react-lite";
import ApiService from "../services/ApiService";
import { NFTDto } from "../common/dto/NFTDto";
import { BridgeType } from "../common/enums/BridgeType";

enableStaticRendering(typeof window === 'undefined');

class NftStore {
    loading: boolean = false;
    nfts: NFTDto[] = [];
    selectedNftId: string | null = null;
    currentNetworkType = BridgeType.LayerZero;

    constructor() {
        makeAutoObservable(this);
    }

    async getNfts(withLoading = true) {
        if (withLoading) {
            this.loading = true;
        }

        try {
            this.nfts = await ApiService.getCollection(this.currentNetworkType);
        } finally {
            if (withLoading) {
                this.loading = false;
            }
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

    setSelectedNetworkType(type: BridgeType) {
        this.currentNetworkType = type;
    }
}

export default new NftStore();