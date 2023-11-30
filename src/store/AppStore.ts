import { makeAutoObservable } from "mobx";
import { enableStaticRendering } from "mobx-react-lite";
import { AccountDto } from "../common/dto/AccountDto";
import ApiService from "../services/ApiService";

enableStaticRendering(typeof window === 'undefined');

class AppStore {
    account: AccountDto | null = null;
    walletConnected = false;
    accountDrawerOpened = false;
    metamaskWalletAddress: string | undefined;

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
}

export default new AppStore();