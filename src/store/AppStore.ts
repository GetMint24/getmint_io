import { makeAutoObservable } from "mobx";
import { enableStaticRendering } from "mobx-react-lite";
import { AccountDto } from "../common/dto/AccountDto";
import ApiService from "../services/ApiService";
import { CreateTweetDto } from "../common/dto/CreateTweetDto";
import NftStore from "./NftStore";

enableStaticRendering(typeof window === 'undefined');

class AppStore {
    account: AccountDto | null = null;
    walletConnected = false;
    accountDrawerOpened = false;
    metamaskWalletAddress: string | undefined;
    loading = false;

    constructor() {
        makeAutoObservable(this, undefined, { autoBind: true });
    }

    async fetchAccount() {
        this.account = await ApiService.getAccount();
    }

    setWalletConnected(isConnected: boolean) {
        this.walletConnected = isConnected;

        if (!isConnected) {
            this.metamaskWalletAddress = undefined;
        }
    }

    setWalletAddress(address: string) {
        this.metamaskWalletAddress = address;
    }

    openAccountDrawer() {
        this.accountDrawerOpened = true;
    }

    closeAccountDrawer() {
        this.accountDrawerOpened = false;
    }

    async disconnectTwitter() {
        this.loading = true;
        const { status } = await ApiService.disconnectTwitter();

        if (status === 'ok') {
            await this.fetchAccount();
        }

        this.loading = false;

        return status;
    }

    async createTweet(data: CreateTweetDto) {
        const { status } = await ApiService.createTweet(data);

        if (status === 'ok') {
            await NftStore.getNfts();
        }
    }
}

export default new AppStore();