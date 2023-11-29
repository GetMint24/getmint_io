import { makeAutoObservable } from "mobx";
import { enableStaticRendering } from "mobx-react-lite";

enableStaticRendering(typeof window === 'undefined');

class AppStore {
    walletConnected = false;
    accountDrawerOpened = false;

    constructor() {
        makeAutoObservable(this, undefined, { autoBind: true });
    }

    setWalletConnected(isConnected: boolean) {
        this.walletConnected = isConnected;
    }

    openAccountDrawer() {
        this.accountDrawerOpened = true;
    }

    closeAccountDrawer() {
        this.accountDrawerOpened = false;
    }
}

export default new AppStore();