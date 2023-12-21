import { enableStaticRendering } from "mobx-react-lite";
import { makeAutoObservable } from "mobx";
import { ChainDto } from "../common/dto/ChainDto";
import ApiService from "../services/ApiService";

enableStaticRendering(typeof window === 'undefined');

class ChainStore {
    loading = false;
    chains: ChainDto[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    async getChains() {
        this.loading = true;

        try {
            this.chains = await ApiService.getChains();
        } finally {
            this.loading = false;
        }
    }

    getChainById(id: string) {
        return this.chains.find((chain) => chain.id === id);
    }
}

export default new ChainStore();